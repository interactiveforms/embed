import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';

export interface WidgetConfig {
  id: string;
  type: 'page-body' | 'float-button' | 'pop-up';
  timeout?: number;
  container?: string;
  iframeSrc?: string;
}

declare global {
  interface Window {
    ifLayer: WidgetConfig[];
  }
}

if (typeof window !== 'undefined') {
  window.ifLayer = window.ifLayer || [];
}

export class Embedder {
  private readonly widgets: Map<string, WidgetConfig> = new Map();
  private static instance: Embedder | null = null;
  private ifLayerProxy: WidgetConfig[] | null = null;

  /**
   * Checks if a popup should be shown based on cookie
   * @param popupId - Unique popup identifier
   * @returns True if popup should be shown, false otherwise
   * @private
   */
  private shouldShowPopup(popupId: string): boolean {
    const cookieName = `if-popup-${popupId}`;
    return Cookies.get(cookieName) === undefined;
  }

  /**
   * Marks a popup as shown by setting a cookie
   * @param popupId - Unique popup identifier
   * @private
   */
  private markPopupAsShown(popupId: string): void {
    const cookieName = `if-popup-${popupId}`;
    Cookies.set(cookieName, '1', { expires: 1 });
  }

  /**
   * Creates a new Embedder instance with optional initial widget configuration
   * @param config - Initial widget configuration (optional)
   */
  constructor(config?: WidgetConfig) {
    if (config) {
      this.addWidget(config);
    }

    this.processWidgetLayer();
    this.setupIfLayerWatcher();

    this.initializeDataAttributeWidgets();
  }

  /**
   * Gets or creates a singleton instance of Embedder
   * @returns Embedder instance
   */
  public static getInstance(): Embedder {
    if (!Embedder.instance) {
      Embedder.instance = new Embedder();
    }
    return Embedder.instance;
  }

  /**
   * Adds a new widget configuration to the embedder
   * @param config - Widget configuration object
   */
  public addWidget(config: WidgetConfig): void {
    if (config.type === 'page-body') {
      const widgetKey = `${config.id}-${config.type}-${nanoid()}`;
      this.widgets.set(widgetKey, config);
      this.initializeWidget(config);
    } else {
      const widgetKey = `${config.id}-${config.type}`;
      if (this.widgets.has(widgetKey)) {
        console.warn(`Widget with id ${config.id} and type ${config.type} already exists`);
        return;
      }
      this.widgets.set(widgetKey, config);
      this.initializeWidget(config);
    }
  }

  /**
   * Processes widgets from the global ifLayer array
   * @private
   */
  private processWidgetLayer(): void {
    if (typeof window !== 'undefined' && window.ifLayer && window.ifLayer.length > 0) {
      const widgetsToProcess = [...window.ifLayer];
      window.ifLayer = [];

      widgetsToProcess.forEach((config) => {
        this.addWidget(config);
      });
    }
  }

  /**
   * Sets up a watcher for changes to the global ifLayer array
   * @private
   */
  private setupIfLayerWatcher(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.ifLayerProxy = new Proxy(window.ifLayer, {
      set: (target, property, value) => {
        const result = Reflect.set(target, property, value);

        if (typeof property === 'number' && value && typeof value === 'object') {
          this.addWidget(value as WidgetConfig);
        }

        if (property === 'length' && Array.isArray(target)) {
          const newItems = target.filter(
            (_item, index) => index >= target.length - (value as number),
          );
          newItems.forEach((config) => {
            if (config && typeof config === 'object') {
              this.addWidget(config as WidgetConfig);
            }
          });
        }

        return result;
      },
    });

    window.ifLayer = this.ifLayerProxy;
  }

  /**
   * Initializes a specific widget based on its configuration
   * @param config - Widget configuration object
   * @private
   */
  private initializeWidget(config: WidgetConfig): void {
    switch (config.type) {
      case 'page-body':
        this.createPageBodyEmbed(config);
        break;
      case 'float-button':
        this.createFloatButtonEmbed(config);
        break;
      case 'pop-up':
        this.createPopUpEmbed(config);
        break;
    }
  }

  /**
   * Creates a page-body type embed by inserting an iframe into the specified container
   * @param config - Widget configuration object
   * @private
   */
  private createPageBodyEmbed(config: WidgetConfig): void {
    if (!config.container) {
      console.error(`Container is required for page-body widget ${config.id}`);
      return;
    }

    const containerElement = document.querySelectorAll(config.container);
    if (containerElement.length === 0) {
      console.error(`Container element not found for selector: ${config.container}`);
      return;
    }

    const iframe = this.createIframe(config.id, '614px', '300px', import.meta.env['VITE_FORM_URL']);
    iframe.setAttribute('data-widget-id', config.id);
    containerElement.forEach((element) => {
      element.appendChild(iframe);
    });
  }

  /**
   * Creates a floating button embed that appears as a fixed-position button
   * @param config - Widget configuration object
   * @private
   */
  private createFloatButtonEmbed(config: WidgetConfig): void {
    const button = document.createElement('button');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `;
    button.style.width = '54px';
    button.style.height = '54px';
    button.style.padding = '0';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = 'transparent';
    button.style.transition = 'all 0.3s ease';
    button.style.animation = 'ifScale 5s infinite';
    button.setAttribute('data-widget-id', config.id);

    const scaleStyle = document.createElement('style');
    scaleStyle.textContent = `
      @keyframes ifScale {
        0%, 80%, 100% {
          transform: scale(1);
        }
        20% {
          transform: scale(1.1);
        }
        40% {
          transform: scale(1.05);
        }
      }
    `;
    document.head.appendChild(scaleStyle);

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.animation = 'none';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.animation = 'ifScale 5s infinite';
    });

    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'fixed';
    iframeContainer.style.bottom = '90px';
    iframeContainer.style.right = '20px';
    iframeContainer.style.zIndex = '10001';
    iframeContainer.style.display = 'none';
    iframeContainer.style.background = 'white';
    iframeContainer.style.borderRadius = '8px';
    iframeContainer.style.padding = '12px';
    iframeContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    iframeContainer.setAttribute('data-widget-id', config.id);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#666';
    closeButton.style.lineHeight = '1';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.borderRadius = '50%';
    closeButton.style.transition = 'background-color 0.2s ease';

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = '#f0f0f0';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'transparent';
    });

    const iframe = this.createIframe(config.id, '614px', '300px', import.meta.env['VITE_FORM_URL']);

    iframeContainer.appendChild(closeButton);
    iframeContainer.appendChild(iframe);

    button.addEventListener('click', () => {
      iframeContainer.style.display = 'block';
      button.style.animation = 'none';
    });

    closeButton.addEventListener('click', () => {
      iframeContainer.style.display = 'none';
      button.style.animation = 'ifScale 5s infinite';
    });

    document.body.appendChild(button);
    document.body.appendChild(iframeContainer);
  }

  /**
   * Creates a popup modal embed that appears after a specified timeout
   * @param config - Widget configuration object
   * @private
   */
  private createPopUpEmbed(config: WidgetConfig): void {
    if (!this.shouldShowPopup(config.id)) {
      return;
    }

    const timeoutMs = config.timeout ? config.timeout * 1000 : 3000;

    setTimeout(() => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.background = 'rgba(0, 0, 0, 0.7)';
      modal.style.zIndex = '10002';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.animation = 'ifFadeIn 0.3s ease';
      modal.setAttribute('data-widget-id', config.id);

      const modalContent = document.createElement('div');
      modalContent.style.position = 'relative';
      modalContent.style.background = 'white';
      modalContent.style.borderRadius = '12px';
      modalContent.style.padding = '20px';
      modalContent.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
      modalContent.style.animation = 'ifSlideIn 0.3s ease';
      modalContent.style.maxWidth = '90vw';
      modalContent.style.maxHeight = '90vh';

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.fontSize = '28px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.color = '#666';
      closeButton.style.lineHeight = '1';
      closeButton.style.width = '30px';
      closeButton.style.height = '30px';
      closeButton.style.display = 'flex';
      closeButton.style.alignItems = 'center';
      closeButton.style.justifyContent = 'center';
      closeButton.style.borderRadius = '50%';
      closeButton.style.transition = 'background-color 0.2s ease';

      closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = '#f0f0f0';
      });

      closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = 'transparent';
      });

      const iframe = this.createIframe(
        config.id,
        '614px',
        '300px',
        import.meta.env['VITE_FORM_URL'],
      );

      modalContent.appendChild(closeButton);
      modalContent.appendChild(iframe);
      modal.appendChild(modalContent);

      const style = document.createElement('style');
      style.textContent = `
        @keyframes ifFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ifSlideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);

      closeButton.addEventListener('click', () => {
        modal.remove();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

      document.body.appendChild(modal);

      this.markPopupAsShown(config.id);
    }, timeoutMs);
  }

  /**
   * Creates an iframe element with the specified dimensions and source URL
   * @param ifId - The unique identifier for the interactive form
   * @param width - The width of the iframe (CSS units supported)
   * @param height - The height of the iframe (CSS units supported)
   * @param iframeSrc - The base URL for the iframe (optional)
   * @returns HTMLIFrameElement - The configured iframe element
   * @private
   */
  private createIframe(
    ifId: string,
    width: string,
    height: string,
    iframeSrc?: string,
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    const baseUrl = iframeSrc || 'https://if-form-staging.up.railway.app';
    iframe.src = `${baseUrl}/${ifId}`;
    iframe.width = width;
    iframe.height = height;
    iframe.style.maxWidth = '100%';
    iframe.style.width = width;
    iframe.style.height = height;
    iframe.style.border = 'none';
    return iframe;
  }

  /**
   * Initializes widgets from data attributes on the document body.
   * This method looks for elements with data-if-* attributes and removes them after initialization.
   * Works with any HTML elements including custom tags like <form-container>.
   * @private
   */
  private initializeDataAttributeWidgets(): void {
    const widgetsToInitialize = document.querySelectorAll('[data-if-id]');
    widgetsToInitialize.forEach((element) => {
      const widgetId = element.getAttribute('data-if-id');
      if (widgetId) {
        const widgetType = element.getAttribute('data-if-type');
        const widgetTimeout = element.getAttribute('data-if-timeout');
        const widgetIframeSrc = element.getAttribute('data-if-iframe-src');

        let config: WidgetConfig;
        if (widgetType === 'page-body') {
          config = {
            id: widgetId,
            type: 'page-body',
            container: `[data-if-id="${widgetId}"][data-if-type="page-body"]`,
            iframeSrc: widgetIframeSrc || undefined,
          };
        } else if (widgetType === 'float-button') {
          config = {
            id: widgetId,
            type: 'float-button',
            iframeSrc: widgetIframeSrc || undefined,
          };
        } else if (widgetType === 'pop-up') {
          config = {
            id: widgetId,
            type: 'pop-up',
            timeout: Number(widgetTimeout || 10),
            iframeSrc: widgetIframeSrc || undefined,
          };
        } else {
          console.warn(`Unknown widget type for data-if-id: ${widgetId}`);
          return;
        }

        this.addWidget(config);

        element.removeAttribute('data-if-id');
        element.removeAttribute('data-if-type');
        element.removeAttribute('data-if-timeout');
        element.removeAttribute('data-if-iframe-src');
      }
    });
  }
}

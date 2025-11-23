import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';

export interface WidgetConfig {
  id: string;
  type: 'page-body' | 'float-button' | 'pop-up';
  timeout?: number;
  container?: string;
}

declare global {
  interface Window {
    ifLayer: WidgetConfig[];
  }
}

if (typeof window !== 'undefined') {
  window.ifLayer = window.ifLayer || [];
}

const COLORS = {
  primary: '#312DF6',
  white: '#ffffff',
  black: '#000000',
  lightGray: '#e0e0e0',
};

export class Embedder {
  private readonly widgets: Map<string, WidgetConfig> = new Map();
  private ifLayerProxy: WidgetConfig[] | null = null;

  /**
   * Injects responsive CSS styles for float-button and pop-up widgets
   * @private
   */
  private injectResponsiveStyles(): void {
    if (document.getElementById('if-responsive-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'if-responsive-styles';
    style.textContent = `
      .if-float-button-container {
        width: 600px;
      }
      @media (max-width: 767px) {
        .if-float-button-container {
          width: 300px;
        }
      }
      .if-popup-container {
        width: 600px;
      }
      @media (max-width: 767px) {
        .if-popup-container {
          width: 300px;
        }
      }
    `;
    document.head.appendChild(style);
  }

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

    const containerElement: HTMLElement[] = Array.from(document.querySelectorAll(config.container));
    if (containerElement.length === 0) {
      console.error(`Container element not found for selector: ${config.container}`);
      return;
    }

    containerElement.forEach((element) => {
      element.style.width = '100%';
      element.style.textAlign = 'center';
      element.style.overflow = 'hidden';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';
      element.style.alignItems = 'center';

      const iframe = this.createIframe(config.id, element);
      iframe.setAttribute('data-widget-id', config.id);
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

    const logoButton = `
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `;

    const closeContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path d="M18 18L36 36M18 36L36 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;

    button.innerHTML = logoButton;
    button.style.width = '54px';
    button.style.height = '54px';
    button.style.padding = '0';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000';
    button.style.color = COLORS.white;
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = 'transparent';
    button.style.transition = 'all 0.3s ease';
    button.setAttribute('data-widget-id', config.id);

    let isOpen = false;

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });

    this.injectResponsiveStyles();

    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'if-float-button-container';
    iframeContainer.style.position = 'fixed';
    iframeContainer.style.bottom = '90px';
    iframeContainer.style.right = '20px';
    iframeContainer.style.maxWidth = 'calc(100% - 40px)';
    iframeContainer.style.zIndex = '10001';
    iframeContainer.style.display = 'none';
    iframeContainer.style.overflow = 'hidden';
    iframeContainer.style.borderRadius = '24px';
    iframeContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    iframeContainer.setAttribute('data-widget-id', config.id);

    const iframe = this.createIframe(config.id, iframeContainer);
    iframeContainer.appendChild(iframe);

    document.addEventListener('click', (e) => {
      if (button.contains(e.target as Node)) {
        if (!isOpen) {
          iframeContainer.style.display = 'block';
          button.innerHTML = closeContent;
          isOpen = true;
        } else {
          iframeContainer.style.display = 'none';
          button.innerHTML = logoButton;
          isOpen = false;
        }
      } else if (isOpen && !iframeContainer.contains(e.target as Node)) {
        iframeContainer.style.display = 'none';
        button.innerHTML = logoButton;
        isOpen = false;
      }
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

    const timeoutMs = config.timeout ? config.timeout * 1000 : 5000;

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
      modalContent.style.padding = '12px';
      modalContent.style.animation = 'ifSlideIn 0.3s ease';
      modalContent.style.maxWidth = '90vw';
      modalContent.style.maxHeight = '90vh';

      this.injectResponsiveStyles();

      const iframeContainer = document.createElement('div');
      iframeContainer.className = 'if-popup-container';
      iframeContainer.style.borderRadius = '24px';
      iframeContainer.style.overflow = 'hidden';
      iframeContainer.style.maxWidth = 'calc(90vw - 24px)';

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '0';
      closeButton.style.right = '0';
      closeButton.style.backgroundColor = COLORS.white;
      closeButton.style.border = `1px solid ${COLORS.lightGray}`;
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.color = COLORS.black;
      closeButton.style.lineHeight = '1';
      closeButton.style.width = '30px';
      closeButton.style.height = '30px';
      closeButton.style.display = 'flex';
      closeButton.style.alignItems = 'center';
      closeButton.style.justifyContent = 'center';
      closeButton.style.borderRadius = '50%';
      closeButton.style.transition = 'all 0.2s ease';
      closeButton.style.zIndex = '10003';

      closeButton.addEventListener('mouseenter', () => {
        closeButton.style.transform = 'scale(1.05)';
      });

      closeButton.addEventListener('mouseleave', () => {
        closeButton.style.transform = 'scale(1)';
      });

      const iframe = this.createIframe(config.id, iframeContainer);

      iframeContainer.appendChild(iframe);
      modalContent.appendChild(iframeContainer);
      modalContent.appendChild(closeButton);
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
   * Calculates responsive iframe dimensions based on parent container width
   * @param parentElement - The parent element to measure (optional, defaults to window)
   * @returns Object with width and height in pixels
   * @private
   */
  private getResponsiveIframeDimensions(parentElement?: HTMLElement | null): {
    width: string;
    height: string;
  } {
    const BREAKPOINT = 576;
    let parentWidth: number;

    if (parentElement) {
      parentWidth = parentElement.getBoundingClientRect().width;
    } else {
      parentWidth = window.innerWidth;
    }

    if (parentWidth <= BREAKPOINT) {
      return { width: '300px', height: '500px' };
    } else {
      return { width: '600px', height: '300px' };
    }
  }

  /**
   * Updates iframe dimensions based on parent container width
   * @param iframe - The iframe element to update
   * @param parentElement - The parent element to measure (optional, defaults to window)
   * @private
   */
  private updateIframeDimensions(
    iframe: HTMLIFrameElement,
    parentElement?: HTMLElement | null,
  ): void {
    const dimensions = this.getResponsiveIframeDimensions(parentElement);
    iframe.style.width = dimensions.width;
    iframe.style.height = dimensions.height;
  }

  /**
   * Creates an iframe element with responsive dimensions based on parent container
   * @param ifId - The unique identifier for the interactive form
   * @param parentElement - The parent element to measure for responsive sizing (optional)
   * @returns HTMLIFrameElement - The configured iframe element
   * @private
   */
  private createIframe(ifId: string, parentElement?: HTMLElement | null): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    const baseUrl = import.meta.env['VITE_FORM_URL'] || 'https://if-form-staging.up.railway.app';
    iframe.src = `${baseUrl}/${ifId}`;
    iframe.style.overflow = 'hidden';
    iframe.style.maxWidth = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';

    // Set initial dimensions
    this.updateIframeDimensions(iframe, parentElement);

    // Add resize listener for dynamic updates
    if (parentElement) {
      const resizeObserver = new ResizeObserver(() => {
        this.updateIframeDimensions(iframe, parentElement);
      });
      resizeObserver.observe(parentElement);
    } else {
      const handleResize = () => {
        this.updateIframeDimensions(iframe, parentElement);
      };
      window.addEventListener('resize', handleResize);
    }

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
        let config: WidgetConfig;
        if (widgetType === 'page-body') {
          config = {
            id: widgetId,
            type: 'page-body',
            container: `[data-if-id="${widgetId}"][data-if-type="page-body"]`,
          };
        } else if (widgetType === 'float-button') {
          config = {
            id: widgetId,
            type: 'float-button',
          };
        } else if (widgetType === 'pop-up') {
          config = {
            id: widgetId,
            type: 'pop-up',
            timeout: Number(widgetTimeout || 10),
          };
        } else {
          console.warn(`Unknown widget type for data-if-id: ${widgetId}`);
          return;
        }

        this.addWidget(config);

        element.removeAttribute('data-if-id');
        element.removeAttribute('data-if-type');
        element.removeAttribute('data-if-timeout');
      }
    });
  }
}

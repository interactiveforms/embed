export interface WidgetConfig {
  id: string;
  type: 'page-body' | 'float-button' | 'pop-up';
  timeout?: number;
  container?: string;
}

// Global widget array (similar to dataLayer in GTM)
declare global {
  interface Window {
    ifLayer: WidgetConfig[];
  }
}

// Initialize global widget array if it doesn't exist
if (typeof window !== 'undefined') {
  window.ifLayer = window.ifLayer || [];
}

export class Embedder {
  private readonly widgets: Map<string, WidgetConfig> = new Map();
  private static instance: Embedder | null = null;

  /**
   * Creates a new Embedder instance with optional initial widget configuration
   * @param config - Initial widget configuration (optional)
   */
  constructor(config?: WidgetConfig) {
    if (config) {
      this.addWidget(config);
    }

    // Process any widgets that were added to widgetLayer before initialization
    this.processWidgetLayer();
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
    const widgetKey = `${config.id}-${config.type}`;
    if (this.widgets.has(widgetKey)) {
      console.warn(`Widget with id ${config.id} and type ${config.type} already exists`);
      return;
    }

    this.widgets.set(widgetKey, config);
    this.initializeWidget(config);
  }

  /**
   * Removes a widget by its ID and type
   * @param id - Widget identifier
   * @param type - Widget type
   */
  public removeWidget(id: string, type: string): void {
    const widgetKey = `${id}-${type}`;
    const widget = this.widgets.get(widgetKey);
    if (widget) {
      this.destroyWidget(widget);
      this.widgets.delete(widgetKey);
    }
  }

  /**
   * Forces reinitialization of all widgets
   */
  public reinitialize(): void {
    this.widgets.forEach((widget) => {
      this.destroyWidget(widget);
    });
    this.widgets.forEach((widget) => {
      this.initializeWidget(widget);
    });
  }

  /**
   * Creates a page-body widget at the current script location without requiring a container div
   * This method can be called directly from a script tag to embed the widget inline
   * @param ifId - The unique identifier for the interactive form
   * @param width - The width of the iframe (default: '614px')
   * @param height - The height of the iframe (default: '300px')
   * @returns HTMLIFrameElement - The created iframe element
   */
  public static createInlineWidget(
    ifId: string,
    width: string = '614px',
    height: string = '300px',
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:4200/${ifId}`;
    iframe.width = width;
    iframe.height = height;
    iframe.style.cssText = `
      max-width: 100%;
      width: ${width};
      height: ${height};
      border: none;
    `;
    iframe.setAttribute('data-widget-id', ifId);

    const script = document.currentScript;
    if (script && script.parentNode) {
      script.parentNode.insertBefore(iframe, script);
    } else {
      document.body.appendChild(iframe);
    }

    return iframe;
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
   * Destroys a widget and removes its DOM elements
   * @param config - Widget configuration object
   * @private
   */
  private destroyWidget(config: WidgetConfig): void {
    const existingElements = document.querySelectorAll(`[data-widget-id="${config.id}"]`);
    existingElements.forEach((element) => {
      element.remove();
    });
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

    const containerElement = document.querySelector(config.container);
    if (!containerElement) {
      console.error(`Container element not found for selector: ${config.container}`);
      return;
    }

    const iframe = this.createIframe(config.id, '614px', '300px');
    iframe.setAttribute('data-widget-id', config.id);
    containerElement.appendChild(iframe);
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
    button.style.cssText = `
      width: 54px;
      height: 54px;
      padding: 0;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      color: white;
      border: none;
      cursor: pointer;
      background-color: transparent;
      transition: all 0.3s ease;
      animation: ifScale 5s infinite;
    `;
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
    iframeContainer.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      z-index: 10001;
      display: none;
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    iframeContainer.setAttribute('data-widget-id', config.id);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      line-height: 1;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
    `;

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = '#f0f0f0';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'transparent';
    });

    const iframe = this.createIframe(config.id, '614px', '300px');

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
    const timeoutMs = config.timeout ? config.timeout * 1000 : 3000;

    setTimeout(() => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10002;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
      `;
      modal.setAttribute('data-widget-id', config.id);

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        position: relative;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        max-width: 90vw;
        max-height: 90vh;
      `;

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #666;
        line-height: 1;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      `;

      closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = '#f0f0f0';
      });

      closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = 'transparent';
      });

      const iframe = this.createIframe(config.id, '614px', '300px');

      modalContent.appendChild(closeButton);
      modalContent.appendChild(iframe);
      modal.appendChild(modalContent);

      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
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
    }, timeoutMs);
  }

  /**
   * Creates an iframe element with the specified dimensions and source URL
   * @param ifId - The unique identifier for the interactive form
   * @param width - The width of the iframe (CSS units supported)
   * @param height - The height of the iframe (CSS units supported)
   * @returns HTMLIFrameElement - The configured iframe element
   * @private
   */
  private createIframe(ifId: string, width: string, height: string): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = `https://if-form-staging.up.railway.app/${ifId}`;
    // iframe.src = `http://localhost:4200/${ifId}`;
    iframe.width = width;
    iframe.height = height;
    iframe.style.cssText = `
      max-width: 100%;
      width: ${width};
      height: ${height};
      border: none;
    `;
    return iframe;
  }
}

/*
Usage Examples:

1. Constructor with config:
const embedder = new Embedder({
  id: 'my-form',
  type: 'page-body',
  container: '#form-container'
});

2. Multiple widgets with one instance:
const embedder = new Embedder();
embedder.addWidget({
  id: 'my-form',
  type: 'page-body',
  container: '#form-container'
});
embedder.addWidget({
  id: 'my-form',
  type: 'float-button'
});

3. Singleton pattern:
const embedder = Embedder.getInstance();
embedder.addWidget({...});

4. Remove widget:
embedder.removeWidget('my-form', 'float-button');

5. Widget layer (like dataLayer in GTM):
<script>
  window.ifLayer = window.ifLayer || [];
  window.ifLayer.push({
    id: 'bbxli1zfm0cvbmv9jkx6hlpk',
    type: 'page-body',
    container: '#form-container'
  });
  window.ifLayer.push({
    id: 'bbxli1zfm0cvbmv9jkx6hlpk',
    type: 'float-button'
  });
  window.ifLayer.push({
    id: 'bbxli1zfm0cvbmv9jkx6hlpk',
    type: 'pop-up',
    timeout: 5
  });
</script>

6. Inline widget without container:
<script>
  Embedder.createInlineWidget('my-form', '800px', '400px');
</script>
*/

export enum IfType {
  PageBody = 'page-body',
  FloatButton = 'float-button',
  PopUp = 'pop-up',
}

export enum IfOrientation {
  Vertical = 'vertical',
  Square = 'square',
}

const DEFAULT_FRAME_HOST = 'https://if-form-staging.up.railway.app';

export class Embedder {
  private readonly containers: HTMLElement[] = [];

  constructor() {
    this.init();
  }

  /**
   * Принудительная реинициализация всех элементов
   */
  public reinitialize(): void {
    // Очищаем атрибуты инициализации
    this.clearInitializationFlags();
    // Очищаем массив контейнеров
    this.containers.length = 0;
    // Запускаем инициализацию заново
    this.init();
  }

  /**
   * Очищает флаги инициализации со всех элементов
   */
  private clearInitializationFlags(): void {
    const initializedElements = document.querySelectorAll('div[data-if-initialized]');
    initializedElements.forEach((element) => {
      element.removeAttribute('data-if-initialized');
    });
  }

  /**
   * Инициализирует конкретный элемент
   * @param element - HTML элемент для инициализации
   */
  public initializeElement(element: HTMLElement): void {
    if (!element.hasAttribute('data-if-id') || element.hasAttribute('data-if-initialized')) {
      return;
    }

    const formId = element.getAttribute('data-if-id');
    const type = element.getAttribute('data-if-type') as IfType;
    const timeout = element.getAttribute('data-if-timeout');
    const orientation =
      (element.getAttribute('data-if-orientation') as IfOrientation) || IfOrientation.Vertical;
    const scriptHost = element.getAttribute('data-if-script') || DEFAULT_FRAME_HOST;

    if (!formId) return;

    // Помечаем элемент как инициализированный
    element.setAttribute('data-if-initialized', 'true');

    switch (type) {
      case IfType.PageBody:
        this.createPageBodyEmbed(formId, element, orientation, scriptHost);
        break;
      case IfType.FloatButton:
        this.createFloatButtonEmbed(formId, orientation, scriptHost);
        break;
      case IfType.PopUp:
        this.createPopUpEmbed(formId, timeout, orientation, scriptHost);
        break;
    }
  }

  private init(): void {
    this.findContainers();
    this.processContainers();
  }

  private findContainers(): void {
    const containers = document.querySelectorAll('div[data-if-id]:not([data-if-initialized])');
    containers.forEach((container) => {
      if (container instanceof HTMLElement) {
        this.containers.push(container);
      }
    });
  }

  private processContainers(): void {
    this.containers.forEach((container) => {
      const formId = container.getAttribute('data-if-id');
      const type = container.getAttribute('data-if-type') as IfType;
      const timeout = container.getAttribute('data-if-timeout');
      const orientation =
        (container.getAttribute('data-if-orientation') as IfOrientation) || IfOrientation.Vertical;
      const scriptHost = container.getAttribute('data-if-script') || DEFAULT_FRAME_HOST;

      if (!formId) return;

      // Помечаем элемент как инициализированный
      container.setAttribute('data-if-initialized', 'true');

      switch (type) {
        case IfType.PageBody:
          this.createPageBodyEmbed(formId, container, orientation, scriptHost);
          break;
        case IfType.FloatButton:
          this.createFloatButtonEmbed(formId, orientation, scriptHost);
          break;
        case IfType.PopUp:
          this.createPopUpEmbed(formId, timeout, orientation, scriptHost);
          break;
      }
    });
  }

  private createPageBodyEmbed(
    formId: string,
    container: HTMLElement,
    orientation: IfOrientation = IfOrientation.Vertical,
    scriptHost: string = DEFAULT_FRAME_HOST,
  ): void {
    const { width, height } = this.getDimensionsByOrientation(orientation);
    const wrapper = document.createElement('div');
    wrapper.style.width = width;
    const iframe = this.createIframe(formId, height, scriptHost);
    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
  }

  private createFloatButtonEmbed(
    formId: string,
    orientation: IfOrientation = IfOrientation.Square,
    scriptHost: string = DEFAULT_FRAME_HOST,
  ): void {
    // Создаем кнопку
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
      animation: bounce 5s infinite;
    `;

    // Добавляем CSS анимацию bounce
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
      @keyframes bounce {
        0%, 80%, 100% {
          transform: translateY(0);
        }
        20% {
          transform: translateY(-8px);
        }
        40% {
          transform: translateY(-4px);
        }
      }
    `;
    document.head.appendChild(bounceStyle);

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.animation = 'none';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.animation = 'bounce 5s infinite';
    });

    // Создаем контейнер для iframe
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 10001;
      display: none;
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
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

    const { width, height } = this.getDimensionsByOrientation(orientation);
    const wrapper = document.createElement('div');
    wrapper.style.width = width;
    const iframe = this.createIframe(formId, height, scriptHost);
    wrapper.appendChild(closeButton);
    wrapper.appendChild(iframe);

    iframeContainer.appendChild(wrapper);

    // Обработчики событий
    button.addEventListener('click', () => {
      iframeContainer.style.display = 'block';
      // Отключаем анимацию когда окно открыто
      button.style.animation = 'none';
    });

    closeButton.addEventListener('click', () => {
      iframeContainer.style.display = 'none';
      // Включаем анимацию обратно когда окно закрыто
      button.style.animation = 'bounce 5s infinite';
    });

    document.body.appendChild(button);
    document.body.appendChild(iframeContainer);
  }

  private createPopUpEmbed(
    formId: string,
    timeout: string | null,
    orientation: IfOrientation = IfOrientation.Vertical,
    scriptHost: string = DEFAULT_FRAME_HOST,
  ): void {
    const timeoutMs = timeout ? parseInt(timeout) * 1000 : 3000;

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
        top: 10px;
        right: 15px;
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

      const { width, height } = this.getDimensionsByOrientation(orientation);
      const wrapper = document.createElement('div');
      wrapper.style.width = width;
      const iframe = this.createIframe(formId, height, scriptHost);
      wrapper.appendChild(closeButton);
      wrapper.appendChild(iframe);
      modalContent.appendChild(wrapper);

      // Добавляем CSS анимации
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

      // Обработчики событий
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

  private createIframe(
    formId: string,
    height: string,
    scriptHost: string = DEFAULT_FRAME_HOST,
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = `${scriptHost}/${formId}`;
    iframe.width = '100%';
    iframe.height = height;
    iframe.style.cssText = `
      width: 100%;
      height: ${height};
      border: none;
      display: block;
    `;
    return iframe;
  }

  private getDimensionsByOrientation(orientation: IfOrientation): {
    width: string;
    height: string;
  } {
    switch (orientation) {
      case IfOrientation.Square:
        return { width: '341px', height: '300px' };
      case IfOrientation.Vertical:
      default:
        return { width: '614px', height: '300px' };
    }
  }
}

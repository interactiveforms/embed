export declare enum IfType {
    PageBody = "page-body",
    FloatButton = "float-button",
    PopUp = "pop-up"
}
export declare enum IfOrientation {
    Vertical = "vertical",
    Square = "square"
}
export declare class Embedder {
    private readonly containers;
    constructor();
    /**
     * Принудительная реинициализация всех элементов
     */
    reinitialize(): void;
    /**
     * Очищает флаги инициализации со всех элементов
     */
    private clearInitializationFlags;
    /**
     * Инициализирует конкретный элемент
     * @param element - HTML элемент для инициализации
     */
    initializeElement(element: HTMLElement): void;
    private init;
    private findContainers;
    private processContainers;
    private createPageBodyEmbed;
    private createFloatButtonEmbed;
    private createPopUpEmbed;
    private createIframe;
    private getDimensionsByOrientation;
}

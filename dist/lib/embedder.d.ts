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
export declare class Embedder {
    private readonly widgets;
    private static instance;
    /**
     * Creates a new Embedder instance with optional initial widget configuration
     * @param config - Initial widget configuration (optional)
     */
    constructor(config?: WidgetConfig);
    /**
     * Gets or creates a singleton instance of Embedder
     * @returns Embedder instance
     */
    static getInstance(): Embedder;
    /**
     * Adds a new widget configuration to the embedder
     * @param config - Widget configuration object
     */
    addWidget(config: WidgetConfig): void;
    /**
     * Removes a widget by its ID and type
     * @param id - Widget identifier
     * @param type - Widget type
     */
    removeWidget(id: string, type: string): void;
    /**
     * Forces reinitialization of all widgets
     */
    reinitialize(): void;
    /**
     * Creates a page-body widget at the current script location without requiring a container div
     * This method can be called directly from a script tag to embed the widget inline
     * @param ifId - The unique identifier for the interactive form
     * @param width - The width of the iframe (default: '614px')
     * @param height - The height of the iframe (default: '300px')
     * @returns HTMLIFrameElement - The created iframe element
     */
    static createInlineWidget(ifId: string, width?: string, height?: string): HTMLIFrameElement;
    /**
     * Processes widgets from the global ifLayer array
     * @private
     */
    private processWidgetLayer;
    /**
     * Initializes a specific widget based on its configuration
     * @param config - Widget configuration object
     * @private
     */
    private initializeWidget;
    /**
     * Destroys a widget and removes its DOM elements
     * @param config - Widget configuration object
     * @private
     */
    private destroyWidget;
    /**
     * Creates a page-body type embed by inserting an iframe into the specified container
     * @param config - Widget configuration object
     * @private
     */
    private createPageBodyEmbed;
    /**
     * Creates a floating button embed that appears as a fixed-position button
     * @param config - Widget configuration object
     * @private
     */
    private createFloatButtonEmbed;
    /**
     * Creates a popup modal embed that appears after a specified timeout
     * @param config - Widget configuration object
     * @private
     */
    private createPopUpEmbed;
    /**
     * Creates an iframe element with the specified dimensions and source URL
     * @param ifId - The unique identifier for the interactive form
     * @param width - The width of the iframe (CSS units supported)
     * @param height - The height of the iframe (CSS units supported)
     * @returns HTMLIFrameElement - The configured iframe element
     * @private
     */
    private createIframe;
    /**
     * Initializes widgets from data attributes on the document body.
     * This method looks for elements with data-if-* attributes and removes them after initialization.
     * Works with any HTML elements including custom tags like <form-container>.
     * @private
     */
    private initializeDataAttributeWidgets;
}

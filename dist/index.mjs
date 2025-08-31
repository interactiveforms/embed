const c = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let p = (r = 21) => {
  let s = "", i = crypto.getRandomValues(new Uint8Array(r |= 0));
  for (; r--; )
    s += c[i[r] & 63];
  return s;
};
typeof window < "u" && (window.ifLayer = window.ifLayer || []);
const a = class a {
  /**
   * Creates a new Embedder instance with optional initial widget configuration
   * @param config - Initial widget configuration (optional)
   */
  constructor(s) {
    this.widgets = /* @__PURE__ */ new Map(), s && this.addWidget(s), this.processWidgetLayer(), this.initializeDataAttributeWidgets();
  }
  /**
   * Gets or creates a singleton instance of Embedder
   * @returns Embedder instance
   */
  static getInstance() {
    return a.instance || (a.instance = new a()), a.instance;
  }
  /**
   * Adds a new widget configuration to the embedder
   * @param config - Widget configuration object
   */
  addWidget(s) {
    if (s.type === "page-body") {
      const i = `${s.id}-${s.type}-${p()}`;
      this.widgets.set(i, s), this.initializeWidget(s);
    } else {
      const i = `${s.id}-${s.type}`;
      if (this.widgets.has(i)) {
        console.warn(`Widget with id ${s.id} and type ${s.type} already exists`);
        return;
      }
      this.widgets.set(i, s), this.initializeWidget(s);
    }
  }
  /**
   * Removes a widget by its ID and type
   * @param id - Widget identifier
   * @param type - Widget type
   */
  removeWidget(s, i) {
    if (i === "page-body") {
      const n = [];
      this.widgets.forEach((e, t) => {
        e.id === s && e.type === i && n.push(t);
      }), n.forEach((e) => {
        const t = this.widgets.get(e);
        t && (this.destroyWidget(t), this.widgets.delete(e));
      });
    } else {
      const n = `${s}-${i}`, e = this.widgets.get(n);
      e && (this.destroyWidget(e), this.widgets.delete(n));
    }
  }
  /**
   * Forces reinitialization of all widgets
   */
  reinitialize() {
    this.widgets.forEach((s) => {
      this.destroyWidget(s);
    }), this.widgets.forEach((s) => {
      this.initializeWidget(s);
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
  static createInlineWidget(s, i = "614px", n = "300px") {
    const e = document.createElement("iframe");
    e.src = `http://localhost:4200/${s}`, e.width = i, e.height = n, e.style.maxWidth = "100%", e.style.width = i, e.style.height = n, e.style.border = "none", e.setAttribute("data-widget-id", s);
    const t = document.currentScript;
    return t && t.parentNode ? t.parentNode.insertBefore(e, t) : document.body.appendChild(e), e;
  }
  /**
   * Processes widgets from the global ifLayer array
   * @private
   */
  processWidgetLayer() {
    if (typeof window < "u" && window.ifLayer && window.ifLayer.length > 0) {
      const s = [...window.ifLayer];
      window.ifLayer = [], s.forEach((i) => {
        this.addWidget(i);
      });
    }
  }
  /**
   * Initializes a specific widget based on its configuration
   * @param config - Widget configuration object
   * @private
   */
  initializeWidget(s) {
    switch (s.type) {
      case "page-body":
        this.createPageBodyEmbed(s);
        break;
      case "float-button":
        this.createFloatButtonEmbed(s);
        break;
      case "pop-up":
        this.createPopUpEmbed(s);
        break;
    }
  }
  /**
   * Destroys a widget and removes its DOM elements
   * @param config - Widget configuration object
   * @private
   */
  destroyWidget(s) {
    document.querySelectorAll(`[data-widget-id="${s.id}"]`).forEach((n) => {
      n.remove();
    });
  }
  /**
   * Creates a page-body type embed by inserting an iframe into the specified container
   * @param config - Widget configuration object
   * @private
   */
  createPageBodyEmbed(s) {
    if (!s.container) {
      console.error(`Container is required for page-body widget ${s.id}`);
      return;
    }
    const i = document.querySelectorAll(s.container);
    if (i.length === 0) {
      console.error(`Container element not found for selector: ${s.container}`);
      return;
    }
    const n = this.createIframe(s.id, "614px", "300px");
    n.setAttribute("data-widget-id", s.id), i.forEach((e) => {
      e.appendChild(n);
    });
  }
  /**
   * Creates a floating button embed that appears as a fixed-position button
   * @param config - Widget configuration object
   * @private
   */
  createFloatButtonEmbed(s) {
    const i = document.createElement("button");
    i.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `, i.style.width = "54px", i.style.height = "54px", i.style.padding = "0", i.style.position = "fixed", i.style.bottom = "20px", i.style.right = "20px", i.style.zIndex = "10000", i.style.color = "white", i.style.border = "none", i.style.cursor = "pointer", i.style.backgroundColor = "transparent", i.style.transition = "all 0.3s ease", i.style.animation = "ifScale 5s infinite", i.setAttribute("data-widget-id", s.id);
    const n = document.createElement("style");
    n.textContent = `
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
    `, document.head.appendChild(n), i.addEventListener("mouseenter", () => {
      i.style.transform = "translateY(-2px)", i.style.animation = "none";
    }), i.addEventListener("mouseleave", () => {
      i.style.transform = "scale(1)", i.style.animation = "ifScale 5s infinite";
    });
    const e = document.createElement("div");
    e.style.position = "fixed", e.style.bottom = "90px", e.style.right = "20px", e.style.zIndex = "10001", e.style.display = "none", e.style.background = "white", e.style.borderRadius = "8px", e.style.padding = "12px", e.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)", e.setAttribute("data-widget-id", s.id);
    const t = document.createElement("button");
    t.innerHTML = "&times;", t.style.position = "absolute", t.style.top = "5px", t.style.right = "5px", t.style.background = "none", t.style.border = "none", t.style.fontSize = "24px", t.style.cursor = "pointer", t.style.color = "#666", t.style.lineHeight = "1", t.style.width = "30px", t.style.height = "30px", t.style.display = "flex", t.style.alignItems = "center", t.style.justifyContent = "center", t.style.borderRadius = "50%", t.style.transition = "background-color 0.2s ease", t.addEventListener("mouseenter", () => {
      t.style.background = "#f0f0f0";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent";
    });
    const d = this.createIframe(s.id, "614px", "300px");
    e.appendChild(t), e.appendChild(d), i.addEventListener("click", () => {
      e.style.display = "block", i.style.animation = "none";
    }), t.addEventListener("click", () => {
      e.style.display = "none", i.style.animation = "ifScale 5s infinite";
    }), document.body.appendChild(i), document.body.appendChild(e);
  }
  /**
   * Creates a popup modal embed that appears after a specified timeout
   * @param config - Widget configuration object
   * @private
   */
  createPopUpEmbed(s) {
    const i = s.timeout ? s.timeout * 1e3 : 3e3;
    setTimeout(() => {
      const n = document.createElement("div");
      n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100%", n.style.height = "100%", n.style.background = "rgba(0, 0, 0, 0.7)", n.style.zIndex = "10002", n.style.display = "flex", n.style.justifyContent = "center", n.style.alignItems = "center", n.style.animation = "fadeIn 0.3s ease", n.setAttribute("data-widget-id", s.id);
      const e = document.createElement("div");
      e.style.position = "relative", e.style.background = "white", e.style.borderRadius = "12px", e.style.padding = "20px", e.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.4)", e.style.animation = "slideIn 0.3s ease", e.style.maxWidth = "90vw", e.style.maxHeight = "90vh";
      const t = document.createElement("button");
      t.innerHTML = "&times;", t.style.position = "absolute", t.style.top = "5px", t.style.right = "5px", t.style.background = "none", t.style.border = "none", t.style.fontSize = "28px", t.style.cursor = "pointer", t.style.color = "#666", t.style.lineHeight = "1", t.style.width = "30px", t.style.height = "30px", t.style.display = "flex", t.style.alignItems = "center", t.style.justifyContent = "center", t.style.borderRadius = "50%", t.style.transition = "background-color 0.2s ease", t.addEventListener("mouseenter", () => {
        t.style.background = "#f0f0f0";
      }), t.addEventListener("mouseleave", () => {
        t.style.background = "transparent";
      });
      const d = this.createIframe(s.id, "614px", "300px");
      e.appendChild(t), e.appendChild(d), n.appendChild(e);
      const l = document.createElement("style");
      l.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `, document.head.appendChild(l), t.addEventListener("click", () => {
        n.remove();
      }), n.addEventListener("click", (y) => {
        y.target === n && n.remove();
      }), document.body.appendChild(n);
    }, i);
  }
  /**
   * Creates an iframe element with the specified dimensions and source URL
   * @param ifId - The unique identifier for the interactive form
   * @param width - The width of the iframe (CSS units supported)
   * @param height - The height of the iframe (CSS units supported)
   * @returns HTMLIFrameElement - The configured iframe element
   * @private
   */
  createIframe(s, i, n) {
    const e = document.createElement("iframe");
    return e.src = `https://if-form-staging.up.railway.app/${s}`, e.width = i, e.height = n, e.style.maxWidth = "100%", e.style.width = i, e.style.height = n, e.style.border = "none", e;
  }
  /**
   * Initializes widgets from data attributes on the document body.
   * This method looks for elements with data-if-* attributes and removes them after initialization.
   * Works with any HTML elements including custom tags like <form-container>.
   * @private
   */
  initializeDataAttributeWidgets() {
    document.querySelectorAll("[data-if-id]").forEach((i) => {
      const n = i.getAttribute("data-if-id");
      if (n) {
        const e = i.getAttribute("data-if-type"), t = i.getAttribute("data-if-timeout");
        let d;
        if (e === "page-body")
          d = {
            id: n,
            type: "page-body",
            container: `[data-if-id="${n}"][data-if-type="page-body"]`
          };
        else if (e === "float-button")
          d = {
            id: n,
            type: "float-button"
          };
        else if (e === "pop-up")
          d = {
            id: n,
            type: "pop-up",
            timeout: Number(t || 10)
          };
        else {
          console.warn(`Unknown widget type for data-if-id: ${n}`);
          return;
        }
        this.addWidget(d), i.removeAttribute("data-if-id"), i.removeAttribute("data-if-type"), i.removeAttribute("data-if-timeout");
      }
    });
  }
};
a.instance = null;
let o = a;
(function() {
  typeof window < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    new o();
  }) : new o());
})();
export {
  o as Embedder
};

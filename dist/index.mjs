const l = "https://if-form-staging.up.railway.app";
class u {
  constructor() {
    this.containers = [], this.init();
  }
  /**
   * Принудительная реинициализация всех элементов
   */
  reinitialize() {
    this.clearInitializationFlags(), this.containers.length = 0, this.init();
  }
  /**
   * Очищает флаги инициализации со всех элементов
   */
  clearInitializationFlags() {
    document.querySelectorAll("div[data-if-initialized]").forEach((i) => {
      i.removeAttribute("data-if-initialized");
    });
  }
  /**
   * Инициализирует конкретный элемент
   * @param element - HTML элемент для инициализации
   */
  initializeElement(t) {
    if (!t.hasAttribute("data-if-id") || t.hasAttribute("data-if-initialized"))
      return;
    const i = t.getAttribute("data-if-id"), r = t.getAttribute("data-if-type"), e = t.getAttribute("data-if-timeout"), o = t.getAttribute("data-if-orientation") || "vertical", n = t.getAttribute("data-if-script") || l;
    if (i)
      switch (t.setAttribute("data-if-initialized", "true"), r) {
        case "page-body":
          this.createPageBodyEmbed(i, t, o, n);
          break;
        case "float-button":
          this.createFloatButtonEmbed(i, o, n);
          break;
        case "pop-up":
          this.createPopUpEmbed(i, e, o, n);
          break;
      }
  }
  init() {
    this.findContainers(), this.processContainers();
  }
  findContainers() {
    document.querySelectorAll("div[data-if-id]:not([data-if-initialized])").forEach((i) => {
      i instanceof HTMLElement && this.containers.push(i);
    });
  }
  processContainers() {
    this.containers.forEach((t) => {
      const i = t.getAttribute("data-if-id"), r = t.getAttribute("data-if-type"), e = t.getAttribute("data-if-timeout"), o = t.getAttribute("data-if-orientation") || "vertical", n = t.getAttribute("data-if-script") || l;
      if (i)
        switch (t.setAttribute("data-if-initialized", "true"), r) {
          case "page-body":
            this.createPageBodyEmbed(i, t, o, n);
            break;
          case "float-button":
            this.createFloatButtonEmbed(i, o, n);
            break;
          case "pop-up":
            this.createPopUpEmbed(i, e, o, n);
            break;
        }
    });
  }
  createPageBodyEmbed(t, i, r = "vertical", e = l) {
    const { width: o, height: n } = this.getDimensionsByOrientation(r), a = document.createElement("div");
    a.style.width = o, a.style.maxWidth = "100%";
    const s = this.createIframe(t, n, e);
    a.appendChild(s), i.appendChild(a);
  }
  createFloatButtonEmbed(t, i = "square", r = l) {
    const e = document.createElement("button");
    e.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `, e.style.cssText = `
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
    const o = document.createElement("style");
    o.textContent = `
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
    `, document.head.appendChild(o), e.addEventListener("mouseenter", () => {
      e.style.transform = "translateY(-2px)", e.style.animation = "none";
    }), e.addEventListener("mouseleave", () => {
      e.style.transform = "translateY(0)", e.style.animation = "bounce 5s infinite";
    });
    const n = document.createElement("div");
    n.style.cssText = `
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
    const a = document.createElement("button");
    a.innerHTML = "&times;", a.style.cssText = `
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
    `, a.addEventListener("mouseenter", () => {
      a.style.background = "#f0f0f0";
    }), a.addEventListener("mouseleave", () => {
      a.style.background = "transparent";
    });
    const { width: s, height: p } = this.getDimensionsByOrientation(i), d = document.createElement("div");
    d.style.width = s, d.style.maxWidth = "100%";
    const c = this.createIframe(t, p, r);
    d.appendChild(a), d.appendChild(c), n.appendChild(d), e.addEventListener("click", () => {
      n.style.display = "block", e.style.animation = "none";
    }), a.addEventListener("click", () => {
      n.style.display = "none", e.style.animation = "bounce 5s infinite";
    }), document.body.appendChild(e), document.body.appendChild(n);
  }
  createPopUpEmbed(t, i, r = "vertical", e = l) {
    const o = i ? parseInt(i) * 1e3 : 3e3;
    setTimeout(() => {
      const n = document.createElement("div");
      n.style.cssText = `
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
      const a = document.createElement("div");
      a.style.cssText = `
        position: relative;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        max-width: 90vw;
        max-height: 90vh;
      `;
      const s = document.createElement("button");
      s.innerHTML = "&times;", s.style.cssText = `
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
      `, s.addEventListener("mouseenter", () => {
        s.style.background = "#f0f0f0";
      }), s.addEventListener("mouseleave", () => {
        s.style.background = "transparent";
      });
      const { width: p, height: d } = this.getDimensionsByOrientation(r), c = document.createElement("div");
      c.style.width = p, c.style.maxWidth = "100%";
      const m = this.createIframe(t, d, e);
      c.appendChild(s), c.appendChild(m), a.appendChild(c);
      const h = document.createElement("style");
      h.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `, document.head.appendChild(h), s.addEventListener("click", () => {
        n.remove();
      }), n.addEventListener("click", (f) => {
        f.target === n && n.remove();
      }), document.body.appendChild(n);
    }, o);
  }
  createIframe(t, i, r = l) {
    const e = document.createElement("iframe");
    return e.src = `${r}/${t}`, e.width = "100%", e.height = i, e.style.cssText = `
      width: 100%;
      height: ${i};
      border: none;
      display: block;
    `, e;
  }
  getDimensionsByOrientation(t) {
    switch (t) {
      case "square":
        return { width: "341px", height: "314px" };
      case "vertical":
      default:
        return { width: "614px", height: "314px" };
    }
  }
}
(function() {
  typeof window < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    new u();
  }) : new u());
})();
export {
  u as Embedder
};

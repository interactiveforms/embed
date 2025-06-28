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
    const i = t.getAttribute("data-if-id"), o = t.getAttribute("data-if-type"), n = t.getAttribute("data-if-timeout"), s = t.getAttribute("data-if-orientation") || "vertical", e = t.getAttribute("data-if-script") || l;
    if (i)
      switch (t.setAttribute("data-if-initialized", "true"), o) {
        case "page-body":
          this.createPageBodyEmbed(i, t, s, e);
          break;
        case "float-button":
          this.createFloatButtonEmbed(i, s, e);
          break;
        case "pop-up":
          this.createPopUpEmbed(i, n, s, e);
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
      const i = t.getAttribute("data-if-id"), o = t.getAttribute("data-if-type"), n = t.getAttribute("data-if-timeout"), s = t.getAttribute("data-if-orientation") ? t.getAttribute("data-if-orientation") : void 0, e = t.getAttribute("data-if-script") || l;
      if (i)
        switch (t.setAttribute("data-if-initialized", "true"), o) {
          case "page-body":
            this.createPageBodyEmbed(i, t, s, e);
            break;
          case "float-button":
            this.createFloatButtonEmbed(i, s, e);
            break;
          case "pop-up":
            this.createPopUpEmbed(i, n, s, e);
            break;
        }
    });
  }
  createPageBodyEmbed(t, i, o = "vertical", n = l) {
    const { width: s, height: e } = this.getDimensionsByOrientation(o), a = document.createElement("div");
    a.style.width = s, a.style.maxWidth = "100%", a.style.height = e;
    const r = this.createIframe(t, n);
    a.appendChild(r), i.appendChild(a);
  }
  createFloatButtonEmbed(t, i = "square", o = l) {
    const n = document.createElement("button");
    n.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `, n.style.cssText = `
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
    const s = document.createElement("style");
    s.textContent = `
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
    `, document.head.appendChild(s), n.addEventListener("mouseenter", () => {
      n.style.transform = "translateY(-2px)", n.style.animation = "none";
    }), n.addEventListener("mouseleave", () => {
      n.style.transform = "translateY(0)", n.style.animation = "bounce 5s infinite";
    });
    const e = document.createElement("div");
    e.style.cssText = `
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
    const { width: r, height: h } = this.getDimensionsByOrientation(i), d = document.createElement("div");
    d.style.width = r, d.style.maxWidth = "100%", d.style.height = h;
    const c = this.createIframe(t, o);
    d.appendChild(a), d.appendChild(c), e.appendChild(d), n.addEventListener("click", () => {
      e.style.display === "block" ? (e.style.display = "none", n.style.animation = "bounce 5s infinite") : (e.style.display = "block", n.style.animation = "none");
    }), a.addEventListener("click", () => {
      e.style.display = "none", n.style.animation = "bounce 5s infinite";
    }), document.body.appendChild(n), document.body.appendChild(e);
  }
  createPopUpEmbed(t, i, o = "vertical", n = l) {
    const s = i ? parseInt(i) * 1e3 : 3e3;
    setTimeout(() => {
      const e = document.createElement("div");
      e.style.cssText = `
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
      const r = document.createElement("button");
      r.innerHTML = "&times;", r.style.cssText = `
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
      `, r.addEventListener("mouseenter", () => {
        r.style.background = "#f0f0f0";
      }), r.addEventListener("mouseleave", () => {
        r.style.background = "transparent";
      });
      const { width: h, height: d } = this.getDimensionsByOrientation(o), c = document.createElement("div");
      c.style.width = h, c.style.maxWidth = "100%", c.style.height = d;
      const m = this.createIframe(t, n);
      c.appendChild(r), c.appendChild(m), a.appendChild(c);
      const p = document.createElement("style");
      p.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `, document.head.appendChild(p), r.addEventListener("click", () => {
        e.remove();
      }), e.addEventListener("click", (f) => {
        f.target === e && e.remove();
      }), e.appendChild(a), document.body.appendChild(e);
    }, s);
  }
  createIframe(t, i = l) {
    const o = document.createElement("iframe");
    return o.src = `${i}/${t}`, o.width = "100%", o.height = "100%", o.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    `, o;
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

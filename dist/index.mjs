const u = "https://if-form-staging.up.railway.app";
class l {
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
    document.querySelectorAll("div[data-if-initialized]").forEach((e) => {
      e.removeAttribute("data-if-initialized");
    });
  }
  /**
   * Инициализирует конкретный элемент
   * @param element - HTML элемент для инициализации
   */
  initializeElement(t) {
    if (!t.hasAttribute("data-if-id") || t.hasAttribute("data-if-initialized"))
      return;
    const e = t.getAttribute("data-if-id"), n = t.getAttribute("data-if-type"), a = t.getAttribute("data-if-timeout"), i = t.getAttribute("data-if-orientation") || "vertical";
    if (e)
      switch (t.setAttribute("data-if-initialized", "true"), n) {
        case "page-body":
          this.createPageBodyEmbed(t, e, i);
          break;
        case "float-button":
          this.createFloatButtonEmbed(e, i);
          break;
        case "pop-up":
          this.createPopUpEmbed(e, a, i);
          break;
      }
  }
  init() {
    this.findContainers(), this.processContainers();
  }
  findContainers() {
    document.querySelectorAll("div[data-if-id]:not([data-if-initialized])").forEach((e) => {
      e instanceof HTMLElement && this.containers.push(e);
    });
  }
  processContainers() {
    this.containers.forEach((t) => {
      const e = t.getAttribute("data-if-id"), n = t.getAttribute("data-if-type"), a = t.getAttribute("data-if-timeout"), i = t.getAttribute("data-if-orientation") || "vertical";
      if (e)
        switch (t.setAttribute("data-if-initialized", "true"), n) {
          case "page-body":
            this.createPageBodyEmbed(t, e, i);
            break;
          case "float-button":
            this.createFloatButtonEmbed(e, i);
            break;
          case "pop-up":
            this.createPopUpEmbed(e, a, i);
            break;
        }
    });
  }
  createPageBodyEmbed(t, e, n = "vertical") {
    const { width: a, height: i } = this.getDimensionsByOrientation(n), o = this.createIframe(e, a, i);
    t.appendChild(o);
  }
  createFloatButtonEmbed(t, e = "square") {
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
    const a = document.createElement("style");
    a.textContent = `
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
    `, document.head.appendChild(a), n.addEventListener("mouseenter", () => {
      n.style.transform = "translateY(-2px)", n.style.animation = "none";
    }), n.addEventListener("mouseleave", () => {
      n.style.transform = "translateY(0)", n.style.animation = "bounce 5s infinite";
    });
    const i = document.createElement("div");
    i.style.cssText = `
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
    const o = document.createElement("button");
    o.innerHTML = "&times;", o.style.cssText = `
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
    `, o.addEventListener("mouseenter", () => {
      o.style.background = "#f0f0f0";
    }), o.addEventListener("mouseleave", () => {
      o.style.background = "transparent";
    });
    const { width: s, height: r } = this.getDimensionsByOrientation(e), d = this.createIframe(t, s, r);
    i.appendChild(o), i.appendChild(d), n.addEventListener("click", () => {
      i.style.display = "block", n.style.animation = "none";
    }), o.addEventListener("click", () => {
      i.style.display = "none", n.style.animation = "bounce 5s infinite";
    }), document.body.appendChild(n), document.body.appendChild(i);
  }
  createPopUpEmbed(t, e, n = "vertical") {
    const a = e ? parseInt(e) * 1e3 : 3e3;
    setTimeout(() => {
      const i = document.createElement("div");
      i.style.cssText = `
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
      const o = document.createElement("div");
      o.style.cssText = `
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
      const { width: r, height: d } = this.getDimensionsByOrientation(n), h = this.createIframe(t, r, d);
      o.appendChild(s), o.appendChild(h), i.appendChild(o);
      const c = document.createElement("style");
      c.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `, document.head.appendChild(c), s.addEventListener("click", () => {
        i.remove();
      }), i.addEventListener("click", (p) => {
        p.target === i && i.remove();
      }), document.body.appendChild(i);
    }, a);
  }
  createIframe(t, e, n) {
    const a = document.createElement("iframe");
    return a.src = `${u}/${t}`, a.width = e, a.height = n, a.style.cssText = `
      width: ${e};
      height: ${n};
      border: none;
    `, a;
  }
  getDimensionsByOrientation(t) {
    switch (t) {
      case "square":
        return { width: "341px", height: "300px" };
      case "vertical":
      default:
        return { width: "614px", height: "300px" };
    }
  }
}
(function() {
  typeof window < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    new l();
  }) : new l());
})();
export {
  l as Embedder
};

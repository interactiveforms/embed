var InteractiveFormEmbedder=function(o){"use strict";typeof window<"u"&&(window.ifLayer=window.ifLayer||[]);const a=class a{constructor(e){this.widgets=new Map,e&&this.addWidget(e),this.processWidgetLayer()}static getInstance(){return a.instance||(a.instance=new a),a.instance}addWidget(e){const t=`${e.id}-${e.type}`;if(this.widgets.has(t)){console.warn(`Widget with id ${e.id} and type ${e.type} already exists`);return}this.widgets.set(t,e),this.initializeWidget(e)}removeWidget(e,t){const n=`${e}-${t}`,i=this.widgets.get(n);i&&(this.destroyWidget(i),this.widgets.delete(n))}reinitialize(){this.widgets.forEach(e=>{this.destroyWidget(e)}),this.widgets.forEach(e=>{this.initializeWidget(e)})}static createInlineWidget(e,t="614px",n="300px"){const i=document.createElement("iframe");i.src=`http://localhost:4200/${e}`,i.width=t,i.height=n,i.style.cssText=`
      max-width: 100%;
      width: ${t};
      height: ${n};
      border: none;
    `,i.setAttribute("data-widget-id",e);const d=document.currentScript;return d&&d.parentNode?d.parentNode.insertBefore(i,d):document.body.appendChild(i),i}processWidgetLayer(){if(typeof window<"u"&&window.ifLayer&&window.ifLayer.length>0){const e=[...window.ifLayer];window.ifLayer=[],e.forEach(t=>{this.addWidget(t)})}}initializeWidget(e){switch(e.type){case"page-body":this.createPageBodyEmbed(e);break;case"float-button":this.createFloatButtonEmbed(e);break;case"pop-up":this.createPopUpEmbed(e);break}}destroyWidget(e){document.querySelectorAll(`[data-widget-id="${e.id}"]`).forEach(n=>{n.remove()})}createPageBodyEmbed(e){if(!e.container){console.error(`Container is required for page-body widget ${e.id}`);return}const t=document.querySelector(e.container);if(!t){console.error(`Container element not found for selector: ${e.container}`);return}const n=this.createIframe(e.id,"614px","300px");n.setAttribute("data-widget-id",e.id),t.appendChild(n)}createFloatButtonEmbed(e){const t=document.createElement("button");t.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `,t.style.cssText=`
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
    `,t.setAttribute("data-widget-id",e.id);const n=document.createElement("style");n.textContent=`
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
    `,document.head.appendChild(n),t.addEventListener("mouseenter",()=>{t.style.transform="translateY(-2px)",t.style.animation="none"}),t.addEventListener("mouseleave",()=>{t.style.transform="scale(1)",t.style.animation="ifScale 5s infinite"});const i=document.createElement("div");i.style.cssText=`
      position: fixed;
      bottom: 90px;
      right: 20px;
      z-index: 10001;
      display: none;
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `,i.setAttribute("data-widget-id",e.id);const d=document.createElement("button");d.innerHTML="&times;",d.style.cssText=`
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
    `,d.addEventListener("mouseenter",()=>{d.style.background="#f0f0f0"}),d.addEventListener("mouseleave",()=>{d.style.background="transparent"});const s=this.createIframe(e.id,"614px","300px");i.appendChild(d),i.appendChild(s),t.addEventListener("click",()=>{i.style.display="block",t.style.animation="none"}),d.addEventListener("click",()=>{i.style.display="none",t.style.animation="ifScale 5s infinite"}),document.body.appendChild(t),document.body.appendChild(i)}createPopUpEmbed(e){const t=e.timeout?e.timeout*1e3:3e3;setTimeout(()=>{const n=document.createElement("div");n.style.cssText=`
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
      `,n.setAttribute("data-widget-id",e.id);const i=document.createElement("div");i.style.cssText=`
        position: relative;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        max-width: 90vw;
        max-height: 90vh;
      `;const d=document.createElement("button");d.innerHTML="&times;",d.style.cssText=`
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
      `,d.addEventListener("mouseenter",()=>{d.style.background="#f0f0f0"}),d.addEventListener("mouseleave",()=>{d.style.background="transparent"});const s=this.createIframe(e.id,"614px","300px");i.appendChild(d),i.appendChild(s),n.appendChild(i);const c=document.createElement("style");c.textContent=`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,document.head.appendChild(c),d.addEventListener("click",()=>{n.remove()}),n.addEventListener("click",l=>{l.target===n&&n.remove()}),document.body.appendChild(n)},t)}createIframe(e,t,n){const i=document.createElement("iframe");return i.src=`https://if-form-staging.up.railway.app/${e}`,i.width=t,i.height=n,i.style.cssText=`
      max-width: 100%;
      width: ${t};
      height: ${n};
      border: none;
    `,i}};a.instance=null;let r=a;return function(){typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new r}):new r)}(),o.Embedder=r,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),o}({});

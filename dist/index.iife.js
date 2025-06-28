var InteractiveFormEmbedder=function(r){"use strict";class s{constructor(){this.containers=[],this.init()}reinitialize(){this.clearInitializationFlags(),this.containers.length=0,this.init()}clearInitializationFlags(){document.querySelectorAll("div[data-if-initialized]").forEach(t=>{t.removeAttribute("data-if-initialized")})}initializeElement(i){if(!i.hasAttribute("data-if-id")||i.hasAttribute("data-if-initialized"))return;const t=i.getAttribute("data-if-id"),n=i.getAttribute("data-if-type"),e=i.getAttribute("data-if-timeout");if(t)switch(i.setAttribute("data-if-initialized","true"),n){case"page-body":this.createPageBodyEmbed(i,t);break;case"float-button":this.createFloatButtonEmbed(t);break;case"pop-up":this.createPopUpEmbed(t,e);break}}init(){this.findContainers(),this.processContainers()}findContainers(){document.querySelectorAll("div[data-if-id]:not([data-if-initialized])").forEach(t=>{t instanceof HTMLElement&&this.containers.push(t)})}processContainers(){this.containers.forEach(i=>{const t=i.getAttribute("data-if-id"),n=i.getAttribute("data-if-type"),e=i.getAttribute("data-if-timeout");if(t)switch(i.setAttribute("data-if-initialized","true"),n){case"page-body":this.createPageBodyEmbed(i,t);break;case"float-button":this.createFloatButtonEmbed(t);break;case"pop-up":this.createPopUpEmbed(t,e);break}})}createPageBodyEmbed(i,t){const n=this.createIframe(t,"614px","300px");i.appendChild(n)}createFloatButtonEmbed(i){const t=document.createElement("button");t.innerHTML=`
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
      animation: bounce 5s infinite;
    `;const n=document.createElement("style");n.textContent=`
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
    `,document.head.appendChild(n),t.addEventListener("mouseenter",()=>{t.style.transform="translateY(-2px)",t.style.animation="none"}),t.addEventListener("mouseleave",()=>{t.style.transform="translateY(0)",t.style.animation="bounce 5s infinite"});const e=document.createElement("div");e.style.cssText=`
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 10001;
      display: none;
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;const a=document.createElement("button");a.innerHTML="&times;",a.style.cssText=`
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
    `,a.addEventListener("mouseenter",()=>{a.style.background="#f0f0f0"}),a.addEventListener("mouseleave",()=>{a.style.background="transparent"});const o=this.createIframe(i,"341px","300px");e.appendChild(a),e.appendChild(o),t.addEventListener("click",()=>{e.style.display="block",t.style.animation="none"}),a.addEventListener("click",()=>{e.style.display="none",t.style.animation="bounce 5s infinite"}),document.body.appendChild(t),document.body.appendChild(e)}createPopUpEmbed(i,t){const n=t?parseInt(t)*1e3:3e3;setTimeout(()=>{const e=document.createElement("div");e.style.cssText=`
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
      `;const a=document.createElement("div");a.style.cssText=`
        position: relative;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        max-width: 90vw;
        max-height: 90vh;
      `;const o=document.createElement("button");o.innerHTML="&times;",o.style.cssText=`
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
      `,o.addEventListener("mouseenter",()=>{o.style.background="#f0f0f0"}),o.addEventListener("mouseleave",()=>{o.style.background="transparent"});const c=this.createIframe(i,"614px","300px");a.appendChild(o),a.appendChild(c),e.appendChild(a);const d=document.createElement("style");d.textContent=`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,document.head.appendChild(d),o.addEventListener("click",()=>{e.remove()}),e.addEventListener("click",l=>{l.target===e&&e.remove()}),document.body.appendChild(e)},n)}createIframe(i,t,n){const e=document.createElement("iframe");return e.src=`http://localhost:4200/${i}`,e.width=t,e.height=n,e.style.cssText=`
      width: ${t};
      height: ${n};
      border: none;
    `,e}}return function(){typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new s}):new s)}(),r.Embedder=s,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),r}({});

(function(s,l){typeof exports=="object"&&typeof module<"u"?l(exports):typeof define=="function"&&define.amd?define(["exports"],l):(s=typeof globalThis<"u"?globalThis:s||self,l(s.InteractiveFormEmbedder={}))})(this,function(s){"use strict";const l="https://if-form-staging.up.railway.app";class h{constructor(){this.containers=[],this.init()}reinitialize(){this.clearInitializationFlags(),this.containers.length=0,this.init()}clearInitializationFlags(){document.querySelectorAll("div[data-if-initialized]").forEach(i=>{i.removeAttribute("data-if-initialized")})}initializeElement(t){if(!t.hasAttribute("data-if-id")||t.hasAttribute("data-if-initialized"))return;const i=t.getAttribute("data-if-id"),e=t.getAttribute("data-if-type"),a=t.getAttribute("data-if-timeout"),n=t.getAttribute("data-if-orientation")||"vertical";if(i)switch(t.setAttribute("data-if-initialized","true"),e){case"page-body":this.createPageBodyEmbed(t,i,n);break;case"float-button":this.createFloatButtonEmbed(i,n);break;case"pop-up":this.createPopUpEmbed(i,a,n);break}}init(){this.findContainers(),this.processContainers()}findContainers(){document.querySelectorAll("div[data-if-id]:not([data-if-initialized])").forEach(i=>{i instanceof HTMLElement&&this.containers.push(i)})}processContainers(){this.containers.forEach(t=>{const i=t.getAttribute("data-if-id"),e=t.getAttribute("data-if-type"),a=t.getAttribute("data-if-timeout"),n=t.getAttribute("data-if-orientation")||"vertical";if(i)switch(t.setAttribute("data-if-initialized","true"),e){case"page-body":this.createPageBodyEmbed(t,i,n);break;case"float-button":this.createFloatButtonEmbed(i,n);break;case"pop-up":this.createPopUpEmbed(i,a,n);break}})}createPageBodyEmbed(t,i,e="vertical"){const{width:a,height:n}=this.getDimensionsByOrientation(e),o=document.createElement("div");o.style.width=a;const r=this.createIframe(i,a,n);o.appendChild(r),t.appendChild(o)}createFloatButtonEmbed(t,i="square"){const e=document.createElement("button");e.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="16" fill="#312DF6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1176 28C11.1176 36.2843 18.2284 43 27 43C35.7716 43 42.8824 36.2843 42.8824 28H45C45 37.3888 36.9411 45 27 45C17.0589 45 9 37.3888 9 28H11.1176Z" fill="white"/><rect x="9" y="19" width="13" height="2" fill="white"/><rect x="32" y="19" width="13" height="2" fill="white"/><rect x="32" y="12" width="2" height="8" fill="white"/><rect x="37" y="14" width="2" height="6" fill="white"/></svg>
    `,e.style.cssText=`
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
    `;const a=document.createElement("style");a.textContent=`
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
    `,document.head.appendChild(a),e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-2px)",e.style.animation="none"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(0)",e.style.animation="bounce 5s infinite"});const n=document.createElement("div");n.style.cssText=`
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 10001;
      display: none;
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;const o=document.createElement("button");o.innerHTML="&times;",o.style.cssText=`
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
    `,o.addEventListener("mouseenter",()=>{o.style.background="#f0f0f0"}),o.addEventListener("mouseleave",()=>{o.style.background="transparent"});const{width:r,height:p}=this.getDimensionsByOrientation(i),d=document.createElement("div");d.style.width=r;const c=this.createIframe(t,r,p);d.appendChild(o),d.appendChild(c),n.appendChild(d),e.addEventListener("click",()=>{n.style.display="block",e.style.animation="none"}),o.addEventListener("click",()=>{n.style.display="none",e.style.animation="bounce 5s infinite"}),document.body.appendChild(e),document.body.appendChild(n)}createPopUpEmbed(t,i,e="vertical"){const a=i?parseInt(i)*1e3:3e3;setTimeout(()=>{const n=document.createElement("div");n.style.cssText=`
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
      `;const o=document.createElement("div");o.style.cssText=`
        position: relative;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        max-width: 90vw;
        max-height: 90vh;
      `;const r=document.createElement("button");r.innerHTML="&times;",r.style.cssText=`
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
      `,r.addEventListener("mouseenter",()=>{r.style.background="#f0f0f0"}),r.addEventListener("mouseleave",()=>{r.style.background="transparent"});const{width:p,height:d}=this.getDimensionsByOrientation(e),c=document.createElement("div");c.style.width=p;const m=this.createIframe(t,p,d);c.appendChild(r),c.appendChild(m),o.appendChild(c);const u=document.createElement("style");u.textContent=`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,document.head.appendChild(u),r.addEventListener("click",()=>{n.remove()}),n.addEventListener("click",f=>{f.target===n&&n.remove()}),document.body.appendChild(n)},a)}createIframe(t,i,e){const a=document.createElement("iframe");return a.src=`${l}/${t}`,a.width="100%",a.height=e,a.style.cssText=`
      width: 100%;
      height: ${e};
      border: none;
      display: block;
    `,a}getDimensionsByOrientation(t){switch(t){case"square":return{width:"341px",height:"300px"};case"vertical":default:return{width:"614px",height:"300px"}}}}(function(){typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new h}):new h)})(),s.Embedder=h,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});

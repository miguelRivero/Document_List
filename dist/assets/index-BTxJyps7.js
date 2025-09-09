(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();var L=function(o,e,t,i){function n(s){return s instanceof t?s:new t(function(r){r(s)})}return new(t||(t=Promise))(function(s,r){function d(a){try{c(i.next(a))}catch(l){r(l)}}function u(a){try{c(i.throw(a))}catch(l){r(l)}}function c(a){a.done?s(a.value):n(a.value).then(d,u)}c((i=i.apply(o,e||[])).next())})};class A{constructor(e,t){this.form=null,this.feedback=null,this.container=e,this.onSubmit=t,this.render()}render(){if(this.container.innerHTML=`
      <form id="document-form" aria-label="Add document form" autocomplete="off" novalidate>
        <label>
          Name
          <input type="text" name="title" placeholder="Document name" required aria-required="true" autocomplete="off" />
        </label>
        <label>
          Version
          <input type="number" name="version" placeholder="Version" min="1" step="any" required aria-required="true" autocomplete="off" />
        </label>
        <label>
          Contributors
          <input type="text" name="contributors" placeholder="Contributors (comma separated)" required aria-required="true" autocomplete="off" />
        </label>
        <label>
          Attachments
          <input type="text" name="attachments" placeholder="Attachments (comma separated)" autocomplete="off" />
        </label>
        <button type="submit" class="submit-btn">Create Document</button>
        <div class="form-feedback" aria-live="polite" style="margin-top:1em;"></div>
      </form>
    `,this.form=this.container.querySelector("form"),this.feedback=this.container.querySelector(".form-feedback"),this.form){this.form.onsubmit=t=>this.handleSubmit(t);const e=this.form.querySelector('input[name="title"]');e&&setTimeout(()=>e.focus(),0)}}setFeedback(e,t="error"){this.feedback&&(this.feedback.textContent=e,this.feedback.style.color=t==="error"?"#c0392b":"#218838")}clearFeedback(){this.feedback&&(this.feedback.textContent="")}setLoading(e){if(!this.form)return;const t=this.form.querySelector(".submit-btn");t&&(t.disabled=e),t.textContent=e?"Creating…":"Create Document"}handleSubmit(e){return L(this,void 0,void 0,function*(){if(e.preventDefault(),!this.form)return;this.clearFeedback();const t=new FormData(this.form),i=(t.get("title")||"").trim(),n=(t.get("version")||"").trim(),s=(t.get("contributors")||"").trim(),r=(t.get("attachments")||"").trim();if(!i){this.setFeedback("Title is required.");return}if(!n){this.setFeedback("Version is required.");return}if(!s){this.setFeedback("At least one contributor is required.");return}const d=s.split(",").map(a=>({id:"",name:a.trim()})).filter(a=>a.name);if(d.length===0){this.setFeedback("At least one valid contributor is required.");return}const u=r?r.split(",").map(a=>a.trim()).filter(Boolean):[],c={title:i,version:n,contributors:d,attachments:u};this.setLoading(!0);try{yield this.onSubmit(c),this.setFeedback("Document created successfully!","success"),this.form.reset();const a=this.form.querySelector('input[name="title"]');a&&a.focus()}catch{this.setFeedback("Error creating document. Please try again.")}finally{this.setLoading(!1)}})}}class C{constructor(e){this.onSubmit=e,this.overlay=document.createElement("div"),this.overlay.className="modal-overlay",this.overlay.addEventListener("click",n=>{n.target===this.overlay&&this.close()}),this.modal=document.createElement("div"),this.modal.className="modal-content";const t=document.createElement("button");t.className="modal-close-btn",t.innerHTML="&times;",t.type="button",t.addEventListener("click",()=>this.close()),this.modal.appendChild(t);const i=document.createElement("div");i.className="modal-form-container",this.modal.appendChild(i),new A(i,n=>{this.onSubmit(n),this.close()}),this.overlay.appendChild(this.modal)}open(){document.body.appendChild(this.overlay),setTimeout(()=>this.overlay.classList.add("open"),10)}close(){this.overlay.classList.remove("open"),setTimeout(()=>{this.overlay.parentNode&&this.overlay.parentNode.removeChild(this.overlay)},200)}}class S{constructor(e){this.listContainer=null,this.view="list",this.container=e,this.renderHeaders()}renderHeaders(){this.container.innerHTML=`
      <div id="document-list"></div>
    `,this.listContainer=this.container.querySelector("#document-list")}update(e,t="list"){this.view=t,this.listContainer||this.renderHeaders();let i="";t==="list"?i=`
        <div class="document-list-headers">
          <div class="header-name">Name</div>
          <div class="header-contributors">Contributors</div>
          <div class="header-attachments">Attachments</div>
        </div>
        <div class="document-list list scrollable-list">
          ${e.map(n=>`
            <div class="document-item">
              <div class="document-name">${n.title}<br><span>v${n.version}</span></div>
              <div class="document-contributors">
                ${n.contributors.map(s=>s.name).join("<br>")||"No contributors"}
              </div>
              <div class="document-attachments">
                ${Array.isArray(n.attachments)&&n.attachments.length>0?n.attachments.join("<br>"):"No attachments"}
              </div>
            </div>
          `).join("")}
        </div>
        <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
      `:i=`
        <div class="document-list grid scrollable-list">
          ${e.map(n=>`
            <div class="document-item">
              <div class="document-name">${n.title}<br><span>v${n.version}</span></div>
              <div class="document-contributors">
                ${n.contributors.map(s=>s.name).join("<br>")||"No contributors"}
              </div>
              <div class="document-attachments">
                ${Array.isArray(n.attachments)&&n.attachments.length>0?n.attachments.join("<br>"):"No attachments"}
              </div>
            </div>
          `).join("")}
        </div>
        <div class="add-btn-row">
          <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
        </div>
      `,this.listContainer&&(this.listContainer.innerHTML=i)}}class k{constructor(e){this.hideBannerTimeout=null,this.container=e}show(e=0){this.container.innerHTML=`
      <div class="notification-banner notification-banner--enter">
        <span class="notification-icon">
          <img src="./assets/bell.svg" width="20" height="20" alt="Bell icon" />
          ${e>0?`<span class="notification-badge">${e}</span>`:""}
        </span>
        <span>New document added</span>
      </div>
    `,this.container.style.display="block";const t=this.container.querySelector(".notification-banner");t&&(t.offsetWidth,t.classList.add("notification-banner--visible")),this.hideBannerTimeout&&clearTimeout(this.hideBannerTimeout),this.hideBannerTimeout=window.setTimeout(()=>{this.hideWithAnimation(),this.hideBannerTimeout=null},2e3)}hideWithAnimation(){const e=this.container.querySelector(".notification-banner");e?(e.classList.remove("notification-banner--visible"),e.classList.add("notification-banner--leave"),e.addEventListener("transitionend",()=>{this.clear()},{once:!0})):this.clear()}clear(){this.container.innerHTML="",this.container.style.display="none"}}function T(o){return{id:o.ID,title:o.Title,contributors:o.Contributors.map(e=>({id:e.ID,name:e.Name})),version:o.Version,attachments:o.Attachments,createdAt:o.CreatedAt}}var N=function(o,e,t,i){function n(s){return s instanceof t?s:new t(function(r){r(s)})}return new(t||(t=Promise))(function(s,r){function d(a){try{c(i.next(a))}catch(l){r(l)}}function u(a){try{c(i.throw(a))}catch(l){r(l)}}function c(a){a.done?s(a.value):n(a.value).then(d,u)}c((i=i.apply(o,e||[])).next())})};class E{constructor(e){this.baseUrl=e}getRecentDocuments(){return N(this,void 0,void 0,function*(){return(yield(yield fetch(`${this.baseUrl}/documents`)).json()).map(T)})}}class q{constructor(){this.ws=null,this.url="ws://localhost:8080/notifications"}connect(e){this.ws=new WebSocket(this.url),this.ws.onmessage=()=>{e()}}disconnect(){this.ws&&(this.ws.close(),this.ws=null)}}function B(o,e){const t=o.split(".").map(Number),i=e.split(".").map(Number);for(let n=0;n<Math.max(t.length,i.length);n++){const s=t[n]||0,r=i[n]||0;if(s>r)return-1;if(s<r)return 1}return 0}class M{constructor(){this.documents=[],this.listeners=[]}getDocuments(){return this.documents}setDocuments(e){this.documents=e,this.listeners.forEach(t=>t(this.documents))}addDocument(e){this.documents=[e,...this.documents.filter(t=>t.id!==e.id)],this.listeners.forEach(t=>t(this.documents))}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}}const m=new M;var w=function(o,e,t,i){function n(s){return s instanceof t?s:new t(function(r){r(s)})}return new(t||(t=Promise))(function(s,r){function d(a){try{c(i.next(a))}catch(l){r(l)}}function u(a){try{c(i.throw(a))}catch(l){r(l)}}function c(a){a.done?s(a.value):n(a.value).then(d,u)}c((i=i.apply(o,e||[])).next())})};let y="list",g="none";const x=document.getElementById("document-list"),$=document.getElementById("notification-banner"),D=new E("http://localhost:8080"),I=new q,F=new S(x),_=new k($);let b=null;function p(){let o=m.getDocuments();g!=="none"&&(o=O(o,g)),F.update(o,y)}document.addEventListener("click",o=>{o.target.classList.contains("add-document-btn")&&(b||(b=new C(t=>w(void 0,void 0,void 0,function*(){try{const i=j(t),n=m.getDocuments(),s=new Map([[i.id,i],...n.map(d=>[d.id,d])]),r=Array.from(s.values());m.setDocuments(r)}finally{b=null}}))),b.open())});function j(o){const e=()=>typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():Math.random().toString(36).slice(2),t=(o.contributors||[]).map(n=>Object.assign(Object.assign({},n),{id:n.id||e()}));let i=[];return typeof o.attachments=="string"?i=o.attachments.split(",").map(n=>n.trim()).filter(Boolean):Array.isArray(o.attachments)&&(i=o.attachments),Object.assign(Object.assign({},o),{id:e(),createdAt:new Date().toISOString(),contributors:t,attachments:i})}const h=document.getElementById("list-view-btn"),f=document.getElementById("grid-view-btn"),v=document.getElementById("sort-select");h&&f&&(h.classList.add("active"),f.classList.remove("active"),h.addEventListener("click",()=>{y="list",h.classList.add("active"),f.classList.remove("active"),p()}),f.addEventListener("click",()=>{y="grid",f.classList.add("active"),h.classList.remove("active"),p()}));v&&v.addEventListener("change",()=>{g=v.value||"none",p()});function O(o,e){return[...o].sort((t,i)=>e==="name"?t.title.localeCompare(i.title):e==="version"?B(t.version,i.version):e==="createdAt"?new Date(i.createdAt).getTime()-new Date(t.createdAt).getTime():0)}function H(){return w(this,void 0,void 0,function*(){const o=yield D.getRecentDocuments();m.setDocuments(o),p()})}I.connect(()=>{D.getRecentDocuments().then(o=>{const e=m.getDocuments(),t=new Map(e.map(r=>[r.id,r]));let i=null,n=0;for(const r of o)t.has(r.id)||(i=r,n++),t.set(r.id,r);const s=Array.from(t.values());_.show(n),i&&console.log("[DocumentStore] New document added:",i),console.log("[DocumentStore] Total documents:",s.length),m.setDocuments(s)})});m.subscribe(()=>{p()});H();

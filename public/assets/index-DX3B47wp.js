(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789`,t=BigInt(57),n=/^CSGO(-?[\w]{5}){5}$/,r=class e extends Error{constructor(){super(`Invalid share code`),Object.setPrototypeOf(this,e.prototype)}},i=class e extends Error{constructor(){super(`Invalid crosshair share code`),Object.setPrototypeOf(this,e.prototype)}};function a(e){return Array.from(e,e=>(`0`+(e&255).toString(16)).slice(-2)).join(``)}function o(e){let t=[];for(let n=0;n<e.length;n+=2)t.push(parseInt(e.slice(n,n+2),16));return t}function s(e){return e<<24>>24}function c(e){return e.reduce((e,t)=>e+t,0)}function l(i){if(!i.match(n))throw new r;i=i.replace(/CSGO|-/g,``);let a=Array.from(i).reverse(),s=BigInt(0);for(let n=0;n<a.length;n++)s=s*t+BigInt(e.indexOf(a[n]));return o(s.toString(16).padStart(36,`0`))}function u(n){let r=a(n),i=BigInt(`0x${r}`),o=``,s=BigInt(0);for(let n=0;n<25;n++)s=i%t,o+=e[Number(s)],i/=t;return`CSGO-${o.slice(0,5)}-${o.slice(5,10)}-${o.slice(10,15)}-${o.slice(15,20)}-${o.slice(20,25)}`}function d(e){let t=l(e),n=c(t.slice(1))%256;if(t[0]!==n)throw new i;return{gap:s(t[2])/10,outline:t[3]/2,red:t[4],green:t[5],blue:t[6],alpha:t[7],splitDistance:t[8]&7,followRecoil:(t[8]>>4&8)==8,fixedCrosshairGap:s(t[9])/10,color:t[10]&7,outlineEnabled:(t[10]&8)==8,innerSplitAlpha:(t[10]>>4)/10,outerSplitAlpha:(t[11]&15)/10,splitSizeRatio:(t[11]>>4)/10,thickness:t[12]/10,centerDotEnabled:(t[13]>>4&1)==1,deployedWeaponGapEnabled:(t[13]>>4&2)==2,alphaEnabled:(t[13]>>4&4)==4,tStyleEnabled:(t[13]>>4&8)==8,style:(t[13]&15)>>1,length:t[14]/10}}function f(e){let t=[0,1,e.gap*10&255,e.outline*2,e.red,e.green,e.blue,e.alpha,e.splitDistance&7|Number(e.followRecoil)<<7,e.fixedCrosshairGap*10&255,e.color&7|Number(e.outlineEnabled)<<3|e.innerSplitAlpha*10<<4,e.outerSplitAlpha*10|e.splitSizeRatio*10<<4,e.thickness*10,e.style<<1|Number(e.centerDotEnabled)<<4|Number(e.deployedWeaponGapEnabled)<<5|Number(e.alphaEnabled)<<6|Number(e.tStyleEnabled)<<7,e.length*10,0,0,0];return t[0]=c(t)&255,u(t)}function ee(e){return`
cl_crosshair_drawoutline "${Number(e.outlineEnabled)}"
cl_crosshair_dynamic_maxdist_splitratio "${e.splitSizeRatio}"
cl_crosshair_dynamic_splitalpha_innermod "${e.innerSplitAlpha}"
cl_crosshair_dynamic_splitalpha_outermod "${e.outerSplitAlpha}"
cl_crosshair_dynamic_splitdist "${e.splitDistance}"
cl_crosshair_outlinethickness "${e.outline}"
cl_crosshair_t "${Number(e.tStyleEnabled)}"
cl_crosshairalpha "${e.alpha}"
cl_crosshaircolor "${e.color}"
cl_crosshaircolor_b "${e.blue}"
cl_crosshaircolor_g "${e.green}"
cl_crosshaircolor_r "${e.red}"
cl_crosshairdot "${Number(e.centerDotEnabled)}"
cl_crosshairgap "${e.gap}"
cl_crosshairgap_useweaponvalue "${Number(e.deployedWeaponGapEnabled)}"
cl_crosshairsize "${e.length}"
cl_crosshairstyle "${e.style}"
cl_crosshairthickness "${e.thickness}"
cl_crosshairusealpha "${Number(e.alphaEnabled)}"
cl_fixedcrosshairgap "${e.fixedCrosshairGap}"
cl_crosshair_recoil "${Number(e.followRecoil)}"
`}var p={cl_crosshair_drawoutline:`outlineEnabled`,cl_crosshair_dynamic_maxdist_splitratio:`splitSizeRatio`,cl_crosshair_dynamic_splitalpha_innermod:`innerSplitAlpha`,cl_crosshair_dynamic_splitalpha_outermod:`outerSplitAlpha`,cl_crosshair_dynamic_splitdist:`splitDistance`,cl_crosshair_outlinethickness:`outline`,cl_crosshair_t:`tStyleEnabled`,cl_crosshairalpha:`alpha`,cl_crosshaircolor:`color`,cl_crosshaircolor_b:`blue`,cl_crosshaircolor_g:`green`,cl_crosshaircolor_r:`red`,cl_crosshairdot:`centerDotEnabled`,cl_crosshairgap:`gap`,cl_crosshairgap_useweaponvalue:`deployedWeaponGapEnabled`,cl_crosshairsize:`length`,cl_crosshairstyle:`style`,cl_crosshairthickness:`thickness`,cl_crosshairusealpha:`alphaEnabled`,cl_fixedcrosshairgap:`fixedCrosshairGap`,cl_crosshair_recoil:`followRecoil`},te=new Set([`outlineEnabled`,`tStyleEnabled`,`centerDotEnabled`,`deployedWeaponGapEnabled`,`alphaEnabled`,`followRecoil`]),ne={length:3,red:50,green:250,blue:50,gap:-2,alphaEnabled:!0,alpha:200,outlineEnabled:!1,outline:1,color:1,thickness:.5,centerDotEnabled:!1,splitDistance:3,followRecoil:!1,fixedCrosshairGap:3,innerSplitAlpha:0,outerSplitAlpha:1,splitSizeRatio:1,tStyleEnabled:!1,deployedWeaponGapEnabled:!0,style:4};function re(e){let t=e.trim().replace(/^["']|["']$/g,``),n=t.toLowerCase();return n===`true`?`1`:n===`false`?`0`:t}function ie(e){let t={},n=e.replace(/\/\/[^\n]*/g,``).replace(/\/\*[\s\S]*?\*\//g,``);for(let e of n.split(/[;\n]+/)){let n=e.trim();if(!n)continue;let r=n.match(/^(cl_[\w]+)\s+(.+)$/);r&&(t[r[1]]=re(r[2]))}return t}function ae(e,t){return e===void 0?!t&&0:t?typeof e==`boolean`?e:Number(e)!==0:Number(e)}function oe(e){let t={...ne};for(let[n,r]of Object.entries(p)){if(!(n in e))continue;let i=te.has(r);t[r]=ae(e[n],i)}return t}function se(e){return oe(ie(e))}function ce(e){return e.trim().split(`
`).map(e=>e.trim()).filter(Boolean).join(`
`)}var le=.5;function ue(e){return{base:e,lo:e*(1-le),hi:e*1.5,round:1,choices:[]}}function de(e){let t=(e.lo+e.hi)/2;return{lower:(e.lo+t)/2,higher:(t+e.hi)/2,mid:t}}function fe(e){return e.round>7}function pe(e){return(e.lo+e.hi)/2}function me(e){let t=pe(e);return t<=0?0:(e.hi-e.lo)/t}function he(e,t){if(fe(e))return e;let n=(e.lo+e.hi)/2,{lower:r,higher:i}=de(e),a={round:e.round,side:t,lo:e.lo,hi:e.hi,lower:r,higher:i},o={...e,choices:[...e.choices,a],round:e.round+1};return t===`lower`?o.hi=n:o.lo=n,o}function ge(e){if(e.choices.length===0)return e;let t=e.choices.slice(0,-1),n=e.choices[e.choices.length-1];return{...e,lo:n.lo,hi:n.hi,round:n.round,choices:t}}function _e(e){return pe(e)}var ve=`/api`,ye=`cs2utils.token`,be=/^https?:\/\//.test(ve)?new URL(ve).origin:``;function xe(){try{return localStorage.getItem(ye)}catch{return null}}function Se(e){try{e?localStorage.setItem(ye,e):localStorage.removeItem(ye)}catch{}}async function m(e,t,n,{auth:r=!1}={}){let i={};if(n!==void 0&&!(n instanceof FormData)&&(i[`Content-Type`]=`application/json`),r){let e=xe();if(!e)throw Error(`Please log in first.`);i.Authorization=`Bearer ${e}`,i[`X-AimKit-Token`]=`Bearer ${e}`}let a;try{a=await fetch(`${ve}${t}`,{method:e,headers:i,body:n instanceof FormData?n:n===void 0?void 0:JSON.stringify(n)})}catch{throw Error(`Cannot reach the server. Is the API running?`)}let o=null,s=await a.text();if(s)try{o=JSON.parse(s)}catch{o=null}if(!a.ok){let e=o&&o.error||`Request failed (${a.status}).`,t=o&&typeof o.detail==`string`?o.detail.trim():``,n=t&&t!==e?`${e} ${t}`:e,r=Error(n);throw r.status=a.status,r.data=o,r}return o}var Ce=`${ve}/auth/steam`;function we(e){Se(e)}function h(e){return!!e&&(e.role===`admin`||e.role===`owner`)}function Te(e){return!!e&&e.role===`owner`}function Ee(e){return e?/^https?:\/\//.test(e)||e.startsWith(`data:`)?e:be+e:``}var g={auth:{async register(e){let t=await m(`POST`,`/auth/register`,e);return t.token&&Se(t.token),t},async verify(e){let t=await m(`POST`,`/auth/verify`,{token:e});return t.token&&Se(t.token),t.user},async resendVerification(e){return m(`POST`,`/auth/resend-verification`,{email:e})},async login(e){let t=await m(`POST`,`/auth/login`,e);return Se(t.token),t.user},logout(){Se(null)},async captcha(){return m(`GET`,`/auth/captcha`)},async changePassword(e){return m(`POST`,`/auth/password`,e,{auth:!0})},async forgot(e){return m(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return m(`POST`,`/auth/reset`,{token:e,password:t})},async me(){if(!xe())return null;try{return(await m(`GET`,`/auth/me`,void 0,{auth:!0})).user}catch{return Se(null),null}},async profile(){return m(`GET`,`/auth/profile`,void 0,{auth:!0})},async setAvatar(e){return(await m(`POST`,`/auth/avatar`,{url:e},{auth:!0})).user},async uploadAvatar(e){let t=new FormData;return t.append(`file`,e),(await m(`POST`,`/auth/avatar/upload`,t,{auth:!0})).user},async changePassword(e){return m(`POST`,`/auth/password`,e,{auth:!0})},async changeUsername(e){let t=await m(`POST`,`/auth/username`,{username:e},{auth:!0});return t.token&&Se(t.token),t.user},async setCredentials(e){let t=await m(`POST`,`/auth/credentials`,e,{auth:!0});return t.token&&Se(t.token),t.user},async forgot(e){return m(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return m(`POST`,`/auth/reset`,{token:e,password:t})},steamLoginUrl(){return`${ve}/auth/steam`},async steamLinkUrl(){return(await m(`GET`,`/auth/steam/link-url`,void 0,{auth:!0})).url},async steamUnlink(){return(await m(`POST`,`/auth/steam/unlink`,{},{auth:!0})).user}},settings:{async get(){return m(`GET`,`/settings`)}},contact:{async send(e){return m(`POST`,`/contact`,e)}},pros:{async list({q:e=``,sort:t=`name`}={}){let n=new URLSearchParams;e&&n.set(`q`,e),t&&n.set(`sort`,t);let r=n.toString();return m(`GET`,`/pros${r?`?${r}`:``}`)}},configs:{async list({sort:e=`top`,q:t=``}={}){let n=new URLSearchParams;e&&n.set(`sort`,e),t&&n.set(`q`,t);let r=n.toString();return(await m(`GET`,`/configs${r?`?${r}`:``}`,void 0,{auth:!0})).configs},async create(e){return(await m(`POST`,`/configs`,e,{auth:!0})).config},async rate(e,t){return m(`POST`,`/configs/${e}/rate`,{rating:t},{auth:!0})},async remove(e){return m(`DELETE`,`/configs/${e}`,void 0,{auth:!0})}},highlights:{async list({q:e=``}={}){return(await m(`GET`,`/highlights${e?`?q=${encodeURIComponent(e)}`:``}`,void 0,{auth:!0})).highlights},async create(e){return(await m(`POST`,`/highlights`,e,{auth:!0})).highlight},async report(e,t){return m(`POST`,`/highlights/${e}/report`,{reason:t},{auth:!0})},async remove(e){return m(`DELETE`,`/highlights/${e}`,void 0,{auth:!0})}},nades:{async list({map:e=``,type:t=``}={}){let n=new URLSearchParams;e&&n.set(`map`,e),t&&n.set(`type`,t);let r=n.toString();return(await m(`GET`,`/nades${r?`?${r}`:``}`)).nades},async mine(){return(await m(`GET`,`/nades/mine`,void 0,{auth:!0})).nades},async favorites({map:e=``,type:t=``}={}){let n=new URLSearchParams;e&&n.set(`map`,e),t&&n.set(`type`,t);let r=n.toString();return(await m(`GET`,`/nades/favorites${r?`?${r}`:``}`,void 0,{auth:!0})).nades},async social(){return m(`GET`,`/nades/social`,void 0,{auth:!!xe()})},async favorite(e){return m(`POST`,`/nades/${e}/favorite`,{},{auth:!0})},async create(e){return(await m(`POST`,`/nades`,e,{auth:!0})).nade},async addMedia(e,t){return(await m(`POST`,`/nades/${e}/media`,t,{auth:!0})).media},async remove(e){return m(`DELETE`,`/nades/${e}`,void 0,{auth:!0})},async parseMapGuide(e){return m(`POST`,`/nades/map-guide/parse`,{text:e},{auth:!0})},async importMapGuide({text:e,nades:t,side:n,guideText:r,fileName:i}={}){return m(`POST`,`/nades/map-guide/import`,{text:e,nades:t,side:n,guideText:r,fileName:i},{auth:!0})},async practicePackFromText({text:e,map:t,importId:n}={}){return m(`POST`,`/nades/map-guide/practice-pack`,{text:e,map:t,importId:n},{auth:!0})},async practicePackFromImport(e){return m(`GET`,`/nades/map-guide/imports/${e}/practice-pack`,void 0,{auth:!!xe()})},async practicePackFromNades(e){return m(`POST`,`/nades/map-guide/practice-pack-from-nades`,{nadeIds:e},{auth:!!xe()})}},commands:{async catalog(){return m(`GET`,`/commands/catalog`)},async social(){return m(`GET`,`/commands/social`,void 0,{auth:!0})},async recommend(e){return m(`POST`,`/commands/${e}/recommend`,{},{auth:!0})},async addComment(e,t){return m(`POST`,`/commands/${e}/comments`,{body:t},{auth:!0})}},admin:{async pending(){return(await m(`GET`,`/admin/nades/pending`,void 0,{auth:!0})).nades},async pendingComments(){return(await m(`GET`,`/admin/comments/pending`,void 0,{auth:!0})).comments},async pendingCommentsCount(){return(await m(`GET`,`/admin/comments/pending/count`,void 0,{auth:!0})).count},async reviewComment(e,t){return m(`POST`,`/admin/comments/${e}/review`,{decision:t},{auth:!0})},async removeComment(e){return m(`DELETE`,`/admin/comments/${e}`,void 0,{auth:!0})},async syncCommands(){return m(`POST`,`/admin/commands/sync`,{},{auth:!0})},async checkCommandsCs2(){return m(`POST`,`/admin/commands/check-cs2`,{},{auth:!0})},async saveSettings(e){return m(`POST`,`/admin/settings`,e,{auth:!0})},async highlightReports(){return(await m(`GET`,`/admin/highlights/reports`,void 0,{auth:!0})).highlights},async highlightReportsCount(){return(await m(`GET`,`/admin/highlights/reports/count`,void 0,{auth:!0})).count},async reviewHighlight(e,t){return m(`POST`,`/admin/highlights/${e}/review`,{decision:t},{auth:!0})},async syncPros(){return m(`POST`,`/admin/pros/sync`,{},{auth:!0})},async importCommands(e){return m(`POST`,`/admin/commands/import`,{content:e},{auth:!0})},async importPros(e){return m(`POST`,`/admin/pros/import`,{content:e},{auth:!0})},async banUser(e,{hours:t,permanent:n}){return(await m(`POST`,`/admin/users/${e}/ban`,{hours:t,permanent:n},{auth:!0})).user},async unbanUser(e){return(await m(`POST`,`/admin/users/${e}/unban`,{},{auth:!0})).user},async pendingCount(){return(await m(`GET`,`/admin/nades/pending/count`,void 0,{auth:!0})).count},async reviewNade(e,t,n=``){return m(`POST`,`/admin/nades/${e}/review`,{decision:t,note:n},{auth:!0})},async reviewNadesBulk(e,t,n=``){return m(`POST`,`/admin/nades/review-bulk`,{ids:e,decision:t,note:n},{auth:!0})},async reviewMedia(e,t){return m(`POST`,`/admin/media/${e}/review`,{decision:t},{auth:!0})},async reviewMediaBulk(e,t){return m(`POST`,`/admin/media/review-bulk`,{ids:e,decision:t},{auth:!0})},async removeMedia(e){return m(`DELETE`,`/admin/media/${e}`,void 0,{auth:!0})},async users(){return(await m(`GET`,`/admin/users`,void 0,{auth:!0})).users},async setRole(e,t){return(await m(`POST`,`/admin/users/${e}/role`,{role:t},{auth:!0})).user},async contactMessages(){return(await m(`GET`,`/admin/contact`,void 0,{auth:!0})).messages},async removeContact(e){return m(`DELETE`,`/admin/contact/${e}`,void 0,{auth:!0})},async ownerLogs({limit:e=100,offset:t=0,action:n=``}={}){let r=new URLSearchParams;e&&r.set(`limit`,String(e)),t&&r.set(`offset`,String(t)),n&&r.set(`action`,n);let i=r.toString();return m(`GET`,`/admin/owner-logs${i?`?${i}`:``}`,void 0,{auth:!0})}},uploads:{async image(e){let t=new FormData;return t.append(`file`,e),await m(`POST`,`/uploads`,t,{auth:!0})}}},De=null,Oe=new Set;function ke(){for(let e of Oe)e(De)}function Ae(){return De}function je(e){return Oe.add(e),()=>Oe.delete(e)}async function Me(){return De=await g.auth.me(),ke(),De}async function Ne(e){return De=await g.auth.login(e),ke(),De}async function Pe(e){let t=await g.auth.register(e);return t&&t.user&&(De=t.user,ke()),t}async function Fe(e){return De=await g.auth.verify(e),ke(),De}function Ie(){g.auth.logout(),De=null,ke()}var Le,_,Re=`login`,v={required:!1,token:null,svg:``},ze=``;function Be(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Ve(){let e=Ae();e?(Le.innerHTML=`
      <button class="account-chip" id="hdr-profile" title="View your profile">
        ${e.avatarUrl?`<img class="account-avatar" src="${Be(Ee(e.avatarUrl))}" alt="" />`:``}
        <span class="account-name">${Be(e.username)}</span>
        <span class="nade-badge ${Be(e.role)}">${Be(e.role)}</span>
      </button>
      <button class="btn ghost btn-sm" id="hdr-logout">Log out</button>`,Le.querySelector(`#hdr-profile`).addEventListener(`click`,()=>document.dispatchEvent(new CustomEvent(`aimkit:navigate`,{detail:`profile`}))),Le.querySelector(`#hdr-logout`).addEventListener(`click`,()=>Ie())):(Le.innerHTML=`
      <button class="btn ghost btn-sm" id="hdr-login">Log in</button>
      <button class="btn primary btn-sm" id="hdr-register">Register</button>`,Le.querySelector(`#hdr-login`).addEventListener(`click`,()=>Xe(`login`)),Le.querySelector(`#hdr-register`).addEventListener(`click`,()=>Xe(`register`)))}function He(){let e=Re===`login`,t=Re===`forgot`;if(Re===`verify`){_.innerHTML=`
      <div class="modal-backdrop" data-close></div>
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Verify your email">
        <button class="modal-close" data-close aria-label="Close">&times;</button>
        <h2 class="modal-title">Verify your email</h2>
        <p class="hint">We sent a verification link to <strong>${Be(ze)}</strong>. Click it to activate your account, then log in.</p>
        <div class="actions">
          <button class="btn" id="hdr-resend" type="button">Resend email</button>
          <button class="btn ghost" data-mode="login" type="button">Back to log in</button>
        </div>
        <p class="status" id="hdr-auth-status"></p>
      </div>`,_.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,Ze)),_.querySelectorAll(`[data-mode]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.mode))),_.querySelector(`#hdr-resend`)?.addEventListener(`click`,Ge);return}_.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Account">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${t?`Reset your password`:e?`Welcome back`:`Create your account`}</h2>
      ${t?``:`<div class="auth-tabs">
               <button class="tab ${e?`active`:``}" data-mode="login">Log in</button>
               <button class="tab ${e?``:`active`}" data-mode="register">Register</button>
             </div>`}
      <form id="hdr-auth-form" class="auth-form-modal">
        ${!e&&!t?`<label class="field"><span>Username</span><input id="hdr-username" type="text" autocomplete="username" /></label>`:``}
        <label class="field"><span>Email</span><input id="hdr-email" type="email" autocomplete="email" /></label>
        ${t?``:`<label class="field"><span>Password</span><input id="hdr-password" type="password" autocomplete="${e?`current-password`:`new-password`}" /></label>`}
        ${v.required&&!t?`<div class="captcha-field">
                 <div class="captcha-row">
                   <div class="captcha-image" id="hdr-captcha-img">${v.svg}</div>
                   <button type="button" class="captcha-refresh" id="hdr-captcha-refresh" title="New image" aria-label="New image">&#8635;</button>
                 </div>
                 <label class="field"><span>Enter the characters above</span><input id="hdr-captcha" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>
               </div>`:``}
        <button class="btn primary" type="submit">${t?`Send reset link`:e?`Log in`:`Create account`}</button>
        <p class="auth-alt">${t?`<button type="button" class="linkish" data-mode="login">← Back to log in</button>`:e?`<button type="button" class="linkish" data-mode="forgot">Forgot password?</button>`:``}</p>
        <p class="status" id="hdr-auth-status"></p>
      </form>
      ${t?``:`<div class="auth-divider"><span>or</span></div>
             <a class="btn steam-login" href="${Ce}">
               <svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Z"/></svg>
               Sign in with Steam
             </a>`}
    </div>`,_.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,Ze)),_.querySelectorAll(`[data-mode]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.mode))),_.querySelector(`#hdr-auth-form`).addEventListener(`submit`,Je),_.querySelector(`#hdr-captcha-refresh`)?.addEventListener(`click`,async()=>{await Ue();let e=_.querySelector(`#hdr-captcha-img`);e&&(e.innerHTML=v.svg);let t=_.querySelector(`#hdr-captcha`);t&&(t.value=``)}),_.querySelector(`#hdr-email`)?.focus()}async function Ue(){try{let e=await g.auth.captcha();v.token=e.token,v.svg=e.svg}catch{}}async function We(e){Re=e,e===`register`?(v.required=!0,v.svg||await Ue()):e!==`verify`&&(v.required=!1),He()}async function Ge(){try{Ke((await g.auth.resendVerification(ze)).message||`Verification email sent.`,`ok`)}catch(e){Ke(e.message,`error`)}}function Ke(e,t){let n=_.querySelector(`#hdr-auth-status`);n&&(n.textContent=e,n.className=`status ${t||``}`.trim())}function qe(){let e=_.querySelector(`#hdr-email`)?.value||``,t=_.querySelector(`#hdr-password`)?.value||``,n=_.querySelector(`#hdr-username`)?.value||``;He();let r=_.querySelector(`#hdr-email`);r&&(r.value=e);let i=_.querySelector(`#hdr-password`);i&&(i.value=t);let a=_.querySelector(`#hdr-username`);a&&(a.value=n)}async function Je(e){e.preventDefault();let t=_.querySelector(`#hdr-email`)?.value||``,n=_.querySelector(`#hdr-password`)?.value||``,r=_.querySelector(`#hdr-username`)?.value||``,i=_.querySelector(`#hdr-captcha`)?.value||``;if(Re===`forgot`){try{await g.auth.forgot(t),Ke(`If an account exists for that email, a reset link is on its way.`,`ok`)}catch(e){Ke(e.message,`error`)}return}if(Re===`register`){try{let e=await Pe({email:t,username:r,password:n,captchaToken:v.token,captchaAnswer:i});if(e&&e.verifyRequired){ze=e.email||t,v={required:!1,token:null,svg:``},await We(`verify`),Ke(e.message||`Check your email to verify your account.`,`ok`);return}v={required:!1,token:null,svg:``},Ze()}catch(e){v.required=!0,await Ue(),qe(),Ke(e.message,`error`)}return}try{await Ne({email:t,password:n,captchaToken:v.token,captchaAnswer:i}),v={required:!1,token:null,svg:``},Ze()}catch(e){if(e?.data?.verifyRequired){ze=e.data.email||t,await We(`verify`),Ke(e.message,`error`);return}e?.data?.captchaRequired&&(v.required=!0,await Ue(),qe()),Ke(e.message,`error`)}}function Ye(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Reset password">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Choose a new password</h2>
      <form id="reset-form" class="auth-form-modal">
        <label class="field"><span>New password</span><input id="reset-password" type="password" autocomplete="new-password" /></label>
        <button class="btn primary" type="submit">Set new password</button>
        <p class="status" id="reset-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#reset-status`);t.querySelector(`#reset-form`).addEventListener(`submit`,async i=>{i.preventDefault();try{await g.auth.reset(e,t.querySelector(`#reset-password`).value),r.textContent=`Password updated! You can now log in.`,r.className=`status ok`,setTimeout(()=>{n(),Xe(`login`)},1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#reset-password`)?.focus()}function Xe(e){_.classList.remove(`hidden`),We(e)}function Ze(){_.classList.add(`hidden`)}function y(e=`login`){Xe(e)}async function Qe(){Le=document.querySelector(`#account-menu`),Le&&(_=document.createElement(`div`),_.id=`auth-modal`,_.className=`modal hidden`,document.body.appendChild(_),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Ze()}),je(()=>Ve()),Ve(),await Me())}var $e=[{id:`mirage`,name:`Mirage`},{id:`dust2`,name:`Dust II`},{id:`inferno`,name:`Inferno`},{id:`nuke`,name:`Nuke`},{id:`ancient`,name:`Ancient`},{id:`anubis`,name:`Anubis`},{id:`overpass`,name:`Overpass`},{id:`vertigo`,name:`Vertigo`},{id:`train`,name:`Train`}],et=[{id:`smoke`,name:`Smoke`,color:`#cdd6e3`},{id:`flash`,name:`Flash`,color:`#f4ec9b`},{id:`molotov`,name:`Molotov`,color:`#ff7a3c`},{id:`he`,name:`HE Grenade`,color:`#8fd694`},{id:`decoy`,name:`Decoy`,color:`#9aa8ff`}],tt=[{id:`stand`,name:`Standing throw`},{id:`jump`,name:`Jump throw`},{id:`jumpthrow`,name:`Jumpthrow bind`},{id:`run`,name:`Running throw`},{id:`runjump`,name:`Run + jump throw`},{id:`walk`,name:`Walking throw`}],nt=[{id:`t`,name:`T side`},{id:`ct`,name:`CT side`}];function rt(e){return $e.find(t=>t.id===e)?.name??e}function it(e){return et.find(t=>t.id===e)??et[0]}function at(e){return tt.find(t=>t.id===e)?.name??e}function ot(e){return nt.find(t=>t.id===e)?.name??e}function st(e){let t=(e||``).toLowerCase();return/youtube\.com|youtu\.be|\.mp4|\.webm|\.mov|streamable\.com/.test(t)?`video`:`image`}var ct={},lt=new WeakMap;function ut(e){return`./maps/${e}.png`}function dt(e,t){let n=ct[e];return n||(n={img:new Image,loaded:!1,error:!1,waiters:new Set},ct[e]=n,n.img.onload=()=>{n.loaded=!0,n.waiters.forEach(e=>e()),n.waiters.clear()},n.img.onerror=()=>{n.error=!0,n.waiters.clear()},n.img.src=ut(e)),!n.loaded&&!n.error&&t&&n.waiters.add(t),n}function ft(e,t,n,r){let i=e.createLinearGradient(0,0,t,t);i.addColorStop(0,`#26313f`),i.addColorStop(.5,`#2f3d4e`),i.addColorStop(1,`#222b37`),e.fillStyle=i,e.fillRect(0,0,t,t);let a=dt(n,r);if(a.loaded){e.drawImage(a.img,0,0,t,t),e.fillStyle=`rgba(13,17,23,0.18)`,e.fillRect(0,0,t,t);return}e.strokeStyle=`rgba(255,255,255,0.06)`,e.lineWidth=1;for(let n=0;n<=t;n+=t/10)e.beginPath(),e.moveTo(n,0),e.lineTo(n,t),e.stroke(),e.beginPath(),e.moveTo(0,n),e.lineTo(t,n),e.stroke();e.fillStyle=`rgba(255,255,255,0.10)`,e.font=`600 22px Outfit, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(rt(n).toUpperCase(),t/2,t/2)}function pt(e,{mapId:t,type:n=`smoke`,start:r=null,end:i=null}){let a=e.getContext(`2d`);if(!a)return;let o=e.width;lt.set(e,{mapId:t,type:n,start:r,end:i}),a.clearRect(0,0,o,o),ft(a,o,t,()=>{let t=lt.get(e);t&&pt(e,t)});let s=it(n).color;if(r&&i){let e=r.x*o,t=r.y*o,n=i.x*o,c=i.y*o,l=(e+n)/2,u=(t+c)/2,d=Math.hypot(n-e,c-t),f=l,ee=u-Math.max(24,d*.35);a.strokeStyle=s,a.lineWidth=3,a.setLineDash([8,6]),a.beginPath(),a.moveTo(e,t),a.quadraticCurveTo(f,ee,n,c),a.stroke(),a.setLineDash([]);let p=.92,te=(1-p)*(1-p)*e+2*(1-p)*p*f+p*p*n,ne=(1-p)*(1-p)*t+2*(1-p)*p*ee+p*p*c,re=Math.atan2(c-ne,n-te);a.fillStyle=s,a.beginPath(),a.moveTo(n,c),a.lineTo(n-12*Math.cos(re-.4),c-12*Math.sin(re-.4)),a.lineTo(n-12*Math.cos(re+.4),c-12*Math.sin(re+.4)),a.closePath(),a.fill()}r&&mt(a,r.x*o,r.y*o,`#3ecf8e`,`THROW`),i&&ht(a,i.x*o,i.y*o,s),(!r||!i)&&(a.fillStyle=`rgba(255,255,255,0.55)`,a.font=`13px Outfit, sans-serif`,a.textAlign=`center`,a.textBaseline=`bottom`,a.fillText(r?`Click again to set the landing spot`:`Click the map to set your throw position`,o/2,o-12))}function mt(e,t,n,r,i){e.beginPath(),e.fillStyle=r,e.arc(t,n,7,0,Math.PI*2),e.fill(),e.lineWidth=2,e.strokeStyle=`#0d1117`,e.stroke(),i&&(e.fillStyle=`#fff`,e.font=`600 10px JetBrains Mono, monospace`,e.textAlign=`center`,e.textBaseline=`bottom`,e.fillText(i,t,n-10))}function ht(e,t,n,r){e.strokeStyle=r,e.lineWidth=3,e.beginPath(),e.arc(t,n,11,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(t-6,n-6),e.lineTo(t+6,n+6),e.moveTo(t+6,n-6),e.lineTo(t-6,n+6),e.stroke()}function gt(e,t){let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width,i=(t.clientY-n.top)/n.height;return{x:Math.max(0,Math.min(1,r)),y:Math.max(0,Math.min(1,i))}}function _t(e,t){let n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,i.rel=`noopener`,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),2e3)}function vt(e,t={}){let n=t.guide!==!1,r=t.cfg!==!1,i=[];if(n&&e.guideText&&(_t(`${e.loadName}.txt`,e.guideText),i.push(`${e.loadName}.txt`)),r&&e.cfgText){let t=i.length?400:0;setTimeout(()=>_t(`${e.cfgBaseName}.cfg`,e.cfgText),t),i.push(`${e.cfgBaseName}.cfg`)}return i}function yt(e){if(!e?.steamUrl)throw Error(`Missing Steam launch URL.`);let t=document.createElement(`a`);t.href=e.steamUrl,t.rel=`noopener`,t.style.display=`none`,document.body.appendChild(t),t.click(),t.remove()}async function bt(e){let t=e?.consoleCommand;if(!t)throw Error(`Missing console command.`);return await navigator.clipboard.writeText(t),t}function xt(e){return e?.querySelector(`#try-dl-guide`)?.checked,e?.querySelector(`#try-dl-cfg`)?.checked,!e?.querySelector(`#try-dl-guide`)&&!e?.querySelector(`#try-dl-cfg`)?{guide:!0,cfg:!0}:{guide:!!e.querySelector(`#try-dl-guide`)?.checked,cfg:!!e.querySelector(`#try-dl-cfg`)?.checked}}function St(e,{esc:t,lineupCount:n=1}){if(!e)return``;let r=n>1?`${n} lineups merged into one annotation file`:`1 lineup annotation file`,i=`game/csgo/annotations/local/${e.loadName}/${e.loadName}.txt`,a=`game/csgo/cfg/${e.cfgBaseName}.cfg`;return`
    <div class="try-game-modal" role="dialog" aria-modal="true" aria-label="Try in game">
      <div class="try-game-card">
        <header class="try-game-head">
          <h3>Try in CS2</h3>
          <p class="hint">Private practice on <strong>${t(e.deMap)}</strong> — ${t(r)}. Skip downloads if you already have the files in your CS2 folders.</p>
        </header>

        <div class="try-game-choices">
          <label class="try-game-choice" for="try-dl-guide">
            <input type="checkbox" id="try-dl-guide" checked />
            <span class="try-game-choice-body">
              <span class="try-game-choice-title">Annotation file <code>${t(e.loadName)}.txt</code></span>
              <span class="try-game-path"><span class="try-game-path-arrow" aria-hidden="true">→</span><code>${t(i)}</code></span>
            </span>
          </label>
          <label class="try-game-choice" for="try-dl-cfg">
            <input type="checkbox" id="try-dl-cfg" checked />
            <span class="try-game-choice-body">
              <span class="try-game-choice-title">Practice CFG <code>${t(e.cfgBaseName)}.cfg</code></span>
              <span class="try-game-path"><span class="try-game-path-arrow" aria-hidden="true">→</span><code>${t(a)}</code></span>
              <span class="hint try-game-choice-note">loads <code>annotation_load ${t(e.loadName)}</code></span>
            </span>
          </label>
        </div>

        <ol class="nade-steps try-game-steps">
          <li>Download only what you still need (or nothing if it’s already installed).</li>
          <li>
            Copy the annotation into
            <code>game/csgo/annotations/local/${t(e.loadName)}/${t(e.loadName)}.txt</code>
            (create the <code>${t(e.loadName)}</code> folder — CS2 expects that nested path).
          </li>
          <li>Copy the CFG into <code>game/csgo/cfg/${t(e.cfgBaseName)}.cfg</code>.</li>
          <li>
            Click <strong>Open CS2</strong> — Steam starts a private <code>${t(e.deMap)}</code> server
            with <code>+exec ${t(e.cfgBaseName)}</code>.
          </li>
          <li class="hint">
            If CS2 was already open, quit first, or paste in console (~):
            <code>${t(e.consoleCommand||`map ${e.deMap}; exec ${e.cfgBaseName}`)}</code>
          </li>
          <li class="hint">
            If markers still don’t show: confirm the nested folder path, then run
            <code>sv_allow_annotations_access_level 2; annotation_load ${t(e.loadName)}</code>
          </li>
        </ol>

        <div class="try-game-actions actions">
          <button class="btn" type="button" data-try-game-download>Download selected</button>
          <button class="btn primary" type="button" data-try-game-open>Open CS2</button>
          <button class="btn ghost" type="button" data-try-game-copy-cmd>Copy console cmd</button>
          <button class="btn ghost" type="button" data-try-game-close>Close</button>
        </div>
        <p class="hint try-game-status" data-try-game-status></p>
      </div>
    </div>`}function Ct(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}var wt={error:`Something went wrong`,warn:`Heads up`,ok:`Done`},Tt=null,Et=null,Dt=null;function Ot(){return Tt?.isConnected?Tt:(Tt=document.createElement(`div`),Tt.className=`app-toast-host`,Tt.setAttribute(`aria-live`,`assertive`),Tt.setAttribute(`aria-relevant`,`additions`),document.body.appendChild(Tt),Tt)}function kt(){Et&&clearTimeout(Et),Dt&&clearTimeout(Dt),Et=null,Dt=null}function At(e,t={}){let n=t.kind===`ok`||t.kind===`warn`?t.kind:`error`,r=t.title||wt[n],i=Number.isFinite(t.duration)?t.duration:n===`ok`?2800:4500,a=String(e||``).trim();if(!a)return;let o=Ot();kt(),o.replaceChildren();let s=document.createElement(`div`);s.className=`app-toast app-toast--${n}`,s.setAttribute(`role`,`alert`),s.innerHTML=`
    <span class="app-toast-icon" aria-hidden="true"></span>
    <div class="app-toast-body">
      <strong class="app-toast-title">${Ct(r)}</strong>
      <p class="app-toast-msg">${Ct(a)}</p>
    </div>
    <button type="button" class="app-toast-close" aria-label="Dismiss">&times;</button>`;let c=()=>{kt(),s.classList.remove(`app-toast-in`),s.classList.add(`app-toast-out`),Dt=setTimeout(()=>{s.parentNode===o&&s.remove()},220)};s.querySelector(`.app-toast-close`)?.addEventListener(`click`,c),o.appendChild(s),requestAnimationFrame(()=>{requestAnimationFrame(()=>s.classList.add(`app-toast-in`))}),Et=setTimeout(c,i)}function jt(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Mt(e,t={}){let n=String(e?.authorName||`Unknown`).trim()||`Unknown`,r=e?.authorAvatar?Ee(e.authorAvatar):``,i=(n[0]||`?`).toUpperCase(),a=t.date?String(t.date):``;return`<span class="author-chip">
    <span class="author-avatar" aria-hidden="true">${r?`<img src="${jt(r)}" alt="" loading="lazy" />`:`<span class="author-initial">${jt(i)}</span>`}</span>
    <span class="author-meta">
      <span class="author-name">${jt(n)}</span>${a?`<span class="author-date">${jt(a)}</span>`:``}
    </span>
  </span>`}var Nt=360,Pt=100,b,x=null,S=`browse`,Ft={text:``,kind:``},It=0,Lt=!1,Rt={map:``,type:``},zt=[],C=new Map,Bt={counts:{},mine:[]},Vt=[],Ht=[],Ut=[],Wt=[],w=Kt(),T=qt(),E=null,Gt=1;function Kt(){return{map:`mirage`,type:`smoke`,side:`t`,technique:`stand`,title:``,description:``,start:null,end:null}}function qt(){return{text:``,fileName:``,side:`t`,parsed:null,selected:null}}function D(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Jt(e){let t=Ee(e);return/^https?:\/\//.test(t)||t.startsWith(`data:image/`)?t:``}function Yt(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function Xt(e,t){return e.map(e=>`<option value="${e.id}"${e.id===t?` selected`:``}>${D(e.name)}</option>`).join(``)}function O(e,t=``,n={}){Ft={text:e,kind:t};let r=b?.querySelector(`#nades-status`);r&&(r.textContent=e,r.className=`status${t?` ${t}`:``}`),(t===`error`||t===`warn`)&&e&&At(e,{kind:t,title:n.title})}function Zt(e){return`<span class="nade-badge ${e}">${e}</span>`}function Qt(e){try{return new Date(e).toLocaleDateString()}catch{return``}}async function $t(){if(h(x))try{It=await g.admin.pendingCount()}catch{It=0}else It=0}async function en(){try{Bt=await g.nades.social()}catch{Bt={counts:{},mine:[]}}}async function k(e){S=e,Lt=![`add`,`import`].includes(e),Lt&&A();try{S===`browse`&&(zt=await g.nades.list(Rt),await en()),S===`favorites`&&(x?(Vt=await g.nades.favorites(Rt),await en()):Vt=[]),S===`mine`&&x&&(Ht=await g.nades.mine()),S===`review`&&h(x)&&(Ut=await g.admin.pending(),It=await g.admin.pendingCount()),S===`users`&&h(x)&&(Wt=await g.admin.users())}catch(e){O(e.message,`error`)}Lt=!1,A()}function tn(e){let t=Jt(e.url);if(!t)return``;if(e.kind===`video`){let n=Yt(e.url);return n?`<iframe class="nade-media-embed" src="https://www.youtube.com/embed/${D(n)}" title="nade video" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e.url)?`<video class="nade-media-embed" src="${D(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${D(t)}" target="_blank" rel="noopener noreferrer">Open video ↗</a>`}return`<a href="${D(t)}" target="_blank" rel="noopener noreferrer"><img class="nade-media-img" src="${D(t)}" alt="${D(e.addedByName||`nade media`)}" loading="lazy" /></a>`}function nn(e,{showStatus:t=!1,showTryInGame:n=!1,adminRemove:r=!1,showFavorite:i=!1}={}){let a=it(e.type),o=(e.media||[]).filter(e=>t?!0:e.status===`approved`),s=o.length?`<div class="nade-media">${o.map(e=>`<div class="nade-media-item">${tn(e)}${t?`<div class="nade-media-meta">${Zt(e.status)} <span>by ${D(e.addedByName||``)}</span></div>`:``}</div>`).join(``)}</div>`:`<p class="hint">No approved media yet — a 2D throw preview is shown above.</p>`,c=n&&C.has(e.id),l=Bt.mine.includes(e.id),u=Bt.counts[e.id]||0,d=i?`<button class="btn btn-sm favorite ${l?`active`:``}" type="button" data-favorite-nade="${e.id}" title="${l?`Remove from favorites`:`Add to favorites`}">${l?`★ Favorited`:`☆ Favorite`}${u?` <span class="fav-count">${u}</span>`:``}</button>`:``,f=n?`<div class="nade-card-actions">
         <label class="browse-nade-check">
           <input type="checkbox" class="browse-select" value="${e.id}" data-map="${D(e.map)}" ${c?`checked`:``} />
           <span>Select</span>
         </label>
         ${d}
         <button class="btn" type="button" data-try-nades="${e.id}">Try in game</button>
         ${r&&h(x)?`<button class="btn ghost danger" type="button" data-delete-nade="${e.id}">Remove</button>`:``}
       </div>`:d||r&&h(x)?`<div class="nade-card-actions">
           ${d}
           ${r&&h(x)?`<button class="btn ghost danger" type="button" data-delete-nade="${e.id}">Remove</button>`:``}
         </div>`:``;return`
    <article class="nade-card${n?` browse-nade-card`:``}${c?` selected`:``}${l&&i?` favorited`:``}"${n?` data-browse-nade="${e.id}" data-map="${D(e.map)}" tabindex="0" role="checkbox" aria-checked="${c?`true`:`false`}"`:``}>
      <div class="nade-card-head">
        <div>
          <h3>${D(e.title)}</h3>
          <p class="nade-sub">
            <span class="nade-chip" style="--chip:${a.color}">${D(a.name)}</span>
            ${D(rt(e.map))} · ${D(ot(e.side))} · ${D(at(e.technique))}
          </p>
        </div>
        ${t?Zt(e.status):``}
      </div>
      <canvas class="nade-canvas" width="${Nt}" height="${Nt}"
        data-map="${D(e.map)}" data-type="${D(e.type)}"
        data-sx="${e.start.x}" data-sy="${e.start.y}" data-ex="${e.end.x}" data-ey="${e.end.y}"></canvas>
      ${e.description?`<p class="nade-desc">${D(e.description)}</p>`:``}
      ${s}
      <div class="nade-foot">${Mt(e,{date:Qt(e.createdAt)})}</div>
      ${f}
    </article>`}function rn(){return[...C.keys()]}function an(){let e=zt.length?zt.map(e=>nn(e,{showTryInGame:!0,adminRemove:!0,showFavorite:!0})).join(``):`<p class="hint">No approved nades yet${x?` — be the first to add one!`:` — log in and add the nades you found.`}</p>`,t=C.size;return`
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${Xt($e,Rt.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${Xt(et,Rt.type)}</select>
      </label>
    </div>
    <div class="browse-select-bar">
      <span class="hint">Click a lineup to select it (up to ${Pt}, same map) for one merged annotation file.</span>
      <button class="btn ghost" type="button" id="browse-select-clear" ${t?``:`disabled`}>Clear selection</button>
      <button class="btn primary" type="button" id="browse-try-selected" ${t?``:`disabled`}>
        Try selected in game (${t}/${Pt})
      </button>
    </div>
    <div class="nade-grid">${e}</div>`}function on(){if(!x)return sn(`save favorite nades`);let e=Vt.length?Vt.map(e=>nn(e,{showTryInGame:!0,adminRemove:!0,showFavorite:!0})).join(``):`<p class="hint">No favorites yet — star lineups in Browse to save them here.</p>`,t=C.size;return`
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${Xt($e,Rt.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${Xt(et,Rt.type)}</select>
      </label>
    </div>
    <div class="browse-select-bar">
      <span class="hint">Your saved lineups. Select up to ${Pt} (same map) to try in game.</span>
      <button class="btn ghost" type="button" id="browse-select-clear" ${t?``:`disabled`}>Clear selection</button>
      <button class="btn primary" type="button" id="browse-try-selected" ${t?``:`disabled`}>
        Try selected in game (${t}/${Pt})
      </button>
    </div>
    <div class="nade-grid">${e}</div>`}function sn(e){return`<div class="login-prompt">
    <p class="hint">Log in or create an account to ${D(e)}.</p>
    <div class="actions">
      <button class="btn primary" data-open-auth="login">Log in</button>
      <button class="btn" data-open-auth="register">Register</button>
    </div>
  </div>`}function cn(){return x?`
    <div class="nade-add">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>Pick the <strong>map</strong> and <strong>grenade type</strong> on the right.</li>
          <li>Click the map once to drop your <strong>throw position</strong>.</li>
          <li>Click again to set the <strong>landing spot</strong>.</li>
          <li>Fill in the details, add optional media, and submit for review.</li>
        </ol>
        <canvas id="nade-add-canvas" class="nade-canvas interactive" width="${Nt}" height="${Nt}"></canvas>
        <p class="hint" id="nade-add-coords">Step 2: click the map to set your throw position.</p>
      </div>
      <form class="nade-add-form" id="nade-add-form">
        <label class="field"><span>Title</span><input id="add-title" type="text" maxlength="160" placeholder="A site smoke from T ramp" value="${D(w.title)}" /></label>
        <div class="sens-grid">
          <label class="field"><span>Map</span><select id="add-map">${Xt($e,w.map)}</select></label>
          <label class="field"><span>Type</span><select id="add-type">${Xt(et,w.type)}</select></label>
        </div>
        <div class="sens-grid">
          <label class="field"><span>Side</span><select id="add-side">${Xt(nt,w.side)}</select></label>
          <label class="field"><span>Technique</span><select id="add-technique">${Xt(tt,w.technique)}</select></label>
        </div>
        <label class="field"><span>Description (optional)</span><textarea id="add-description" rows="3" placeholder="Where to stand, what to line up, jumpthrow timing...">${D(w.description)}</textarea></label>
        <label class="field"><span>Video URL (optional — YouTube or .mp4)</span><input id="add-video" type="url" placeholder="https://youtu.be/..." /></label>
        <label class="field"><span>Image URL (optional)</span><input id="add-image" type="url" placeholder="https://.../lineup.jpg" /></label>
        <label class="field"><span>Or upload an image (optional)</span><input id="add-upload" type="file" accept="image/*" /></label>
        <div class="actions">
          <button class="btn primary" type="submit">Submit for review</button>
          <button class="btn ghost" type="button" id="add-clear">Clear points</button>
        </div>
        <p class="hint">Submissions are reviewed by an admin before appearing publicly.</p>
      </form>
    </div>`:sn(`add nades`)}function ln(){if(!x)return sn(`import a CS2 map guide`);let e=T.parsed,t=e&&T.selected!=null?e.nades[T.selected]:e?.nades?.[0]||null,n=e?`<div class="guide-preview-list">
        ${e.nades.map((e,t)=>{let n=it(e.type);return`<button type="button" class="guide-preview-item ${(T.selected??0)===t?`active`:``}" data-guide-idx="${t}">
              <span class="nade-chip" style="--chip:${n.color}">${D(n.name)}</span>
              <strong>${D(e.title)}</strong>
              <span class="hint">${D(at(e.technique))}</span>
            </button>`}).join(``)}
      </div>`:``;return`
    <div class="nade-import">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>In CS2, save a guide with <code>annotation_save name</code>.</li>
          <li>Upload the <code>.txt</code> from <code>game/csgo/annotations/local/</code> (or paste it).</li>
          <li>Preview lineups on the radar, then import — they enter review as pending.</li>
        </ol>
        <canvas id="guide-preview-canvas" class="nade-canvas" width="${Nt}" height="${Nt}"></canvas>
        <p class="hint" id="guide-preview-label">${t?`${D(t.title)} · ${D(rt(t.map))}`:`Parsed lineups will preview here.`}</p>
        ${n}
      </div>
      <div class="nade-add-form">
        <label class="field">
          <span>Map guide file (.txt)</span>
          <input id="guide-file" type="file" accept=".txt,text/plain" />
        </label>
        ${T.fileName?`<p class="hint">Loaded: <strong>${D(T.fileName)}</strong></p>`:``}
        <label class="field">
          <span>Or paste guide text</span>
          <textarea id="guide-text" rows="10" placeholder="<!-- kv3 encoding:text:... -->&#10;{&#10;  MapName = &quot;de_mirage&quot;&#10;  MapAnnotationNode0 = { ... }&#10;}">${D(T.text)}</textarea>
        </label>
        <label class="field">
          <span>Default side for imported nades</span>
          <select id="guide-side">${Xt(nt,T.side)}</select>
        </label>
        <div class="actions">
          <button class="btn" type="button" id="guide-parse">Preview lineups</button>
          <button class="btn primary" type="button" id="guide-import" ${e?``:`disabled`}>
            Import ${e?e.nades.length:``} for review
          </button>
          <button class="btn" type="button" id="guide-try-game" ${e?``:`disabled`}>
            Try in game
          </button>
          <button class="btn ghost" type="button" id="guide-clear">Clear</button>
        </div>
        ${e?`<p class="hint">Detected <strong>${D(rt(e.map))}</strong> (${D(e.mapName)}) — ${e.nades.length} grenade lineup${e.nades.length===1?``:`s`}${e.skipped?`, skipped ${e.skipped}`:``}.</p>`:`<p class="hint">Official CS2 Map Guides / annotation files only. World coords are mapped onto AimKit’s radar automatically.</p>`}
      </div>
    </div>`}function un(){return x?Ht.length?`<div class="nade-grid">${Ht.map(e=>`
      <div class="nade-mine">
        ${nn(e,{showStatus:!0})}
        ${e.reviewNote?`<p class="hint">Reviewer note: ${D(e.reviewNote)}</p>`:``}
        <div class="nade-add-media">
          <input type="url" class="add-media-url" data-nade="${e.id}" placeholder="Add media URL (image or video)" />
          <button class="btn" data-add-media="${e.id}">Add media</button>
          ${e.guideImportId?`<button class="btn" data-try-import="${e.guideImportId}">Try in game</button>`:``}
          <button class="btn ghost" data-delete-nade="${e.id}">Delete</button>
        </div>
      </div>`).join(``)}</div>`:`<p class="hint">You haven't added any nades yet.</p>`:sn(`see and manage your nades`)}function dn(){return h(x)?Ut.length?`
    <div class="review-bulk-bar">
      <label class="review-select-all">
        <input type="checkbox" id="review-select-all" />
        <span>Select all pending nades (${Ut.filter(e=>e.status===`pending`).length})</span>
      </label>
      <input type="text" id="review-bulk-note" placeholder="Optional note for bulk decision" />
      <button class="btn primary" type="button" id="review-bulk-approve" disabled>Approve selected</button>
      <button class="btn ghost" type="button" id="review-bulk-reject" disabled>Reject selected</button>
    </div>
    <div class="nade-grid">${Ut.map(e=>{let t=e.media||[],n=t.length?`<div class="review-media">${t.map(e=>`<div class="review-media-item">${tn(e)}
                  <div class="nade-media-meta">${Zt(e.status)} <span>by ${D(e.addedByName||``)}</span></div>
                  <div class="actions">
                    ${e.status===`pending`?`<button class="btn" data-approve-media="${e.id}">Approve media</button>
                           <button class="btn ghost" data-reject-media="${e.id}">Reject</button>`:e.status===`approved`?`<button class="btn ghost" data-reject-media="${e.id}">Unpublish</button>`:`<button class="btn" data-approve-media="${e.id}">Approve media</button>`}
                    <button class="btn ghost danger" data-delete-media="${e.id}">Remove</button>
                  </div></div>`).join(``)}</div>`:``,r=e.status===`pending`?`<div class="review-actions">
                 <label class="review-check">
                   <input type="checkbox" class="review-nade-check" value="${e.id}" />
                   <span>Select</span>
                 </label>
                 <div class="review-actions-btns">
                   <button class="btn primary" data-approve-nade="${e.id}">Approve</button>
                   <button class="btn ghost" data-reject-nade="${e.id}">Reject</button>
                   <button class="btn ghost danger" data-delete-nade="${e.id}">Delete</button>
                 </div>
                 <input type="text" class="review-note" data-nade="${e.id}" placeholder="Optional note to the author" />
               </div>`:`<div class="review-actions">
                 <p class="hint">Nade already ${D(e.status)} — you can still unpublish, re-approve, or delete it.</p>
                 <div class="review-actions-btns">
                   ${e.status===`approved`?`<button class="btn ghost" data-reject-nade="${e.id}">Unpublish</button>`:`<button class="btn primary" data-approve-nade="${e.id}">Approve</button>`}
                   <button class="btn ghost danger" data-delete-nade="${e.id}">Delete</button>
                 </div>
                 <input type="text" class="review-note" data-nade="${e.id}" placeholder="Optional note to the author" />
               </div>`;return`<div class="nade-mine">${nn(e,{showStatus:!0})}${n}${r}</div>`}).join(``)}</div>`:`<p class="hint">Nothing pending review. Nice and clean.</p>`:`<p class="hint">Admins only.</p>`}function fn(e){if(!e.bannedUntil)return null;let t=new Date(e.bannedUntil);return t.getTime()<=Date.now()?null:t.getFullYear()>=9999?`permanently`:`until ${t.toLocaleString()}`}function pn(){if(!h(x))return`<p class="hint">Admins only.</p>`;let e=Te(x);return`<div class="users-table">
    ${e?`<p class="hint users-table-hint">Promote trusted users to admin, or remove admin access.</p>`:`<p class="hint users-table-hint">Only the site owner can promote users to admin.</p>`}
    ${Wt.map(t=>{let n=fn(t),r=t.role===`owner`?`<span class="hint">owner</span>`:e?t.role===`admin`?`<button class="btn btn-sm ghost" data-role-user="${t.id}" data-role="user">Remove admin</button>`:`<button class="btn btn-sm primary" data-role-user="${t.id}" data-role="admin">Promote to admin</button>`:`<span class="hint">${D(t.role)}</span>`,i=t.role===`owner`?``:n?`<span class="nade-badge rejected">banned ${D(n)}</span> <button class="btn btn-sm ghost" data-unban="${t.id}">Unban</button>`:`<select class="ban-duration" data-ban-dur="${t.id}">
                   <option value="24">1 day</option>
                   <option value="168">7 days</option>
                   <option value="720">30 days</option>
                   <option value="perma">Permanent</option>
                 </select>
                 <button class="btn btn-sm ghost" data-ban="${t.id}">Ban</button>`;return`<div class="user-row">
          <div><strong>${D(t.username)}</strong><br /><span class="hint">${D(t.email)}</span></div>
          <div>${Zt(t.role)}</div>
          <div class="user-actions">${r}</div>
          <div class="user-actions">${i}</div>
        </div>`}).join(``)}
  </div>`}function mn(){let e=Bt.mine?.length||0,t=[[`browse`,`Browse`]];return x&&(t.push([`favorites`,`Favorites${e?` (${e})`:``}`]),t.push([`add`,`Add nade`],[`import`,`Import guide`],[`mine`,`My nades`])),h(x)&&t.push([`review`,`Review${It?` (${It})`:``}`],[`users`,`Users`]),`<nav class="nades-subnav">${t.map(([e,t])=>`<button class="tool-tab ${S===e?`active`:``}" data-view="${e}">${D(t)}</button>`).join(``)}</nav>`}function hn(){if(Lt)return`<div class="nades-loading"><span class="spinner"></span> Loading…</div>`;switch(S){case`add`:return cn();case`import`:return ln();case`favorites`:return on();case`mine`:return un();case`review`:return dn();case`users`:return pn();default:return an()}}function A(){b.innerHTML=`
    <div class="nades-shell">
      ${mn()}
      <div class="nades-body">${hn()}</div>
      <div id="nades-status" class="status ${Ft.kind}">${D(Ft.text)}</div>
      ${E?St(E,{esc:D,lineupCount:Gt}):``}
    </div>`,yn(),gn()}function gn(){b.querySelectorAll(`canvas.nade-canvas:not(.interactive):not(#guide-preview-canvas)`).forEach(e=>{pt(e,{mapId:e.dataset.map,type:e.dataset.type,start:{x:Number(e.dataset.sx),y:Number(e.dataset.sy)},end:{x:Number(e.dataset.ex),y:Number(e.dataset.ey)}})}),_n(),vn()}function _n(){let e=b.querySelector(`#nade-add-canvas`);e&&pt(e,{mapId:w.map,type:w.type,start:w.start,end:w.end})}function vn(){let e=b.querySelector(`#guide-preview-canvas`);if(!e)return;let t=T.parsed?.nades?.[T.selected??0];if(!t){pt(e,{mapId:`mirage`,type:`smoke`,start:null,end:null});return}pt(e,{mapId:t.map,type:t.type,start:t.start,end:t.end})}function yn(){b.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>y(e.dataset.openAuth))),b.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>k(e.dataset.view))),b.querySelector(`#filter-map`)?.addEventListener(`change`,e=>{Rt.map=e.target.value,C=new Map,k(S===`favorites`?`favorites`:`browse`)}),b.querySelector(`#filter-type`)?.addEventListener(`change`,e=>{Rt.type=e.target.value,k(S===`favorites`?`favorites`:`browse`)}),b.querySelectorAll(`.browse-select`).forEach(e=>e.addEventListener(`change`,()=>{En(Number(e.value),e.dataset.map,e.checked),Dn(e.closest(`.browse-nade-card`))})),b.querySelectorAll(`.browse-nade-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`a, button, input, label`)||On(e)}),e.addEventListener(`keydown`,t=>{t.key!==` `&&t.key!==`Enter`||t.target.closest(`a, button, input, label`)||(t.preventDefault(),On(e))})}),b.querySelector(`#browse-select-clear`)?.addEventListener(`click`,()=>{C=new Map,A()}),b.querySelector(`#browse-try-selected`)?.addEventListener(`click`,()=>{An(rn())}),b.querySelectorAll(`[data-try-nades]`).forEach(e=>e.addEventListener(`click`,t=>{t.stopPropagation(),An([Number(e.dataset.tryNades)])})),b.querySelectorAll(`[data-favorite-nade]`).forEach(e=>e.addEventListener(`click`,t=>{t.stopPropagation(),jn(Number(e.dataset.favoriteNade))}));let e=b.querySelector(`#nade-add-canvas`);e&&e.addEventListener(`click`,t=>{let n=gt(e,t);!w.start||w.start&&w.end?(w.start=n,w.end=null):w.end=n;let r=b.querySelector(`#nade-add-coords`);r&&(r.textContent=w.end?`Throw + landing set. Adjust by clicking again to start over.`:`Now click the landing spot for the grenade.`),_n()}),b.querySelector(`#add-map`)?.addEventListener(`change`,e=>{w.map=e.target.value,_n()}),b.querySelector(`#add-type`)?.addEventListener(`change`,e=>{w.type=e.target.value,_n()}),b.querySelector(`#add-clear`)?.addEventListener(`click`,()=>{w.start=null,w.end=null,_n();let e=b.querySelector(`#nade-add-coords`);e&&(e.textContent=`Click the map to set the throw position, then click again for the landing spot.`)}),b.querySelector(`#nade-add-form`)?.addEventListener(`submit`,bn),b.querySelector(`#guide-file`)?.addEventListener(`change`,xn),b.querySelector(`#guide-text`)?.addEventListener(`input`,e=>{T.text=e.target.value}),b.querySelector(`#guide-side`)?.addEventListener(`change`,e=>{T.side=e.target.value}),b.querySelector(`#guide-parse`)?.addEventListener(`click`,Sn),b.querySelector(`#guide-import`)?.addEventListener(`click`,Cn),b.querySelector(`#guide-try-game`)?.addEventListener(`click`,wn),b.querySelector(`#guide-clear`)?.addEventListener(`click`,()=>{T=qt(),E=null,A(),O(`Cleared map guide.`,``)}),b.querySelectorAll(`[data-guide-idx]`).forEach(e=>e.addEventListener(`click`,()=>{T.selected=Number(e.dataset.guideIdx),A()})),b.querySelector(`[data-try-game-close]`)?.addEventListener(`click`,()=>{E=null,Gt=1,A()}),b.querySelector(`[data-try-game-download]`)?.addEventListener(`click`,()=>{if(!E)return;let e=xt(b);if(!e.guide&&!e.cfg){let e=b.querySelector(`[data-try-game-status]`);e&&(e.textContent=`Choose at least one file to download, or just Open CS2 if you already have them.`);return}let t=vt(E,e),n=b.querySelector(`[data-try-game-status]`);n&&(n.textContent=t.length?`Downloaded ${t.join(` + `)}. Copy into your CS2 folders, then Open CS2.`:`Nothing selected to download.`)}),b.querySelector(`[data-try-game-open]`)?.addEventListener(`click`,Mn),b.querySelector(`[data-try-game-copy-cmd]`)?.addEventListener(`click`,Nn),b.querySelectorAll(`[data-add-media]`).forEach(e=>e.addEventListener(`click`,()=>Pn(e.dataset.addMedia))),b.querySelectorAll(`[data-try-import]`).forEach(e=>e.addEventListener(`click`,()=>Tn(e.dataset.tryImport))),b.querySelectorAll(`[data-delete-nade]`).forEach(e=>e.addEventListener(`click`,()=>Fn(e.dataset.deleteNade))),b.querySelectorAll(`[data-delete-media]`).forEach(e=>e.addEventListener(`click`,()=>In(e.dataset.deleteMedia))),b.querySelectorAll(`[data-approve-nade]`).forEach(e=>e.addEventListener(`click`,()=>Ln(e.dataset.approveNade,`approved`))),b.querySelectorAll(`[data-reject-nade]`).forEach(e=>e.addEventListener(`click`,()=>Ln(e.dataset.rejectNade,`rejected`))),b.querySelectorAll(`[data-approve-media]`).forEach(e=>e.addEventListener(`click`,()=>zn(e.dataset.approveMedia,`approved`))),b.querySelectorAll(`[data-reject-media]`).forEach(e=>e.addEventListener(`click`,()=>zn(e.dataset.rejectMedia,`rejected`)));let t=b.querySelector(`#review-select-all`),n=b.querySelector(`#review-bulk-approve`),r=b.querySelector(`#review-bulk-reject`),i=()=>{let e=b.querySelectorAll(`.review-nade-check:checked`).length;n&&(n.disabled=e===0),r&&(r.disabled=e===0)};t?.addEventListener(`change`,()=>{b.querySelectorAll(`.review-nade-check`).forEach(e=>{e.checked=t.checked}),i()}),b.querySelectorAll(`.review-nade-check`).forEach(e=>e.addEventListener(`change`,i)),n?.addEventListener(`click`,()=>Rn(`approved`)),r?.addEventListener(`click`,()=>Rn(`rejected`)),b.querySelectorAll(`[data-role-user]`).forEach(e=>e.addEventListener(`click`,()=>Bn(e.dataset.roleUser,e.dataset.role))),b.querySelectorAll(`[data-ban]`).forEach(e=>e.addEventListener(`click`,()=>{let t=b.querySelector(`[data-ban-dur="${e.dataset.ban}"]`);Vn(e.dataset.ban,t?t.value:`24`)})),b.querySelectorAll(`[data-unban]`).forEach(e=>e.addEventListener(`click`,()=>Hn(e.dataset.unban)))}async function bn(e){if(e.preventDefault(),w.title=b.querySelector(`#add-title`)?.value||``,w.map=b.querySelector(`#add-map`)?.value||w.map,w.type=b.querySelector(`#add-type`)?.value||w.type,w.side=b.querySelector(`#add-side`)?.value||w.side,w.technique=b.querySelector(`#add-technique`)?.value||w.technique,w.description=b.querySelector(`#add-description`)?.value||``,!w.start||!w.end){O(`Click the map to set both the throw position and the landing spot.`,`error`);return}let t=[],n=(b.querySelector(`#add-video`)?.value||``).trim(),r=(b.querySelector(`#add-image`)?.value||``).trim();n&&t.push({url:n,kind:`video`}),r&&t.push({url:r,kind:st(r)});let i=b.querySelector(`#add-upload`);try{if(i?.files?.[0]){O(`Uploading image…`,``);let e=await g.uploads.image(i.files[0]);t.push({url:e.url,kind:`image`})}await g.nades.create({...w,media:t}),w=Kt(),await k(`mine`),O(`Nade submitted! It will appear publicly once an admin approves it.`,`ok`)}catch(e){O(e.message,`error`)}}async function xn(e){let t=e.target.files?.[0];if(t)try{T.fileName=t.name,T.text=await t.text(),T.parsed=null,T.selected=null,A(),O(`Loaded ${t.name}. Click Preview lineups.`,`ok`)}catch{O(`Could not read that file.`,`error`)}}async function Sn(){let e=(b.querySelector(`#guide-text`)?.value||T.text||``).trim();if(T.text=e,T.side=b.querySelector(`#guide-side`)?.value||T.side,!e){O(`Upload or paste a CS2 map guide .txt first.`,`error`);return}try{O(`Parsing map guide…`,``);let t=await g.nades.parseMapGuide(e);T.parsed=t,T.selected=0,A(),O(`Found ${t.nades.length} lineup${t.nades.length===1?``:`s`} on ${rt(t.map)}.`,`ok`)}catch(e){T.parsed=null,A(),O(e.message,`error`)}}async function Cn(){if(!T.parsed?.nades?.length){O(`Preview the guide first so you can confirm the lineups.`,`error`);return}T.side=b.querySelector(`#guide-side`)?.value||T.side;let e=(b.querySelector(`#guide-text`)?.value||T.text||``).trim();try{O(`Importing lineups…`,``);let t=await g.nades.importMapGuide({nades:T.parsed.nades,side:T.side,guideText:e,fileName:T.fileName});T=qt(),await k(`mine`),O(`Imported ${t.count} nade${t.count===1?``:`s`} — pending admin review.`,`ok`)}catch(e){O(e.message,`error`)}}async function wn(){let e=(b.querySelector(`#guide-text`)?.value||T.text||``).trim(),t=T.parsed?.map;if(!e||!t){O(`Preview the map guide first.`,`error`);return}try{O(`Preparing CS2 practice pack…`,``),E=(await g.nades.practicePackFromText({text:e,map:t})).pack,Gt=T.parsed?.nades?.length||1,A(),O(`Choose what to download (or skip if you already have the files), then Open CS2.`,`ok`)}catch(e){O(e.message,`error`)}}async function Tn(e){try{O(`Preparing CS2 practice pack…`,``),E=(await g.nades.practicePackFromImport(e)).pack,Gt=1,A(),O(`Choose what to download (or skip if you already have the files), then Open CS2.`,`ok`)}catch(e){O(e.message,`error`)}}function En(e,t,n){if(!Number.isFinite(e)||e<=0)return!1;if(!n)return C.delete(e),kn(),!0;if(C.size>=Pt&&!C.has(e))return O(`You can select at most ${Pt} lineups at once.`,`error`,{title:`Too many lineups`}),!1;for(let[,e]of C)if(e!==t)return O(`You can only select lineups from one map. Clear your selection or pick more from ${rt(e)}.`,`error`,{title:`One map only`}),!1;return C.set(e,t),kn(),!0}function Dn(e){if(!e)return;let t=Number(e.dataset.browseNade),n=C.has(t);e.classList.toggle(`selected`,n),e.setAttribute(`aria-checked`,n?`true`:`false`);let r=e.querySelector(`.browse-select`);r&&(r.checked=n)}function On(e){let t=Number(e.dataset.browseNade),n=e.dataset.map;En(t,n,!C.has(t)),Dn(e)}function kn(){let e=b.querySelector(`#browse-try-selected`),t=b.querySelector(`#browse-select-clear`),n=C.size;e&&(e.disabled=n===0,e.textContent=`Try selected in game (${n}/${Pt})`),t&&(t.disabled=n===0)}async function An(e){let t=[...new Set((e||[]).map(Number).filter(e=>Number.isFinite(e)&&e>0))];if(!t.length){O(`Select at least one lineup (max ${Pt}, same map).`,`error`,{title:`Nothing selected`});return}if(t.length>Pt){O(`You can open at most ${Pt} lineups at once.`,`error`,{title:`Too many lineups`});return}try{O(`Preparing CS2 practice pack…`,``),E=(await g.nades.practicePackFromNades(t)).pack,Gt=t.length,A(),O(t.length>1?`Merged ${t.length} lineups into one annotation file. Download what you need, then Open CS2.`:`Choose what to download (or skip if you already have the files), then Open CS2.`,`ok`)}catch(e){O(e.message,`error`)}}async function jn(e){if(!x){y(`login`);return}if(!(!Number.isFinite(e)||e<=0))try{let t=await g.nades.favorite(e);Bt.counts[e]=t.count,Bt.mine=t.favorited?[...Bt.mine.filter(t=>t!==e),e]:Bt.mine.filter(t=>t!==e),S===`favorites`&&!t.favorited&&(Vt=Vt.filter(t=>t.id!==e)),A(),O(t.favorited?`Added to favorites.`:`Removed from favorites.`,`ok`)}catch(e){O(e.message,`error`)}}function Mn(){if(!E)return;let e=b.querySelector(`[data-try-game-status]`);try{yt(E);let t=`Opening CS2 private ${E.deMap}… Quit CS2 first if it was already running, otherwise paste in console: ${E.consoleCommand||`map ${E.deMap}; exec ${E.cfgBaseName}`}`;e&&(e.textContent=t),O(t,`ok`)}catch(t){e&&(e.textContent=t.message),O(t.message,`error`)}}async function Nn(){if(!E)return;let e=b.querySelector(`[data-try-game-status]`);try{let t=`Copied: ${await bt(E)}`;e&&(e.textContent=t),O(t,`ok`)}catch(t){e&&(e.textContent=t.message),O(t.message,`error`)}}async function Pn(e){let t=(b.querySelector(`.add-media-url[data-nade="${e}"]`)?.value||``).trim();if(!t){O(`Enter a media URL first.`,`error`);return}try{await g.nades.addMedia(e,{url:t,kind:st(t)}),await k(`mine`),O(`Media added — pending admin review.`,`ok`)}catch(e){O(e.message,`error`)}}async function Fn(e){if(confirm(`Permanently delete this nade and its media?`))try{await g.nades.remove(e),C.delete(Number(e)),await k(S),O(`Nade deleted.`,`ok`)}catch(e){O(e.message,`error`)}}async function In(e){if(confirm(`Permanently remove this media?`))try{await g.admin.removeMedia(e),await k(S),O(`Media removed.`,`ok`)}catch(e){O(e.message,`error`)}}async function Ln(e,t){let n=b.querySelector(`.review-note[data-nade="${e}"]`)?.value||``;try{await g.admin.reviewNade(e,t,n),await k(`review`),O(`Nade ${t}.`,`ok`)}catch(e){O(e.message,`error`)}}async function Rn(e){let t=[...b.querySelectorAll(`.review-nade-check:checked`)].map(e=>Number(e.value));if(!t.length){O(`Select at least one pending nade.`,`error`);return}let n=b.querySelector(`#review-bulk-note`)?.value||``;try{let r=await g.admin.reviewNadesBulk(t,e,n);await k(`review`),O(`${e===`approved`?`Approved`:`Rejected`} ${r.updated} nade${r.updated===1?``:`s`}.`,`ok`)}catch(e){O(e.message,`error`)}}async function zn(e,t){try{await g.admin.reviewMedia(e,t),await k(`review`),O(`Media ${t}.`,`ok`)}catch(e){O(e.message,`error`)}}async function Bn(e,t){try{await g.admin.setRole(e,t),await k(`users`),O(`Role updated.`,`ok`)}catch(e){O(e.message,`error`)}}async function Vn(e,t){try{t===`perma`?await g.admin.banUser(e,{permanent:!0}):await g.admin.banUser(e,{hours:Number(t)}),await k(`users`),O(`User banned.`,`ok`)}catch(e){O(e.message,`error`)}}async function Hn(e){try{await g.admin.unbanUser(e),await k(`users`),O(`User unbanned.`,`ok`)}catch(e){O(e.message,`error`)}}async function Un(){b=document.querySelector(`#nades-tool`),b&&(x=Ae(),je(async e=>{x=e,await $t(),!x&&[`add`,`import`,`mine`,`favorites`,`review`,`users`].includes(S)&&(S=`browse`),x&&!h(x)&&[`review`,`users`].includes(S)&&(S=`browse`),await k(S)}),await $t(),A(),await k(`browse`))}function Wn(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Gn(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card import-card" role="dialog" aria-modal="true" aria-label="${Wn(e.title)}">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${Wn(e.title)}</h2>
      <p class="hint">${Wn(e.description)}</p>
      <ol class="import-steps">
        <li>Open the source and complete the verification: <a class="btn btn-sm" href="${Wn(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${Wn(e.sourceLabel)} ↗</a></li>
        <li>Copy the page content.</li>
        <li>Paste it below and import.</li>
      </ol>
      <textarea id="import-content" rows="9" spellcheck="false" placeholder="${Wn(e.placeholder||`Paste the page content here…`)}"></textarea>
      <div class="actions">
        <button class="btn primary" id="import-run">Import</button>
        <button class="btn ghost" data-close>Cancel</button>
      </div>
      <p class="status" id="import-status"></p>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=e=>{e.key===`Escape`&&(n(),document.removeEventListener(`keydown`,r))};document.addEventListener(`keydown`,r);let i=t.querySelector(`#import-status`),a=t.querySelector(`#import-run`);a.addEventListener(`click`,async()=>{let r=t.querySelector(`#import-content`).value;if(!r.trim()){i.textContent=`Paste the page content first.`,i.className=`status error`;return}a.disabled=!0,i.textContent=`Importing…`,i.className=`status`;try{let t=await e.onImport(r);i.textContent=t||`Imported.`,i.className=`status ok`,setTimeout(n,900)}catch(e){i.textContent=e.message,i.className=`status error`,a.disabled=!1}}),t.querySelector(`#import-content`)?.focus()}var j,Kn=null,M={commands:[],categories:[],recommendedLaunchOptions:``,source:`seed`,lastSync:0,cs2Build:``,cs2Version:``,remoteConfigured:!1},qn={counts:{},mine:[],comments:{}},Jn=[],Yn={text:``,kind:``},Xn=new Set;function N(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function P(e,t=``){Yn={text:e,kind:t};let n=j?.querySelector(`#commands-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Zn(e){if(!e)return`—`;try{return new Date(e).toLocaleString()}catch{return`—`}}async function Qn(){try{M=await g.commands.catalog()}catch(e){P(`Could not load command catalog: ${e.message}`,`error`)}try{qn=await g.commands.social()}catch{}if(h(Kn))try{Jn=await g.admin.pendingComments()}catch{Jn=[]}else Jn=[]}function $n(e){let t=qn.comments[e.key]||[];return`<div class="cmd-comments">${t.length?t.map(e=>`<div class="cmd-comment">
            <div class="cmd-comment-body"><strong>${N(e.username)}</strong><span>${N(e.body)}</span></div>
            ${h(Kn)?`<button class="btn btn-sm ghost danger" type="button" data-remove-comment="${e.id}">Remove</button>`:``}
          </div>`).join(``):`<p class="hint">No comments yet.</p>`}${Kn?`<form class="cmd-comment-form" data-comment-key="${N(e.key)}">
         <input type="text" maxlength="1000" placeholder="Share a tip about this command…" />
         <button class="btn btn-sm" type="submit">Comment</button>
       </form>
       <p class="hint">Comments are reviewed by an admin before appearing.</p>`:`<button class="btn btn-sm" data-open-auth="login">Log in to comment</button>`}</div>`}function er(e){let t=qn.counts[e.key]||0,n=qn.mine.includes(e.key),r=(qn.comments[e.key]||[]).length,i=Xn.has(e.key);return`
    <article class="cmd-card" data-search="${N(`${e.command} ${e.title} ${e.description}`.toLowerCase())}">
      <div class="cmd-head">
        <div class="cmd-title-row">
          <h4>${N(e.title)}</h4>
          ${e.isNew?`<span class="nade-badge new">NEW</span>`:``}
          <span class="cmd-tag ${N(e.type)}">${e.type===`launch`?`launch option`:`console`}</span>
        </div>
      </div>
      <div class="cmd-code-row">
        <code class="cmd-code">${N(e.command)}</code>
        <button class="btn btn-sm" data-copy="${N(e.command)}">Copy</button>
      </div>
      <p class="cmd-desc">${N(e.description)}</p>
      <div class="cmd-actions">
        <button class="btn btn-sm recommend ${n?`active`:``}" data-recommend="${N(e.key)}">
          ${n?`★ Recommended`:`☆ Recommend`} <span class="rec-count">${t}</span>
        </button>
        <button class="btn btn-sm ghost" data-toggle-comments="${N(e.key)}">
          ${i?`Hide`:`Comments`}${r?` (${r})`:``}
        </button>
      </div>
      ${i?$n(e):``}
    </article>`}function tr(e){let t=M.commands.filter(t=>t.category===e.id);return t.length?`
    <section class="cmd-category" data-category="${N(e.id)}">
      <h3 class="cmd-cat-title">${N(e.name)} <span class="cmd-count">${t.length}</span></h3>
      <div class="cmd-grid">${t.map(er).join(``)}</div>
    </section>`:``}function nr(){let e=M.commands.filter(e=>e.isNew).length,t=h(Kn)?`<div class="actions">
         <button class="btn btn-sm" id="cmd-sync">Sync from wiki now</button>
         <button class="btn btn-sm ghost" id="cmd-check-cs2">Re-check CS2 build</button>
       </div>`:``;return`
    <section class="cmd-status-bar">
      <div>
        <strong>Source:</strong> ${N(M.source)}${M.remoteConfigured?``:` (wiki)`} ·
        <strong>CS2 build:</strong> ${M.cs2Build?`${N(M.cs2Build)}${M.cs2Version?` (${N(M.cs2Version)})`:``}`:`—`} ·
        <strong>Last synced:</strong> ${Zn(M.lastSync)}
        ${e?` · <span class="nade-badge new">${e} new</span>`:``}
      </div>
      ${t}
    </section>`}function rr(){return!h(Kn)||!Jn.length?``:`
    <section class="cmd-review panel-review">
      <h3>Comments awaiting review (${Jn.length})</h3>
      ${Jn.map(e=>`<div class="review-comment">
            <div><strong>${N(e.username)}</strong> on <code>${N(e.commandKey)}</code><br /><span>${N(e.body)}</span></div>
            <div class="actions">
              <button class="btn btn-sm primary" data-approve-comment="${e.id}">Approve</button>
              <button class="btn btn-sm ghost" data-reject-comment="${e.id}">Reject</button>
              <button class="btn btn-sm ghost danger" data-remove-comment="${e.id}">Delete</button>
            </div>
          </div>`).join(``)}
    </section>`}function ir(){j.innerHTML=`
    <div class="commands-shell">
      ${nr()}
      <section class="quick-launch">
        <div>
          <h3>Recommended launch options</h3>
          <p class="hint">Steam → right-click Counter-Strike 2 → Properties → Launch Options.</p>
        </div>
        <div class="cmd-code-row">
          <code class="cmd-code">${N(M.recommendedLaunchOptions||``)}</code>
          <button class="btn" data-copy="${N(M.recommendedLaunchOptions||``)}">Copy</button>
        </div>
      </section>
      ${rr()}
      <label class="field cmd-search">
        <span>Search commands</span>
        <input id="cmd-search" type="search" placeholder="Search by command, title, or description…" />
      </label>
      ${M.categories.map(tr).join(``)}
      <div id="commands-status" class="status ${Yn.kind}">${N(Yn.text)}</div>
    </div>`,or()}function ar(e){let t=e.trim().toLowerCase();j.querySelectorAll(`.cmd-category`).forEach(e=>{let n=0;e.querySelectorAll(`.cmd-card`).forEach(e=>{let r=!t||e.dataset.search.includes(t);e.classList.toggle(`hidden`,!r),r&&(n+=1)}),e.classList.toggle(`hidden`,n===0)})}function or(){j.querySelectorAll(`[data-copy]`).forEach(e=>e.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e.dataset.copy),P(`Copied to clipboard.`,`ok`)}catch{P(`Clipboard blocked — select and copy manually.`,`error`)}})),j.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>y(e.dataset.openAuth))),j.querySelectorAll(`[data-recommend]`).forEach(e=>e.addEventListener(`click`,()=>sr(e.dataset.recommend))),j.querySelectorAll(`[data-toggle-comments]`).forEach(e=>e.addEventListener(`click`,()=>{let t=e.dataset.toggleComments;Xn.has(t)?Xn.delete(t):Xn.add(t),ir()})),j.querySelectorAll(`.cmd-comment-form`).forEach(e=>e.addEventListener(`submit`,t=>{t.preventDefault(),cr(e.dataset.commentKey,e.querySelector(`input`))})),j.querySelectorAll(`[data-approve-comment]`).forEach(e=>e.addEventListener(`click`,()=>lr(e.dataset.approveComment,`approved`))),j.querySelectorAll(`[data-reject-comment]`).forEach(e=>e.addEventListener(`click`,()=>lr(e.dataset.rejectComment,`rejected`))),j.querySelectorAll(`[data-remove-comment]`).forEach(e=>e.addEventListener(`click`,()=>ur(e.dataset.removeComment))),j.querySelector(`#cmd-search`)?.addEventListener(`input`,e=>ar(e.target.value)),j.querySelector(`#cmd-sync`)?.addEventListener(`click`,dr),j.querySelector(`#cmd-check-cs2`)?.addEventListener(`click`,fr)}async function sr(e){if(!Kn){y(`login`);return}try{let t=await g.commands.recommend(e);qn.counts[e]=t.count,qn.mine=t.recommended?[...qn.mine.filter(t=>t!==e),e]:qn.mine.filter(t=>t!==e),ir()}catch(e){P(e.message,`error`)}}async function cr(e,t){let n=(t?.value||``).trim();if(!n){P(`Write something first.`,`error`);return}try{await g.commands.addComment(e,n),P(`Comment submitted — an admin will review it before it appears.`,`ok`),t&&(t.value=``)}catch(e){P(e.message,`error`)}}async function lr(e,t){try{await g.admin.reviewComment(e,t),await Qn(),ir(),P(`Comment ${t}.`,`ok`)}catch(e){P(e.message,`error`)}}async function ur(e){if(confirm(`Permanently delete this comment?`))try{await g.admin.removeComment(e),await Qn(),ir(),P(`Comment deleted.`,`ok`)}catch(e){P(e.message,`error`)}}function dr(){Gn({title:`Sync commands from the CS2 wiki`,description:`The Valve wiki has a bot check that blocks servers. Open it in your browser, complete the verification, then copy the page source (wikitext) and paste it here — the server will parse it.`,sourceUrl:`https://developer.valvesoftware.com/w/index.php?title=List_of_Counter-Strike_2_console_command_variables&action=raw`,sourceLabel:`Open CS2 wiki source`,placeholder:`Paste the wiki page source (wikitext), or a JSON list of commands…`,onImport:async e=>{let t=await g.admin.importCommands(e);return await Qn(),ir(),`Imported ${t.count} commands.`}})}async function fr(){P(`Checking the current CS2 build…`,``);try{let e=await g.admin.checkCommandsCs2();await Qn(),ir(),P(e.ok?`CS2 build ${e.build}${e.changed?` — changed, catalog re-synced`:` — no change`}.`:`Check failed: ${e.reason}`,e.ok?`ok`:`error`)}catch(e){P(e.message,`error`)}}async function pr(){j=document.querySelector(`#commands-tool`),j&&(Kn=Ae(),je(async e=>{Kn=e,await Qn(),ir()}),ir(),await Qn(),ir())}var F,I=null,mr=null,hr={paypalUrl:``,steamTradeUrl:``},gr={text:``,kind:``};function L(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function R(e,t=``){gr={text:e,kind:t};let n=F?.querySelector(`#profile-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function _r(e){try{return new Date(e).toLocaleDateString()}catch{return`—`}}async function vr(){if(I){try{mr=(await g.auth.profile()).stats}catch(e){R(e.message,`error`)}if(Te(I))try{hr=await g.settings.get()}catch{}}}function yr(e,t){return`<div class="profile-stat"><dt>${L(e)}</dt><dd>${L(t)}</dd></div>`}function br(){return Te(I)?`
    <section class="panel profile-settings">
      <div class="panel-head"><h2>Donate links</h2><span class="panel-tag">Owner only</span></div>
      <div class="profile-settings-body">
        <p class="hint">These power the PayPal &amp; Steam buttons in the site footer. Leave a field empty to hide that button.</p>
        <label class="field">
          <span>PayPal link</span>
          <input id="set-paypal" type="url" placeholder="https://www.paypal.com/paypalme/yourname" value="${L(hr.paypalUrl)}" />
        </label>
        <label class="field">
          <span>Steam trade link</span>
          <input id="set-steam" type="url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${L(hr.steamTradeUrl)}" />
        </label>
        <div class="actions">
          <button class="btn primary" id="set-save">Save donate links</button>
        </div>
      </div>
    </section>`:``}function xr(){if(!I){F.innerHTML=`<div class="profile-shell"><div class="login-prompt">
      <p class="hint">Log in to view your profile.</p>
      <div class="actions"><button class="btn primary" data-open-auth="login">Log in</button><button class="btn" data-open-auth="register">Register</button></div>
    </div></div>`,F.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>y(e.dataset.openAuth)));return}let e=(I.username||`?`).charAt(0).toUpperCase(),t=mr||{nadesTotal:0,nadesApproved:0,nadesPending:0,recommendations:0,comments:0,nadeFavorites:0};F.innerHTML=`
    <div class="profile-shell">
      <section class="panel profile-card">
        <div class="profile-head">
          <div class="profile-avatar">${I.avatarUrl?`<img src="${L(Ee(I.avatarUrl))}" alt="${L(I.username)}" />`:L(e)}</div>
          <div>
            <h2 class="profile-name">${L(I.username)} <span class="nade-badge ${L(I.role)}">${L(I.role)}</span></h2>
            <p class="hint">${I.email?L(I.email):`No email set`} · member since ${_r(I.createdAt)}</p>
            <div class="avatar-controls">
              <input type="file" id="avatar-file" accept="image/*" hidden />
              <button class="btn btn-sm" id="avatar-upload">${I.avatarUrl?`Change photo`:`Upload photo`}</button>
              ${I.avatarUrl?`<button class="btn btn-sm ghost" id="avatar-remove">Remove</button>`:``}
            </div>
          </div>
        </div>
        <dl class="profile-stats">
          ${yr(`Nades submitted`,t.nadesTotal)}
          ${yr(`Approved`,t.nadesApproved)}
          ${yr(`Pending`,t.nadesPending)}
          ${yr(`Favorite nades`,t.nadeFavorites)}
          ${yr(`Commands recommended`,t.recommendations)}
          ${yr(`Comments`,t.comments)}
        </dl>
      </section>
      <section class="panel profile-account">
        <div class="panel-head"><h2>Account</h2></div>
        <div class="profile-settings-body">
          <label class="field"><span>Username</span><input id="acc-username" type="text" value="${L(I.username)}" maxlength="80" /></label>
          <div class="actions"><button class="btn btn-sm" id="username-save">Save username</button></div>
          <div class="account-steam">
            ${I.steamId?`<p class="hint">Steam linked${I.steamPersona?`: <strong>${L(I.steamPersona)}</strong>`:``}.</p>
                   <button class="btn btn-sm ghost" id="steam-unlink">Unlink Steam</button>`:`<p class="hint">Connect your Steam account so you can also log in with Steam.</p>
                   <button class="btn btn-sm" id="steam-link">Connect Steam</button>`}
          </div>
        </div>
      </section>
      ${I.hasPassword?`<section class="panel profile-password">
               <div class="panel-head"><h2>Change password</h2></div>
               <div class="profile-settings-body">
                 <label class="field"><span>Current password</span><input id="pw-current" type="password" autocomplete="current-password" /></label>
                 <label class="field"><span>New password</span><input id="pw-new" type="password" autocomplete="new-password" /></label>
                 <div class="actions"><button class="btn primary" id="pw-save">Update password</button></div>
               </div>
             </section>`:`<section class="panel profile-password">
               <div class="panel-head"><h2>Set email &amp; password</h2><span class="panel-tag">Steam account</span></div>
               <div class="profile-settings-body">
                 <p class="hint">Add an email and password so you can log in without Steam. Your email can't be changed later.</p>
                 <label class="field"><span>Email</span><input id="cred-email" type="email" autocomplete="email" /></label>
                 <label class="field"><span>Password</span><input id="cred-password" type="password" autocomplete="new-password" /></label>
                 <div class="actions"><button class="btn primary" id="cred-save">Save email &amp; password</button></div>
               </div>
             </section>`}
      ${br()}
      <div id="profile-status" class="status ${gr.kind}">${L(gr.text)}</div>
    </div>`,F.querySelector(`#set-save`)?.addEventListener(`click`,kr),F.querySelector(`#pw-save`)?.addEventListener(`click`,Cr),F.querySelector(`#username-save`)?.addEventListener(`click`,Tr),F.querySelector(`#cred-save`)?.addEventListener(`click`,Er),F.querySelector(`#steam-link`)?.addEventListener(`click`,Dr),F.querySelector(`#steam-unlink`)?.addEventListener(`click`,Or);let n=F.querySelector(`#avatar-file`);F.querySelector(`#avatar-upload`)?.addEventListener(`click`,()=>n?.click()),n?.addEventListener(`change`,e=>Sr(e.target.files?.[0])),F.querySelector(`#avatar-remove`)?.addEventListener(`click`,wr)}async function Sr(e){if(e){R(`Uploading image…`,``);try{await g.auth.uploadAvatar(e),await Me(),R(`Profile image updated.`,`ok`)}catch(e){R(e.message,`error`)}}}async function Cr(){let e=F.querySelector(`#pw-current`)?.value||``,t=F.querySelector(`#pw-new`)?.value||``;try{await g.auth.changePassword({currentPassword:e,newPassword:t}),F.querySelector(`#pw-current`).value=``,F.querySelector(`#pw-new`).value=``,R(`Password updated.`,`ok`)}catch(e){R(e.message,`error`)}}async function wr(){try{await g.auth.setAvatar(``),await Me(),R(`Profile image removed.`,`ok`)}catch(e){R(e.message,`error`)}}async function Tr(){let e=F.querySelector(`#acc-username`)?.value||``;try{await g.auth.changeUsername(e),await Me(),R(`Username updated.`,`ok`)}catch(e){R(e.message,`error`)}}async function Er(){let e=F.querySelector(`#cred-email`)?.value||``,t=F.querySelector(`#cred-password`)?.value||``;try{await g.auth.setCredentials({email:e,password:t}),await Me(),R(`Email & password saved — you can now log in without Steam.`,`ok`)}catch(e){R(e.message,`error`)}}async function Dr(){try{let e=await g.auth.steamLinkUrl();window.location.href=e}catch(e){R(e.message,`error`)}}async function Or(){try{await g.auth.steamUnlink(),await Me(),R(`Steam unlinked.`,`ok`)}catch(e){R(e.message,`error`)}}async function kr(){let e=F.querySelector(`#set-paypal`)?.value||``,t=F.querySelector(`#set-steam`)?.value||``;try{hr=await g.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),R(`Donate links saved.`,`ok`),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))}catch(e){R(e.message,`error`)}}async function Ar(){F=document.querySelector(`#profile-tool`),F&&(I=Ae(),je(async e=>{I=e,await vr(),xr()}),xr(),await vr(),xr())}var z,jr=null,Mr=[],Nr=`top`,Pr=!1,Fr={text:``,kind:``},Ir=new Set;function Lr(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Rr(e,t=``){Fr={text:e,kind:t};let n=z?.querySelector(`#configs-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function zr(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function Br(e,t){let n=new Blob([t],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}async function Vr(){try{Mr=await g.configs.list({sort:Nr})}catch(e){Rr(e.message,`error`)}Kr()}function Hr(e){let t=Math.round(e),n=``;for(let e=1;e<=5;e+=1)n+=e<=t?`★`:`☆`;return n}function Ur(e){if(!jr)return`<button class="btn btn-sm" data-open-auth="login">Log in to rate</button>`;if(e.authorId===jr.id)return`<span class="hint">Your upload</span>`;let t=``;for(let n=1;n<=5;n+=1)t+=`<button class="star-btn ${n<=e.myRating?`on`:``}" data-rate="${e.id}" data-star="${n}" title="${n} star${n>1?`s`:``}">${n<=e.myRating?`★`:`☆`}</button>`;return`<span class="rate-label">Your rating:</span><span class="star-picker">${t}</span>`}function Wr(e){let t=Ir.has(e.id),n=jr&&(e.authorId===jr.id||h(jr));return`
    <article class="config-card" data-search="${Lr(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="config-head">
        <h3>${Lr(e.title)}</h3>
        <div class="config-rating" title="${e.avgRating} from ${e.ratingCount} rating(s)">
          <span class="stars">${Hr(e.avgRating)}</span>
          <span class="rating-num">${e.avgRating||`—`} (${e.ratingCount})</span>
        </div>
      </div>
      ${e.description?`<p class="config-desc">${Lr(e.description)}</p>`:``}
      <div class="config-tags">
        ${e.hasConfig?`<span class="cmd-tag">config .cfg</span>`:``}
        ${e.hasVideo?`<span class="cmd-tag">video settings</span>`:``}
      </div>
      <div class="config-actions">
        ${e.hasConfig?`<button class="btn btn-sm" data-dl="${e.id}" data-kind="config">Download .cfg</button>`:``}
        ${e.hasVideo?`<button class="btn btn-sm" data-dl="${e.id}" data-kind="video">Download video settings</button>`:``}
        <button class="btn btn-sm ghost" data-view="${e.id}">${t?`Hide`:`View`}</button>
        ${n?`<button class="btn btn-sm ghost" data-del="${e.id}">Delete</button>`:``}
      </div>
      ${t?`<div class="config-view">
               ${e.hasConfig?`<div><strong>Config</strong><pre>${Lr(e.configText)}</pre></div>`:``}
               ${e.hasVideo?`<div><strong>Video settings</strong><pre>${Lr(e.videoText)}</pre></div>`:``}
             </div>`:``}
      <div class="config-foot">
        ${Mt(e,{date:zr(e.createdAt)})}
        <span class="config-rate">${Ur(e)}</span>
      </div>
    </article>`}function Gr(){return!jr||!Pr?``:`
    <section class="panel config-upload">
      <div class="panel-head"><h2>Upload a config</h2><span class="panel-tag">Shared publicly</span></div>
      <div class="config-upload-body">
        <label class="field"><span>Title</span><input id="cfg-title" type="text" maxlength="160" placeholder="My CS2 practice + video config" /></label>
        <label class="field"><span>Description (optional)</span><textarea id="cfg-desc" rows="2" maxlength="1000" placeholder="What's in it, who it's for…"></textarea></label>
        <label class="field">
          <span>autoexec / config (.cfg) — paste or upload</span>
          <input id="cfg-config-file" type="file" accept=".cfg,.txt,text/plain" />
          <textarea id="cfg-config" rows="6" spellcheck="false" placeholder="cl_crosshairsize 2; ..."></textarea>
        </label>
        <label class="field">
          <span>Video settings (cs2_video.txt) — paste or upload</span>
          <input id="cfg-video-file" type="file" accept=".txt,text/plain" />
          <textarea id="cfg-video" rows="6" spellcheck="false" placeholder='"video.cfg" { "setting.defaultres" "1920" ... }'></textarea>
        </label>
        <div class="actions">
          <button class="btn primary" id="cfg-submit">Publish config</button>
          <button class="btn ghost" id="cfg-cancel">Cancel</button>
        </div>
      </div>
    </section>`}function Kr(){z.innerHTML=`
    <div class="configs-shell">
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Nr===`top`?`active`:``}" data-sort="top">Most rated</button>
          <button class="tool-tab ${Nr===`new`?`active`:``}" data-sort="new">Last uploaded</button>
        </div>
        <input id="cfg-search" type="search" class="cfg-search" placeholder="Search configs by title, author…" />
        ${jr?`<button class="btn primary" id="cfg-new">Upload config</button>`:`<button class="btn primary" data-open-auth="login">Log in to upload</button>`}
      </div>
      ${Gr()}
      <div class="config-grid">
        ${Mr.length?Mr.map(Wr).join(``):`<p class="hint">No configs yet — be the first to upload one!</p>`}
      </div>
      <div id="configs-status" class="status ${Fr.kind}">${Lr(Fr.text)}</div>
    </div>`,Jr()}function qr(e){let t=e.trim().toLowerCase();z.querySelectorAll(`.config-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function Jr(){z.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>y(e.dataset.openAuth))),z.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Nr=e.dataset.sort,Vr()})),z.querySelector(`#cfg-search`)?.addEventListener(`input`,e=>qr(e.target.value)),z.querySelector(`#cfg-new`)?.addEventListener(`click`,()=>{Pr=!0,Kr()}),z.querySelector(`#cfg-cancel`)?.addEventListener(`click`,()=>{Pr=!1,Kr()}),z.querySelector(`#cfg-submit`)?.addEventListener(`click`,Zr),z.querySelector(`#cfg-config-file`)?.addEventListener(`change`,e=>Xr(e.target,`#cfg-config`)),z.querySelector(`#cfg-video-file`)?.addEventListener(`change`,e=>Xr(e.target,`#cfg-video`)),z.querySelectorAll(`[data-dl]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Mr.find(t=>String(t.id)===e.dataset.dl);t&&(e.dataset.kind===`config`?Br(`${Yr(t.title)}.cfg`,t.configText):Br(`cs2_video.txt`,t.videoText))})),z.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Number(e.dataset.view);Ir.has(t)?Ir.delete(t):Ir.add(t),Kr()})),z.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>$r(Number(e.dataset.del)))),z.querySelectorAll(`[data-rate]`).forEach(e=>e.addEventListener(`click`,()=>Qr(Number(e.dataset.rate),Number(e.dataset.star))))}function Yr(e){return(e||`config`).toLowerCase().replace(/[^a-z0-9]+/g,`_`).replace(/^_|_$/g,``).slice(0,40)||`config`}function Xr(e,t){let n=e.files?.[0];if(!n)return;let r=new FileReader;r.onload=()=>{let e=z.querySelector(t);e&&(e.value=String(r.result||``))},r.readAsText(n)}async function Zr(){let e=z.querySelector(`#cfg-title`)?.value||``,t=z.querySelector(`#cfg-desc`)?.value||``,n=z.querySelector(`#cfg-config`)?.value||``,r=z.querySelector(`#cfg-video`)?.value||``;try{await g.configs.create({title:e,description:t,configText:n,videoText:r}),Pr=!1,Nr=`new`,await Vr(),Rr(`Config published!`,`ok`)}catch(e){Rr(e.message,`error`)}}async function Qr(e,t){try{let n=await g.configs.rate(e,t),r=Mr.find(t=>t.id===e);r&&(r.avgRating=n.avgRating,r.ratingCount=n.ratingCount,r.myRating=n.myRating),Kr(),Rr(`Thanks for rating!`,`ok`)}catch(e){Rr(e.message,`error`)}}async function $r(e){try{await g.configs.remove(e),await Vr(),Rr(`Config deleted.`,`ok`)}catch(e){Rr(e.message,`error`)}}async function ei(){z=document.querySelector(`#configs-tool`),z&&(jr=Ae(),je(async e=>{jr=e,await Vr()}),Kr(),await Vr())}var B,ti=null,ni=[],ri=[],ii={text:``,kind:``},ai=!1,oi=null;function si(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function ci(e,t=``){ii={text:e,kind:t};let n=B?.querySelector(`#highlights-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function li(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function ui(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function di(e){return/^https?:\/\//.test(e||``)?e:``}function fi(e){let t=di(e);if(!t)return``;let n=ui(e);return n?`<iframe class="hl-embed" src="https://www.youtube.com/embed/${si(n)}" title="highlight" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e)?`<video class="hl-embed" src="${si(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${si(t)}" target="_blank" rel="noopener noreferrer">Open highlight ↗</a>`}async function pi(){try{ni=await g.highlights.list({}),ri=h(ti)?await g.admin.highlightReports():[]}catch(e){ci(e.message,`error`)}_i()}function mi(){return!h(ti)||!ri.length?``:`
    <section class="panel panel-review">
      <h3>Reported highlights (${ri.length})</h3>
      ${ri.map(e=>`<div class="report-item">
            <div class="report-media">${fi(e.url)}</div>
            <div class="report-body">
              <strong>${si(e.title)}</strong>
              <div class="hl-report-author">${Mt(e)}</div>
              <ul class="report-reasons">
                ${e.reports.map(e=>`<li><strong>${si(e.reporterName)}:</strong> ${si(e.reason||`(no reason given)`)}</li>`).join(``)}
              </ul>
              <div class="actions">
                <button class="btn btn-sm" data-keep="${e.id}">Keep</button>
                <button class="btn btn-sm ghost" data-remove-hl="${e.id}">Delete highlight</button>
              </div>
            </div>
          </div>`).join(``)}
    </section>`}function hi(e){let t=ti&&(e.authorId===ti.id||h(ti));return`
    <article class="hl-card" data-search="${si(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="hl-media">${fi(e.url)}</div>
      <h3 class="hl-title">${si(e.title)}</h3>
      ${e.description?`<p class="hl-desc">${si(e.description)}</p>`:``}
      <div class="hl-foot">
        ${Mt(e,{date:li(e.createdAt)})}
        <span class="hl-actions">
          ${ti?e.reportedByMe?`<span class="hint">Reported</span>`:`<button class="btn btn-sm ghost" data-report="${e.id}">Report</button>`:``}
          ${t?`<button class="btn btn-sm ghost" data-del="${e.id}">Delete</button>`:``}
        </span>
      </div>
      ${oi===e.id?`<form class="hl-report-form" data-report-form="${e.id}">
               <input type="text" maxlength="500" placeholder="Why are you reporting this? (optional)" />
               <button class="btn btn-sm" type="submit">Submit report</button>
               <button class="btn btn-sm ghost" type="button" data-cancel-report>Cancel</button>
             </form>`:``}
    </article>`}function gi(){return!ti||!ai?``:`
    <section class="panel config-upload">
      <div class="panel-head"><h2>Share a highlight</h2><span class="panel-tag">Video URL</span></div>
      <div class="config-upload-body">
        <label class="field"><span>Title</span><input id="hl-title" type="text" maxlength="160" placeholder="Insane 1v4 clutch on Mirage" /></label>
        <label class="field"><span>Description (optional)</span><textarea id="hl-desc" rows="2" maxlength="1000" placeholder="What happens in the clip…"></textarea></label>
        <label class="field"><span>Video URL (YouTube, Medal, Streamable, .mp4)</span><input id="hl-url" type="url" placeholder="https://youtu.be/..." /></label>
        <div class="actions">
          <button class="btn primary" id="hl-submit">Publish highlight</button>
          <button class="btn ghost" id="hl-cancel">Cancel</button>
        </div>
      </div>
    </section>`}function _i(){B.innerHTML=`
    <div class="highlights-shell">
      <div class="configs-controls">
        <input id="hl-search" type="search" class="cfg-search" placeholder="Search highlights by title, author…" />
        ${ti?`<button class="btn primary" id="hl-new">Share highlight</button>`:`<button class="btn primary" data-open-auth="login">Log in to share</button>`}
      </div>
      ${mi()}
      ${gi()}
      <div class="hl-grid">
        ${ni.length?ni.map(hi).join(``):`<p class="hint">No highlights yet — share the first one!</p>`}
      </div>
      <div id="highlights-status" class="status ${ii.kind}">${si(ii.text)}</div>
    </div>`,yi()}function vi(e){let t=e.trim().toLowerCase();B.querySelectorAll(`.hl-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function yi(){B.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>y(e.dataset.openAuth))),B.querySelector(`#hl-search`)?.addEventListener(`input`,e=>vi(e.target.value)),B.querySelector(`#hl-new`)?.addEventListener(`click`,()=>{ai=!0,_i()}),B.querySelector(`#hl-cancel`)?.addEventListener(`click`,()=>{ai=!1,_i()}),B.querySelector(`#hl-submit`)?.addEventListener(`click`,bi),B.querySelectorAll(`[data-report]`).forEach(e=>e.addEventListener(`click`,()=>{oi=Number(e.dataset.report),_i()})),B.querySelector(`[data-cancel-report]`)?.addEventListener(`click`,()=>{oi=null,_i()}),B.querySelector(`[data-report-form]`)?.addEventListener(`submit`,e=>{e.preventDefault(),xi(Number(e.currentTarget.dataset.reportForm),e.currentTarget.querySelector(`input`).value)}),B.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>Si(Number(e.dataset.del)))),B.querySelectorAll(`[data-keep]`).forEach(e=>e.addEventListener(`click`,()=>Ci(Number(e.dataset.keep),`keep`))),B.querySelectorAll(`[data-remove-hl]`).forEach(e=>e.addEventListener(`click`,()=>Ci(Number(e.dataset.removeHl),`delete`)))}async function bi(){let e=B.querySelector(`#hl-title`)?.value||``,t=B.querySelector(`#hl-desc`)?.value||``,n=B.querySelector(`#hl-url`)?.value||``;try{await g.highlights.create({title:e,description:t,url:n}),ai=!1,await pi(),ci(`Highlight shared!`,`ok`)}catch(e){ci(e.message,`error`)}}async function xi(e,t){try{await g.highlights.report(e,t),oi=null,await pi(),ci(`Thanks — an admin will review your report.`,`ok`)}catch(e){ci(e.message,`error`)}}async function Si(e){try{await g.highlights.remove(e),await pi(),ci(`Highlight deleted.`,`ok`)}catch(e){ci(e.message,`error`)}}async function Ci(e,t){try{await g.admin.reviewHighlight(e,t),await pi(),ci(t===`delete`?`Highlight removed.`:`Reports cleared — highlight kept.`,`ok`)}catch(e){ci(e.message,`error`)}}async function wi(){B=document.querySelector(`#highlights-tool`),B&&(ti=Ae(),je(async e=>{ti=e,await pi()}),_i(),await pi())}var V,Ti=null,H={pros:[],total:0,source:`seed`,lastSync:0},Ei=`featured`,Di=``,Oi=null,ki={text:``,kind:``};function U(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Ai(e,t=``){ki={text:e,kind:t};let n=V?.querySelector(`#pros-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}async function ji(){try{H=await g.pros.list({sort:Ei,q:Di})}catch(e){Ai(e.message,`error`)}Ri()}var Mi={"natus vincere":`#f4d000`,vitality:`#f5d20a`,falcons:`#0aa14f`,"team spirit":`#c8102e`,astralis:`#e4002b`,faze:`#e43b26`,g2:`#c8102e`};function Ni(e){return Mi[(e||``).toLowerCase()]||`#33415a`}function Pi(e){let t=(e.team||e.player||`?`).trim(),n=t.split(/\s+/);return(n.length>1?n.slice(0,3).map(e=>e[0]).join(``):t.slice(0,2)).toUpperCase()}function Fi(e){let t=e.photo||e.teamLogo||``,n=e.photo&&e.teamLogo?e.teamLogo:``,r=t?`<img class="pro-img" alt="${U(e.player)}" loading="lazy" src="${U(t)}"${n?` data-logo="${U(n)}"`:``} onerror="if(this.dataset.logo){this.src=this.dataset.logo;this.removeAttribute('data-logo');}else{this.remove();}" />`:``;return`<div class="pro-photo" style="--team:${Ni(e.team)}"><span class="pro-monogram">${U(Pi(e))}</span>${r}</div>`}function Ii(e,t){return`<div class="pro-stat"><dt>${U(e)}</dt><dd>${t!=null&&t!==``?U(t):`—`}</dd></div>`}function Li(e){return`
    <article class="pro-card" data-search="${U(`${e.player} ${e.team||``}`.toLowerCase())}">
      ${Fi(e)}
      <div class="pro-head">
        <div>
          <h3>${U(e.player)}</h3>
          ${e.team?`<p class="hint">${U(e.team)}</p>`:``}
        </div>
        <div class="pro-edpi"><span>${e.edpi??`—`}</span><small>eDPI</small></div>
      </div>
      <dl class="pro-stats">
        ${Ii(`DPI`,e.dpi)}
        ${Ii(`Sens`,e.sens)}
        ${Ii(`Zoom`,e.zoomSens)}
        ${Ii(`Hz`,e.hz)}
        ${Ii(`Resolution`,e.resolution)}
        ${Ii(`Aspect`,e.aspectRatio)}
      </dl>
    </article>`}function Ri(){let e=h(Ti)&&xe()?`<div class="pros-admin-actions">
         <button class="btn btn-sm" id="pros-sync">Sync from prosettings.net</button>
         <button class="btn btn-sm ghost" id="pros-import">Import from HLTV</button>
       </div>`:``;V.innerHTML=`
    <div class="pros-shell">
      <div class="cmd-status-bar">
        <div><strong>Source:</strong> ${U(H.source)} · <strong>${H.total||H.pros.length}</strong> players${H.lastSync?` · synced ${U(new Date(H.lastSync).toLocaleDateString())}`:``}</div>
        ${e}
      </div>
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Ei===`featured`?`active`:``}" data-sort="featured">Featured</button>
          <button class="tool-tab ${Ei===`name`?`active`:``}" data-sort="name">Name</button>
          <button class="tool-tab ${Ei===`edpi`?`active`:``}" data-sort="edpi">Lowest eDPI</button>
          <button class="tool-tab ${Ei===`edpi-desc`?`active`:``}" data-sort="edpi-desc">Highest eDPI</button>
        </div>
        <input id="pros-search" type="search" class="cfg-search" placeholder="Search player or team…" value="${U(Di)}" />
      </div>
      <p class="hint">${H.source===`prosettings`?`Live from prosettings.net.`:H.source===`seed`?`Built-in list. Admins can sync live data from prosettings.net.`:`Source: ${U(H.source)}.`}</p>
      <div class="pro-grid">
        ${H.pros.length?H.pros.map(Li).join(``):`<p class="hint">No pro settings yet.</p>`}
      </div>
      <div id="pros-status" class="status ${ki.kind}">${U(ki.text)}</div>
    </div>`,zi()}function zi(){V.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Ei=e.dataset.sort,ji()}));let e=V.querySelector(`#pros-search`);e&&e.addEventListener(`input`,e=>{Di=e.target.value,clearTimeout(Oi),Oi=setTimeout(async()=>{await ji();let e=V.querySelector(`#pros-search`);e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},300)}),V.querySelector(`#pros-sync`)?.addEventListener(`click`,Bi),V.querySelector(`#pros-import`)?.addEventListener(`click`,Vi)}async function Bi(){let e=V.querySelector(`#pros-sync`);if(e&&(e.disabled=!0),!xe()){Ai(`Please log in as an admin to sync.`,`error`),y(`login`),e&&(e.disabled=!1);return}Ai(`Syncing from prosettings.net…`,``);try{let e=await g.admin.syncPros();await ji(),e.synced?Ai(`Synced ${e.count} players from ${e.source}.`,`ok`):Ai(`Sync failed: ${e.reason||`unknown error`}. Kept the current list.`,`error`)}catch(e){e.status===401?(Ai(`Please log in as an admin to sync.`,`error`),y(`login`)):Ai(e.message,`error`)}finally{let e=V.querySelector(`#pros-sync`);e&&(e.disabled=!1)}}function Vi(){Gn({title:`Import pro settings from HLTV`,description:`HLTV has a Cloudflare check that blocks servers. Open HLTV in your browser, complete the verification, then paste a JSON list of players here. Each item: {"player","team","dpi","sens","zoomSens","hz","resolution","aspectRatio","photo","teamLogo"}.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,placeholder:`[{"player":"s1mple","team":"Natus Vincere","dpi":400,"sens":3.09,"hz":1000,"resolution":"1280x960","aspectRatio":"4:3"}]`,onImport:async e=>{let t=await g.admin.importPros(e);return await ji(),`Imported ${t.count} players.`}})}async function Hi(){V=document.querySelector(`#pros-tool`),V&&(Ti=Ae(),je(e=>{Ti=e,Ri()}),Ri(),await ji())}var W,G=null,Ui=`overview`,Wi={text:``,kind:``},Gi={nades:0,comments:0,reports:0},K={},Ki=[{id:`overview`,label:`Overview`},{id:`nades`,label:`Nades`},{id:`comments`,label:`Comments`},{id:`reports`,label:`Reports`},{id:`users`,label:`Users`},{id:`sync`,label:`Data sync`},{id:`contact`,label:`Contact`},{id:`logs`,label:`Logs`,ownerOnly:!0},{id:`settings`,label:`Site settings`,ownerOnly:!0}];function q(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function qi(e,t=``){Wi={text:e,kind:t};let n=W?.querySelector(`#admin-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Ji(e){try{return new Date(e).toLocaleString()}catch{return`—`}}async function Yi(){try{let[e,t,n]=await Promise.all([g.admin.pendingCount().catch(()=>0),g.admin.pendingCommentsCount().catch(()=>0),g.admin.highlightReportsCount().catch(()=>0)]);Gi={nades:e,comments:t,reports:n}}catch{}}function Xi(){let e=(e,t,n)=>`<button class="admin-stat" data-goto="${n}">
       <span class="admin-stat-num">${t}</span>
       <span class="admin-stat-label">${q(e)}</span>
     </button>`;return`
    <div class="admin-stats">
      ${e(`Nades to review`,Gi.nades,`nades`)}
      ${e(`Comments to review`,Gi.comments,`comments`)}
      ${e(`Highlight reports`,Gi.reports,`reports`)}
    </div>
    <p class="hint">Use the tabs above to moderate content, manage users, sync data sources, and read contact messages.</p>`}function Zi(){let e=K.nades||[];return e.length?`
    <div class="review-bulk-bar">
      <label class="review-select-all">
        <input type="checkbox" id="admin-nade-select-all" />
        <span>Select all pending (${e.filter(e=>e.status===`pending`).length})</span>
      </label>
      <button class="btn btn-sm primary" type="button" id="admin-nade-bulk-approve" disabled>Approve selected</button>
      <button class="btn btn-sm ghost" type="button" id="admin-nade-bulk-reject" disabled>Reject selected</button>
    </div>
    ${e.map(e=>{let t=(e.media||[]).map(e=>`
        <div class="admin-media">
          <a href="${q(e.url)}" target="_blank" rel="noopener noreferrer">${q(e.kind||`media`)}</a>
          <span class="nade-badge ${q(e.status)}">${q(e.status)}</span>
          ${e.status===`pending`?`<button class="btn btn-sm" data-media-approve="${e.id}">Approve</button>
                 <button class="btn btn-sm ghost" data-media-reject="${e.id}">Reject</button>`:e.status===`approved`?`<button class="btn btn-sm ghost" data-media-reject="${e.id}">Unpublish</button>`:`<button class="btn btn-sm" data-media-approve="${e.id}">Approve</button>`}
          <button class="btn btn-sm ghost danger" data-media-delete="${e.id}">Remove</button>
        </div>`).join(``);return`
        <article class="panel admin-item">
          <div class="admin-item-head">
            ${e.status===`pending`?`<label class="review-check"><input type="checkbox" class="admin-nade-check" value="${e.id}" /><span>Select</span></label>`:``}
            <strong>${q(e.title||`Untitled`)}</strong>
            <span class="nade-badge ${q(e.status)}">${q(e.status)}</span>
          </div>
          <p class="hint">${q(e.map)} · ${q(e.type)} · ${q(e.side||``)} · ${q(e.technique||``)} · by ${q(e.authorName||e.author_name||`?`)}</p>
          ${t||`<p class="hint">No media.</p>`}
          <div class="actions">
            <button class="btn btn-sm" data-nade-approve="${e.id}">Approve nade</button>
            <button class="btn btn-sm ghost" data-nade-reject="${e.id}">Reject nade</button>
            <button class="btn btn-sm ghost danger" data-nade-delete="${e.id}">Delete</button>
          </div>
        </article>`}).join(``)}`:`<p class="hint">Nothing pending. All nades are reviewed.</p>`}function Qi(){let e=K.comments||[];return e.length?e.map(e=>`
      <article class="panel admin-item">
        <p>${q(e.body)}</p>
        <p class="hint">by ${q(e.username)} on <code>${q(e.commandKey)}</code> · ${Ji(e.createdAt)}</p>
        <div class="actions">
          <button class="btn btn-sm" data-comment-approve="${e.id}">Approve</button>
          <button class="btn btn-sm ghost" data-comment-reject="${e.id}">Reject</button>
          <button class="btn btn-sm ghost danger" data-comment-delete="${e.id}">Delete</button>
        </div>
      </article>`).join(``):`<p class="hint">No comments pending review.</p>`}function $i(){let e=K.reports||[];return e.length?e.map(e=>{let t=(e.reports||[]).map(e=>`<li>${q(e.reason||`No reason`)} — <span class="hint">${q(e.reporterName||`?`)}</span></li>`).join(``);return`
        <article class="panel admin-item">
          <div class="admin-item-head">
            <a href="${q(e.url)}" target="_blank" rel="noopener noreferrer"><strong>${q(e.title)}</strong></a>
            <span class="nade-badge pending">${(e.reports||[]).length} report(s)</span>
          </div>
          <p class="hint">by ${q(e.authorName)}</p>
          <ul class="admin-reasons">${t}</ul>
          <div class="actions">
            <button class="btn btn-sm ghost" data-report-keep="${e.id}">Keep</button>
            <button class="btn btn-sm danger" data-report-delete="${e.id}">Delete highlight</button>
          </div>
        </article>`}).join(``):`<p class="hint">No open highlight reports.</p>`}function ea(){let e=K.users||[];if(!e.length)return`<p class="hint">No users.</p>`;let t=Date.now(),n=Te(G),r=e.map(e=>{let r=e.bannedUntil&&new Date(e.bannedUntil).getTime()>t,i=e.role===`owner`,a=i?`<span class="hint">owner</span>`:n?e.role===`admin`?`<button class="btn btn-sm ghost" type="button" data-role-set="${e.id}" data-role="user">Remove admin</button>`:`<button class="btn btn-sm primary" type="button" data-role-set="${e.id}" data-role="admin">Promote to admin</button>`:`<span class="hint">${q(e.role)}</span>`,o=i?``:r?`<button class="btn btn-sm" data-unban="${e.id}">Unban</button>`:`<input type="number" min="1" placeholder="hrs" class="admin-ban-hrs" data-ban-hrs="${e.id}" />
             <button class="btn btn-sm ghost" data-ban="${e.id}">Ban</button>
             <button class="btn btn-sm danger" data-ban-perma="${e.id}">Ban forever</button>`;return`
        <div class="admin-user">
          <div class="admin-user-main">
            <strong>${q(e.username)}</strong> <span class="nade-badge ${q(e.role)}">${q(e.role)}</span>
            ${r?`<span class="nade-badge rejected">banned</span>`:``}
            <div class="hint">${q(e.email||(e.steamId?`Steam account`:`no email`))} · joined ${new Date(e.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="admin-user-actions">
            ${a}
            ${o}
          </div>
        </div>`}).join(``);return`
    ${n?`<p class="hint">As owner you can promote users to admin or remove admin access. Ban controls are available to all admins.</p>`:`<p class="hint">Only the site owner can promote users to admin.</p>`}
    <div class="admin-users">${r}</div>`}function ta(){return`
    <div class="admin-sync">
      <div class="panel admin-item">
        <div class="admin-item-head"><strong>Commands catalog</strong></div>
        <p class="hint">Sync the CS2 command catalog from the configured source, or re-check the CS2 build.</p>
        <div class="actions">
          <button class="btn btn-sm" id="sync-commands">Sync commands</button>
          <button class="btn btn-sm ghost" id="check-cs2">Check CS2 build</button>
          <button class="btn btn-sm ghost" id="import-commands">Import (paste)</button>
        </div>
      </div>
      <div class="panel admin-item">
        <div class="admin-item-head"><strong>Pro settings</strong></div>
        <p class="hint">Sync pro players from prosettings.net, or paste an HLTV export.</p>
        <div class="actions">
          <button class="btn btn-sm" id="sync-pros">Sync from prosettings.net</button>
          <button class="btn btn-sm ghost" id="import-pros">Import from HLTV (paste)</button>
        </div>
      </div>
    </div>`}function na(){let e=K.contact||[];return e.length?e.map(e=>`
      <article class="panel admin-item">
        <div class="admin-item-head">
          <strong>${q(e.subject||`(no subject)`)}</strong>
          <span class="hint">${Ji(e.created_at)}</span>
        </div>
        <p class="hint">${q(e.name)} · <a href="mailto:${q(e.email)}">${q(e.email)}</a> · ${e.sent?`emailed`:`stored only`}</p>
        <p class="admin-message">${q(e.message)}</p>
        <div class="actions">
          <button class="btn btn-sm ghost danger" data-contact-delete="${e.id}">Delete</button>
        </div>
      </article>`).join(``):`<p class="hint">No contact messages.</p>`}function ra(){let e=K.settings||{paypalUrl:``,steamTradeUrl:``};return`
    <div class="panel admin-item">
      <div class="admin-item-head"><strong>Donate links</strong><span class="panel-tag">Owner only</span></div>
      <p class="hint">Power the PayPal &amp; Steam buttons in the footer. Empty = hidden.</p>
      <label class="field"><span>PayPal link</span><input id="set-paypal" type="url" value="${q(e.paypalUrl)}" placeholder="https://www.paypal.com/paypalme/yourname" /></label>
      <label class="field"><span>Steam trade link</span><input id="set-steam" type="url" value="${q(e.steamTradeUrl)}" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." /></label>
      <div class="actions"><button class="btn primary" id="save-settings">Save donate links</button></div>
    </div>`}function ia(){if(!Te(G))return`<p class="hint">Owner only.</p>`;let e=K.logs||{total:0,logs:[]},t=K.logsFilter||``,n=e.logs||[],r=[[``,`All actions`],[`nade.approve`,`Nade approve`],[`nade.reject`,`Nade reject`],[`nade.bulk_approve`,`Nade bulk approve`],[`nade.bulk_reject`,`Nade bulk reject`],[`nade.delete`,`Nade delete (author)`],[`nade.admin_delete`,`Nade delete (admin)`],[`media.approve`,`Media approve`],[`media.reject`,`Media reject`],[`comment.approve`,`Comment approve`],[`comment.reject`,`Comment reject`],[`comment.delete`,`Comment delete`],[`media.delete`,`Media delete`],[`contact.delete`,`Contact delete`],[`highlight.keep`,`Highlight keep`],[`highlight.delete`,`Highlight delete`],[`user.role`,`User role`],[`user.ban`,`User ban`],[`user.unban`,`User unban`],[`commands.sync`,`Commands sync`],[`commands.import`,`Commands import`],[`pros.sync`,`Pros sync`],[`pros.import`,`Pros import`],[`settings.save`,`Settings save`]].map(([e,n])=>`<option value="${q(e)}" ${t===e?`selected`:``}>${q(n)}</option>`).join(``),i=n.length?n.map(e=>{let t=e.detail&&typeof e.detail==`object`?`<pre class="admin-log-detail">${q(JSON.stringify(e.detail,null,2))}</pre>`:e.detail?`<pre class="admin-log-detail">${q(String(e.detail))}</pre>`:``;return`
        <article class="panel admin-item admin-log">
          <div class="admin-item-head">
            <span class="nade-badge">${q(e.action)}</span>
            <strong>${q(e.summary||e.action)}</strong>
            <span class="hint">${Ji(e.createdAt)}</span>
          </div>
          <p class="hint">by ${q(e.actorName)} (${q(e.actorRole)})${e.entityType?` · ${q(e.entityType)}${e.entityId==null?``:` #${q(e.entityId)}`}`:``}</p>
          ${t}
        </article>`}).join(``):`<p class="hint">No log entries yet. Moderation and admin actions will show up here.</p>`;return`
    <div class="panel admin-item">
      <div class="admin-item-head"><strong>Owner audit log</strong><span class="panel-tag">Owner only</span></div>
      <p class="hint">Only you can see this. Admins’ approvals, bans, deletes, and syncs are recorded here.</p>
      <div class="admin-log-toolbar">
        <label class="field">
          <span>Filter</span>
          <select id="owner-logs-filter">${r}</select>
        </label>
        <button class="btn btn-sm" type="button" id="owner-logs-refresh">Refresh</button>
        <span class="hint">${e.total||0} total</span>
      </div>
    </div>
    <div class="admin-logs">${i}</div>`}var aa={overview:Xi,nades:Zi,comments:Qi,reports:$i,users:ea,sync:ta,contact:na,logs:ia,settings:ra};async function oa(e){try{e===`overview`?await Yi():e===`nades`?K.nades=await g.admin.pending():e===`comments`?K.comments=await g.admin.pendingComments():e===`reports`?K.reports=await g.admin.highlightReports():e===`users`?K.users=await g.admin.users():e===`contact`?K.contact=await g.admin.contactMessages():e===`logs`?K.logs=await g.admin.ownerLogs({action:K.logsFilter||``}):e===`settings`&&(K.settings=await g.settings.get())}catch(e){qi(e.message,`error`)}}function sa(){if(!W)return;if(!h(G)){W.innerHTML=`<div class="admin-shell"><div class="login-prompt">
      <p class="hint">This area is for admins only.</p>
      ${G?``:`<div class="actions"><button class="btn primary" data-open-auth="login">Log in</button></div>`}
    </div></div>`,W.querySelector(`[data-open-auth]`)?.addEventListener(`click`,()=>y(`login`));return}(Ui===`logs`||Ui===`settings`)&&!Te(G)&&(Ui=`overview`);let e=Ki.filter(e=>!e.ownerOnly||Te(G)).map(e=>`<button class="tool-tab ${Ui===e.id?`active`:``}" data-section="${e.id}">${q(e.label)}${e.id===`nades`&&Gi.nades?` (${Gi.nades})`:``}${e.id===`comments`&&Gi.comments?` (${Gi.comments})`:``}${e.id===`reports`&&Gi.reports?` (${Gi.reports})`:``}</button>`).join(``),t=(aa[Ui]||Xi)();W.innerHTML=`
    <div class="admin-shell">
      <h2 class="admin-title">Admin</h2>
      <div class="admin-nav sort-tabs">${e}</div>
      <div class="admin-body">${t}</div>
      <div id="admin-status" class="status ${Wi.kind}">${q(Wi.text)}</div>
    </div>`,la()}async function ca(e){(e===`logs`||e===`settings`)&&(Te(G)||(e=`overview`)),Ui=e,sa(),await oa(e),sa()}function la(){W.querySelectorAll(`[data-section]`).forEach(e=>e.addEventListener(`click`,()=>ca(e.dataset.section))),W.querySelectorAll(`[data-goto]`).forEach(e=>e.addEventListener(`click`,()=>ca(e.dataset.goto)));let e=async(e,t)=>{try{await e(),t&&qi(t,`ok`)}catch(e){e.status===401?(qi(`Please log in as an admin and try again.`,`error`),y(`login`)):qi(e.message,`error`)}},t=async()=>{await oa(Ui),await Yi(),sa()};W.querySelectorAll(`[data-nade-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewNade(n.dataset.nadeApprove,`approved`),await t()},`Nade approved.`))),W.querySelectorAll(`[data-nade-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewNade(n.dataset.nadeReject,`rejected`),await t()},`Nade rejected.`))),W.querySelectorAll(`[data-nade-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Permanently delete this nade and its media?`)&&e(async()=>{await g.nades.remove(n.dataset.nadeDelete),await t()},`Nade deleted.`)})),W.querySelectorAll(`[data-media-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewMedia(n.dataset.mediaApprove,`approved`),await t()},`Media approved.`))),W.querySelectorAll(`[data-media-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewMedia(n.dataset.mediaReject,`rejected`),await t()},`Media rejected.`))),W.querySelectorAll(`[data-media-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Permanently remove this media?`)&&e(async()=>{await g.admin.removeMedia(n.dataset.mediaDelete),await t()},`Media removed.`)}));let n=W.querySelector(`#admin-nade-select-all`),r=W.querySelector(`#admin-nade-bulk-approve`),i=W.querySelector(`#admin-nade-bulk-reject`),a=()=>{let e=W.querySelectorAll(`.admin-nade-check:checked`).length;r&&(r.disabled=e===0),i&&(i.disabled=e===0)};n?.addEventListener(`change`,()=>{W.querySelectorAll(`.admin-nade-check`).forEach(e=>{e.checked=n.checked}),a()}),W.querySelectorAll(`.admin-nade-check`).forEach(e=>e.addEventListener(`change`,a));let o=async n=>{let r=[...W.querySelectorAll(`.admin-nade-check:checked`)].map(e=>Number(e.value));r.length&&await e(async()=>{let e=await g.admin.reviewNadesBulk(r,n);await t(),qi(`${n===`approved`?`Approved`:`Rejected`} ${e.updated} nade${e.updated===1?``:`s`}.`,`ok`)})};r?.addEventListener(`click`,()=>o(`approved`)),i?.addEventListener(`click`,()=>o(`rejected`)),W.querySelectorAll(`[data-comment-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewComment(n.dataset.commentApprove,`approved`),await t()},`Comment approved.`))),W.querySelectorAll(`[data-comment-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewComment(n.dataset.commentReject,`rejected`),await t()},`Comment rejected.`))),W.querySelectorAll(`[data-comment-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Permanently delete this comment?`)&&e(async()=>{await g.admin.removeComment(n.dataset.commentDelete),await t()},`Comment deleted.`)})),W.querySelectorAll(`[data-report-keep]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewHighlight(n.dataset.reportKeep,`keep`),await t()},`Kept highlight.`))),W.querySelectorAll(`[data-report-delete]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.reviewHighlight(n.dataset.reportDelete,`delete`),await t()},`Highlight deleted.`))),W.querySelectorAll(`[data-role-set]`).forEach(n=>n.addEventListener(`click`,()=>{let r=n.dataset.role;e(async()=>{await g.admin.setRole(n.dataset.roleSet,r),await t()},r===`admin`?`Promoted to admin.`:`Admin access removed.`)})),W.querySelectorAll(`[data-unban]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.unbanUser(n.dataset.unban),await t()},`User unbanned.`))),W.querySelectorAll(`[data-ban]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{let e=Number(W.querySelector(`[data-ban-hrs="${n.dataset.ban}"]`)?.value);if(!Number.isFinite(e)||e<=0)return qi(`Enter a positive number of hours.`,`error`);await g.admin.banUser(n.dataset.ban,{hours:e}),await t(),qi(`User banned.`,`ok`)}))),W.querySelectorAll(`[data-ban-perma]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await g.admin.banUser(n.dataset.banPerma,{permanent:!0}),await t()},`User banned permanently.`))),W.querySelector(`#sync-commands`)?.addEventListener(`click`,()=>e(async()=>{let e=await g.admin.syncCommands();qi(e.synced?`Commands synced (${e.count}).`:`No sync: ${e.reason||`no source`}.`,e.synced?`ok`:`error`)})),W.querySelector(`#check-cs2`)?.addEventListener(`click`,()=>e(async()=>{let e=await g.admin.checkCommandsCs2();qi(`CS2 build: ${e.build||`unknown`}${e.changed?` (changed → re-synced)`:``}.`,`ok`)})),W.querySelector(`#sync-pros`)?.addEventListener(`click`,()=>e(async()=>{let e=await g.admin.syncPros();qi(e.synced?`Synced ${e.count} pros from ${e.source}.`:`Sync failed: ${e.reason}.`,e.synced?`ok`:`error`)})),W.querySelector(`#import-commands`)?.addEventListener(`click`,()=>Gn({title:`Import commands`,description:`Paste the CS2 console-commands wiki page (wikitext) or a JSON array of commands.`,sourceUrl:`https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_command_variables`,sourceLabel:`Open wiki`,onImport:async e=>`Imported ${(await g.admin.importCommands(e)).count} commands.`})),W.querySelector(`#import-pros`)?.addEventListener(`click`,()=>Gn({title:`Import pro settings from HLTV`,description:`Open HLTV, complete the check, then paste a JSON list of players.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,onImport:async e=>{let t=await g.admin.importPros(e);return await oa(`sync`),`Imported ${t.count} players.`}})),W.querySelectorAll(`[data-contact-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Delete this contact message?`)&&e(async()=>{await g.admin.removeContact(n.dataset.contactDelete),await t()},`Message deleted.`)})),W.querySelector(`#save-settings`)?.addEventListener(`click`,()=>e(async()=>{let e=W.querySelector(`#set-paypal`)?.value||``,t=W.querySelector(`#set-steam`)?.value||``;K.settings=await g.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))},`Donate links saved.`)),W.querySelector(`#owner-logs-filter`)?.addEventListener(`change`,t=>{K.logsFilter=t.target.value||``,e(async()=>{await oa(`logs`),sa()})}),W.querySelector(`#owner-logs-refresh`)?.addEventListener(`click`,()=>e(async()=>{await oa(`logs`),sa()},`Logs refreshed.`))}function ua(e){document.querySelectorAll(`.admin-only`).forEach(t=>t.classList.toggle(`hidden`,!h(e)))}async function da(){W=document.querySelector(`#admin-tool`),W&&(G=Ae(),ua(G),je(async e=>{let t=h(G);G=e,ua(e),h(e)&&!t&&await Yi(),sa()}),sa(),h(G)&&(await Yi(),sa()))}function fa(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function pa(){let e=Ae(),t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact us">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Contact us</h2>
      <p class="hint">Send us a message and we'll get back to you at your email.</p>
      <form id="contact-form" class="auth-form-modal">
        <label class="field"><span>Your name</span><input id="contact-name" type="text" value="${fa(e?.username||``)}" /></label>
        <label class="field"><span>Your email</span><input id="contact-email" type="email" value="${fa(e?.email||``)}" /></label>
        <label class="field"><span>Subject</span><input id="contact-subject" type="text" placeholder="What's this about?" /></label>
        <label class="field"><span>Message</span><textarea id="contact-message" rows="5" placeholder="How can we help?"></textarea></label>
        <div class="captcha-field">
          <div class="captcha-row">
            <div class="captcha-image" id="contact-captcha-img"></div>
            <button type="button" class="captcha-refresh" id="contact-captcha-refresh" title="New image" aria-label="New image">&#8635;</button>
          </div>
          <label class="field"><span>Enter the characters above</span><input id="contact-captcha" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>
        </div>
        <button class="btn primary" type="submit">Send message</button>
        <p class="status" id="contact-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#contact-status`),i=null;async function a(){try{let e=await g.auth.captcha();i=e.token;let n=t.querySelector(`#contact-captcha-img`);n&&(n.innerHTML=e.svg)}catch{}}a(),t.querySelector(`#contact-captcha-refresh`)?.addEventListener(`click`,()=>{let e=t.querySelector(`#contact-captcha`);e&&(e.value=``),a()}),t.querySelector(`#contact-form`).addEventListener(`submit`,async e=>{e.preventDefault();let o={name:t.querySelector(`#contact-name`).value,email:t.querySelector(`#contact-email`).value,subject:t.querySelector(`#contact-subject`).value,message:t.querySelector(`#contact-message`).value,captchaToken:i,captchaAnswer:t.querySelector(`#contact-captcha`).value};r.textContent=`Sending…`,r.className=`status`;try{await g.contact.send(o),r.textContent=`Thanks! Your message has been sent.`,r.className=`status ok`,setTimeout(n,1200)}catch(e){r.textContent=e.message,r.className=`status error`;let n=t.querySelector(`#contact-captcha`);n&&(n.value=``),a()}}),t.querySelector(`#contact-name`)?.focus()}var ma={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]};function ha(e){if(e.color===5)return`rgb(${e.red}, ${e.green}, ${e.blue})`;let t=ma[e.color]??ma[1];return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}function ga(e){return e.alphaEnabled?Math.min(1,Math.max(0,e.alpha/255)):1}function _a(e,t){return Number(e)*(Number(t)/480)}function va(e){let t=Number(e);if(!Number.isFinite(t))return 0;let n=Math.abs(t-Math.trunc(t)),r=Math.round(n*1e3)/1e3;return r>.5?t>=0?Math.ceil(t):Math.floor(t):r===.5?t>=0?Math.floor(t-.1):Math.ceil(t+.1):t>=0?Math.floor(t):Math.ceil(t)}function ya(e){let t=Number(e);return t>=0?Math.floor(t+.5):Math.ceil(t-.5)}function ba(e,t=1080){let n=Number(t)||1080,r=Math.max(0,va(_a(e.length,n))),i=Math.max(1,va(_a(e.thickness,n)));return{length:r,thickness:i,gapInner:2*(4+ya(e.gap))+i,outline:e.outlineEnabled?Math.max(1,va(_a(e.outline,n))):0,resHeight:n}}function xa(e,t,n=1080){let r=e.getContext(`2d`);if(!r)return;let i=e.width,a=i/2,o=i/2;r.clearRect(0,0,i,i);let s=r.createLinearGradient(0,0,i,i);s.addColorStop(0,`#3a4a38`),s.addColorStop(.45,`#5c6b52`),s.addColorStop(1,`#2a3328`),r.fillStyle=s,r.fillRect(0,0,i,i);let c=Math.max(24,Math.round(i/9));r.strokeStyle=`rgba(255,255,255,0.06)`,r.lineWidth=Math.max(1,Math.round(i/280));for(let e=0;e<i;e+=c)r.beginPath(),r.moveTo(e,0),r.lineTo(e,i),r.stroke(),r.beginPath(),r.moveTo(0,e),r.lineTo(i,e),r.stroke();if(!t){r.globalAlpha=.35,r.fillStyle=`#fff`,r.font=`${Math.round(i*.05)}px Outfit, sans-serif`,r.textAlign=`center`,r.fillText(`Enter a code or commands`,a,o+i*.02),r.globalAlpha=1;return}let l=typeof n==`object`&&n?Number(n.resHeight)||1080:Math.round((Number(n)||1)*1080),u=ha(t),d=ga(t),{length:f,thickness:ee,gapInner:p,outline:te}=ba(t,l),ne=Math.round(a),re=Math.round(o),ie=Math.floor(ee/2),ae=p/2,oe=(e,t,n,i)=>{n<=0||i<=0||(te>0&&(r.globalAlpha=d,r.fillStyle=`#000`,r.fillRect(e-te,t-te,n+te*2,i+te*2)),r.globalAlpha=d,r.fillStyle=u,r.fillRect(e,t,n,i))};if(f>0&&(oe(ne+ae,re-ie,f,ee),oe(ne-ae-f,re-ie,f,ee),oe(ne-ie,re+ae,ee,f),t.tStyleEnabled||oe(ne-ie,re-ae-f,ee,f)),t.centerDotEnabled){let e=ee;oe(ne-Math.floor(e/2),re-Math.floor(e/2),e,e)}r.globalAlpha=1,(t.style===2||t.style===3)&&(r.globalAlpha=.6,r.fillStyle=`#fff`,r.font=`${Math.round(i*.039)}px JetBrains Mono, monospace`,r.textAlign=`center`,r.fillText(`style ${t.style} · dynamic (shown static)`,a,i-Math.round(i*.05)),r.globalAlpha=1)}var J=132;function Sa({source:e,stage:t,toggleBtn:n,zoomSelect:r}){let i=document.createElement(`canvas`);i.className=`magnifier-lens hidden`,i.width=J,i.height=J,t.appendChild(i);let a=i.getContext(`2d`),o=!1,s=Number(r?.value)||4,c=null;function l(e){o=e,n.classList.toggle(`active`,e),n.setAttribute(`aria-pressed`,String(e)),t.classList.toggle(`magnifier-on`,e),e||(i.classList.add(`hidden`),c=null)}function u(){if(!o||!c||!a)return;let t=J/s;a.imageSmoothingEnabled=!1,a.clearRect(0,0,J,J),a.fillStyle=`#0e1017`,a.fillRect(0,0,J,J);try{a.drawImage(e,c.sx-t/2,c.sy-t/2,t,t,0,0,J,J)}catch{}a.strokeStyle=`rgba(255,255,255,0.28)`,a.lineWidth=1,a.beginPath(),a.moveTo(66.5,0),a.lineTo(66.5,J),a.moveTo(0,66.5),a.lineTo(J,66.5),a.stroke()}function d(n,r){if(!o)return;let a=e.getBoundingClientRect(),s=n-a.left,l=r-a.top;if(s<0||l<0||s>a.width||l>a.height){i.classList.add(`hidden`);return}c={sx:s*(e.width/a.width),sy:l*(e.height/a.height)};let d=t.getBoundingClientRect();i.style.left=`${n-d.left-J/2}px`,i.style.top=`${r-d.top-J/2}px`,i.classList.remove(`hidden`),u()}e.addEventListener(`mousemove`,e=>d(e.clientX,e.clientY)),e.addEventListener(`mouseleave`,()=>{o&&i.classList.add(`hidden`)});let f=e=>{!o||!e.touches[0]||(e.preventDefault(),d(e.touches[0].clientX,e.touches[0].clientY))};return e.addEventListener(`touchstart`,f,{passive:!1}),e.addEventListener(`touchmove`,f,{passive:!1}),n.addEventListener(`click`,()=>l(!o)),r&&r.addEventListener(`change`,()=>{s=Number(r.value)||4,u()}),{refresh:u,setEnabled:l}}var Ca={cs2:{id:`cs2`,name:`Counter-Strike 2`,yaw:.022,supportsMYaw:!0},csgo:{id:`csgo`,name:`CS:GO`,yaw:.022},valorant:{id:`valorant`,name:`Valorant`,yaw:.07},apex:{id:`apex`,name:`Apex Legends`,yaw:.022},overwatch2:{id:`overwatch2`,name:`Overwatch 2`,yaw:.0066},r6:{id:`r6`,name:`Rainbow Six Siege`,yaw:.00572958},fortnite:{id:`fortnite`,name:`Fortnite`,yaw:.005555},cod:{id:`cod`,name:`Call of Duty`,yaw:.0066},tf2:{id:`tf2`,name:`Team Fortress 2`,yaw:.022},marvel:{id:`marvel`,name:`Marvel Rivals`,yaw:.022},deadlock:{id:`deadlock`,name:`Deadlock`,yaw:.044},tf:{id:`tf`,name:`The Finals`,yaw:.0066},custom:{id:`custom`,name:`Custom (yaw)`,yaw:.022,custom:!0}},wa=Object.values(Ca);function Ta(e,t=.022,n){let r=Ca[e];if(!r)throw Error(`Unknown game: ${e}`);return r.custom?Number(n)>0?Number(n):r.yaw:r.supportsMYaw?t:r.yaw}function Ea(e,t,n){return e<=0||t<=0||n<=0?NaN:914.4/(e*t*n)}function Da({sourceGame:e,targetGame:t,sourceSens:n,sourceDpi:r,targetDpi:i,sourceMYaw:a=.022,targetMYaw:o=.022,sourceCustomYaw:s,targetCustomYaw:c}){let l=Ta(e,a,s),u=Ta(t,o,c),d=r/i*n*(l/u),f=Ea(n,r,l),ee=Ea(d,i,u);return{targetSensitivity:d,cm360:f,inches360:f/2.54,sourceEdpi:n*r,targetEdpi:d*i,sourceYaw:l,targetYaw:u,targetCm360:ee,ratio:l/u}}function Y(e,t=4){return Number.isFinite(e)?String(Number(e.toFixed(t))):`—`}function Oa(e,t=1){return Number.isFinite(e)?e.toFixed(t):`—`}function ka(e){return wa.map(t=>`<option value="${t.id}"${t.id===e?` selected`:``}>${t.name}</option>`).join(``)}var Aa=/^CSGO(-[\w]{5}){5}$/i,ja=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.1 7.3c.3 2-.3 3.6-1.5 4.8-1.2 1.2-3 1.8-5.2 1.8h-1.1c-.4 0-.8.3-.9.8l-.7 4.5-.2 1.1c0 .3-.3.5-.6.5H6.2c-.3 0-.5-.3-.4-.6L8 6.1c.1-.6.6-1 1.2-1h5.3c2.7 0 4.7.9 5.3 2.9.1.4.2.9.3 1.3z"/><path fill="currentColor" opacity=".55" d="M8.9 9.3c.1-.6.6-1 1.2-1h4.2c.6 0 1.1.1 1.6.2-.3-1.6-1.7-2.4-3.9-2.4H6.8c-.4 0-.8.3-.9.8L3.5 21c0 .3.2.6.5.6h3.1l1.8-12.3z"/></svg>`,Ma=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Zm-1.87-2.51a1.88 1.88 0 1 0 3.76 0 1.88 1.88 0 0 0-3.76 0Z"/></svg>`,Na=document.querySelector(`#app`);Na.innerHTML=`
  <div class="page">
    <header class="hero">
      <div class="header-top">
        <div class="hero-badge">Counter-Strike 2</div>
        <div class="account-menu" id="account-menu"></div>
      </div>
      <h1>AimKit</h1>
      <p class="hero-sub">
        Everything you need for your CS2 setup — crosshairs, sensitivity matching,
        nades, commands and pro settings. All in one place, free of charge.
      </p>
      <nav class="tool-nav" role="tablist" aria-label="Tools">
        <span class="tool-nav-group" aria-hidden="true">Tune your aim</span>
        <button class="tool-tab active" data-tool="crosshair" role="tab" aria-selected="true">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
          <span>Crosshair</span>
        </button>
        <button class="tool-tab" data-tool="sensitivity" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="6"/><line x1="12" y1="7" x2="12" y2="11"/></svg>
          <span>Sensitivity</span>
        </button>
        <button class="tool-tab" data-tool="psa" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="4" y1="8" x2="20" y2="8"/><circle cx="9" cy="8" r="2.6" fill="currentColor" stroke="none"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="15" cy="16" r="2.6" fill="currentColor" stroke="none"/></svg>
          <span>PSA Calculator</span>
        </button>
        <span class="tool-nav-sep" aria-hidden="true"></span>
        <span class="tool-nav-group" aria-hidden="true">Learn &amp; copy setups</span>
        <button class="tool-tab" data-tool="pros" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/></svg>
          <span>Pros</span>
        </button>
        <button class="tool-tab" data-tool="nades" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span>Nades DB</span>
        </button>
        <button class="tool-tab" data-tool="commands" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><line x1="13" y1="15" x2="17" y2="15"/></svg>
          <span>Commands</span>
        </button>
        <span class="tool-nav-sep" aria-hidden="true"></span>
        <span class="tool-nav-group" aria-hidden="true">Community</span>
        <button class="tool-tab" data-tool="configs" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M12 11v6"/><path d="M9.5 14.5 12 17l2.5-2.5"/></svg>
          <span>Configs</span>
        </button>
        <button class="tool-tab" data-tool="highlights" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>
          <span>Highlights</span>
        </button>
        <span class="tool-nav-group admin-only hidden" aria-hidden="true">Admin</span>
        <button class="tool-tab admin-only hidden" data-tool="admin" role="tab" aria-selected="false">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Admin</span>
        </button>
      </nav>
      <p class="tool-desc" id="tool-desc"></p>
    </header>

    <main id="crosshair-tool" class="tool-view active">
      <div class="layout layout-crosshair">
        <section class="panel preview-panel">
          <div class="panel-head">
            <h2>Preview</h2>
            <span class="panel-tag">Actual in-game size</span>
          </div>
          <div class="preview-stage">
            <canvas id="preview-canvas" width="280" height="280" aria-label="Crosshair preview"></canvas>
          </div>
          <div class="preview-controls">
            <button type="button" id="magnifier-toggle" class="btn btn-sm ghost" aria-pressed="false" title="Turn on, then hover the preview to zoom in on tiny details">
              <svg class="btn-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10.5 3a7.5 7.5 0 1 0 4.55 13.46L20 21m-9.5-5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11ZM10.5 8v5M8 10.5h5"/></svg>
              Magnifier
            </button>
            <label class="magnifier-zoom">Zoom
              <select id="magnifier-zoom" aria-label="Magnifier zoom level">
                <option value="2">2×</option>
                <option value="4" selected>4×</option>
                <option value="6">6×</option>
                <option value="8">8×</option>
              </select>
            </label>
          </div>
          <label class="field preview-res-field">
            <span>Resolution <output id="preview-res-scale"></output></span>
            <select id="preview-res"></select>
          </label>
          <dl id="preview-stats" class="preview-stats"></dl>
        </section>

        <section class="panel converter-panel">
          <div class="tabs" role="tablist">
            <button class="tab active" data-tab="code-to-cmd" role="tab" aria-selected="true">Code → Commands</button>
            <button class="tab" data-tab="cmd-to-code" role="tab" aria-selected="false">Commands → Code</button>
            <button class="tab" data-tab="visual" role="tab" aria-selected="false">Visual editor</button>
          </div>

          <div class="tab-panel active" data-panel="code-to-cmd">
            <label class="field">
              <span>Crosshair share code</span>
              <input id="sharecode-input" type="text" spellcheck="false" placeholder="CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK" autocomplete="off" />
            </label>
            <div class="actions">
              <button class="btn primary" id="decode-btn">Convert to commands</button>
              <button class="btn ghost" id="load-example-code">Load example</button>
            </div>
            <label class="field">
              <span>Console commands</span>
              <textarea id="commands-output" rows="14" readonly spellcheck="false"></textarea>
            </label>
            <div class="actions">
              <button class="btn" id="copy-commands">Copy commands</button>
              <button class="btn ghost" id="copy-sharecode-cmd">Copy import command</button>
            </div>
            <p class="hint">Paste into the developer console, or use <code>cl_crosshair_sharecode "YOUR-CODE"</code>.</p>
          </div>

          <div class="tab-panel" data-panel="cmd-to-code">
            <label class="field">
              <span>Console commands</span>
              <textarea id="commands-input" rows="14" spellcheck="false" placeholder="cl_crosshairstyle 4;&#10;cl_crosshairsize 3;&#10;..."></textarea>
            </label>
            <div class="actions">
              <button class="btn primary" id="encode-btn">Convert to code</button>
              <button class="btn ghost" id="load-example-cmd">Load example</button>
            </div>
            <label class="field">
              <span>Crosshair share code</span>
              <input id="sharecode-output" type="text" readonly spellcheck="false" />
            </label>
            <div class="actions">
              <button class="btn" id="copy-code">Copy code</button>
            </div>
            <p class="hint">Import via Settings → Game → Crosshair → Share or Import.</p>
          </div>

          <div class="tab-panel" data-panel="visual">
            <label class="field">
              <span>Share code</span>
              <input id="ed-sharecode" type="text" spellcheck="false" placeholder="CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK" autocomplete="off" />
            </label>
            <div class="actions">
              <button class="btn primary" type="button" id="ed-apply-code">Load code</button>
            </div>

            <div class="editor-grid">
              <label class="field">
                <span>Style</span>
                <select id="ed-style">
                  <option value="0">0 — Default</option>
                  <option value="1">1 — Default static</option>
                  <option value="2">2 — Classic</option>
                  <option value="3">3 — Classic dynamic</option>
                  <option value="4">4 — Classic static</option>
                </select>
              </label>
              <label class="field">
                <span>Color</span>
                <select id="ed-color">
                  <option value="0">White</option>
                  <option value="1">Green</option>
                  <option value="2">Yellow</option>
                  <option value="3">Blue</option>
                  <option value="4">Cyan</option>
                  <option value="5">Custom (RGB)</option>
                </select>
              </label>
            </div>

            <div class="field hidden" id="ed-custom-color-field">
              <span>Custom RGB <output id="ed-rgb-val"></output></span>
              <div class="rgb-control">
                <span class="rgb-swatch" id="ed-color-swatch"></span>
                <input id="ed-custom-color" type="color" value="#32fa32" aria-label="Color picker" />
              </div>
              <label class="range-field rgb-slider"><span>R</span><div class="range-row"><input id="ed-r" type="range" min="0" max="255" step="1" /><input id="ed-r-num" class="range-num" type="number" min="0" max="255" step="1" /></div></label>
              <label class="range-field rgb-slider"><span>G</span><div class="range-row"><input id="ed-g" type="range" min="0" max="255" step="1" /><input id="ed-g-num" class="range-num" type="number" min="0" max="255" step="1" /></div></label>
              <label class="range-field rgb-slider"><span>B</span><div class="range-row"><input id="ed-b" type="range" min="0" max="255" step="1" /><input id="ed-b-num" class="range-num" type="number" min="0" max="255" step="1" /></div></label>
            </div>

            <label class="field range-field">
              <span>Size</span>
              <div class="range-row">
                <input id="ed-length" type="range" min="0" max="15" step="0.5" />
                <input id="ed-length-num" class="range-num" type="number" min="0" max="15" step="0.5" />
              </div>
            </label>
            <label class="field range-field">
              <span>Thickness</span>
              <div class="range-row">
                <input id="ed-thickness" type="range" min="0" max="6" step="0.1" />
                <input id="ed-thickness-num" class="range-num" type="number" min="0" max="6" step="0.1" />
              </div>
            </label>
            <label class="field range-field">
              <span>Gap</span>
              <div class="range-row">
                <input id="ed-gap" type="range" min="-10" max="10" step="0.5" />
                <input id="ed-gap-num" class="range-num" type="number" min="-10" max="10" step="0.5" />
              </div>
            </label>
            <label class="field range-field">
              <span>Outline thickness</span>
              <div class="range-row">
                <input id="ed-outline" type="range" min="0" max="3" step="0.5" />
                <input id="ed-outline-num" class="range-num" type="number" min="0" max="3" step="0.5" />
              </div>
            </label>
            <label class="field range-field">
              <span>Alpha</span>
              <div class="range-row">
                <input id="ed-alpha" type="range" min="0" max="255" step="5" />
                <input id="ed-alpha-num" class="range-num" type="number" min="0" max="255" step="1" />
              </div>
            </label>

            <div class="editor-toggles">
              <label class="toggle"><input id="ed-dot" type="checkbox" /> Center dot</label>
              <label class="toggle"><input id="ed-tstyle" type="checkbox" /> T-style</label>
              <label class="toggle"><input id="ed-outline-on" type="checkbox" /> Outline</label>
              <label class="toggle"><input id="ed-alpha-on" type="checkbox" /> Use alpha</label>
            </div>

            <label class="field">
              <span>Console commands</span>
              <textarea id="ed-commands" rows="10" spellcheck="false" placeholder="cl_crosshairstyle 4;&#10;cl_crosshairsize 3;&#10;..."></textarea>
            </label>
            <div class="actions">
              <button class="btn primary" type="button" id="ed-apply-commands">Apply commands</button>
              <button class="btn" type="button" id="ed-copy-code">Copy code</button>
              <button class="btn" type="button" id="ed-copy-commands">Copy commands</button>
              <button class="btn ghost" type="button" id="ed-reset">Reset</button>
            </div>
            <p class="hint">Paste a share code or edit commands, then tweak with the sliders — preview updates live.</p>
          </div>

          <div id="crosshair-status" class="status" role="status" aria-live="polite"></div>
        </section>
      </div>
    </main>

    <main id="sensitivity-tool" class="tool-view">
      <div class="layout layout-sensitivity">
        <section class="panel sens-summary-panel">
          <div class="panel-head">
            <h2>Distance / 360°</h2>
            <span class="panel-tag">Matched across games</span>
          </div>
          <div class="sens-hero-stat">
            <span id="sens-cm360" class="sens-big">—</span>
            <span class="sens-unit">cm / 360°</span>
          </div>
          <dl id="sens-stats" class="preview-stats sens-stats"></dl>
          <p class="sens-note">Converts using each game's yaw constant so the same mouse movement produces the same turn distance.</p>
        </section>

        <section class="panel converter-panel">
          <div class="sens-grid">
            <label class="field">
              <span>From game</span>
              <select id="sens-from-game"></select>
            </label>
            <label class="field">
              <span>To game</span>
              <select id="sens-to-game"></select>
            </label>
          </div>

          <div class="sens-grid">
            <label class="field">
              <span>Source sensitivity</span>
              <input id="sens-source" type="number" min="0" step="0.001" inputmode="decimal" placeholder="1.25" />
            </label>
            <label class="field">
              <span>Converted sensitivity</span>
              <input id="sens-target" type="text" readonly />
            </label>
          </div>

          <div class="sens-grid">
            <label class="field">
              <span>Source DPI</span>
              <input id="sens-source-dpi" type="number" min="1" step="50" inputmode="numeric" value="800" />
            </label>
            <label class="field">
              <span>Target DPI</span>
              <input id="sens-target-dpi" type="number" min="1" step="50" inputmode="numeric" value="800" />
            </label>
          </div>

          <div id="m-yaw-fields" class="sens-grid hidden">
            <label class="field">
              <span>CS2 source m_yaw</span>
              <input id="sens-source-myaw" type="number" min="0.001" step="0.001" inputmode="decimal" value="0.022" />
            </label>
            <label class="field">
              <span>CS2 target m_yaw</span>
              <input id="sens-target-myaw" type="number" min="0.001" step="0.001" inputmode="decimal" value="0.022" />
            </label>
          </div>

          <div class="sens-grid">
            <label class="field hidden" id="source-yaw-field">
              <span>Source custom yaw (°/count)</span>
              <input id="sens-source-yaw" type="number" min="0.00001" step="0.0001" inputmode="decimal" value="0.022" />
            </label>
            <label class="field hidden" id="target-yaw-field">
              <span>Target custom yaw (°/count)</span>
              <input id="sens-target-yaw" type="number" min="0.00001" step="0.0001" inputmode="decimal" value="0.022" />
            </label>
          </div>

          <div class="actions">
            <button class="btn primary" id="sens-swap">Swap games</button>
            <button class="btn" id="copy-sens">Copy converted sens</button>
            <button class="btn ghost" id="sens-cs2-val">CS2 → Valorant example</button>
          </div>

          <div id="sens-formula" class="sens-formula"></div>
          <div id="sensitivity-status" class="status" role="status" aria-live="polite"></div>
        </section>
      </div>
    </main>

    <main id="psa-tool" class="tool-view">
      <div class="layout layout-sensitivity">
        <section class="panel sens-summary-panel">
          <div class="panel-head">
            <h2>PSA Method</h2>
            <span class="panel-tag">Perfect Sensitivity Approximation</span>
          </div>
          <div class="sens-hero-stat">
            <span id="psa-result" class="sens-big">—</span>
            <span class="sens-unit" id="psa-result-label">recommended sensitivity</span>
          </div>
          <dl id="psa-stats" class="preview-stats sens-stats"></dl>
          <p class="sens-note">A 7-round binary search starting from your <strong>pad 360°</strong> sensitivity — the in-game sens where moving across your whole playable mousepad area does exactly one full turn. Narrow it until it feels right.</p>
        </section>

        <section class="panel converter-panel">
          <details class="psa-instructions" open>
            <summary>How the PSA method works</summary>
            <ol class="psa-steps-list">
              <li>
                Find your <strong>pad 360° sensitivity</strong>: in-game, adjust <code>sensitivity</code> until moving your mouse from one edge of your playable pad area to the other turns you exactly <strong>360°</strong>. Enter that value below and press <strong>Start PSA</strong>.
              </li>
              <li>Each round gives a <strong>lower</strong> and <strong>higher</strong> sensitivity. Set each one in-game and test with the same routine (e.g. <code>aim_botz</code>, deathmatch, or retakes).</li>
              <li>Pick the side that felt <strong>more controllable</strong> — better first-shot accuracy and tracking.</li>
              <li>The range narrows around your choice. Repeat for all <strong>7 rounds</strong>.</li>
              <li>After the final round you get your <strong>recommended sensitivity</strong>. Apply it via <em>Settings → Mouse</em> or <code>sensitivity &lt;value&gt;</code>.</li>
            </ol>
            <p class="hint">Tips: give each value equal test time, keep DPI &amp; resolution the same, and use the same map/routine every round. Your pad 360° is only the starting base — PSA will move away from it toward what feels best.</p>
          </details>
          <label class="field">
            <span>Pad 360° sensitivity (full pad swipe = one turn)</span>
            <input id="psa-start" type="number" min="0" step="0.01" inputmode="decimal" value="1.00" />
          </label>
          <div class="actions">
            <button class="btn primary" id="psa-begin">Start PSA</button>
          </div>

          <div id="psa-round" class="psa-round hidden">
            <div class="psa-progress">
              <span>Round <strong id="psa-round-num">1</strong> / 7</span>
              <div class="psa-bar"><div id="psa-bar-fill" class="psa-bar-fill"></div></div>
            </div>
            <p class="psa-instruction">Test both values in-game, then choose the one that feels more controllable.</p>
            <div class="psa-choices">
              <button class="btn psa-choice" id="psa-lower">
                <span class="psa-choice-label">Lower feels better</span>
                <span class="psa-choice-val" id="psa-lower-val">—</span>
              </button>
              <button class="btn psa-choice" id="psa-higher">
                <span class="psa-choice-label">Higher feels better</span>
                <span class="psa-choice-val" id="psa-higher-val">—</span>
              </button>
            </div>
            <div class="actions">
              <button class="btn ghost" id="psa-undo">Undo last</button>
              <button class="btn ghost" id="psa-reset">Reset</button>
            </div>
          </div>

          <div id="psa-history" class="sens-formula hidden"></div>
          <div id="psa-status" class="status" role="status" aria-live="polite"></div>
        </section>
      </div>
    </main>

    <main id="nades-tool" class="tool-view"></main>

    <main id="commands-tool" class="tool-view"></main>

    <main id="configs-tool" class="tool-view"></main>

    <main id="highlights-tool" class="tool-view"></main>

    <main id="pros-tool" class="tool-view"></main>

    <main id="profile-tool" class="tool-view"></main>

    <main id="admin-tool" class="tool-view"></main>

    <footer class="footer">
      <section class="donate hidden" id="donate-section">
        <p class="donate-label">Found AimKit useful? Support the project:</p>
        <div class="donate-actions" id="donate-actions"></div>
      </section>
      <p class="footer-note">Not affiliated with Valve. Share codes and yaw values are community-verified.</p>
      <p class="footer-links"><button class="footer-link" id="contact-open">Contact us</button></p>
    </footer>

    <div class="donate-fab hidden" id="donate-fab" aria-label="Support AimKit"></div>
  </div>
`;var Pa=document.querySelector(`#preview-canvas`),Fa=document.querySelector(`#preview-stats`),Ia=document.querySelector(`#preview-res`),La=document.querySelector(`#preview-res-scale`);Pa.width=280,Pa.height=280,Pa.style.imageRendering=`pixelated`;var Ra=[{id:`1920x1080`,h:1080,label:`1920 × 1080 (16:9)`},{id:`2560x1440`,h:1440,label:`2560 × 1440 (16:9)`},{id:`3840x2160`,h:2160,label:`3840 × 2160 (4K)`},{id:`1600x900`,h:900,label:`1600 × 900 (16:9)`},{id:`1366x768`,h:768,label:`1366 × 768 (16:9)`},{id:`1280x960`,h:960,label:`1280 × 960 (4:3)`},{id:`1024x768`,h:768,label:`1024 × 768 (4:3)`},{id:`1280x1024`,h:1024,label:`1280 × 1024 (5:4)`}],za=null;function Ba(){return(Ra.find(e=>e.id===Ia?.value)||Ra[0]).h}var Va=Sa({source:Pa,stage:document.querySelector(`.preview-stage`),toggleBtn:document.querySelector(`#magnifier-toggle`),zoomSelect:document.querySelector(`#magnifier-zoom`)});function Ha(e){if(za=e,xa(Pa,e,{resHeight:Ba()}),La)if(e){let t=Ra.find(e=>e.id===Ia?.value)||Ra[0],n=ba(e,t.h);La.textContent=`≈ ${n.length}px arms · ${n.thickness}px thick @ ${t.h}p`}else La.textContent=``;Va.refresh()}var X=document.querySelector(`#crosshair-status`),Ua=document.querySelector(`#sensitivity-status`),Wa=document.querySelector(`#sharecode-input`),Ga=document.querySelector(`#commands-output`),Ka=document.querySelector(`#commands-input`),qa=document.querySelector(`#sharecode-output`),Ja=document.querySelector(`#sens-from-game`),Ya=document.querySelector(`#sens-to-game`),Xa=document.querySelector(`#sens-source`),Za=document.querySelector(`#sens-target`),Qa=document.querySelector(`#sens-source-dpi`),$a=document.querySelector(`#sens-target-dpi`),eo=document.querySelector(`#sens-source-myaw`),to=document.querySelector(`#sens-target-myaw`),no=document.querySelector(`#sens-source-yaw`),ro=document.querySelector(`#sens-target-yaw`),io=document.querySelector(`#source-yaw-field`),ao=document.querySelector(`#target-yaw-field`),oo=document.querySelector(`#m-yaw-fields`),so=document.querySelector(`#sens-cm360`),co=document.querySelector(`#sens-stats`),lo=document.querySelector(`#sens-formula`),uo=`CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK`,fo=`cl_crosshairstyle 4
cl_crosshairsize 3
cl_crosshairgap -2
cl_crosshairthickness 0.5
cl_crosshairdot 0
cl_crosshaircolor 1
cl_crosshaircolor_r 50
cl_crosshaircolor_g 250
cl_crosshaircolor_b 50
cl_crosshairalpha 200
cl_crosshairusealpha 1
cl_crosshair_drawoutline 0
cl_crosshair_recoil 0`;function Z(e,t,n=``){e&&(e.textContent=t,e.className=`status${n?` ${n}`:``}`)}function po(e){Ha(e),Fa.innerHTML=`
    <div><dt>Style</dt><dd>${e.style}</dd></div>
    <div><dt>Size</dt><dd>${e.length}</dd></div>
    <div><dt>Gap</dt><dd>${e.gap}</dd></div>
    <div><dt>Thickness</dt><dd>${e.thickness}</dd></div>
    <div><dt>Dot</dt><dd>${e.centerDotEnabled?`On`:`Off`}</dd></div>
    <div><dt>Outline</dt><dd>${e.outlineEnabled?e.outline:`Off`}</dd></div>
    <div><dt>Color</dt><dd>${e.color===5?`RGB ${e.red}/${e.green}/${e.blue}`:`Preset ${e.color}`}</dd></div>
    <div><dt>Alpha</dt><dd>${e.alphaEnabled?e.alpha:`Off`}</dd></div>
  `}function mo(e){return e.trim().replace(/\s+/g,``).replace(/^csgo/i,`CSGO`)}function ho(){let e=Wa.value.trim();if(!e){Z(X,`Paste a crosshair share code first.`,`error`);return}let t=mo(e);if(!Aa.test(t)){Z(X,`Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`,`error`);return}try{let e=d(t);Wa.value=t,Ga.value=ce(ee(e)),po(e),Z(X,`Converted share code to console commands.`,`ok`)}catch(e){e instanceof i||e instanceof r?Z(X,`That share code is not a valid crosshair code.`,`error`):Z(X,e instanceof Error?e.message:`Failed to decode share code.`,`error`)}}function go(){let e=Ka.value.trim();if(!e){Z(X,`Paste crosshair console commands first.`,`error`);return}try{let t=se(e);qa.value=f(t),po(t),Z(X,`Converted commands to share code.`,`ok`)}catch(e){Z(X,e instanceof Error?e.message:`Failed to encode share code.`,`error`)}}async function _o(e,t,n){if(!t){Z(e,`Nothing to copy for ${n}.`,`error`);return}try{await navigator.clipboard.writeText(t),Z(e,`Copied ${n} to clipboard.`,`ok`)}catch{Z(e,`Clipboard access failed. Select and copy manually.`,`error`)}}function vo(){let e=Ca[Ja.value]?.supportsMYaw||Ca[Ya.value]?.supportsMYaw;oo?.classList.toggle(`hidden`,!e),io?.classList.toggle(`hidden`,!Ca[Ja.value]?.custom),ao?.classList.toggle(`hidden`,!Ca[Ya.value]?.custom)}function yo(){let e=Number(Xa.value),t=Number(Qa.value),n=Number($a.value),r=Number(eo.value)||.022,i=Number(to.value)||.022,a=Number(no.value),o=Number(ro.value);if(vo(),Ca[Ja.value]?.custom&&!(a>0)){Z(Ua,`Enter a valid source custom yaw (° per count).`,`error`);return}if(Ca[Ya.value]?.custom&&!(o>0)){Z(Ua,`Enter a valid target custom yaw (° per count).`,`error`);return}if(!Number.isFinite(e)||e<=0){Za.value=``,so.textContent=`—`,co.innerHTML=``,lo.textContent=``;return}if(!Number.isFinite(t)||t<=0||!Number.isFinite(n)||n<=0){Z(Ua,`Enter valid DPI values.`,`error`);return}let s=Da({sourceGame:Ja.value,targetGame:Ya.value,sourceSens:e,sourceDpi:t,targetDpi:n,sourceMYaw:r,targetMYaw:i,sourceCustomYaw:a,targetCustomYaw:o}),c=Ca[Ja.value].name,l=Ca[Ya.value].name,u=Y(s.targetSensitivity);Za.value=u,so.textContent=Oa(s.cm360),co.innerHTML=`
    <div><dt>Inches / 360°</dt><dd>${Oa(s.inches360)} in</dd></div>
    <div><dt>Source eDPI</dt><dd>${Oa(s.sourceEdpi,0)}</dd></div>
    <div><dt>Target eDPI</dt><dd>${Oa(s.targetEdpi,0)}</dd></div>
    <div><dt>Source yaw</dt><dd>${s.sourceYaw}</dd></div>
    <div><dt>Target yaw</dt><dd>${s.targetYaw}</dd></div>
    <div><dt>Multiplier</dt><dd>× ${Y(s.ratio,5)}</dd></div>
  `,lo.innerHTML=`
    <strong>Formula:</strong>
    target = source × (source DPI ÷ target DPI) × (source yaw ÷ target yaw)<br />
    ${u} = ${e} × (${t} ÷ ${n}) × (${s.sourceYaw} ÷ ${s.targetYaw})
  `,Z(Ua,`${c} → ${l}: ${u}`,`ok`)}function bo(){let e=Ja.value;Ja.value=Ya.value,Ya.value=e,Za.value&&(Xa.value=Za.value),yo()}function xo(){Ja.value=`cs2`,Ya.value=`valorant`,Xa.value=`1.25`,Qa.value=`800`,$a.value=`800`,yo()}var So={crosshair:`Convert a crosshair share code into console commands, build a code from commands, or design one visually with a live preview.`,sensitivity:`Keep the same cm/360 aim feel across games — with custom yaw values and DPI changes handled for you.`,psa:`Start from your pad 360° sens (full mousepad swipe = one turn), then narrow it with a guided 7-round A/B test.`,nades:`Browse community grenade line-ups, or sign in to submit your own with a 2D throw guide, videos and photos.`,commands:`Copy up-to-date CS2 launch options and console commands, recommend the ones that help, and share tips in the comments.`,configs:`Share your CS2 configs and video settings, download other players’ setups, and rate the best ones.`,highlights:`Share your best CS2 clips, watch the community’s highlights, and report anything that breaks the rules.`,pros:`Browse pro players’ sensitivity, DPI, resolution and crosshair settings.`,profile:`Your account, contributions, and settings.`,admin:`Moderate content, manage users, sync data sources, and read contact messages.`},Co=document.querySelector(`#tool-desc`);function wo(e){Co&&(Co.textContent=So[e]||``)}function To(e){document.querySelectorAll(`.tool-nav .tool-tab`).forEach(t=>{let n=t.getAttribute(`data-tool`)===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.tool-view`).forEach(t=>{t.classList.toggle(`active`,t.id===`${e}-tool`)}),wo(e),window.scrollTo({top:0,behavior:`smooth`})}document.querySelectorAll(`.tool-nav .tool-tab`).forEach(e=>{e.addEventListener(`click`,()=>To(e.getAttribute(`data-tool`)))}),document.addEventListener(`aimkit:navigate`,e=>To(e.detail)),wo(`crosshair`),document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{let n=e.getAttribute(`data-tab`)===t;e.classList.toggle(`active`,n),e.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.converter-panel .tab-panel`).forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-panel`)===t)})})}),document.querySelector(`#decode-btn`)?.addEventListener(`click`,ho),document.querySelector(`#encode-btn`)?.addEventListener(`click`,go),Wa.addEventListener(`keydown`,e=>{e.key===`Enter`&&ho()}),Ka.addEventListener(`input`,()=>{let e=Ka.value.trim();if(!e){Ha(null),Fa.innerHTML=``;return}try{po(se(e))}catch{}}),Wa.addEventListener(`input`,()=>{let e=mo(Wa.value);if(Aa.test(e))try{po(d(e))}catch{}}),document.querySelector(`#copy-commands`)?.addEventListener(`click`,()=>{_o(X,Ga.value,`commands`)}),document.querySelector(`#copy-code`)?.addEventListener(`click`,()=>{_o(X,qa.value,`share code`)}),document.querySelector(`#copy-sharecode-cmd`)?.addEventListener(`click`,()=>{let e=mo(Wa.value);if(!e){Z(X,`Enter a share code first.`,`error`);return}_o(X,`cl_crosshair_sharecode "${e}"`,`import command`)}),document.querySelector(`#load-example-code`)?.addEventListener(`click`,()=>{Wa.value=uo,ho()}),document.querySelector(`#load-example-cmd`)?.addEventListener(`click`,()=>{Ka.value=fo,go()});var Eo={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]},Q={...ne},Do=document.querySelector(`#ed-style`),Oo=document.querySelector(`#ed-color`),ko=document.querySelector(`#ed-custom-color`),Ao=document.querySelector(`#ed-custom-color-field`),jo=document.querySelector(`#ed-r`),Mo=document.querySelector(`#ed-g`),No=document.querySelector(`#ed-b`),Po=document.querySelector(`#ed-rgb-val`),Fo=document.querySelector(`#ed-color-swatch`);function Io(e,t){e&&document.activeElement!==e&&(e.value=String(t))}var Lo=document.querySelector(`#ed-length`),Ro=document.querySelector(`#ed-thickness`),zo=document.querySelector(`#ed-gap`),Bo=document.querySelector(`#ed-outline`),Vo=document.querySelector(`#ed-alpha`),Ho=document.querySelector(`#ed-dot`),Uo=document.querySelector(`#ed-tstyle`),Wo=document.querySelector(`#ed-outline-on`),Go=document.querySelector(`#ed-alpha-on`),Ko=document.querySelector(`#ed-sharecode`),qo=document.querySelector(`#ed-commands`),Jo=document.querySelector(`#ed-length-num`),Yo=document.querySelector(`#ed-thickness-num`),Xo=document.querySelector(`#ed-gap-num`),Zo=document.querySelector(`#ed-outline-num`),Qo=document.querySelector(`#ed-alpha-num`),$o=document.querySelector(`#ed-r-num`),es=document.querySelector(`#ed-g-num`),ts=document.querySelector(`#ed-b-num`),ns=(e,t,n)=>Math.max(t,Math.min(n,e)),rs=[{key:`length`,slider:Lo,num:Jo,min:0,max:15},{key:`thickness`,slider:Ro,num:Yo,min:0,max:6},{key:`gap`,slider:zo,num:Xo,min:-10,max:10},{key:`outline`,slider:Bo,num:Zo,min:0,max:3},{key:`alpha`,slider:Vo,num:Qo,min:0,max:255}],is=[{key:`red`,slider:jo,num:$o},{key:`green`,slider:Mo,num:es},{key:`blue`,slider:No,num:ts}];function as(e,t,n){let r=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,`0`);return`#${r(e)}${r(t)}${r(n)}`}function os(e){let t=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(e.trim());return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:{r:Q.red,g:Q.green,b:Q.blue}}function ss(){let e=as(Q.red,Q.green,Q.blue);Oo.value=String(Q.color),Io(ko,e);for(let e of is)Io(e.slider,Q[e.key]),Io(e.num,Q[e.key]);Po&&(Po.textContent=`${Q.red}, ${Q.green}, ${Q.blue}`),Fo&&(Fo.style.background=e),Ao?.classList.toggle(`hidden`,Q.color!==5)}function cs(){for(let e of rs)Io(e.slider,ns(Q[e.key],e.min,e.max)),Io(e.num,Q[e.key])}function ls(){Do.value=String(Q.style),Ho.checked=Q.centerDotEnabled,Uo.checked=Q.tStyleEnabled,Wo.checked=Q.outlineEnabled,Go.checked=Q.alphaEnabled,cs(),ss()}function us(){cs();let e=!Q.outlineEnabled;Bo.disabled=e,Zo.disabled=e;let t=!Q.alphaEnabled;Vo.disabled=t,Qo.disabled=t;try{Io(Ko,f(Q))}catch{Io(Ko,``)}Io(qo,ce(ee(Q)))}function ds(){po(Q),us()}function fs(e,t){Object.assign(Q,ne,e),ls(),ds(),t&&Z(X,t,`ok`)}function ps(){let e=Ko.value.trim();if(!e){Z(X,`Paste a crosshair share code first.`,`error`);return}let t=mo(e);if(!t){Z(X,`Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`,`error`);return}try{fs(d(t),`Loaded share code into the editor.`)}catch(e){e instanceof i||e instanceof r?Z(X,`That share code is not a valid crosshair code.`,`error`):Z(X,e instanceof Error?e.message:`Failed to decode share code.`,`error`)}}function ms(){let e=qo.value.trim();if(!e){Z(X,`Paste crosshair console commands first.`,`error`);return}try{fs(se(e),`Applied commands to the editor.`)}catch(e){Z(X,e instanceof Error?e.message:`Failed to parse commands.`,`error`)}}function hs(){Q.style=Number(Do.value),Q.centerDotEnabled=Ho.checked,Q.tStyleEnabled=Uo.checked,Q.outlineEnabled=Wo.checked,Q.alphaEnabled=Go.checked,ds()}function gs(e){Q[e.key]=Number(e.slider.value),ds()}function _s(e,t){let n=Number(e.num.value);if(e.num.value===``||!Number.isFinite(n)){t&&(e.num.value=String(Q[e.key]));return}Q[e.key]=ns(n,e.min,e.max),t&&(e.num.value=String(Q[e.key])),ds()}function vs(){Q.color=5,Q.red=ns(Number($o.value)||0,0,255),Q.green=ns(Number(es.value)||0,0,255),Q.blue=ns(Number(ts.value)||0,0,255),ss(),ds()}function ys(){if(Q.color=Number(Oo.value),Q.color!==5){let[e,t,n]=Eo[Q.color]??Eo[1];Q.red=e,Q.green=t,Q.blue=n}ss(),ds()}function bs(){Q.color=5,Q.red=Number(jo.value),Q.green=Number(Mo.value),Q.blue=Number(No.value),ss(),ds()}function xs(){Q.color=5;let{r:e,g:t,b:n}=os(ko.value);Q.red=e,Q.green=t,Q.blue=n,ss(),ds()}rs.forEach(e=>{e.slider.addEventListener(`input`,()=>gs(e)),e.num.addEventListener(`input`,()=>_s(e,!1)),e.num.addEventListener(`change`,()=>_s(e,!0))}),[Do,Ho,Uo,Wo,Go].forEach(e=>e.addEventListener(`change`,hs)),Oo.addEventListener(`change`,ys),ko.addEventListener(`input`,xs),ko.addEventListener(`change`,xs),is.forEach(e=>{e.slider.addEventListener(`input`,bs),e.num.addEventListener(`input`,vs),e.num.addEventListener(`change`,vs)}),document.querySelector(`#ed-apply-code`)?.addEventListener(`click`,ps),document.querySelector(`#ed-apply-commands`)?.addEventListener(`click`,ms),Ko?.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),ps())}),document.querySelector(`#ed-copy-code`)?.addEventListener(`click`,()=>{_o(X,Ko.value,`share code`)}),document.querySelector(`#ed-copy-commands`)?.addEventListener(`click`,()=>{_o(X,qo.value,`commands`)}),document.querySelector(`#ed-reset`)?.addEventListener(`click`,()=>{Object.assign(Q,ne),ls(),ds(),Z(X,`Crosshair reset to defaults.`,`ok`)}),document.querySelector(`.converter-panel .tab[data-tab="visual"]`)?.addEventListener(`click`,ds),ls(),us(),Ja.innerHTML=ka(`cs2`),Ya.innerHTML=ka(`valorant`),[Ja,Ya,Xa,Qa,$a,eo,to,no,ro].forEach(e=>{e.addEventListener(`input`,yo),e.addEventListener(`change`,yo)}),document.querySelector(`#sens-swap`)?.addEventListener(`click`,bo),document.querySelector(`#copy-sens`)?.addEventListener(`click`,()=>{_o(Ua,Za.value,`converted sensitivity`)}),document.querySelector(`#sens-cs2-val`)?.addEventListener(`click`,xo);var Ss=document.querySelector(`#psa-start`),Cs=document.querySelector(`#psa-begin`),ws=document.querySelector(`#psa-round`),Ts=document.querySelector(`#psa-round-num`),Es=document.querySelector(`#psa-bar-fill`),Ds=document.querySelector(`#psa-lower`),Os=document.querySelector(`#psa-higher`),ks=document.querySelector(`#psa-lower-val`),As=document.querySelector(`#psa-higher-val`),js=document.querySelector(`#psa-undo`),Ms=document.querySelector(`#psa-reset`),Ns=document.querySelector(`#psa-result`),Ps=document.querySelector(`#psa-result-label`),Fs=document.querySelector(`#psa-stats`),Is=document.querySelector(`#psa-history`),Ls=document.querySelector(`#psa-status`),$=null;function Rs(){if(!$){ws?.classList.add(`hidden`),Is?.classList.add(`hidden`),Ns.textContent=`—`,Ps.textContent=`recommended sensitivity`,Fs.innerHTML=``;return}let e=fe($),t=e?_e($):pe($);if(Ns.textContent=Y(t,3),Ps.textContent=e?`final recommended sensitivity`:`current estimate`,Fs.innerHTML=`
    <div><dt>Range low</dt><dd>${Y($.lo,3)}</dd></div>
    <div><dt>Range high</dt><dd>${Y($.hi,3)}</dd></div>
    <div><dt>Spread</dt><dd>± ${Y(me($)/2*100,1)}%</dd></div>
    <div><dt>Pad 360° base</dt><dd>${Y($.base,3)}</dd></div>
  `,e)ws?.classList.add(`hidden`),Z(Ls,`Done — set your sensitivity to ${Y(t,3)} and play a few sessions before changing again.`,`ok`);else{let{lower:e,higher:t}=de($);ws?.classList.remove(`hidden`),Ts.textContent=String($.round),Es.style.width=`${($.round-1)/7*100}%`,ks.textContent=Y(e,3),As.textContent=Y(t,3),Z(Ls,`Round ${$.round} of 7: test both values, then pick the side that feels better.`,``)}$.choices.length>0?(Is?.classList.remove(`hidden`),Is.innerHTML=`<strong>History:</strong><br />${$.choices.map(e=>`Round ${e.round}: chose <strong>${e.side}</strong> (${Y(e.lower,3)} vs ${Y(e.higher,3)})`).join(`<br />`)}`):(Is?.classList.add(`hidden`),Is.innerHTML=``)}function zs(){let e=Number(Ss.value);if(!Number.isFinite(e)||e<=0){Z(Ls,`Enter a valid pad 360° sensitivity greater than 0.`,`error`);return}$=ue(e),Rs()}function Bs(e){!$||fe($)||($=he($,e),Rs())}Cs?.addEventListener(`click`,zs),Ds?.addEventListener(`click`,()=>Bs(`lower`)),Os?.addEventListener(`click`,()=>Bs(`higher`)),js?.addEventListener(`click`,()=>{$&&($=ge($),Rs())}),Ms?.addEventListener(`click`,()=>{$=null,Rs(),Z(Ls,`Enter your pad 360° sensitivity and press Start PSA.`,``)}),Ia.innerHTML=Ra.map(e=>`<option value="${e.id}">${e.label}</option>`).join(``),Ia.addEventListener(`change`,()=>Ha(za)),Ha(null),ho(),xo();function Vs(e){return String(e||``).replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`)}function Hs(e){let t=document.querySelector(`#donate-section`),n=document.querySelector(`#donate-actions`);if(!t||!n)return;let r=[];e.paypalUrl&&r.push(`<a class="btn donate-btn paypal" href="${Vs(e.paypalUrl)}" target="_blank" rel="noopener noreferrer">${ja}<span>Donate via PayPal</span></a>`),e.steamTradeUrl&&r.push(`<a class="btn donate-btn steam" href="${Vs(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer">${Ma}<span>Donate Steam skins</span></a>`),n.innerHTML=r.join(``),t.classList.toggle(`hidden`,r.length===0);let i=document.querySelector(`#donate-fab`);if(i){let t=[];e.paypalUrl&&t.push(`<a class="donate-fab-btn paypal" href="${Vs(e.paypalUrl)}" target="_blank" rel="noopener noreferrer" title="Donate via PayPal">${ja}<span>PayPal</span></a>`),e.steamTradeUrl&&t.push(`<a class="donate-fab-btn steam" href="${Vs(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer" title="Donate Steam skins">${Ma}<span>Steam</span></a>`),i.innerHTML=t.length?`<span class="donate-fab-label">Support AimKit</span>${t.join(``)}`:``,i.classList.toggle(`hidden`,t.length===0)}}async function Us(){try{Hs(await g.settings.get())}catch{Hs({paypalUrl:``,steamTradeUrl:``})}}document.addEventListener(`aimkit:settings-updated`,Us),document.querySelector(`#contact-open`)?.addEventListener(`click`,pa),Qe();function Ws(e,t=!0){let n=document.createElement(`div`);n.className=`flash-banner ${t?`ok`:`error`}`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>n.remove(),5e3)}var Gs=new URLSearchParams(window.location.search).get(`verify`);if(Gs){Fe(Gs).then(()=>Ws(`Email verified — you are now logged in!`)).catch(e=>Ws(e.message||`Verification link is invalid or expired.`,!1));let e=new URL(window.location.href);e.searchParams.delete(`verify`),window.history.replaceState({},``,e)}var Ks=new URLSearchParams(window.location.search).get(`reset`);if(Ks){Ye(Ks);let e=new URL(window.location.href);e.searchParams.delete(`reset`),window.history.replaceState({},``,e)}var qs=new URLSearchParams(window.location.search);if(qs.get(`token`)){we(qs.get(`token`)),Me();let e=new URL(window.location.href);e.searchParams.delete(`token`),window.history.replaceState({},``,e)}else if(qs.get(`steam`)===`linked`){Me();let e=new URL(window.location.href);e.searchParams.delete(`steam`),window.history.replaceState({},``,e)}else if(qs.get(`steam_error`)){let e=new URL(window.location.href);e.searchParams.delete(`steam_error`),window.history.replaceState({},``,e)}Un(),pr(),ei(),wi(),Hi(),Ar(),da(),Us();
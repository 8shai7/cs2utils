(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789`,t=BigInt(57),n=/^CSGO(-?[\w]{5}){5}$/,r=class e extends Error{constructor(){super(`Invalid share code`),Object.setPrototypeOf(this,e.prototype)}},i=class e extends Error{constructor(){super(`Invalid crosshair share code`),Object.setPrototypeOf(this,e.prototype)}};function a(e){return Array.from(e,e=>(`0`+(e&255).toString(16)).slice(-2)).join(``)}function o(e){let t=[];for(let n=0;n<e.length;n+=2)t.push(parseInt(e.slice(n,n+2),16));return t}function s(e){return e<<24>>24}function c(e){return e.reduce((e,t)=>e+t,0)}function l(i){if(!i.match(n))throw new r;i=i.replace(/CSGO|-/g,``);let a=Array.from(i).reverse(),s=BigInt(0);for(let n=0;n<a.length;n++)s=s*t+BigInt(e.indexOf(a[n]));return o(s.toString(16).padStart(36,`0`))}function u(n){let r=a(n),i=BigInt(`0x${r}`),o=``,s=BigInt(0);for(let n=0;n<25;n++)s=i%t,o+=e[Number(s)],i/=t;return`CSGO-${o.slice(0,5)}-${o.slice(5,10)}-${o.slice(10,15)}-${o.slice(15,20)}-${o.slice(20,25)}`}function d(e){let t=l(e),n=c(t.slice(1))%256;if(t[0]!==n)throw new i;return{gap:s(t[2])/10,outline:t[3]/2,red:t[4],green:t[5],blue:t[6],alpha:t[7],splitDistance:t[8]&7,followRecoil:(t[8]>>4&8)==8,fixedCrosshairGap:s(t[9])/10,color:t[10]&7,outlineEnabled:(t[10]&8)==8,innerSplitAlpha:(t[10]>>4)/10,outerSplitAlpha:(t[11]&15)/10,splitSizeRatio:(t[11]>>4)/10,thickness:t[12]/10,centerDotEnabled:(t[13]>>4&1)==1,deployedWeaponGapEnabled:(t[13]>>4&2)==2,alphaEnabled:(t[13]>>4&4)==4,tStyleEnabled:(t[13]>>4&8)==8,style:(t[13]&15)>>1,length:t[14]/10}}function f(e){let t=[0,1,e.gap*10&255,e.outline*2,e.red,e.green,e.blue,e.alpha,e.splitDistance&7|Number(e.followRecoil)<<7,e.fixedCrosshairGap*10&255,e.color&7|Number(e.outlineEnabled)<<3|e.innerSplitAlpha*10<<4,e.outerSplitAlpha*10|e.splitSizeRatio*10<<4,e.thickness*10,e.style<<1|Number(e.centerDotEnabled)<<4|Number(e.deployedWeaponGapEnabled)<<5|Number(e.alphaEnabled)<<6|Number(e.tStyleEnabled)<<7,e.length*10,0,0,0];return t[0]=c(t)&255,u(t)}function p(e){return`
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
`}var m={cl_crosshair_drawoutline:`outlineEnabled`,cl_crosshair_dynamic_maxdist_splitratio:`splitSizeRatio`,cl_crosshair_dynamic_splitalpha_innermod:`innerSplitAlpha`,cl_crosshair_dynamic_splitalpha_outermod:`outerSplitAlpha`,cl_crosshair_dynamic_splitdist:`splitDistance`,cl_crosshair_outlinethickness:`outline`,cl_crosshair_t:`tStyleEnabled`,cl_crosshairalpha:`alpha`,cl_crosshaircolor:`color`,cl_crosshaircolor_b:`blue`,cl_crosshaircolor_g:`green`,cl_crosshaircolor_r:`red`,cl_crosshairdot:`centerDotEnabled`,cl_crosshairgap:`gap`,cl_crosshairgap_useweaponvalue:`deployedWeaponGapEnabled`,cl_crosshairsize:`length`,cl_crosshairstyle:`style`,cl_crosshairthickness:`thickness`,cl_crosshairusealpha:`alphaEnabled`,cl_fixedcrosshairgap:`fixedCrosshairGap`,cl_crosshair_recoil:`followRecoil`},ee=new Set([`outlineEnabled`,`tStyleEnabled`,`centerDotEnabled`,`deployedWeaponGapEnabled`,`alphaEnabled`,`followRecoil`]),te={length:3,red:50,green:250,blue:50,gap:-2,alphaEnabled:!0,alpha:200,outlineEnabled:!1,outline:1,color:1,thickness:.5,centerDotEnabled:!1,splitDistance:3,followRecoil:!1,fixedCrosshairGap:3,innerSplitAlpha:0,outerSplitAlpha:1,splitSizeRatio:1,tStyleEnabled:!1,deployedWeaponGapEnabled:!0,style:4};function ne(e){let t=e.trim().replace(/^["']|["']$/g,``),n=t.toLowerCase();return n===`true`?`1`:n===`false`?`0`:t}function re(e){let t={},n=e.replace(/\/\/[^\n]*/g,``).replace(/\/\*[\s\S]*?\*\//g,``);for(let e of n.split(/[;\n]+/)){let n=e.trim();if(!n)continue;let r=n.match(/^(cl_[\w]+)\s+(.+)$/);r&&(t[r[1]]=ne(r[2]))}return t}function ie(e,t){return e===void 0?!t&&0:t?typeof e==`boolean`?e:Number(e)!==0:Number(e)}function ae(e){let t={...te};for(let[n,r]of Object.entries(m)){if(!(n in e))continue;let i=ee.has(r);t[r]=ie(e[n],i)}return t}function oe(e){return ae(re(e))}function se(e){return e.trim().split(`
`).map(e=>e.trim()).filter(Boolean).join(`
`)}var ce=.5;function le(e){return{base:e,lo:e*(1-ce),hi:e*1.5,round:1,choices:[]}}function ue(e){let t=(e.lo+e.hi)/2;return{lower:(e.lo+t)/2,higher:(t+e.hi)/2,mid:t}}function de(e){return e.round>7}function fe(e){return(e.lo+e.hi)/2}function pe(e){let t=fe(e);return t<=0?0:(e.hi-e.lo)/t}function me(e,t){if(de(e))return e;let n=(e.lo+e.hi)/2,{lower:r,higher:i}=ue(e),a={round:e.round,side:t,lo:e.lo,hi:e.hi,lower:r,higher:i},o={...e,choices:[...e.choices,a],round:e.round+1};return t===`lower`?o.hi=n:o.lo=n,o}function he(e){if(e.choices.length===0)return e;let t=e.choices.slice(0,-1),n=e.choices[e.choices.length-1];return{...e,lo:n.lo,hi:n.hi,round:n.round,choices:t}}function ge(e){return fe(e)}var _e=`https://cs2utils.vercel.app/api`,ve=`cs2utils.token`,ye=/^https?:\/\//.test(_e)?new URL(_e).origin:``;function be(){try{return localStorage.getItem(ve)}catch{return null}}function xe(e){try{e?localStorage.setItem(ve,e):localStorage.removeItem(ve)}catch{}}async function h(e,t,n,{auth:r=!1}={}){let i={};if(n!==void 0&&!(n instanceof FormData)&&(i[`Content-Type`]=`application/json`),r){let e=be();if(!e)throw Error(`Please log in first.`);i.Authorization=`Bearer ${e}`}let a;try{a=await fetch(`${_e}${t}`,{method:e,headers:i,body:n instanceof FormData?n:n===void 0?void 0:JSON.stringify(n)})}catch{throw Error(`Cannot reach the server. Is the API running?`)}let o=null,s=await a.text();if(s)try{o=JSON.parse(s)}catch{o=null}if(!a.ok){let e=o&&o.error||`Request failed (${a.status}).`,t=o&&typeof o.detail==`string`?o.detail.trim():``,n=t&&t!==e?`${e} ${t}`:e,r=Error(n);throw r.status=a.status,r.data=o,r}return o}var Se=`${_e}/auth/steam`;function Ce(e){xe(e)}function g(e){return!!e&&(e.role===`admin`||e.role===`owner`)}function we(e){return!!e&&e.role===`owner`}function Te(e){return e?/^https?:\/\//.test(e)||e.startsWith(`data:`)?e:ye+e:``}var _={auth:{async register(e){let t=await h(`POST`,`/auth/register`,e);return xe(t.token),t.user},async login(e){let t=await h(`POST`,`/auth/login`,e);return xe(t.token),t.user},logout(){xe(null)},async captcha(){return h(`GET`,`/auth/captcha`)},async changePassword(e){return h(`POST`,`/auth/password`,e,{auth:!0})},async forgot(e){return h(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return h(`POST`,`/auth/reset`,{token:e,password:t})},async me(){if(!be())return null;try{return(await h(`GET`,`/auth/me`,void 0,{auth:!0})).user}catch{return xe(null),null}},async profile(){return h(`GET`,`/auth/profile`,void 0,{auth:!0})},async setAvatar(e){return(await h(`POST`,`/auth/avatar`,{url:e},{auth:!0})).user},async uploadAvatar(e){let t=new FormData;return t.append(`file`,e),(await h(`POST`,`/auth/avatar/upload`,t,{auth:!0})).user},async changePassword(e){return h(`POST`,`/auth/password`,e,{auth:!0})},async changeUsername(e){let t=await h(`POST`,`/auth/username`,{username:e},{auth:!0});return t.token&&xe(t.token),t.user},async setCredentials(e){let t=await h(`POST`,`/auth/credentials`,e,{auth:!0});return t.token&&xe(t.token),t.user},async forgot(e){return h(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return h(`POST`,`/auth/reset`,{token:e,password:t})},steamLoginUrl(){return`${_e}/auth/steam`},async steamLinkUrl(){return(await h(`GET`,`/auth/steam/link-url`,void 0,{auth:!0})).url},async steamUnlink(){return(await h(`POST`,`/auth/steam/unlink`,{},{auth:!0})).user}},settings:{async get(){return h(`GET`,`/settings`)}},contact:{async send(e){return h(`POST`,`/contact`,e)}},pros:{async list({q:e=``,sort:t=`name`}={}){let n=new URLSearchParams;e&&n.set(`q`,e),t&&n.set(`sort`,t);let r=n.toString();return h(`GET`,`/pros${r?`?${r}`:``}`)}},configs:{async list({sort:e=`top`,q:t=``}={}){let n=new URLSearchParams;e&&n.set(`sort`,e),t&&n.set(`q`,t);let r=n.toString();return(await h(`GET`,`/configs${r?`?${r}`:``}`,void 0,{auth:!0})).configs},async create(e){return(await h(`POST`,`/configs`,e,{auth:!0})).config},async rate(e,t){return h(`POST`,`/configs/${e}/rate`,{rating:t},{auth:!0})},async remove(e){return h(`DELETE`,`/configs/${e}`,void 0,{auth:!0})}},highlights:{async list({q:e=``}={}){return(await h(`GET`,`/highlights${e?`?q=${encodeURIComponent(e)}`:``}`,void 0,{auth:!0})).highlights},async create(e){return(await h(`POST`,`/highlights`,e,{auth:!0})).highlight},async report(e,t){return h(`POST`,`/highlights/${e}/report`,{reason:t},{auth:!0})},async remove(e){return h(`DELETE`,`/highlights/${e}`,void 0,{auth:!0})}},nades:{async list({map:e=``,type:t=``}={}){let n=new URLSearchParams;e&&n.set(`map`,e),t&&n.set(`type`,t);let r=n.toString();return(await h(`GET`,`/nades${r?`?${r}`:``}`)).nades},async mine(){return(await h(`GET`,`/nades/mine`,void 0,{auth:!0})).nades},async favorites({map:e=``,type:t=``}={}){let n=new URLSearchParams;e&&n.set(`map`,e),t&&n.set(`type`,t);let r=n.toString();return(await h(`GET`,`/nades/favorites${r?`?${r}`:``}`,void 0,{auth:!0})).nades},async social(){return h(`GET`,`/nades/social`,void 0,{auth:!!be()})},async favorite(e){return h(`POST`,`/nades/${e}/favorite`,{},{auth:!0})},async create(e){return(await h(`POST`,`/nades`,e,{auth:!0})).nade},async addMedia(e,t){return(await h(`POST`,`/nades/${e}/media`,t,{auth:!0})).media},async remove(e){return h(`DELETE`,`/nades/${e}`,void 0,{auth:!0})},async parseMapGuide(e){return h(`POST`,`/nades/map-guide/parse`,{text:e},{auth:!0})},async importMapGuide({text:e,nades:t,side:n,guideText:r,fileName:i}={}){return h(`POST`,`/nades/map-guide/import`,{text:e,nades:t,side:n,guideText:r,fileName:i},{auth:!0})},async practicePackFromText({text:e,map:t,importId:n}={}){return h(`POST`,`/nades/map-guide/practice-pack`,{text:e,map:t,importId:n},{auth:!0})},async practicePackFromImport(e){return h(`GET`,`/nades/map-guide/imports/${e}/practice-pack`,void 0,{auth:!!be()})},async practicePackFromNades(e){return h(`POST`,`/nades/map-guide/practice-pack-from-nades`,{nadeIds:e},{auth:!!be()})}},commands:{async catalog(){return h(`GET`,`/commands/catalog`)},async social(){return h(`GET`,`/commands/social`,void 0,{auth:!0})},async recommend(e){return h(`POST`,`/commands/${e}/recommend`,{},{auth:!0})},async addComment(e,t){return h(`POST`,`/commands/${e}/comments`,{body:t},{auth:!0})}},admin:{async pending(){return(await h(`GET`,`/admin/nades/pending`,void 0,{auth:!0})).nades},async pendingComments(){return(await h(`GET`,`/admin/comments/pending`,void 0,{auth:!0})).comments},async pendingCommentsCount(){return(await h(`GET`,`/admin/comments/pending/count`,void 0,{auth:!0})).count},async reviewComment(e,t){return h(`POST`,`/admin/comments/${e}/review`,{decision:t},{auth:!0})},async removeComment(e){return h(`DELETE`,`/admin/comments/${e}`,void 0,{auth:!0})},async syncCommands(){return h(`POST`,`/admin/commands/sync`,{},{auth:!0})},async checkCommandsCs2(){return h(`POST`,`/admin/commands/check-cs2`,{},{auth:!0})},async saveSettings(e){return h(`POST`,`/admin/settings`,e,{auth:!0})},async highlightReports(){return(await h(`GET`,`/admin/highlights/reports`,void 0,{auth:!0})).highlights},async highlightReportsCount(){return(await h(`GET`,`/admin/highlights/reports/count`,void 0,{auth:!0})).count},async reviewHighlight(e,t){return h(`POST`,`/admin/highlights/${e}/review`,{decision:t},{auth:!0})},async syncPros(){return h(`POST`,`/admin/pros/sync`,{},{auth:!0})},async importCommands(e){return h(`POST`,`/admin/commands/import`,{content:e},{auth:!0})},async importPros(e){return h(`POST`,`/admin/pros/import`,{content:e},{auth:!0})},async banUser(e,{hours:t,permanent:n}){return(await h(`POST`,`/admin/users/${e}/ban`,{hours:t,permanent:n},{auth:!0})).user},async unbanUser(e){return(await h(`POST`,`/admin/users/${e}/unban`,{},{auth:!0})).user},async pendingCount(){return(await h(`GET`,`/admin/nades/pending/count`,void 0,{auth:!0})).count},async reviewNade(e,t,n=``){return h(`POST`,`/admin/nades/${e}/review`,{decision:t,note:n},{auth:!0})},async reviewNadesBulk(e,t,n=``){return h(`POST`,`/admin/nades/review-bulk`,{ids:e,decision:t,note:n},{auth:!0})},async reviewMedia(e,t){return h(`POST`,`/admin/media/${e}/review`,{decision:t},{auth:!0})},async reviewMediaBulk(e,t){return h(`POST`,`/admin/media/review-bulk`,{ids:e,decision:t},{auth:!0})},async removeMedia(e){return h(`DELETE`,`/admin/media/${e}`,void 0,{auth:!0})},async users(){return(await h(`GET`,`/admin/users`,void 0,{auth:!0})).users},async setRole(e,t){return(await h(`POST`,`/admin/users/${e}/role`,{role:t},{auth:!0})).user},async contactMessages(){return(await h(`GET`,`/admin/contact`,void 0,{auth:!0})).messages},async removeContact(e){return h(`DELETE`,`/admin/contact/${e}`,void 0,{auth:!0})},async ownerLogs({limit:e=100,offset:t=0,action:n=``}={}){let r=new URLSearchParams;e&&r.set(`limit`,String(e)),t&&r.set(`offset`,String(t)),n&&r.set(`action`,n);let i=r.toString();return h(`GET`,`/admin/owner-logs${i?`?${i}`:``}`,void 0,{auth:!0})}},uploads:{async image(e){let t=new FormData;return t.append(`file`,e),await h(`POST`,`/uploads`,t,{auth:!0})}}},Ee=null,De=new Set;function Oe(){for(let e of De)e(Ee)}function ke(){return Ee}function Ae(e){return De.add(e),()=>De.delete(e)}async function je(){return Ee=await _.auth.me(),Oe(),Ee}async function Me(e){return Ee=await _.auth.login(e),Oe(),Ee}async function Ne(e){return Ee=await _.auth.register(e),Oe(),Ee}function Pe(){_.auth.logout(),Ee=null,Oe()}var Fe,v,Ie=`login`,Le={required:!1,token:null,svg:``};function Re(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function ze(){let e=ke();e?(Fe.innerHTML=`
      <button class="account-chip" id="hdr-profile" title="View your profile">
        ${e.avatarUrl?`<img class="account-avatar" src="${Re(Te(e.avatarUrl))}" alt="" />`:``}
        <span class="account-name">${Re(e.username)}</span>
        <span class="nade-badge ${Re(e.role)}">${Re(e.role)}</span>
      </button>
      <button class="btn ghost btn-sm" id="hdr-logout">Log out</button>`,Fe.querySelector(`#hdr-profile`).addEventListener(`click`,()=>document.dispatchEvent(new CustomEvent(`aimkit:navigate`,{detail:`profile`}))),Fe.querySelector(`#hdr-logout`).addEventListener(`click`,()=>Pe())):(Fe.innerHTML=`
      <button class="btn ghost btn-sm" id="hdr-login">Log in</button>
      <button class="btn primary btn-sm" id="hdr-register">Register</button>`,Fe.querySelector(`#hdr-login`).addEventListener(`click`,()=>Ge(`login`)),Fe.querySelector(`#hdr-register`).addEventListener(`click`,()=>Ge(`register`)))}function Be(){let e=Ie===`login`,t=Ie===`forgot`;v.innerHTML=`
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
        ${e&&Le.required?`<div class="captcha-field">
                 <div class="captcha-row">
                   <div class="captcha-image" id="hdr-captcha-img">${Le.svg}</div>
                   <button type="button" class="captcha-refresh" id="hdr-captcha-refresh" title="New image" aria-label="New image">&#8635;</button>
                 </div>
                 <label class="field"><span>Enter the characters above</span><input id="hdr-captcha" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>
               </div>`:``}
        <button class="btn primary" type="submit">${t?`Send reset link`:e?`Log in`:`Create account`}</button>
        <p class="auth-alt">${t?`<button type="button" class="linkish" data-mode="login">← Back to log in</button>`:e?`<button type="button" class="linkish" data-mode="forgot">Forgot password?</button>`:``}</p>
        <p class="status" id="hdr-auth-status"></p>
      </form>
      ${t?``:`<div class="auth-divider"><span>or</span></div>
             <a class="btn steam-login" href="${Se}">
               <svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Z"/></svg>
               Sign in with Steam
             </a>`}
    </div>`,v.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,Ke)),v.querySelectorAll(`[data-mode]`).forEach(e=>e.addEventListener(`click`,()=>{Ie=e.dataset.mode,Be()})),v.querySelector(`#hdr-auth-form`).addEventListener(`submit`,Ue),v.querySelector(`#hdr-captcha-refresh`)?.addEventListener(`click`,async()=>{await Ve();let e=v.querySelector(`#hdr-captcha-img`);e&&(e.innerHTML=Le.svg);let t=v.querySelector(`#hdr-captcha`);t&&(t.value=``)}),v.querySelector(`#hdr-email`)?.focus()}async function Ve(){try{let e=await _.auth.captcha();Le.token=e.token,Le.svg=e.svg}catch{}}function He(){let e=v.querySelector(`#hdr-email`)?.value||``,t=v.querySelector(`#hdr-password`)?.value||``,n=v.querySelector(`#hdr-username`)?.value||``;Be();let r=v.querySelector(`#hdr-email`);r&&(r.value=e);let i=v.querySelector(`#hdr-password`);i&&(i.value=t);let a=v.querySelector(`#hdr-username`);a&&(a.value=n)}async function Ue(e){e.preventDefault();let t=v.querySelector(`#hdr-email`)?.value||``,n=v.querySelector(`#hdr-password`)?.value||``,r=v.querySelector(`#hdr-username`)?.value||``,i=v.querySelector(`#hdr-captcha`)?.value||``;try{if(Ie===`forgot`){await _.auth.forgot(t);let e=v.querySelector(`#hdr-auth-status`);e.textContent=`If an account exists for that email, a reset link is on its way.`,e.className=`status ok`;return}Ie===`login`?await Me({email:t,password:n,captchaToken:Le.token,captchaAnswer:i}):await Ne({email:t,username:r,password:n}),Le={required:!1,token:null,svg:``},Ke()}catch(e){Ie===`login`&&e?.data?.captchaRequired&&(Le.required=!0,await Ve(),He());let t=v.querySelector(`#hdr-auth-status`);t&&(t.textContent=e.message,t.className=`status error`)}}function We(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Reset password">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Choose a new password</h2>
      <form id="reset-form" class="auth-form-modal">
        <label class="field"><span>New password</span><input id="reset-password" type="password" autocomplete="new-password" /></label>
        <button class="btn primary" type="submit">Set new password</button>
        <p class="status" id="reset-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#reset-status`);t.querySelector(`#reset-form`).addEventListener(`submit`,async i=>{i.preventDefault();try{await _.auth.reset(e,t.querySelector(`#reset-password`).value),r.textContent=`Password updated! You can now log in.`,r.className=`status ok`,setTimeout(()=>{n(),Ge(`login`)},1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#reset-password`)?.focus()}function Ge(e){Ie=e,v.classList.remove(`hidden`),Be()}function Ke(){v.classList.add(`hidden`)}function qe(e=`login`){Ge(e)}async function Je(){Fe=document.querySelector(`#account-menu`),Fe&&(v=document.createElement(`div`),v.id=`auth-modal`,v.className=`modal hidden`,document.body.appendChild(v),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Ke()}),Ae(()=>ze()),ze(),await je())}var Ye=[{id:`mirage`,name:`Mirage`},{id:`dust2`,name:`Dust II`},{id:`inferno`,name:`Inferno`},{id:`nuke`,name:`Nuke`},{id:`ancient`,name:`Ancient`},{id:`anubis`,name:`Anubis`},{id:`overpass`,name:`Overpass`},{id:`vertigo`,name:`Vertigo`},{id:`train`,name:`Train`}],Xe=[{id:`smoke`,name:`Smoke`,color:`#cdd6e3`},{id:`flash`,name:`Flash`,color:`#f4ec9b`},{id:`molotov`,name:`Molotov`,color:`#ff7a3c`},{id:`he`,name:`HE Grenade`,color:`#8fd694`},{id:`decoy`,name:`Decoy`,color:`#9aa8ff`}],Ze=[{id:`stand`,name:`Standing throw`},{id:`jump`,name:`Jump throw`},{id:`jumpthrow`,name:`Jumpthrow bind`},{id:`run`,name:`Running throw`},{id:`runjump`,name:`Run + jump throw`},{id:`walk`,name:`Walking throw`}],Qe=[{id:`t`,name:`T side`},{id:`ct`,name:`CT side`}];function $e(e){return Ye.find(t=>t.id===e)?.name??e}function et(e){return Xe.find(t=>t.id===e)??Xe[0]}function tt(e){return Ze.find(t=>t.id===e)?.name??e}function nt(e){return Qe.find(t=>t.id===e)?.name??e}function rt(e){let t=(e||``).toLowerCase();return/youtube\.com|youtu\.be|\.mp4|\.webm|\.mov|streamable\.com/.test(t)?`video`:`image`}var it={},at=new WeakMap;function ot(e){return`./maps/${e}.png`}function st(e,t){let n=it[e];return n||(n={img:new Image,loaded:!1,error:!1,waiters:new Set},it[e]=n,n.img.onload=()=>{n.loaded=!0,n.waiters.forEach(e=>e()),n.waiters.clear()},n.img.onerror=()=>{n.error=!0,n.waiters.clear()},n.img.src=ot(e)),!n.loaded&&!n.error&&t&&n.waiters.add(t),n}function ct(e,t,n,r){let i=e.createLinearGradient(0,0,t,t);i.addColorStop(0,`#26313f`),i.addColorStop(.5,`#2f3d4e`),i.addColorStop(1,`#222b37`),e.fillStyle=i,e.fillRect(0,0,t,t);let a=st(n,r);if(a.loaded){e.drawImage(a.img,0,0,t,t),e.fillStyle=`rgba(13,17,23,0.18)`,e.fillRect(0,0,t,t);return}e.strokeStyle=`rgba(255,255,255,0.06)`,e.lineWidth=1;for(let n=0;n<=t;n+=t/10)e.beginPath(),e.moveTo(n,0),e.lineTo(n,t),e.stroke(),e.beginPath(),e.moveTo(0,n),e.lineTo(t,n),e.stroke();e.fillStyle=`rgba(255,255,255,0.10)`,e.font=`600 22px Outfit, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText($e(n).toUpperCase(),t/2,t/2)}function lt(e,{mapId:t,type:n=`smoke`,start:r=null,end:i=null}){let a=e.getContext(`2d`);if(!a)return;let o=e.width;at.set(e,{mapId:t,type:n,start:r,end:i}),a.clearRect(0,0,o,o),ct(a,o,t,()=>{let t=at.get(e);t&&lt(e,t)});let s=et(n).color;if(r&&i){let e=r.x*o,t=r.y*o,n=i.x*o,c=i.y*o,l=(e+n)/2,u=(t+c)/2,d=Math.hypot(n-e,c-t),f=l,p=u-Math.max(24,d*.35);a.strokeStyle=s,a.lineWidth=3,a.setLineDash([8,6]),a.beginPath(),a.moveTo(e,t),a.quadraticCurveTo(f,p,n,c),a.stroke(),a.setLineDash([]);let m=.92,ee=(1-m)*(1-m)*e+2*(1-m)*m*f+m*m*n,te=(1-m)*(1-m)*t+2*(1-m)*m*p+m*m*c,ne=Math.atan2(c-te,n-ee);a.fillStyle=s,a.beginPath(),a.moveTo(n,c),a.lineTo(n-12*Math.cos(ne-.4),c-12*Math.sin(ne-.4)),a.lineTo(n-12*Math.cos(ne+.4),c-12*Math.sin(ne+.4)),a.closePath(),a.fill()}r&&ut(a,r.x*o,r.y*o,`#3ecf8e`,`THROW`),i&&dt(a,i.x*o,i.y*o,s),(!r||!i)&&(a.fillStyle=`rgba(255,255,255,0.55)`,a.font=`13px Outfit, sans-serif`,a.textAlign=`center`,a.textBaseline=`bottom`,a.fillText(r?`Click again to set the landing spot`:`Click the map to set your throw position`,o/2,o-12))}function ut(e,t,n,r,i){e.beginPath(),e.fillStyle=r,e.arc(t,n,7,0,Math.PI*2),e.fill(),e.lineWidth=2,e.strokeStyle=`#0d1117`,e.stroke(),i&&(e.fillStyle=`#fff`,e.font=`600 10px JetBrains Mono, monospace`,e.textAlign=`center`,e.textBaseline=`bottom`,e.fillText(i,t,n-10))}function dt(e,t,n,r){e.strokeStyle=r,e.lineWidth=3,e.beginPath(),e.arc(t,n,11,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(t-6,n-6),e.lineTo(t+6,n+6),e.moveTo(t+6,n-6),e.lineTo(t-6,n+6),e.stroke()}function ft(e,t){let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width,i=(t.clientY-n.top)/n.height;return{x:Math.max(0,Math.min(1,r)),y:Math.max(0,Math.min(1,i))}}function pt(e,t){let n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,i.rel=`noopener`,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),2e3)}function mt(e,t={}){let n=t.guide!==!1,r=t.cfg!==!1,i=[];if(n&&e.guideText&&(pt(`${e.loadName}.txt`,e.guideText),i.push(`${e.loadName}.txt`)),r&&e.cfgText){let t=i.length?400:0;setTimeout(()=>pt(`${e.cfgBaseName}.cfg`,e.cfgText),t),i.push(`${e.cfgBaseName}.cfg`)}return i}function ht(e){if(!e?.steamUrl)throw Error(`Missing Steam launch URL.`);let t=document.createElement(`a`);t.href=e.steamUrl,t.rel=`noopener`,t.style.display=`none`,document.body.appendChild(t),t.click(),t.remove()}async function gt(e){let t=e?.consoleCommand;if(!t)throw Error(`Missing console command.`);return await navigator.clipboard.writeText(t),t}function _t(e){return e?.querySelector(`#try-dl-guide`)?.checked,e?.querySelector(`#try-dl-cfg`)?.checked,!e?.querySelector(`#try-dl-guide`)&&!e?.querySelector(`#try-dl-cfg`)?{guide:!0,cfg:!0}:{guide:!!e.querySelector(`#try-dl-guide`)?.checked,cfg:!!e.querySelector(`#try-dl-cfg`)?.checked}}function vt(e,{esc:t,lineupCount:n=1}){if(!e)return``;let r=n>1?`${n} lineups merged into one annotation file`:`1 lineup annotation file`,i=`game/csgo/annotations/local/${e.loadName}/${e.loadName}.txt`,a=`game/csgo/cfg/${e.cfgBaseName}.cfg`;return`
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
    </div>`}function yt(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}var bt={error:`Something went wrong`,warn:`Heads up`,ok:`Done`},xt=null,St=null,Ct=null;function wt(){return xt?.isConnected?xt:(xt=document.createElement(`div`),xt.className=`app-toast-host`,xt.setAttribute(`aria-live`,`assertive`),xt.setAttribute(`aria-relevant`,`additions`),document.body.appendChild(xt),xt)}function Tt(){St&&clearTimeout(St),Ct&&clearTimeout(Ct),St=null,Ct=null}function Et(e,t={}){let n=t.kind===`ok`||t.kind===`warn`?t.kind:`error`,r=t.title||bt[n],i=Number.isFinite(t.duration)?t.duration:n===`ok`?2800:4500,a=String(e||``).trim();if(!a)return;let o=wt();Tt(),o.replaceChildren();let s=document.createElement(`div`);s.className=`app-toast app-toast--${n}`,s.setAttribute(`role`,`alert`),s.innerHTML=`
    <span class="app-toast-icon" aria-hidden="true"></span>
    <div class="app-toast-body">
      <strong class="app-toast-title">${yt(r)}</strong>
      <p class="app-toast-msg">${yt(a)}</p>
    </div>
    <button type="button" class="app-toast-close" aria-label="Dismiss">&times;</button>`;let c=()=>{Tt(),s.classList.remove(`app-toast-in`),s.classList.add(`app-toast-out`),Ct=setTimeout(()=>{s.parentNode===o&&s.remove()},220)};s.querySelector(`.app-toast-close`)?.addEventListener(`click`,c),o.appendChild(s),requestAnimationFrame(()=>{requestAnimationFrame(()=>s.classList.add(`app-toast-in`))}),St=setTimeout(c,i)}var Dt=360,Ot=100,y,b=null,x=`browse`,kt={text:``,kind:``},At=0,jt=!1,Mt={map:``,type:``},Nt=[],S=new Map,Pt={counts:{},mine:[]},Ft=[],It=[],Lt=[],Rt=[],C=Bt(),w=Vt(),T=null,zt=1;function Bt(){return{map:`mirage`,type:`smoke`,side:`t`,technique:`stand`,title:``,description:``,start:null,end:null}}function Vt(){return{text:``,fileName:``,side:`t`,parsed:null,selected:null}}function E(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Ht(e){let t=Te(e);return/^https?:\/\//.test(t)||t.startsWith(`data:image/`)?t:``}function Ut(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function Wt(e,t){return e.map(e=>`<option value="${e.id}"${e.id===t?` selected`:``}>${E(e.name)}</option>`).join(``)}function D(e,t=``,n={}){kt={text:e,kind:t};let r=y?.querySelector(`#nades-status`);r&&(r.textContent=e,r.className=`status${t?` ${t}`:``}`),(t===`error`||t===`warn`)&&e&&Et(e,{kind:t,title:n.title})}function Gt(e){return`<span class="nade-badge ${e}">${e}</span>`}function Kt(e){try{return new Date(e).toLocaleDateString()}catch{return``}}async function qt(){if(g(b))try{At=await _.admin.pendingCount()}catch{At=0}else At=0}async function Jt(){try{Pt=await _.nades.social()}catch{Pt={counts:{},mine:[]}}}async function O(e){x=e,jt=![`add`,`import`].includes(e),jt&&k();try{x===`browse`&&(Nt=await _.nades.list(Mt),await Jt()),x===`favorites`&&(b?(Ft=await _.nades.favorites(Mt),await Jt()):Ft=[]),x===`mine`&&b&&(It=await _.nades.mine()),x===`review`&&g(b)&&(Lt=await _.admin.pending(),At=await _.admin.pendingCount()),x===`users`&&g(b)&&(Rt=await _.admin.users())}catch(e){D(e.message,`error`)}jt=!1,k()}function Yt(e){let t=Ht(e.url);if(!t)return``;if(e.kind===`video`){let n=Ut(e.url);return n?`<iframe class="nade-media-embed" src="https://www.youtube.com/embed/${E(n)}" title="nade video" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e.url)?`<video class="nade-media-embed" src="${E(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${E(t)}" target="_blank" rel="noopener noreferrer">Open video ↗</a>`}return`<a href="${E(t)}" target="_blank" rel="noopener noreferrer"><img class="nade-media-img" src="${E(t)}" alt="${E(e.addedByName||`nade media`)}" loading="lazy" /></a>`}function Xt(e,{showStatus:t=!1,showTryInGame:n=!1,adminRemove:r=!1,showFavorite:i=!1}={}){let a=et(e.type),o=(e.media||[]).filter(e=>t?!0:e.status===`approved`),s=o.length?`<div class="nade-media">${o.map(e=>`<div class="nade-media-item">${Yt(e)}${t?`<div class="nade-media-meta">${Gt(e.status)} <span>by ${E(e.addedByName||``)}</span></div>`:``}</div>`).join(``)}</div>`:`<p class="hint">No approved media yet — a 2D throw preview is shown above.</p>`,c=n&&S.has(e.id),l=Pt.mine.includes(e.id),u=Pt.counts[e.id]||0,d=i?`<button class="btn btn-sm favorite ${l?`active`:``}" type="button" data-favorite-nade="${e.id}" title="${l?`Remove from favorites`:`Add to favorites`}">${l?`★ Favorited`:`☆ Favorite`}${u?` <span class="fav-count">${u}</span>`:``}</button>`:``,f=n?`<div class="nade-card-actions">
         <label class="browse-nade-check">
           <input type="checkbox" class="browse-select" value="${e.id}" data-map="${E(e.map)}" ${c?`checked`:``} />
           <span>Select</span>
         </label>
         ${d}
         <button class="btn" type="button" data-try-nades="${e.id}">Try in game</button>
         ${r&&g(b)?`<button class="btn ghost danger" type="button" data-delete-nade="${e.id}">Remove</button>`:``}
       </div>`:d||r&&g(b)?`<div class="nade-card-actions">
           ${d}
           ${r&&g(b)?`<button class="btn ghost danger" type="button" data-delete-nade="${e.id}">Remove</button>`:``}
         </div>`:``;return`
    <article class="nade-card${n?` browse-nade-card`:``}${c?` selected`:``}${l&&i?` favorited`:``}"${n?` data-browse-nade="${e.id}" data-map="${E(e.map)}" tabindex="0" role="checkbox" aria-checked="${c?`true`:`false`}"`:``}>
      <div class="nade-card-head">
        <div>
          <h3>${E(e.title)}</h3>
          <p class="nade-sub">
            <span class="nade-chip" style="--chip:${a.color}">${E(a.name)}</span>
            ${E($e(e.map))} · ${E(nt(e.side))} · ${E(tt(e.technique))}
          </p>
        </div>
        ${t?Gt(e.status):``}
      </div>
      <canvas class="nade-canvas" width="${Dt}" height="${Dt}"
        data-map="${E(e.map)}" data-type="${E(e.type)}"
        data-sx="${e.start.x}" data-sy="${e.start.y}" data-ex="${e.end.x}" data-ey="${e.end.y}"></canvas>
      ${e.description?`<p class="nade-desc">${E(e.description)}</p>`:``}
      ${s}
      <p class="nade-foot">by ${E(e.authorName)} · ${Kt(e.createdAt)}</p>
      ${f}
    </article>`}function Zt(){return[...S.keys()]}function Qt(){let e=Nt.length?Nt.map(e=>Xt(e,{showTryInGame:!0,adminRemove:!0,showFavorite:!0})).join(``):`<p class="hint">No approved nades yet${b?` — be the first to add one!`:` — log in and add the nades you found.`}</p>`,t=S.size;return`
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${Wt(Ye,Mt.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${Wt(Xe,Mt.type)}</select>
      </label>
    </div>
    <div class="browse-select-bar">
      <span class="hint">Click a lineup to select it (up to ${Ot}, same map) for one merged annotation file.</span>
      <button class="btn ghost" type="button" id="browse-select-clear" ${t?``:`disabled`}>Clear selection</button>
      <button class="btn primary" type="button" id="browse-try-selected" ${t?``:`disabled`}>
        Try selected in game (${t}/${Ot})
      </button>
    </div>
    <div class="nade-grid">${e}</div>`}function $t(){if(!b)return en(`save favorite nades`);let e=Ft.length?Ft.map(e=>Xt(e,{showTryInGame:!0,adminRemove:!0,showFavorite:!0})).join(``):`<p class="hint">No favorites yet — star lineups in Browse to save them here.</p>`,t=S.size;return`
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${Wt(Ye,Mt.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${Wt(Xe,Mt.type)}</select>
      </label>
    </div>
    <div class="browse-select-bar">
      <span class="hint">Your saved lineups. Select up to ${Ot} (same map) to try in game.</span>
      <button class="btn ghost" type="button" id="browse-select-clear" ${t?``:`disabled`}>Clear selection</button>
      <button class="btn primary" type="button" id="browse-try-selected" ${t?``:`disabled`}>
        Try selected in game (${t}/${Ot})
      </button>
    </div>
    <div class="nade-grid">${e}</div>`}function en(e){return`<div class="login-prompt">
    <p class="hint">Log in or create an account to ${E(e)}.</p>
    <div class="actions">
      <button class="btn primary" data-open-auth="login">Log in</button>
      <button class="btn" data-open-auth="register">Register</button>
    </div>
  </div>`}function tn(){return b?`
    <div class="nade-add">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>Pick the <strong>map</strong> and <strong>grenade type</strong> on the right.</li>
          <li>Click the map once to drop your <strong>throw position</strong>.</li>
          <li>Click again to set the <strong>landing spot</strong>.</li>
          <li>Fill in the details, add optional media, and submit for review.</li>
        </ol>
        <canvas id="nade-add-canvas" class="nade-canvas interactive" width="${Dt}" height="${Dt}"></canvas>
        <p class="hint" id="nade-add-coords">Step 2: click the map to set your throw position.</p>
      </div>
      <form class="nade-add-form" id="nade-add-form">
        <label class="field"><span>Title</span><input id="add-title" type="text" maxlength="160" placeholder="A site smoke from T ramp" value="${E(C.title)}" /></label>
        <div class="sens-grid">
          <label class="field"><span>Map</span><select id="add-map">${Wt(Ye,C.map)}</select></label>
          <label class="field"><span>Type</span><select id="add-type">${Wt(Xe,C.type)}</select></label>
        </div>
        <div class="sens-grid">
          <label class="field"><span>Side</span><select id="add-side">${Wt(Qe,C.side)}</select></label>
          <label class="field"><span>Technique</span><select id="add-technique">${Wt(Ze,C.technique)}</select></label>
        </div>
        <label class="field"><span>Description (optional)</span><textarea id="add-description" rows="3" placeholder="Where to stand, what to line up, jumpthrow timing...">${E(C.description)}</textarea></label>
        <label class="field"><span>Video URL (optional — YouTube or .mp4)</span><input id="add-video" type="url" placeholder="https://youtu.be/..." /></label>
        <label class="field"><span>Image URL (optional)</span><input id="add-image" type="url" placeholder="https://.../lineup.jpg" /></label>
        <label class="field"><span>Or upload an image (optional)</span><input id="add-upload" type="file" accept="image/*" /></label>
        <div class="actions">
          <button class="btn primary" type="submit">Submit for review</button>
          <button class="btn ghost" type="button" id="add-clear">Clear points</button>
        </div>
        <p class="hint">Submissions are reviewed by an admin before appearing publicly.</p>
      </form>
    </div>`:en(`add nades`)}function nn(){if(!b)return en(`import a CS2 map guide`);let e=w.parsed,t=e&&w.selected!=null?e.nades[w.selected]:e?.nades?.[0]||null,n=e?`<div class="guide-preview-list">
        ${e.nades.map((e,t)=>{let n=et(e.type);return`<button type="button" class="guide-preview-item ${(w.selected??0)===t?`active`:``}" data-guide-idx="${t}">
              <span class="nade-chip" style="--chip:${n.color}">${E(n.name)}</span>
              <strong>${E(e.title)}</strong>
              <span class="hint">${E(tt(e.technique))}</span>
            </button>`}).join(``)}
      </div>`:``;return`
    <div class="nade-import">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>In CS2, save a guide with <code>annotation_save name</code>.</li>
          <li>Upload the <code>.txt</code> from <code>game/csgo/annotations/local/</code> (or paste it).</li>
          <li>Preview lineups on the radar, then import — they enter review as pending.</li>
        </ol>
        <canvas id="guide-preview-canvas" class="nade-canvas" width="${Dt}" height="${Dt}"></canvas>
        <p class="hint" id="guide-preview-label">${t?`${E(t.title)} · ${E($e(t.map))}`:`Parsed lineups will preview here.`}</p>
        ${n}
      </div>
      <div class="nade-add-form">
        <label class="field">
          <span>Map guide file (.txt)</span>
          <input id="guide-file" type="file" accept=".txt,text/plain" />
        </label>
        ${w.fileName?`<p class="hint">Loaded: <strong>${E(w.fileName)}</strong></p>`:``}
        <label class="field">
          <span>Or paste guide text</span>
          <textarea id="guide-text" rows="10" placeholder="<!-- kv3 encoding:text:... -->&#10;{&#10;  MapName = &quot;de_mirage&quot;&#10;  MapAnnotationNode0 = { ... }&#10;}">${E(w.text)}</textarea>
        </label>
        <label class="field">
          <span>Default side for imported nades</span>
          <select id="guide-side">${Wt(Qe,w.side)}</select>
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
        ${e?`<p class="hint">Detected <strong>${E($e(e.map))}</strong> (${E(e.mapName)}) — ${e.nades.length} grenade lineup${e.nades.length===1?``:`s`}${e.skipped?`, skipped ${e.skipped}`:``}.</p>`:`<p class="hint">Official CS2 Map Guides / annotation files only. World coords are mapped onto AimKit’s radar automatically.</p>`}
      </div>
    </div>`}function rn(){return b?It.length?`<div class="nade-grid">${It.map(e=>`
      <div class="nade-mine">
        ${Xt(e,{showStatus:!0})}
        ${e.reviewNote?`<p class="hint">Reviewer note: ${E(e.reviewNote)}</p>`:``}
        <div class="nade-add-media">
          <input type="url" class="add-media-url" data-nade="${e.id}" placeholder="Add media URL (image or video)" />
          <button class="btn" data-add-media="${e.id}">Add media</button>
          ${e.guideImportId?`<button class="btn" data-try-import="${e.guideImportId}">Try in game</button>`:``}
          <button class="btn ghost" data-delete-nade="${e.id}">Delete</button>
        </div>
      </div>`).join(``)}</div>`:`<p class="hint">You haven't added any nades yet.</p>`:en(`see and manage your nades`)}function an(){return g(b)?Lt.length?`
    <div class="review-bulk-bar">
      <label class="review-select-all">
        <input type="checkbox" id="review-select-all" />
        <span>Select all pending nades (${Lt.filter(e=>e.status===`pending`).length})</span>
      </label>
      <input type="text" id="review-bulk-note" placeholder="Optional note for bulk decision" />
      <button class="btn primary" type="button" id="review-bulk-approve" disabled>Approve selected</button>
      <button class="btn ghost" type="button" id="review-bulk-reject" disabled>Reject selected</button>
    </div>
    <div class="nade-grid">${Lt.map(e=>{let t=e.media||[],n=t.length?`<div class="review-media">${t.map(e=>`<div class="review-media-item">${Yt(e)}
                  <div class="nade-media-meta">${Gt(e.status)} <span>by ${E(e.addedByName||``)}</span></div>
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
                 <p class="hint">Nade already ${E(e.status)} — you can still unpublish, re-approve, or delete it.</p>
                 <div class="review-actions-btns">
                   ${e.status===`approved`?`<button class="btn ghost" data-reject-nade="${e.id}">Unpublish</button>`:`<button class="btn primary" data-approve-nade="${e.id}">Approve</button>`}
                   <button class="btn ghost danger" data-delete-nade="${e.id}">Delete</button>
                 </div>
                 <input type="text" class="review-note" data-nade="${e.id}" placeholder="Optional note to the author" />
               </div>`;return`<div class="nade-mine">${Xt(e,{showStatus:!0})}${n}${r}</div>`}).join(``)}</div>`:`<p class="hint">Nothing pending review. Nice and clean.</p>`:`<p class="hint">Admins only.</p>`}function on(e){if(!e.bannedUntil)return null;let t=new Date(e.bannedUntil);return t.getTime()<=Date.now()?null:t.getFullYear()>=9999?`permanently`:`until ${t.toLocaleString()}`}function sn(){if(!g(b))return`<p class="hint">Admins only.</p>`;let e=we(b);return`<div class="users-table">
    ${e?`<p class="hint users-table-hint">Promote trusted users to admin, or remove admin access.</p>`:`<p class="hint users-table-hint">Only the site owner can promote users to admin.</p>`}
    ${Rt.map(t=>{let n=on(t),r=t.role===`owner`?`<span class="hint">owner</span>`:e?t.role===`admin`?`<button class="btn btn-sm ghost" data-role-user="${t.id}" data-role="user">Remove admin</button>`:`<button class="btn btn-sm primary" data-role-user="${t.id}" data-role="admin">Promote to admin</button>`:`<span class="hint">${E(t.role)}</span>`,i=t.role===`owner`?``:n?`<span class="nade-badge rejected">banned ${E(n)}</span> <button class="btn btn-sm ghost" data-unban="${t.id}">Unban</button>`:`<select class="ban-duration" data-ban-dur="${t.id}">
                   <option value="24">1 day</option>
                   <option value="168">7 days</option>
                   <option value="720">30 days</option>
                   <option value="perma">Permanent</option>
                 </select>
                 <button class="btn btn-sm ghost" data-ban="${t.id}">Ban</button>`;return`<div class="user-row">
          <div><strong>${E(t.username)}</strong><br /><span class="hint">${E(t.email)}</span></div>
          <div>${Gt(t.role)}</div>
          <div class="user-actions">${r}</div>
          <div class="user-actions">${i}</div>
        </div>`}).join(``)}
  </div>`}function cn(){let e=Pt.mine?.length||0,t=[[`browse`,`Browse`]];return b&&(t.push([`favorites`,`Favorites${e?` (${e})`:``}`]),t.push([`add`,`Add nade`],[`import`,`Import guide`],[`mine`,`My nades`])),g(b)&&t.push([`review`,`Review${At?` (${At})`:``}`],[`users`,`Users`]),`<nav class="nades-subnav">${t.map(([e,t])=>`<button class="tool-tab ${x===e?`active`:``}" data-view="${e}">${E(t)}</button>`).join(``)}</nav>`}function ln(){if(jt)return`<div class="nades-loading"><span class="spinner"></span> Loading…</div>`;switch(x){case`add`:return tn();case`import`:return nn();case`favorites`:return $t();case`mine`:return rn();case`review`:return an();case`users`:return sn();default:return Qt()}}function k(){y.innerHTML=`
    <div class="nades-shell">
      ${cn()}
      <div class="nades-body">${ln()}</div>
      <div id="nades-status" class="status ${kt.kind}">${E(kt.text)}</div>
      ${T?vt(T,{esc:E,lineupCount:zt}):``}
    </div>`,pn(),un()}function un(){y.querySelectorAll(`canvas.nade-canvas:not(.interactive):not(#guide-preview-canvas)`).forEach(e=>{lt(e,{mapId:e.dataset.map,type:e.dataset.type,start:{x:Number(e.dataset.sx),y:Number(e.dataset.sy)},end:{x:Number(e.dataset.ex),y:Number(e.dataset.ey)}})}),dn(),fn()}function dn(){let e=y.querySelector(`#nade-add-canvas`);e&&lt(e,{mapId:C.map,type:C.type,start:C.start,end:C.end})}function fn(){let e=y.querySelector(`#guide-preview-canvas`);if(!e)return;let t=w.parsed?.nades?.[w.selected??0];if(!t){lt(e,{mapId:`mirage`,type:`smoke`,start:null,end:null});return}lt(e,{mapId:t.map,type:t.type,start:t.start,end:t.end})}function pn(){y.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),y.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>O(e.dataset.view))),y.querySelector(`#filter-map`)?.addEventListener(`change`,e=>{Mt.map=e.target.value,S=new Map,O(x===`favorites`?`favorites`:`browse`)}),y.querySelector(`#filter-type`)?.addEventListener(`change`,e=>{Mt.type=e.target.value,O(x===`favorites`?`favorites`:`browse`)}),y.querySelectorAll(`.browse-select`).forEach(e=>e.addEventListener(`change`,()=>{bn(Number(e.value),e.dataset.map,e.checked),xn(e.closest(`.browse-nade-card`))})),y.querySelectorAll(`.browse-nade-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`a, button, input, label`)||Sn(e)}),e.addEventListener(`keydown`,t=>{t.key!==` `&&t.key!==`Enter`||t.target.closest(`a, button, input, label`)||(t.preventDefault(),Sn(e))})}),y.querySelector(`#browse-select-clear`)?.addEventListener(`click`,()=>{S=new Map,k()}),y.querySelector(`#browse-try-selected`)?.addEventListener(`click`,()=>{wn(Zt())}),y.querySelectorAll(`[data-try-nades]`).forEach(e=>e.addEventListener(`click`,t=>{t.stopPropagation(),wn([Number(e.dataset.tryNades)])})),y.querySelectorAll(`[data-favorite-nade]`).forEach(e=>e.addEventListener(`click`,t=>{t.stopPropagation(),Tn(Number(e.dataset.favoriteNade))}));let e=y.querySelector(`#nade-add-canvas`);e&&e.addEventListener(`click`,t=>{let n=ft(e,t);!C.start||C.start&&C.end?(C.start=n,C.end=null):C.end=n;let r=y.querySelector(`#nade-add-coords`);r&&(r.textContent=C.end?`Throw + landing set. Adjust by clicking again to start over.`:`Now click the landing spot for the grenade.`),dn()}),y.querySelector(`#add-map`)?.addEventListener(`change`,e=>{C.map=e.target.value,dn()}),y.querySelector(`#add-type`)?.addEventListener(`change`,e=>{C.type=e.target.value,dn()}),y.querySelector(`#add-clear`)?.addEventListener(`click`,()=>{C.start=null,C.end=null,dn();let e=y.querySelector(`#nade-add-coords`);e&&(e.textContent=`Click the map to set the throw position, then click again for the landing spot.`)}),y.querySelector(`#nade-add-form`)?.addEventListener(`submit`,mn),y.querySelector(`#guide-file`)?.addEventListener(`change`,hn),y.querySelector(`#guide-text`)?.addEventListener(`input`,e=>{w.text=e.target.value}),y.querySelector(`#guide-side`)?.addEventListener(`change`,e=>{w.side=e.target.value}),y.querySelector(`#guide-parse`)?.addEventListener(`click`,gn),y.querySelector(`#guide-import`)?.addEventListener(`click`,_n),y.querySelector(`#guide-try-game`)?.addEventListener(`click`,vn),y.querySelector(`#guide-clear`)?.addEventListener(`click`,()=>{w=Vt(),T=null,k(),D(`Cleared map guide.`,``)}),y.querySelectorAll(`[data-guide-idx]`).forEach(e=>e.addEventListener(`click`,()=>{w.selected=Number(e.dataset.guideIdx),k()})),y.querySelector(`[data-try-game-close]`)?.addEventListener(`click`,()=>{T=null,zt=1,k()}),y.querySelector(`[data-try-game-download]`)?.addEventListener(`click`,()=>{if(!T)return;let e=_t(y);if(!e.guide&&!e.cfg){let e=y.querySelector(`[data-try-game-status]`);e&&(e.textContent=`Choose at least one file to download, or just Open CS2 if you already have them.`);return}let t=mt(T,e),n=y.querySelector(`[data-try-game-status]`);n&&(n.textContent=t.length?`Downloaded ${t.join(` + `)}. Copy into your CS2 folders, then Open CS2.`:`Nothing selected to download.`)}),y.querySelector(`[data-try-game-open]`)?.addEventListener(`click`,En),y.querySelector(`[data-try-game-copy-cmd]`)?.addEventListener(`click`,Dn),y.querySelectorAll(`[data-add-media]`).forEach(e=>e.addEventListener(`click`,()=>On(e.dataset.addMedia))),y.querySelectorAll(`[data-try-import]`).forEach(e=>e.addEventListener(`click`,()=>yn(e.dataset.tryImport))),y.querySelectorAll(`[data-delete-nade]`).forEach(e=>e.addEventListener(`click`,()=>kn(e.dataset.deleteNade))),y.querySelectorAll(`[data-delete-media]`).forEach(e=>e.addEventListener(`click`,()=>An(e.dataset.deleteMedia))),y.querySelectorAll(`[data-approve-nade]`).forEach(e=>e.addEventListener(`click`,()=>jn(e.dataset.approveNade,`approved`))),y.querySelectorAll(`[data-reject-nade]`).forEach(e=>e.addEventListener(`click`,()=>jn(e.dataset.rejectNade,`rejected`))),y.querySelectorAll(`[data-approve-media]`).forEach(e=>e.addEventListener(`click`,()=>Nn(e.dataset.approveMedia,`approved`))),y.querySelectorAll(`[data-reject-media]`).forEach(e=>e.addEventListener(`click`,()=>Nn(e.dataset.rejectMedia,`rejected`)));let t=y.querySelector(`#review-select-all`),n=y.querySelector(`#review-bulk-approve`),r=y.querySelector(`#review-bulk-reject`),i=()=>{let e=y.querySelectorAll(`.review-nade-check:checked`).length;n&&(n.disabled=e===0),r&&(r.disabled=e===0)};t?.addEventListener(`change`,()=>{y.querySelectorAll(`.review-nade-check`).forEach(e=>{e.checked=t.checked}),i()}),y.querySelectorAll(`.review-nade-check`).forEach(e=>e.addEventListener(`change`,i)),n?.addEventListener(`click`,()=>Mn(`approved`)),r?.addEventListener(`click`,()=>Mn(`rejected`)),y.querySelectorAll(`[data-role-user]`).forEach(e=>e.addEventListener(`click`,()=>Pn(e.dataset.roleUser,e.dataset.role))),y.querySelectorAll(`[data-ban]`).forEach(e=>e.addEventListener(`click`,()=>{let t=y.querySelector(`[data-ban-dur="${e.dataset.ban}"]`);Fn(e.dataset.ban,t?t.value:`24`)})),y.querySelectorAll(`[data-unban]`).forEach(e=>e.addEventListener(`click`,()=>In(e.dataset.unban)))}async function mn(e){if(e.preventDefault(),C.title=y.querySelector(`#add-title`)?.value||``,C.map=y.querySelector(`#add-map`)?.value||C.map,C.type=y.querySelector(`#add-type`)?.value||C.type,C.side=y.querySelector(`#add-side`)?.value||C.side,C.technique=y.querySelector(`#add-technique`)?.value||C.technique,C.description=y.querySelector(`#add-description`)?.value||``,!C.start||!C.end){D(`Click the map to set both the throw position and the landing spot.`,`error`);return}let t=[],n=(y.querySelector(`#add-video`)?.value||``).trim(),r=(y.querySelector(`#add-image`)?.value||``).trim();n&&t.push({url:n,kind:`video`}),r&&t.push({url:r,kind:rt(r)});let i=y.querySelector(`#add-upload`);try{if(i?.files?.[0]){D(`Uploading image…`,``);let e=await _.uploads.image(i.files[0]);t.push({url:e.url,kind:`image`})}await _.nades.create({...C,media:t}),C=Bt(),await O(`mine`),D(`Nade submitted! It will appear publicly once an admin approves it.`,`ok`)}catch(e){D(e.message,`error`)}}async function hn(e){let t=e.target.files?.[0];if(t)try{w.fileName=t.name,w.text=await t.text(),w.parsed=null,w.selected=null,k(),D(`Loaded ${t.name}. Click Preview lineups.`,`ok`)}catch{D(`Could not read that file.`,`error`)}}async function gn(){let e=(y.querySelector(`#guide-text`)?.value||w.text||``).trim();if(w.text=e,w.side=y.querySelector(`#guide-side`)?.value||w.side,!e){D(`Upload or paste a CS2 map guide .txt first.`,`error`);return}try{D(`Parsing map guide…`,``);let t=await _.nades.parseMapGuide(e);w.parsed=t,w.selected=0,k(),D(`Found ${t.nades.length} lineup${t.nades.length===1?``:`s`} on ${$e(t.map)}.`,`ok`)}catch(e){w.parsed=null,k(),D(e.message,`error`)}}async function _n(){if(!w.parsed?.nades?.length){D(`Preview the guide first so you can confirm the lineups.`,`error`);return}w.side=y.querySelector(`#guide-side`)?.value||w.side;let e=(y.querySelector(`#guide-text`)?.value||w.text||``).trim();try{D(`Importing lineups…`,``);let t=await _.nades.importMapGuide({nades:w.parsed.nades,side:w.side,guideText:e,fileName:w.fileName});w=Vt(),await O(`mine`),D(`Imported ${t.count} nade${t.count===1?``:`s`} — pending admin review.`,`ok`)}catch(e){D(e.message,`error`)}}async function vn(){let e=(y.querySelector(`#guide-text`)?.value||w.text||``).trim(),t=w.parsed?.map;if(!e||!t){D(`Preview the map guide first.`,`error`);return}try{D(`Preparing CS2 practice pack…`,``),T=(await _.nades.practicePackFromText({text:e,map:t})).pack,zt=w.parsed?.nades?.length||1,k(),D(`Choose what to download (or skip if you already have the files), then Open CS2.`,`ok`)}catch(e){D(e.message,`error`)}}async function yn(e){try{D(`Preparing CS2 practice pack…`,``),T=(await _.nades.practicePackFromImport(e)).pack,zt=1,k(),D(`Choose what to download (or skip if you already have the files), then Open CS2.`,`ok`)}catch(e){D(e.message,`error`)}}function bn(e,t,n){if(!Number.isFinite(e)||e<=0)return!1;if(!n)return S.delete(e),Cn(),!0;if(S.size>=Ot&&!S.has(e))return D(`You can select at most ${Ot} lineups at once.`,`error`,{title:`Too many lineups`}),!1;for(let[,e]of S)if(e!==t)return D(`You can only select lineups from one map. Clear your selection or pick more from ${$e(e)}.`,`error`,{title:`One map only`}),!1;return S.set(e,t),Cn(),!0}function xn(e){if(!e)return;let t=Number(e.dataset.browseNade),n=S.has(t);e.classList.toggle(`selected`,n),e.setAttribute(`aria-checked`,n?`true`:`false`);let r=e.querySelector(`.browse-select`);r&&(r.checked=n)}function Sn(e){let t=Number(e.dataset.browseNade),n=e.dataset.map;bn(t,n,!S.has(t)),xn(e)}function Cn(){let e=y.querySelector(`#browse-try-selected`),t=y.querySelector(`#browse-select-clear`),n=S.size;e&&(e.disabled=n===0,e.textContent=`Try selected in game (${n}/${Ot})`),t&&(t.disabled=n===0)}async function wn(e){let t=[...new Set((e||[]).map(Number).filter(e=>Number.isFinite(e)&&e>0))];if(!t.length){D(`Select at least one lineup (max ${Ot}, same map).`,`error`,{title:`Nothing selected`});return}if(t.length>Ot){D(`You can open at most ${Ot} lineups at once.`,`error`,{title:`Too many lineups`});return}try{D(`Preparing CS2 practice pack…`,``),T=(await _.nades.practicePackFromNades(t)).pack,zt=t.length,k(),D(t.length>1?`Merged ${t.length} lineups into one annotation file. Download what you need, then Open CS2.`:`Choose what to download (or skip if you already have the files), then Open CS2.`,`ok`)}catch(e){D(e.message,`error`)}}async function Tn(e){if(!b){qe(`login`);return}if(!(!Number.isFinite(e)||e<=0))try{let t=await _.nades.favorite(e);Pt.counts[e]=t.count,Pt.mine=t.favorited?[...Pt.mine.filter(t=>t!==e),e]:Pt.mine.filter(t=>t!==e),x===`favorites`&&!t.favorited&&(Ft=Ft.filter(t=>t.id!==e)),k(),D(t.favorited?`Added to favorites.`:`Removed from favorites.`,`ok`)}catch(e){D(e.message,`error`)}}function En(){if(!T)return;let e=y.querySelector(`[data-try-game-status]`);try{ht(T);let t=`Opening CS2 private ${T.deMap}… Quit CS2 first if it was already running, otherwise paste in console: ${T.consoleCommand||`map ${T.deMap}; exec ${T.cfgBaseName}`}`;e&&(e.textContent=t),D(t,`ok`)}catch(t){e&&(e.textContent=t.message),D(t.message,`error`)}}async function Dn(){if(!T)return;let e=y.querySelector(`[data-try-game-status]`);try{let t=`Copied: ${await gt(T)}`;e&&(e.textContent=t),D(t,`ok`)}catch(t){e&&(e.textContent=t.message),D(t.message,`error`)}}async function On(e){let t=(y.querySelector(`.add-media-url[data-nade="${e}"]`)?.value||``).trim();if(!t){D(`Enter a media URL first.`,`error`);return}try{await _.nades.addMedia(e,{url:t,kind:rt(t)}),await O(`mine`),D(`Media added — pending admin review.`,`ok`)}catch(e){D(e.message,`error`)}}async function kn(e){if(confirm(`Permanently delete this nade and its media?`))try{await _.nades.remove(e),S.delete(Number(e)),await O(x),D(`Nade deleted.`,`ok`)}catch(e){D(e.message,`error`)}}async function An(e){if(confirm(`Permanently remove this media?`))try{await _.admin.removeMedia(e),await O(x),D(`Media removed.`,`ok`)}catch(e){D(e.message,`error`)}}async function jn(e,t){let n=y.querySelector(`.review-note[data-nade="${e}"]`)?.value||``;try{await _.admin.reviewNade(e,t,n),await O(`review`),D(`Nade ${t}.`,`ok`)}catch(e){D(e.message,`error`)}}async function Mn(e){let t=[...y.querySelectorAll(`.review-nade-check:checked`)].map(e=>Number(e.value));if(!t.length){D(`Select at least one pending nade.`,`error`);return}let n=y.querySelector(`#review-bulk-note`)?.value||``;try{let r=await _.admin.reviewNadesBulk(t,e,n);await O(`review`),D(`${e===`approved`?`Approved`:`Rejected`} ${r.updated} nade${r.updated===1?``:`s`}.`,`ok`)}catch(e){D(e.message,`error`)}}async function Nn(e,t){try{await _.admin.reviewMedia(e,t),await O(`review`),D(`Media ${t}.`,`ok`)}catch(e){D(e.message,`error`)}}async function Pn(e,t){try{await _.admin.setRole(e,t),await O(`users`),D(`Role updated.`,`ok`)}catch(e){D(e.message,`error`)}}async function Fn(e,t){try{t===`perma`?await _.admin.banUser(e,{permanent:!0}):await _.admin.banUser(e,{hours:Number(t)}),await O(`users`),D(`User banned.`,`ok`)}catch(e){D(e.message,`error`)}}async function In(e){try{await _.admin.unbanUser(e),await O(`users`),D(`User unbanned.`,`ok`)}catch(e){D(e.message,`error`)}}async function Ln(){y=document.querySelector(`#nades-tool`),y&&(b=ke(),Ae(async e=>{b=e,await qt(),!b&&[`add`,`import`,`mine`,`favorites`,`review`,`users`].includes(x)&&(x=`browse`),b&&!g(b)&&[`review`,`users`].includes(x)&&(x=`browse`),await O(x)}),await qt(),k(),await O(`browse`))}function Rn(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function zn(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card import-card" role="dialog" aria-modal="true" aria-label="${Rn(e.title)}">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${Rn(e.title)}</h2>
      <p class="hint">${Rn(e.description)}</p>
      <ol class="import-steps">
        <li>Open the source and complete the verification: <a class="btn btn-sm" href="${Rn(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${Rn(e.sourceLabel)} ↗</a></li>
        <li>Copy the page content.</li>
        <li>Paste it below and import.</li>
      </ol>
      <textarea id="import-content" rows="9" spellcheck="false" placeholder="${Rn(e.placeholder||`Paste the page content here…`)}"></textarea>
      <div class="actions">
        <button class="btn primary" id="import-run">Import</button>
        <button class="btn ghost" data-close>Cancel</button>
      </div>
      <p class="status" id="import-status"></p>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=e=>{e.key===`Escape`&&(n(),document.removeEventListener(`keydown`,r))};document.addEventListener(`keydown`,r);let i=t.querySelector(`#import-status`),a=t.querySelector(`#import-run`);a.addEventListener(`click`,async()=>{let r=t.querySelector(`#import-content`).value;if(!r.trim()){i.textContent=`Paste the page content first.`,i.className=`status error`;return}a.disabled=!0,i.textContent=`Importing…`,i.className=`status`;try{let t=await e.onImport(r);i.textContent=t||`Imported.`,i.className=`status ok`,setTimeout(n,900)}catch(e){i.textContent=e.message,i.className=`status error`,a.disabled=!1}}),t.querySelector(`#import-content`)?.focus()}var A,Bn=null,j={commands:[],categories:[],recommendedLaunchOptions:``,source:`seed`,lastSync:0,cs2Build:``,cs2Version:``,remoteConfigured:!1},Vn={counts:{},mine:[],comments:{}},Hn=[],Un={text:``,kind:``},Wn=new Set;function M(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function N(e,t=``){Un={text:e,kind:t};let n=A?.querySelector(`#commands-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Gn(e){if(!e)return`—`;try{return new Date(e).toLocaleString()}catch{return`—`}}async function Kn(){try{j=await _.commands.catalog()}catch(e){N(`Could not load command catalog: ${e.message}`,`error`)}try{Vn=await _.commands.social()}catch{}if(g(Bn))try{Hn=await _.admin.pendingComments()}catch{Hn=[]}else Hn=[]}function qn(e){let t=Vn.comments[e.key]||[];return`<div class="cmd-comments">${t.length?t.map(e=>`<div class="cmd-comment">
            <div class="cmd-comment-body"><strong>${M(e.username)}</strong><span>${M(e.body)}</span></div>
            ${g(Bn)?`<button class="btn btn-sm ghost danger" type="button" data-remove-comment="${e.id}">Remove</button>`:``}
          </div>`).join(``):`<p class="hint">No comments yet.</p>`}${Bn?`<form class="cmd-comment-form" data-comment-key="${M(e.key)}">
         <input type="text" maxlength="1000" placeholder="Share a tip about this command…" />
         <button class="btn btn-sm" type="submit">Comment</button>
       </form>
       <p class="hint">Comments are reviewed by an admin before appearing.</p>`:`<button class="btn btn-sm" data-open-auth="login">Log in to comment</button>`}</div>`}function Jn(e){let t=Vn.counts[e.key]||0,n=Vn.mine.includes(e.key),r=(Vn.comments[e.key]||[]).length,i=Wn.has(e.key);return`
    <article class="cmd-card" data-search="${M(`${e.command} ${e.title} ${e.description}`.toLowerCase())}">
      <div class="cmd-head">
        <div class="cmd-title-row">
          <h4>${M(e.title)}</h4>
          ${e.isNew?`<span class="nade-badge new">NEW</span>`:``}
          <span class="cmd-tag ${M(e.type)}">${e.type===`launch`?`launch option`:`console`}</span>
        </div>
      </div>
      <div class="cmd-code-row">
        <code class="cmd-code">${M(e.command)}</code>
        <button class="btn btn-sm" data-copy="${M(e.command)}">Copy</button>
      </div>
      <p class="cmd-desc">${M(e.description)}</p>
      <div class="cmd-actions">
        <button class="btn btn-sm recommend ${n?`active`:``}" data-recommend="${M(e.key)}">
          ${n?`★ Recommended`:`☆ Recommend`} <span class="rec-count">${t}</span>
        </button>
        <button class="btn btn-sm ghost" data-toggle-comments="${M(e.key)}">
          ${i?`Hide`:`Comments`}${r?` (${r})`:``}
        </button>
      </div>
      ${i?qn(e):``}
    </article>`}function Yn(e){let t=j.commands.filter(t=>t.category===e.id);return t.length?`
    <section class="cmd-category" data-category="${M(e.id)}">
      <h3 class="cmd-cat-title">${M(e.name)} <span class="cmd-count">${t.length}</span></h3>
      <div class="cmd-grid">${t.map(Jn).join(``)}</div>
    </section>`:``}function Xn(){let e=j.commands.filter(e=>e.isNew).length,t=g(Bn)?`<div class="actions">
         <button class="btn btn-sm" id="cmd-sync">Sync from wiki now</button>
         <button class="btn btn-sm ghost" id="cmd-check-cs2">Re-check CS2 build</button>
       </div>`:``;return`
    <section class="cmd-status-bar">
      <div>
        <strong>Source:</strong> ${M(j.source)}${j.remoteConfigured?``:` (wiki)`} ·
        <strong>CS2 build:</strong> ${j.cs2Build?`${M(j.cs2Build)}${j.cs2Version?` (${M(j.cs2Version)})`:``}`:`—`} ·
        <strong>Last synced:</strong> ${Gn(j.lastSync)}
        ${e?` · <span class="nade-badge new">${e} new</span>`:``}
      </div>
      ${t}
    </section>`}function Zn(){return!g(Bn)||!Hn.length?``:`
    <section class="cmd-review panel-review">
      <h3>Comments awaiting review (${Hn.length})</h3>
      ${Hn.map(e=>`<div class="review-comment">
            <div><strong>${M(e.username)}</strong> on <code>${M(e.commandKey)}</code><br /><span>${M(e.body)}</span></div>
            <div class="actions">
              <button class="btn btn-sm primary" data-approve-comment="${e.id}">Approve</button>
              <button class="btn btn-sm ghost" data-reject-comment="${e.id}">Reject</button>
              <button class="btn btn-sm ghost danger" data-remove-comment="${e.id}">Delete</button>
            </div>
          </div>`).join(``)}
    </section>`}function Qn(){A.innerHTML=`
    <div class="commands-shell">
      ${Xn()}
      <section class="quick-launch">
        <div>
          <h3>Recommended launch options</h3>
          <p class="hint">Steam → right-click Counter-Strike 2 → Properties → Launch Options.</p>
        </div>
        <div class="cmd-code-row">
          <code class="cmd-code">${M(j.recommendedLaunchOptions||``)}</code>
          <button class="btn" data-copy="${M(j.recommendedLaunchOptions||``)}">Copy</button>
        </div>
      </section>
      ${Zn()}
      <label class="field cmd-search">
        <span>Search commands</span>
        <input id="cmd-search" type="search" placeholder="Search by command, title, or description…" />
      </label>
      ${j.categories.map(Yn).join(``)}
      <div id="commands-status" class="status ${Un.kind}">${M(Un.text)}</div>
    </div>`,er()}function $n(e){let t=e.trim().toLowerCase();A.querySelectorAll(`.cmd-category`).forEach(e=>{let n=0;e.querySelectorAll(`.cmd-card`).forEach(e=>{let r=!t||e.dataset.search.includes(t);e.classList.toggle(`hidden`,!r),r&&(n+=1)}),e.classList.toggle(`hidden`,n===0)})}function er(){A.querySelectorAll(`[data-copy]`).forEach(e=>e.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e.dataset.copy),N(`Copied to clipboard.`,`ok`)}catch{N(`Clipboard blocked — select and copy manually.`,`error`)}})),A.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),A.querySelectorAll(`[data-recommend]`).forEach(e=>e.addEventListener(`click`,()=>tr(e.dataset.recommend))),A.querySelectorAll(`[data-toggle-comments]`).forEach(e=>e.addEventListener(`click`,()=>{let t=e.dataset.toggleComments;Wn.has(t)?Wn.delete(t):Wn.add(t),Qn()})),A.querySelectorAll(`.cmd-comment-form`).forEach(e=>e.addEventListener(`submit`,t=>{t.preventDefault(),nr(e.dataset.commentKey,e.querySelector(`input`))})),A.querySelectorAll(`[data-approve-comment]`).forEach(e=>e.addEventListener(`click`,()=>rr(e.dataset.approveComment,`approved`))),A.querySelectorAll(`[data-reject-comment]`).forEach(e=>e.addEventListener(`click`,()=>rr(e.dataset.rejectComment,`rejected`))),A.querySelectorAll(`[data-remove-comment]`).forEach(e=>e.addEventListener(`click`,()=>ir(e.dataset.removeComment))),A.querySelector(`#cmd-search`)?.addEventListener(`input`,e=>$n(e.target.value)),A.querySelector(`#cmd-sync`)?.addEventListener(`click`,ar),A.querySelector(`#cmd-check-cs2`)?.addEventListener(`click`,or)}async function tr(e){if(!Bn){qe(`login`);return}try{let t=await _.commands.recommend(e);Vn.counts[e]=t.count,Vn.mine=t.recommended?[...Vn.mine.filter(t=>t!==e),e]:Vn.mine.filter(t=>t!==e),Qn()}catch(e){N(e.message,`error`)}}async function nr(e,t){let n=(t?.value||``).trim();if(!n){N(`Write something first.`,`error`);return}try{await _.commands.addComment(e,n),N(`Comment submitted — an admin will review it before it appears.`,`ok`),t&&(t.value=``)}catch(e){N(e.message,`error`)}}async function rr(e,t){try{await _.admin.reviewComment(e,t),await Kn(),Qn(),N(`Comment ${t}.`,`ok`)}catch(e){N(e.message,`error`)}}async function ir(e){if(confirm(`Permanently delete this comment?`))try{await _.admin.removeComment(e),await Kn(),Qn(),N(`Comment deleted.`,`ok`)}catch(e){N(e.message,`error`)}}function ar(){zn({title:`Sync commands from the CS2 wiki`,description:`The Valve wiki has a bot check that blocks servers. Open it in your browser, complete the verification, then copy the page source (wikitext) and paste it here — the server will parse it.`,sourceUrl:`https://developer.valvesoftware.com/w/index.php?title=List_of_Counter-Strike_2_console_command_variables&action=raw`,sourceLabel:`Open CS2 wiki source`,placeholder:`Paste the wiki page source (wikitext), or a JSON list of commands…`,onImport:async e=>{let t=await _.admin.importCommands(e);return await Kn(),Qn(),`Imported ${t.count} commands.`}})}async function or(){N(`Checking the current CS2 build…`,``);try{let e=await _.admin.checkCommandsCs2();await Kn(),Qn(),N(e.ok?`CS2 build ${e.build}${e.changed?` — changed, catalog re-synced`:` — no change`}.`:`Check failed: ${e.reason}`,e.ok?`ok`:`error`)}catch(e){N(e.message,`error`)}}async function sr(){A=document.querySelector(`#commands-tool`),A&&(Bn=ke(),Ae(async e=>{Bn=e,await Kn(),Qn()}),Qn(),await Kn(),Qn())}var P,F=null,cr=null,lr={paypalUrl:``,steamTradeUrl:``},ur={text:``,kind:``};function I(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function L(e,t=``){ur={text:e,kind:t};let n=P?.querySelector(`#profile-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function dr(e){try{return new Date(e).toLocaleDateString()}catch{return`—`}}async function fr(){if(F){try{cr=(await _.auth.profile()).stats}catch(e){L(e.message,`error`)}if(we(F))try{lr=await _.settings.get()}catch{}}}function pr(e,t){return`<div class="profile-stat"><dt>${I(e)}</dt><dd>${I(t)}</dd></div>`}function mr(){return we(F)?`
    <section class="panel profile-settings">
      <div class="panel-head"><h2>Donate links</h2><span class="panel-tag">Owner only</span></div>
      <div class="profile-settings-body">
        <p class="hint">These power the PayPal &amp; Steam buttons in the site footer. Leave a field empty to hide that button.</p>
        <label class="field">
          <span>PayPal link</span>
          <input id="set-paypal" type="url" placeholder="https://www.paypal.com/paypalme/yourname" value="${I(lr.paypalUrl)}" />
        </label>
        <label class="field">
          <span>Steam trade link</span>
          <input id="set-steam" type="url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${I(lr.steamTradeUrl)}" />
        </label>
        <div class="actions">
          <button class="btn primary" id="set-save">Save donate links</button>
        </div>
      </div>
    </section>`:``}function hr(){if(!F){P.innerHTML=`<div class="profile-shell"><div class="login-prompt">
      <p class="hint">Log in to view your profile.</p>
      <div class="actions"><button class="btn primary" data-open-auth="login">Log in</button><button class="btn" data-open-auth="register">Register</button></div>
    </div></div>`,P.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth)));return}let e=(F.username||`?`).charAt(0).toUpperCase(),t=cr||{nadesTotal:0,nadesApproved:0,nadesPending:0,recommendations:0,comments:0,nadeFavorites:0};P.innerHTML=`
    <div class="profile-shell">
      <section class="panel profile-card">
        <div class="profile-head">
          <div class="profile-avatar">${F.avatarUrl?`<img src="${I(Te(F.avatarUrl))}" alt="${I(F.username)}" />`:I(e)}</div>
          <div>
            <h2 class="profile-name">${I(F.username)} <span class="nade-badge ${I(F.role)}">${I(F.role)}</span></h2>
            <p class="hint">${F.email?I(F.email):`No email set`} · member since ${dr(F.createdAt)}</p>
            <div class="avatar-controls">
              <input type="file" id="avatar-file" accept="image/*" hidden />
              <button class="btn btn-sm" id="avatar-upload">${F.avatarUrl?`Change photo`:`Upload photo`}</button>
              ${F.avatarUrl?`<button class="btn btn-sm ghost" id="avatar-remove">Remove</button>`:``}
            </div>
          </div>
        </div>
        <dl class="profile-stats">
          ${pr(`Nades submitted`,t.nadesTotal)}
          ${pr(`Approved`,t.nadesApproved)}
          ${pr(`Pending`,t.nadesPending)}
          ${pr(`Favorite nades`,t.nadeFavorites)}
          ${pr(`Commands recommended`,t.recommendations)}
          ${pr(`Comments`,t.comments)}
        </dl>
      </section>
      <section class="panel profile-account">
        <div class="panel-head"><h2>Account</h2></div>
        <div class="profile-settings-body">
          <label class="field"><span>Username</span><input id="acc-username" type="text" value="${I(F.username)}" maxlength="80" /></label>
          <div class="actions"><button class="btn btn-sm" id="username-save">Save username</button></div>
          <div class="account-steam">
            ${F.steamId?`<p class="hint">Steam linked${F.steamPersona?`: <strong>${I(F.steamPersona)}</strong>`:``}.</p>
                   <button class="btn btn-sm ghost" id="steam-unlink">Unlink Steam</button>`:`<p class="hint">Connect your Steam account so you can also log in with Steam.</p>
                   <button class="btn btn-sm" id="steam-link">Connect Steam</button>`}
          </div>
        </div>
      </section>
      ${F.hasPassword?`<section class="panel profile-password">
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
      ${mr()}
      <div id="profile-status" class="status ${ur.kind}">${I(ur.text)}</div>
    </div>`,P.querySelector(`#set-save`)?.addEventListener(`click`,Cr),P.querySelector(`#pw-save`)?.addEventListener(`click`,_r),P.querySelector(`#username-save`)?.addEventListener(`click`,yr),P.querySelector(`#cred-save`)?.addEventListener(`click`,br),P.querySelector(`#steam-link`)?.addEventListener(`click`,xr),P.querySelector(`#steam-unlink`)?.addEventListener(`click`,Sr);let n=P.querySelector(`#avatar-file`);P.querySelector(`#avatar-upload`)?.addEventListener(`click`,()=>n?.click()),n?.addEventListener(`change`,e=>gr(e.target.files?.[0])),P.querySelector(`#avatar-remove`)?.addEventListener(`click`,vr)}async function gr(e){if(e){L(`Uploading image…`,``);try{await _.auth.uploadAvatar(e),await je(),L(`Profile image updated.`,`ok`)}catch(e){L(e.message,`error`)}}}async function _r(){let e=P.querySelector(`#pw-current`)?.value||``,t=P.querySelector(`#pw-new`)?.value||``;try{await _.auth.changePassword({currentPassword:e,newPassword:t}),P.querySelector(`#pw-current`).value=``,P.querySelector(`#pw-new`).value=``,L(`Password updated.`,`ok`)}catch(e){L(e.message,`error`)}}async function vr(){try{await _.auth.setAvatar(``),await je(),L(`Profile image removed.`,`ok`)}catch(e){L(e.message,`error`)}}async function yr(){let e=P.querySelector(`#acc-username`)?.value||``;try{await _.auth.changeUsername(e),await je(),L(`Username updated.`,`ok`)}catch(e){L(e.message,`error`)}}async function br(){let e=P.querySelector(`#cred-email`)?.value||``,t=P.querySelector(`#cred-password`)?.value||``;try{await _.auth.setCredentials({email:e,password:t}),await je(),L(`Email & password saved — you can now log in without Steam.`,`ok`)}catch(e){L(e.message,`error`)}}async function xr(){try{let e=await _.auth.steamLinkUrl();window.location.href=e}catch(e){L(e.message,`error`)}}async function Sr(){try{await _.auth.steamUnlink(),await je(),L(`Steam unlinked.`,`ok`)}catch(e){L(e.message,`error`)}}async function Cr(){let e=P.querySelector(`#set-paypal`)?.value||``,t=P.querySelector(`#set-steam`)?.value||``;try{lr=await _.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),L(`Donate links saved.`,`ok`),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))}catch(e){L(e.message,`error`)}}async function wr(){P=document.querySelector(`#profile-tool`),P&&(F=ke(),Ae(async e=>{F=e,await fr(),hr()}),hr(),await fr(),hr())}var R,Tr=null,Er=[],Dr=`top`,Or=!1,kr={text:``,kind:``},Ar=new Set;function jr(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Mr(e,t=``){kr={text:e,kind:t};let n=R?.querySelector(`#configs-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Nr(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function Pr(e,t){let n=new Blob([t],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}async function Fr(){try{Er=await _.configs.list({sort:Dr})}catch(e){Mr(e.message,`error`)}Br()}function Ir(e){let t=Math.round(e),n=``;for(let e=1;e<=5;e+=1)n+=e<=t?`★`:`☆`;return n}function Lr(e){if(!Tr)return`<button class="btn btn-sm" data-open-auth="login">Log in to rate</button>`;if(e.authorId===Tr.id)return`<span class="hint">Your upload</span>`;let t=``;for(let n=1;n<=5;n+=1)t+=`<button class="star-btn ${n<=e.myRating?`on`:``}" data-rate="${e.id}" data-star="${n}" title="${n} star${n>1?`s`:``}">${n<=e.myRating?`★`:`☆`}</button>`;return`<span class="rate-label">Your rating:</span><span class="star-picker">${t}</span>`}function Rr(e){let t=Ar.has(e.id),n=Tr&&(e.authorId===Tr.id||g(Tr));return`
    <article class="config-card" data-search="${jr(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="config-head">
        <h3>${jr(e.title)}</h3>
        <div class="config-rating" title="${e.avgRating} from ${e.ratingCount} rating(s)">
          <span class="stars">${Ir(e.avgRating)}</span>
          <span class="rating-num">${e.avgRating||`—`} (${e.ratingCount})</span>
        </div>
      </div>
      ${e.description?`<p class="config-desc">${jr(e.description)}</p>`:``}
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
               ${e.hasConfig?`<div><strong>Config</strong><pre>${jr(e.configText)}</pre></div>`:``}
               ${e.hasVideo?`<div><strong>Video settings</strong><pre>${jr(e.videoText)}</pre></div>`:``}
             </div>`:``}
      <div class="config-foot">
        <span>by ${jr(e.authorName)} · ${Nr(e.createdAt)}</span>
        <span class="config-rate">${Lr(e)}</span>
      </div>
    </article>`}function zr(){return!Tr||!Or?``:`
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
    </section>`}function Br(){R.innerHTML=`
    <div class="configs-shell">
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Dr===`top`?`active`:``}" data-sort="top">Most rated</button>
          <button class="tool-tab ${Dr===`new`?`active`:``}" data-sort="new">Last uploaded</button>
        </div>
        <input id="cfg-search" type="search" class="cfg-search" placeholder="Search configs by title, author…" />
        ${Tr?`<button class="btn primary" id="cfg-new">Upload config</button>`:`<button class="btn primary" data-open-auth="login">Log in to upload</button>`}
      </div>
      ${zr()}
      <div class="config-grid">
        ${Er.length?Er.map(Rr).join(``):`<p class="hint">No configs yet — be the first to upload one!</p>`}
      </div>
      <div id="configs-status" class="status ${kr.kind}">${jr(kr.text)}</div>
    </div>`,Hr()}function Vr(e){let t=e.trim().toLowerCase();R.querySelectorAll(`.config-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function Hr(){R.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),R.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Dr=e.dataset.sort,Fr()})),R.querySelector(`#cfg-search`)?.addEventListener(`input`,e=>Vr(e.target.value)),R.querySelector(`#cfg-new`)?.addEventListener(`click`,()=>{Or=!0,Br()}),R.querySelector(`#cfg-cancel`)?.addEventListener(`click`,()=>{Or=!1,Br()}),R.querySelector(`#cfg-submit`)?.addEventListener(`click`,Gr),R.querySelector(`#cfg-config-file`)?.addEventListener(`change`,e=>Wr(e.target,`#cfg-config`)),R.querySelector(`#cfg-video-file`)?.addEventListener(`change`,e=>Wr(e.target,`#cfg-video`)),R.querySelectorAll(`[data-dl]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Er.find(t=>String(t.id)===e.dataset.dl);t&&(e.dataset.kind===`config`?Pr(`${Ur(t.title)}.cfg`,t.configText):Pr(`cs2_video.txt`,t.videoText))})),R.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Number(e.dataset.view);Ar.has(t)?Ar.delete(t):Ar.add(t),Br()})),R.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>qr(Number(e.dataset.del)))),R.querySelectorAll(`[data-rate]`).forEach(e=>e.addEventListener(`click`,()=>Kr(Number(e.dataset.rate),Number(e.dataset.star))))}function Ur(e){return(e||`config`).toLowerCase().replace(/[^a-z0-9]+/g,`_`).replace(/^_|_$/g,``).slice(0,40)||`config`}function Wr(e,t){let n=e.files?.[0];if(!n)return;let r=new FileReader;r.onload=()=>{let e=R.querySelector(t);e&&(e.value=String(r.result||``))},r.readAsText(n)}async function Gr(){let e=R.querySelector(`#cfg-title`)?.value||``,t=R.querySelector(`#cfg-desc`)?.value||``,n=R.querySelector(`#cfg-config`)?.value||``,r=R.querySelector(`#cfg-video`)?.value||``;try{await _.configs.create({title:e,description:t,configText:n,videoText:r}),Or=!1,Dr=`new`,await Fr(),Mr(`Config published!`,`ok`)}catch(e){Mr(e.message,`error`)}}async function Kr(e,t){try{let n=await _.configs.rate(e,t),r=Er.find(t=>t.id===e);r&&(r.avgRating=n.avgRating,r.ratingCount=n.ratingCount,r.myRating=n.myRating),Br(),Mr(`Thanks for rating!`,`ok`)}catch(e){Mr(e.message,`error`)}}async function qr(e){try{await _.configs.remove(e),await Fr(),Mr(`Config deleted.`,`ok`)}catch(e){Mr(e.message,`error`)}}async function Jr(){R=document.querySelector(`#configs-tool`),R&&(Tr=ke(),Ae(async e=>{Tr=e,await Fr()}),Br(),await Fr())}var z,Yr=null,Xr=[],Zr=[],Qr={text:``,kind:``},$r=!1,ei=null;function B(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function ti(e,t=``){Qr={text:e,kind:t};let n=z?.querySelector(`#highlights-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function ni(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function ri(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function ii(e){return/^https?:\/\//.test(e||``)?e:``}function ai(e){let t=ii(e);if(!t)return``;let n=ri(e);return n?`<iframe class="hl-embed" src="https://www.youtube.com/embed/${B(n)}" title="highlight" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e)?`<video class="hl-embed" src="${B(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${B(t)}" target="_blank" rel="noopener noreferrer">Open highlight ↗</a>`}async function oi(){try{Xr=await _.highlights.list({}),Zr=g(Yr)?await _.admin.highlightReports():[]}catch(e){ti(e.message,`error`)}ui()}function si(){return!g(Yr)||!Zr.length?``:`
    <section class="panel panel-review">
      <h3>Reported highlights (${Zr.length})</h3>
      ${Zr.map(e=>`<div class="report-item">
            <div class="report-media">${ai(e.url)}</div>
            <div class="report-body">
              <strong>${B(e.title)}</strong> <span class="hint">by ${B(e.authorName)}</span>
              <ul class="report-reasons">
                ${e.reports.map(e=>`<li><strong>${B(e.reporterName)}:</strong> ${B(e.reason||`(no reason given)`)}</li>`).join(``)}
              </ul>
              <div class="actions">
                <button class="btn btn-sm" data-keep="${e.id}">Keep</button>
                <button class="btn btn-sm ghost" data-remove-hl="${e.id}">Delete highlight</button>
              </div>
            </div>
          </div>`).join(``)}
    </section>`}function ci(e){let t=Yr&&(e.authorId===Yr.id||g(Yr));return`
    <article class="hl-card" data-search="${B(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="hl-media">${ai(e.url)}</div>
      <h3 class="hl-title">${B(e.title)}</h3>
      ${e.description?`<p class="hl-desc">${B(e.description)}</p>`:``}
      <div class="hl-foot">
        <span>by ${B(e.authorName)} · ${ni(e.createdAt)}</span>
        <span class="hl-actions">
          ${Yr?e.reportedByMe?`<span class="hint">Reported</span>`:`<button class="btn btn-sm ghost" data-report="${e.id}">Report</button>`:``}
          ${t?`<button class="btn btn-sm ghost" data-del="${e.id}">Delete</button>`:``}
        </span>
      </div>
      ${ei===e.id?`<form class="hl-report-form" data-report-form="${e.id}">
               <input type="text" maxlength="500" placeholder="Why are you reporting this? (optional)" />
               <button class="btn btn-sm" type="submit">Submit report</button>
               <button class="btn btn-sm ghost" type="button" data-cancel-report>Cancel</button>
             </form>`:``}
    </article>`}function li(){return!Yr||!$r?``:`
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
    </section>`}function ui(){z.innerHTML=`
    <div class="highlights-shell">
      <div class="configs-controls">
        <input id="hl-search" type="search" class="cfg-search" placeholder="Search highlights by title, author…" />
        ${Yr?`<button class="btn primary" id="hl-new">Share highlight</button>`:`<button class="btn primary" data-open-auth="login">Log in to share</button>`}
      </div>
      ${si()}
      ${li()}
      <div class="hl-grid">
        ${Xr.length?Xr.map(ci).join(``):`<p class="hint">No highlights yet — share the first one!</p>`}
      </div>
      <div id="highlights-status" class="status ${Qr.kind}">${B(Qr.text)}</div>
    </div>`,fi()}function di(e){let t=e.trim().toLowerCase();z.querySelectorAll(`.hl-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function fi(){z.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),z.querySelector(`#hl-search`)?.addEventListener(`input`,e=>di(e.target.value)),z.querySelector(`#hl-new`)?.addEventListener(`click`,()=>{$r=!0,ui()}),z.querySelector(`#hl-cancel`)?.addEventListener(`click`,()=>{$r=!1,ui()}),z.querySelector(`#hl-submit`)?.addEventListener(`click`,pi),z.querySelectorAll(`[data-report]`).forEach(e=>e.addEventListener(`click`,()=>{ei=Number(e.dataset.report),ui()})),z.querySelector(`[data-cancel-report]`)?.addEventListener(`click`,()=>{ei=null,ui()}),z.querySelector(`[data-report-form]`)?.addEventListener(`submit`,e=>{e.preventDefault(),mi(Number(e.currentTarget.dataset.reportForm),e.currentTarget.querySelector(`input`).value)}),z.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>hi(Number(e.dataset.del)))),z.querySelectorAll(`[data-keep]`).forEach(e=>e.addEventListener(`click`,()=>gi(Number(e.dataset.keep),`keep`))),z.querySelectorAll(`[data-remove-hl]`).forEach(e=>e.addEventListener(`click`,()=>gi(Number(e.dataset.removeHl),`delete`)))}async function pi(){let e=z.querySelector(`#hl-title`)?.value||``,t=z.querySelector(`#hl-desc`)?.value||``,n=z.querySelector(`#hl-url`)?.value||``;try{await _.highlights.create({title:e,description:t,url:n}),$r=!1,await oi(),ti(`Highlight shared!`,`ok`)}catch(e){ti(e.message,`error`)}}async function mi(e,t){try{await _.highlights.report(e,t),ei=null,await oi(),ti(`Thanks — an admin will review your report.`,`ok`)}catch(e){ti(e.message,`error`)}}async function hi(e){try{await _.highlights.remove(e),await oi(),ti(`Highlight deleted.`,`ok`)}catch(e){ti(e.message,`error`)}}async function gi(e,t){try{await _.admin.reviewHighlight(e,t),await oi(),ti(t===`delete`?`Highlight removed.`:`Reports cleared — highlight kept.`,`ok`)}catch(e){ti(e.message,`error`)}}async function _i(){z=document.querySelector(`#highlights-tool`),z&&(Yr=ke(),Ae(async e=>{Yr=e,await oi()}),ui(),await oi())}var V,vi=null,yi={pros:[],source:`seed`,lastSync:0},bi=`featured`,xi=``,Si=null,Ci={text:``,kind:``};function H(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function wi(e,t=``){Ci={text:e,kind:t};let n=V?.querySelector(`#pros-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}async function Ti(){try{yi=await _.pros.list({sort:bi,q:xi})}catch(e){wi(e.message,`error`)}Mi()}var Ei={"natus vincere":`#f4d000`,vitality:`#f5d20a`,falcons:`#0aa14f`,"team spirit":`#c8102e`,astralis:`#e4002b`,faze:`#e43b26`,g2:`#c8102e`};function Di(e){return Ei[(e||``).toLowerCase()]||`#33415a`}function Oi(e){let t=(e.team||e.player||`?`).trim(),n=t.split(/\s+/);return(n.length>1?n.slice(0,3).map(e=>e[0]).join(``):t.slice(0,2)).toUpperCase()}function ki(e){let t=e.photo||e.teamLogo||``,n=e.photo&&e.teamLogo?e.teamLogo:``,r=t?`<img class="pro-img" alt="${H(e.player)}" loading="lazy" src="${H(t)}"${n?` data-logo="${H(n)}"`:``} onerror="if(this.dataset.logo){this.src=this.dataset.logo;this.removeAttribute('data-logo');}else{this.remove();}" />`:``;return`<div class="pro-photo" style="--team:${Di(e.team)}"><span class="pro-monogram">${H(Oi(e))}</span>${r}</div>`}function Ai(e,t){return`<div class="pro-stat"><dt>${H(e)}</dt><dd>${t!=null&&t!==``?H(t):`—`}</dd></div>`}function ji(e){return`
    <article class="pro-card" data-search="${H(`${e.player} ${e.team||``}`.toLowerCase())}">
      ${ki(e)}
      <div class="pro-head">
        <div>
          <h3>${H(e.player)}</h3>
          ${e.team?`<p class="hint">${H(e.team)}</p>`:``}
        </div>
        <div class="pro-edpi"><span>${e.edpi??`—`}</span><small>eDPI</small></div>
      </div>
      <dl class="pro-stats">
        ${Ai(`DPI`,e.dpi)}
        ${Ai(`Sens`,e.sens)}
        ${Ai(`Zoom`,e.zoomSens)}
        ${Ai(`Hz`,e.hz)}
        ${Ai(`Resolution`,e.resolution)}
        ${Ai(`Aspect`,e.aspectRatio)}
      </dl>
    </article>`}function Mi(){let e=g(vi)?`<div class="pros-admin-actions">
         <button class="btn btn-sm" id="pros-sync">Sync from prosettings.net</button>
         <button class="btn btn-sm ghost" id="pros-import">Import from HLTV</button>
       </div>`:``;V.innerHTML=`
    <div class="pros-shell">
      <div class="cmd-status-bar">
        <div><strong>Source:</strong> ${H(yi.source)} · <strong>${yi.pros.length}</strong> players${yi.lastSync?` · synced ${H(new Date(yi.lastSync).toLocaleDateString())}`:``}</div>
        ${e}
      </div>
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${bi===`featured`?`active`:``}" data-sort="featured">Featured</button>
          <button class="tool-tab ${bi===`name`?`active`:``}" data-sort="name">Name</button>
          <button class="tool-tab ${bi===`edpi`?`active`:``}" data-sort="edpi">Lowest eDPI</button>
          <button class="tool-tab ${bi===`edpi-desc`?`active`:``}" data-sort="edpi-desc">Highest eDPI</button>
        </div>
        <input id="pros-search" type="search" class="cfg-search" placeholder="Search player or team…" value="${H(xi)}" />
      </div>
      <p class="hint">${yi.source===`prosettings`?`Live from prosettings.net.`:yi.source===`seed`?`Built-in list. Admins can sync live data from prosettings.net.`:`Source: ${H(yi.source)}.`}</p>
      <div class="pro-grid">
        ${yi.pros.length?yi.pros.map(ji).join(``):`<p class="hint">No pro settings yet.</p>`}
      </div>
      <div id="pros-status" class="status ${Ci.kind}">${H(Ci.text)}</div>
    </div>`,Ni()}function Ni(){V.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{bi=e.dataset.sort,Ti()}));let e=V.querySelector(`#pros-search`);e&&e.addEventListener(`input`,e=>{xi=e.target.value,clearTimeout(Si),Si=setTimeout(async()=>{await Ti();let e=V.querySelector(`#pros-search`);e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},300)}),V.querySelector(`#pros-sync`)?.addEventListener(`click`,Pi),V.querySelector(`#pros-import`)?.addEventListener(`click`,Fi)}async function Pi(){let e=V.querySelector(`#pros-sync`);e&&(e.disabled=!0),wi(`Syncing from prosettings.net…`,``);try{let e=await _.admin.syncPros();await Ti(),e.synced?wi(`Synced ${e.count} players from ${e.source}.`,`ok`):wi(`Sync failed: ${e.reason||`unknown error`}. Kept the current list.`,`error`)}catch(e){wi(e.message,`error`)}finally{let e=V.querySelector(`#pros-sync`);e&&(e.disabled=!1)}}function Fi(){zn({title:`Import pro settings from HLTV`,description:`HLTV has a Cloudflare check that blocks servers. Open HLTV in your browser, complete the verification, then paste a JSON list of players here. Each item: {"player","team","dpi","sens","zoomSens","hz","resolution","aspectRatio","photo","teamLogo"}.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,placeholder:`[{"player":"s1mple","team":"Natus Vincere","dpi":400,"sens":3.09,"hz":1000,"resolution":"1280x960","aspectRatio":"4:3"}]`,onImport:async e=>{let t=await _.admin.importPros(e);return await Ti(),`Imported ${t.count} players.`}})}async function Ii(){V=document.querySelector(`#pros-tool`),V&&(vi=ke(),Ae(e=>{vi=e,Mi()}),Mi(),await Ti())}var U,W=null,Li=`overview`,Ri={text:``,kind:``},zi={nades:0,comments:0,reports:0},G={},Bi=[{id:`overview`,label:`Overview`},{id:`nades`,label:`Nades`},{id:`comments`,label:`Comments`},{id:`reports`,label:`Reports`},{id:`users`,label:`Users`},{id:`sync`,label:`Data sync`},{id:`contact`,label:`Contact`},{id:`logs`,label:`Logs`,ownerOnly:!0},{id:`settings`,label:`Site settings`,ownerOnly:!0}];function K(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Vi(e,t=``){Ri={text:e,kind:t};let n=U?.querySelector(`#admin-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Hi(e){try{return new Date(e).toLocaleString()}catch{return`—`}}async function Ui(){try{let[e,t,n]=await Promise.all([_.admin.pendingCount().catch(()=>0),_.admin.pendingCommentsCount().catch(()=>0),_.admin.highlightReportsCount().catch(()=>0)]);zi={nades:e,comments:t,reports:n}}catch{}}function Wi(){let e=(e,t,n)=>`<button class="admin-stat" data-goto="${n}">
       <span class="admin-stat-num">${t}</span>
       <span class="admin-stat-label">${K(e)}</span>
     </button>`;return`
    <div class="admin-stats">
      ${e(`Nades to review`,zi.nades,`nades`)}
      ${e(`Comments to review`,zi.comments,`comments`)}
      ${e(`Highlight reports`,zi.reports,`reports`)}
    </div>
    <p class="hint">Use the tabs above to moderate content, manage users, sync data sources, and read contact messages.</p>`}function Gi(){let e=G.nades||[];return e.length?`
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
          <a href="${K(e.url)}" target="_blank" rel="noopener noreferrer">${K(e.kind||`media`)}</a>
          <span class="nade-badge ${K(e.status)}">${K(e.status)}</span>
          ${e.status===`pending`?`<button class="btn btn-sm" data-media-approve="${e.id}">Approve</button>
                 <button class="btn btn-sm ghost" data-media-reject="${e.id}">Reject</button>`:e.status===`approved`?`<button class="btn btn-sm ghost" data-media-reject="${e.id}">Unpublish</button>`:`<button class="btn btn-sm" data-media-approve="${e.id}">Approve</button>`}
          <button class="btn btn-sm ghost danger" data-media-delete="${e.id}">Remove</button>
        </div>`).join(``);return`
        <article class="panel admin-item">
          <div class="admin-item-head">
            ${e.status===`pending`?`<label class="review-check"><input type="checkbox" class="admin-nade-check" value="${e.id}" /><span>Select</span></label>`:``}
            <strong>${K(e.title||`Untitled`)}</strong>
            <span class="nade-badge ${K(e.status)}">${K(e.status)}</span>
          </div>
          <p class="hint">${K(e.map)} · ${K(e.type)} · ${K(e.side||``)} · ${K(e.technique||``)} · by ${K(e.authorName||e.author_name||`?`)}</p>
          ${t||`<p class="hint">No media.</p>`}
          <div class="actions">
            <button class="btn btn-sm" data-nade-approve="${e.id}">Approve nade</button>
            <button class="btn btn-sm ghost" data-nade-reject="${e.id}">Reject nade</button>
            <button class="btn btn-sm ghost danger" data-nade-delete="${e.id}">Delete</button>
          </div>
        </article>`}).join(``)}`:`<p class="hint">Nothing pending. All nades are reviewed.</p>`}function Ki(){let e=G.comments||[];return e.length?e.map(e=>`
      <article class="panel admin-item">
        <p>${K(e.body)}</p>
        <p class="hint">by ${K(e.username)} on <code>${K(e.commandKey)}</code> · ${Hi(e.createdAt)}</p>
        <div class="actions">
          <button class="btn btn-sm" data-comment-approve="${e.id}">Approve</button>
          <button class="btn btn-sm ghost" data-comment-reject="${e.id}">Reject</button>
          <button class="btn btn-sm ghost danger" data-comment-delete="${e.id}">Delete</button>
        </div>
      </article>`).join(``):`<p class="hint">No comments pending review.</p>`}function qi(){let e=G.reports||[];return e.length?e.map(e=>{let t=(e.reports||[]).map(e=>`<li>${K(e.reason||`No reason`)} — <span class="hint">${K(e.reporterName||`?`)}</span></li>`).join(``);return`
        <article class="panel admin-item">
          <div class="admin-item-head">
            <a href="${K(e.url)}" target="_blank" rel="noopener noreferrer"><strong>${K(e.title)}</strong></a>
            <span class="nade-badge pending">${(e.reports||[]).length} report(s)</span>
          </div>
          <p class="hint">by ${K(e.authorName)}</p>
          <ul class="admin-reasons">${t}</ul>
          <div class="actions">
            <button class="btn btn-sm ghost" data-report-keep="${e.id}">Keep</button>
            <button class="btn btn-sm danger" data-report-delete="${e.id}">Delete highlight</button>
          </div>
        </article>`}).join(``):`<p class="hint">No open highlight reports.</p>`}function Ji(){let e=G.users||[];if(!e.length)return`<p class="hint">No users.</p>`;let t=Date.now(),n=we(W),r=e.map(e=>{let r=e.bannedUntil&&new Date(e.bannedUntil).getTime()>t,i=e.role===`owner`,a=i?`<span class="hint">owner</span>`:n?e.role===`admin`?`<button class="btn btn-sm ghost" type="button" data-role-set="${e.id}" data-role="user">Remove admin</button>`:`<button class="btn btn-sm primary" type="button" data-role-set="${e.id}" data-role="admin">Promote to admin</button>`:`<span class="hint">${K(e.role)}</span>`,o=i?``:r?`<button class="btn btn-sm" data-unban="${e.id}">Unban</button>`:`<input type="number" min="1" placeholder="hrs" class="admin-ban-hrs" data-ban-hrs="${e.id}" />
             <button class="btn btn-sm ghost" data-ban="${e.id}">Ban</button>
             <button class="btn btn-sm danger" data-ban-perma="${e.id}">Ban forever</button>`;return`
        <div class="admin-user">
          <div class="admin-user-main">
            <strong>${K(e.username)}</strong> <span class="nade-badge ${K(e.role)}">${K(e.role)}</span>
            ${r?`<span class="nade-badge rejected">banned</span>`:``}
            <div class="hint">${K(e.email||(e.steamId?`Steam account`:`no email`))} · joined ${new Date(e.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="admin-user-actions">
            ${a}
            ${o}
          </div>
        </div>`}).join(``);return`
    ${n?`<p class="hint">As owner you can promote users to admin or remove admin access. Ban controls are available to all admins.</p>`:`<p class="hint">Only the site owner can promote users to admin.</p>`}
    <div class="admin-users">${r}</div>`}function Yi(){return`
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
    </div>`}function Xi(){let e=G.contact||[];return e.length?e.map(e=>`
      <article class="panel admin-item">
        <div class="admin-item-head">
          <strong>${K(e.subject||`(no subject)`)}</strong>
          <span class="hint">${Hi(e.created_at)}</span>
        </div>
        <p class="hint">${K(e.name)} · <a href="mailto:${K(e.email)}">${K(e.email)}</a> · ${e.sent?`emailed`:`stored only`}</p>
        <p class="admin-message">${K(e.message)}</p>
        <div class="actions">
          <button class="btn btn-sm ghost danger" data-contact-delete="${e.id}">Delete</button>
        </div>
      </article>`).join(``):`<p class="hint">No contact messages.</p>`}function Zi(){let e=G.settings||{paypalUrl:``,steamTradeUrl:``};return`
    <div class="panel admin-item">
      <div class="admin-item-head"><strong>Donate links</strong><span class="panel-tag">Owner only</span></div>
      <p class="hint">Power the PayPal &amp; Steam buttons in the footer. Empty = hidden.</p>
      <label class="field"><span>PayPal link</span><input id="set-paypal" type="url" value="${K(e.paypalUrl)}" placeholder="https://www.paypal.com/paypalme/yourname" /></label>
      <label class="field"><span>Steam trade link</span><input id="set-steam" type="url" value="${K(e.steamTradeUrl)}" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." /></label>
      <div class="actions"><button class="btn primary" id="save-settings">Save donate links</button></div>
    </div>`}function Qi(){if(!we(W))return`<p class="hint">Owner only.</p>`;let e=G.logs||{total:0,logs:[]},t=G.logsFilter||``,n=e.logs||[],r=[[``,`All actions`],[`nade.approve`,`Nade approve`],[`nade.reject`,`Nade reject`],[`nade.bulk_approve`,`Nade bulk approve`],[`nade.bulk_reject`,`Nade bulk reject`],[`nade.delete`,`Nade delete (author)`],[`nade.admin_delete`,`Nade delete (admin)`],[`media.approve`,`Media approve`],[`media.reject`,`Media reject`],[`comment.approve`,`Comment approve`],[`comment.reject`,`Comment reject`],[`comment.delete`,`Comment delete`],[`media.delete`,`Media delete`],[`contact.delete`,`Contact delete`],[`highlight.keep`,`Highlight keep`],[`highlight.delete`,`Highlight delete`],[`user.role`,`User role`],[`user.ban`,`User ban`],[`user.unban`,`User unban`],[`commands.sync`,`Commands sync`],[`commands.import`,`Commands import`],[`pros.sync`,`Pros sync`],[`pros.import`,`Pros import`],[`settings.save`,`Settings save`]].map(([e,n])=>`<option value="${K(e)}" ${t===e?`selected`:``}>${K(n)}</option>`).join(``),i=n.length?n.map(e=>{let t=e.detail&&typeof e.detail==`object`?`<pre class="admin-log-detail">${K(JSON.stringify(e.detail,null,2))}</pre>`:e.detail?`<pre class="admin-log-detail">${K(String(e.detail))}</pre>`:``;return`
        <article class="panel admin-item admin-log">
          <div class="admin-item-head">
            <span class="nade-badge">${K(e.action)}</span>
            <strong>${K(e.summary||e.action)}</strong>
            <span class="hint">${Hi(e.createdAt)}</span>
          </div>
          <p class="hint">by ${K(e.actorName)} (${K(e.actorRole)})${e.entityType?` · ${K(e.entityType)}${e.entityId==null?``:` #${K(e.entityId)}`}`:``}</p>
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
    <div class="admin-logs">${i}</div>`}var $i={overview:Wi,nades:Gi,comments:Ki,reports:qi,users:Ji,sync:Yi,contact:Xi,logs:Qi,settings:Zi};async function ea(e){try{e===`overview`?await Ui():e===`nades`?G.nades=await _.admin.pending():e===`comments`?G.comments=await _.admin.pendingComments():e===`reports`?G.reports=await _.admin.highlightReports():e===`users`?G.users=await _.admin.users():e===`contact`?G.contact=await _.admin.contactMessages():e===`logs`?G.logs=await _.admin.ownerLogs({action:G.logsFilter||``}):e===`settings`&&(G.settings=await _.settings.get())}catch(e){Vi(e.message,`error`)}}function ta(){if(!U)return;if(!g(W)){U.innerHTML=`<div class="admin-shell"><div class="login-prompt">
      <p class="hint">This area is for admins only.</p>
      ${W?``:`<div class="actions"><button class="btn primary" data-open-auth="login">Log in</button></div>`}
    </div></div>`,U.querySelector(`[data-open-auth]`)?.addEventListener(`click`,()=>qe(`login`));return}(Li===`logs`||Li===`settings`)&&!we(W)&&(Li=`overview`);let e=Bi.filter(e=>!e.ownerOnly||we(W)).map(e=>`<button class="tool-tab ${Li===e.id?`active`:``}" data-section="${e.id}">${K(e.label)}${e.id===`nades`&&zi.nades?` (${zi.nades})`:``}${e.id===`comments`&&zi.comments?` (${zi.comments})`:``}${e.id===`reports`&&zi.reports?` (${zi.reports})`:``}</button>`).join(``),t=($i[Li]||Wi)();U.innerHTML=`
    <div class="admin-shell">
      <h2 class="admin-title">Admin</h2>
      <div class="admin-nav sort-tabs">${e}</div>
      <div class="admin-body">${t}</div>
      <div id="admin-status" class="status ${Ri.kind}">${K(Ri.text)}</div>
    </div>`,ra()}async function na(e){(e===`logs`||e===`settings`)&&(we(W)||(e=`overview`)),Li=e,ta(),await ea(e),ta()}function ra(){U.querySelectorAll(`[data-section]`).forEach(e=>e.addEventListener(`click`,()=>na(e.dataset.section))),U.querySelectorAll(`[data-goto]`).forEach(e=>e.addEventListener(`click`,()=>na(e.dataset.goto)));let e=async(e,t)=>{try{await e(),t&&Vi(t,`ok`)}catch(e){Vi(e.message,`error`)}},t=async()=>{await ea(Li),await Ui(),ta()};U.querySelectorAll(`[data-nade-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewNade(n.dataset.nadeApprove,`approved`),await t()},`Nade approved.`))),U.querySelectorAll(`[data-nade-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewNade(n.dataset.nadeReject,`rejected`),await t()},`Nade rejected.`))),U.querySelectorAll(`[data-nade-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Permanently delete this nade and its media?`)&&e(async()=>{await _.nades.remove(n.dataset.nadeDelete),await t()},`Nade deleted.`)})),U.querySelectorAll(`[data-media-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewMedia(n.dataset.mediaApprove,`approved`),await t()},`Media approved.`))),U.querySelectorAll(`[data-media-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewMedia(n.dataset.mediaReject,`rejected`),await t()},`Media rejected.`))),U.querySelectorAll(`[data-media-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Permanently remove this media?`)&&e(async()=>{await _.admin.removeMedia(n.dataset.mediaDelete),await t()},`Media removed.`)}));let n=U.querySelector(`#admin-nade-select-all`),r=U.querySelector(`#admin-nade-bulk-approve`),i=U.querySelector(`#admin-nade-bulk-reject`),a=()=>{let e=U.querySelectorAll(`.admin-nade-check:checked`).length;r&&(r.disabled=e===0),i&&(i.disabled=e===0)};n?.addEventListener(`change`,()=>{U.querySelectorAll(`.admin-nade-check`).forEach(e=>{e.checked=n.checked}),a()}),U.querySelectorAll(`.admin-nade-check`).forEach(e=>e.addEventListener(`change`,a));let o=async n=>{let r=[...U.querySelectorAll(`.admin-nade-check:checked`)].map(e=>Number(e.value));r.length&&await e(async()=>{let e=await _.admin.reviewNadesBulk(r,n);await t(),Vi(`${n===`approved`?`Approved`:`Rejected`} ${e.updated} nade${e.updated===1?``:`s`}.`,`ok`)})};r?.addEventListener(`click`,()=>o(`approved`)),i?.addEventListener(`click`,()=>o(`rejected`)),U.querySelectorAll(`[data-comment-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewComment(n.dataset.commentApprove,`approved`),await t()},`Comment approved.`))),U.querySelectorAll(`[data-comment-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewComment(n.dataset.commentReject,`rejected`),await t()},`Comment rejected.`))),U.querySelectorAll(`[data-comment-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Permanently delete this comment?`)&&e(async()=>{await _.admin.removeComment(n.dataset.commentDelete),await t()},`Comment deleted.`)})),U.querySelectorAll(`[data-report-keep]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewHighlight(n.dataset.reportKeep,`keep`),await t()},`Kept highlight.`))),U.querySelectorAll(`[data-report-delete]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewHighlight(n.dataset.reportDelete,`delete`),await t()},`Highlight deleted.`))),U.querySelectorAll(`[data-role-set]`).forEach(n=>n.addEventListener(`click`,()=>{let r=n.dataset.role;e(async()=>{await _.admin.setRole(n.dataset.roleSet,r),await t()},r===`admin`?`Promoted to admin.`:`Admin access removed.`)})),U.querySelectorAll(`[data-unban]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.unbanUser(n.dataset.unban),await t()},`User unbanned.`))),U.querySelectorAll(`[data-ban]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{let e=Number(U.querySelector(`[data-ban-hrs="${n.dataset.ban}"]`)?.value);if(!Number.isFinite(e)||e<=0)return Vi(`Enter a positive number of hours.`,`error`);await _.admin.banUser(n.dataset.ban,{hours:e}),await t(),Vi(`User banned.`,`ok`)}))),U.querySelectorAll(`[data-ban-perma]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.banUser(n.dataset.banPerma,{permanent:!0}),await t()},`User banned permanently.`))),U.querySelector(`#sync-commands`)?.addEventListener(`click`,()=>e(async()=>{let e=await _.admin.syncCommands();Vi(e.synced?`Commands synced (${e.count}).`:`No sync: ${e.reason||`no source`}.`,e.synced?`ok`:`error`)})),U.querySelector(`#check-cs2`)?.addEventListener(`click`,()=>e(async()=>{let e=await _.admin.checkCommandsCs2();Vi(`CS2 build: ${e.build||`unknown`}${e.changed?` (changed → re-synced)`:``}.`,`ok`)})),U.querySelector(`#sync-pros`)?.addEventListener(`click`,()=>e(async()=>{let e=await _.admin.syncPros();Vi(e.synced?`Synced ${e.count} pros from ${e.source}.`:`Sync failed: ${e.reason}.`,e.synced?`ok`:`error`)})),U.querySelector(`#import-commands`)?.addEventListener(`click`,()=>zn({title:`Import commands`,description:`Paste the CS2 console-commands wiki page (wikitext) or a JSON array of commands.`,sourceUrl:`https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_command_variables`,sourceLabel:`Open wiki`,onImport:async e=>`Imported ${(await _.admin.importCommands(e)).count} commands.`})),U.querySelector(`#import-pros`)?.addEventListener(`click`,()=>zn({title:`Import pro settings from HLTV`,description:`Open HLTV, complete the check, then paste a JSON list of players.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,onImport:async e=>{let t=await _.admin.importPros(e);return await ea(`sync`),`Imported ${t.count} players.`}})),U.querySelectorAll(`[data-contact-delete]`).forEach(n=>n.addEventListener(`click`,()=>{confirm(`Delete this contact message?`)&&e(async()=>{await _.admin.removeContact(n.dataset.contactDelete),await t()},`Message deleted.`)})),U.querySelector(`#save-settings`)?.addEventListener(`click`,()=>e(async()=>{let e=U.querySelector(`#set-paypal`)?.value||``,t=U.querySelector(`#set-steam`)?.value||``;G.settings=await _.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))},`Donate links saved.`)),U.querySelector(`#owner-logs-filter`)?.addEventListener(`change`,t=>{G.logsFilter=t.target.value||``,e(async()=>{await ea(`logs`),ta()})}),U.querySelector(`#owner-logs-refresh`)?.addEventListener(`click`,()=>e(async()=>{await ea(`logs`),ta()},`Logs refreshed.`))}function ia(e){document.querySelectorAll(`.admin-only`).forEach(t=>t.classList.toggle(`hidden`,!g(e)))}async function aa(){U=document.querySelector(`#admin-tool`),U&&(W=ke(),ia(W),Ae(async e=>{let t=g(W);W=e,ia(e),g(e)&&!t&&await Ui(),ta()}),ta(),g(W)&&(await Ui(),ta()))}function oa(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function sa(){let e=ke(),t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact us">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Contact us</h2>
      <p class="hint">Send us a message and we'll get back to you at your email.</p>
      <form id="contact-form" class="auth-form-modal">
        <label class="field"><span>Your name</span><input id="contact-name" type="text" value="${oa(e?.username||``)}" /></label>
        <label class="field"><span>Your email</span><input id="contact-email" type="email" value="${oa(e?.email||``)}" /></label>
        <label class="field"><span>Subject</span><input id="contact-subject" type="text" placeholder="What's this about?" /></label>
        <label class="field"><span>Message</span><textarea id="contact-message" rows="5" placeholder="How can we help?"></textarea></label>
        <button class="btn primary" type="submit">Send message</button>
        <p class="status" id="contact-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#contact-status`);t.querySelector(`#contact-form`).addEventListener(`submit`,async e=>{e.preventDefault();let i={name:t.querySelector(`#contact-name`).value,email:t.querySelector(`#contact-email`).value,subject:t.querySelector(`#contact-subject`).value,message:t.querySelector(`#contact-message`).value};r.textContent=`Sending…`,r.className=`status`;try{await _.contact.send(i),r.textContent=`Thanks! Your message has been sent.`,r.className=`status ok`,setTimeout(n,1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#contact-name`)?.focus()}var ca={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]};function la(e){if(e.color===5)return`rgb(${e.red}, ${e.green}, ${e.blue})`;let t=ca[e.color]??ca[1];return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}function ua(e){return e.alphaEnabled?Math.min(1,Math.max(0,e.alpha/255)):1}function da(e,t){return Number(e)*(Number(t)/480)}function fa(e){let t=Number(e);if(!Number.isFinite(t))return 0;let n=Math.abs(t-Math.trunc(t)),r=Math.round(n*1e3)/1e3;return r>.5?t>=0?Math.ceil(t):Math.floor(t):r===.5?t>=0?Math.floor(t-.1):Math.ceil(t+.1):t>=0?Math.floor(t):Math.ceil(t)}function pa(e){let t=Number(e);return t>=0?Math.floor(t+.5):Math.ceil(t-.5)}function ma(e,t=1080){let n=Number(t)||1080,r=Math.max(0,fa(da(e.length,n))),i=Math.max(1,fa(da(e.thickness,n)));return{length:r,thickness:i,gapInner:2*(4+pa(e.gap))+i,outline:e.outlineEnabled?Math.max(1,fa(da(e.outline,n))):0,resHeight:n}}function ha(e,t,n=1080){let r=e.getContext(`2d`);if(!r)return;let i=e.width,a=i/2,o=i/2;r.clearRect(0,0,i,i);let s=r.createLinearGradient(0,0,i,i);s.addColorStop(0,`#3a4a38`),s.addColorStop(.45,`#5c6b52`),s.addColorStop(1,`#2a3328`),r.fillStyle=s,r.fillRect(0,0,i,i);let c=Math.max(24,Math.round(i/9));r.strokeStyle=`rgba(255,255,255,0.06)`,r.lineWidth=Math.max(1,Math.round(i/280));for(let e=0;e<i;e+=c)r.beginPath(),r.moveTo(e,0),r.lineTo(e,i),r.stroke(),r.beginPath(),r.moveTo(0,e),r.lineTo(i,e),r.stroke();if(!t){r.globalAlpha=.35,r.fillStyle=`#fff`,r.font=`${Math.round(i*.05)}px Outfit, sans-serif`,r.textAlign=`center`,r.fillText(`Enter a code or commands`,a,o+i*.02),r.globalAlpha=1;return}let l=typeof n==`object`&&n?Number(n.resHeight)||1080:Math.round((Number(n)||1)*1080),u=la(t),d=ua(t),{length:f,thickness:p,gapInner:m,outline:ee}=ma(t,l),te=Math.round(a),ne=Math.round(o),re=Math.floor(p/2),ie=m/2,ae=(e,t,n,i)=>{n<=0||i<=0||(ee>0&&(r.globalAlpha=d,r.fillStyle=`#000`,r.fillRect(e-ee,t-ee,n+ee*2,i+ee*2)),r.globalAlpha=d,r.fillStyle=u,r.fillRect(e,t,n,i))};if(f>0&&(ae(te+ie,ne-re,f,p),ae(te-ie-f,ne-re,f,p),ae(te-re,ne+ie,p,f),t.tStyleEnabled||ae(te-re,ne-ie-f,p,f)),t.centerDotEnabled){let e=p;ae(te-Math.floor(e/2),ne-Math.floor(e/2),e,e)}r.globalAlpha=1,(t.style===2||t.style===3)&&(r.globalAlpha=.6,r.fillStyle=`#fff`,r.font=`${Math.round(i*.039)}px JetBrains Mono, monospace`,r.textAlign=`center`,r.fillText(`style ${t.style} · dynamic (shown static)`,a,i-Math.round(i*.05)),r.globalAlpha=1)}var q=132;function ga({source:e,stage:t,toggleBtn:n,zoomSelect:r}){let i=document.createElement(`canvas`);i.className=`magnifier-lens hidden`,i.width=q,i.height=q,t.appendChild(i);let a=i.getContext(`2d`),o=!1,s=Number(r?.value)||4,c=null;function l(e){o=e,n.classList.toggle(`active`,e),n.setAttribute(`aria-pressed`,String(e)),t.classList.toggle(`magnifier-on`,e),e||(i.classList.add(`hidden`),c=null)}function u(){if(!o||!c||!a)return;let t=q/s;a.imageSmoothingEnabled=!1,a.clearRect(0,0,q,q),a.fillStyle=`#0e1017`,a.fillRect(0,0,q,q);try{a.drawImage(e,c.sx-t/2,c.sy-t/2,t,t,0,0,q,q)}catch{}a.strokeStyle=`rgba(255,255,255,0.28)`,a.lineWidth=1,a.beginPath(),a.moveTo(66.5,0),a.lineTo(66.5,q),a.moveTo(0,66.5),a.lineTo(q,66.5),a.stroke()}function d(n,r){if(!o)return;let a=e.getBoundingClientRect(),s=n-a.left,l=r-a.top;if(s<0||l<0||s>a.width||l>a.height){i.classList.add(`hidden`);return}c={sx:s*(e.width/a.width),sy:l*(e.height/a.height)};let d=t.getBoundingClientRect();i.style.left=`${n-d.left-q/2}px`,i.style.top=`${r-d.top-q/2}px`,i.classList.remove(`hidden`),u()}e.addEventListener(`mousemove`,e=>d(e.clientX,e.clientY)),e.addEventListener(`mouseleave`,()=>{o&&i.classList.add(`hidden`)});let f=e=>{!o||!e.touches[0]||(e.preventDefault(),d(e.touches[0].clientX,e.touches[0].clientY))};return e.addEventListener(`touchstart`,f,{passive:!1}),e.addEventListener(`touchmove`,f,{passive:!1}),n.addEventListener(`click`,()=>l(!o)),r&&r.addEventListener(`change`,()=>{s=Number(r.value)||4,u()}),{refresh:u,setEnabled:l}}var _a={cs2:{id:`cs2`,name:`Counter-Strike 2`,yaw:.022,supportsMYaw:!0},csgo:{id:`csgo`,name:`CS:GO`,yaw:.022},valorant:{id:`valorant`,name:`Valorant`,yaw:.07},apex:{id:`apex`,name:`Apex Legends`,yaw:.022},overwatch2:{id:`overwatch2`,name:`Overwatch 2`,yaw:.0066},r6:{id:`r6`,name:`Rainbow Six Siege`,yaw:.00572958},fortnite:{id:`fortnite`,name:`Fortnite`,yaw:.005555},cod:{id:`cod`,name:`Call of Duty`,yaw:.0066},tf2:{id:`tf2`,name:`Team Fortress 2`,yaw:.022},marvel:{id:`marvel`,name:`Marvel Rivals`,yaw:.022},deadlock:{id:`deadlock`,name:`Deadlock`,yaw:.044},tf:{id:`tf`,name:`The Finals`,yaw:.0066},custom:{id:`custom`,name:`Custom (yaw)`,yaw:.022,custom:!0}},va=Object.values(_a);function ya(e,t=.022,n){let r=_a[e];if(!r)throw Error(`Unknown game: ${e}`);return r.custom?Number(n)>0?Number(n):r.yaw:r.supportsMYaw?t:r.yaw}function ba(e,t,n){return e<=0||t<=0||n<=0?NaN:914.4/(e*t*n)}function xa({sourceGame:e,targetGame:t,sourceSens:n,sourceDpi:r,targetDpi:i,sourceMYaw:a=.022,targetMYaw:o=.022,sourceCustomYaw:s,targetCustomYaw:c}){let l=ya(e,a,s),u=ya(t,o,c),d=r/i*n*(l/u),f=ba(n,r,l),p=ba(d,i,u);return{targetSensitivity:d,cm360:f,inches360:f/2.54,sourceEdpi:n*r,targetEdpi:d*i,sourceYaw:l,targetYaw:u,targetCm360:p,ratio:l/u}}function J(e,t=4){return Number.isFinite(e)?String(Number(e.toFixed(t))):`—`}function Sa(e,t=1){return Number.isFinite(e)?e.toFixed(t):`—`}function Ca(e){return va.map(t=>`<option value="${t.id}"${t.id===e?` selected`:``}>${t.name}</option>`).join(``)}var wa=/^CSGO(-[\w]{5}){5}$/i,Ta=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.1 7.3c.3 2-.3 3.6-1.5 4.8-1.2 1.2-3 1.8-5.2 1.8h-1.1c-.4 0-.8.3-.9.8l-.7 4.5-.2 1.1c0 .3-.3.5-.6.5H6.2c-.3 0-.5-.3-.4-.6L8 6.1c.1-.6.6-1 1.2-1h5.3c2.7 0 4.7.9 5.3 2.9.1.4.2.9.3 1.3z"/><path fill="currentColor" opacity=".55" d="M8.9 9.3c.1-.6.6-1 1.2-1h4.2c.6 0 1.1.1 1.6.2-.3-1.6-1.7-2.4-3.9-2.4H6.8c-.4 0-.8.3-.9.8L3.5 21c0 .3.2.6.5.6h3.1l1.8-12.3z"/></svg>`,Ea=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Zm-1.87-2.51a1.88 1.88 0 1 0 3.76 0 1.88 1.88 0 0 0-3.76 0Z"/></svg>`,Da=document.querySelector(`#app`);Da.innerHTML=`
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
`;var Oa=document.querySelector(`#preview-canvas`),ka=document.querySelector(`#preview-stats`),Aa=document.querySelector(`#preview-res`),ja=document.querySelector(`#preview-res-scale`);Oa.width=280,Oa.height=280,Oa.style.imageRendering=`pixelated`;var Ma=[{id:`1920x1080`,h:1080,label:`1920 × 1080 (16:9)`},{id:`2560x1440`,h:1440,label:`2560 × 1440 (16:9)`},{id:`3840x2160`,h:2160,label:`3840 × 2160 (4K)`},{id:`1600x900`,h:900,label:`1600 × 900 (16:9)`},{id:`1366x768`,h:768,label:`1366 × 768 (16:9)`},{id:`1280x960`,h:960,label:`1280 × 960 (4:3)`},{id:`1024x768`,h:768,label:`1024 × 768 (4:3)`},{id:`1280x1024`,h:1024,label:`1280 × 1024 (5:4)`}],Na=null;function Pa(){return(Ma.find(e=>e.id===Aa?.value)||Ma[0]).h}var Fa=ga({source:Oa,stage:document.querySelector(`.preview-stage`),toggleBtn:document.querySelector(`#magnifier-toggle`),zoomSelect:document.querySelector(`#magnifier-zoom`)});function Ia(e){if(Na=e,ha(Oa,e,{resHeight:Pa()}),ja)if(e){let t=Ma.find(e=>e.id===Aa?.value)||Ma[0],n=ma(e,t.h);ja.textContent=`≈ ${n.length}px arms · ${n.thickness}px thick @ ${t.h}p`}else ja.textContent=``;Fa.refresh()}var Y=document.querySelector(`#crosshair-status`),La=document.querySelector(`#sensitivity-status`),Ra=document.querySelector(`#sharecode-input`),za=document.querySelector(`#commands-output`),Ba=document.querySelector(`#commands-input`),Va=document.querySelector(`#sharecode-output`),Ha=document.querySelector(`#sens-from-game`),X=document.querySelector(`#sens-to-game`),Ua=document.querySelector(`#sens-source`),Wa=document.querySelector(`#sens-target`),Ga=document.querySelector(`#sens-source-dpi`),Ka=document.querySelector(`#sens-target-dpi`),qa=document.querySelector(`#sens-source-myaw`),Ja=document.querySelector(`#sens-target-myaw`),Ya=document.querySelector(`#sens-source-yaw`),Xa=document.querySelector(`#sens-target-yaw`),Za=document.querySelector(`#source-yaw-field`),Qa=document.querySelector(`#target-yaw-field`),$a=document.querySelector(`#m-yaw-fields`),eo=document.querySelector(`#sens-cm360`),to=document.querySelector(`#sens-stats`),no=document.querySelector(`#sens-formula`),ro=`CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK`,io=`cl_crosshairstyle 4
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
cl_crosshair_recoil 0`;function Z(e,t,n=``){e&&(e.textContent=t,e.className=`status${n?` ${n}`:``}`)}function ao(e){Ia(e),ka.innerHTML=`
    <div><dt>Style</dt><dd>${e.style}</dd></div>
    <div><dt>Size</dt><dd>${e.length}</dd></div>
    <div><dt>Gap</dt><dd>${e.gap}</dd></div>
    <div><dt>Thickness</dt><dd>${e.thickness}</dd></div>
    <div><dt>Dot</dt><dd>${e.centerDotEnabled?`On`:`Off`}</dd></div>
    <div><dt>Outline</dt><dd>${e.outlineEnabled?e.outline:`Off`}</dd></div>
    <div><dt>Color</dt><dd>${e.color===5?`RGB ${e.red}/${e.green}/${e.blue}`:`Preset ${e.color}`}</dd></div>
    <div><dt>Alpha</dt><dd>${e.alphaEnabled?e.alpha:`Off`}</dd></div>
  `}function oo(e){return e.trim().replace(/\s+/g,``).replace(/^csgo/i,`CSGO`)}function so(){let e=Ra.value.trim();if(!e){Z(Y,`Paste a crosshair share code first.`,`error`);return}let t=oo(e);if(!wa.test(t)){Z(Y,`Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`,`error`);return}try{let e=d(t);Ra.value=t,za.value=se(p(e)),ao(e),Z(Y,`Converted share code to console commands.`,`ok`)}catch(e){e instanceof i||e instanceof r?Z(Y,`That share code is not a valid crosshair code.`,`error`):Z(Y,e instanceof Error?e.message:`Failed to decode share code.`,`error`)}}function co(){let e=Ba.value.trim();if(!e){Z(Y,`Paste crosshair console commands first.`,`error`);return}try{let t=oe(e);Va.value=f(t),ao(t),Z(Y,`Converted commands to share code.`,`ok`)}catch(e){Z(Y,e instanceof Error?e.message:`Failed to encode share code.`,`error`)}}async function lo(e,t,n){if(!t){Z(e,`Nothing to copy for ${n}.`,`error`);return}try{await navigator.clipboard.writeText(t),Z(e,`Copied ${n} to clipboard.`,`ok`)}catch{Z(e,`Clipboard access failed. Select and copy manually.`,`error`)}}function uo(){let e=_a[Ha.value]?.supportsMYaw||_a[X.value]?.supportsMYaw;$a?.classList.toggle(`hidden`,!e),Za?.classList.toggle(`hidden`,!_a[Ha.value]?.custom),Qa?.classList.toggle(`hidden`,!_a[X.value]?.custom)}function fo(){let e=Number(Ua.value),t=Number(Ga.value),n=Number(Ka.value),r=Number(qa.value)||.022,i=Number(Ja.value)||.022,a=Number(Ya.value),o=Number(Xa.value);if(uo(),_a[Ha.value]?.custom&&!(a>0)){Z(La,`Enter a valid source custom yaw (° per count).`,`error`);return}if(_a[X.value]?.custom&&!(o>0)){Z(La,`Enter a valid target custom yaw (° per count).`,`error`);return}if(!Number.isFinite(e)||e<=0){Wa.value=``,eo.textContent=`—`,to.innerHTML=``,no.textContent=``;return}if(!Number.isFinite(t)||t<=0||!Number.isFinite(n)||n<=0){Z(La,`Enter valid DPI values.`,`error`);return}let s=xa({sourceGame:Ha.value,targetGame:X.value,sourceSens:e,sourceDpi:t,targetDpi:n,sourceMYaw:r,targetMYaw:i,sourceCustomYaw:a,targetCustomYaw:o}),c=_a[Ha.value].name,l=_a[X.value].name,u=J(s.targetSensitivity);Wa.value=u,eo.textContent=Sa(s.cm360),to.innerHTML=`
    <div><dt>Inches / 360°</dt><dd>${Sa(s.inches360)} in</dd></div>
    <div><dt>Source eDPI</dt><dd>${Sa(s.sourceEdpi,0)}</dd></div>
    <div><dt>Target eDPI</dt><dd>${Sa(s.targetEdpi,0)}</dd></div>
    <div><dt>Source yaw</dt><dd>${s.sourceYaw}</dd></div>
    <div><dt>Target yaw</dt><dd>${s.targetYaw}</dd></div>
    <div><dt>Multiplier</dt><dd>× ${J(s.ratio,5)}</dd></div>
  `,no.innerHTML=`
    <strong>Formula:</strong>
    target = source × (source DPI ÷ target DPI) × (source yaw ÷ target yaw)<br />
    ${u} = ${e} × (${t} ÷ ${n}) × (${s.sourceYaw} ÷ ${s.targetYaw})
  `,Z(La,`${c} → ${l}: ${u}`,`ok`)}function po(){let e=Ha.value;Ha.value=X.value,X.value=e,Wa.value&&(Ua.value=Wa.value),fo()}function mo(){Ha.value=`cs2`,X.value=`valorant`,Ua.value=`1.25`,Ga.value=`800`,Ka.value=`800`,fo()}var ho={crosshair:`Convert a crosshair share code into console commands, build a code from commands, or design one visually with a live preview.`,sensitivity:`Keep the same cm/360 aim feel across games — with custom yaw values and DPI changes handled for you.`,psa:`Start from your pad 360° sens (full mousepad swipe = one turn), then narrow it with a guided 7-round A/B test.`,nades:`Browse community grenade line-ups, or sign in to submit your own with a 2D throw guide, videos and photos.`,commands:`Copy up-to-date CS2 launch options and console commands, recommend the ones that help, and share tips in the comments.`,configs:`Share your CS2 configs and video settings, download other players’ setups, and rate the best ones.`,highlights:`Share your best CS2 clips, watch the community’s highlights, and report anything that breaks the rules.`,pros:`Browse pro players’ sensitivity, DPI, resolution and crosshair settings.`,profile:`Your account, contributions, and settings.`,admin:`Moderate content, manage users, sync data sources, and read contact messages.`},go=document.querySelector(`#tool-desc`);function _o(e){go&&(go.textContent=ho[e]||``)}function vo(e){document.querySelectorAll(`.tool-nav .tool-tab`).forEach(t=>{let n=t.getAttribute(`data-tool`)===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.tool-view`).forEach(t=>{t.classList.toggle(`active`,t.id===`${e}-tool`)}),_o(e),window.scrollTo({top:0,behavior:`smooth`})}document.querySelectorAll(`.tool-nav .tool-tab`).forEach(e=>{e.addEventListener(`click`,()=>vo(e.getAttribute(`data-tool`)))}),document.addEventListener(`aimkit:navigate`,e=>vo(e.detail)),_o(`crosshair`),document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{let n=e.getAttribute(`data-tab`)===t;e.classList.toggle(`active`,n),e.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.converter-panel .tab-panel`).forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-panel`)===t)})})}),document.querySelector(`#decode-btn`)?.addEventListener(`click`,so),document.querySelector(`#encode-btn`)?.addEventListener(`click`,co),Ra.addEventListener(`keydown`,e=>{e.key===`Enter`&&so()}),Ba.addEventListener(`input`,()=>{let e=Ba.value.trim();if(!e){Ia(null),ka.innerHTML=``;return}try{ao(oe(e))}catch{}}),Ra.addEventListener(`input`,()=>{let e=oo(Ra.value);if(wa.test(e))try{ao(d(e))}catch{}}),document.querySelector(`#copy-commands`)?.addEventListener(`click`,()=>{lo(Y,za.value,`commands`)}),document.querySelector(`#copy-code`)?.addEventListener(`click`,()=>{lo(Y,Va.value,`share code`)}),document.querySelector(`#copy-sharecode-cmd`)?.addEventListener(`click`,()=>{let e=oo(Ra.value);if(!e){Z(Y,`Enter a share code first.`,`error`);return}lo(Y,`cl_crosshair_sharecode "${e}"`,`import command`)}),document.querySelector(`#load-example-code`)?.addEventListener(`click`,()=>{Ra.value=ro,so()}),document.querySelector(`#load-example-cmd`)?.addEventListener(`click`,()=>{Ba.value=io,co()});var yo={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]},Q={...te},bo=document.querySelector(`#ed-style`),xo=document.querySelector(`#ed-color`),So=document.querySelector(`#ed-custom-color`),Co=document.querySelector(`#ed-custom-color-field`),wo=document.querySelector(`#ed-r`),To=document.querySelector(`#ed-g`),Eo=document.querySelector(`#ed-b`),Do=document.querySelector(`#ed-rgb-val`),Oo=document.querySelector(`#ed-color-swatch`);function ko(e,t){e&&document.activeElement!==e&&(e.value=String(t))}var Ao=document.querySelector(`#ed-length`),jo=document.querySelector(`#ed-thickness`),Mo=document.querySelector(`#ed-gap`),No=document.querySelector(`#ed-outline`),Po=document.querySelector(`#ed-alpha`),Fo=document.querySelector(`#ed-dot`),Io=document.querySelector(`#ed-tstyle`),Lo=document.querySelector(`#ed-outline-on`),Ro=document.querySelector(`#ed-alpha-on`),zo=document.querySelector(`#ed-sharecode`),Bo=document.querySelector(`#ed-commands`),Vo=document.querySelector(`#ed-length-num`),Ho=document.querySelector(`#ed-thickness-num`),Uo=document.querySelector(`#ed-gap-num`),Wo=document.querySelector(`#ed-outline-num`),Go=document.querySelector(`#ed-alpha-num`),Ko=document.querySelector(`#ed-r-num`),qo=document.querySelector(`#ed-g-num`),Jo=document.querySelector(`#ed-b-num`),Yo=(e,t,n)=>Math.max(t,Math.min(n,e)),Xo=[{key:`length`,slider:Ao,num:Vo,min:0,max:15},{key:`thickness`,slider:jo,num:Ho,min:0,max:6},{key:`gap`,slider:Mo,num:Uo,min:-10,max:10},{key:`outline`,slider:No,num:Wo,min:0,max:3},{key:`alpha`,slider:Po,num:Go,min:0,max:255}],Zo=[{key:`red`,slider:wo,num:Ko},{key:`green`,slider:To,num:qo},{key:`blue`,slider:Eo,num:Jo}];function Qo(e,t,n){let r=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,`0`);return`#${r(e)}${r(t)}${r(n)}`}function $o(e){let t=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(e.trim());return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:{r:Q.red,g:Q.green,b:Q.blue}}function es(){let e=Qo(Q.red,Q.green,Q.blue);xo.value=String(Q.color),ko(So,e);for(let e of Zo)ko(e.slider,Q[e.key]),ko(e.num,Q[e.key]);Do&&(Do.textContent=`${Q.red}, ${Q.green}, ${Q.blue}`),Oo&&(Oo.style.background=e),Co?.classList.toggle(`hidden`,Q.color!==5)}function ts(){for(let e of Xo)ko(e.slider,Yo(Q[e.key],e.min,e.max)),ko(e.num,Q[e.key])}function ns(){bo.value=String(Q.style),Fo.checked=Q.centerDotEnabled,Io.checked=Q.tStyleEnabled,Lo.checked=Q.outlineEnabled,Ro.checked=Q.alphaEnabled,ts(),es()}function rs(){ts();let e=!Q.outlineEnabled;No.disabled=e,Wo.disabled=e;let t=!Q.alphaEnabled;Po.disabled=t,Go.disabled=t;try{ko(zo,f(Q))}catch{ko(zo,``)}ko(Bo,se(p(Q)))}function is(){ao(Q),rs()}function as(e,t){Object.assign(Q,te,e),ns(),is(),t&&Z(Y,t,`ok`)}function os(){let e=zo.value.trim();if(!e){Z(Y,`Paste a crosshair share code first.`,`error`);return}let t=oo(e);if(!t){Z(Y,`Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`,`error`);return}try{as(d(t),`Loaded share code into the editor.`)}catch(e){e instanceof i||e instanceof r?Z(Y,`That share code is not a valid crosshair code.`,`error`):Z(Y,e instanceof Error?e.message:`Failed to decode share code.`,`error`)}}function ss(){let e=Bo.value.trim();if(!e){Z(Y,`Paste crosshair console commands first.`,`error`);return}try{as(oe(e),`Applied commands to the editor.`)}catch(e){Z(Y,e instanceof Error?e.message:`Failed to parse commands.`,`error`)}}function cs(){Q.style=Number(bo.value),Q.centerDotEnabled=Fo.checked,Q.tStyleEnabled=Io.checked,Q.outlineEnabled=Lo.checked,Q.alphaEnabled=Ro.checked,is()}function ls(e){Q[e.key]=Number(e.slider.value),is()}function us(e,t){let n=Number(e.num.value);if(e.num.value===``||!Number.isFinite(n)){t&&(e.num.value=String(Q[e.key]));return}Q[e.key]=Yo(n,e.min,e.max),t&&(e.num.value=String(Q[e.key])),is()}function ds(){Q.color=5,Q.red=Yo(Number(Ko.value)||0,0,255),Q.green=Yo(Number(qo.value)||0,0,255),Q.blue=Yo(Number(Jo.value)||0,0,255),es(),is()}function fs(){if(Q.color=Number(xo.value),Q.color!==5){let[e,t,n]=yo[Q.color]??yo[1];Q.red=e,Q.green=t,Q.blue=n}es(),is()}function ps(){Q.color=5,Q.red=Number(wo.value),Q.green=Number(To.value),Q.blue=Number(Eo.value),es(),is()}function ms(){Q.color=5;let{r:e,g:t,b:n}=$o(So.value);Q.red=e,Q.green=t,Q.blue=n,es(),is()}Xo.forEach(e=>{e.slider.addEventListener(`input`,()=>ls(e)),e.num.addEventListener(`input`,()=>us(e,!1)),e.num.addEventListener(`change`,()=>us(e,!0))}),[bo,Fo,Io,Lo,Ro].forEach(e=>e.addEventListener(`change`,cs)),xo.addEventListener(`change`,fs),So.addEventListener(`input`,ms),So.addEventListener(`change`,ms),Zo.forEach(e=>{e.slider.addEventListener(`input`,ps),e.num.addEventListener(`input`,ds),e.num.addEventListener(`change`,ds)}),document.querySelector(`#ed-apply-code`)?.addEventListener(`click`,os),document.querySelector(`#ed-apply-commands`)?.addEventListener(`click`,ss),zo?.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),os())}),document.querySelector(`#ed-copy-code`)?.addEventListener(`click`,()=>{lo(Y,zo.value,`share code`)}),document.querySelector(`#ed-copy-commands`)?.addEventListener(`click`,()=>{lo(Y,Bo.value,`commands`)}),document.querySelector(`#ed-reset`)?.addEventListener(`click`,()=>{Object.assign(Q,te),ns(),is(),Z(Y,`Crosshair reset to defaults.`,`ok`)}),document.querySelector(`.converter-panel .tab[data-tab="visual"]`)?.addEventListener(`click`,is),ns(),rs(),Ha.innerHTML=Ca(`cs2`),X.innerHTML=Ca(`valorant`),[Ha,X,Ua,Ga,Ka,qa,Ja,Ya,Xa].forEach(e=>{e.addEventListener(`input`,fo),e.addEventListener(`change`,fo)}),document.querySelector(`#sens-swap`)?.addEventListener(`click`,po),document.querySelector(`#copy-sens`)?.addEventListener(`click`,()=>{lo(La,Wa.value,`converted sensitivity`)}),document.querySelector(`#sens-cs2-val`)?.addEventListener(`click`,mo);var hs=document.querySelector(`#psa-start`),gs=document.querySelector(`#psa-begin`),_s=document.querySelector(`#psa-round`),vs=document.querySelector(`#psa-round-num`),ys=document.querySelector(`#psa-bar-fill`),bs=document.querySelector(`#psa-lower`),xs=document.querySelector(`#psa-higher`),Ss=document.querySelector(`#psa-lower-val`),Cs=document.querySelector(`#psa-higher-val`),ws=document.querySelector(`#psa-undo`),Ts=document.querySelector(`#psa-reset`),Es=document.querySelector(`#psa-result`),Ds=document.querySelector(`#psa-result-label`),Os=document.querySelector(`#psa-stats`),ks=document.querySelector(`#psa-history`),As=document.querySelector(`#psa-status`),$=null;function js(){if(!$){_s?.classList.add(`hidden`),ks?.classList.add(`hidden`),Es.textContent=`—`,Ds.textContent=`recommended sensitivity`,Os.innerHTML=``;return}let e=de($),t=e?ge($):fe($);if(Es.textContent=J(t,3),Ds.textContent=e?`final recommended sensitivity`:`current estimate`,Os.innerHTML=`
    <div><dt>Range low</dt><dd>${J($.lo,3)}</dd></div>
    <div><dt>Range high</dt><dd>${J($.hi,3)}</dd></div>
    <div><dt>Spread</dt><dd>± ${J(pe($)/2*100,1)}%</dd></div>
    <div><dt>Pad 360° base</dt><dd>${J($.base,3)}</dd></div>
  `,e)_s?.classList.add(`hidden`),Z(As,`Done — set your sensitivity to ${J(t,3)} and play a few sessions before changing again.`,`ok`);else{let{lower:e,higher:t}=ue($);_s?.classList.remove(`hidden`),vs.textContent=String($.round),ys.style.width=`${($.round-1)/7*100}%`,Ss.textContent=J(e,3),Cs.textContent=J(t,3),Z(As,`Round ${$.round} of 7: test both values, then pick the side that feels better.`,``)}$.choices.length>0?(ks?.classList.remove(`hidden`),ks.innerHTML=`<strong>History:</strong><br />${$.choices.map(e=>`Round ${e.round}: chose <strong>${e.side}</strong> (${J(e.lower,3)} vs ${J(e.higher,3)})`).join(`<br />`)}`):(ks?.classList.add(`hidden`),ks.innerHTML=``)}function Ms(){let e=Number(hs.value);if(!Number.isFinite(e)||e<=0){Z(As,`Enter a valid pad 360° sensitivity greater than 0.`,`error`);return}$=le(e),js()}function Ns(e){!$||de($)||($=me($,e),js())}gs?.addEventListener(`click`,Ms),bs?.addEventListener(`click`,()=>Ns(`lower`)),xs?.addEventListener(`click`,()=>Ns(`higher`)),ws?.addEventListener(`click`,()=>{$&&($=he($),js())}),Ts?.addEventListener(`click`,()=>{$=null,js(),Z(As,`Enter your pad 360° sensitivity and press Start PSA.`,``)}),Aa.innerHTML=Ma.map(e=>`<option value="${e.id}">${e.label}</option>`).join(``),Aa.addEventListener(`change`,()=>Ia(Na)),Ia(null),so(),mo();function Ps(e){return String(e||``).replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`)}function Fs(e){let t=document.querySelector(`#donate-section`),n=document.querySelector(`#donate-actions`);if(!t||!n)return;let r=[];e.paypalUrl&&r.push(`<a class="btn donate-btn paypal" href="${Ps(e.paypalUrl)}" target="_blank" rel="noopener noreferrer">${Ta}<span>Donate via PayPal</span></a>`),e.steamTradeUrl&&r.push(`<a class="btn donate-btn steam" href="${Ps(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer">${Ea}<span>Donate Steam skins</span></a>`),n.innerHTML=r.join(``),t.classList.toggle(`hidden`,r.length===0);let i=document.querySelector(`#donate-fab`);if(i){let t=[];e.paypalUrl&&t.push(`<a class="donate-fab-btn paypal" href="${Ps(e.paypalUrl)}" target="_blank" rel="noopener noreferrer" title="Donate via PayPal">${Ta}<span>PayPal</span></a>`),e.steamTradeUrl&&t.push(`<a class="donate-fab-btn steam" href="${Ps(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer" title="Donate Steam skins">${Ea}<span>Steam</span></a>`),i.innerHTML=t.length?`<span class="donate-fab-label">Support AimKit</span>${t.join(``)}`:``,i.classList.toggle(`hidden`,t.length===0)}}async function Is(){try{Fs(await _.settings.get())}catch{Fs({paypalUrl:``,steamTradeUrl:``})}}document.addEventListener(`aimkit:settings-updated`,Is),document.querySelector(`#contact-open`)?.addEventListener(`click`,sa),Je();var Ls=new URLSearchParams(window.location.search).get(`reset`);if(Ls){We(Ls);let e=new URL(window.location.href);e.searchParams.delete(`reset`),window.history.replaceState({},``,e)}var Rs=new URLSearchParams(window.location.search);if(Rs.get(`token`)){Ce(Rs.get(`token`)),je();let e=new URL(window.location.href);e.searchParams.delete(`token`),window.history.replaceState({},``,e)}else if(Rs.get(`steam`)===`linked`){je();let e=new URL(window.location.href);e.searchParams.delete(`steam`),window.history.replaceState({},``,e)}else if(Rs.get(`steam_error`)){let e=new URL(window.location.href);e.searchParams.delete(`steam_error`),window.history.replaceState({},``,e)}Ln(),sr(),Jr(),_i(),Ii(),wr(),aa(),Is();
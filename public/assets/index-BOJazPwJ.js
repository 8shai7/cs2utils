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
`}var p={cl_crosshair_drawoutline:`outlineEnabled`,cl_crosshair_dynamic_maxdist_splitratio:`splitSizeRatio`,cl_crosshair_dynamic_splitalpha_innermod:`innerSplitAlpha`,cl_crosshair_dynamic_splitalpha_outermod:`outerSplitAlpha`,cl_crosshair_dynamic_splitdist:`splitDistance`,cl_crosshair_outlinethickness:`outline`,cl_crosshair_t:`tStyleEnabled`,cl_crosshairalpha:`alpha`,cl_crosshaircolor:`color`,cl_crosshaircolor_b:`blue`,cl_crosshaircolor_g:`green`,cl_crosshaircolor_r:`red`,cl_crosshairdot:`centerDotEnabled`,cl_crosshairgap:`gap`,cl_crosshairgap_useweaponvalue:`deployedWeaponGapEnabled`,cl_crosshairsize:`length`,cl_crosshairstyle:`style`,cl_crosshairthickness:`thickness`,cl_crosshairusealpha:`alphaEnabled`,cl_fixedcrosshairgap:`fixedCrosshairGap`,cl_crosshair_recoil:`followRecoil`},te=new Set([`outlineEnabled`,`tStyleEnabled`,`centerDotEnabled`,`deployedWeaponGapEnabled`,`alphaEnabled`,`followRecoil`]),ne={length:3,red:50,green:250,blue:50,gap:-2,alphaEnabled:!0,alpha:200,outlineEnabled:!1,outline:1,color:1,thickness:.5,centerDotEnabled:!1,splitDistance:3,followRecoil:!1,fixedCrosshairGap:3,innerSplitAlpha:0,outerSplitAlpha:1,splitSizeRatio:1,tStyleEnabled:!1,deployedWeaponGapEnabled:!0,style:4};function m(e){let t=e.trim().replace(/^["']|["']$/g,``),n=t.toLowerCase();return n===`true`?`1`:n===`false`?`0`:t}function re(e){let t={},n=e.replace(/\/\/[^\n]*/g,``).replace(/\/\*[\s\S]*?\*\//g,``);for(let e of n.split(/[;\n]+/)){let n=e.trim();if(!n)continue;let r=n.match(/^(cl_[\w]+)\s+(.+)$/);r&&(t[r[1]]=m(r[2]))}return t}function ie(e,t){return e===void 0?!t&&0:t?typeof e==`boolean`?e:Number(e)!==0:Number(e)}function ae(e){let t={...ne};for(let[n,r]of Object.entries(p)){if(!(n in e))continue;let i=te.has(r);t[r]=ie(e[n],i)}return t}function oe(e){return ae(re(e))}function se(e){return e.trim().split(`
`).map(e=>e.trim()).filter(Boolean).join(`
`)}var ce=.5;function le(e){return{base:e,lo:e*(1-ce),hi:e*1.5,round:1,choices:[]}}function ue(e){return{lower:e.lo,higher:e.hi,mid:(e.lo+e.hi)/2}}function de(e){return e.round>7}function fe(e){return(e.lo+e.hi)/2}function pe(e){let t=fe(e);return t<=0?0:(e.hi-e.lo)/t}function me(e,t){if(de(e))return e;let n=(e.lo+e.hi)/2,r={round:e.round,side:t,lo:e.lo,hi:e.hi,lower:e.lo,higher:e.hi},i={...e,choices:[...e.choices,r],round:e.round+1};return t===`lower`?i.hi=n:i.lo=n,i}function he(e){if(e.choices.length===0)return e;let t=e.choices.slice(0,-1),n=e.choices[e.choices.length-1];return{...e,lo:n.lo,hi:n.hi,round:n.round,choices:t}}function ge(e){return fe(e)}var _e=`/api`,ve=`cs2utils.token`,ye=/^https?:\/\//.test(_e)?new URL(_e).origin:``;function be(){try{return localStorage.getItem(ve)}catch{return null}}function xe(e){try{e?localStorage.setItem(ve,e):localStorage.removeItem(ve)}catch{}}async function h(e,t,n,{auth:r=!1}={}){let i={};if(n!==void 0&&!(n instanceof FormData)&&(i[`Content-Type`]=`application/json`),r){let e=be();e&&(i.Authorization=`Bearer ${e}`)}let a;try{a=await fetch(`${_e}${t}`,{method:e,headers:i,body:n instanceof FormData?n:n===void 0?void 0:JSON.stringify(n)})}catch{throw Error(`Cannot reach the server. Is the API running?`)}let o=null,s=await a.text();if(s)try{o=JSON.parse(s)}catch{o=null}if(!a.ok){let e=Error(o&&o.error||`Request failed (${a.status}).`);throw e.status=a.status,e.data=o,e}return o}var Se=`${_e}/auth/steam`;function Ce(e){xe(e)}function g(e){return!!e&&(e.role===`admin`||e.role===`owner`)}function we(e){return!!e&&e.role===`owner`}function Te(e){return e?/^https?:\/\//.test(e)||e.startsWith(`data:`)?e:ye+e:``}var _={auth:{async register(e){let t=await h(`POST`,`/auth/register`,e);return xe(t.token),t.user},async login(e){let t=await h(`POST`,`/auth/login`,e);return xe(t.token),t.user},logout(){xe(null)},async captcha(){return h(`GET`,`/auth/captcha`)},async changePassword(e){return h(`POST`,`/auth/password`,e,{auth:!0})},async forgot(e){return h(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return h(`POST`,`/auth/reset`,{token:e,password:t})},async me(){if(!be())return null;try{return(await h(`GET`,`/auth/me`,void 0,{auth:!0})).user}catch{return xe(null),null}},async profile(){return h(`GET`,`/auth/profile`,void 0,{auth:!0})},async setAvatar(e){return(await h(`POST`,`/auth/avatar`,{url:e},{auth:!0})).user},async uploadAvatar(e){let t=new FormData;return t.append(`file`,e),(await h(`POST`,`/auth/avatar/upload`,t,{auth:!0})).user},async changePassword(e){return h(`POST`,`/auth/password`,e,{auth:!0})},async changeUsername(e){let t=await h(`POST`,`/auth/username`,{username:e},{auth:!0});return t.token&&xe(t.token),t.user},async setCredentials(e){let t=await h(`POST`,`/auth/credentials`,e,{auth:!0});return t.token&&xe(t.token),t.user},async forgot(e){return h(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return h(`POST`,`/auth/reset`,{token:e,password:t})},steamLoginUrl(){return`${_e}/auth/steam`},async steamLinkUrl(){return(await h(`GET`,`/auth/steam/link-url`,void 0,{auth:!0})).url},async steamUnlink(){return(await h(`POST`,`/auth/steam/unlink`,{},{auth:!0})).user}},settings:{async get(){return h(`GET`,`/settings`)}},contact:{async send(e){return h(`POST`,`/contact`,e)}},pros:{async list({q:e=``,sort:t=`name`}={}){let n=new URLSearchParams;e&&n.set(`q`,e),t&&n.set(`sort`,t);let r=n.toString();return h(`GET`,`/pros${r?`?${r}`:``}`)}},configs:{async list({sort:e=`top`,q:t=``}={}){let n=new URLSearchParams;e&&n.set(`sort`,e),t&&n.set(`q`,t);let r=n.toString();return(await h(`GET`,`/configs${r?`?${r}`:``}`,void 0,{auth:!0})).configs},async create(e){return(await h(`POST`,`/configs`,e,{auth:!0})).config},async rate(e,t){return h(`POST`,`/configs/${e}/rate`,{rating:t},{auth:!0})},async remove(e){return h(`DELETE`,`/configs/${e}`,void 0,{auth:!0})}},highlights:{async list({q:e=``}={}){return(await h(`GET`,`/highlights${e?`?q=${encodeURIComponent(e)}`:``}`,void 0,{auth:!0})).highlights},async create(e){return(await h(`POST`,`/highlights`,e,{auth:!0})).highlight},async report(e,t){return h(`POST`,`/highlights/${e}/report`,{reason:t},{auth:!0})},async remove(e){return h(`DELETE`,`/highlights/${e}`,void 0,{auth:!0})}},nades:{async list({map:e=``,type:t=``}={}){let n=new URLSearchParams;e&&n.set(`map`,e),t&&n.set(`type`,t);let r=n.toString();return(await h(`GET`,`/nades${r?`?${r}`:``}`)).nades},async mine(){return(await h(`GET`,`/nades/mine`,void 0,{auth:!0})).nades},async create(e){return(await h(`POST`,`/nades`,e,{auth:!0})).nade},async addMedia(e,t){return(await h(`POST`,`/nades/${e}/media`,t,{auth:!0})).media},async remove(e){return h(`DELETE`,`/nades/${e}`,void 0,{auth:!0})}},commands:{async catalog(){return h(`GET`,`/commands/catalog`)},async social(){return h(`GET`,`/commands/social`,void 0,{auth:!0})},async recommend(e){return h(`POST`,`/commands/${e}/recommend`,{},{auth:!0})},async addComment(e,t){return h(`POST`,`/commands/${e}/comments`,{body:t},{auth:!0})}},admin:{async pending(){return(await h(`GET`,`/admin/nades/pending`,void 0,{auth:!0})).nades},async pendingComments(){return(await h(`GET`,`/admin/comments/pending`,void 0,{auth:!0})).comments},async pendingCommentsCount(){return(await h(`GET`,`/admin/comments/pending/count`,void 0,{auth:!0})).count},async reviewComment(e,t){return h(`POST`,`/admin/comments/${e}/review`,{decision:t},{auth:!0})},async syncCommands(){return h(`POST`,`/admin/commands/sync`,{},{auth:!0})},async checkCommandsCs2(){return h(`POST`,`/admin/commands/check-cs2`,{},{auth:!0})},async saveSettings(e){return h(`POST`,`/admin/settings`,e,{auth:!0})},async highlightReports(){return(await h(`GET`,`/admin/highlights/reports`,void 0,{auth:!0})).highlights},async highlightReportsCount(){return(await h(`GET`,`/admin/highlights/reports/count`,void 0,{auth:!0})).count},async reviewHighlight(e,t){return h(`POST`,`/admin/highlights/${e}/review`,{decision:t},{auth:!0})},async syncPros(){return h(`POST`,`/admin/pros/sync`,{},{auth:!0})},async importCommands(e){return h(`POST`,`/admin/commands/import`,{content:e},{auth:!0})},async importPros(e){return h(`POST`,`/admin/pros/import`,{content:e},{auth:!0})},async banUser(e,{hours:t,permanent:n}){return(await h(`POST`,`/admin/users/${e}/ban`,{hours:t,permanent:n},{auth:!0})).user},async unbanUser(e){return(await h(`POST`,`/admin/users/${e}/unban`,{},{auth:!0})).user},async pendingCount(){return(await h(`GET`,`/admin/nades/pending/count`,void 0,{auth:!0})).count},async reviewNade(e,t,n=``){return h(`POST`,`/admin/nades/${e}/review`,{decision:t,note:n},{auth:!0})},async reviewMedia(e,t){return h(`POST`,`/admin/media/${e}/review`,{decision:t},{auth:!0})},async users(){return(await h(`GET`,`/admin/users`,void 0,{auth:!0})).users},async setRole(e,t){return(await h(`POST`,`/admin/users/${e}/role`,{role:t},{auth:!0})).user},async contactMessages(){return(await h(`GET`,`/admin/contact`,void 0,{auth:!0})).messages}},uploads:{async image(e){let t=new FormData;return t.append(`file`,e),await h(`POST`,`/uploads`,t,{auth:!0})}}},Ee=null,De=new Set;function Oe(){for(let e of De)e(Ee)}function ke(){return Ee}function Ae(e){return De.add(e),()=>De.delete(e)}async function je(){return Ee=await _.auth.me(),Oe(),Ee}async function Me(e){return Ee=await _.auth.login(e),Oe(),Ee}async function Ne(e){return Ee=await _.auth.register(e),Oe(),Ee}function Pe(){_.auth.logout(),Ee=null,Oe()}var Fe,v,Ie=`login`,Le={required:!1,token:null,svg:``};function Re(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function ze(){let e=ke();e?(Fe.innerHTML=`
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
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#reset-status`);t.querySelector(`#reset-form`).addEventListener(`submit`,async i=>{i.preventDefault();try{await _.auth.reset(e,t.querySelector(`#reset-password`).value),r.textContent=`Password updated! You can now log in.`,r.className=`status ok`,setTimeout(()=>{n(),Ge(`login`)},1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#reset-password`)?.focus()}function Ge(e){Ie=e,v.classList.remove(`hidden`),Be()}function Ke(){v.classList.add(`hidden`)}function qe(e=`login`){Ge(e)}async function Je(){Fe=document.querySelector(`#account-menu`),Fe&&(v=document.createElement(`div`),v.id=`auth-modal`,v.className=`modal hidden`,document.body.appendChild(v),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Ke()}),Ae(()=>ze()),ze(),await je())}var Ye=[{id:`mirage`,name:`Mirage`},{id:`dust2`,name:`Dust II`},{id:`inferno`,name:`Inferno`},{id:`nuke`,name:`Nuke`},{id:`ancient`,name:`Ancient`},{id:`anubis`,name:`Anubis`},{id:`overpass`,name:`Overpass`},{id:`vertigo`,name:`Vertigo`},{id:`train`,name:`Train`}],Xe=[{id:`smoke`,name:`Smoke`,color:`#cdd6e3`},{id:`flash`,name:`Flash`,color:`#f4ec9b`},{id:`molotov`,name:`Molotov`,color:`#ff7a3c`},{id:`he`,name:`HE Grenade`,color:`#8fd694`},{id:`decoy`,name:`Decoy`,color:`#9aa8ff`}],Ze=[{id:`stand`,name:`Standing throw`},{id:`jump`,name:`Jump throw`},{id:`jumpthrow`,name:`Jumpthrow bind`},{id:`run`,name:`Running throw`},{id:`runjump`,name:`Run + jump throw`},{id:`walk`,name:`Walking throw`}],Qe=[{id:`t`,name:`T side`},{id:`ct`,name:`CT side`}];function $e(e){return Ye.find(t=>t.id===e)?.name??e}function et(e){return Xe.find(t=>t.id===e)??Xe[0]}function tt(e){return Ze.find(t=>t.id===e)?.name??e}function nt(e){return Qe.find(t=>t.id===e)?.name??e}function rt(e){let t=(e||``).toLowerCase();return/youtube\.com|youtu\.be|\.mp4|\.webm|\.mov|streamable\.com/.test(t)?`video`:`image`}var it={},at=new WeakMap;function ot(e){return`./maps/${e}.png`}function st(e,t){let n=it[e];return n||(n={img:new Image,loaded:!1,error:!1,waiters:new Set},it[e]=n,n.img.onload=()=>{n.loaded=!0,n.waiters.forEach(e=>e()),n.waiters.clear()},n.img.onerror=()=>{n.error=!0,n.waiters.clear()},n.img.src=ot(e)),!n.loaded&&!n.error&&t&&n.waiters.add(t),n}function ct(e,t,n,r){let i=e.createLinearGradient(0,0,t,t);i.addColorStop(0,`#26313f`),i.addColorStop(.5,`#2f3d4e`),i.addColorStop(1,`#222b37`),e.fillStyle=i,e.fillRect(0,0,t,t);let a=st(n,r);if(a.loaded){e.drawImage(a.img,0,0,t,t),e.fillStyle=`rgba(13,17,23,0.18)`,e.fillRect(0,0,t,t);return}e.strokeStyle=`rgba(255,255,255,0.06)`,e.lineWidth=1;for(let n=0;n<=t;n+=t/10)e.beginPath(),e.moveTo(n,0),e.lineTo(n,t),e.stroke(),e.beginPath(),e.moveTo(0,n),e.lineTo(t,n),e.stroke();e.fillStyle=`rgba(255,255,255,0.10)`,e.font=`600 22px Outfit, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText($e(n).toUpperCase(),t/2,t/2)}function lt(e,{mapId:t,type:n=`smoke`,start:r=null,end:i=null}){let a=e.getContext(`2d`);if(!a)return;let o=e.width;at.set(e,{mapId:t,type:n,start:r,end:i}),a.clearRect(0,0,o,o),ct(a,o,t,()=>{let t=at.get(e);t&&lt(e,t)});let s=et(n).color;if(r&&i){let e=r.x*o,t=r.y*o,n=i.x*o,c=i.y*o,l=(e+n)/2,u=(t+c)/2,d=Math.hypot(n-e,c-t),f=l,ee=u-Math.max(24,d*.35);a.strokeStyle=s,a.lineWidth=3,a.setLineDash([8,6]),a.beginPath(),a.moveTo(e,t),a.quadraticCurveTo(f,ee,n,c),a.stroke(),a.setLineDash([]);let p=.92,te=(1-p)*(1-p)*e+2*(1-p)*p*f+p*p*n,ne=(1-p)*(1-p)*t+2*(1-p)*p*ee+p*p*c,m=Math.atan2(c-ne,n-te);a.fillStyle=s,a.beginPath(),a.moveTo(n,c),a.lineTo(n-12*Math.cos(m-.4),c-12*Math.sin(m-.4)),a.lineTo(n-12*Math.cos(m+.4),c-12*Math.sin(m+.4)),a.closePath(),a.fill()}r&&ut(a,r.x*o,r.y*o,`#3ecf8e`,`THROW`),i&&dt(a,i.x*o,i.y*o,s),(!r||!i)&&(a.fillStyle=`rgba(255,255,255,0.55)`,a.font=`13px Outfit, sans-serif`,a.textAlign=`center`,a.textBaseline=`bottom`,a.fillText(r?`Click again to set the landing spot`:`Click the map to set your throw position`,o/2,o-12))}function ut(e,t,n,r,i){e.beginPath(),e.fillStyle=r,e.arc(t,n,7,0,Math.PI*2),e.fill(),e.lineWidth=2,e.strokeStyle=`#0d1117`,e.stroke(),i&&(e.fillStyle=`#fff`,e.font=`600 10px JetBrains Mono, monospace`,e.textAlign=`center`,e.textBaseline=`bottom`,e.fillText(i,t,n-10))}function dt(e,t,n,r){e.strokeStyle=r,e.lineWidth=3,e.beginPath(),e.arc(t,n,11,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(t-6,n-6),e.lineTo(t+6,n+6),e.moveTo(t+6,n-6),e.lineTo(t-6,n+6),e.stroke()}function ft(e,t){let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width,i=(t.clientY-n.top)/n.height;return{x:Math.max(0,Math.min(1,r)),y:Math.max(0,Math.min(1,i))}}var pt=360,y,b=null,x=`browse`,mt={text:``,kind:``},ht=0,gt=!1,_t={map:``,type:``},vt=[],yt=[],bt=[],xt=[],S=St();function St(){return{map:`mirage`,type:`smoke`,side:`t`,technique:`stand`,title:``,description:``,start:null,end:null}}function C(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Ct(e){let t=Te(e);return/^https?:\/\//.test(t)||t.startsWith(`data:image/`)?t:``}function wt(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function Tt(e,t){return e.map(e=>`<option value="${e.id}"${e.id===t?` selected`:``}>${C(e.name)}</option>`).join(``)}function w(e,t=``){mt={text:e,kind:t};let n=y?.querySelector(`#nades-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Et(e){return`<span class="nade-badge ${e}">${e}</span>`}function Dt(e){try{return new Date(e).toLocaleDateString()}catch{return``}}async function Ot(){if(g(b))try{ht=await _.admin.pendingCount()}catch{ht=0}else ht=0}async function T(e){x=e,gt=e!==`add`,gt&&Bt();try{x===`browse`&&(vt=await _.nades.list(_t)),x===`mine`&&b&&(yt=await _.nades.mine()),x===`review`&&g(b)&&(bt=await _.admin.pending(),ht=await _.admin.pendingCount()),x===`users`&&g(b)&&(xt=await _.admin.users())}catch(e){w(e.message,`error`)}gt=!1,Bt()}function kt(e){let t=Ct(e.url);if(!t)return``;if(e.kind===`video`){let n=wt(e.url);return n?`<iframe class="nade-media-embed" src="https://www.youtube.com/embed/${C(n)}" title="nade video" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e.url)?`<video class="nade-media-embed" src="${C(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${C(t)}" target="_blank" rel="noopener noreferrer">Open video ↗</a>`}return`<a href="${C(t)}" target="_blank" rel="noopener noreferrer"><img class="nade-media-img" src="${C(t)}" alt="${C(e.addedByName||`nade media`)}" loading="lazy" /></a>`}function At(e,{showStatus:t=!1}={}){let n=et(e.type),r=(e.media||[]).filter(e=>t?!0:e.status===`approved`),i=r.length?`<div class="nade-media">${r.map(e=>`<div class="nade-media-item">${kt(e)}${t?`<div class="nade-media-meta">${Et(e.status)} <span>by ${C(e.addedByName||``)}</span></div>`:``}</div>`).join(``)}</div>`:`<p class="hint">No approved media yet — a 2D throw preview is shown above.</p>`;return`
    <article class="nade-card">
      <div class="nade-card-head">
        <div>
          <h3>${C(e.title)}</h3>
          <p class="nade-sub">
            <span class="nade-chip" style="--chip:${n.color}">${C(n.name)}</span>
            ${C($e(e.map))} · ${C(nt(e.side))} · ${C(tt(e.technique))}
          </p>
        </div>
        ${t?Et(e.status):``}
      </div>
      <canvas class="nade-canvas" width="${pt}" height="${pt}"
        data-map="${C(e.map)}" data-type="${C(e.type)}"
        data-sx="${e.start.x}" data-sy="${e.start.y}" data-ex="${e.end.x}" data-ey="${e.end.y}"></canvas>
      ${e.description?`<p class="nade-desc">${C(e.description)}</p>`:``}
      ${i}
      <p class="nade-foot">by ${C(e.authorName)} · ${Dt(e.createdAt)}</p>
    </article>`}function jt(){let e=vt.length?vt.map(e=>At(e)).join(``):`<p class="hint">No approved nades yet${b?` — be the first to add one!`:` — log in and add the nades you found.`}</p>`;return`
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${Tt(Ye,_t.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${Tt(Xe,_t.type)}</select>
      </label>
    </div>
    <div class="nade-grid">${e}</div>`}function Mt(e){return`<div class="login-prompt">
    <p class="hint">Log in or create an account to ${C(e)}.</p>
    <div class="actions">
      <button class="btn primary" data-open-auth="login">Log in</button>
      <button class="btn" data-open-auth="register">Register</button>
    </div>
  </div>`}function Nt(){return b?`
    <div class="nade-add">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>Pick the <strong>map</strong> and <strong>grenade type</strong> on the right.</li>
          <li>Click the map once to drop your <strong>throw position</strong>.</li>
          <li>Click again to set the <strong>landing spot</strong>.</li>
          <li>Fill in the details, add optional media, and submit for review.</li>
        </ol>
        <canvas id="nade-add-canvas" class="nade-canvas interactive" width="${pt}" height="${pt}"></canvas>
        <p class="hint" id="nade-add-coords">Step 2: click the map to set your throw position.</p>
      </div>
      <form class="nade-add-form" id="nade-add-form">
        <label class="field"><span>Title</span><input id="add-title" type="text" maxlength="160" placeholder="A site smoke from T ramp" value="${C(S.title)}" /></label>
        <div class="sens-grid">
          <label class="field"><span>Map</span><select id="add-map">${Tt(Ye,S.map)}</select></label>
          <label class="field"><span>Type</span><select id="add-type">${Tt(Xe,S.type)}</select></label>
        </div>
        <div class="sens-grid">
          <label class="field"><span>Side</span><select id="add-side">${Tt(Qe,S.side)}</select></label>
          <label class="field"><span>Technique</span><select id="add-technique">${Tt(Ze,S.technique)}</select></label>
        </div>
        <label class="field"><span>Description (optional)</span><textarea id="add-description" rows="3" placeholder="Where to stand, what to line up, jumpthrow timing...">${C(S.description)}</textarea></label>
        <label class="field"><span>Video URL (optional — YouTube or .mp4)</span><input id="add-video" type="url" placeholder="https://youtu.be/..." /></label>
        <label class="field"><span>Image URL (optional)</span><input id="add-image" type="url" placeholder="https://.../lineup.jpg" /></label>
        <label class="field"><span>Or upload an image (optional)</span><input id="add-upload" type="file" accept="image/*" /></label>
        <div class="actions">
          <button class="btn primary" type="submit">Submit for review</button>
          <button class="btn ghost" type="button" id="add-clear">Clear points</button>
        </div>
        <p class="hint">Submissions are reviewed by an admin before appearing publicly.</p>
      </form>
    </div>`:Mt(`add nades`)}function Pt(){return b?yt.length?`<div class="nade-grid">${yt.map(e=>`
      <div class="nade-mine">
        ${At(e,{showStatus:!0})}
        ${e.reviewNote?`<p class="hint">Reviewer note: ${C(e.reviewNote)}</p>`:``}
        <div class="nade-add-media">
          <input type="url" class="add-media-url" data-nade="${e.id}" placeholder="Add media URL (image or video)" />
          <button class="btn" data-add-media="${e.id}">Add media</button>
          <button class="btn ghost" data-delete-nade="${e.id}">Delete</button>
        </div>
      </div>`).join(``)}</div>`:`<p class="hint">You haven't added any nades yet.</p>`:Mt(`see and manage your nades`)}function Ft(){return g(b)?bt.length?`<div class="nade-grid">${bt.map(e=>{let t=(e.media||[]).filter(e=>e.status===`pending`),n=t.length?`<div class="review-media">${t.map(e=>`<div class="review-media-item">${kt(e)}
                <div class="actions">
                  <button class="btn" data-approve-media="${e.id}">Approve media</button>
                  <button class="btn ghost" data-reject-media="${e.id}">Reject</button>
                </div></div>`).join(``)}</div>`:``,r=e.status===`pending`?`<div class="review-actions">
               <input type="text" class="review-note" data-nade="${e.id}" placeholder="Optional note to the author" />
               <button class="btn primary" data-approve-nade="${e.id}">Approve nade</button>
               <button class="btn ghost" data-reject-nade="${e.id}">Reject</button>
             </div>`:`<p class="hint">Nade already ${C(e.status)} — reviewing added media only.</p>`;return`<div class="nade-mine">${At(e,{showStatus:!0})}${n}${r}</div>`}).join(``)}</div>`:`<p class="hint">Nothing pending review. Nice and clean.</p>`:`<p class="hint">Admins only.</p>`}function It(e){if(!e.bannedUntil)return null;let t=new Date(e.bannedUntil);return t.getTime()<=Date.now()?null:t.getFullYear()>=9999?`permanently`:`until ${t.toLocaleString()}`}function Lt(){return g(b)?`<div class="users-table">
    ${xt.map(e=>{let t=It(e),n=e.role===`owner`?`<span class="hint">owner</span>`:e.role===`admin`?`<button class="btn btn-sm ghost" data-role-user="${e.id}" data-role="user">Revoke admin</button>`:`<button class="btn btn-sm" data-role-user="${e.id}" data-role="admin">Make admin</button>`,r=e.role===`owner`?``:t?`<span class="nade-badge rejected">banned ${C(t)}</span> <button class="btn btn-sm ghost" data-unban="${e.id}">Unban</button>`:`<select class="ban-duration" data-ban-dur="${e.id}">
                   <option value="24">1 day</option>
                   <option value="168">7 days</option>
                   <option value="720">30 days</option>
                   <option value="perma">Permanent</option>
                 </select>
                 <button class="btn btn-sm ghost" data-ban="${e.id}">Ban</button>`;return`<div class="user-row">
          <div><strong>${C(e.username)}</strong><br /><span class="hint">${C(e.email)}</span></div>
          <div>${Et(e.role)}</div>
          <div class="user-actions">${n}</div>
          <div class="user-actions">${r}</div>
        </div>`}).join(``)}
  </div>`:`<p class="hint">Admins only.</p>`}function Rt(){let e=[[`browse`,`Browse`]];return b&&e.push([`add`,`Add nade`],[`mine`,`My nades`]),g(b)&&e.push([`review`,`Review${ht?` (${ht})`:``}`],[`users`,`Users`]),`<nav class="nades-subnav">${e.map(([e,t])=>`<button class="tool-tab ${x===e?`active`:``}" data-view="${e}">${C(t)}</button>`).join(``)}</nav>`}function zt(){if(gt)return`<div class="nades-loading"><span class="spinner"></span> Loading…</div>`;switch(x){case`add`:return Nt();case`mine`:return Pt();case`review`:return Ft();case`users`:return Lt();default:return jt()}}function Bt(){y.innerHTML=`
    <div class="nades-shell">
      ${Rt()}
      <div class="nades-body">${zt()}</div>
      <div id="nades-status" class="status ${mt.kind}">${C(mt.text)}</div>
    </div>`,Ut(),Vt()}function Vt(){y.querySelectorAll(`canvas.nade-canvas:not(.interactive)`).forEach(e=>{lt(e,{mapId:e.dataset.map,type:e.dataset.type,start:{x:Number(e.dataset.sx),y:Number(e.dataset.sy)},end:{x:Number(e.dataset.ex),y:Number(e.dataset.ey)}})}),Ht()}function Ht(){let e=y.querySelector(`#nade-add-canvas`);e&&lt(e,{mapId:S.map,type:S.type,start:S.start,end:S.end})}function Ut(){y.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),y.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>T(e.dataset.view))),y.querySelector(`#filter-map`)?.addEventListener(`change`,e=>{_t.map=e.target.value,T(`browse`)}),y.querySelector(`#filter-type`)?.addEventListener(`change`,e=>{_t.type=e.target.value,T(`browse`)});let e=y.querySelector(`#nade-add-canvas`);e&&e.addEventListener(`click`,t=>{let n=ft(e,t);!S.start||S.start&&S.end?(S.start=n,S.end=null):S.end=n;let r=y.querySelector(`#nade-add-coords`);r&&(r.textContent=S.end?`Throw + landing set. Adjust by clicking again to start over.`:`Now click the landing spot for the grenade.`),Ht()}),y.querySelector(`#add-map`)?.addEventListener(`change`,e=>{S.map=e.target.value,Ht()}),y.querySelector(`#add-type`)?.addEventListener(`change`,e=>{S.type=e.target.value,Ht()}),y.querySelector(`#add-clear`)?.addEventListener(`click`,()=>{S.start=null,S.end=null,Ht();let e=y.querySelector(`#nade-add-coords`);e&&(e.textContent=`Click the map to set the throw position, then click again for the landing spot.`)}),y.querySelector(`#nade-add-form`)?.addEventListener(`submit`,Wt),y.querySelectorAll(`[data-add-media]`).forEach(e=>e.addEventListener(`click`,()=>Gt(e.dataset.addMedia))),y.querySelectorAll(`[data-delete-nade]`).forEach(e=>e.addEventListener(`click`,()=>Kt(e.dataset.deleteNade))),y.querySelectorAll(`[data-approve-nade]`).forEach(e=>e.addEventListener(`click`,()=>qt(e.dataset.approveNade,`approved`))),y.querySelectorAll(`[data-reject-nade]`).forEach(e=>e.addEventListener(`click`,()=>qt(e.dataset.rejectNade,`rejected`))),y.querySelectorAll(`[data-approve-media]`).forEach(e=>e.addEventListener(`click`,()=>Jt(e.dataset.approveMedia,`approved`))),y.querySelectorAll(`[data-reject-media]`).forEach(e=>e.addEventListener(`click`,()=>Jt(e.dataset.rejectMedia,`rejected`))),y.querySelectorAll(`[data-role-user]`).forEach(e=>e.addEventListener(`click`,()=>Yt(e.dataset.roleUser,e.dataset.role))),y.querySelectorAll(`[data-ban]`).forEach(e=>e.addEventListener(`click`,()=>{let t=y.querySelector(`[data-ban-dur="${e.dataset.ban}"]`);Xt(e.dataset.ban,t?t.value:`24`)})),y.querySelectorAll(`[data-unban]`).forEach(e=>e.addEventListener(`click`,()=>Zt(e.dataset.unban)))}async function Wt(e){if(e.preventDefault(),S.title=y.querySelector(`#add-title`)?.value||``,S.map=y.querySelector(`#add-map`)?.value||S.map,S.type=y.querySelector(`#add-type`)?.value||S.type,S.side=y.querySelector(`#add-side`)?.value||S.side,S.technique=y.querySelector(`#add-technique`)?.value||S.technique,S.description=y.querySelector(`#add-description`)?.value||``,!S.start||!S.end){w(`Click the map to set both the throw position and the landing spot.`,`error`);return}let t=[],n=(y.querySelector(`#add-video`)?.value||``).trim(),r=(y.querySelector(`#add-image`)?.value||``).trim();n&&t.push({url:n,kind:`video`}),r&&t.push({url:r,kind:rt(r)});let i=y.querySelector(`#add-upload`);try{if(i?.files?.[0]){w(`Uploading image…`,``);let e=await _.uploads.image(i.files[0]);t.push({url:e.url,kind:`image`})}await _.nades.create({...S,media:t}),S=St(),await T(`mine`),w(`Nade submitted! It will appear publicly once an admin approves it.`,`ok`)}catch(e){w(e.message,`error`)}}async function Gt(e){let t=(y.querySelector(`.add-media-url[data-nade="${e}"]`)?.value||``).trim();if(!t){w(`Enter a media URL first.`,`error`);return}try{await _.nades.addMedia(e,{url:t,kind:rt(t)}),await T(`mine`),w(`Media added — pending admin review.`,`ok`)}catch(e){w(e.message,`error`)}}async function Kt(e){try{await _.nades.remove(e),await T(`mine`),w(`Nade deleted.`,`ok`)}catch(e){w(e.message,`error`)}}async function qt(e,t){let n=y.querySelector(`.review-note[data-nade="${e}"]`)?.value||``;try{await _.admin.reviewNade(e,t,n),await T(`review`),w(`Nade ${t}.`,`ok`)}catch(e){w(e.message,`error`)}}async function Jt(e,t){try{await _.admin.reviewMedia(e,t),await T(`review`),w(`Media ${t}.`,`ok`)}catch(e){w(e.message,`error`)}}async function Yt(e,t){try{await _.admin.setRole(e,t),await T(`users`),w(`Role updated.`,`ok`)}catch(e){w(e.message,`error`)}}async function Xt(e,t){try{t===`perma`?await _.admin.banUser(e,{permanent:!0}):await _.admin.banUser(e,{hours:Number(t)}),await T(`users`),w(`User banned.`,`ok`)}catch(e){w(e.message,`error`)}}async function Zt(e){try{await _.admin.unbanUser(e),await T(`users`),w(`User unbanned.`,`ok`)}catch(e){w(e.message,`error`)}}async function Qt(){y=document.querySelector(`#nades-tool`),y&&(b=ke(),Ae(async e=>{b=e,await Ot(),!b&&[`add`,`mine`,`review`,`users`].includes(x)&&(x=`browse`),b&&!g(b)&&[`review`,`users`].includes(x)&&(x=`browse`),await T(x)}),await Ot(),Bt(),await T(`browse`))}function $t(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function en(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card import-card" role="dialog" aria-modal="true" aria-label="${$t(e.title)}">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${$t(e.title)}</h2>
      <p class="hint">${$t(e.description)}</p>
      <ol class="import-steps">
        <li>Open the source and complete the verification: <a class="btn btn-sm" href="${$t(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${$t(e.sourceLabel)} ↗</a></li>
        <li>Copy the page content.</li>
        <li>Paste it below and import.</li>
      </ol>
      <textarea id="import-content" rows="9" spellcheck="false" placeholder="${$t(e.placeholder||`Paste the page content here…`)}"></textarea>
      <div class="actions">
        <button class="btn primary" id="import-run">Import</button>
        <button class="btn ghost" data-close>Cancel</button>
      </div>
      <p class="status" id="import-status"></p>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=e=>{e.key===`Escape`&&(n(),document.removeEventListener(`keydown`,r))};document.addEventListener(`keydown`,r);let i=t.querySelector(`#import-status`),a=t.querySelector(`#import-run`);a.addEventListener(`click`,async()=>{let r=t.querySelector(`#import-content`).value;if(!r.trim()){i.textContent=`Paste the page content first.`,i.className=`status error`;return}a.disabled=!0,i.textContent=`Importing…`,i.className=`status`;try{let t=await e.onImport(r);i.textContent=t||`Imported.`,i.className=`status ok`,setTimeout(n,900)}catch(e){i.textContent=e.message,i.className=`status error`,a.disabled=!1}}),t.querySelector(`#import-content`)?.focus()}var E,tn=null,D={commands:[],categories:[],recommendedLaunchOptions:``,source:`seed`,lastSync:0,cs2Build:``,cs2Version:``,remoteConfigured:!1},nn={counts:{},mine:[],comments:{}},rn=[],an={text:``,kind:``},on=new Set;function O(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function k(e,t=``){an={text:e,kind:t};let n=E?.querySelector(`#commands-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function sn(e){if(!e)return`—`;try{return new Date(e).toLocaleString()}catch{return`—`}}async function cn(){try{D=await _.commands.catalog()}catch(e){k(`Could not load command catalog: ${e.message}`,`error`)}try{nn=await _.commands.social()}catch{}if(g(tn))try{rn=await _.admin.pendingComments()}catch{rn=[]}else rn=[]}function ln(e){let t=nn.comments[e.key]||[];return`<div class="cmd-comments">${t.length?t.map(e=>`<div class="cmd-comment"><strong>${O(e.username)}</strong><span>${O(e.body)}</span></div>`).join(``):`<p class="hint">No comments yet.</p>`}${tn?`<form class="cmd-comment-form" data-comment-key="${O(e.key)}">
         <input type="text" maxlength="1000" placeholder="Share a tip about this command…" />
         <button class="btn btn-sm" type="submit">Comment</button>
       </form>
       <p class="hint">Comments are reviewed by an admin before appearing.</p>`:`<button class="btn btn-sm" data-open-auth="login">Log in to comment</button>`}</div>`}function un(e){let t=nn.counts[e.key]||0,n=nn.mine.includes(e.key),r=(nn.comments[e.key]||[]).length,i=on.has(e.key);return`
    <article class="cmd-card" data-search="${O(`${e.command} ${e.title} ${e.description}`.toLowerCase())}">
      <div class="cmd-head">
        <div class="cmd-title-row">
          <h4>${O(e.title)}</h4>
          ${e.isNew?`<span class="nade-badge new">NEW</span>`:``}
          <span class="cmd-tag ${O(e.type)}">${e.type===`launch`?`launch option`:`console`}</span>
        </div>
      </div>
      <div class="cmd-code-row">
        <code class="cmd-code">${O(e.command)}</code>
        <button class="btn btn-sm" data-copy="${O(e.command)}">Copy</button>
      </div>
      <p class="cmd-desc">${O(e.description)}</p>
      <div class="cmd-actions">
        <button class="btn btn-sm recommend ${n?`active`:``}" data-recommend="${O(e.key)}">
          ${n?`★ Recommended`:`☆ Recommend`} <span class="rec-count">${t}</span>
        </button>
        <button class="btn btn-sm ghost" data-toggle-comments="${O(e.key)}">
          ${i?`Hide`:`Comments`}${r?` (${r})`:``}
        </button>
      </div>
      ${i?ln(e):``}
    </article>`}function dn(e){let t=D.commands.filter(t=>t.category===e.id);return t.length?`
    <section class="cmd-category" data-category="${O(e.id)}">
      <h3 class="cmd-cat-title">${O(e.name)} <span class="cmd-count">${t.length}</span></h3>
      <div class="cmd-grid">${t.map(un).join(``)}</div>
    </section>`:``}function fn(){let e=D.commands.filter(e=>e.isNew).length,t=g(tn)?`<div class="actions">
         <button class="btn btn-sm" id="cmd-sync">Sync from wiki now</button>
         <button class="btn btn-sm ghost" id="cmd-check-cs2">Re-check CS2 build</button>
       </div>`:``;return`
    <section class="cmd-status-bar">
      <div>
        <strong>Source:</strong> ${O(D.source)}${D.remoteConfigured?``:` (wiki)`} ·
        <strong>CS2 build:</strong> ${D.cs2Build?`${O(D.cs2Build)}${D.cs2Version?` (${O(D.cs2Version)})`:``}`:`—`} ·
        <strong>Last synced:</strong> ${sn(D.lastSync)}
        ${e?` · <span class="nade-badge new">${e} new</span>`:``}
      </div>
      ${t}
    </section>`}function pn(){return!g(tn)||!rn.length?``:`
    <section class="cmd-review panel-review">
      <h3>Comments awaiting review (${rn.length})</h3>
      ${rn.map(e=>`<div class="review-comment">
            <div><strong>${O(e.username)}</strong> on <code>${O(e.commandKey)}</code><br /><span>${O(e.body)}</span></div>
            <div class="actions">
              <button class="btn btn-sm primary" data-approve-comment="${e.id}">Approve</button>
              <button class="btn btn-sm ghost" data-reject-comment="${e.id}">Reject</button>
            </div>
          </div>`).join(``)}
    </section>`}function mn(){E.innerHTML=`
    <div class="commands-shell">
      ${fn()}
      <section class="quick-launch">
        <div>
          <h3>Recommended launch options</h3>
          <p class="hint">Steam → right-click Counter-Strike 2 → Properties → Launch Options.</p>
        </div>
        <div class="cmd-code-row">
          <code class="cmd-code">${O(D.recommendedLaunchOptions||``)}</code>
          <button class="btn" data-copy="${O(D.recommendedLaunchOptions||``)}">Copy</button>
        </div>
      </section>
      ${pn()}
      <label class="field cmd-search">
        <span>Search commands</span>
        <input id="cmd-search" type="search" placeholder="Search by command, title, or description…" />
      </label>
      ${D.categories.map(dn).join(``)}
      <div id="commands-status" class="status ${an.kind}">${O(an.text)}</div>
    </div>`,gn()}function hn(e){let t=e.trim().toLowerCase();E.querySelectorAll(`.cmd-category`).forEach(e=>{let n=0;e.querySelectorAll(`.cmd-card`).forEach(e=>{let r=!t||e.dataset.search.includes(t);e.classList.toggle(`hidden`,!r),r&&(n+=1)}),e.classList.toggle(`hidden`,n===0)})}function gn(){E.querySelectorAll(`[data-copy]`).forEach(e=>e.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e.dataset.copy),k(`Copied to clipboard.`,`ok`)}catch{k(`Clipboard blocked — select and copy manually.`,`error`)}})),E.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),E.querySelectorAll(`[data-recommend]`).forEach(e=>e.addEventListener(`click`,()=>_n(e.dataset.recommend))),E.querySelectorAll(`[data-toggle-comments]`).forEach(e=>e.addEventListener(`click`,()=>{let t=e.dataset.toggleComments;on.has(t)?on.delete(t):on.add(t),mn()})),E.querySelectorAll(`.cmd-comment-form`).forEach(e=>e.addEventListener(`submit`,t=>{t.preventDefault(),vn(e.dataset.commentKey,e.querySelector(`input`))})),E.querySelectorAll(`[data-approve-comment]`).forEach(e=>e.addEventListener(`click`,()=>yn(e.dataset.approveComment,`approved`))),E.querySelectorAll(`[data-reject-comment]`).forEach(e=>e.addEventListener(`click`,()=>yn(e.dataset.rejectComment,`rejected`))),E.querySelector(`#cmd-search`)?.addEventListener(`input`,e=>hn(e.target.value)),E.querySelector(`#cmd-sync`)?.addEventListener(`click`,bn),E.querySelector(`#cmd-check-cs2`)?.addEventListener(`click`,xn)}async function _n(e){if(!tn){qe(`login`);return}try{let t=await _.commands.recommend(e);nn.counts[e]=t.count,nn.mine=t.recommended?[...nn.mine.filter(t=>t!==e),e]:nn.mine.filter(t=>t!==e),mn()}catch(e){k(e.message,`error`)}}async function vn(e,t){let n=(t?.value||``).trim();if(!n){k(`Write something first.`,`error`);return}try{await _.commands.addComment(e,n),k(`Comment submitted — an admin will review it before it appears.`,`ok`),t&&(t.value=``)}catch(e){k(e.message,`error`)}}async function yn(e,t){try{await _.admin.reviewComment(e,t),await cn(),mn(),k(`Comment ${t}.`,`ok`)}catch(e){k(e.message,`error`)}}function bn(){en({title:`Sync commands from the CS2 wiki`,description:`The Valve wiki has a bot check that blocks servers. Open it in your browser, complete the verification, then copy the page source (wikitext) and paste it here — the server will parse it.`,sourceUrl:`https://developer.valvesoftware.com/w/index.php?title=List_of_Counter-Strike_2_console_command_variables&action=raw`,sourceLabel:`Open CS2 wiki source`,placeholder:`Paste the wiki page source (wikitext), or a JSON list of commands…`,onImport:async e=>{let t=await _.admin.importCommands(e);return await cn(),mn(),`Imported ${t.count} commands.`}})}async function xn(){k(`Checking the current CS2 build…`,``);try{let e=await _.admin.checkCommandsCs2();await cn(),mn(),k(e.ok?`CS2 build ${e.build}${e.changed?` — changed, catalog re-synced`:` — no change`}.`:`Check failed: ${e.reason}`,e.ok?`ok`:`error`)}catch(e){k(e.message,`error`)}}async function Sn(){E=document.querySelector(`#commands-tool`),E&&(tn=ke(),Ae(async e=>{tn=e,await cn(),mn()}),mn(),await cn(),mn())}var A,j=null,Cn=null,wn={paypalUrl:``,steamTradeUrl:``},Tn={text:``,kind:``};function M(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function N(e,t=``){Tn={text:e,kind:t};let n=A?.querySelector(`#profile-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function En(e){try{return new Date(e).toLocaleDateString()}catch{return`—`}}async function Dn(){if(j){try{Cn=(await _.auth.profile()).stats}catch(e){N(e.message,`error`)}if(we(j))try{wn=await _.settings.get()}catch{}}}function On(e,t){return`<div class="profile-stat"><dt>${M(e)}</dt><dd>${M(t)}</dd></div>`}function kn(){return we(j)?`
    <section class="panel profile-settings">
      <div class="panel-head"><h2>Donate links</h2><span class="panel-tag">Owner only</span></div>
      <div class="profile-settings-body">
        <p class="hint">These power the PayPal &amp; Steam buttons in the site footer. Leave a field empty to hide that button.</p>
        <label class="field">
          <span>PayPal link</span>
          <input id="set-paypal" type="url" placeholder="https://www.paypal.com/paypalme/yourname" value="${M(wn.paypalUrl)}" />
        </label>
        <label class="field">
          <span>Steam trade link</span>
          <input id="set-steam" type="url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${M(wn.steamTradeUrl)}" />
        </label>
        <div class="actions">
          <button class="btn primary" id="set-save">Save donate links</button>
        </div>
      </div>
    </section>`:``}function An(){if(!j){A.innerHTML=`<div class="profile-shell"><div class="login-prompt">
      <p class="hint">Log in to view your profile.</p>
      <div class="actions"><button class="btn primary" data-open-auth="login">Log in</button><button class="btn" data-open-auth="register">Register</button></div>
    </div></div>`,A.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth)));return}let e=(j.username||`?`).charAt(0).toUpperCase(),t=Cn||{nadesTotal:0,nadesApproved:0,nadesPending:0,recommendations:0,comments:0};A.innerHTML=`
    <div class="profile-shell">
      <section class="panel profile-card">
        <div class="profile-head">
          <div class="profile-avatar">${j.avatarUrl?`<img src="${M(Te(j.avatarUrl))}" alt="${M(j.username)}" />`:M(e)}</div>
          <div>
            <h2 class="profile-name">${M(j.username)} <span class="nade-badge ${M(j.role)}">${M(j.role)}</span></h2>
            <p class="hint">${j.email?M(j.email):`No email set`} · member since ${En(j.createdAt)}</p>
            <div class="avatar-controls">
              <input type="file" id="avatar-file" accept="image/*" hidden />
              <button class="btn btn-sm" id="avatar-upload">${j.avatarUrl?`Change photo`:`Upload photo`}</button>
              ${j.avatarUrl?`<button class="btn btn-sm ghost" id="avatar-remove">Remove</button>`:``}
            </div>
          </div>
        </div>
        <dl class="profile-stats">
          ${On(`Nades submitted`,t.nadesTotal)}
          ${On(`Approved`,t.nadesApproved)}
          ${On(`Pending`,t.nadesPending)}
          ${On(`Commands recommended`,t.recommendations)}
          ${On(`Comments`,t.comments)}
        </dl>
      </section>
      <section class="panel profile-account">
        <div class="panel-head"><h2>Account</h2></div>
        <div class="profile-settings-body">
          <label class="field"><span>Username</span><input id="acc-username" type="text" value="${M(j.username)}" maxlength="80" /></label>
          <div class="actions"><button class="btn btn-sm" id="username-save">Save username</button></div>
          <div class="account-steam">
            ${j.steamId?`<p class="hint">Steam linked${j.steamPersona?`: <strong>${M(j.steamPersona)}</strong>`:``}.</p>
                   <button class="btn btn-sm ghost" id="steam-unlink">Unlink Steam</button>`:`<p class="hint">Connect your Steam account so you can also log in with Steam.</p>
                   <button class="btn btn-sm" id="steam-link">Connect Steam</button>`}
          </div>
        </div>
      </section>
      ${j.hasPassword?`<section class="panel profile-password">
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
      ${kn()}
      <div id="profile-status" class="status ${Tn.kind}">${M(Tn.text)}</div>
    </div>`,A.querySelector(`#set-save`)?.addEventListener(`click`,Rn),A.querySelector(`#pw-save`)?.addEventListener(`click`,Mn),A.querySelector(`#username-save`)?.addEventListener(`click`,Pn),A.querySelector(`#cred-save`)?.addEventListener(`click`,Fn),A.querySelector(`#steam-link`)?.addEventListener(`click`,In),A.querySelector(`#steam-unlink`)?.addEventListener(`click`,Ln);let n=A.querySelector(`#avatar-file`);A.querySelector(`#avatar-upload`)?.addEventListener(`click`,()=>n?.click()),n?.addEventListener(`change`,e=>jn(e.target.files?.[0])),A.querySelector(`#avatar-remove`)?.addEventListener(`click`,Nn)}async function jn(e){if(e){N(`Uploading image…`,``);try{await _.auth.uploadAvatar(e),await je(),N(`Profile image updated.`,`ok`)}catch(e){N(e.message,`error`)}}}async function Mn(){let e=A.querySelector(`#pw-current`)?.value||``,t=A.querySelector(`#pw-new`)?.value||``;try{await _.auth.changePassword({currentPassword:e,newPassword:t}),A.querySelector(`#pw-current`).value=``,A.querySelector(`#pw-new`).value=``,N(`Password updated.`,`ok`)}catch(e){N(e.message,`error`)}}async function Nn(){try{await _.auth.setAvatar(``),await je(),N(`Profile image removed.`,`ok`)}catch(e){N(e.message,`error`)}}async function Pn(){let e=A.querySelector(`#acc-username`)?.value||``;try{await _.auth.changeUsername(e),await je(),N(`Username updated.`,`ok`)}catch(e){N(e.message,`error`)}}async function Fn(){let e=A.querySelector(`#cred-email`)?.value||``,t=A.querySelector(`#cred-password`)?.value||``;try{await _.auth.setCredentials({email:e,password:t}),await je(),N(`Email & password saved — you can now log in without Steam.`,`ok`)}catch(e){N(e.message,`error`)}}async function In(){try{let e=await _.auth.steamLinkUrl();window.location.href=e}catch(e){N(e.message,`error`)}}async function Ln(){try{await _.auth.steamUnlink(),await je(),N(`Steam unlinked.`,`ok`)}catch(e){N(e.message,`error`)}}async function Rn(){let e=A.querySelector(`#set-paypal`)?.value||``,t=A.querySelector(`#set-steam`)?.value||``;try{wn=await _.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),N(`Donate links saved.`,`ok`),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))}catch(e){N(e.message,`error`)}}async function zn(){A=document.querySelector(`#profile-tool`),A&&(j=ke(),Ae(async e=>{j=e,await Dn(),An()}),An(),await Dn(),An())}var P,Bn=null,Vn=[],Hn=`top`,Un=!1,Wn={text:``,kind:``},Gn=new Set;function Kn(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function qn(e,t=``){Wn={text:e,kind:t};let n=P?.querySelector(`#configs-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Jn(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function Yn(e,t){let n=new Blob([t],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}async function Xn(){try{Vn=await _.configs.list({sort:Hn})}catch(e){qn(e.message,`error`)}tr()}function Zn(e){let t=Math.round(e),n=``;for(let e=1;e<=5;e+=1)n+=e<=t?`★`:`☆`;return n}function Qn(e){if(!Bn)return`<button class="btn btn-sm" data-open-auth="login">Log in to rate</button>`;if(e.authorId===Bn.id)return`<span class="hint">Your upload</span>`;let t=``;for(let n=1;n<=5;n+=1)t+=`<button class="star-btn ${n<=e.myRating?`on`:``}" data-rate="${e.id}" data-star="${n}" title="${n} star${n>1?`s`:``}">${n<=e.myRating?`★`:`☆`}</button>`;return`<span class="rate-label">Your rating:</span><span class="star-picker">${t}</span>`}function $n(e){let t=Gn.has(e.id),n=Bn&&(e.authorId===Bn.id||g(Bn));return`
    <article class="config-card" data-search="${Kn(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="config-head">
        <h3>${Kn(e.title)}</h3>
        <div class="config-rating" title="${e.avgRating} from ${e.ratingCount} rating(s)">
          <span class="stars">${Zn(e.avgRating)}</span>
          <span class="rating-num">${e.avgRating||`—`} (${e.ratingCount})</span>
        </div>
      </div>
      ${e.description?`<p class="config-desc">${Kn(e.description)}</p>`:``}
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
               ${e.hasConfig?`<div><strong>Config</strong><pre>${Kn(e.configText)}</pre></div>`:``}
               ${e.hasVideo?`<div><strong>Video settings</strong><pre>${Kn(e.videoText)}</pre></div>`:``}
             </div>`:``}
      <div class="config-foot">
        <span>by ${Kn(e.authorName)} · ${Jn(e.createdAt)}</span>
        <span class="config-rate">${Qn(e)}</span>
      </div>
    </article>`}function er(){return!Bn||!Un?``:`
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
    </section>`}function tr(){P.innerHTML=`
    <div class="configs-shell">
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Hn===`top`?`active`:``}" data-sort="top">Most rated</button>
          <button class="tool-tab ${Hn===`new`?`active`:``}" data-sort="new">Last uploaded</button>
        </div>
        <input id="cfg-search" type="search" class="cfg-search" placeholder="Search configs by title, author…" />
        ${Bn?`<button class="btn primary" id="cfg-new">Upload config</button>`:`<button class="btn primary" data-open-auth="login">Log in to upload</button>`}
      </div>
      ${er()}
      <div class="config-grid">
        ${Vn.length?Vn.map($n).join(``):`<p class="hint">No configs yet — be the first to upload one!</p>`}
      </div>
      <div id="configs-status" class="status ${Wn.kind}">${Kn(Wn.text)}</div>
    </div>`,rr()}function nr(e){let t=e.trim().toLowerCase();P.querySelectorAll(`.config-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function rr(){P.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),P.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Hn=e.dataset.sort,Xn()})),P.querySelector(`#cfg-search`)?.addEventListener(`input`,e=>nr(e.target.value)),P.querySelector(`#cfg-new`)?.addEventListener(`click`,()=>{Un=!0,tr()}),P.querySelector(`#cfg-cancel`)?.addEventListener(`click`,()=>{Un=!1,tr()}),P.querySelector(`#cfg-submit`)?.addEventListener(`click`,or),P.querySelector(`#cfg-config-file`)?.addEventListener(`change`,e=>ar(e.target,`#cfg-config`)),P.querySelector(`#cfg-video-file`)?.addEventListener(`change`,e=>ar(e.target,`#cfg-video`)),P.querySelectorAll(`[data-dl]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Vn.find(t=>String(t.id)===e.dataset.dl);t&&(e.dataset.kind===`config`?Yn(`${ir(t.title)}.cfg`,t.configText):Yn(`cs2_video.txt`,t.videoText))})),P.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Number(e.dataset.view);Gn.has(t)?Gn.delete(t):Gn.add(t),tr()})),P.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>cr(Number(e.dataset.del)))),P.querySelectorAll(`[data-rate]`).forEach(e=>e.addEventListener(`click`,()=>sr(Number(e.dataset.rate),Number(e.dataset.star))))}function ir(e){return(e||`config`).toLowerCase().replace(/[^a-z0-9]+/g,`_`).replace(/^_|_$/g,``).slice(0,40)||`config`}function ar(e,t){let n=e.files?.[0];if(!n)return;let r=new FileReader;r.onload=()=>{let e=P.querySelector(t);e&&(e.value=String(r.result||``))},r.readAsText(n)}async function or(){let e=P.querySelector(`#cfg-title`)?.value||``,t=P.querySelector(`#cfg-desc`)?.value||``,n=P.querySelector(`#cfg-config`)?.value||``,r=P.querySelector(`#cfg-video`)?.value||``;try{await _.configs.create({title:e,description:t,configText:n,videoText:r}),Un=!1,Hn=`new`,await Xn(),qn(`Config published!`,`ok`)}catch(e){qn(e.message,`error`)}}async function sr(e,t){try{let n=await _.configs.rate(e,t),r=Vn.find(t=>t.id===e);r&&(r.avgRating=n.avgRating,r.ratingCount=n.ratingCount,r.myRating=n.myRating),tr(),qn(`Thanks for rating!`,`ok`)}catch(e){qn(e.message,`error`)}}async function cr(e){try{await _.configs.remove(e),await Xn(),qn(`Config deleted.`,`ok`)}catch(e){qn(e.message,`error`)}}async function lr(){P=document.querySelector(`#configs-tool`),P&&(Bn=ke(),Ae(async e=>{Bn=e,await Xn()}),tr(),await Xn())}var F,I=null,ur=[],dr=[],fr={text:``,kind:``},pr=!1,mr=null;function L(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function hr(e,t=``){fr={text:e,kind:t};let n=F?.querySelector(`#highlights-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function gr(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function _r(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function vr(e){return/^https?:\/\//.test(e||``)?e:``}function yr(e){let t=vr(e);if(!t)return``;let n=_r(e);return n?`<iframe class="hl-embed" src="https://www.youtube.com/embed/${L(n)}" title="highlight" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e)?`<video class="hl-embed" src="${L(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${L(t)}" target="_blank" rel="noopener noreferrer">Open highlight ↗</a>`}async function br(){try{ur=await _.highlights.list({}),dr=g(I)?await _.admin.highlightReports():[]}catch(e){hr(e.message,`error`)}wr()}function xr(){return!g(I)||!dr.length?``:`
    <section class="panel panel-review">
      <h3>Reported highlights (${dr.length})</h3>
      ${dr.map(e=>`<div class="report-item">
            <div class="report-media">${yr(e.url)}</div>
            <div class="report-body">
              <strong>${L(e.title)}</strong> <span class="hint">by ${L(e.authorName)}</span>
              <ul class="report-reasons">
                ${e.reports.map(e=>`<li><strong>${L(e.reporterName)}:</strong> ${L(e.reason||`(no reason given)`)}</li>`).join(``)}
              </ul>
              <div class="actions">
                <button class="btn btn-sm" data-keep="${e.id}">Keep</button>
                <button class="btn btn-sm ghost" data-remove-hl="${e.id}">Delete highlight</button>
              </div>
            </div>
          </div>`).join(``)}
    </section>`}function Sr(e){let t=I&&(e.authorId===I.id||g(I));return`
    <article class="hl-card" data-search="${L(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="hl-media">${yr(e.url)}</div>
      <h3 class="hl-title">${L(e.title)}</h3>
      ${e.description?`<p class="hl-desc">${L(e.description)}</p>`:``}
      <div class="hl-foot">
        <span>by ${L(e.authorName)} · ${gr(e.createdAt)}</span>
        <span class="hl-actions">
          ${I?e.reportedByMe?`<span class="hint">Reported</span>`:`<button class="btn btn-sm ghost" data-report="${e.id}">Report</button>`:``}
          ${t?`<button class="btn btn-sm ghost" data-del="${e.id}">Delete</button>`:``}
        </span>
      </div>
      ${mr===e.id?`<form class="hl-report-form" data-report-form="${e.id}">
               <input type="text" maxlength="500" placeholder="Why are you reporting this? (optional)" />
               <button class="btn btn-sm" type="submit">Submit report</button>
               <button class="btn btn-sm ghost" type="button" data-cancel-report>Cancel</button>
             </form>`:``}
    </article>`}function Cr(){return!I||!pr?``:`
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
    </section>`}function wr(){F.innerHTML=`
    <div class="highlights-shell">
      <div class="configs-controls">
        <input id="hl-search" type="search" class="cfg-search" placeholder="Search highlights by title, author…" />
        ${I?`<button class="btn primary" id="hl-new">Share highlight</button>`:`<button class="btn primary" data-open-auth="login">Log in to share</button>`}
      </div>
      ${xr()}
      ${Cr()}
      <div class="hl-grid">
        ${ur.length?ur.map(Sr).join(``):`<p class="hint">No highlights yet — share the first one!</p>`}
      </div>
      <div id="highlights-status" class="status ${fr.kind}">${L(fr.text)}</div>
    </div>`,Er()}function Tr(e){let t=e.trim().toLowerCase();F.querySelectorAll(`.hl-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function Er(){F.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>qe(e.dataset.openAuth))),F.querySelector(`#hl-search`)?.addEventListener(`input`,e=>Tr(e.target.value)),F.querySelector(`#hl-new`)?.addEventListener(`click`,()=>{pr=!0,wr()}),F.querySelector(`#hl-cancel`)?.addEventListener(`click`,()=>{pr=!1,wr()}),F.querySelector(`#hl-submit`)?.addEventListener(`click`,Dr),F.querySelectorAll(`[data-report]`).forEach(e=>e.addEventListener(`click`,()=>{mr=Number(e.dataset.report),wr()})),F.querySelector(`[data-cancel-report]`)?.addEventListener(`click`,()=>{mr=null,wr()}),F.querySelector(`[data-report-form]`)?.addEventListener(`submit`,e=>{e.preventDefault(),Or(Number(e.currentTarget.dataset.reportForm),e.currentTarget.querySelector(`input`).value)}),F.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>kr(Number(e.dataset.del)))),F.querySelectorAll(`[data-keep]`).forEach(e=>e.addEventListener(`click`,()=>Ar(Number(e.dataset.keep),`keep`))),F.querySelectorAll(`[data-remove-hl]`).forEach(e=>e.addEventListener(`click`,()=>Ar(Number(e.dataset.removeHl),`delete`)))}async function Dr(){let e=F.querySelector(`#hl-title`)?.value||``,t=F.querySelector(`#hl-desc`)?.value||``,n=F.querySelector(`#hl-url`)?.value||``;try{await _.highlights.create({title:e,description:t,url:n}),pr=!1,await br(),hr(`Highlight shared!`,`ok`)}catch(e){hr(e.message,`error`)}}async function Or(e,t){try{await _.highlights.report(e,t),mr=null,await br(),hr(`Thanks — an admin will review your report.`,`ok`)}catch(e){hr(e.message,`error`)}}async function kr(e){try{await _.highlights.remove(e),await br(),hr(`Highlight deleted.`,`ok`)}catch(e){hr(e.message,`error`)}}async function Ar(e,t){try{await _.admin.reviewHighlight(e,t),await br(),hr(t===`delete`?`Highlight removed.`:`Reports cleared — highlight kept.`,`ok`)}catch(e){hr(e.message,`error`)}}async function jr(){F=document.querySelector(`#highlights-tool`),F&&(I=ke(),Ae(async e=>{I=e,await br()}),wr(),await br())}var R,Mr=null,z={pros:[],source:`seed`,lastSync:0},Nr=`featured`,Pr=``,Fr=null,Ir={text:``,kind:``};function B(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Lr(e,t=``){Ir={text:e,kind:t};let n=R?.querySelector(`#pros-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}async function Rr(){try{z=await _.pros.list({sort:Nr,q:Pr})}catch(e){Lr(e.message,`error`)}Gr()}var zr={"natus vincere":`#f4d000`,vitality:`#f5d20a`,falcons:`#0aa14f`,"team spirit":`#c8102e`,astralis:`#e4002b`,faze:`#e43b26`,g2:`#c8102e`};function Br(e){return zr[(e||``).toLowerCase()]||`#33415a`}function Vr(e){let t=(e.team||e.player||`?`).trim(),n=t.split(/\s+/);return(n.length>1?n.slice(0,3).map(e=>e[0]).join(``):t.slice(0,2)).toUpperCase()}function Hr(e){let t=e.photo||e.teamLogo||``,n=e.photo&&e.teamLogo?e.teamLogo:``,r=t?`<img class="pro-img" alt="${B(e.player)}" loading="lazy" src="${B(t)}"${n?` data-logo="${B(n)}"`:``} onerror="if(this.dataset.logo){this.src=this.dataset.logo;this.removeAttribute('data-logo');}else{this.remove();}" />`:``;return`<div class="pro-photo" style="--team:${Br(e.team)}"><span class="pro-monogram">${B(Vr(e))}</span>${r}</div>`}function Ur(e,t){return`<div class="pro-stat"><dt>${B(e)}</dt><dd>${t!=null&&t!==``?B(t):`—`}</dd></div>`}function Wr(e){return`
    <article class="pro-card" data-search="${B(`${e.player} ${e.team||``}`.toLowerCase())}">
      ${Hr(e)}
      <div class="pro-head">
        <div>
          <h3>${B(e.player)}</h3>
          ${e.team?`<p class="hint">${B(e.team)}</p>`:``}
        </div>
        <div class="pro-edpi"><span>${e.edpi??`—`}</span><small>eDPI</small></div>
      </div>
      <dl class="pro-stats">
        ${Ur(`DPI`,e.dpi)}
        ${Ur(`Sens`,e.sens)}
        ${Ur(`Zoom`,e.zoomSens)}
        ${Ur(`Hz`,e.hz)}
        ${Ur(`Resolution`,e.resolution)}
        ${Ur(`Aspect`,e.aspectRatio)}
      </dl>
    </article>`}function Gr(){let e=g(Mr)?`<div class="pros-admin-actions">
         <button class="btn btn-sm" id="pros-sync">Sync from prosettings.net</button>
         <button class="btn btn-sm ghost" id="pros-import">Import from HLTV</button>
       </div>`:``;R.innerHTML=`
    <div class="pros-shell">
      <div class="cmd-status-bar">
        <div><strong>Source:</strong> ${B(z.source)} · <strong>${z.pros.length}</strong> players${z.lastSync?` · synced ${B(new Date(z.lastSync).toLocaleDateString())}`:``}</div>
        ${e}
      </div>
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Nr===`featured`?`active`:``}" data-sort="featured">Featured</button>
          <button class="tool-tab ${Nr===`name`?`active`:``}" data-sort="name">Name</button>
          <button class="tool-tab ${Nr===`edpi`?`active`:``}" data-sort="edpi">Lowest eDPI</button>
          <button class="tool-tab ${Nr===`edpi-desc`?`active`:``}" data-sort="edpi-desc">Highest eDPI</button>
        </div>
        <input id="pros-search" type="search" class="cfg-search" placeholder="Search player or team…" value="${B(Pr)}" />
      </div>
      <p class="hint">${z.source===`prosettings`?`Live from prosettings.net.`:z.source===`seed`?`Built-in list. Admins can sync live data from prosettings.net.`:`Source: ${B(z.source)}.`}</p>
      <div class="pro-grid">
        ${z.pros.length?z.pros.map(Wr).join(``):`<p class="hint">No pro settings yet.</p>`}
      </div>
      <div id="pros-status" class="status ${Ir.kind}">${B(Ir.text)}</div>
    </div>`,Kr()}function Kr(){R.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Nr=e.dataset.sort,Rr()}));let e=R.querySelector(`#pros-search`);e&&e.addEventListener(`input`,e=>{Pr=e.target.value,clearTimeout(Fr),Fr=setTimeout(async()=>{await Rr();let e=R.querySelector(`#pros-search`);e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},300)}),R.querySelector(`#pros-sync`)?.addEventListener(`click`,qr),R.querySelector(`#pros-import`)?.addEventListener(`click`,Jr)}async function qr(){let e=R.querySelector(`#pros-sync`);e&&(e.disabled=!0),Lr(`Syncing from prosettings.net…`,``);try{let e=await _.admin.syncPros();await Rr(),e.synced?Lr(`Synced ${e.count} players from ${e.source}.`,`ok`):Lr(`Sync failed: ${e.reason||`unknown error`}. Kept the current list.`,`error`)}catch(e){Lr(e.message,`error`)}finally{let e=R.querySelector(`#pros-sync`);e&&(e.disabled=!1)}}function Jr(){en({title:`Import pro settings from HLTV`,description:`HLTV has a Cloudflare check that blocks servers. Open HLTV in your browser, complete the verification, then paste a JSON list of players here. Each item: {"player","team","dpi","sens","zoomSens","hz","resolution","aspectRatio","photo","teamLogo"}.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,placeholder:`[{"player":"s1mple","team":"Natus Vincere","dpi":400,"sens":3.09,"hz":1000,"resolution":"1280x960","aspectRatio":"4:3"}]`,onImport:async e=>{let t=await _.admin.importPros(e);return await Rr(),`Imported ${t.count} players.`}})}async function Yr(){R=document.querySelector(`#pros-tool`),R&&(Mr=ke(),Ae(e=>{Mr=e,Gr()}),Gr(),await Rr())}var V,Xr=null,Zr=`overview`,Qr={text:``,kind:``},H={nades:0,comments:0,reports:0},U={},$r=[{id:`overview`,label:`Overview`},{id:`nades`,label:`Nades`},{id:`comments`,label:`Comments`},{id:`reports`,label:`Reports`},{id:`users`,label:`Users`},{id:`sync`,label:`Data sync`},{id:`contact`,label:`Contact`},{id:`settings`,label:`Site settings`,ownerOnly:!0}];function W(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function ei(e,t=``){Qr={text:e,kind:t};let n=V?.querySelector(`#admin-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function ti(e){try{return new Date(e).toLocaleString()}catch{return`—`}}async function ni(){try{let[e,t,n]=await Promise.all([_.admin.pendingCount().catch(()=>0),_.admin.pendingCommentsCount().catch(()=>0),_.admin.highlightReportsCount().catch(()=>0)]);H={nades:e,comments:t,reports:n}}catch{}}function ri(){let e=(e,t,n)=>`<button class="admin-stat" data-goto="${n}">
       <span class="admin-stat-num">${t}</span>
       <span class="admin-stat-label">${W(e)}</span>
     </button>`;return`
    <div class="admin-stats">
      ${e(`Nades to review`,H.nades,`nades`)}
      ${e(`Comments to review`,H.comments,`comments`)}
      ${e(`Highlight reports`,H.reports,`reports`)}
    </div>
    <p class="hint">Use the tabs above to moderate content, manage users, sync data sources, and read contact messages.</p>`}function ii(){let e=U.nades||[];return e.length?e.map(e=>{let t=(e.media||[]).map(e=>`
        <div class="admin-media">
          <a href="${W(e.url)}" target="_blank" rel="noopener noreferrer">${W(e.kind||`media`)}</a>
          <span class="nade-badge ${W(e.status)}">${W(e.status)}</span>
          ${e.status===`pending`?`<button class="btn btn-sm" data-media-approve="${e.id}">Approve</button>
                 <button class="btn btn-sm ghost" data-media-reject="${e.id}">Reject</button>`:``}
        </div>`).join(``);return`
        <article class="panel admin-item">
          <div class="admin-item-head">
            <strong>${W(e.title||`Untitled`)}</strong>
            <span class="nade-badge ${W(e.status)}">${W(e.status)}</span>
          </div>
          <p class="hint">${W(e.map)} · ${W(e.type)} · ${W(e.side||``)} · ${W(e.technique||``)} · by ${W(e.authorName||e.author_name||`?`)}</p>
          ${t||`<p class="hint">No media.</p>`}
          <div class="actions">
            <button class="btn btn-sm" data-nade-approve="${e.id}">Approve nade</button>
            <button class="btn btn-sm ghost" data-nade-reject="${e.id}">Reject nade</button>
          </div>
        </article>`}).join(``):`<p class="hint">Nothing pending. All nades are reviewed.</p>`}function ai(){let e=U.comments||[];return e.length?e.map(e=>`
      <article class="panel admin-item">
        <p>${W(e.body)}</p>
        <p class="hint">by ${W(e.username)} on <code>${W(e.commandKey)}</code> · ${ti(e.createdAt)}</p>
        <div class="actions">
          <button class="btn btn-sm" data-comment-approve="${e.id}">Approve</button>
          <button class="btn btn-sm ghost" data-comment-reject="${e.id}">Reject</button>
        </div>
      </article>`).join(``):`<p class="hint">No comments pending review.</p>`}function oi(){let e=U.reports||[];return e.length?e.map(e=>{let t=(e.reports||[]).map(e=>`<li>${W(e.reason||`No reason`)} — <span class="hint">${W(e.reporterName||`?`)}</span></li>`).join(``);return`
        <article class="panel admin-item">
          <div class="admin-item-head">
            <a href="${W(e.url)}" target="_blank" rel="noopener noreferrer"><strong>${W(e.title)}</strong></a>
            <span class="nade-badge pending">${(e.reports||[]).length} report(s)</span>
          </div>
          <p class="hint">by ${W(e.authorName)}</p>
          <ul class="admin-reasons">${t}</ul>
          <div class="actions">
            <button class="btn btn-sm ghost" data-report-keep="${e.id}">Keep</button>
            <button class="btn btn-sm danger" data-report-delete="${e.id}">Delete highlight</button>
          </div>
        </article>`}).join(``):`<p class="hint">No open highlight reports.</p>`}function si(){let e=U.users||[];if(!e.length)return`<p class="hint">No users.</p>`;let t=Date.now();return`<div class="admin-users">${e.map(e=>{let n=e.bannedUntil&&new Date(e.bannedUntil).getTime()>t,r=e.role===`owner`;return`
        <div class="admin-user">
          <div class="admin-user-main">
            <strong>${W(e.username)}</strong> <span class="nade-badge ${W(e.role)}">${W(e.role)}</span>
            ${n?`<span class="nade-badge rejected">banned</span>`:``}
            <div class="hint">${W(e.email||(e.steamId?`Steam account`:`no email`))} · joined ${new Date(e.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="admin-user-actions">
            ${r?`<span class="hint">owner</span>`:`<select data-role="${e.id}">
                     <option value="user" ${e.role===`user`?`selected`:``}>user</option>
                     <option value="admin" ${e.role===`admin`?`selected`:``}>admin</option>
                   </select>
                   ${n?`<button class="btn btn-sm" data-unban="${e.id}">Unban</button>`:`<input type="number" min="1" placeholder="hrs" class="admin-ban-hrs" data-ban-hrs="${e.id}" />
                          <button class="btn btn-sm ghost" data-ban="${e.id}">Ban</button>
                          <button class="btn btn-sm danger" data-ban-perma="${e.id}">Ban forever</button>`}`}
          </div>
        </div>`}).join(``)}</div>`}function ci(){return`
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
    </div>`}function li(){let e=U.contact||[];return e.length?e.map(e=>`
      <article class="panel admin-item">
        <div class="admin-item-head">
          <strong>${W(e.subject||`(no subject)`)}</strong>
          <span class="hint">${ti(e.created_at)}</span>
        </div>
        <p class="hint">${W(e.name)} · <a href="mailto:${W(e.email)}">${W(e.email)}</a> · ${e.sent?`emailed`:`stored only`}</p>
        <p class="admin-message">${W(e.message)}</p>
      </article>`).join(``):`<p class="hint">No contact messages.</p>`}function ui(){let e=U.settings||{paypalUrl:``,steamTradeUrl:``};return`
    <div class="panel admin-item">
      <div class="admin-item-head"><strong>Donate links</strong><span class="panel-tag">Owner only</span></div>
      <p class="hint">Power the PayPal &amp; Steam buttons in the footer. Empty = hidden.</p>
      <label class="field"><span>PayPal link</span><input id="set-paypal" type="url" value="${W(e.paypalUrl)}" placeholder="https://www.paypal.com/paypalme/yourname" /></label>
      <label class="field"><span>Steam trade link</span><input id="set-steam" type="url" value="${W(e.steamTradeUrl)}" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." /></label>
      <div class="actions"><button class="btn primary" id="save-settings">Save donate links</button></div>
    </div>`}var di={overview:ri,nades:ii,comments:ai,reports:oi,users:si,sync:ci,contact:li,settings:ui};async function fi(e){try{e===`overview`?await ni():e===`nades`?U.nades=await _.admin.pending():e===`comments`?U.comments=await _.admin.pendingComments():e===`reports`?U.reports=await _.admin.highlightReports():e===`users`?U.users=await _.admin.users():e===`contact`?U.contact=await _.admin.contactMessages():e===`settings`&&(U.settings=await _.settings.get())}catch(e){ei(e.message,`error`)}}function pi(){if(!V)return;if(!g(Xr)){V.innerHTML=`<div class="admin-shell"><div class="login-prompt">
      <p class="hint">This area is for admins only.</p>
      ${Xr?``:`<div class="actions"><button class="btn primary" data-open-auth="login">Log in</button></div>`}
    </div></div>`,V.querySelector(`[data-open-auth]`)?.addEventListener(`click`,()=>qe(`login`));return}let e=$r.filter(e=>!e.ownerOnly||we(Xr)).map(e=>`<button class="tool-tab ${Zr===e.id?`active`:``}" data-section="${e.id}">${W(e.label)}${e.id===`nades`&&H.nades?` (${H.nades})`:``}${e.id===`comments`&&H.comments?` (${H.comments})`:``}${e.id===`reports`&&H.reports?` (${H.reports})`:``}</button>`).join(``),t=(di[Zr]||ri)();V.innerHTML=`
    <div class="admin-shell">
      <h2 class="admin-title">Admin</h2>
      <div class="admin-nav sort-tabs">${e}</div>
      <div class="admin-body">${t}</div>
      <div id="admin-status" class="status ${Qr.kind}">${W(Qr.text)}</div>
    </div>`,hi()}async function mi(e){Zr=e,pi(),await fi(e),pi()}function hi(){V.querySelectorAll(`[data-section]`).forEach(e=>e.addEventListener(`click`,()=>mi(e.dataset.section))),V.querySelectorAll(`[data-goto]`).forEach(e=>e.addEventListener(`click`,()=>mi(e.dataset.goto)));let e=async(e,t)=>{try{await e(),t&&ei(t,`ok`)}catch(e){ei(e.message,`error`)}},t=async()=>{await fi(Zr),await ni(),pi()};V.querySelectorAll(`[data-nade-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewNade(n.dataset.nadeApprove,`approved`),await t()},`Nade approved.`))),V.querySelectorAll(`[data-nade-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewNade(n.dataset.nadeReject,`rejected`),await t()},`Nade rejected.`))),V.querySelectorAll(`[data-media-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewMedia(n.dataset.mediaApprove,`approved`),await t()},`Media approved.`))),V.querySelectorAll(`[data-media-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewMedia(n.dataset.mediaReject,`rejected`),await t()},`Media rejected.`))),V.querySelectorAll(`[data-comment-approve]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewComment(n.dataset.commentApprove,`approved`),await t()},`Comment approved.`))),V.querySelectorAll(`[data-comment-reject]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewComment(n.dataset.commentReject,`rejected`),await t()},`Comment rejected.`))),V.querySelectorAll(`[data-report-keep]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewHighlight(n.dataset.reportKeep,`keep`),await t()},`Kept highlight.`))),V.querySelectorAll(`[data-report-delete]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.reviewHighlight(n.dataset.reportDelete,`delete`),await t()},`Highlight deleted.`))),V.querySelectorAll(`[data-role]`).forEach(n=>n.addEventListener(`change`,()=>e(async()=>{await _.admin.setRole(n.dataset.role,n.value),await t()},`Role updated.`))),V.querySelectorAll(`[data-unban]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.unbanUser(n.dataset.unban),await t()},`User unbanned.`))),V.querySelectorAll(`[data-ban]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{let e=Number(V.querySelector(`[data-ban-hrs="${n.dataset.ban}"]`)?.value);if(!Number.isFinite(e)||e<=0)return ei(`Enter a positive number of hours.`,`error`);await _.admin.banUser(n.dataset.ban,{hours:e}),await t(),ei(`User banned.`,`ok`)}))),V.querySelectorAll(`[data-ban-perma]`).forEach(n=>n.addEventListener(`click`,()=>e(async()=>{await _.admin.banUser(n.dataset.banPerma,{permanent:!0}),await t()},`User banned permanently.`))),V.querySelector(`#sync-commands`)?.addEventListener(`click`,()=>e(async()=>{let e=await _.admin.syncCommands();ei(e.synced?`Commands synced (${e.count}).`:`No sync: ${e.reason||`no source`}.`,e.synced?`ok`:`error`)})),V.querySelector(`#check-cs2`)?.addEventListener(`click`,()=>e(async()=>{let e=await _.admin.checkCommandsCs2();ei(`CS2 build: ${e.build||`unknown`}${e.changed?` (changed → re-synced)`:``}.`,`ok`)})),V.querySelector(`#sync-pros`)?.addEventListener(`click`,()=>e(async()=>{let e=await _.admin.syncPros();ei(e.synced?`Synced ${e.count} pros from ${e.source}.`:`Sync failed: ${e.reason}.`,e.synced?`ok`:`error`)})),V.querySelector(`#import-commands`)?.addEventListener(`click`,()=>en({title:`Import commands`,description:`Paste the CS2 console-commands wiki page (wikitext) or a JSON array of commands.`,sourceUrl:`https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_command_variables`,sourceLabel:`Open wiki`,onImport:async e=>`Imported ${(await _.admin.importCommands(e)).count} commands.`})),V.querySelector(`#import-pros`)?.addEventListener(`click`,()=>en({title:`Import pro settings from HLTV`,description:`Open HLTV, complete the check, then paste a JSON list of players.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,onImport:async e=>{let t=await _.admin.importPros(e);return await fi(`sync`),`Imported ${t.count} players.`}})),V.querySelector(`#save-settings`)?.addEventListener(`click`,()=>e(async()=>{let e=V.querySelector(`#set-paypal`)?.value||``,t=V.querySelector(`#set-steam`)?.value||``;U.settings=await _.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))},`Donate links saved.`))}function gi(e){document.querySelectorAll(`.admin-only`).forEach(t=>t.classList.toggle(`hidden`,!g(e)))}async function _i(){V=document.querySelector(`#admin-tool`),V&&(Xr=ke(),gi(Xr),Ae(async e=>{let t=g(Xr);Xr=e,gi(e),g(e)&&!t&&await ni(),pi()}),pi(),g(Xr)&&(await ni(),pi()))}function vi(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function yi(){let e=ke(),t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact us">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Contact us</h2>
      <p class="hint">Send us a message and we'll get back to you at your email.</p>
      <form id="contact-form" class="auth-form-modal">
        <label class="field"><span>Your name</span><input id="contact-name" type="text" value="${vi(e?.username||``)}" /></label>
        <label class="field"><span>Your email</span><input id="contact-email" type="email" value="${vi(e?.email||``)}" /></label>
        <label class="field"><span>Subject</span><input id="contact-subject" type="text" placeholder="What's this about?" /></label>
        <label class="field"><span>Message</span><textarea id="contact-message" rows="5" placeholder="How can we help?"></textarea></label>
        <button class="btn primary" type="submit">Send message</button>
        <p class="status" id="contact-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#contact-status`);t.querySelector(`#contact-form`).addEventListener(`submit`,async e=>{e.preventDefault();let i={name:t.querySelector(`#contact-name`).value,email:t.querySelector(`#contact-email`).value,subject:t.querySelector(`#contact-subject`).value,message:t.querySelector(`#contact-message`).value};r.textContent=`Sending…`,r.className=`status`;try{await _.contact.send(i),r.textContent=`Thanks! Your message has been sent.`,r.className=`status ok`,setTimeout(n,1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#contact-name`)?.focus()}var bi={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]};function xi(e){if(e.color===5)return`rgb(${e.red}, ${e.green}, ${e.blue})`;let t=bi[e.color]??bi[1];return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}function Si(e){return e.alphaEnabled?Math.min(1,Math.max(0,e.alpha/255)):1}function Ci(e,t,n=1){let r=e.getContext(`2d`);if(!r)return;let i=e.width,a=i/2,o=i/2;r.clearRect(0,0,i,i);let s=r.createLinearGradient(0,0,i,i);s.addColorStop(0,`#3a4a38`),s.addColorStop(.45,`#5c6b52`),s.addColorStop(1,`#2a3328`),r.fillStyle=s,r.fillRect(0,0,i,i);let c=Math.max(24,Math.round(i/9));r.strokeStyle=`rgba(255,255,255,0.06)`,r.lineWidth=Math.max(1,Math.round(i/280));for(let e=0;e<i;e+=c)r.beginPath(),r.moveTo(e,0),r.lineTo(e,i),r.stroke(),r.beginPath(),r.moveTo(0,e),r.lineTo(i,e),r.stroke();if(!t){r.globalAlpha=.35,r.fillStyle=`#fff`,r.font=`${Math.round(i*.05)}px Outfit, sans-serif`,r.textAlign=`center`,r.fillText(`Enter a code or commands`,a,o+i*.02),r.globalAlpha=1;return}let l=xi(t),u=Si(t),d=Math.max(0,Math.round(t.length*n)),f=Math.max(1,Math.round(t.thickness*n)),ee=Math.round(t.gap*n),p=t.outlineEnabled?Math.max(1,Math.round(t.outline*n)):0,te=Math.round(a)+(f%2,0),ne=Math.round(o),m=(e,t,n,i)=>{n<=0||i<=0||(p>0&&(r.globalAlpha=u,r.fillStyle=`#000`,r.fillRect(e-p,t-p,n+p*2,i+p*2)),r.globalAlpha=u,r.fillStyle=l,r.fillRect(e,t,n,i))},re=Math.floor(f/2);if(d>0&&(m(te+ee,ne-re,d,f),m(te-ee-d,ne-re,d,f),m(te-re,ne+ee,f,d),t.tStyleEnabled||m(te-re,ne-ee-d,f,d)),t.centerDotEnabled){let e=f;m(te-Math.floor(e/2),ne-Math.floor(e/2),e,e)}r.globalAlpha=1,(t.style===2||t.style===3)&&(r.globalAlpha=.6,r.fillStyle=`#fff`,r.font=`${Math.round(i*.039)}px JetBrains Mono, monospace`,r.textAlign=`center`,r.fillText(`style ${t.style} · dynamic (shown static)`,a,i-Math.round(i*.05)),r.globalAlpha=1)}var G=132;function wi({source:e,stage:t,toggleBtn:n,zoomSelect:r}){let i=document.createElement(`canvas`);i.className=`magnifier-lens hidden`,i.width=G,i.height=G,t.appendChild(i);let a=i.getContext(`2d`),o=!1,s=Number(r?.value)||4,c=null;function l(e){o=e,n.classList.toggle(`active`,e),n.setAttribute(`aria-pressed`,String(e)),t.classList.toggle(`magnifier-on`,e),e||(i.classList.add(`hidden`),c=null)}function u(){if(!o||!c||!a)return;let t=G/s;a.imageSmoothingEnabled=!1,a.clearRect(0,0,G,G),a.fillStyle=`#0e1017`,a.fillRect(0,0,G,G);try{a.drawImage(e,c.sx-t/2,c.sy-t/2,t,t,0,0,G,G)}catch{}a.strokeStyle=`rgba(255,255,255,0.28)`,a.lineWidth=1,a.beginPath(),a.moveTo(66.5,0),a.lineTo(66.5,G),a.moveTo(0,66.5),a.lineTo(G,66.5),a.stroke()}function d(n,r){if(!o)return;let a=e.getBoundingClientRect(),s=n-a.left,l=r-a.top;if(s<0||l<0||s>a.width||l>a.height){i.classList.add(`hidden`);return}c={sx:s*(e.width/a.width),sy:l*(e.height/a.height)};let d=t.getBoundingClientRect();i.style.left=`${n-d.left-G/2}px`,i.style.top=`${r-d.top-G/2}px`,i.classList.remove(`hidden`),u()}e.addEventListener(`mousemove`,e=>d(e.clientX,e.clientY)),e.addEventListener(`mouseleave`,()=>{o&&i.classList.add(`hidden`)});let f=e=>{!o||!e.touches[0]||(e.preventDefault(),d(e.touches[0].clientX,e.touches[0].clientY))};return e.addEventListener(`touchstart`,f,{passive:!1}),e.addEventListener(`touchmove`,f,{passive:!1}),n.addEventListener(`click`,()=>l(!o)),r&&r.addEventListener(`change`,()=>{s=Number(r.value)||4,u()}),{refresh:u,setEnabled:l}}var K={cs2:{id:`cs2`,name:`Counter-Strike 2`,yaw:.022,supportsMYaw:!0},csgo:{id:`csgo`,name:`CS:GO`,yaw:.022},valorant:{id:`valorant`,name:`Valorant`,yaw:.07},apex:{id:`apex`,name:`Apex Legends`,yaw:.022},overwatch2:{id:`overwatch2`,name:`Overwatch 2`,yaw:.0066},r6:{id:`r6`,name:`Rainbow Six Siege`,yaw:.00572958},fortnite:{id:`fortnite`,name:`Fortnite`,yaw:.005555},cod:{id:`cod`,name:`Call of Duty`,yaw:.0066},tf2:{id:`tf2`,name:`Team Fortress 2`,yaw:.022},marvel:{id:`marvel`,name:`Marvel Rivals`,yaw:.022},deadlock:{id:`deadlock`,name:`Deadlock`,yaw:.044},tf:{id:`tf`,name:`The Finals`,yaw:.0066},custom:{id:`custom`,name:`Custom (yaw)`,yaw:.022,custom:!0}},Ti=Object.values(K);function Ei(e,t=.022,n){let r=K[e];if(!r)throw Error(`Unknown game: ${e}`);return r.custom?Number(n)>0?Number(n):r.yaw:r.supportsMYaw?t:r.yaw}function Di(e,t,n){return e<=0||t<=0||n<=0?NaN:914.4/(e*t*n)}function Oi({sourceGame:e,targetGame:t,sourceSens:n,sourceDpi:r,targetDpi:i,sourceMYaw:a=.022,targetMYaw:o=.022,sourceCustomYaw:s,targetCustomYaw:c}){let l=Ei(e,a,s),u=Ei(t,o,c),d=r/i*n*(l/u),f=Di(n,r,l),ee=Di(d,i,u);return{targetSensitivity:d,cm360:f,inches360:f/2.54,sourceEdpi:n*r,targetEdpi:d*i,sourceYaw:l,targetYaw:u,targetCm360:ee,ratio:l/u}}function q(e,t=4){return Number.isFinite(e)?String(Number(e.toFixed(t))):`—`}function ki(e,t=1){return Number.isFinite(e)?e.toFixed(t):`—`}function Ai(e){return Ti.map(t=>`<option value="${t.id}"${t.id===e?` selected`:``}>${t.name}</option>`).join(``)}var ji=/^CSGO(-[\w]{5}){5}$/i,Mi=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.1 7.3c.3 2-.3 3.6-1.5 4.8-1.2 1.2-3 1.8-5.2 1.8h-1.1c-.4 0-.8.3-.9.8l-.7 4.5-.2 1.1c0 .3-.3.5-.6.5H6.2c-.3 0-.5-.3-.4-.6L8 6.1c.1-.6.6-1 1.2-1h5.3c2.7 0 4.7.9 5.3 2.9.1.4.2.9.3 1.3z"/><path fill="currentColor" opacity=".55" d="M8.9 9.3c.1-.6.6-1 1.2-1h4.2c.6 0 1.1.1 1.6.2-.3-1.6-1.7-2.4-3.9-2.4H6.8c-.4 0-.8.3-.9.8L3.5 21c0 .3.2.6.5.6h3.1l1.8-12.3z"/></svg>`,Ni=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Zm-1.87-2.51a1.88 1.88 0 1 0 3.76 0 1.88 1.88 0 0 0-3.76 0Z"/></svg>`,Pi=document.querySelector(`#app`);Pi.innerHTML=`
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
            <span class="panel-tag" id="preview-mode-tag">Actual in-game size</span>
          </div>
          <div class="preview-stage">
            <canvas id="preview-canvas" width="280" height="280" aria-label="Crosshair preview"></canvas>
          </div>
          <div class="preview-modes" role="group" aria-label="Preview size">
            <button type="button" class="pmode active" data-pmode="ingame" aria-selected="true">In-game</button>
            <button type="button" class="pmode" data-pmode="fullscreen" aria-selected="false">Full screen</button>
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
              <span>Generated share code</span>
              <input id="ed-sharecode" type="text" readonly spellcheck="false" />
            </label>
            <label class="field">
              <span>Console commands</span>
              <textarea id="ed-commands" rows="10" readonly spellcheck="false"></textarea>
            </label>
            <div class="actions">
              <button class="btn" id="ed-copy-code">Copy code</button>
              <button class="btn" id="ed-copy-commands">Copy commands</button>
              <button class="btn ghost" id="ed-reset">Reset</button>
            </div>
            <p class="hint">Drag the sliders to design your crosshair — the preview, share code, and commands update live.</p>
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
          <p class="sens-note">A 7-round binary search: test both values in your usual practice routine, pick the side that feels more controllable, and repeat until it converges on your ideal sensitivity.</p>
        </section>

        <section class="panel converter-panel">
          <details class="psa-instructions" open>
            <summary>How the PSA method works</summary>
            <ol class="psa-steps-list">
              <li>Enter your current in-game sensitivity below and press <strong>Start PSA</strong>.</li>
              <li>You'll get two options — a <strong>lower</strong> and a <strong>higher</strong> sensitivity. Set each one in-game and test it with the same routine (e.g. <code>aim_botz</code>, a deathmatch, or retakes).</li>
              <li>Pick the side that felt <strong>more controllable</strong> — better first-shot accuracy and target tracking.</li>
              <li>The range narrows around your choice. Repeat for all <strong>7 rounds</strong>.</li>
              <li>After the final round you get your <strong>recommended sensitivity</strong>. Apply it via <em>Settings → Mouse</em> or the console: <code>sensitivity &lt;value&gt;</code>.</li>
            </ol>
            <p class="hint">Tips: give each value equal test time, keep your DPI &amp; resolution the same throughout, and use the same map/routine every round for a fair comparison.</p>
          </details>
          <label class="field">
            <span>Starting in-game sensitivity</span>
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
`;var Fi=document.querySelector(`#preview-canvas`),Ii=document.querySelector(`#preview-stats`),Li=document.querySelector(`#preview-res`),Ri=document.querySelector(`#preview-res-scale`),zi=`ingame`;function Bi(){let e=zi===`fullscreen`?1080:280;Fi.width!==e&&(Fi.width=e,Fi.height=e),Fi.style.imageRendering=zi===`fullscreen`?`auto`:`pixelated`}Bi();var Vi=[{id:`1920x1080`,h:1080,label:`1920 × 1080 (16:9)`},{id:`2560x1440`,h:1440,label:`2560 × 1440 (16:9)`},{id:`3840x2160`,h:2160,label:`3840 × 2160 (4K)`},{id:`1600x900`,h:900,label:`1600 × 900 (16:9)`},{id:`1366x768`,h:768,label:`1366 × 768 (16:9)`},{id:`1280x960`,h:960,label:`1280 × 960 (4:3)`},{id:`1024x768`,h:768,label:`1024 × 768 (4:3)`},{id:`1280x1024`,h:1024,label:`1280 × 1024 (5:4)`}],Hi=null;function Ui(){return zi===`fullscreen`?Fi.height/1080:(Vi.find(e=>e.id===Li?.value)||Vi[0]).h/1080}var Wi=wi({source:Fi,stage:document.querySelector(`.preview-stage`),toggleBtn:document.querySelector(`#magnifier-toggle`),zoomSelect:document.querySelector(`#magnifier-zoom`)});function Gi(e){if(Hi=e,Ci(Fi,e,Ui()),Ri)if(e){let t=Vi.find(e=>e.id===Li?.value)||Vi[0],n=t.h/1080;Ri.textContent=`≈ ${Math.max(0,Math.round(e.length*n))}px arms · ${Math.max(1,Math.round(e.thickness*n))}px thick @ ${t.h}p`}else Ri.textContent=``;Wi.refresh()}function Ki(e){zi=e===`fullscreen`?`fullscreen`:`ingame`,Bi(),document.querySelectorAll(`.pmode`).forEach(e=>{let t=e.dataset.pmode===zi;e.classList.toggle(`active`,t),e.setAttribute(`aria-selected`,String(t))});let t=document.querySelector(`#preview-mode-tag`);t&&(t.textContent=zi===`fullscreen`?`Relative to full screen`:`Actual in-game size`),Gi(Hi)}document.querySelectorAll(`.pmode`).forEach(e=>e.addEventListener(`click`,()=>Ki(e.dataset.pmode)));var J=document.querySelector(`#crosshair-status`),qi=document.querySelector(`#sensitivity-status`),Ji=document.querySelector(`#sharecode-input`),Yi=document.querySelector(`#commands-output`),Xi=document.querySelector(`#commands-input`),Zi=document.querySelector(`#sharecode-output`),Y=document.querySelector(`#sens-from-game`),X=document.querySelector(`#sens-to-game`),Qi=document.querySelector(`#sens-source`),$i=document.querySelector(`#sens-target`),ea=document.querySelector(`#sens-source-dpi`),ta=document.querySelector(`#sens-target-dpi`),na=document.querySelector(`#sens-source-myaw`),ra=document.querySelector(`#sens-target-myaw`),ia=document.querySelector(`#sens-source-yaw`),aa=document.querySelector(`#sens-target-yaw`),oa=document.querySelector(`#source-yaw-field`),sa=document.querySelector(`#target-yaw-field`),ca=document.querySelector(`#m-yaw-fields`),la=document.querySelector(`#sens-cm360`),ua=document.querySelector(`#sens-stats`),da=document.querySelector(`#sens-formula`),fa=`CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK`,pa=`cl_crosshairstyle 4
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
cl_crosshair_recoil 0`;function Z(e,t,n=``){e&&(e.textContent=t,e.className=`status${n?` ${n}`:``}`)}function ma(e){Gi(e),Ii.innerHTML=`
    <div><dt>Style</dt><dd>${e.style}</dd></div>
    <div><dt>Size</dt><dd>${e.length}</dd></div>
    <div><dt>Gap</dt><dd>${e.gap}</dd></div>
    <div><dt>Thickness</dt><dd>${e.thickness}</dd></div>
    <div><dt>Dot</dt><dd>${e.centerDotEnabled?`On`:`Off`}</dd></div>
    <div><dt>Outline</dt><dd>${e.outlineEnabled?e.outline:`Off`}</dd></div>
    <div><dt>Color</dt><dd>${e.color===5?`RGB ${e.red}/${e.green}/${e.blue}`:`Preset ${e.color}`}</dd></div>
    <div><dt>Alpha</dt><dd>${e.alphaEnabled?e.alpha:`Off`}</dd></div>
  `}function ha(e){return e.trim().replace(/\s+/g,``).replace(/^csgo/i,`CSGO`)}function ga(){let e=Ji.value.trim();if(!e){Z(J,`Paste a crosshair share code first.`,`error`);return}let t=ha(e);if(!ji.test(t)){Z(J,`Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`,`error`);return}try{let e=d(t);Ji.value=t,Yi.value=se(ee(e)),ma(e),Z(J,`Converted share code to console commands.`,`ok`)}catch(e){e instanceof i||e instanceof r?Z(J,`That share code is not a valid crosshair code.`,`error`):Z(J,e instanceof Error?e.message:`Failed to decode share code.`,`error`)}}function _a(){let e=Xi.value.trim();if(!e){Z(J,`Paste crosshair console commands first.`,`error`);return}try{let t=oe(e);Zi.value=f(t),ma(t),Z(J,`Converted commands to share code.`,`ok`)}catch(e){Z(J,e instanceof Error?e.message:`Failed to encode share code.`,`error`)}}async function va(e,t,n){if(!t){Z(e,`Nothing to copy for ${n}.`,`error`);return}try{await navigator.clipboard.writeText(t),Z(e,`Copied ${n} to clipboard.`,`ok`)}catch{Z(e,`Clipboard access failed. Select and copy manually.`,`error`)}}function ya(){let e=K[Y.value]?.supportsMYaw||K[X.value]?.supportsMYaw;ca?.classList.toggle(`hidden`,!e),oa?.classList.toggle(`hidden`,!K[Y.value]?.custom),sa?.classList.toggle(`hidden`,!K[X.value]?.custom)}function ba(){let e=Number(Qi.value),t=Number(ea.value),n=Number(ta.value),r=Number(na.value)||.022,i=Number(ra.value)||.022,a=Number(ia.value),o=Number(aa.value);if(ya(),K[Y.value]?.custom&&!(a>0)){Z(qi,`Enter a valid source custom yaw (° per count).`,`error`);return}if(K[X.value]?.custom&&!(o>0)){Z(qi,`Enter a valid target custom yaw (° per count).`,`error`);return}if(!Number.isFinite(e)||e<=0){$i.value=``,la.textContent=`—`,ua.innerHTML=``,da.textContent=``;return}if(!Number.isFinite(t)||t<=0||!Number.isFinite(n)||n<=0){Z(qi,`Enter valid DPI values.`,`error`);return}let s=Oi({sourceGame:Y.value,targetGame:X.value,sourceSens:e,sourceDpi:t,targetDpi:n,sourceMYaw:r,targetMYaw:i,sourceCustomYaw:a,targetCustomYaw:o}),c=K[Y.value].name,l=K[X.value].name,u=q(s.targetSensitivity);$i.value=u,la.textContent=ki(s.cm360),ua.innerHTML=`
    <div><dt>Inches / 360°</dt><dd>${ki(s.inches360)} in</dd></div>
    <div><dt>Source eDPI</dt><dd>${ki(s.sourceEdpi,0)}</dd></div>
    <div><dt>Target eDPI</dt><dd>${ki(s.targetEdpi,0)}</dd></div>
    <div><dt>Source yaw</dt><dd>${s.sourceYaw}</dd></div>
    <div><dt>Target yaw</dt><dd>${s.targetYaw}</dd></div>
    <div><dt>Multiplier</dt><dd>× ${q(s.ratio,5)}</dd></div>
  `,da.innerHTML=`
    <strong>Formula:</strong>
    target = source × (source DPI ÷ target DPI) × (source yaw ÷ target yaw)<br />
    ${u} = ${e} × (${t} ÷ ${n}) × (${s.sourceYaw} ÷ ${s.targetYaw})
  `,Z(qi,`${c} → ${l}: ${u}`,`ok`)}function xa(){let e=Y.value;Y.value=X.value,X.value=e,$i.value&&(Qi.value=$i.value),ba()}function Sa(){Y.value=`cs2`,X.value=`valorant`,Qi.value=`1.25`,ea.value=`800`,ta.value=`800`,ba()}var Ca={crosshair:`Convert a crosshair share code into console commands, build a code from commands, or design one visually with a live preview.`,sensitivity:`Keep the same cm/360 aim feel across games — with custom yaw values and DPI changes handled for you.`,psa:`Dial in your ideal sensitivity with a guided 7-round A/B test (Perfect Sensitivity Approximation).`,nades:`Browse community grenade line-ups, or sign in to submit your own with a 2D throw guide, videos and photos.`,commands:`Copy up-to-date CS2 launch options and console commands, recommend the ones that help, and share tips in the comments.`,configs:`Share your CS2 configs and video settings, download other players’ setups, and rate the best ones.`,highlights:`Share your best CS2 clips, watch the community’s highlights, and report anything that breaks the rules.`,pros:`Browse pro players’ sensitivity, DPI, resolution and crosshair settings.`,profile:`Your account, contributions, and settings.`,admin:`Moderate content, manage users, sync data sources, and read contact messages.`},wa=document.querySelector(`#tool-desc`);function Ta(e){wa&&(wa.textContent=Ca[e]||``)}function Ea(e){document.querySelectorAll(`.tool-nav .tool-tab`).forEach(t=>{let n=t.getAttribute(`data-tool`)===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.tool-view`).forEach(t=>{t.classList.toggle(`active`,t.id===`${e}-tool`)}),Ta(e),window.scrollTo({top:0,behavior:`smooth`})}document.querySelectorAll(`.tool-nav .tool-tab`).forEach(e=>{e.addEventListener(`click`,()=>Ea(e.getAttribute(`data-tool`)))}),document.addEventListener(`aimkit:navigate`,e=>Ea(e.detail)),Ta(`crosshair`),document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{let n=e.getAttribute(`data-tab`)===t;e.classList.toggle(`active`,n),e.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.converter-panel .tab-panel`).forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-panel`)===t)})})}),document.querySelector(`#decode-btn`)?.addEventListener(`click`,ga),document.querySelector(`#encode-btn`)?.addEventListener(`click`,_a),Ji.addEventListener(`keydown`,e=>{e.key===`Enter`&&ga()}),Xi.addEventListener(`input`,()=>{let e=Xi.value.trim();if(!e){Gi(null),Ii.innerHTML=``;return}try{ma(oe(e))}catch{}}),Ji.addEventListener(`input`,()=>{let e=ha(Ji.value);if(ji.test(e))try{ma(d(e))}catch{}}),document.querySelector(`#copy-commands`)?.addEventListener(`click`,()=>{va(J,Yi.value,`commands`)}),document.querySelector(`#copy-code`)?.addEventListener(`click`,()=>{va(J,Zi.value,`share code`)}),document.querySelector(`#copy-sharecode-cmd`)?.addEventListener(`click`,()=>{let e=ha(Ji.value);if(!e){Z(J,`Enter a share code first.`,`error`);return}va(J,`cl_crosshair_sharecode "${e}"`,`import command`)}),document.querySelector(`#load-example-code`)?.addEventListener(`click`,()=>{Ji.value=fa,ga()}),document.querySelector(`#load-example-cmd`)?.addEventListener(`click`,()=>{Xi.value=pa,_a()});var Da={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]},Q={...ne},Oa=document.querySelector(`#ed-style`),ka=document.querySelector(`#ed-color`),Aa=document.querySelector(`#ed-custom-color`),ja=document.querySelector(`#ed-custom-color-field`),Ma=document.querySelector(`#ed-r`),Na=document.querySelector(`#ed-g`),Pa=document.querySelector(`#ed-b`),Fa=document.querySelector(`#ed-rgb-val`),Ia=document.querySelector(`#ed-color-swatch`);function La(e,t){e&&document.activeElement!==e&&(e.value=String(t))}var Ra=document.querySelector(`#ed-length`),za=document.querySelector(`#ed-thickness`),Ba=document.querySelector(`#ed-gap`),Va=document.querySelector(`#ed-outline`),Ha=document.querySelector(`#ed-alpha`),Ua=document.querySelector(`#ed-dot`),Wa=document.querySelector(`#ed-tstyle`),Ga=document.querySelector(`#ed-outline-on`),Ka=document.querySelector(`#ed-alpha-on`),qa=document.querySelector(`#ed-sharecode`),Ja=document.querySelector(`#ed-commands`),Ya=document.querySelector(`#ed-length-num`),Xa=document.querySelector(`#ed-thickness-num`),Za=document.querySelector(`#ed-gap-num`),Qa=document.querySelector(`#ed-outline-num`),$a=document.querySelector(`#ed-alpha-num`),eo=document.querySelector(`#ed-r-num`),to=document.querySelector(`#ed-g-num`),no=document.querySelector(`#ed-b-num`),ro=(e,t,n)=>Math.max(t,Math.min(n,e)),io=[{key:`length`,slider:Ra,num:Ya,min:0,max:15},{key:`thickness`,slider:za,num:Xa,min:0,max:6},{key:`gap`,slider:Ba,num:Za,min:-10,max:10},{key:`outline`,slider:Va,num:Qa,min:0,max:3},{key:`alpha`,slider:Ha,num:$a,min:0,max:255}],ao=[{key:`red`,slider:Ma,num:eo},{key:`green`,slider:Na,num:to},{key:`blue`,slider:Pa,num:no}];function oo(e,t,n){let r=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,`0`);return`#${r(e)}${r(t)}${r(n)}`}function so(e){let t=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(e.trim());return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:{r:Q.red,g:Q.green,b:Q.blue}}function co(){let e=oo(Q.red,Q.green,Q.blue);ka.value=String(Q.color),La(Aa,e);for(let e of ao)La(e.slider,Q[e.key]),La(e.num,Q[e.key]);Fa&&(Fa.textContent=`${Q.red}, ${Q.green}, ${Q.blue}`),Ia&&(Ia.style.background=e),ja?.classList.toggle(`hidden`,Q.color!==5)}function lo(){for(let e of io)La(e.slider,ro(Q[e.key],e.min,e.max)),La(e.num,Q[e.key])}function uo(){Oa.value=String(Q.style),Ua.checked=Q.centerDotEnabled,Wa.checked=Q.tStyleEnabled,Ga.checked=Q.outlineEnabled,Ka.checked=Q.alphaEnabled,lo(),co()}function fo(){lo();let e=!Q.outlineEnabled;Va.disabled=e,Qa.disabled=e;let t=!Q.alphaEnabled;Ha.disabled=t,$a.disabled=t;try{qa.value=f(Q)}catch{qa.value=``}Ja.value=se(ee(Q))}function po(){ma(Q),fo()}function mo(){Q.style=Number(Oa.value),Q.centerDotEnabled=Ua.checked,Q.tStyleEnabled=Wa.checked,Q.outlineEnabled=Ga.checked,Q.alphaEnabled=Ka.checked,po()}function ho(e){Q[e.key]=Number(e.slider.value),po()}function go(e,t){let n=Number(e.num.value);if(e.num.value===``||!Number.isFinite(n)){t&&(e.num.value=String(Q[e.key]));return}Q[e.key]=ro(n,e.min,e.max),t&&(e.num.value=String(Q[e.key])),po()}function _o(){Q.color=5,Q.red=ro(Number(eo.value)||0,0,255),Q.green=ro(Number(to.value)||0,0,255),Q.blue=ro(Number(no.value)||0,0,255),co(),po()}function vo(){if(Q.color=Number(ka.value),Q.color!==5){let[e,t,n]=Da[Q.color]??Da[1];Q.red=e,Q.green=t,Q.blue=n}co(),po()}function yo(){Q.color=5,Q.red=Number(Ma.value),Q.green=Number(Na.value),Q.blue=Number(Pa.value),co(),po()}function bo(){Q.color=5;let{r:e,g:t,b:n}=so(Aa.value);Q.red=e,Q.green=t,Q.blue=n,co(),po()}io.forEach(e=>{e.slider.addEventListener(`input`,()=>ho(e)),e.num.addEventListener(`input`,()=>go(e,!1)),e.num.addEventListener(`change`,()=>go(e,!0))}),[Oa,Ua,Wa,Ga,Ka].forEach(e=>e.addEventListener(`change`,mo)),ka.addEventListener(`change`,vo),Aa.addEventListener(`input`,bo),Aa.addEventListener(`change`,bo),ao.forEach(e=>{e.slider.addEventListener(`input`,yo),e.num.addEventListener(`input`,_o),e.num.addEventListener(`change`,_o)}),document.querySelector(`#ed-copy-code`)?.addEventListener(`click`,()=>{va(J,qa.value,`share code`)}),document.querySelector(`#ed-copy-commands`)?.addEventListener(`click`,()=>{va(J,Ja.value,`commands`)}),document.querySelector(`#ed-reset`)?.addEventListener(`click`,()=>{Object.assign(Q,ne),uo(),po(),Z(J,`Crosshair reset to defaults.`,`ok`)}),document.querySelector(`.converter-panel .tab[data-tab="visual"]`)?.addEventListener(`click`,po),uo(),fo(),Y.innerHTML=Ai(`cs2`),X.innerHTML=Ai(`valorant`),[Y,X,Qi,ea,ta,na,ra,ia,aa].forEach(e=>{e.addEventListener(`input`,ba),e.addEventListener(`change`,ba)}),document.querySelector(`#sens-swap`)?.addEventListener(`click`,xa),document.querySelector(`#copy-sens`)?.addEventListener(`click`,()=>{va(qi,$i.value,`converted sensitivity`)}),document.querySelector(`#sens-cs2-val`)?.addEventListener(`click`,Sa);var xo=document.querySelector(`#psa-start`),So=document.querySelector(`#psa-begin`),Co=document.querySelector(`#psa-round`),wo=document.querySelector(`#psa-round-num`),To=document.querySelector(`#psa-bar-fill`),Eo=document.querySelector(`#psa-lower`),Do=document.querySelector(`#psa-higher`),Oo=document.querySelector(`#psa-lower-val`),ko=document.querySelector(`#psa-higher-val`),Ao=document.querySelector(`#psa-undo`),jo=document.querySelector(`#psa-reset`),Mo=document.querySelector(`#psa-result`),No=document.querySelector(`#psa-result-label`),Po=document.querySelector(`#psa-stats`),Fo=document.querySelector(`#psa-history`),Io=document.querySelector(`#psa-status`),$=null;function Lo(){if(!$){Co?.classList.add(`hidden`),Fo?.classList.add(`hidden`),Mo.textContent=`—`,No.textContent=`recommended sensitivity`,Po.innerHTML=``;return}let e=de($),t=e?ge($):fe($);if(Mo.textContent=q(t,3),No.textContent=e?`final recommended sensitivity`:`current estimate`,Po.innerHTML=`
    <div><dt>Range low</dt><dd>${q($.lo,3)}</dd></div>
    <div><dt>Range high</dt><dd>${q($.hi,3)}</dd></div>
    <div><dt>Spread</dt><dd>± ${q(pe($)/2*100,1)}%</dd></div>
    <div><dt>Base</dt><dd>${q($.base,3)}</dd></div>
  `,e)Co?.classList.add(`hidden`),Z(Io,`Done — set your sensitivity to ${q(t,3)} and play a few sessions before changing again.`,`ok`);else{let{lower:e,higher:t}=ue($);Co?.classList.remove(`hidden`),wo.textContent=String($.round),To.style.width=`${($.round-1)/7*100}%`,Oo.textContent=q(e,3),ko.textContent=q(t,3),Z(Io,`Round ${$.round} of 7: test both values, then pick the side that feels better.`,``)}$.choices.length>0?(Fo?.classList.remove(`hidden`),Fo.innerHTML=`<strong>History:</strong><br />${$.choices.map(e=>`Round ${e.round}: chose <strong>${e.side}</strong> (${q(e.lower,3)} vs ${q(e.higher,3)})`).join(`<br />`)}`):(Fo?.classList.add(`hidden`),Fo.innerHTML=``)}function Ro(){let e=Number(xo.value);if(!Number.isFinite(e)||e<=0){Z(Io,`Enter a valid starting sensitivity greater than 0.`,`error`);return}$=le(e),Lo()}function zo(e){!$||de($)||($=me($,e),Lo())}So?.addEventListener(`click`,Ro),Eo?.addEventListener(`click`,()=>zo(`lower`)),Do?.addEventListener(`click`,()=>zo(`higher`)),Ao?.addEventListener(`click`,()=>{$&&($=he($),Lo())}),jo?.addEventListener(`click`,()=>{$=null,Lo(),Z(Io,`Enter a starting sensitivity and press Start PSA.`,``)}),Li.innerHTML=Vi.map(e=>`<option value="${e.id}">${e.label}</option>`).join(``),Li.addEventListener(`change`,()=>Gi(Hi)),Gi(null),ga(),Sa();function Bo(e){return String(e||``).replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`)}function Vo(e){let t=document.querySelector(`#donate-section`),n=document.querySelector(`#donate-actions`);if(!t||!n)return;let r=[];e.paypalUrl&&r.push(`<a class="btn donate-btn paypal" href="${Bo(e.paypalUrl)}" target="_blank" rel="noopener noreferrer">${Mi}<span>Donate via PayPal</span></a>`),e.steamTradeUrl&&r.push(`<a class="btn donate-btn steam" href="${Bo(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer">${Ni}<span>Donate Steam skins</span></a>`),n.innerHTML=r.join(``),t.classList.toggle(`hidden`,r.length===0);let i=document.querySelector(`#donate-fab`);if(i){let t=[];e.paypalUrl&&t.push(`<a class="donate-fab-btn paypal" href="${Bo(e.paypalUrl)}" target="_blank" rel="noopener noreferrer" title="Donate via PayPal">${Mi}<span>PayPal</span></a>`),e.steamTradeUrl&&t.push(`<a class="donate-fab-btn steam" href="${Bo(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer" title="Donate Steam skins">${Ni}<span>Steam</span></a>`),i.innerHTML=t.length?`<span class="donate-fab-label">Support AimKit</span>${t.join(``)}`:``,i.classList.toggle(`hidden`,t.length===0)}}async function Ho(){try{Vo(await _.settings.get())}catch{Vo({paypalUrl:``,steamTradeUrl:``})}}document.addEventListener(`aimkit:settings-updated`,Ho),document.querySelector(`#contact-open`)?.addEventListener(`click`,yi),Je();var Uo=new URLSearchParams(window.location.search).get(`reset`);if(Uo){We(Uo);let e=new URL(window.location.href);e.searchParams.delete(`reset`),window.history.replaceState({},``,e)}var Wo=new URLSearchParams(window.location.search);if(Wo.get(`token`)){Ce(Wo.get(`token`)),je();let e=new URL(window.location.href);e.searchParams.delete(`token`),window.history.replaceState({},``,e)}else if(Wo.get(`steam`)===`linked`){je();let e=new URL(window.location.href);e.searchParams.delete(`steam`),window.history.replaceState({},``,e)}else if(Wo.get(`steam_error`)){let e=new URL(window.location.href);e.searchParams.delete(`steam_error`),window.history.replaceState({},``,e)}Qt(),Sn(),lr(),jr(),Yr(),zn(),_i(),Ho();
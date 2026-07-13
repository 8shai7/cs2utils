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
`}var m={cl_crosshair_drawoutline:`outlineEnabled`,cl_crosshair_dynamic_maxdist_splitratio:`splitSizeRatio`,cl_crosshair_dynamic_splitalpha_innermod:`innerSplitAlpha`,cl_crosshair_dynamic_splitalpha_outermod:`outerSplitAlpha`,cl_crosshair_dynamic_splitdist:`splitDistance`,cl_crosshair_outlinethickness:`outline`,cl_crosshair_t:`tStyleEnabled`,cl_crosshairalpha:`alpha`,cl_crosshaircolor:`color`,cl_crosshaircolor_b:`blue`,cl_crosshaircolor_g:`green`,cl_crosshaircolor_r:`red`,cl_crosshairdot:`centerDotEnabled`,cl_crosshairgap:`gap`,cl_crosshairgap_useweaponvalue:`deployedWeaponGapEnabled`,cl_crosshairsize:`length`,cl_crosshairstyle:`style`,cl_crosshairthickness:`thickness`,cl_crosshairusealpha:`alphaEnabled`,cl_fixedcrosshairgap:`fixedCrosshairGap`,cl_crosshair_recoil:`followRecoil`},ee=new Set([`outlineEnabled`,`tStyleEnabled`,`centerDotEnabled`,`deployedWeaponGapEnabled`,`alphaEnabled`,`followRecoil`]),h={length:3,red:50,green:250,blue:50,gap:-2,alphaEnabled:!0,alpha:200,outlineEnabled:!1,outline:1,color:1,thickness:.5,centerDotEnabled:!1,splitDistance:3,followRecoil:!1,fixedCrosshairGap:3,innerSplitAlpha:0,outerSplitAlpha:1,splitSizeRatio:1,tStyleEnabled:!1,deployedWeaponGapEnabled:!0,style:4};function g(e){let t=e.trim().replace(/^["']|["']$/g,``),n=t.toLowerCase();return n===`true`?`1`:n===`false`?`0`:t}function te(e){let t={},n=e.replace(/\/\/[^\n]*/g,``).replace(/\/\*[\s\S]*?\*\//g,``);for(let e of n.split(/[;\n]+/)){let n=e.trim();if(!n)continue;let r=n.match(/^(cl_[\w]+)\s+(.+)$/);r&&(t[r[1]]=g(r[2]))}return t}function ne(e,t){return e===void 0?!t&&0:t?typeof e==`boolean`?e:Number(e)!==0:Number(e)}function re(e){let t={...h};for(let[n,r]of Object.entries(m)){if(!(n in e))continue;let i=ee.has(r);t[r]=ne(e[n],i)}return t}function ie(e){return re(te(e))}function ae(e){return e.trim().split(`
`).map(e=>e.trim()).filter(Boolean).join(`
`)}var oe=.5;function se(e){return{base:e,lo:e*(1-oe),hi:e*1.5,round:1,choices:[]}}function ce(e){return{lower:e.lo,higher:e.hi,mid:(e.lo+e.hi)/2}}function le(e){return e.round>7}function ue(e){return(e.lo+e.hi)/2}function de(e){let t=ue(e);return t<=0?0:(e.hi-e.lo)/t}function fe(e,t){if(le(e))return e;let n=(e.lo+e.hi)/2,r={round:e.round,side:t,lo:e.lo,hi:e.hi,lower:e.lo,higher:e.hi},i={...e,choices:[...e.choices,r],round:e.round+1};return t===`lower`?i.hi=n:i.lo=n,i}function pe(e){if(e.choices.length===0)return e;let t=e.choices.slice(0,-1),n=e.choices[e.choices.length-1];return{...e,lo:n.lo,hi:n.hi,round:n.round,choices:t}}function me(e){return ue(e)}var he=`/api`,ge=`cs2utils.token`,_e=/^https?:\/\//.test(he)?new URL(he).origin:``;function ve(){try{return localStorage.getItem(ge)}catch{return null}}function ye(e){try{e?localStorage.setItem(ge,e):localStorage.removeItem(ge)}catch{}}async function _(e,t,n,{auth:r=!1}={}){let i={};if(n!==void 0&&!(n instanceof FormData)&&(i[`Content-Type`]=`application/json`),r){let e=ve();e&&(i.Authorization=`Bearer ${e}`)}let a;try{a=await fetch(`${he}${t}`,{method:e,headers:i,body:n instanceof FormData?n:n===void 0?void 0:JSON.stringify(n)})}catch{throw Error(`Cannot reach the server. Is the API running?`)}let o=null,s=await a.text();if(s)try{o=JSON.parse(s)}catch{o=null}if(!a.ok){let e=Error(o&&o.error||`Request failed (${a.status}).`);throw e.status=a.status,e.data=o,e}return o}var be=`${he}/auth/steam`;function xe(e){ye(e)}function v(e){return!!e&&(e.role===`admin`||e.role===`owner`)}function Se(e){return!!e&&e.role===`owner`}function Ce(e){return e?/^https?:\/\//.test(e)||e.startsWith(`data:`)?e:_e+e:``}var y={auth:{async register(e){let t=await _(`POST`,`/auth/register`,e);return ye(t.token),t.user},async login(e){let t=await _(`POST`,`/auth/login`,e);return ye(t.token),t.user},logout(){ye(null)},async captcha(){return _(`GET`,`/auth/captcha`)},async changePassword(e){return _(`POST`,`/auth/password`,e,{auth:!0})},async forgot(e){return _(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return _(`POST`,`/auth/reset`,{token:e,password:t})},async me(){if(!ve())return null;try{return(await _(`GET`,`/auth/me`,void 0,{auth:!0})).user}catch{return ye(null),null}},async profile(){return _(`GET`,`/auth/profile`,void 0,{auth:!0})},async setAvatar(e){return(await _(`POST`,`/auth/avatar`,{url:e},{auth:!0})).user},async uploadAvatar(e){let t=new FormData;return t.append(`file`,e),(await _(`POST`,`/auth/avatar/upload`,t,{auth:!0})).user},async changePassword(e){return _(`POST`,`/auth/password`,e,{auth:!0})},async changeUsername(e){let t=await _(`POST`,`/auth/username`,{username:e},{auth:!0});return t.token&&ye(t.token),t.user},async setCredentials(e){let t=await _(`POST`,`/auth/credentials`,e,{auth:!0});return t.token&&ye(t.token),t.user},async forgot(e){return _(`POST`,`/auth/forgot`,{email:e})},async reset(e,t){return _(`POST`,`/auth/reset`,{token:e,password:t})},steamLoginUrl(){return`${he}/auth/steam`},async steamLinkUrl(){return(await _(`GET`,`/auth/steam/link-url`,void 0,{auth:!0})).url},async steamUnlink(){return(await _(`POST`,`/auth/steam/unlink`,{},{auth:!0})).user}},settings:{async get(){return _(`GET`,`/settings`)}},contact:{async send(e){return _(`POST`,`/contact`,e)}},pros:{async list({q:e=``,sort:t=`name`}={}){let n=new URLSearchParams;e&&n.set(`q`,e),t&&n.set(`sort`,t);let r=n.toString();return _(`GET`,`/pros${r?`?${r}`:``}`)}},configs:{async list({sort:e=`top`,q:t=``}={}){let n=new URLSearchParams;e&&n.set(`sort`,e),t&&n.set(`q`,t);let r=n.toString();return(await _(`GET`,`/configs${r?`?${r}`:``}`,void 0,{auth:!0})).configs},async create(e){return(await _(`POST`,`/configs`,e,{auth:!0})).config},async rate(e,t){return _(`POST`,`/configs/${e}/rate`,{rating:t},{auth:!0})},async remove(e){return _(`DELETE`,`/configs/${e}`,void 0,{auth:!0})}},highlights:{async list({q:e=``}={}){return(await _(`GET`,`/highlights${e?`?q=${encodeURIComponent(e)}`:``}`,void 0,{auth:!0})).highlights},async create(e){return(await _(`POST`,`/highlights`,e,{auth:!0})).highlight},async report(e,t){return _(`POST`,`/highlights/${e}/report`,{reason:t},{auth:!0})},async remove(e){return _(`DELETE`,`/highlights/${e}`,void 0,{auth:!0})}},nades:{async list({map:e=``,type:t=``}={}){let n=new URLSearchParams;e&&n.set(`map`,e),t&&n.set(`type`,t);let r=n.toString();return(await _(`GET`,`/nades${r?`?${r}`:``}`)).nades},async mine(){return(await _(`GET`,`/nades/mine`,void 0,{auth:!0})).nades},async create(e){return(await _(`POST`,`/nades`,e,{auth:!0})).nade},async addMedia(e,t){return(await _(`POST`,`/nades/${e}/media`,t,{auth:!0})).media},async remove(e){return _(`DELETE`,`/nades/${e}`,void 0,{auth:!0})}},commands:{async catalog(){return _(`GET`,`/commands/catalog`)},async social(){return _(`GET`,`/commands/social`,void 0,{auth:!0})},async recommend(e){return _(`POST`,`/commands/${e}/recommend`,{},{auth:!0})},async addComment(e,t){return _(`POST`,`/commands/${e}/comments`,{body:t},{auth:!0})}},admin:{async pending(){return(await _(`GET`,`/admin/nades/pending`,void 0,{auth:!0})).nades},async pendingComments(){return(await _(`GET`,`/admin/comments/pending`,void 0,{auth:!0})).comments},async pendingCommentsCount(){return(await _(`GET`,`/admin/comments/pending/count`,void 0,{auth:!0})).count},async reviewComment(e,t){return _(`POST`,`/admin/comments/${e}/review`,{decision:t},{auth:!0})},async syncCommands(){return _(`POST`,`/admin/commands/sync`,{},{auth:!0})},async checkCommandsCs2(){return _(`POST`,`/admin/commands/check-cs2`,{},{auth:!0})},async saveSettings(e){return _(`POST`,`/admin/settings`,e,{auth:!0})},async highlightReports(){return(await _(`GET`,`/admin/highlights/reports`,void 0,{auth:!0})).highlights},async highlightReportsCount(){return(await _(`GET`,`/admin/highlights/reports/count`,void 0,{auth:!0})).count},async reviewHighlight(e,t){return _(`POST`,`/admin/highlights/${e}/review`,{decision:t},{auth:!0})},async syncPros(){return _(`POST`,`/admin/pros/sync`,{},{auth:!0})},async importCommands(e){return _(`POST`,`/admin/commands/import`,{content:e},{auth:!0})},async importPros(e){return _(`POST`,`/admin/pros/import`,{content:e},{auth:!0})},async banUser(e,{hours:t,permanent:n}){return(await _(`POST`,`/admin/users/${e}/ban`,{hours:t,permanent:n},{auth:!0})).user},async unbanUser(e){return(await _(`POST`,`/admin/users/${e}/unban`,{},{auth:!0})).user},async pendingCount(){return(await _(`GET`,`/admin/nades/pending/count`,void 0,{auth:!0})).count},async reviewNade(e,t,n=``){return _(`POST`,`/admin/nades/${e}/review`,{decision:t,note:n},{auth:!0})},async reviewMedia(e,t){return _(`POST`,`/admin/media/${e}/review`,{decision:t},{auth:!0})},async users(){return(await _(`GET`,`/admin/users`,void 0,{auth:!0})).users},async setRole(e,t){return(await _(`POST`,`/admin/users/${e}/role`,{role:t},{auth:!0})).user}},uploads:{async image(e){let t=new FormData;return t.append(`file`,e),await _(`POST`,`/uploads`,t,{auth:!0})}}},b=null,we=new Set;function Te(){for(let e of we)e(b)}function Ee(){return b}function De(e){return we.add(e),()=>we.delete(e)}async function Oe(){return b=await y.auth.me(),Te(),b}async function ke(e){return b=await y.auth.login(e),Te(),b}async function Ae(e){return b=await y.auth.register(e),Te(),b}function je(){y.auth.logout(),b=null,Te()}var Me,x,Ne=`login`,Pe={required:!1,token:null,svg:``};function Fe(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Ie(){let e=Ee();e?(Me.innerHTML=`
      <button class="account-chip" id="hdr-profile" title="View your profile">
        ${e.avatarUrl?`<img class="account-avatar" src="${Fe(Ce(e.avatarUrl))}" alt="" />`:``}
        <span class="account-name">${Fe(e.username)}</span>
        <span class="nade-badge ${Fe(e.role)}">${Fe(e.role)}</span>
      </button>
      <button class="btn ghost btn-sm" id="hdr-logout">Log out</button>`,Me.querySelector(`#hdr-profile`).addEventListener(`click`,()=>document.dispatchEvent(new CustomEvent(`aimkit:navigate`,{detail:`profile`}))),Me.querySelector(`#hdr-logout`).addEventListener(`click`,()=>je())):(Me.innerHTML=`
      <button class="btn ghost btn-sm" id="hdr-login">Log in</button>
      <button class="btn primary btn-sm" id="hdr-register">Register</button>`,Me.querySelector(`#hdr-login`).addEventListener(`click`,()=>He(`login`)),Me.querySelector(`#hdr-register`).addEventListener(`click`,()=>He(`register`)))}function Le(){let e=Ne===`login`,t=Ne===`forgot`;x.innerHTML=`
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
        ${e&&Pe.required?`<div class="captcha-field">
                 <div class="captcha-row">
                   <div class="captcha-image" id="hdr-captcha-img">${Pe.svg}</div>
                   <button type="button" class="captcha-refresh" id="hdr-captcha-refresh" title="New image" aria-label="New image">&#8635;</button>
                 </div>
                 <label class="field"><span>Enter the characters above</span><input id="hdr-captcha" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>
               </div>`:``}
        <button class="btn primary" type="submit">${t?`Send reset link`:e?`Log in`:`Create account`}</button>
        <p class="auth-alt">${t?`<button type="button" class="linkish" data-mode="login">← Back to log in</button>`:e?`<button type="button" class="linkish" data-mode="forgot">Forgot password?</button>`:``}</p>
        <p class="status" id="hdr-auth-status"></p>
      </form>
      ${t?``:`<div class="auth-divider"><span>or</span></div>
             <a class="btn steam-login" href="${be}">
               <svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Z"/></svg>
               Sign in with Steam
             </a>`}
    </div>`,x.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,Ue)),x.querySelectorAll(`[data-mode]`).forEach(e=>e.addEventListener(`click`,()=>{Ne=e.dataset.mode,Le()})),x.querySelector(`#hdr-auth-form`).addEventListener(`submit`,Be),x.querySelector(`#hdr-captcha-refresh`)?.addEventListener(`click`,async()=>{await Re();let e=x.querySelector(`#hdr-captcha-img`);e&&(e.innerHTML=Pe.svg);let t=x.querySelector(`#hdr-captcha`);t&&(t.value=``)}),x.querySelector(`#hdr-email`)?.focus()}async function Re(){try{let e=await y.auth.captcha();Pe.token=e.token,Pe.svg=e.svg}catch{}}function ze(){let e=x.querySelector(`#hdr-email`)?.value||``,t=x.querySelector(`#hdr-password`)?.value||``,n=x.querySelector(`#hdr-username`)?.value||``;Le();let r=x.querySelector(`#hdr-email`);r&&(r.value=e);let i=x.querySelector(`#hdr-password`);i&&(i.value=t);let a=x.querySelector(`#hdr-username`);a&&(a.value=n)}async function Be(e){e.preventDefault();let t=x.querySelector(`#hdr-email`)?.value||``,n=x.querySelector(`#hdr-password`)?.value||``,r=x.querySelector(`#hdr-username`)?.value||``,i=x.querySelector(`#hdr-captcha`)?.value||``;try{if(Ne===`forgot`){await y.auth.forgot(t);let e=x.querySelector(`#hdr-auth-status`);e.textContent=`If an account exists for that email, a reset link is on its way.`,e.className=`status ok`;return}Ne===`login`?await ke({email:t,password:n,captchaToken:Pe.token,captchaAnswer:i}):await Ae({email:t,username:r,password:n}),Pe={required:!1,token:null,svg:``},Ue()}catch(e){Ne===`login`&&e?.data?.captchaRequired&&(Pe.required=!0,await Re(),ze());let t=x.querySelector(`#hdr-auth-status`);t&&(t.textContent=e.message,t.className=`status error`)}}function Ve(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Reset password">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Choose a new password</h2>
      <form id="reset-form" class="auth-form-modal">
        <label class="field"><span>New password</span><input id="reset-password" type="password" autocomplete="new-password" /></label>
        <button class="btn primary" type="submit">Set new password</button>
        <p class="status" id="reset-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#reset-status`);t.querySelector(`#reset-form`).addEventListener(`submit`,async i=>{i.preventDefault();try{await y.auth.reset(e,t.querySelector(`#reset-password`).value),r.textContent=`Password updated! You can now log in.`,r.className=`status ok`,setTimeout(()=>{n(),He(`login`)},1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#reset-password`)?.focus()}function He(e){Ne=e,x.classList.remove(`hidden`),Le()}function Ue(){x.classList.add(`hidden`)}function We(e=`login`){He(e)}async function Ge(){Me=document.querySelector(`#account-menu`),Me&&(x=document.createElement(`div`),x.id=`auth-modal`,x.className=`modal hidden`,document.body.appendChild(x),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Ue()}),De(()=>Ie()),Ie(),await Oe())}var Ke=[{id:`mirage`,name:`Mirage`},{id:`dust2`,name:`Dust II`},{id:`inferno`,name:`Inferno`},{id:`nuke`,name:`Nuke`},{id:`ancient`,name:`Ancient`},{id:`anubis`,name:`Anubis`},{id:`overpass`,name:`Overpass`},{id:`vertigo`,name:`Vertigo`},{id:`train`,name:`Train`}],qe=[{id:`smoke`,name:`Smoke`,color:`#cdd6e3`},{id:`flash`,name:`Flash`,color:`#f4ec9b`},{id:`molotov`,name:`Molotov`,color:`#ff7a3c`},{id:`he`,name:`HE Grenade`,color:`#8fd694`},{id:`decoy`,name:`Decoy`,color:`#9aa8ff`}],Je=[{id:`stand`,name:`Standing throw`},{id:`jump`,name:`Jump throw`},{id:`jumpthrow`,name:`Jumpthrow bind`},{id:`run`,name:`Running throw`},{id:`runjump`,name:`Run + jump throw`},{id:`walk`,name:`Walking throw`}],Ye=[{id:`t`,name:`T side`},{id:`ct`,name:`CT side`}];function Xe(e){return Ke.find(t=>t.id===e)?.name??e}function Ze(e){return qe.find(t=>t.id===e)??qe[0]}function Qe(e){return Je.find(t=>t.id===e)?.name??e}function $e(e){return Ye.find(t=>t.id===e)?.name??e}function et(e){let t=(e||``).toLowerCase();return/youtube\.com|youtu\.be|\.mp4|\.webm|\.mov|streamable\.com/.test(t)?`video`:`image`}function tt(e,t,n){let r=e.createLinearGradient(0,0,t,t);r.addColorStop(0,`#26313f`),r.addColorStop(.5,`#2f3d4e`),r.addColorStop(1,`#222b37`),e.fillStyle=r,e.fillRect(0,0,t,t),e.strokeStyle=`rgba(255,255,255,0.06)`,e.lineWidth=1;for(let n=0;n<=t;n+=t/10)e.beginPath(),e.moveTo(n,0),e.lineTo(n,t),e.stroke(),e.beginPath(),e.moveTo(0,n),e.lineTo(t,n),e.stroke();e.fillStyle=`rgba(255,255,255,0.10)`,e.font=`600 22px Outfit, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(Xe(n).toUpperCase(),t/2,t/2)}function nt(e,{mapId:t,type:n=`smoke`,start:r=null,end:i=null}){let a=e.getContext(`2d`);if(!a)return;let o=e.width;a.clearRect(0,0,o,o),tt(a,o,t);let s=Ze(n).color;if(r&&i){let e=r.x*o,t=r.y*o,n=i.x*o,c=i.y*o,l=(e+n)/2,u=(t+c)/2,d=Math.hypot(n-e,c-t),f=l,p=u-Math.max(24,d*.35);a.strokeStyle=s,a.lineWidth=3,a.setLineDash([8,6]),a.beginPath(),a.moveTo(e,t),a.quadraticCurveTo(f,p,n,c),a.stroke(),a.setLineDash([]);let m=.92,ee=(1-m)*(1-m)*e+2*(1-m)*m*f+m*m*n,h=(1-m)*(1-m)*t+2*(1-m)*m*p+m*m*c,g=Math.atan2(c-h,n-ee);a.fillStyle=s,a.beginPath(),a.moveTo(n,c),a.lineTo(n-12*Math.cos(g-.4),c-12*Math.sin(g-.4)),a.lineTo(n-12*Math.cos(g+.4),c-12*Math.sin(g+.4)),a.closePath(),a.fill()}r&&rt(a,r.x*o,r.y*o,`#3ecf8e`,`THROW`),i&&it(a,i.x*o,i.y*o,s),(!r||!i)&&(a.fillStyle=`rgba(255,255,255,0.55)`,a.font=`13px Outfit, sans-serif`,a.textAlign=`center`,a.textBaseline=`bottom`,a.fillText(r?`Click again to set the landing spot`:`Click the map to set your throw position`,o/2,o-12))}function rt(e,t,n,r,i){e.beginPath(),e.fillStyle=r,e.arc(t,n,7,0,Math.PI*2),e.fill(),e.lineWidth=2,e.strokeStyle=`#0d1117`,e.stroke(),i&&(e.fillStyle=`#fff`,e.font=`600 10px JetBrains Mono, monospace`,e.textAlign=`center`,e.textBaseline=`bottom`,e.fillText(i,t,n-10))}function it(e,t,n,r){e.strokeStyle=r,e.lineWidth=3,e.beginPath(),e.arc(t,n,11,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(t-6,n-6),e.lineTo(t+6,n+6),e.moveTo(t+6,n-6),e.lineTo(t-6,n+6),e.stroke()}function at(e,t){let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width,i=(t.clientY-n.top)/n.height;return{x:Math.max(0,Math.min(1,r)),y:Math.max(0,Math.min(1,i))}}var ot=360,S,C=null,w=`browse`,st={text:``,kind:``},ct=0,lt=!1,ut={map:``,type:``},dt=[],ft=[],pt=[],mt=[],T=ht();function ht(){return{map:`mirage`,type:`smoke`,side:`t`,technique:`stand`,title:``,description:``,start:null,end:null}}function E(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function gt(e){let t=Ce(e);return/^https?:\/\//.test(t)||t.startsWith(`data:image/`)?t:``}function _t(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function vt(e,t){return e.map(e=>`<option value="${e.id}"${e.id===t?` selected`:``}>${E(e.name)}</option>`).join(``)}function D(e,t=``){st={text:e,kind:t};let n=S?.querySelector(`#nades-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function yt(e){return`<span class="nade-badge ${e}">${e}</span>`}function bt(e){try{return new Date(e).toLocaleDateString()}catch{return``}}async function xt(){if(v(C))try{ct=await y.admin.pendingCount()}catch{ct=0}else ct=0}async function O(e){w=e,lt=e!==`add`,lt&&Nt();try{w===`browse`&&(dt=await y.nades.list(ut)),w===`mine`&&C&&(ft=await y.nades.mine()),w===`review`&&v(C)&&(pt=await y.admin.pending(),ct=await y.admin.pendingCount()),w===`users`&&v(C)&&(mt=await y.admin.users())}catch(e){D(e.message,`error`)}lt=!1,Nt()}function St(e){let t=gt(e.url);if(!t)return``;if(e.kind===`video`){let n=_t(e.url);return n?`<iframe class="nade-media-embed" src="https://www.youtube.com/embed/${E(n)}" title="nade video" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e.url)?`<video class="nade-media-embed" src="${E(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${E(t)}" target="_blank" rel="noopener noreferrer">Open video ↗</a>`}return`<a href="${E(t)}" target="_blank" rel="noopener noreferrer"><img class="nade-media-img" src="${E(t)}" alt="${E(e.addedByName||`nade media`)}" loading="lazy" /></a>`}function Ct(e,{showStatus:t=!1}={}){let n=Ze(e.type),r=(e.media||[]).filter(e=>t?!0:e.status===`approved`),i=r.length?`<div class="nade-media">${r.map(e=>`<div class="nade-media-item">${St(e)}${t?`<div class="nade-media-meta">${yt(e.status)} <span>by ${E(e.addedByName||``)}</span></div>`:``}</div>`).join(``)}</div>`:`<p class="hint">No approved media yet — a 2D throw preview is shown above.</p>`;return`
    <article class="nade-card">
      <div class="nade-card-head">
        <div>
          <h3>${E(e.title)}</h3>
          <p class="nade-sub">
            <span class="nade-chip" style="--chip:${n.color}">${E(n.name)}</span>
            ${E(Xe(e.map))} · ${E($e(e.side))} · ${E(Qe(e.technique))}
          </p>
        </div>
        ${t?yt(e.status):``}
      </div>
      <canvas class="nade-canvas" width="${ot}" height="${ot}"
        data-map="${E(e.map)}" data-type="${E(e.type)}"
        data-sx="${e.start.x}" data-sy="${e.start.y}" data-ex="${e.end.x}" data-ey="${e.end.y}"></canvas>
      ${e.description?`<p class="nade-desc">${E(e.description)}</p>`:``}
      ${i}
      <p class="nade-foot">by ${E(e.authorName)} · ${bt(e.createdAt)}</p>
    </article>`}function wt(){let e=dt.length?dt.map(e=>Ct(e)).join(``):`<p class="hint">No approved nades yet${C?` — be the first to add one!`:` — log in and add the nades you found.`}</p>`;return`
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${vt(Ke,ut.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${vt(qe,ut.type)}</select>
      </label>
    </div>
    <div class="nade-grid">${e}</div>`}function Tt(e){return`<div class="login-prompt">
    <p class="hint">Log in or create an account to ${E(e)}.</p>
    <div class="actions">
      <button class="btn primary" data-open-auth="login">Log in</button>
      <button class="btn" data-open-auth="register">Register</button>
    </div>
  </div>`}function Et(){return C?`
    <div class="nade-add">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>Pick the <strong>map</strong> and <strong>grenade type</strong> on the right.</li>
          <li>Click the map once to drop your <strong>throw position</strong>.</li>
          <li>Click again to set the <strong>landing spot</strong>.</li>
          <li>Fill in the details, add optional media, and submit for review.</li>
        </ol>
        <canvas id="nade-add-canvas" class="nade-canvas interactive" width="${ot}" height="${ot}"></canvas>
        <p class="hint" id="nade-add-coords">Step 2: click the map to set your throw position.</p>
      </div>
      <form class="nade-add-form" id="nade-add-form">
        <label class="field"><span>Title</span><input id="add-title" type="text" maxlength="160" placeholder="A site smoke from T ramp" value="${E(T.title)}" /></label>
        <div class="sens-grid">
          <label class="field"><span>Map</span><select id="add-map">${vt(Ke,T.map)}</select></label>
          <label class="field"><span>Type</span><select id="add-type">${vt(qe,T.type)}</select></label>
        </div>
        <div class="sens-grid">
          <label class="field"><span>Side</span><select id="add-side">${vt(Ye,T.side)}</select></label>
          <label class="field"><span>Technique</span><select id="add-technique">${vt(Je,T.technique)}</select></label>
        </div>
        <label class="field"><span>Description (optional)</span><textarea id="add-description" rows="3" placeholder="Where to stand, what to line up, jumpthrow timing...">${E(T.description)}</textarea></label>
        <label class="field"><span>Video URL (optional — YouTube or .mp4)</span><input id="add-video" type="url" placeholder="https://youtu.be/..." /></label>
        <label class="field"><span>Image URL (optional)</span><input id="add-image" type="url" placeholder="https://.../lineup.jpg" /></label>
        <label class="field"><span>Or upload an image (optional)</span><input id="add-upload" type="file" accept="image/*" /></label>
        <div class="actions">
          <button class="btn primary" type="submit">Submit for review</button>
          <button class="btn ghost" type="button" id="add-clear">Clear points</button>
        </div>
        <p class="hint">Submissions are reviewed by an admin before appearing publicly.</p>
      </form>
    </div>`:Tt(`add nades`)}function Dt(){return C?ft.length?`<div class="nade-grid">${ft.map(e=>`
      <div class="nade-mine">
        ${Ct(e,{showStatus:!0})}
        ${e.reviewNote?`<p class="hint">Reviewer note: ${E(e.reviewNote)}</p>`:``}
        <div class="nade-add-media">
          <input type="url" class="add-media-url" data-nade="${e.id}" placeholder="Add media URL (image or video)" />
          <button class="btn" data-add-media="${e.id}">Add media</button>
          <button class="btn ghost" data-delete-nade="${e.id}">Delete</button>
        </div>
      </div>`).join(``)}</div>`:`<p class="hint">You haven't added any nades yet.</p>`:Tt(`see and manage your nades`)}function Ot(){return v(C)?pt.length?`<div class="nade-grid">${pt.map(e=>{let t=(e.media||[]).filter(e=>e.status===`pending`),n=t.length?`<div class="review-media">${t.map(e=>`<div class="review-media-item">${St(e)}
                <div class="actions">
                  <button class="btn" data-approve-media="${e.id}">Approve media</button>
                  <button class="btn ghost" data-reject-media="${e.id}">Reject</button>
                </div></div>`).join(``)}</div>`:``,r=e.status===`pending`?`<div class="review-actions">
               <input type="text" class="review-note" data-nade="${e.id}" placeholder="Optional note to the author" />
               <button class="btn primary" data-approve-nade="${e.id}">Approve nade</button>
               <button class="btn ghost" data-reject-nade="${e.id}">Reject</button>
             </div>`:`<p class="hint">Nade already ${E(e.status)} — reviewing added media only.</p>`;return`<div class="nade-mine">${Ct(e,{showStatus:!0})}${n}${r}</div>`}).join(``)}</div>`:`<p class="hint">Nothing pending review. Nice and clean.</p>`:`<p class="hint">Admins only.</p>`}function kt(e){if(!e.bannedUntil)return null;let t=new Date(e.bannedUntil);return t.getTime()<=Date.now()?null:t.getFullYear()>=9999?`permanently`:`until ${t.toLocaleString()}`}function At(){return v(C)?`<div class="users-table">
    ${mt.map(e=>{let t=kt(e),n=e.role===`owner`?`<span class="hint">owner</span>`:e.role===`admin`?`<button class="btn btn-sm ghost" data-role-user="${e.id}" data-role="user">Revoke admin</button>`:`<button class="btn btn-sm" data-role-user="${e.id}" data-role="admin">Make admin</button>`,r=e.role===`owner`?``:t?`<span class="nade-badge rejected">banned ${E(t)}</span> <button class="btn btn-sm ghost" data-unban="${e.id}">Unban</button>`:`<select class="ban-duration" data-ban-dur="${e.id}">
                   <option value="24">1 day</option>
                   <option value="168">7 days</option>
                   <option value="720">30 days</option>
                   <option value="perma">Permanent</option>
                 </select>
                 <button class="btn btn-sm ghost" data-ban="${e.id}">Ban</button>`;return`<div class="user-row">
          <div><strong>${E(e.username)}</strong><br /><span class="hint">${E(e.email)}</span></div>
          <div>${yt(e.role)}</div>
          <div class="user-actions">${n}</div>
          <div class="user-actions">${r}</div>
        </div>`}).join(``)}
  </div>`:`<p class="hint">Admins only.</p>`}function jt(){let e=[[`browse`,`Browse`]];return C&&e.push([`add`,`Add nade`],[`mine`,`My nades`]),v(C)&&e.push([`review`,`Review${ct?` (${ct})`:``}`],[`users`,`Users`]),`<nav class="nades-subnav">${e.map(([e,t])=>`<button class="tool-tab ${w===e?`active`:``}" data-view="${e}">${E(t)}</button>`).join(``)}</nav>`}function Mt(){if(lt)return`<div class="nades-loading"><span class="spinner"></span> Loading…</div>`;switch(w){case`add`:return Et();case`mine`:return Dt();case`review`:return Ot();case`users`:return At();default:return wt()}}function Nt(){S.innerHTML=`
    <div class="nades-shell">
      ${jt()}
      <div class="nades-body">${Mt()}</div>
      <div id="nades-status" class="status ${st.kind}">${E(st.text)}</div>
    </div>`,It(),Pt()}function Pt(){S.querySelectorAll(`canvas.nade-canvas:not(.interactive)`).forEach(e=>{nt(e,{mapId:e.dataset.map,type:e.dataset.type,start:{x:Number(e.dataset.sx),y:Number(e.dataset.sy)},end:{x:Number(e.dataset.ex),y:Number(e.dataset.ey)}})}),Ft()}function Ft(){let e=S.querySelector(`#nade-add-canvas`);e&&nt(e,{mapId:T.map,type:T.type,start:T.start,end:T.end})}function It(){S.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.openAuth))),S.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>O(e.dataset.view))),S.querySelector(`#filter-map`)?.addEventListener(`change`,e=>{ut.map=e.target.value,O(`browse`)}),S.querySelector(`#filter-type`)?.addEventListener(`change`,e=>{ut.type=e.target.value,O(`browse`)});let e=S.querySelector(`#nade-add-canvas`);e&&e.addEventListener(`click`,t=>{let n=at(e,t);!T.start||T.start&&T.end?(T.start=n,T.end=null):T.end=n;let r=S.querySelector(`#nade-add-coords`);r&&(r.textContent=T.end?`Throw + landing set. Adjust by clicking again to start over.`:`Now click the landing spot for the grenade.`),Ft()}),S.querySelector(`#add-map`)?.addEventListener(`change`,e=>{T.map=e.target.value,Ft()}),S.querySelector(`#add-type`)?.addEventListener(`change`,e=>{T.type=e.target.value,Ft()}),S.querySelector(`#add-clear`)?.addEventListener(`click`,()=>{T.start=null,T.end=null,Ft();let e=S.querySelector(`#nade-add-coords`);e&&(e.textContent=`Click the map to set the throw position, then click again for the landing spot.`)}),S.querySelector(`#nade-add-form`)?.addEventListener(`submit`,Lt),S.querySelectorAll(`[data-add-media]`).forEach(e=>e.addEventListener(`click`,()=>Rt(e.dataset.addMedia))),S.querySelectorAll(`[data-delete-nade]`).forEach(e=>e.addEventListener(`click`,()=>zt(e.dataset.deleteNade))),S.querySelectorAll(`[data-approve-nade]`).forEach(e=>e.addEventListener(`click`,()=>Bt(e.dataset.approveNade,`approved`))),S.querySelectorAll(`[data-reject-nade]`).forEach(e=>e.addEventListener(`click`,()=>Bt(e.dataset.rejectNade,`rejected`))),S.querySelectorAll(`[data-approve-media]`).forEach(e=>e.addEventListener(`click`,()=>Vt(e.dataset.approveMedia,`approved`))),S.querySelectorAll(`[data-reject-media]`).forEach(e=>e.addEventListener(`click`,()=>Vt(e.dataset.rejectMedia,`rejected`))),S.querySelectorAll(`[data-role-user]`).forEach(e=>e.addEventListener(`click`,()=>Ht(e.dataset.roleUser,e.dataset.role))),S.querySelectorAll(`[data-ban]`).forEach(e=>e.addEventListener(`click`,()=>{let t=S.querySelector(`[data-ban-dur="${e.dataset.ban}"]`);Ut(e.dataset.ban,t?t.value:`24`)})),S.querySelectorAll(`[data-unban]`).forEach(e=>e.addEventListener(`click`,()=>Wt(e.dataset.unban)))}async function Lt(e){if(e.preventDefault(),T.title=S.querySelector(`#add-title`)?.value||``,T.map=S.querySelector(`#add-map`)?.value||T.map,T.type=S.querySelector(`#add-type`)?.value||T.type,T.side=S.querySelector(`#add-side`)?.value||T.side,T.technique=S.querySelector(`#add-technique`)?.value||T.technique,T.description=S.querySelector(`#add-description`)?.value||``,!T.start||!T.end){D(`Click the map to set both the throw position and the landing spot.`,`error`);return}let t=[],n=(S.querySelector(`#add-video`)?.value||``).trim(),r=(S.querySelector(`#add-image`)?.value||``).trim();n&&t.push({url:n,kind:`video`}),r&&t.push({url:r,kind:et(r)});let i=S.querySelector(`#add-upload`);try{if(i?.files?.[0]){D(`Uploading image…`,``);let e=await y.uploads.image(i.files[0]);t.push({url:e.url,kind:`image`})}await y.nades.create({...T,media:t}),T=ht(),await O(`mine`),D(`Nade submitted! It will appear publicly once an admin approves it.`,`ok`)}catch(e){D(e.message,`error`)}}async function Rt(e){let t=(S.querySelector(`.add-media-url[data-nade="${e}"]`)?.value||``).trim();if(!t){D(`Enter a media URL first.`,`error`);return}try{await y.nades.addMedia(e,{url:t,kind:et(t)}),await O(`mine`),D(`Media added — pending admin review.`,`ok`)}catch(e){D(e.message,`error`)}}async function zt(e){try{await y.nades.remove(e),await O(`mine`),D(`Nade deleted.`,`ok`)}catch(e){D(e.message,`error`)}}async function Bt(e,t){let n=S.querySelector(`.review-note[data-nade="${e}"]`)?.value||``;try{await y.admin.reviewNade(e,t,n),await O(`review`),D(`Nade ${t}.`,`ok`)}catch(e){D(e.message,`error`)}}async function Vt(e,t){try{await y.admin.reviewMedia(e,t),await O(`review`),D(`Media ${t}.`,`ok`)}catch(e){D(e.message,`error`)}}async function Ht(e,t){try{await y.admin.setRole(e,t),await O(`users`),D(`Role updated.`,`ok`)}catch(e){D(e.message,`error`)}}async function Ut(e,t){try{t===`perma`?await y.admin.banUser(e,{permanent:!0}):await y.admin.banUser(e,{hours:Number(t)}),await O(`users`),D(`User banned.`,`ok`)}catch(e){D(e.message,`error`)}}async function Wt(e){try{await y.admin.unbanUser(e),await O(`users`),D(`User unbanned.`,`ok`)}catch(e){D(e.message,`error`)}}async function Gt(){S=document.querySelector(`#nades-tool`),S&&(C=Ee(),De(async e=>{C=e,await xt(),!C&&[`add`,`mine`,`review`,`users`].includes(w)&&(w=`browse`),C&&!v(C)&&[`review`,`users`].includes(w)&&(w=`browse`),await O(w)}),await xt(),Nt(),await O(`browse`))}function Kt(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function qt(e){let t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card import-card" role="dialog" aria-modal="true" aria-label="${Kt(e.title)}">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${Kt(e.title)}</h2>
      <p class="hint">${Kt(e.description)}</p>
      <ol class="import-steps">
        <li>Open the source and complete the verification: <a class="btn btn-sm" href="${Kt(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${Kt(e.sourceLabel)} ↗</a></li>
        <li>Copy the page content.</li>
        <li>Paste it below and import.</li>
      </ol>
      <textarea id="import-content" rows="9" spellcheck="false" placeholder="${Kt(e.placeholder||`Paste the page content here…`)}"></textarea>
      <div class="actions">
        <button class="btn primary" id="import-run">Import</button>
        <button class="btn ghost" data-close>Cancel</button>
      </div>
      <p class="status" id="import-status"></p>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=e=>{e.key===`Escape`&&(n(),document.removeEventListener(`keydown`,r))};document.addEventListener(`keydown`,r);let i=t.querySelector(`#import-status`),a=t.querySelector(`#import-run`);a.addEventListener(`click`,async()=>{let r=t.querySelector(`#import-content`).value;if(!r.trim()){i.textContent=`Paste the page content first.`,i.className=`status error`;return}a.disabled=!0,i.textContent=`Importing…`,i.className=`status`;try{let t=await e.onImport(r);i.textContent=t||`Imported.`,i.className=`status ok`,setTimeout(n,900)}catch(e){i.textContent=e.message,i.className=`status error`,a.disabled=!1}}),t.querySelector(`#import-content`)?.focus()}var k,Jt=null,A={commands:[],categories:[],recommendedLaunchOptions:``,source:`seed`,lastSync:0,cs2Build:``,cs2Version:``,remoteConfigured:!1},j={counts:{},mine:[],comments:{}},Yt=[],Xt={text:``,kind:``},Zt=new Set;function M(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function N(e,t=``){Xt={text:e,kind:t};let n=k?.querySelector(`#commands-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Qt(e){if(!e)return`—`;try{return new Date(e).toLocaleString()}catch{return`—`}}async function $t(){try{A=await y.commands.catalog()}catch(e){N(`Could not load command catalog: ${e.message}`,`error`)}try{j=await y.commands.social()}catch{}if(v(Jt))try{Yt=await y.admin.pendingComments()}catch{Yt=[]}else Yt=[]}function en(e){let t=j.comments[e.key]||[];return`<div class="cmd-comments">${t.length?t.map(e=>`<div class="cmd-comment"><strong>${M(e.username)}</strong><span>${M(e.body)}</span></div>`).join(``):`<p class="hint">No comments yet.</p>`}${Jt?`<form class="cmd-comment-form" data-comment-key="${M(e.key)}">
         <input type="text" maxlength="1000" placeholder="Share a tip about this command…" />
         <button class="btn btn-sm" type="submit">Comment</button>
       </form>
       <p class="hint">Comments are reviewed by an admin before appearing.</p>`:`<button class="btn btn-sm" data-open-auth="login">Log in to comment</button>`}</div>`}function tn(e){let t=j.counts[e.key]||0,n=j.mine.includes(e.key),r=(j.comments[e.key]||[]).length,i=Zt.has(e.key);return`
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
      ${i?en(e):``}
    </article>`}function nn(e){let t=A.commands.filter(t=>t.category===e.id);return t.length?`
    <section class="cmd-category" data-category="${M(e.id)}">
      <h3 class="cmd-cat-title">${M(e.name)} <span class="cmd-count">${t.length}</span></h3>
      <div class="cmd-grid">${t.map(tn).join(``)}</div>
    </section>`:``}function rn(){let e=A.commands.filter(e=>e.isNew).length,t=v(Jt)?`<div class="actions">
         <button class="btn btn-sm" id="cmd-sync">Sync from wiki now</button>
         <button class="btn btn-sm ghost" id="cmd-check-cs2">Re-check CS2 build</button>
       </div>`:``;return`
    <section class="cmd-status-bar">
      <div>
        <strong>Source:</strong> ${M(A.source)}${A.remoteConfigured?``:` (wiki)`} ·
        <strong>CS2 build:</strong> ${A.cs2Build?`${M(A.cs2Build)}${A.cs2Version?` (${M(A.cs2Version)})`:``}`:`—`} ·
        <strong>Last synced:</strong> ${Qt(A.lastSync)}
        ${e?` · <span class="nade-badge new">${e} new</span>`:``}
      </div>
      ${t}
    </section>`}function an(){return!v(Jt)||!Yt.length?``:`
    <section class="cmd-review panel-review">
      <h3>Comments awaiting review (${Yt.length})</h3>
      ${Yt.map(e=>`<div class="review-comment">
            <div><strong>${M(e.username)}</strong> on <code>${M(e.commandKey)}</code><br /><span>${M(e.body)}</span></div>
            <div class="actions">
              <button class="btn btn-sm primary" data-approve-comment="${e.id}">Approve</button>
              <button class="btn btn-sm ghost" data-reject-comment="${e.id}">Reject</button>
            </div>
          </div>`).join(``)}
    </section>`}function on(){k.innerHTML=`
    <div class="commands-shell">
      ${rn()}
      <section class="quick-launch">
        <div>
          <h3>Recommended launch options</h3>
          <p class="hint">Steam → right-click Counter-Strike 2 → Properties → Launch Options.</p>
        </div>
        <div class="cmd-code-row">
          <code class="cmd-code">${M(A.recommendedLaunchOptions||``)}</code>
          <button class="btn" data-copy="${M(A.recommendedLaunchOptions||``)}">Copy</button>
        </div>
      </section>
      ${an()}
      <label class="field cmd-search">
        <span>Search commands</span>
        <input id="cmd-search" type="search" placeholder="Search by command, title, or description…" />
      </label>
      ${A.categories.map(nn).join(``)}
      <div id="commands-status" class="status ${Xt.kind}">${M(Xt.text)}</div>
    </div>`,cn()}function sn(e){let t=e.trim().toLowerCase();k.querySelectorAll(`.cmd-category`).forEach(e=>{let n=0;e.querySelectorAll(`.cmd-card`).forEach(e=>{let r=!t||e.dataset.search.includes(t);e.classList.toggle(`hidden`,!r),r&&(n+=1)}),e.classList.toggle(`hidden`,n===0)})}function cn(){k.querySelectorAll(`[data-copy]`).forEach(e=>e.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e.dataset.copy),N(`Copied to clipboard.`,`ok`)}catch{N(`Clipboard blocked — select and copy manually.`,`error`)}})),k.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.openAuth))),k.querySelectorAll(`[data-recommend]`).forEach(e=>e.addEventListener(`click`,()=>ln(e.dataset.recommend))),k.querySelectorAll(`[data-toggle-comments]`).forEach(e=>e.addEventListener(`click`,()=>{let t=e.dataset.toggleComments;Zt.has(t)?Zt.delete(t):Zt.add(t),on()})),k.querySelectorAll(`.cmd-comment-form`).forEach(e=>e.addEventListener(`submit`,t=>{t.preventDefault(),un(e.dataset.commentKey,e.querySelector(`input`))})),k.querySelectorAll(`[data-approve-comment]`).forEach(e=>e.addEventListener(`click`,()=>dn(e.dataset.approveComment,`approved`))),k.querySelectorAll(`[data-reject-comment]`).forEach(e=>e.addEventListener(`click`,()=>dn(e.dataset.rejectComment,`rejected`))),k.querySelector(`#cmd-search`)?.addEventListener(`input`,e=>sn(e.target.value)),k.querySelector(`#cmd-sync`)?.addEventListener(`click`,fn),k.querySelector(`#cmd-check-cs2`)?.addEventListener(`click`,pn)}async function ln(e){if(!Jt){We(`login`);return}try{let t=await y.commands.recommend(e);j.counts[e]=t.count,j.mine=t.recommended?[...j.mine.filter(t=>t!==e),e]:j.mine.filter(t=>t!==e),on()}catch(e){N(e.message,`error`)}}async function un(e,t){let n=(t?.value||``).trim();if(!n){N(`Write something first.`,`error`);return}try{await y.commands.addComment(e,n),N(`Comment submitted — an admin will review it before it appears.`,`ok`),t&&(t.value=``)}catch(e){N(e.message,`error`)}}async function dn(e,t){try{await y.admin.reviewComment(e,t),await $t(),on(),N(`Comment ${t}.`,`ok`)}catch(e){N(e.message,`error`)}}function fn(){qt({title:`Sync commands from the CS2 wiki`,description:`The Valve wiki has a bot check that blocks servers. Open it in your browser, complete the verification, then copy the page source (wikitext) and paste it here — the server will parse it.`,sourceUrl:`https://developer.valvesoftware.com/w/index.php?title=List_of_Counter-Strike_2_console_command_variables&action=raw`,sourceLabel:`Open CS2 wiki source`,placeholder:`Paste the wiki page source (wikitext), or a JSON list of commands…`,onImport:async e=>{let t=await y.admin.importCommands(e);return await $t(),on(),`Imported ${t.count} commands.`}})}async function pn(){N(`Checking the current CS2 build…`,``);try{let e=await y.admin.checkCommandsCs2();await $t(),on(),N(e.ok?`CS2 build ${e.build}${e.changed?` — changed, catalog re-synced`:` — no change`}.`:`Check failed: ${e.reason}`,e.ok?`ok`:`error`)}catch(e){N(e.message,`error`)}}async function mn(){k=document.querySelector(`#commands-tool`),k&&(Jt=Ee(),De(async e=>{Jt=e,await $t(),on()}),on(),await $t(),on())}var P,F=null,hn=null,gn={paypalUrl:``,steamTradeUrl:``},_n={text:``,kind:``};function I(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function L(e,t=``){_n={text:e,kind:t};let n=P?.querySelector(`#profile-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function vn(e){try{return new Date(e).toLocaleDateString()}catch{return`—`}}async function yn(){if(F){try{hn=(await y.auth.profile()).stats}catch(e){L(e.message,`error`)}if(Se(F))try{gn=await y.settings.get()}catch{}}}function bn(e,t){return`<div class="profile-stat"><dt>${I(e)}</dt><dd>${I(t)}</dd></div>`}function xn(){return Se(F)?`
    <section class="panel profile-settings">
      <div class="panel-head"><h2>Donate links</h2><span class="panel-tag">Owner only</span></div>
      <div class="profile-settings-body">
        <p class="hint">These power the PayPal &amp; Steam buttons in the site footer. Leave a field empty to hide that button.</p>
        <label class="field">
          <span>PayPal link</span>
          <input id="set-paypal" type="url" placeholder="https://www.paypal.com/paypalme/yourname" value="${I(gn.paypalUrl)}" />
        </label>
        <label class="field">
          <span>Steam trade link</span>
          <input id="set-steam" type="url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${I(gn.steamTradeUrl)}" />
        </label>
        <div class="actions">
          <button class="btn primary" id="set-save">Save donate links</button>
        </div>
      </div>
    </section>`:``}function Sn(){if(!F){P.innerHTML=`<div class="profile-shell"><div class="login-prompt">
      <p class="hint">Log in to view your profile.</p>
      <div class="actions"><button class="btn primary" data-open-auth="login">Log in</button><button class="btn" data-open-auth="register">Register</button></div>
    </div></div>`,P.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.openAuth)));return}let e=(F.username||`?`).charAt(0).toUpperCase(),t=hn||{nadesTotal:0,nadesApproved:0,nadesPending:0,recommendations:0,comments:0};P.innerHTML=`
    <div class="profile-shell">
      <section class="panel profile-card">
        <div class="profile-head">
          <div class="profile-avatar">${F.avatarUrl?`<img src="${I(Ce(F.avatarUrl))}" alt="${I(F.username)}" />`:I(e)}</div>
          <div>
            <h2 class="profile-name">${I(F.username)} <span class="nade-badge ${I(F.role)}">${I(F.role)}</span></h2>
            <p class="hint">${F.email?I(F.email):`No email set`} · member since ${vn(F.createdAt)}</p>
            <div class="avatar-controls">
              <input type="file" id="avatar-file" accept="image/*" hidden />
              <button class="btn btn-sm" id="avatar-upload">${F.avatarUrl?`Change photo`:`Upload photo`}</button>
              ${F.avatarUrl?`<button class="btn btn-sm ghost" id="avatar-remove">Remove</button>`:``}
            </div>
          </div>
        </div>
        <dl class="profile-stats">
          ${bn(`Nades submitted`,t.nadesTotal)}
          ${bn(`Approved`,t.nadesApproved)}
          ${bn(`Pending`,t.nadesPending)}
          ${bn(`Commands recommended`,t.recommendations)}
          ${bn(`Comments`,t.comments)}
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
      ${xn()}
      <div id="profile-status" class="status ${_n.kind}">${I(_n.text)}</div>
    </div>`,P.querySelector(`#set-save`)?.addEventListener(`click`,An),P.querySelector(`#pw-save`)?.addEventListener(`click`,wn),P.querySelector(`#username-save`)?.addEventListener(`click`,En),P.querySelector(`#cred-save`)?.addEventListener(`click`,Dn),P.querySelector(`#steam-link`)?.addEventListener(`click`,On),P.querySelector(`#steam-unlink`)?.addEventListener(`click`,kn);let n=P.querySelector(`#avatar-file`);P.querySelector(`#avatar-upload`)?.addEventListener(`click`,()=>n?.click()),n?.addEventListener(`change`,e=>Cn(e.target.files?.[0])),P.querySelector(`#avatar-remove`)?.addEventListener(`click`,Tn)}async function Cn(e){if(e){L(`Uploading image…`,``);try{await y.auth.uploadAvatar(e),await Oe(),L(`Profile image updated.`,`ok`)}catch(e){L(e.message,`error`)}}}async function wn(){let e=P.querySelector(`#pw-current`)?.value||``,t=P.querySelector(`#pw-new`)?.value||``;try{await y.auth.changePassword({currentPassword:e,newPassword:t}),P.querySelector(`#pw-current`).value=``,P.querySelector(`#pw-new`).value=``,L(`Password updated.`,`ok`)}catch(e){L(e.message,`error`)}}async function Tn(){try{await y.auth.setAvatar(``),await Oe(),L(`Profile image removed.`,`ok`)}catch(e){L(e.message,`error`)}}async function En(){let e=P.querySelector(`#acc-username`)?.value||``;try{await y.auth.changeUsername(e),await Oe(),L(`Username updated.`,`ok`)}catch(e){L(e.message,`error`)}}async function Dn(){let e=P.querySelector(`#cred-email`)?.value||``,t=P.querySelector(`#cred-password`)?.value||``;try{await y.auth.setCredentials({email:e,password:t}),await Oe(),L(`Email & password saved — you can now log in without Steam.`,`ok`)}catch(e){L(e.message,`error`)}}async function On(){try{let e=await y.auth.steamLinkUrl();window.location.href=e}catch(e){L(e.message,`error`)}}async function kn(){try{await y.auth.steamUnlink(),await Oe(),L(`Steam unlinked.`,`ok`)}catch(e){L(e.message,`error`)}}async function An(){let e=P.querySelector(`#set-paypal`)?.value||``,t=P.querySelector(`#set-steam`)?.value||``;try{gn=await y.admin.saveSettings({paypalUrl:e,steamTradeUrl:t}),L(`Donate links saved.`,`ok`),document.dispatchEvent(new CustomEvent(`aimkit:settings-updated`))}catch(e){L(e.message,`error`)}}async function jn(){P=document.querySelector(`#profile-tool`),P&&(F=Ee(),De(async e=>{F=e,await yn(),Sn()}),Sn(),await yn(),Sn())}var R,Mn=null,Nn=[],Pn=`top`,Fn=!1,In={text:``,kind:``},Ln=new Set;function Rn(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function zn(e,t=``){In={text:e,kind:t};let n=R?.querySelector(`#configs-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function Bn(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function Vn(e,t){let n=new Blob([t],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}async function Hn(){try{Nn=await y.configs.list({sort:Pn})}catch(e){zn(e.message,`error`)}qn()}function Un(e){let t=Math.round(e),n=``;for(let e=1;e<=5;e+=1)n+=e<=t?`★`:`☆`;return n}function Wn(e){if(!Mn)return`<button class="btn btn-sm" data-open-auth="login">Log in to rate</button>`;if(e.authorId===Mn.id)return`<span class="hint">Your upload</span>`;let t=``;for(let n=1;n<=5;n+=1)t+=`<button class="star-btn ${n<=e.myRating?`on`:``}" data-rate="${e.id}" data-star="${n}" title="${n} star${n>1?`s`:``}">${n<=e.myRating?`★`:`☆`}</button>`;return`<span class="rate-label">Your rating:</span><span class="star-picker">${t}</span>`}function Gn(e){let t=Ln.has(e.id),n=Mn&&(e.authorId===Mn.id||v(Mn));return`
    <article class="config-card" data-search="${Rn(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="config-head">
        <h3>${Rn(e.title)}</h3>
        <div class="config-rating" title="${e.avgRating} from ${e.ratingCount} rating(s)">
          <span class="stars">${Un(e.avgRating)}</span>
          <span class="rating-num">${e.avgRating||`—`} (${e.ratingCount})</span>
        </div>
      </div>
      ${e.description?`<p class="config-desc">${Rn(e.description)}</p>`:``}
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
               ${e.hasConfig?`<div><strong>Config</strong><pre>${Rn(e.configText)}</pre></div>`:``}
               ${e.hasVideo?`<div><strong>Video settings</strong><pre>${Rn(e.videoText)}</pre></div>`:``}
             </div>`:``}
      <div class="config-foot">
        <span>by ${Rn(e.authorName)} · ${Bn(e.createdAt)}</span>
        <span class="config-rate">${Wn(e)}</span>
      </div>
    </article>`}function Kn(){return!Mn||!Fn?``:`
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
    </section>`}function qn(){R.innerHTML=`
    <div class="configs-shell">
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Pn===`top`?`active`:``}" data-sort="top">Most rated</button>
          <button class="tool-tab ${Pn===`new`?`active`:``}" data-sort="new">Last uploaded</button>
        </div>
        <input id="cfg-search" type="search" class="cfg-search" placeholder="Search configs by title, author…" />
        ${Mn?`<button class="btn primary" id="cfg-new">Upload config</button>`:`<button class="btn primary" data-open-auth="login">Log in to upload</button>`}
      </div>
      ${Kn()}
      <div class="config-grid">
        ${Nn.length?Nn.map(Gn).join(``):`<p class="hint">No configs yet — be the first to upload one!</p>`}
      </div>
      <div id="configs-status" class="status ${In.kind}">${Rn(In.text)}</div>
    </div>`,Yn()}function Jn(e){let t=e.trim().toLowerCase();R.querySelectorAll(`.config-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function Yn(){R.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.openAuth))),R.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Pn=e.dataset.sort,Hn()})),R.querySelector(`#cfg-search`)?.addEventListener(`input`,e=>Jn(e.target.value)),R.querySelector(`#cfg-new`)?.addEventListener(`click`,()=>{Fn=!0,qn()}),R.querySelector(`#cfg-cancel`)?.addEventListener(`click`,()=>{Fn=!1,qn()}),R.querySelector(`#cfg-submit`)?.addEventListener(`click`,Qn),R.querySelector(`#cfg-config-file`)?.addEventListener(`change`,e=>Zn(e.target,`#cfg-config`)),R.querySelector(`#cfg-video-file`)?.addEventListener(`change`,e=>Zn(e.target,`#cfg-video`)),R.querySelectorAll(`[data-dl]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Nn.find(t=>String(t.id)===e.dataset.dl);t&&(e.dataset.kind===`config`?Vn(`${Xn(t.title)}.cfg`,t.configText):Vn(`cs2_video.txt`,t.videoText))})),R.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>{let t=Number(e.dataset.view);Ln.has(t)?Ln.delete(t):Ln.add(t),qn()})),R.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>er(Number(e.dataset.del)))),R.querySelectorAll(`[data-rate]`).forEach(e=>e.addEventListener(`click`,()=>$n(Number(e.dataset.rate),Number(e.dataset.star))))}function Xn(e){return(e||`config`).toLowerCase().replace(/[^a-z0-9]+/g,`_`).replace(/^_|_$/g,``).slice(0,40)||`config`}function Zn(e,t){let n=e.files?.[0];if(!n)return;let r=new FileReader;r.onload=()=>{let e=R.querySelector(t);e&&(e.value=String(r.result||``))},r.readAsText(n)}async function Qn(){let e=R.querySelector(`#cfg-title`)?.value||``,t=R.querySelector(`#cfg-desc`)?.value||``,n=R.querySelector(`#cfg-config`)?.value||``,r=R.querySelector(`#cfg-video`)?.value||``;try{await y.configs.create({title:e,description:t,configText:n,videoText:r}),Fn=!1,Pn=`new`,await Hn(),zn(`Config published!`,`ok`)}catch(e){zn(e.message,`error`)}}async function $n(e,t){try{let n=await y.configs.rate(e,t),r=Nn.find(t=>t.id===e);r&&(r.avgRating=n.avgRating,r.ratingCount=n.ratingCount,r.myRating=n.myRating),qn(),zn(`Thanks for rating!`,`ok`)}catch(e){zn(e.message,`error`)}}async function er(e){try{await y.configs.remove(e),await Hn(),zn(`Config deleted.`,`ok`)}catch(e){zn(e.message,`error`)}}async function tr(){R=document.querySelector(`#configs-tool`),R&&(Mn=Ee(),De(async e=>{Mn=e,await Hn()}),qn(),await Hn())}var z,B=null,nr=[],rr=[],ir={text:``,kind:``},ar=!1,or=null;function V(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function H(e,t=``){ir={text:e,kind:t};let n=z?.querySelector(`#highlights-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}function sr(e){try{return new Date(e).toLocaleDateString()}catch{return``}}function cr(e){let t=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(e||``);return t?t[1]:null}function lr(e){return/^https?:\/\//.test(e||``)?e:``}function ur(e){let t=lr(e);if(!t)return``;let n=cr(e);return n?`<iframe class="hl-embed" src="https://www.youtube.com/embed/${V(n)}" title="highlight" allowfullscreen loading="lazy"></iframe>`:/\.(mp4|webm|mov)(\?|$)/i.test(e)?`<video class="hl-embed" src="${V(t)}" controls preload="none"></video>`:`<a class="btn ghost" href="${V(t)}" target="_blank" rel="noopener noreferrer">Open highlight ↗</a>`}async function dr(){try{nr=await y.highlights.list({}),rr=v(B)?await y.admin.highlightReports():[]}catch(e){H(e.message,`error`)}hr()}function fr(){return!v(B)||!rr.length?``:`
    <section class="panel panel-review">
      <h3>Reported highlights (${rr.length})</h3>
      ${rr.map(e=>`<div class="report-item">
            <div class="report-media">${ur(e.url)}</div>
            <div class="report-body">
              <strong>${V(e.title)}</strong> <span class="hint">by ${V(e.authorName)}</span>
              <ul class="report-reasons">
                ${e.reports.map(e=>`<li><strong>${V(e.reporterName)}:</strong> ${V(e.reason||`(no reason given)`)}</li>`).join(``)}
              </ul>
              <div class="actions">
                <button class="btn btn-sm" data-keep="${e.id}">Keep</button>
                <button class="btn btn-sm ghost" data-remove-hl="${e.id}">Delete highlight</button>
              </div>
            </div>
          </div>`).join(``)}
    </section>`}function pr(e){let t=B&&(e.authorId===B.id||v(B));return`
    <article class="hl-card" data-search="${V(`${e.title} ${e.description} ${e.authorName}`.toLowerCase())}">
      <div class="hl-media">${ur(e.url)}</div>
      <h3 class="hl-title">${V(e.title)}</h3>
      ${e.description?`<p class="hl-desc">${V(e.description)}</p>`:``}
      <div class="hl-foot">
        <span>by ${V(e.authorName)} · ${sr(e.createdAt)}</span>
        <span class="hl-actions">
          ${B?e.reportedByMe?`<span class="hint">Reported</span>`:`<button class="btn btn-sm ghost" data-report="${e.id}">Report</button>`:``}
          ${t?`<button class="btn btn-sm ghost" data-del="${e.id}">Delete</button>`:``}
        </span>
      </div>
      ${or===e.id?`<form class="hl-report-form" data-report-form="${e.id}">
               <input type="text" maxlength="500" placeholder="Why are you reporting this? (optional)" />
               <button class="btn btn-sm" type="submit">Submit report</button>
               <button class="btn btn-sm ghost" type="button" data-cancel-report>Cancel</button>
             </form>`:``}
    </article>`}function mr(){return!B||!ar?``:`
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
    </section>`}function hr(){z.innerHTML=`
    <div class="highlights-shell">
      <div class="configs-controls">
        <input id="hl-search" type="search" class="cfg-search" placeholder="Search highlights by title, author…" />
        ${B?`<button class="btn primary" id="hl-new">Share highlight</button>`:`<button class="btn primary" data-open-auth="login">Log in to share</button>`}
      </div>
      ${fr()}
      ${mr()}
      <div class="hl-grid">
        ${nr.length?nr.map(pr).join(``):`<p class="hint">No highlights yet — share the first one!</p>`}
      </div>
      <div id="highlights-status" class="status ${ir.kind}">${V(ir.text)}</div>
    </div>`,_r()}function gr(e){let t=e.trim().toLowerCase();z.querySelectorAll(`.hl-card`).forEach(e=>{e.classList.toggle(`hidden`,t&&!e.dataset.search.includes(t))})}function _r(){z.querySelectorAll(`[data-open-auth]`).forEach(e=>e.addEventListener(`click`,()=>We(e.dataset.openAuth))),z.querySelector(`#hl-search`)?.addEventListener(`input`,e=>gr(e.target.value)),z.querySelector(`#hl-new`)?.addEventListener(`click`,()=>{ar=!0,hr()}),z.querySelector(`#hl-cancel`)?.addEventListener(`click`,()=>{ar=!1,hr()}),z.querySelector(`#hl-submit`)?.addEventListener(`click`,vr),z.querySelectorAll(`[data-report]`).forEach(e=>e.addEventListener(`click`,()=>{or=Number(e.dataset.report),hr()})),z.querySelector(`[data-cancel-report]`)?.addEventListener(`click`,()=>{or=null,hr()}),z.querySelector(`[data-report-form]`)?.addEventListener(`submit`,e=>{e.preventDefault(),yr(Number(e.currentTarget.dataset.reportForm),e.currentTarget.querySelector(`input`).value)}),z.querySelectorAll(`[data-del]`).forEach(e=>e.addEventListener(`click`,()=>br(Number(e.dataset.del)))),z.querySelectorAll(`[data-keep]`).forEach(e=>e.addEventListener(`click`,()=>xr(Number(e.dataset.keep),`keep`))),z.querySelectorAll(`[data-remove-hl]`).forEach(e=>e.addEventListener(`click`,()=>xr(Number(e.dataset.removeHl),`delete`)))}async function vr(){let e=z.querySelector(`#hl-title`)?.value||``,t=z.querySelector(`#hl-desc`)?.value||``,n=z.querySelector(`#hl-url`)?.value||``;try{await y.highlights.create({title:e,description:t,url:n}),ar=!1,await dr(),H(`Highlight shared!`,`ok`)}catch(e){H(e.message,`error`)}}async function yr(e,t){try{await y.highlights.report(e,t),or=null,await dr(),H(`Thanks — an admin will review your report.`,`ok`)}catch(e){H(e.message,`error`)}}async function br(e){try{await y.highlights.remove(e),await dr(),H(`Highlight deleted.`,`ok`)}catch(e){H(e.message,`error`)}}async function xr(e,t){try{await y.admin.reviewHighlight(e,t),await dr(),H(t===`delete`?`Highlight removed.`:`Reports cleared — highlight kept.`,`ok`)}catch(e){H(e.message,`error`)}}async function Sr(){z=document.querySelector(`#highlights-tool`),z&&(B=Ee(),De(async e=>{B=e,await dr()}),hr(),await dr())}var Cr,wr=null,U={pros:[],source:`seed`,lastSync:0},Tr=`featured`,Er=``,Dr=null,Or={text:``,kind:``};function W(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function kr(e,t=``){Or={text:e,kind:t};let n=Cr?.querySelector(`#pros-status`);n&&(n.textContent=e,n.className=`status${t?` ${t}`:``}`)}async function Ar(){try{U=await y.pros.list({sort:Tr,q:Er})}catch(e){kr(e.message,`error`)}Lr()}var jr={"natus vincere":`#f4d000`,vitality:`#f5d20a`,falcons:`#0aa14f`,"team spirit":`#c8102e`,astralis:`#e4002b`,faze:`#e43b26`,g2:`#c8102e`};function Mr(e){return jr[(e||``).toLowerCase()]||`#33415a`}function Nr(e){let t=(e.team||e.player||`?`).trim(),n=t.split(/\s+/);return(n.length>1?n.slice(0,3).map(e=>e[0]).join(``):t.slice(0,2)).toUpperCase()}function Pr(e){let t=e.photo||e.teamLogo||``,n=e.photo&&e.teamLogo?e.teamLogo:``,r=t?`<img class="pro-img" alt="${W(e.player)}" loading="lazy" src="${W(t)}"${n?` data-logo="${W(n)}"`:``} onerror="if(this.dataset.logo){this.src=this.dataset.logo;this.removeAttribute('data-logo');}else{this.remove();}" />`:``;return`<div class="pro-photo" style="--team:${Mr(e.team)}"><span class="pro-monogram">${W(Nr(e))}</span>${r}</div>`}function Fr(e,t){return`<div class="pro-stat"><dt>${W(e)}</dt><dd>${t!=null&&t!==``?W(t):`—`}</dd></div>`}function Ir(e){return`
    <article class="pro-card" data-search="${W(`${e.player} ${e.team||``}`.toLowerCase())}">
      ${Pr(e)}
      <div class="pro-head">
        <div>
          <h3>${W(e.player)}</h3>
          ${e.team?`<p class="hint">${W(e.team)}</p>`:``}
        </div>
        <div class="pro-edpi"><span>${e.edpi??`—`}</span><small>eDPI</small></div>
      </div>
      <dl class="pro-stats">
        ${Fr(`DPI`,e.dpi)}
        ${Fr(`Sens`,e.sens)}
        ${Fr(`Zoom`,e.zoomSens)}
        ${Fr(`Hz`,e.hz)}
        ${Fr(`Resolution`,e.resolution)}
        ${Fr(`Aspect`,e.aspectRatio)}
      </dl>
    </article>`}function Lr(){let e=v(wr)?`<button class="btn btn-sm" id="pros-sync">Sync from HLTV</button>`:``;Cr.innerHTML=`
    <div class="pros-shell">
      <div class="cmd-status-bar">
        <div><strong>Source:</strong> ${W(U.source)} · <strong>${U.pros.length}</strong> players${U.lastSync?` · synced ${W(new Date(U.lastSync).toLocaleDateString())}`:``}</div>
        ${e}
      </div>
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${Tr===`featured`?`active`:``}" data-sort="featured">Featured</button>
          <button class="tool-tab ${Tr===`name`?`active`:``}" data-sort="name">Name</button>
          <button class="tool-tab ${Tr===`edpi`?`active`:``}" data-sort="edpi">Lowest eDPI</button>
          <button class="tool-tab ${Tr===`edpi-desc`?`active`:``}" data-sort="edpi-desc">Highest eDPI</button>
        </div>
        <input id="pros-search" type="search" class="cfg-search" placeholder="Search player or team…" value="${W(Er)}" />
      </div>
      <p class="hint">${U.source===`prosettings`?`Live from prosettings.net.`:U.source===`seed`?`Built-in list. Admins can sync live data from prosettings.net.`:`Source: ${W(U.source)}.`}</p>
      <div class="pro-grid">
        ${U.pros.length?U.pros.map(Ir).join(``):`<p class="hint">No pro settings yet.</p>`}
      </div>
      <div id="pros-status" class="status ${Or.kind}">${W(Or.text)}</div>
    </div>`,Rr()}function Rr(){Cr.querySelectorAll(`[data-sort]`).forEach(e=>e.addEventListener(`click`,()=>{Tr=e.dataset.sort,Ar()}));let e=Cr.querySelector(`#pros-search`);e&&e.addEventListener(`input`,e=>{Er=e.target.value,clearTimeout(Dr),Dr=setTimeout(async()=>{await Ar();let e=Cr.querySelector(`#pros-search`);e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},300)}),Cr.querySelector(`#pros-sync`)?.addEventListener(`click`,zr)}function zr(){qt({title:`Import pro settings from HLTV`,description:`HLTV has a Cloudflare check that blocks servers. Open HLTV in your browser, complete the verification, then paste a JSON list of players here. Each item: {"player","team","dpi","sens","zoomSens","hz","resolution","aspectRatio","photo","teamLogo"}.`,sourceUrl:`https://www.hltv.org/stats/players`,sourceLabel:`Open HLTV`,placeholder:`[{"player":"s1mple","team":"Natus Vincere","dpi":400,"sens":3.09,"hz":1000,"resolution":"1280x960","aspectRatio":"4:3"}]`,onImport:async e=>{let t=await y.admin.importPros(e);return await Ar(),`Imported ${t.count} players.`}})}async function Br(){Cr=document.querySelector(`#pros-tool`),Cr&&(wr=Ee(),De(e=>{wr=e,Lr()}),Lr(),await Ar())}function Vr(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function Hr(){let e=Ee(),t=document.createElement(`div`);t.className=`modal`,t.innerHTML=`
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact us">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Contact us</h2>
      <p class="hint">Send us a message and we'll get back to you at your email.</p>
      <form id="contact-form" class="auth-form-modal">
        <label class="field"><span>Your name</span><input id="contact-name" type="text" value="${Vr(e?.username||``)}" /></label>
        <label class="field"><span>Your email</span><input id="contact-email" type="email" value="${Vr(e?.email||``)}" /></label>
        <label class="field"><span>Subject</span><input id="contact-subject" type="text" placeholder="What's this about?" /></label>
        <label class="field"><span>Message</span><textarea id="contact-message" rows="5" placeholder="How can we help?"></textarea></label>
        <button class="btn primary" type="submit">Send message</button>
        <p class="status" id="contact-status"></p>
      </form>
    </div>`,document.body.appendChild(t);let n=()=>t.remove();t.querySelectorAll(`[data-close]`).forEach(e=>e.addEventListener(`click`,n));let r=t.querySelector(`#contact-status`);t.querySelector(`#contact-form`).addEventListener(`submit`,async e=>{e.preventDefault();let i={name:t.querySelector(`#contact-name`).value,email:t.querySelector(`#contact-email`).value,subject:t.querySelector(`#contact-subject`).value,message:t.querySelector(`#contact-message`).value};r.textContent=`Sending…`,r.className=`status`;try{await y.contact.send(i),r.textContent=`Thanks! Your message has been sent.`,r.className=`status ok`,setTimeout(n,1200)}catch(e){r.textContent=e.message,r.className=`status error`}}),t.querySelector(`#contact-name`)?.focus()}var Ur={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]};function Wr(e){if(e.color===5)return`rgb(${e.red}, ${e.green}, ${e.blue})`;let t=Ur[e.color]??Ur[1];return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}function Gr(e){return e.alphaEnabled?Math.min(1,Math.max(0,e.alpha/255)):1}function Kr(e,t,n=1){let r=e.getContext(`2d`);if(!r)return;let i=e.width,a=i/2,o=i/2;r.clearRect(0,0,i,i);let s=r.createLinearGradient(0,0,i,i);s.addColorStop(0,`#3a4a38`),s.addColorStop(.45,`#5c6b52`),s.addColorStop(1,`#2a3328`),r.fillStyle=s,r.fillRect(0,0,i,i);let c=Math.max(24,Math.round(i/9));r.strokeStyle=`rgba(255,255,255,0.06)`,r.lineWidth=Math.max(1,Math.round(i/280));for(let e=0;e<i;e+=c)r.beginPath(),r.moveTo(e,0),r.lineTo(e,i),r.stroke(),r.beginPath(),r.moveTo(0,e),r.lineTo(i,e),r.stroke();if(!t){r.globalAlpha=.35,r.fillStyle=`#fff`,r.font=`${Math.round(i*.05)}px Outfit, sans-serif`,r.textAlign=`center`,r.fillText(`Enter a code or commands`,a,o+i*.02),r.globalAlpha=1;return}let l=Wr(t),u=Gr(t),d=Math.max(0,Math.round(t.length*n)),f=Math.max(1,Math.round(t.thickness*n)),p=Math.round(t.gap*n),m=t.outlineEnabled?Math.max(1,Math.round(t.outline*n)):0,ee=Math.round(a)+(f%2,0),h=Math.round(o),g=(e,t,n,i)=>{n<=0||i<=0||(m>0&&(r.globalAlpha=u,r.fillStyle=`#000`,r.fillRect(e-m,t-m,n+m*2,i+m*2)),r.globalAlpha=u,r.fillStyle=l,r.fillRect(e,t,n,i))},te=Math.floor(f/2);if(d>0&&(g(ee+p,h-te,d,f),g(ee-p-d,h-te,d,f),g(ee-te,h+p,f,d),t.tStyleEnabled||g(ee-te,h-p-d,f,d)),t.centerDotEnabled){let e=f;g(ee-Math.floor(e/2),h-Math.floor(e/2),e,e)}r.globalAlpha=1,(t.style===2||t.style===3)&&(r.globalAlpha=.6,r.fillStyle=`#fff`,r.font=`${Math.round(i*.039)}px JetBrains Mono, monospace`,r.textAlign=`center`,r.fillText(`style ${t.style} · dynamic (shown static)`,a,i-Math.round(i*.05)),r.globalAlpha=1)}var G=132;function qr({source:e,stage:t,toggleBtn:n,zoomSelect:r}){let i=document.createElement(`canvas`);i.className=`magnifier-lens hidden`,i.width=G,i.height=G,t.appendChild(i);let a=i.getContext(`2d`),o=!1,s=Number(r?.value)||4,c=null;function l(e){o=e,n.classList.toggle(`active`,e),n.setAttribute(`aria-pressed`,String(e)),t.classList.toggle(`magnifier-on`,e),e||(i.classList.add(`hidden`),c=null)}function u(){if(!o||!c||!a)return;let t=G/s;a.imageSmoothingEnabled=!1,a.clearRect(0,0,G,G),a.fillStyle=`#0e1017`,a.fillRect(0,0,G,G);try{a.drawImage(e,c.sx-t/2,c.sy-t/2,t,t,0,0,G,G)}catch{}a.strokeStyle=`rgba(255,255,255,0.28)`,a.lineWidth=1,a.beginPath(),a.moveTo(66.5,0),a.lineTo(66.5,G),a.moveTo(0,66.5),a.lineTo(G,66.5),a.stroke()}function d(n,r){if(!o)return;let a=e.getBoundingClientRect(),s=n-a.left,l=r-a.top;if(s<0||l<0||s>a.width||l>a.height){i.classList.add(`hidden`);return}c={sx:s*(e.width/a.width),sy:l*(e.height/a.height)};let d=t.getBoundingClientRect();i.style.left=`${n-d.left-G/2}px`,i.style.top=`${r-d.top-G/2}px`,i.classList.remove(`hidden`),u()}e.addEventListener(`mousemove`,e=>d(e.clientX,e.clientY)),e.addEventListener(`mouseleave`,()=>{o&&i.classList.add(`hidden`)});let f=e=>{!o||!e.touches[0]||(e.preventDefault(),d(e.touches[0].clientX,e.touches[0].clientY))};return e.addEventListener(`touchstart`,f,{passive:!1}),e.addEventListener(`touchmove`,f,{passive:!1}),n.addEventListener(`click`,()=>l(!o)),r&&r.addEventListener(`change`,()=>{s=Number(r.value)||4,u()}),{refresh:u,setEnabled:l}}var K={cs2:{id:`cs2`,name:`Counter-Strike 2`,yaw:.022,supportsMYaw:!0},csgo:{id:`csgo`,name:`CS:GO`,yaw:.022},valorant:{id:`valorant`,name:`Valorant`,yaw:.07},apex:{id:`apex`,name:`Apex Legends`,yaw:.022},overwatch2:{id:`overwatch2`,name:`Overwatch 2`,yaw:.0066},r6:{id:`r6`,name:`Rainbow Six Siege`,yaw:.00572958},fortnite:{id:`fortnite`,name:`Fortnite`,yaw:.005555},cod:{id:`cod`,name:`Call of Duty`,yaw:.0066},tf2:{id:`tf2`,name:`Team Fortress 2`,yaw:.022},marvel:{id:`marvel`,name:`Marvel Rivals`,yaw:.022},deadlock:{id:`deadlock`,name:`Deadlock`,yaw:.044},tf:{id:`tf`,name:`The Finals`,yaw:.0066},custom:{id:`custom`,name:`Custom (yaw)`,yaw:.022,custom:!0}},Jr=Object.values(K);function Yr(e,t=.022,n){let r=K[e];if(!r)throw Error(`Unknown game: ${e}`);return r.custom?Number(n)>0?Number(n):r.yaw:r.supportsMYaw?t:r.yaw}function Xr(e,t,n){return e<=0||t<=0||n<=0?NaN:914.4/(e*t*n)}function Zr({sourceGame:e,targetGame:t,sourceSens:n,sourceDpi:r,targetDpi:i,sourceMYaw:a=.022,targetMYaw:o=.022,sourceCustomYaw:s,targetCustomYaw:c}){let l=Yr(e,a,s),u=Yr(t,o,c),d=r/i*n*(l/u),f=Xr(n,r,l),p=Xr(d,i,u);return{targetSensitivity:d,cm360:f,inches360:f/2.54,sourceEdpi:n*r,targetEdpi:d*i,sourceYaw:l,targetYaw:u,targetCm360:p,ratio:l/u}}function q(e,t=4){return Number.isFinite(e)?String(Number(e.toFixed(t))):`—`}function Qr(e,t=1){return Number.isFinite(e)?e.toFixed(t):`—`}function $r(e){return Jr.map(t=>`<option value="${t.id}"${t.id===e?` selected`:``}>${t.name}</option>`).join(``)}var ei=/^CSGO(-[\w]{5}){5}$/i,ti=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.1 7.3c.3 2-.3 3.6-1.5 4.8-1.2 1.2-3 1.8-5.2 1.8h-1.1c-.4 0-.8.3-.9.8l-.7 4.5-.2 1.1c0 .3-.3.5-.6.5H6.2c-.3 0-.5-.3-.4-.6L8 6.1c.1-.6.6-1 1.2-1h5.3c2.7 0 4.7.9 5.3 2.9.1.4.2.9.3 1.3z"/><path fill="currentColor" opacity=".55" d="M8.9 9.3c.1-.6.6-1 1.2-1h4.2c.6 0 1.1.1 1.6.2-.3-1.6-1.7-2.4-3.9-2.4H6.8c-.4 0-.8.3-.9.8L3.5 21c0 .3.2.6.5.6h3.1l1.8-12.3z"/></svg>`,ni=`<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Zm-1.87-2.51a1.88 1.88 0 1 0 3.76 0 1.88 1.88 0 0 0-3.76 0Z"/></svg>`,ri=document.querySelector(`#app`);ri.innerHTML=`
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
`;var ii=document.querySelector(`#preview-canvas`),ai=document.querySelector(`#preview-stats`),oi=document.querySelector(`#preview-res`),si=document.querySelector(`#preview-res-scale`),ci=`ingame`;function li(){let e=ci===`fullscreen`?1080:280;ii.width!==e&&(ii.width=e,ii.height=e),ii.style.imageRendering=ci===`fullscreen`?`auto`:`pixelated`}li();var ui=[{id:`1920x1080`,h:1080,label:`1920 × 1080 (16:9)`},{id:`2560x1440`,h:1440,label:`2560 × 1440 (16:9)`},{id:`3840x2160`,h:2160,label:`3840 × 2160 (4K)`},{id:`1600x900`,h:900,label:`1600 × 900 (16:9)`},{id:`1366x768`,h:768,label:`1366 × 768 (16:9)`},{id:`1280x960`,h:960,label:`1280 × 960 (4:3)`},{id:`1024x768`,h:768,label:`1024 × 768 (4:3)`},{id:`1280x1024`,h:1024,label:`1280 × 1024 (5:4)`}],di=null;function fi(){return ci===`fullscreen`?ii.height/1080:(ui.find(e=>e.id===oi?.value)||ui[0]).h/1080}var pi=qr({source:ii,stage:document.querySelector(`.preview-stage`),toggleBtn:document.querySelector(`#magnifier-toggle`),zoomSelect:document.querySelector(`#magnifier-zoom`)});function mi(e){if(di=e,Kr(ii,e,fi()),si)if(e){let t=ui.find(e=>e.id===oi?.value)||ui[0],n=t.h/1080;si.textContent=`≈ ${Math.max(0,Math.round(e.length*n))}px arms · ${Math.max(1,Math.round(e.thickness*n))}px thick @ ${t.h}p`}else si.textContent=``;pi.refresh()}function hi(e){ci=e===`fullscreen`?`fullscreen`:`ingame`,li(),document.querySelectorAll(`.pmode`).forEach(e=>{let t=e.dataset.pmode===ci;e.classList.toggle(`active`,t),e.setAttribute(`aria-selected`,String(t))});let t=document.querySelector(`#preview-mode-tag`);t&&(t.textContent=ci===`fullscreen`?`Relative to full screen`:`Actual in-game size`),mi(di)}document.querySelectorAll(`.pmode`).forEach(e=>e.addEventListener(`click`,()=>hi(e.dataset.pmode)));var J=document.querySelector(`#crosshair-status`),gi=document.querySelector(`#sensitivity-status`),_i=document.querySelector(`#sharecode-input`),vi=document.querySelector(`#commands-output`),yi=document.querySelector(`#commands-input`),bi=document.querySelector(`#sharecode-output`),Y=document.querySelector(`#sens-from-game`),X=document.querySelector(`#sens-to-game`),xi=document.querySelector(`#sens-source`),Si=document.querySelector(`#sens-target`),Ci=document.querySelector(`#sens-source-dpi`),wi=document.querySelector(`#sens-target-dpi`),Ti=document.querySelector(`#sens-source-myaw`),Ei=document.querySelector(`#sens-target-myaw`),Di=document.querySelector(`#sens-source-yaw`),Oi=document.querySelector(`#sens-target-yaw`),ki=document.querySelector(`#source-yaw-field`),Ai=document.querySelector(`#target-yaw-field`),ji=document.querySelector(`#m-yaw-fields`),Mi=document.querySelector(`#sens-cm360`),Ni=document.querySelector(`#sens-stats`),Pi=document.querySelector(`#sens-formula`),Fi=`CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK`,Ii=`cl_crosshairstyle 4
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
cl_crosshair_recoil 0`;function Z(e,t,n=``){e&&(e.textContent=t,e.className=`status${n?` ${n}`:``}`)}function Li(e){mi(e),ai.innerHTML=`
    <div><dt>Style</dt><dd>${e.style}</dd></div>
    <div><dt>Size</dt><dd>${e.length}</dd></div>
    <div><dt>Gap</dt><dd>${e.gap}</dd></div>
    <div><dt>Thickness</dt><dd>${e.thickness}</dd></div>
    <div><dt>Dot</dt><dd>${e.centerDotEnabled?`On`:`Off`}</dd></div>
    <div><dt>Outline</dt><dd>${e.outlineEnabled?e.outline:`Off`}</dd></div>
    <div><dt>Color</dt><dd>${e.color===5?`RGB ${e.red}/${e.green}/${e.blue}`:`Preset ${e.color}`}</dd></div>
    <div><dt>Alpha</dt><dd>${e.alphaEnabled?e.alpha:`Off`}</dd></div>
  `}function Ri(e){return e.trim().replace(/\s+/g,``).replace(/^csgo/i,`CSGO`)}function zi(){let e=_i.value.trim();if(!e){Z(J,`Paste a crosshair share code first.`,`error`);return}let t=Ri(e);if(!ei.test(t)){Z(J,`Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`,`error`);return}try{let e=d(t);_i.value=t,vi.value=ae(p(e)),Li(e),Z(J,`Converted share code to console commands.`,`ok`)}catch(e){e instanceof i||e instanceof r?Z(J,`That share code is not a valid crosshair code.`,`error`):Z(J,e instanceof Error?e.message:`Failed to decode share code.`,`error`)}}function Bi(){let e=yi.value.trim();if(!e){Z(J,`Paste crosshair console commands first.`,`error`);return}try{let t=ie(e);bi.value=f(t),Li(t),Z(J,`Converted commands to share code.`,`ok`)}catch(e){Z(J,e instanceof Error?e.message:`Failed to encode share code.`,`error`)}}async function Vi(e,t,n){if(!t){Z(e,`Nothing to copy for ${n}.`,`error`);return}try{await navigator.clipboard.writeText(t),Z(e,`Copied ${n} to clipboard.`,`ok`)}catch{Z(e,`Clipboard access failed. Select and copy manually.`,`error`)}}function Hi(){let e=K[Y.value]?.supportsMYaw||K[X.value]?.supportsMYaw;ji?.classList.toggle(`hidden`,!e),ki?.classList.toggle(`hidden`,!K[Y.value]?.custom),Ai?.classList.toggle(`hidden`,!K[X.value]?.custom)}function Ui(){let e=Number(xi.value),t=Number(Ci.value),n=Number(wi.value),r=Number(Ti.value)||.022,i=Number(Ei.value)||.022,a=Number(Di.value),o=Number(Oi.value);if(Hi(),K[Y.value]?.custom&&!(a>0)){Z(gi,`Enter a valid source custom yaw (° per count).`,`error`);return}if(K[X.value]?.custom&&!(o>0)){Z(gi,`Enter a valid target custom yaw (° per count).`,`error`);return}if(!Number.isFinite(e)||e<=0){Si.value=``,Mi.textContent=`—`,Ni.innerHTML=``,Pi.textContent=``;return}if(!Number.isFinite(t)||t<=0||!Number.isFinite(n)||n<=0){Z(gi,`Enter valid DPI values.`,`error`);return}let s=Zr({sourceGame:Y.value,targetGame:X.value,sourceSens:e,sourceDpi:t,targetDpi:n,sourceMYaw:r,targetMYaw:i,sourceCustomYaw:a,targetCustomYaw:o}),c=K[Y.value].name,l=K[X.value].name,u=q(s.targetSensitivity);Si.value=u,Mi.textContent=Qr(s.cm360),Ni.innerHTML=`
    <div><dt>Inches / 360°</dt><dd>${Qr(s.inches360)} in</dd></div>
    <div><dt>Source eDPI</dt><dd>${Qr(s.sourceEdpi,0)}</dd></div>
    <div><dt>Target eDPI</dt><dd>${Qr(s.targetEdpi,0)}</dd></div>
    <div><dt>Source yaw</dt><dd>${s.sourceYaw}</dd></div>
    <div><dt>Target yaw</dt><dd>${s.targetYaw}</dd></div>
    <div><dt>Multiplier</dt><dd>× ${q(s.ratio,5)}</dd></div>
  `,Pi.innerHTML=`
    <strong>Formula:</strong>
    target = source × (source DPI ÷ target DPI) × (source yaw ÷ target yaw)<br />
    ${u} = ${e} × (${t} ÷ ${n}) × (${s.sourceYaw} ÷ ${s.targetYaw})
  `,Z(gi,`${c} → ${l}: ${u}`,`ok`)}function Wi(){let e=Y.value;Y.value=X.value,X.value=e,Si.value&&(xi.value=Si.value),Ui()}function Gi(){Y.value=`cs2`,X.value=`valorant`,xi.value=`1.25`,Ci.value=`800`,wi.value=`800`,Ui()}var Ki={crosshair:`Convert a crosshair share code into console commands, build a code from commands, or design one visually with a live preview.`,sensitivity:`Keep the same cm/360 aim feel across games — with custom yaw values and DPI changes handled for you.`,psa:`Dial in your ideal sensitivity with a guided 7-round A/B test (Perfect Sensitivity Approximation).`,nades:`Browse community grenade line-ups, or sign in to submit your own with a 2D throw guide, videos and photos.`,commands:`Copy up-to-date CS2 launch options and console commands, recommend the ones that help, and share tips in the comments.`,configs:`Share your CS2 configs and video settings, download other players’ setups, and rate the best ones.`,highlights:`Share your best CS2 clips, watch the community’s highlights, and report anything that breaks the rules.`,pros:`Browse pro players’ sensitivity, DPI, resolution and crosshair settings.`,profile:`Your account, contributions, and settings.`},qi=document.querySelector(`#tool-desc`);function Ji(e){qi&&(qi.textContent=Ki[e]||``)}function Yi(e){document.querySelectorAll(`.tool-nav .tool-tab`).forEach(t=>{let n=t.getAttribute(`data-tool`)===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.tool-view`).forEach(t=>{t.classList.toggle(`active`,t.id===`${e}-tool`)}),Ji(e),window.scrollTo({top:0,behavior:`smooth`})}document.querySelectorAll(`.tool-nav .tool-tab`).forEach(e=>{e.addEventListener(`click`,()=>Yi(e.getAttribute(`data-tool`)))}),document.addEventListener(`aimkit:navigate`,e=>Yi(e.detail)),Ji(`crosshair`),document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);document.querySelectorAll(`.converter-panel .tab`).forEach(e=>{let n=e.getAttribute(`data-tab`)===t;e.classList.toggle(`active`,n),e.setAttribute(`aria-selected`,String(n))}),document.querySelectorAll(`.converter-panel .tab-panel`).forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-panel`)===t)})})}),document.querySelector(`#decode-btn`)?.addEventListener(`click`,zi),document.querySelector(`#encode-btn`)?.addEventListener(`click`,Bi),_i.addEventListener(`keydown`,e=>{e.key===`Enter`&&zi()}),yi.addEventListener(`input`,()=>{let e=yi.value.trim();if(!e){mi(null),ai.innerHTML=``;return}try{Li(ie(e))}catch{}}),_i.addEventListener(`input`,()=>{let e=Ri(_i.value);if(ei.test(e))try{Li(d(e))}catch{}}),document.querySelector(`#copy-commands`)?.addEventListener(`click`,()=>{Vi(J,vi.value,`commands`)}),document.querySelector(`#copy-code`)?.addEventListener(`click`,()=>{Vi(J,bi.value,`share code`)}),document.querySelector(`#copy-sharecode-cmd`)?.addEventListener(`click`,()=>{let e=Ri(_i.value);if(!e){Z(J,`Enter a share code first.`,`error`);return}Vi(J,`cl_crosshair_sharecode "${e}"`,`import command`)}),document.querySelector(`#load-example-code`)?.addEventListener(`click`,()=>{_i.value=Fi,zi()}),document.querySelector(`#load-example-cmd`)?.addEventListener(`click`,()=>{yi.value=Ii,Bi()});var Xi={0:[255,255,255],1:[50,250,50],2:[255,255,0],3:[50,50,250],4:[50,250,250]},Q={...h},Zi=document.querySelector(`#ed-style`),Qi=document.querySelector(`#ed-color`),$i=document.querySelector(`#ed-custom-color`),ea=document.querySelector(`#ed-custom-color-field`),ta=document.querySelector(`#ed-r`),na=document.querySelector(`#ed-g`),ra=document.querySelector(`#ed-b`),ia=document.querySelector(`#ed-rgb-val`),aa=document.querySelector(`#ed-color-swatch`);function oa(e,t){e&&document.activeElement!==e&&(e.value=String(t))}var sa=document.querySelector(`#ed-length`),ca=document.querySelector(`#ed-thickness`),la=document.querySelector(`#ed-gap`),ua=document.querySelector(`#ed-outline`),da=document.querySelector(`#ed-alpha`),fa=document.querySelector(`#ed-dot`),pa=document.querySelector(`#ed-tstyle`),ma=document.querySelector(`#ed-outline-on`),ha=document.querySelector(`#ed-alpha-on`),ga=document.querySelector(`#ed-sharecode`),_a=document.querySelector(`#ed-commands`),va=document.querySelector(`#ed-length-num`),ya=document.querySelector(`#ed-thickness-num`),ba=document.querySelector(`#ed-gap-num`),xa=document.querySelector(`#ed-outline-num`),Sa=document.querySelector(`#ed-alpha-num`),Ca=document.querySelector(`#ed-r-num`),wa=document.querySelector(`#ed-g-num`),Ta=document.querySelector(`#ed-b-num`),Ea=(e,t,n)=>Math.max(t,Math.min(n,e)),Da=[{key:`length`,slider:sa,num:va,min:0,max:15},{key:`thickness`,slider:ca,num:ya,min:0,max:6},{key:`gap`,slider:la,num:ba,min:-10,max:10},{key:`outline`,slider:ua,num:xa,min:0,max:3},{key:`alpha`,slider:da,num:Sa,min:0,max:255}],Oa=[{key:`red`,slider:ta,num:Ca},{key:`green`,slider:na,num:wa},{key:`blue`,slider:ra,num:Ta}];function ka(e,t,n){let r=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,`0`);return`#${r(e)}${r(t)}${r(n)}`}function Aa(e){let t=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(e.trim());return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:{r:Q.red,g:Q.green,b:Q.blue}}function ja(){let e=ka(Q.red,Q.green,Q.blue);Qi.value=String(Q.color),oa($i,e);for(let e of Oa)oa(e.slider,Q[e.key]),oa(e.num,Q[e.key]);ia&&(ia.textContent=`${Q.red}, ${Q.green}, ${Q.blue}`),aa&&(aa.style.background=e),ea?.classList.toggle(`hidden`,Q.color!==5)}function Ma(){for(let e of Da)oa(e.slider,Ea(Q[e.key],e.min,e.max)),oa(e.num,Q[e.key])}function Na(){Zi.value=String(Q.style),fa.checked=Q.centerDotEnabled,pa.checked=Q.tStyleEnabled,ma.checked=Q.outlineEnabled,ha.checked=Q.alphaEnabled,Ma(),ja()}function Pa(){Ma();let e=!Q.outlineEnabled;ua.disabled=e,xa.disabled=e;let t=!Q.alphaEnabled;da.disabled=t,Sa.disabled=t;try{ga.value=f(Q)}catch{ga.value=``}_a.value=ae(p(Q))}function Fa(){Li(Q),Pa()}function Ia(){Q.style=Number(Zi.value),Q.centerDotEnabled=fa.checked,Q.tStyleEnabled=pa.checked,Q.outlineEnabled=ma.checked,Q.alphaEnabled=ha.checked,Fa()}function La(e){Q[e.key]=Number(e.slider.value),Fa()}function Ra(e,t){let n=Number(e.num.value);if(e.num.value===``||!Number.isFinite(n)){t&&(e.num.value=String(Q[e.key]));return}Q[e.key]=Ea(n,e.min,e.max),t&&(e.num.value=String(Q[e.key])),Fa()}function za(){Q.color=5,Q.red=Ea(Number(Ca.value)||0,0,255),Q.green=Ea(Number(wa.value)||0,0,255),Q.blue=Ea(Number(Ta.value)||0,0,255),ja(),Fa()}function Ba(){if(Q.color=Number(Qi.value),Q.color!==5){let[e,t,n]=Xi[Q.color]??Xi[1];Q.red=e,Q.green=t,Q.blue=n}ja(),Fa()}function Va(){Q.color=5,Q.red=Number(ta.value),Q.green=Number(na.value),Q.blue=Number(ra.value),ja(),Fa()}function Ha(){Q.color=5;let{r:e,g:t,b:n}=Aa($i.value);Q.red=e,Q.green=t,Q.blue=n,ja(),Fa()}Da.forEach(e=>{e.slider.addEventListener(`input`,()=>La(e)),e.num.addEventListener(`input`,()=>Ra(e,!1)),e.num.addEventListener(`change`,()=>Ra(e,!0))}),[Zi,fa,pa,ma,ha].forEach(e=>e.addEventListener(`change`,Ia)),Qi.addEventListener(`change`,Ba),$i.addEventListener(`input`,Ha),$i.addEventListener(`change`,Ha),Oa.forEach(e=>{e.slider.addEventListener(`input`,Va),e.num.addEventListener(`input`,za),e.num.addEventListener(`change`,za)}),document.querySelector(`#ed-copy-code`)?.addEventListener(`click`,()=>{Vi(J,ga.value,`share code`)}),document.querySelector(`#ed-copy-commands`)?.addEventListener(`click`,()=>{Vi(J,_a.value,`commands`)}),document.querySelector(`#ed-reset`)?.addEventListener(`click`,()=>{Object.assign(Q,h),Na(),Fa(),Z(J,`Crosshair reset to defaults.`,`ok`)}),document.querySelector(`.converter-panel .tab[data-tab="visual"]`)?.addEventListener(`click`,Fa),Na(),Pa(),Y.innerHTML=$r(`cs2`),X.innerHTML=$r(`valorant`),[Y,X,xi,Ci,wi,Ti,Ei,Di,Oi].forEach(e=>{e.addEventListener(`input`,Ui),e.addEventListener(`change`,Ui)}),document.querySelector(`#sens-swap`)?.addEventListener(`click`,Wi),document.querySelector(`#copy-sens`)?.addEventListener(`click`,()=>{Vi(gi,Si.value,`converted sensitivity`)}),document.querySelector(`#sens-cs2-val`)?.addEventListener(`click`,Gi);var Ua=document.querySelector(`#psa-start`),Wa=document.querySelector(`#psa-begin`),Ga=document.querySelector(`#psa-round`),Ka=document.querySelector(`#psa-round-num`),qa=document.querySelector(`#psa-bar-fill`),Ja=document.querySelector(`#psa-lower`),Ya=document.querySelector(`#psa-higher`),Xa=document.querySelector(`#psa-lower-val`),Za=document.querySelector(`#psa-higher-val`),Qa=document.querySelector(`#psa-undo`),$a=document.querySelector(`#psa-reset`),eo=document.querySelector(`#psa-result`),to=document.querySelector(`#psa-result-label`),no=document.querySelector(`#psa-stats`),ro=document.querySelector(`#psa-history`),io=document.querySelector(`#psa-status`),$=null;function ao(){if(!$){Ga?.classList.add(`hidden`),ro?.classList.add(`hidden`),eo.textContent=`—`,to.textContent=`recommended sensitivity`,no.innerHTML=``;return}let e=le($),t=e?me($):ue($);if(eo.textContent=q(t,3),to.textContent=e?`final recommended sensitivity`:`current estimate`,no.innerHTML=`
    <div><dt>Range low</dt><dd>${q($.lo,3)}</dd></div>
    <div><dt>Range high</dt><dd>${q($.hi,3)}</dd></div>
    <div><dt>Spread</dt><dd>± ${q(de($)/2*100,1)}%</dd></div>
    <div><dt>Base</dt><dd>${q($.base,3)}</dd></div>
  `,e)Ga?.classList.add(`hidden`),Z(io,`Done — set your sensitivity to ${q(t,3)} and play a few sessions before changing again.`,`ok`);else{let{lower:e,higher:t}=ce($);Ga?.classList.remove(`hidden`),Ka.textContent=String($.round),qa.style.width=`${($.round-1)/7*100}%`,Xa.textContent=q(e,3),Za.textContent=q(t,3),Z(io,`Round ${$.round} of 7: test both values, then pick the side that feels better.`,``)}$.choices.length>0?(ro?.classList.remove(`hidden`),ro.innerHTML=`<strong>History:</strong><br />${$.choices.map(e=>`Round ${e.round}: chose <strong>${e.side}</strong> (${q(e.lower,3)} vs ${q(e.higher,3)})`).join(`<br />`)}`):(ro?.classList.add(`hidden`),ro.innerHTML=``)}function oo(){let e=Number(Ua.value);if(!Number.isFinite(e)||e<=0){Z(io,`Enter a valid starting sensitivity greater than 0.`,`error`);return}$=se(e),ao()}function so(e){!$||le($)||($=fe($,e),ao())}Wa?.addEventListener(`click`,oo),Ja?.addEventListener(`click`,()=>so(`lower`)),Ya?.addEventListener(`click`,()=>so(`higher`)),Qa?.addEventListener(`click`,()=>{$&&($=pe($),ao())}),$a?.addEventListener(`click`,()=>{$=null,ao(),Z(io,`Enter a starting sensitivity and press Start PSA.`,``)}),oi.innerHTML=ui.map(e=>`<option value="${e.id}">${e.label}</option>`).join(``),oi.addEventListener(`change`,()=>mi(di)),mi(null),zi(),Gi();function co(e){return String(e||``).replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`)}function lo(e){let t=document.querySelector(`#donate-section`),n=document.querySelector(`#donate-actions`);if(!t||!n)return;let r=[];e.paypalUrl&&r.push(`<a class="btn donate-btn paypal" href="${co(e.paypalUrl)}" target="_blank" rel="noopener noreferrer">${ti}<span>Donate via PayPal</span></a>`),e.steamTradeUrl&&r.push(`<a class="btn donate-btn steam" href="${co(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer">${ni}<span>Donate Steam skins</span></a>`),n.innerHTML=r.join(``),t.classList.toggle(`hidden`,r.length===0);let i=document.querySelector(`#donate-fab`);if(i){let t=[];e.paypalUrl&&t.push(`<a class="donate-fab-btn paypal" href="${co(e.paypalUrl)}" target="_blank" rel="noopener noreferrer" title="Donate via PayPal">${ti}<span>PayPal</span></a>`),e.steamTradeUrl&&t.push(`<a class="donate-fab-btn steam" href="${co(e.steamTradeUrl)}" target="_blank" rel="noopener noreferrer" title="Donate Steam skins">${ni}<span>Steam</span></a>`),i.innerHTML=t.length?`<span class="donate-fab-label">Support AimKit</span>${t.join(``)}`:``,i.classList.toggle(`hidden`,t.length===0)}}async function uo(){try{lo(await y.settings.get())}catch{lo({paypalUrl:``,steamTradeUrl:``})}}document.addEventListener(`aimkit:settings-updated`,uo),document.querySelector(`#contact-open`)?.addEventListener(`click`,Hr),Ge();var fo=new URLSearchParams(window.location.search).get(`reset`);if(fo){Ve(fo);let e=new URL(window.location.href);e.searchParams.delete(`reset`),window.history.replaceState({},``,e)}var po=new URLSearchParams(window.location.search);if(po.get(`token`)){xe(po.get(`token`)),Oe();let e=new URL(window.location.href);e.searchParams.delete(`token`),window.history.replaceState({},``,e)}else if(po.get(`steam`)===`linked`){Oe();let e=new URL(window.location.href);e.searchParams.delete(`steam`),window.history.replaceState({},``,e)}else if(po.get(`steam_error`)){let e=new URL(window.location.href);e.searchParams.delete(`steam_error`),window.history.replaceState({},``,e)}Gt(),mn(),tr(),Sr(),Br(),jn(),uo();
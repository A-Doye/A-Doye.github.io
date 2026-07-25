var e=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e((()=>{var e=document.getElementById(`toggle-theme`),t=document.getElementById(`default-theme`).dataset,n=t.primaryColor,r=t.accentColor,i=t.backgroundColor,a=JSON.parse(localStorage.getItem(`customTheme`)),o=a!=null&&a.active,s=`<div id="theme-menu-container">
    <form id="theme-form">
        <input class="theme-color-select" type="color" id="primary-color-selector" name="primary-color-selector" value="${o?a.primaryColor:`#FFFFFF`}">
        <label class="theme-color-select" for="primary-color-selector">Primary Colour</label>
        
        <input class="theme-color-select" type="color" id="background-color-selector" name="background-color-selector" value="${o?a.backgroundColor:`#000000`}">
        <label class="theme-color-select" for="background-color-selector">Secondary Colour</label>

        <input class="theme-color-select" type="color" id="accent-color-selector" name="accent-color-selector" value="${o?a.accentColor:`#FF0000`}">
        <label class="theme-color-select" for="accent-color-selector">Accent Colour</label>
    </form>
</div>`;e.parentElement.innerHTML+=s;var c=document.getElementById(`primary-color-selector`),l=document.getElementById(`background-color-selector`),u=document.getElementById(`accent-color-selector`),d=document.getElementById(`theme-menu-container`);function f(e,t){o&&document.documentElement.style.setProperty(t,e.value)}function p(e,t){var n=JSON.parse(localStorage.getItem(`customTheme`));n[t]=e.value,localStorage.setItem(`customTheme`,JSON.stringify(n))}c.addEventListener(`input`,e=>f(c,`--primary-color`)),l.addEventListener(`input`,e=>f(l,`--background-color`)),u.addEventListener(`input`,e=>f(u,`--accent-color`)),c.addEventListener(`blur`,e=>p(c,`primaryColor`)),l.addEventListener(`blur`,e=>p(l,`backgroundColor`)),u.addEventListener(`blur`,e=>p(u,`accentColor`)),document.addEventListener(`pointerdown`,e=>{!document.getElementById(`theme-menu-container`).contains(e.target)&&!document.getElementById(`toggle-theme`).contains(e.target)&&!c.matches(`:focus`)&&!l.matches(`:focus`)&&!u.matches(`:focus`)&&(d.style.transform=`translateY(-105%)`)});var m=JSON.parse(localStorage.getItem(`customTheme`));m&&m.active&&document.getElementById(`toggle-theme`).classList.toggle(`top-option-toggle-on`),document.getElementById(`toggle-theme`).addEventListener(`click`,e=>{document.getElementById(`toggle-theme`).classList.toggle(`top-option-toggle-on`);let t=JSON.parse(localStorage.getItem(`customTheme`));if(t==null){let e=`#FFFFFF`,t=`#FF0000`,n=`#000000`;localStorage.setItem(`customTheme`,`{"active": true, "primaryColor": "${e}", "accentColor": "${t}", "backgroundColor": "${n}"}`),document.documentElement.style.setProperty(`--primary-color`,e),document.documentElement.style.setProperty(`--accent-color`,t),document.documentElement.style.setProperty(`--background-color`,n),d.style.transform=`translateY(0%)`,o=!0}else t.active?(t.active=!1,localStorage.setItem(`customTheme`,JSON.stringify(t)),document.documentElement.style.setProperty(`--primary-color`,n),document.documentElement.style.setProperty(`--accent-color`,r),document.documentElement.style.setProperty(`--background-color`,i),d.style.transform=`translateY(-105%)`,o=!1):(t.active=!0,localStorage.setItem(`customTheme`,JSON.stringify(t)),document.documentElement.style.setProperty(`--primary-color`,t.primaryColor),document.documentElement.style.setProperty(`--accent-color`,t.accentColor),document.documentElement.style.setProperty(`--background-color`,t.backgroundColor),d.style.transform=`translateY(0%)`,o=!0)}),Array.from(document.getElementsByClassName(`custom-checkbox-container`)).forEach(e=>{e.addEventListener(`click`,function(){e.querySelectorAll(`span`).forEach(t=>{t.classList.toggle(`active`,e.querySelector(`input`).checked)})})}),Array.from(document.getElementsByClassName(`slider-container`)).forEach(e=>{let t=e.querySelector(`input`);t.addEventListener(`input`,function(n){e.querySelector(`span`).style.width=Math.max(0,11*(t.value-1)-2)+`px`})});var h=document.getElementById(`top-option-quantum`),g=document.getElementById(`dropdown-quantum`);if(g.innerHTML+=`<ul id="quantum-nav">
                                <li><a class="dropdown-option" href="/quantum-computing/qimp.html">Quantum Image Processing</a></li>
                            </ul>`,h.addEventListener(`mouseenter`,function(e){g.style.transform=`translate(-50%, -0%)`}),h.addEventListener(`mouseleave`,function(e){g.matches(`:hover`)||(g.style.transform=`translate(-50%, -105%)`)}),g.addEventListener(`mouseleave`,function(e){h.matches(`:hover`)||(g.style.transform=`translate(-50%, -105%)`)}),document.querySelectorAll(`span.reference`).length!=0){document.getElementById(`page-content`).innerHTML+=`<div id="reference-list">
    <h2>References</h2>
</div>`;let e=document.querySelectorAll(`span.reference`),t=document.getElementById(`reference-list`),n=0;t.innerHTML+=`<ol>`,e.forEach(e=>{n++,t.lastChild.innerHTML+=`<li id="end-reference-`+n+`" class="end-reference">`+e.dataset.ref+`</li>`;let r=e.innerHTML.split(`, `);e.innerHTML=`<a class="accent-text" href="#end-reference-`+n+`">`+r[0]+`, (`+r[1]+`)</a>`}),t.innerHTML+=`</ol>`}var _=document.getElementById(`data-nav`);if(_){let e=_.dataset.previousPage,t=_.dataset.nextPage;if(!(e==null&&t==null)){let n=`<div class="bottom-nav">
                ${e==null?``:`<a class="bottom-nav-previous" href="${e}">
                <p class="accent-tex bra">Previous</p>
                <p class="small-text">${_.dataset.previousPageTitle}</p>
            </a>`}
                ${t==null?``:`<a class="bottom-nav-next" href="${t}">
                <p class="accent-text ket">Next</p>
                <p class="small-text">${_.dataset.nextPageTitle}</p>
            </a>`}
            </div>`;document.getElementById(`page-content`).innerHTML+=n}}var v=document.querySelectorAll(`div.equation`),y=1;v.forEach(e=>{e.innerHTML=e.innerHTML+=`<p id="equation-${y}" class="math equation-number">(${y})</p>`,y++}),document.querySelectorAll(`span.sqrt`).forEach(e=>{e.outerHTML=`&radic;`+e.outerHTML}),document.querySelectorAll(`span.frac`).forEach(e=>{e.innerHTML=`<span>${e.innerHTML.split(`#`)[0]}</span>
        <span class="denom">${e.innerHTML.split(`#`)[1]}</span>`}),document.querySelectorAll(`span.sum`).forEach(e=>{e.innerHTML=`<span class="sum-limit small-text">${e.innerHTML.split(`~`)[0]}</span>
<span class="sum-sigma">&Sigma;</span>
<span class="sum-init small-text">${e.innerHTML.split(`~`)[1]}</span>`}),document.querySelectorAll(`span.ket, p.ket`).forEach(e=>{e.innerHTML=`|`+e.innerHTML+`<span class="no-italic">&RightAngleBracket;</span>`}),document.querySelectorAll(`span.bra, p.bra`).forEach(e=>{e.innerHTML=`<span class="no-italic">&LeftAngleBracket;</span>`+e.innerHTML+`|`}),document.querySelectorAll(`.math, p.math, p.equation, .ket, .bra`).forEach(e=>{e.innerHTML=e.innerHTML.replace(/[\[\]()|:0-9]/g,e=>`<span class="no-italic">${e}</span>`)});var b=document.getElementById(`data-article`);function x(){let e=0;for(let t of document.getElementById(`cite-options`).children)e++,e%2!=1&&(t.innerHTML=`&nbsp;&nbsp;&#9744`)}var S=new Date,C=String(S.getDate()).padStart(2,`0`),w=String(S.getMonth()+1).padStart(2,`0`),T=`${S.getFullYear()}-${w}-${C}`;function E(){let e=b.dataset.datePublished.split(`/`);navigator.clipboard.writeText(`@misc{${b.dataset.author.split(` `)[1].toLowerCase()}${e[2]},
    author = {${b.dataset.author}},
    title = {${document.getElementsByTagName(`h1`)[0].innerHTML}},
    year = {${e[2]}},
    howpublished = {\\url{${window.location.href}}},
    note = {Accessed: ${T}}
}`),x(),document.getElementById(`cite-with-bibtex`).nextElementSibling.innerHTML=`&nbsp;&nbsp;&#9745;`}function D(){let e=b.dataset.datePublished.split(`/`);navigator.clipboard.writeText(`@online{${b.dataset.author.split(` `)[1].toLowerCase()}${e[2]},
    author = {${b.dataset.author}},
    title = {${document.getElementsByTagName(`h1`)[0].innerHTML}},
    year = {${e[2]}},
    url = {${window.location.href}},
    urldate = {${T}}
}`),x(),document.getElementById(`cite-with-biblatex`).nextElementSibling.innerHTML=`&nbsp;&nbsp;&#9745;`}if(b){document.getElementsByTagName(`h1`)[0].outerHTML+=`
    <div id="article-header">
        <p>${b.dataset.datePublished} | ${b.dataset.timePublished} | ${b.dataset.author}</p>
        <div id="cite-ui">
            <button id="button-cite-me">Cite Me</button>
            <div class="relative-wrapper">
                <div id="cite-options">
                    <button id="cite-with-bibtex">Copy BibTex</button>
                    <p></p>
                    <button id="cite-with-biblatex">Copy BibLaTex</button>
                    <p></p>
                </div>
            </div>
        </div>
    </div>`;let e=document.getElementById(`button-cite-me`),t=document.getElementById(`cite-options`);e.addEventListener(`click`,function(n){e.classList.toggle(`active`),t.classList.toggle(`active`)}),document.addEventListener(`pointerdown`,n=>{!e.contains(n.target)&&!t.contains(n.target)&&(e.classList.remove(`active`),t.classList.remove(`active`),x())}),document.getElementById(`cite-with-bibtex`).addEventListener(`click`,E),document.getElementById(`cite-with-bibtex`).nextSibling.nextSibling.addEventListener(`click`,E),document.getElementById(`cite-with-biblatex`).addEventListener(`click`,D),document.getElementById(`cite-with-biblatex`).nextSibling.nextSibling.addEventListener(`click`,D),x()}}));export{e as n,t};
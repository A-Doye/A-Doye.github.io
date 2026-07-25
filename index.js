'use strict';

const starSvgString = 
`<svg width="40px" height="40px">
  <circle cx="50%" cy="50%" r="50%"/>
</svg>`

const twinkleSvgString = 
`<svg width="100" height="100">
  <polygon points="50,0 56,44 100,50 56,56 50,100 44,56 0,50 44,44"
   />
</svg>`

const crescentSvgString =
`<?xml version="1.0" encoding="utf-8"?>
<!-- License: MIT. Made by joypixels: https://github.com/joypixels/emojione -->
<svg width="100" height="100"><path d="M43.139 2a29.885 29.885 0 0 1 5.121 16.756c0 16.701-13.686 30.24-30.57 30.24a30.656 30.656 0 0 1-15.689-4.285C7.209 54.963 17.93 62 30.318 62C47.816 62 62 47.969 62 30.66C62 17.867 54.246 6.871 43.139 2z"></path></svg>`

const saturnSvgString =
`<!-- License: PD. Made by Aleksey Popov: https://dribbble.com/AlekseyPopov -->
<svg width="100px" height="100px" viewBox="0 0 3 3" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.054 0.667c0.39 -0.064 0.693 -0.005 0.791 0.205s-0.051 0.48 -0.351 0.738a1 1 0 0 1 -1.548 0.722c-0.39 0.065 -0.693 0.005 -0.791 -0.205 -0.098 -0.21 0.051 -0.481 0.351 -0.738A1 1 0 0 1 2.054 0.667m0.24 0.225a1 1 0 0 1 0.182 0.39c0.119 -0.128 0.173 -0.238 0.142 -0.304 -0.031 -0.066 -0.15 -0.095 -0.325 -0.086M0.706 2.108a1 1 0 0 1 -0.182 -0.39c-0.119 0.128 -0.173 0.238 -0.142 0.304 0.03 0.066 0.15 0.095 0.325 0.086M2.25 1.485a0.75 0.75 0 1 0 -1.243 0.58c0.196 -0.043 0.421 -0.117 0.652 -0.225 0.231 -0.107 0.432 -0.232 0.592 -0.355m-0.087 0.366a3.75 3.75 0 0 1 -0.399 0.216c-0.143 0.067 -0.284 0.122 -0.421 0.167q0.076 0.016 0.157 0.017a0.75 0.75 0 0 0 0.663 -0.399"/></svg>`

const parser = new DOMParser();
const starSvg = parser.parseFromString(starSvgString, "image/svg+xml").documentElement;
const twinkleSvg = parser.parseFromString(twinkleSvgString, "image/svg+xml").documentElement;
const crescentSvg = parser.parseFromString(crescentSvgString, "image/svg+xml").documentElement;
const saturnSvg = parser.parseFromString(saturnSvgString, "image/svg+xml").documentElement;

function posFalloff(coreWidth, exp) {
    let ranPos = Math.random()
    if (ranPos<coreWidth) return ranPos;

    ranPos-=coreWidth;
    // ranPos = 1-ranPos/(1-coreWidth);
    console.log()
    return coreWidth+(ranPos**exp)
    // return coreWidth+(ranPos**exp)/(1/(1-coreWidth));
}

function generateStar(left) {
    let constellationString = '';
    const exp = 2

    for(let i=0; i<100; i++) {
        const offSet = posFalloff(0.03, exp)*100-5;
        // const offSet = Math.random()**exp*100-5;
        starSvg.setAttribute('style', `position:absolute; left:${left?offSet:90-offSet}%; top:${Math.random()*100}%; 
                                transform:scale(${0.01+Math.random()*0.08});`);
        constellationString += starSvg.outerHTML;
    }

    for(let i=0; i<3; i++) {
        // const offSet = posFalloff(0.03, exp)*100-14;
        const offSet = Math.random()*100-14;
        const defaultScale = 0.1+Math.random()*0.1
        twinkleSvg.setAttribute('style', `position:absolute; left:${left?offSet:90-offSet}%; top:${Math.random()*100}%; 
                                transform:scale(${defaultScale});`); // rotate(${Math.floor(Math.random()*2)*45}deg) 
        twinkleSvg.setAttribute('data-default-scale', defaultScale)
        twinkleSvg.classList.add('twinkle')
        constellationString += twinkleSvg.outerHTML;
    }

    const crescentScale = 0.25+Math.random()*0.1;
    const saturnScale = 0.25+Math.random()*0.1;
    // const mirrorSvg = Math.floor(Math.random()*2) == 0 ? 1 : -1;
    crescentSvg.setAttribute('style', `position:absolute; left:${Math.random()*100-15}%; top:${Math.random()*100}%; 
                            transform:scale(${crescentScale*1}, ${crescentScale});`)
    saturnSvg.setAttribute('style', `position:absolute; left:${Math.random()*100-15}%; top:${Math.random()*100}%; 
                            transform:rotate(${Math.random()}deg) scale(${saturnScale*1}, ${saturnScale});`)

    // constellationString += crescentSvg.outerHTML;
    // constellationString += saturnSvg.outerHTML;

    return(constellationString);
}


const backdrop = document.getElementById("index-backdrop");

for(let i=0; i<3; i++) {
    backdrop.firstElementChild.innerHTML += `<div class="cosmic-cluster">${generateStar(true)}</div>`;
    backdrop.lastElementChild.innerHTML += `<div class="cosmic-cluster">${generateStar(false)}</div>`;
}

var starIntensity = 1

function animateStars() {
    if (starIntensity >2) { starIntensity = 1.33}
    else if (starIntensity > 1) { starIntensity = starIntensity*0.9 }
    else { starIntensity = 1};

    document.querySelectorAll('.twinkle').forEach(twinkle => {
        twinkle.style.transform = `scale(${twinkle.dataset.defaultScale *starIntensity})`;
    })

    requestAnimationId = requestAnimationFrame(animateStars);
}

window.addEventListener('wheel', function(event) {
        // Prevent default scrolling if needed
        // event.preventDefault();

        // Normalize scroll direction and amount
        const deltaY = event.deltaY;

        let direction;
        if (deltaY < 0) {
            direction = 'Up';
        } else if (deltaY > 0) {
            direction = 'Down';
        } else {
            direction = 'No vertical movement';
        }

        starIntensity += 0.5
});

var requestAnimationId;

if (JSON.parse(localStorage.getItem('animate')) != false) {
    document.getElementById('toggle-animation').classList.toggle("top-option-toggle-on");
    requestAnimationId = requestAnimationFrame(animateStars);
}

// Handle starting and stopping animation when button pressed
document.getElementById("toggle-animation")?.addEventListener('click', function(event) {
    document.getElementById('toggle-animation').classList.toggle("top-option-toggle-on");

    // If animating, stop the animation
    if (JSON.parse(localStorage.getItem('animate')) || localStorage.getItem('animate') == null) {
        localStorage.setItem('animate', false);

        window.cancelAnimationFrame(requestAnimationId);
        requestAnimationId = undefined;
    }
    // Otherwise start animating
    else {
        localStorage.setItem('animate', true);

        requestAnimationId = requestAnimationFrame(animateStars);
    }
});

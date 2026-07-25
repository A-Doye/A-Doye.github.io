'use strict';

function duplicateSvg(rawSvg) {
    backdrop.innerHTML = rawSvg;

    let svg = backdrop.firstChild;
    svg.setAttribute('class', 'cnot-svg');

    let invertedSvg = svg.cloneNode(true);
    invertedSvg.setAttribute('transform', 'rotate(180)');

    const svgString = svg.outerHTML;
    const invertedSvgString = invertedSvg.outerHTML;

    for(let i=0; i<150; i++) {
        if(i%2==0) {
            backdrop.innerHTML += invertedSvgString;
        }
        else {
            backdrop.innerHTML += svgString;
        }
    }
}

const backdrop = document.getElementById("qc-backdrop");

fetch("/images/svg/cnot.svg") 
    .then(r => 
        r.text()
    ).then(svg => {
        duplicateSvg(svg)
    }).then()


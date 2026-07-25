'use strict';

const triangleSvgString = `<?xml version="1.0" encoding="utf-8"?>
<!-- License: MIT. Made by teenyicons: https://github.com/teenyicons/teenyicons -->
<svg class="triangle" width="800px" height="800px" viewBox="0 1 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" transform="scale(0)">
<path d="M7.93189 1.24806C7.84228 1.09446 7.67783 1 7.5 1C7.32217 1 7.15772 1.09446 7.06811 1.24806L0.0681106 13.2481C-0.0220988 13.4027 -0.0227402 13.5938 0.0664289 13.749C0.155598 13.9043 0.320967 14 0.5 14H14.5C14.679 14 14.8444 13.9043 14.9336 13.749C15.0227 13.5938 15.0221 13.4027 14.9319 13.2481L7.93189 1.24806Z"/>
</svg>` // Scale 0 by default to prevent flashing when spawning in

// Create new triangle element with animation vars stored in object
function newTriangle(parent, svg) {
    let xPos = Math.random()*window.innerHeight;
    let yPos = window.innerHeight;
    let xSpeed = -8+Math.random()*16;
    let ySpeed = -12-Math.random()*8;

    let angle = Math.random()*360;
    let rollSpeed = -8+Math.random()*16;
    let scale = 0.1+Math.random()*0.2;
    return {elem: parent.appendChild(triangleSvg.cloneNode(true)), xPos: xPos, yPos: yPos, xSpeed: xSpeed, ySpeed: ySpeed, angle: angle, rollSpeed: rollSpeed, scale: scale}
}

// Animate all triangle objects
function trianglesFrame() {
    const animYLimit = window.innerHeight+255; // Triangles positioned with a greater value are removed (as they are off screen)

    triangles.forEach((triangle) => {
        triangle.xSpeed += xAcceleration;
        triangle.ySpeed += yAcceleration;
        triangle.xPos += triangle.xSpeed;
        triangle.yPos += triangle.ySpeed;

        triangle.angle += triangle.rollSpeed;

        // Cleanup element if off screen
        if(triangle.yPos > animYLimit) {
            triangle.elem?.remove();
        }

        triangle.elem.setAttribute("transform",  `translate(${triangle.xPos}, ${triangle.yPos}) scale(${triangle.scale}) rotate(${triangle.angle})`);
    });

    // Filter out elements that have fallen off the bottom of the screen
    triangles = triangles.filter(tri => tri.yPos < animYLimit);

    // Make new triangles
    while(triangles.length < maxTriangles) {
        triangles.push(newTriangle(backdropElem, triangleSvg))
    }

    requestAnimationId = requestAnimationFrame(trianglesFrame);
}

const parser = new DOMParser();
const triangleSvg = parser.parseFromString(triangleSvgString, "image/svg+xml").documentElement;
const backdropElem = document.getElementById('about-backdrop');

// Set constant 'gravity' value
const xAcceleration = 0;
const yAcceleration = 0.2;
const maxTriangles = 7;

// Populate initial triangles
var triangles = [];

while(triangles.length < maxTriangles) {
    triangles.push(newTriangle(backdropElem, triangleSvg));
}

// Start animation loop
var requestAnimationId;

if (JSON.parse(localStorage.getItem('animate')) != false) {
    document.getElementById('toggle-animation').classList.toggle("top-option-toggle-on");
    requestAnimationId = requestAnimationFrame(trianglesFrame);
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

        requestAnimationId = requestAnimationFrame(trianglesFrame);
    }
});

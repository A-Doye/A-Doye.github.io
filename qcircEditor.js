'use strict';

import { parse as latexParser, HtmlGenerator as latexHtmlGenerator } from 'latex.js';

function latexToHtml(tex) {
    return latexParser(tex, { generator: new latexHtmlGenerator({ hyphenate: false }) }).htmlDocument().body.innerHTML;
}

// Setup global vars
var selectedTool = null;
const selectedToolPreviewElem = document.getElementById('qcirc-selected-tool');

// var mouseDown = false;
// document.addEventListener('mousedown', (event)=>mouseDown=true);
// document.addEventListener('mouseup', (event)=>mouseDown=false);

// Fill in palette button LaTeX
const ketZeroString = "$\\left\\vert{0}\\right\\rangle$";
const ketZeroHtml = latexToHtml(ketZeroString);
document.getElementById("palette-ket-zero").innerHTML = ketZeroHtml;

const ketOneString = "$\\left\\vert{1}\\right\\rangle$";
const ketOneHtml = latexToHtml(ketOneString);
document.getElementById("palette-ket-one").innerHTML = ketOneHtml;

// Add listeners to palette buttons
const qcircPaletteButtons = Array.from(document.getElementsByClassName('qcirc-palette-button'));

qcircPaletteButtons.forEach(paletteButton => {
    paletteButton.addEventListener('click', (event)=>{
        selectedToolPreviewElem.innerHTML = paletteButton.dataset.qcircCommand;
        selectedTool = paletteButton.dataset.qcircCommand;
    });
});

// Populate editor with empty circuit
const editorContainer = document.getElementById('qcirc-editor-container');

// Get circuit SVGs
function getTextWidth(text) {
    let font = "10px cmmi10";

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    
    return ctx.measureText(text).width;
}

function generateCircuitBox(boxContent) {
    const textWidth = getTextWidth(boxContent);
    const circuitBoxWidth = 6.8+textWidth;
    const circuitBoxHeight = 13;

    return `<svg class="overflow-svg" version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'  width='${circuitBoxWidth}pt' height='${circuitBoxHeight}pt' viewBox='0 0 ${circuitBoxWidth} ${circuitBoxHeight}'>
        <defs>
        <font id='cmmi10' horiz-adv-x='0'>
        <font-face font-family='cmmi10' units-per-em='1000' ascent='750' descent='250'/>
        <glyph unicode='U' horiz-adv-x='682' vert-adv-y='682' glyph-name='U' d='M635 578C645 619 663 649 743 652C748 652 760 653 760 672C760 673 760 683 747 683C714 683 679 680 645 680S574 683 541 683C535 683 523 683 523 663C523 652 533 652 541 652C598 651 609 630 609 608C609 605 607 590 606 587L516 230C482 96 367 9 267 9C199 9 145 53 145 139C145 141 145 173 156 217L253 606C262 642 264 652 337 652C363 652 371 652 371 672C371 683 360 683 357 683C329 683 257 680 229 680C200 680 129 683 100 683C92 683 81 683 81 663C81 652 90 652 109 652C111 652 130 652 147 650C165 648 174 647 174 634C174 628 163 586 157 563L135 475C126 436 78 247 74 228C67 200 67 185 67 170C67 48 158-22 263-22C389-22 513 91 546 223L635 578Z'/>
        </font>
        </defs>
        <style type='text/css'>
        <![CDATA[text.f0 {font-family:cmmi10;font-size:9.96264px}
        ]]>
        </style>
        <rect x='0.2' y='0.2' height='${circuitBoxHeight-0.7}' width='${circuitBoxWidth-0.2}' fill='white' stroke='black' stroke-width='.4'/>
        <text class='f0' x='3.15' y='10' font-style="italic">${boxContent}</text>
        </svg>`
}

function generateControl(wirePixelHeight, controlCellLength) {
    return `<svg class="qcirc-control" version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1' height='1' viewBox='0 0 1 1' transform="scale(1, ${wirePixelHeight*controlCellLength})">
    <line stroke="#000000" stroke-width="0.4" x1="0.5" y1="0" x2="0.5" y2="1"/>
    </svg>`
}

const lineSvgString = `<svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line stroke="#000000" stroke-width="8" x1="0" y1="50" x2="100" y2="50"/>
</svg>`

const lineVertSvgString = `<svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line stroke="#000000" stroke-width="8" x1="50" y1="0" x2="50" y2="100"/>
</svg>`

const miscCircuitElementSvgString = `<svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line stroke="#000000" stroke-width="8" x1="0" y1="50" x2="200" y2="50"/>
  <ellipse stroke-width="6" cx="50" cy="50" rx="24" ry="24"/>
</svg>`

const miscCircuitElementRedSvgString = `<svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line stroke="#000000" stroke-width="8" x1="0" y1="50" x2="200" y2="50"/>
  <ellipse stroke-width="6" cx="50" cy="50" rx="24" ry="24" fill="#FF0000"/>
</svg>`

const qcircLineSvgString = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1' height='1' viewBox='0 0 1 1'>
<line stroke="#000000" stroke-width="0.4" x1="-254" y1="0.5" x2="255" y2="0.5"/>
</svg>`

//`<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='10pt' height='.4pt' viewBox='-66 -66 10 .4'>
// <line stroke="#000000" stroke-width="0.4" x1="-200" y1="-65.6" x2="100" y2="-65.6"/>
// </svg>`

const qcricControlSvgString = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1' height='1' viewBox='0 0 1 1' transform="scale(1, 1)">
<line stroke="#000000" stroke-width="0.4" x1="0.5" y1="-254" x2="0.5" y2="255"/>
</svg>`

// Convert qcircuit command to HTML representation
// `_` is a special character to represent blank
const qcircCommandToSvg = {
    "\\qw": qcircLineSvgString,
    "_": qcircLineSvgString,
    "\\gate{X}": generateCircuitBox("X"),
    "\\gate{U}": generateCircuitBox("U"),
    "\\gate{H}": generateCircuitBox("H"),
    "\\gate{Y}": generateCircuitBox("Y"),
    "\\ket{0}": ketZeroHtml,
    "\\ket{1}": ketOneHtml,
    "\\ctrl{1}": generateControl(20, 1)
}

function bindEventsToCells() {
    const qcircEditorCells = Array.from(document.getElementsByClassName('qcirc-editor-cell'));

    let i=0;
    qcircEditorCells.forEach(editorCell => {
        let editorRow = Math.floor(i/editorCellWidth);
        let editorCol = i%editorCellWidth;
        editorCellElemsMatrix[editorCol].colCells[editorRow].cellElem = editorCell;
        i++;

        editorCell.addEventListener('click', (event)=>{
            if (selectedTool) paintEditor(editorCell);
        });

        // editorCell.addEventListener('mouseenter', (event)=>{
        //     if (selectedTool && mouseDown) {
        //         editorCell.innerHTML = qcircLineSvgString+qcircCommandToSvg[selectedTool];
        //         editorCell.dataset.qcircCommand = selectedTool;
        //     }
        // });
    });
}

var editorCellWidth = 4;
var editorCellHeight = 3;
var qcircC = 10*(4/3);

for(let i=0; i<12; i++) {
    editorContainer.innerHTML += `<div class="qcirc-editor-cell" data-cell-x="${i%editorCellWidth}" 
                                  data-cell-y="${Math.floor(i/editorCellWidth)}">${qcircLineSvgString}</div>`
    editorContainer.lastChild.lastChild.setAttribute('width', qcircC);
}

// Construct inital editor object
var editorCellElemsMatrix = [];
for(let x=0; x<editorCellWidth; x++) {
    editorCellElemsMatrix.push({colMaxPixelWidth: qcircC, colCells: []})

    for(let y=0; y<editorCellHeight; y++) {
        editorCellElemsMatrix[x].colCells.push({pixelWidth: qcircC, cellElem: null, cellQcircCommand: "\\qw", isKet: false, isBlank: false, isControl: false})
    }
}

bindEventsToCells();

// Functions for expanding and contracting the canvas
function populateEditor() {
    // Clear and rework dom structure to new format
    editorContainer.innerHTML = '';
    
    for(let i=0; i<editorCellWidth*editorCellHeight; i++) {
        editorContainer.innerHTML += `<div class="qcirc-editor-cell" data-cell-x="${i%editorCellWidth}" 
                                  data-cell-y="${Math.floor(i/editorCellWidth)}">${qcircLineSvgString}</div>`;
    }

    bindEventsToCells();

    // Populate blank circuit with previous information saved in elems matrix
    for(let x=0; x<editorCellWidth; x++) {
        for(let y=0; y<editorCellHeight; y++) {
            paintEditor(editorCellElemsMatrix[x].colCells[y].cellElem, editorCellElemsMatrix[x].colCells[y].cellQcircCommand);
        }
    }
}

function addEditorColumn() {
    // Edit js object
    editorCellWidth += 1;

    editorCellElemsMatrix.push({colMaxPixelWidth: qcircC, colCells: []})
    for(let y=0; y<editorCellHeight; y++) {
        editorCellElemsMatrix[editorCellWidth-1].colCells.push({pixelWidth: qcircC, cellElem: null, cellQcircCommand: "\\qw", isKet: false, isBlank: false});
    }
    
    // Clear and rework dom structure to new format
    editorContainer.style.gridTemplateColumns = ' auto'.repeat(editorCellWidth);
    populateEditor();
}

function addEditorRow() {
    // Edit js object
    editorCellHeight += 1;

    for(let x=0; x<editorCellWidth; x++) {
        editorCellElemsMatrix[x].colCells.push({pixelWidth: qcircC, cellElem: null, cellQcircCommand: "\\qw", isKet: false, isBlank: false});
    }

    // Empty and refill canvas
    editorContainer.style.gridTemplateRows = ' 20px'.repeat(editorCellHeight);
    populateEditor();
}

document.getElementById("test-button").addEventListener('click', (event)=>{
    addEditorColumn();
});


// Handles additions to the diagram
function paintEditor(editorCellElem, paletteTool=selectedTool) {
    const column = editorCellElem.dataset.cellX;
    const row = editorCellElem.dataset.cellY;
    const editorCellObject = editorCellElemsMatrix[column].colCells[row];
    editorCellObject.cellQcircCommand = paletteTool;
    editorCellObject.isKet = editorCellObject.cellQcircCommand.slice(0, 4) == "\\ket" ? true : false;
    editorCellObject.isBlank = editorCellObject.cellQcircCommand == "_" ? true : false;
    editorCellObject.isControl = editorCellObject.cellQcircCommand.slice(0, 5) == "\\ctrl" ? true : false;

    // Update HTML visuals
    // Do not add an initial padding wire for kets or controls
    // Control wires are added after padding is calculated
    if(editorCellObject.isKet) {
        editorCellObject.cellElem.innerHTML = qcircCommandToSvg[editorCellObject.cellQcircCommand];
    }
    else if(editorCellObject.isBlank) {
        editorCellObject.cellElem.innerHTML = qcircLineSvgString;
        editorCellObject.cellElem.lastChild.setAttribute('width', qcircC);
        editorCellElem.lastChild.setAttribute('height', `0pt`);
    }
    else if(editorCellObject.isControl) {
        editorCellObject.cellElem.innerHTML = qcircLineSvgString;
        editorCellObject.cellElem.lastChild.setAttribute('width', qcircC);
        editorCellObject.cellElem.innerHTML += qcircLineSvgString;
        editorCellObject.cellElem.lastChild.setAttribute('width', qcircC);
    }
    else {
        editorCellObject.cellElem.innerHTML = qcircLineSvgString;
        editorCellObject.cellElem.lastChild.setAttribute('width', qcircC);
        if(editorCellObject.cellQcircCommand!="\\qw") {
            editorCellObject.cellElem.innerHTML += qcircCommandToSvg[editorCellObject.cellQcircCommand];
        }
    }
    

    // Find the width of this element
    const oldPixelWidth = editorCellObject.pixelWidth;
    var pixelWidth = 0;
    if(editorCellObject.isKet) {
        // Use a fixed width for kets
        pixelWidth = 20;
    }
    else {
        Array.from(editorCellElem.children).forEach(svg => {
            if(!svg.classList.contains("qcirc-control")) pixelWidth += parseFloat(svg.getAttribute("width"));
            console.log(parseFloat(svg.getAttribute("width")))
        });

        pixelWidth = (pixelWidth-qcircC)*(4/3)+qcircC; // Handle conversion between pt and px units to find true pixel width
    }

    
    console.log(pixelWidth);
    
    
    editorCellObject.pixelWidth = pixelWidth;

    // Pad cells if this is the new widest cell in column
    if(pixelWidth > editorCellElemsMatrix[column].colMaxPixelWidth) {
        editorCellElemsMatrix[column].colMaxPixelWidth = pixelWidth;

        padCells(column, row);
    }

    // Pad cells if this was the widest
    else if(oldPixelWidth == editorCellElemsMatrix[column].colMaxPixelWidth) {
        // Find new widest cell
        let widestCell = 0;
        editorCellElemsMatrix[column].colCells.forEach(cellObject => {
            widestCell = cellObject.pixelWidth > widestCell ? cellObject.pixelWidth : widestCell;
        });

        // Update and pad
        editorCellElemsMatrix[column].colMaxPixelWidth = widestCell;
        padCells(column);
    }

    // Add padding to just this cell
    else if(pixelWidth != editorCellElemsMatrix[column].colMaxPixelWidth) {
        editorCellElem.innerHTML += qcircLineSvgString;
        const paddingSize = editorCellElemsMatrix[column].colMaxPixelWidth - pixelWidth;
        editorCellElem.lastChild.setAttribute('width', `${paddingSize}pt`);
        if (editorCellObject.isKet || editorCellObject.isBlank) editorCellElem.lastChild.setAttribute('height', `0pt`);
    }
}

function padCells(column, ignoreRow=null) {
    editorCellElemsMatrix[column].colCells.forEach(cellObject => {
        if(cellObject.isKet) {
            cellObject.cellElem.innerHTML = qcircCommandToSvg[cellObject.cellQcircCommand];
            cellObject.cellElem.lastChild.setAttribute('width', qcircC);

            // Add fixed size, not visible, padding
            cellObject.cellElem.innerHTML += qcircLineSvgString;
            cellObject.cellElem.lastChild.style.width = 5*4/3;
            cellObject.cellElem.lastChild.style.height = 0;
        }
        else if(cellObject.isBlank) {
            // Add empty standard length wire for spacing
            cellObject.cellElem.innerHTML = qcircLineSvgString;
            cellObject.cellElem.lastChild.setAttribute('width', qcircC);
            cellObject.cellElem.lastChild.style.height = 0;
        }
        else {
            if(cellObject.cellElem.dataset.cellY == ignoreRow) return;

            // Reset contents
            cellObject.cellElem.innerHTML = qcircLineSvgString;
            cellObject.cellElem.lastChild.setAttribute('width', qcircC);
            if(cellObject.cellQcircCommand!="\\qw" && !cellObject.isControl) cellObject.cellElem.innerHTML += qcircCommandToSvg[cellObject.cellQcircCommand];
            // if(cellObject.isControl) cellObject.cellElem.innerHTML += qcircLineSvgString;

            // Add scaled padding
            cellObject.cellElem.innerHTML += qcircLineSvgString;
            const paddingSize = editorCellElemsMatrix[column].colMaxPixelWidth - cellObject.pixelWidth;
            // // cellObject.cellElem.lastChild.setAttribute('width', `${paddingSize}pt`);
            // // cellObject.cellElem.lastChild.style.position = `absolute`;
            cellObject.cellElem.lastChild.setAttribute('width', paddingSize)
            // cellObject.cellElem.lastChild.setAttribute('transform', `scale(${paddingSize*(4/3)/10}, 1)`); //`translate(${10*(4/3)-0.25}, 0) scale(${paddingSize/10+0.2}, 1)`

            if(cellObject.isControl) {
            // Add centered control wire
                cellObject.cellElem.innerHTML += qcircCommandToSvg[cellObject.cellQcircCommand];
                console.log(cellObject.cellElem.lastChild)
                cellObject.cellElem.lastChild.style.position = `absolute`;
                cellObject.cellElem.lastChild.setAttribute('transform', `translate(${10*(4/3)+((cellObject.pixelWidth-10)/2)*(4/3)+paddingSize/(4/3)-0.4}, 10) scale(1, 20)`);
            }
        }
    })
}

// // Handle right click being used to place down control
// var placingControl = false;
// var controlSourceElement = null;

// function classHovered(className) {
//     const elements = document.querySelectorAll(`.${className}`);
//     for (const elem of elements) {
//         if (elem.matches(':hover')) {
//             return elem;
//         }
//     }

//     return null;
// }

// document.addEventListener("contextmenu", (event) => {
//     const hoveredEditorCell = classHovered('qcirc-editor-cell');

//     if(hoveredEditorCell) {
//         event.preventDefault();

//         placingControl = true;
//         controlSourceElement = hoveredEditorCell;
//     }
// });


// document.addEventListener("click", function () {
//     placingControl = false;
// });

// var mousePosY = null;

// // Capture mouse position once and store it
// document.addEventListener('mousemove', (event) => {
//     mousePosY = event.clientY;
// });

// window.onload = function() {
//     function tick() { 
//         if(placingControl) {
//             const controlSourceBoundingRect = controlSourceElement.getBoundingClientRect();
//             const controlSourceRelativeMouseY = mousePosY - controlSourceBoundingRect.top;
//             console.log(controlSourceRelativeMouseY)
//         }
//         setTimeout(tick, 1000); 
//     } tick();
// }
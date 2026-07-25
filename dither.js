'use strict';

import { kdTree } from "kd-tree-javascript";

const origin = window.location.origin;

// Converts RGB values to a single grayscale value
function rbgToGrayscale(r, g, b) {
    return 0.2989 * r + 0.587 * g + 0.114 * b;
}

// Converts image data to grayscale format
function imageToGrayscale(imageData) {
    var data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = data[i+3];

        let greyscaleVal = rbgToGrayscale(r, g, b);
        
        data[i] = greyscaleVal;
        data[i+1] = greyscaleVal;
        data[i+2] = greyscaleVal;
        data[i+3] = 255;
    }

    return imageData;
}

// Duplicates each pixel in the image data by the specified factor
function upscaleImageData(imageData, factor) {
    if (factor <= 1) return imageData; // No upscaling needed

    const { width, height } = imageData;
    const newWidth = width * factor;
    const newHeight = height * factor;

    const newData = new Uint8ClampedArray(newWidth * newHeight * 4);

    // Walk the original image to find original data
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const i = (y * imageData.width + x) * 4;

            // Walk the new image to fill in the new data
            for (let j = 0; j < factor; j++) {
                for (let k = 0; k < factor; k++) {
                    const dstX = x*factor+k;
                    const dstY = y*factor+j;
                    const dstIndex = (dstY*newWidth+dstX)*4;
                    newData[dstIndex]   = imageData.data[i];
                    newData[dstIndex+1] = imageData.data[i+1];
                    newData[dstIndex+2] = imageData.data[i+2];
                    newData[dstIndex+3] = imageData.data[i+3];
                }
            }
        }
    }

    return new ImageData(newData, newWidth);
}

function floydSteinbergTwoToneDither(imageData, colour1 = [255, 255, 255], colour2 = [0, 0, 0], linear) {
    let data = imageData.data;

    // const ditheredData = new Uint8ClampedArray(data.length).map(() => 255);

    const ditheredData = linear==true ? Float32Array.from(data, (x, i) => i+1%4 != 0 ? rgbToLinear(x) : x)
                                     : new Float32Array(data)

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const i = (y * imageData.width + x) * 4;

            let quantError;

            if(linear) {
                const clampedVal = Math.max(0, Math.min(1, ditheredData[i]));
                const ditheredVal = clampedVal < 0.5 ? 0 : 1;
                quantError = clampedVal - ditheredVal;

                const targetColour = clampedVal < 0.5 ?  colour2 : colour1;
                ditheredData[i] = targetColour[0];
                ditheredData[i+1] = targetColour[1];
                ditheredData[i+2] = targetColour[2];
            }
            else {
                // Get dither value treating image as black and white
                const ditheredVal = ditheredData[i] < 128 ? 0 : 255;
                quantError = ditheredData[i] - ditheredVal;

                // Colour with user set colours
                const targetColour = ditheredData[i] < 128 ?  colour2 : colour1;
                ditheredData[i] = targetColour[0];
                ditheredData[i+1] = targetColour[1];
                ditheredData[i+2] = targetColour[2];
            }

            if (x + 1 < imageData.width) {
                const rightIndex = i + 4;
                ditheredData[rightIndex] += quantError * 7 / 16;
            }
            if (y + 1 < imageData.height) {
                if (x > 0) {
                    const leftBottomIndex = ((y + 1) * imageData.width + x - 1) * 4;
                    ditheredData[leftBottomIndex] += quantError * 3 / 16;
                }
                const bottomIndex = ((y + 1) * imageData.width + x) * 4;
                ditheredData[bottomIndex] += quantError * 5 / 16;
                    if (x + 1 < imageData.width) {
                        const rightBottomIndex = ((y + 1) * imageData.width + x + 1) * 4;
                        ditheredData[rightBottomIndex] += quantError * 1 / 16;
                    }
            }
        }      
    }

    const ditherDataInt8 = Uint8ClampedArray.from(linear==true? Float32Array.from(ditheredData, (x, i) => i+1%4 != 0 ? linearToRgb(x) : x) : ditheredData);

    return ditherDataInt8;
}

const dawnBringer8Palette = [
    {r: 0, g: 0, b: 0},
    {r: 85, g: 65, b: 95},
    {r: 100, g: 105, b: 100},
    {r: 215, g: 115, b: 85},
    {r: 80, g: 140, b: 215},
    {r: 100, g: 185, b: 100},
    {r: 230, g: 200, b: 110},
    {r: 220, g: 245, b: 255}
]
const dawnBringer16Palette = [
    {r: 20, g: 12, b: 28},
    {r: 68, g: 36, b: 52},
    {r: 48, g: 52, b: 109},
    {r: 78, g: 74, b: 78},
    {r: 133, g: 76, b: 48},
    {r: 52, g: 101, b: 36},
    {r: 208, g: 70, b: 72},
    {r: 117, g: 113, b: 97},
    {r: 89, g: 125, b: 206},
    {r: 210, g: 125, b: 44},
    {r: 133, g: 149, b: 161},
    {r: 109, g: 170, b: 44},
    {r: 210, g: 170, b: 153},
    {r: 109, g: 194, b: 202},
    {r: 218, g: 212, b: 94},
    {r: 222, g: 238, b: 214}
];

const dawnBringer32Palette = [
    {r: 0, g: 0, b: 0},
    {r: 34, g: 32, b: 52},
    {r: 69, g: 40, b: 60},
    {r: 102, g: 57, b: 49},
    {r: 143, g: 86, b: 59},
    {r: 223, g: 113, b: 38},
    {r: 217, g: 160, b: 102},
    {r: 238, g: 195, b: 154},
    {r: 251, g: 242, b: 54},
    {r: 153, g: 229, b: 80},
    {r: 106, g: 190, b: 48},
    {r: 55, g: 148, b: 110},
    {r: 75, g: 105, b: 47},
    {r: 82, g: 75, b: 36},
    {r: 50, g: 60, b: 57},
    {r: 63, g: 63, b: 116},
    {r: 48, g: 96, b: 130},
    {r: 91, g: 110, b: 225},
    {r: 99, g: 155, b: 255},
    {r: 95, g: 205, b: 228},
    {r: 203, g: 219, b: 252},
    {r: 255, g: 255, b: 255},
    {r: 155, g: 173, b: 183},
    {r: 132, g: 126, b: 135},
    {r: 105, g: 106, b: 106},
    {r: 89, g: 86, b: 82},
    {r: 118, g: 66, b: 138},
    {r: 172, g: 50, b: 50},
    {r: 217, g: 87, b: 99},
    {r: 215, g: 123, b: 186},
    {r: 143, g: 151, b: 74},
    {r: 138, g: 111, b: 48}
]

const gameBoyPalette = [
    {r: 15, g: 56, b: 15},
    {r: 48, g: 98, b: 48},
    {r: 139, g: 172, b: 15},
    {r: 155, g: 188, b: 15}
]

const oil6Palette = [
    {r: 251, g: 245, b: 239},
    {r: 242, g: 211, b: 171},
    {r: 198, g: 159, b: 165},
    {r: 139, g: 109, b: 156},
    {r: 73, g: 77, b: 126},
    {r: 39, g: 39, b: 68}
]

const funkyFuture8Palette = [
    {r: 43, g: 15, b: 84},
    {r: 171, g: 31, b: 101},
    {r: 255, g: 79, b: 105},
    {r: 255, g: 247, b: 248},
    {r: 255, g: 129, b: 66},
    {r: 255, g: 218, b: 69},
    {r: 51, g: 104, b: 220},
    {r: 73, g: 231, b: 236}
]

const pollen8Palette = [
    {r: 115, g: 70, b: 76},
{r: 171, g: 86, b: 117},
{r: 238, g: 106, b: 124},
{r: 255, g: 167, b: 165},
{r: 255, g: 224, b: 126},
{r: 255, g: 231, b: 214},
{r: 114, g: 220, b: 187},
{r: 52, g: 172, b: 186}
]

const nostalgOS12Palette = [
    {r: 220, g: 98, b: 80},
    {r: 222, g: 173, b: 165},
    {r: 218, g: 212, b: 201},
    {r: 255, g: 209, b: 131},
    {r: 238, g: 178, b: 74},
    {r: 85, g: 146, b: 127},
    {r: 33, g: 82, b: 90},
    {r: 39, g: 42, b: 50},
    {r: 33, g: 82, b: 165},
    {r: 90, g: 139, b: 222},
    {r: 184, g: 156, b: 233},
    {r: 132, g: 71, b: 144}
]

const ibm16Palette = [
    {r: 0, g: 0, b: 0},
    {r: 85, g: 85, b: 85},
    {r: 170, g: 170, b: 170},
    {r: 255, g: 255, b: 255},
    {r: 0, g: 0, b: 170},
    {r: 85, g: 85, b: 255},
    {r: 0, g: 170, b: 0},
    {r: 85, g: 255, b: 85},
    {r: 0, g: 170, b: 170},
    {r: 85, g: 255, b: 255},
    {r: 170, g: 0, b: 0},
    {r: 255, g: 85, b: 85},
    {r: 170, g: 0, b: 170},
    {r: 255, g: 85, b: 255},
    {r: 170, g: 85, b: 0},
    {r: 255, g: 255, b: 85}
]

const vga16Palette = [
    {r: 0, g: 0, b: 0},
    {r: 128, g: 0, b: 0},
    {r: 0, g: 128, b: 0},
    {r: 128, g: 128, b: 0},
    {r: 0, g: 0, b: 128},
    {r: 128, g: 0, b: 128},
    {r: 0, g: 128, b: 128},
    {r: 192, g: 192, b: 192},
    {r: 128, g: 128, b: 128},
    {r: 255, g: 0, b: 0},
    {r: 0, g: 255, b: 0},
    {r: 255, g: 255, b: 0},
    {r: 0, g: 0, b: 255},
    {r: 255, g: 0, b: 255},
    {r: 0, g: 255, b: 255},
    {r: 255, g: 255, b: 255}
]

const planNine23Palette = [
    {r: 255, g: 255, b: 255},
    {r: 255, g: 234, b: 255},
    {r: 204, g: 136, b: 204},
    {r: 136, g: 68, b: 136},
    {r: 234, g: 255, b: 255},
    {r: 136, g: 204, b: 204},
    {r: 68, g: 136, b: 136},
    {r: 234, g: 234, b: 255},
    {r: 136, g: 136, b: 204},
    {r: 68, g: 68, b: 136},
    {r: 234, g: 255, b: 234},
    {r: 136, g: 204, b: 136},
    {r: 68, g: 136, b: 68},
    {r: 255, g: 255, b: 234},
    {r: 204, g: 204, b: 136},
    {r: 136, g: 136, b: 68},
    {r: 255, g: 234, b: 234},
    {r: 204, g: 136, b: 136},
    {r: 136, g: 68, b: 68},
    {r: 234, g: 234, b: 234},
    {r: 204, g: 204, b: 204},
    {r: 136, g: 136, b: 136},
    {r: 0, g: 0, b: 0}
]

const greyscale4Palette = [
    {r: 0, g: 0, b: 0},
    {r: 85, g: 85, b: 85},
    {r: 170, g: 170, b: 170},
    {r: 255, g: 255, b: 255}
]

const greyscale8Palette = [
    {r: 0, g: 0, b: 0},
    {r: 36, g: 36, b: 36},
    {r: 73, g: 73, b: 73},
    {r: 109, g: 109, b: 109},
    {r: 146, g: 146, b: 146},
    {r: 182, g: 182, b: 182},
    {r: 219, g: 219, b: 219},
    {r: 255, g: 255, b: 255}
]

const greyscale16Palette = [
    {r: 0, g: 0, b: 0},
    {r: 17, g: 17, b: 17},
    {r: 34, g: 34, b: 34},
    {r: 51, g: 51, b: 51},
    {r: 68, g: 68, b: 68},
    {r: 85, g: 85, b: 85},
    {r: 102, g: 102, b: 102},
    {r: 119, g: 119, b: 119},
    {r: 136, g: 136, b: 136},
    {r: 153, g: 153, b: 153},
    {r: 170, g: 170, b: 170},
    {r: 187, g: 187, b: 187},
    {r: 204, g: 204, b: 204},
    {r: 221, g: 221, b: 221},
    {r: 238, g: 238, b: 238},
    {r: 255, g: 255, b: 255}
]

const greyscale32Palette = [
    {r: 0, g: 0, b: 0},
    {r: 8, g: 8, b: 8},
    {r: 16, g: 16, b: 16},
    {r: 24, g: 24, b: 24},
    {r: 33, g: 33, b: 33},
    {r: 41, g: 41, b: 41},
    {r: 49, g: 49, b: 49},
    {r: 57, g: 57, b: 57},
    {r: 66, g: 66, b: 66},
    {r: 74, g: 74, b: 74},
    {r: 82, g: 82, b: 82},
    {r: 90, g: 90, b: 90},
    {r: 99, g: 99, b: 99},
    {r: 107, g: 107, b: 107},
    {r: 115, g: 115, b: 115},
    {r: 123, g: 123, b: 123},
    {r: 132, g: 132, b: 132},
    {r: 140, g: 140, b: 140},
    {r: 148, g: 148, b: 148},
    {r: 156, g: 156, b: 156},
    {r: 165, g: 165, b: 165},
    {r: 173, g: 173, b: 173},
    {r: 181, g: 181, b: 181},
    {r: 189, g: 189, b: 189},
    {r: 198, g: 198, b: 198},
    {r: 206, g: 206, b: 206},
    {r: 214, g: 214, b: 214},
    {r: 222, g: 222, b: 222},
    {r: 231, g: 231, b: 231},
    {r: 239, g: 239, b: 239},
    {r: 247, g: 247, b: 247},
    {r: 255, g: 256, b: 255}
]

const paletteDict = {
    "dawn-bringer-8": dawnBringer8Palette,
    "dawn-bringer-16": dawnBringer16Palette,
    "dawn-bringer-32": dawnBringer32Palette,
    "game-boy": gameBoyPalette,
    "oil-6": oil6Palette,
    "funky-future-8": funkyFuture8Palette,
    "pollen-8": pollen8Palette,
    "nostalg-os": nostalgOS12Palette,
    "ibm-pc": ibm16Palette,
    "vga": vga16Palette,
    "plan-9": planNine23Palette,
    "greyscale-4": greyscale4Palette,
    "greyscale-8": greyscale8Palette,
    "greyscale-16": greyscale16Palette,
    "greyscale-32": greyscale32Palette,
}

function euclideanColourDistance(a, b) { return (a.r - b.r)**2 + (a.g - b.g)**2 + (a.b - b.b)**2; }

function rgbToLinear(colour){
    return (colour/255)**2.2;
}

function linearToRgb(colour){
    return (colour**(1/2.2))*255;
}

function floydSteinbergPaletteDither(imageData, palette, linear) {
    let data = imageData.data;
    const height = imageData.height;
    const width = imageData.width;

    // Convert image and palette into linear space if selected
    const paletteTree = linear==true ? new kdTree(palette.map((colour) => ({r: rgbToLinear(colour.r), g: rgbToLinear(colour.g), b: rgbToLinear(colour.b)})), euclideanColourDistance, ["r", "g", "b"])
                                     : new kdTree(palette, euclideanColourDistance, ["r", "g", "b"]);
    const ditherData  = linear==true ? Float32Array.from(data, (x, i) => i+1%4 != 0 ? rgbToLinear(x) : x)
                                     : new Float32Array(data)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;

            // Find current pixel value and clamp to colour range
            let rOld = ditherData[i], gOld = ditherData[i+1], bOld = ditherData[i+2];
            if(linear) {
                rOld = Math.max(0, Math.min(1, rOld));
                gOld = Math.max(0, Math.min(1, gOld));
                bOld = Math.max(0, Math.min(1, bOld));
            }
            else {
                rOld = Math.max(0, Math.min(255, rOld));
                gOld = Math.max(0, Math.min(255, gOld));
                bOld = Math.max(0, Math.min(255, bOld));
            }
            
            // Recolour pixel with closest value in palette
            const ditheredVal = paletteTree.nearest({r: rOld, g: gOld, b: bOld},1)[0][0];
            ditherData[i] = ditheredVal.r;
            ditherData[i+1] = ditheredVal.g;
            ditherData[i+2] = ditheredVal.b;

            // Find resulting quantization error and propagate
            const rErr = rOld-ditherData[i], gErr = gOld-ditherData[i+1], bErr = bOld-ditherData[i+2];

            const nextRow = (y+1)*width;

            if (x + 1 < width) {
                const rightIndex = i + 4;
                ditherData[rightIndex] += rErr*(7/16);
                ditherData[rightIndex+1] += gErr*(7/16);
                ditherData[rightIndex+2] += bErr*(7/16);
            }
            if (y + 1 < height) {
                if (x > 0) {
                    const leftBottomIndex = (nextRow + x-1) * 4;
                    ditherData[leftBottomIndex] += rErr*(3/16);
                    ditherData[leftBottomIndex+1] += gErr*(3/16);
                    ditherData[leftBottomIndex+2] += bErr*(3/16);
                }

                const bottomIndex = (nextRow+x)*4;
                ditherData[bottomIndex] += rErr*(5/16);
                ditherData[bottomIndex+1] += gErr*(5/16);
                ditherData[bottomIndex+2] += bErr*(5/16);

                if (x + 1 < width) {
                    const rightBottomIndex = (nextRow+x+1)*4;
                    ditherData[rightBottomIndex] += rErr*(1/16);
                    ditherData[rightBottomIndex+1] += gErr*(1/16);
                    ditherData[rightBottomIndex+2] += bErr*(1/16);
                }
            }
        }
    }

    const ditherDataInt8 = Uint8ClampedArray.from(linear==true? Float32Array.from(ditherData, (x, i) => i+1%4 != 0 ? linearToRgb(x) : x) : ditherData);

    return ditherDataInt8;
}

const colourSelectOne = document.getElementById('colour-select-one');
const colourSelectTwo = document.getElementById('colour-select-two');
var colour1 = [parseInt(colourSelectOne.value.slice(1, 3), 16), parseInt(colourSelectOne.value.slice(3, 5), 16), parseInt(colourSelectOne.value.slice(5, 7), 16)];
var colour2 = [parseInt(colourSelectTwo.value.slice(1, 3), 16), parseInt(colourSelectTwo.value.slice(3, 5), 16), parseInt(colourSelectTwo.value.slice(5, 7), 16)];

function reloadDitherCanvas() {
    // Restrict canvas size to preview size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    if(img.naturalWidth > canvasMaxWidth){
        let reductionFactor = canvasMaxWidth/img.naturalWidth;
        canvas.width = canvasMaxWidth;
        canvas.height = img.naturalHeight*reductionFactor;
        if(canvas.height > canvasMaxHeight) {
            reductionFactor = canvasMaxHeight/canvas.height;
            canvas.width = canvasMaxWidth*reductionFactor;
            canvas.height = canvasMaxHeight;
        }
    }
    else if(img.naturalHeight > canvasMaxHeight){
        let reductionFactor = canvasMaxHeight/canvas.height;
        canvas.width = canvasMaxWidth*reductionFactor;
        canvas.height = canvasMaxHeight;
    }

    let previewCanvasWidth = canvas.width;
    let previewCanvasHeight = canvas.height;
    canvas.width = canvas.width*1/scaleFactor;
    canvas.height = canvas.height*1/scaleFactor;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Render with palette or bichrome
    if (paletteToggle) {
        imageData.data.set(floydSteinbergPaletteDither(imageData, chosenPalette, linearToggle));
    }
    else {
        imageData = imageToGrayscale(imageData);
        imageData.data.set(floydSteinbergTwoToneDither(imageData, colour1, colour2, linearToggle));
    }
    
    // Change how the image is displayed dependent on pixel size choice
    if (scaleToggle){
        imageData = upscaleImageData(imageData, scaleFactor);

        canvas.width = previewCanvasWidth;
        canvas.height = previewCanvasHeight;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Load the sample image and draw it on the canvas
var scaleFactor = 1;
var scaleToggle = true;
var paletteToggle = true;
var chosenPalette = dawnBringer16Palette;
var linearToggle = true;

const canvas = document.getElementById('output-dither-canvas');
const canvasMaxWidth = 600;
const canvasMaxHeight = 600;

const ctx = canvas.getContext("2d", {willReadFrequently: true});
const img = new Image();
img.src = origin + "/images/test/test.png";

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imageData.data.set(floydSteinbergPaletteDither(imageData, chosenPalette, linearToggle));

    ctx.putImageData(imageData, 0, 0);
}

// On image upload, load the image and draw it on the canvas
document.getElementById('image-input').addEventListener('change', function(event) {
    if (!this.files || !this.files[0]) return;

    img.onload = () => {
        URL.revokeObjectURL(img.src);  // no longer needed, free memory

        reloadDitherCanvas();
    }

    img.src = URL.createObjectURL(this.files[0]); // set src to blob url
});

// Rescale the image when the slider value changes
document.getElementById('pixel-size-slider').addEventListener('input', function(event) {
    scaleFactor = parseInt(this.value);
    document.getElementById('pixel-size-value').textContent = scaleFactor;

    reloadDitherCanvas();
});

// Recolour image dependent on palette selection 
Array.from(document.getElementsByClassName("two-tone-select")).map(elem => elem.style.display = "none"); // Hide palette selection initially (as two-tone is default)

document.getElementById('palette-toggle').addEventListener('input', function(event) {
    if(this.checked) {
        paletteToggle = 1;
        document.getElementById('palette-toggle').checked = true;

        Array.from(document.getElementsByClassName("two-tone-select")).map(elem => elem.style.display = "none");
        Array.from(document.getElementsByClassName("palette-select")).map(elem => elem.style.display = "block");

        chosenPalette = paletteDict[document.getElementById("palette-dropdown").value];
    }
    else {
        paletteToggle = 0;
        document.getElementById('palette-toggle').checked = false;

        Array.from(document.getElementsByClassName("two-tone-select")).map(elem => elem.style.display = "block");
        Array.from(document.getElementsByClassName("palette-select")).map(elem => elem.style.display = "none");
    }

    reloadDitherCanvas();
});

// Rescale the image when the slider value changes
document.getElementById('linear-toggle').addEventListener('input', function(event) {
    linearToggle = this.checked;

    reloadDitherCanvas();
});

// // Rescale the image when the slider value changes
// document.getElementById('scale-toggle').addEventListener('input', function(event) {
//     scaleToggle = this.checked;

//     if(scaleFactor!=1) reloadDitherCanvas();
// });

// Change colours when new colour scheme is selected
document.getElementById('colour-select-one').addEventListener('blur', function(event) {
    colour1 = [parseInt(colourSelectOne.value.slice(1, 3), 16), parseInt(colourSelectOne.value.slice(3, 5), 16), parseInt(colourSelectOne.value.slice(5, 7), 16)];
    reloadDitherCanvas();
});
document.getElementById('colour-select-two').addEventListener('blur', function(event) {
    colour2 = [parseInt(colourSelectTwo.value.slice(1, 3), 16), parseInt(colourSelectTwo.value.slice(3, 5), 16), parseInt(colourSelectTwo.value.slice(5, 7), 16)];
    reloadDitherCanvas();
});

document.getElementById('palette-dropdown').addEventListener('change', function(event) {
    chosenPalette = paletteDict[document.getElementById("palette-dropdown").value];

    reloadDitherCanvas();
});

// Render in ordered dithered sidebars scaled up so that the dithered effect is clearly visible
function orderedDitherSidebar(canvasElement, mirror=false) {
    // Grab primary colour from navbar (converting from rgb string)
    const primaryColorString = window.getComputedStyle(document.getElementById('top-nav')).backgroundColor;
    const primaryColorArr = primaryColorString.slice(
        primaryColorString.indexOf("(") + 1, 
        primaryColorString.indexOf(")")
    ).split(", ").map(val => parseInt(val));

    // Fill canvas with scaled down white to blank gradient
    const factor = 4;

    const sidebarCtx = canvasElement.getContext("2d", {willReadFrequently: true});
    const widthOnPage = leftSidebar.getBoundingClientRect().width;
    const heightOnPage = leftSidebar.getBoundingClientRect().height
    canvasElement.width = widthOnPage;
    canvasElement.height = heightOnPage;

    const scaledWidthOnPage = Math.ceil(widthOnPage/factor);
    const scaledHeightOnPage = Math.ceil(heightOnPage/factor)

    const grad=sidebarCtx.createLinearGradient(0,0, scaledWidthOnPage, 0);

    if(mirror) {
        grad.addColorStop(0, "#FFFFFF00");
        grad.addColorStop(1, "#FFFFFFFF");
    } 
    else {
        grad.addColorStop(0, "#FFFFFFFF");
        grad.addColorStop(1, "#FFFFFF00");
    }

    sidebarCtx.fillStyle = grad;
    sidebarCtx.fillRect(0,0, scaledWidthOnPage, scaledHeightOnPage);
    
    // Perform ordered dither on scaled down canvas
    let imageData = sidebarCtx.getImageData(0, 0, scaledWidthOnPage, scaledHeightOnPage);
    let ditherImageData = imageData.data;

    for (let y = 0; y < heightOnPage/factor; y++) {
        for (let x = 0; x < scaledWidthOnPage; x++) {
            const i = (y * scaledWidthOnPage + x) * 4;

            const threshold = fourByFourBayer[y%4][x%4]

            ditherImageData[i]=primaryColorArr[0];
            ditherImageData[i+1]=primaryColorArr[1];
            ditherImageData[i+2]=primaryColorArr[2];
            ditherImageData[i+3]=ditherImageData[i+3]>threshold?255:0;
            
        }
    }
    
    // Scale up dithered data
    const ditherImage = new ImageData(ditherImageData, scaledWidthOnPage)
    const upscaledDither = upscaleImageData(ditherImage, factor);
    sidebarCtx.putImageData(upscaledDither, 0, 0);
}

const fourByFourBayer = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
].map(row => (row.map(val => val*16)));

const sidebars = document.getElementsByClassName('sidebar');
const leftSidebar = sidebars[0].firstElementChild;
const rightSidebar = sidebars[1].firstElementChild;

orderedDitherSidebar(leftSidebar);
orderedDitherSidebar(rightSidebar, true);

// Re-render dither sidebars when primary colour changes
document.getElementById('toggle-theme').addEventListener('click', function(event) {
    orderedDitherSidebar(leftSidebar);
    orderedDitherSidebar(rightSidebar, true);
});

// Re-rendering live with colour picker is too intensive; only re-render when focus is lost
primaryColorPicker.addEventListener("blur", (event)=>{
    orderedDitherSidebar(leftSidebar);
    orderedDitherSidebar(rightSidebar, true);
});

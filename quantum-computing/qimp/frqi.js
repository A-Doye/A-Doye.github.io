// Sleep promise for delayed loop
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

function normaliseImage(imageData) {
    let normalisedImageData = new Float16Array(imageData.width * imageData.height * 4);
    for(i in imageData.data) {
        normalisedImageData[i] = imageData.data[i]/255
    }

    return normalisedImageData;
}

function iteratefrqiDemo(simulationData, normalisedOriginal, imagePizelSize, imageWidth, imageHeight, ctx) {
    // Select random pixel location and simulate measurement at location. Update the canvas at that location
    for(let i=0; i<100;i++) {
        const pixelIndex = Math.floor(Math.random()*imagePizelSize);
        const y = Math.floor(pixelIndex/imageWidth);
        const x = pixelIndex-(y*imageWidth);
        const measuredValAtLocation = normalisedOriginal[pixelIndex*4]>Math.random() ? 1:0;

        simulationData[pixelIndex].push(measuredValAtLocation);
        const newColour = (simulationData[pixelIndex].reduce((total, num) => total + num, 0)/simulationData[pixelIndex].length)*255;

        const onePixel = ctx.getImageData(x,y,1,1);
        const onePixelData = onePixel.data;
        onePixelData[0] = newColour;
        onePixelData[1] = newColour;
        onePixelData[2] = newColour;
        onePixelData[3] = 255;

        ctx.putImageData(onePixel, x, y);
    }
    
    
    return simulationData;
}

async function runDemo() {
    demoButton.removeEventListener('click', runDemo);

    while(cycleIter<1000000) {
        cycleIter+=100;

        simulationData = iteratefrqiDemo(simulationData, normalisedImage, imagePixelSize, imageWidth, imageHeight, simulationCtx);

        cycleSpan.innerHTML = cycleIter;

        await sleep(1);
    }

    demoButton.innerHTML = 'Reset';
    demoButton.addEventListener('click', resetDemo);
}

function resetDemo() {
    demoButton.removeEventListener('click', resetDemo);

    cycleIter = 0;

    simulationCtx.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);
    simulationData = Array.from({length: imageData.width * imageData.height}, () => []);

    demoButton.innerHTML = 'Simulate';
    document.getElementById("frqi-demo-run-sim").addEventListener('click', runDemo);
}

const demoButton = document.getElementById("frqi-demo-run-sim");

const demoDiv = document.getElementById("frqi-demo");
const cycleSpan = document.getElementById("frqi-demo-cycle-count");

const originalCanvas = document.getElementById('frqi-demo-original-img');
const simulationCanvas = document.getElementById('frqi-demo-simulation-img');
const canvasMaxWidth = 600;
const canvasMaxHeight = 600;

const originalCtx = originalCanvas.getContext("2d", {willReadFrequently: false});
const simulationCtx = simulationCanvas.getContext("2d", {willReadFrequently: true});

const originalImg = new Image();
originalImg.src = origin + "/images/test/test.png";

var imageData = null;
var imageWidth = null;
var imageHeight = null;
var imagePixelSize = null;
var normalisedImage = null;
var simulationData = null;
var cycleIter = 0;

originalImg.onload = () => {
    originalCanvas.width = originalImg.width;
    originalCanvas.height = originalImg.height;

    originalCtx.drawImage(originalImg, 0, 0, originalCanvas.width, originalCanvas.height);

    simulationCanvas.width = originalImg.width;
    simulationCanvas.height = originalImg.height;

    imageWidth = originalImg.width;
    imageHeight = originalImg.height;
    imagePixelSize = originalImg.width*originalImg.height;

    imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    imageData = imageToGrayscale(imageData);
    originalCtx.putImageData(imageData, 0, 0);

    normalisedImage = normaliseImage(imageData);

    simulationData = Array.from({length: imageData.width * imageData.height}, () => []);
}

document.getElementById("frqi-demo-run-sim").addEventListener('click', runDemo);


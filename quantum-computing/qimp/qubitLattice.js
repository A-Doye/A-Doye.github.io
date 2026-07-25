// Sleep promise for delayed loop
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function normaliseImage(imageData) {
    let normalisedImageData = new Float16Array(imageData.width * imageData.height * 4);
    for(i in imageData.data) {
        normalisedImageData[i] = imageData.data[i]/255
    }

    return normalisedImageData;
}

function iterateLatticeDemo(simulationData, normalisedOriginal, cycleIter) {
    if(cycleIter==0) {
        for(i in simulationData) {
            if(i%4==3) simulationData[i] = 255;
            else {
                simulationData[i] = normalisedOriginal[i]>Math.random() ? 1 : 0;
            }
        }
    }
    else {
        for(i in simulationData) {
            if(i%4==3) continue;
            else {
                simulationData[i] = (simulationData[i]*(cycleIter)+(normalisedOriginal[i]>Math.random() ? 1:0))/(cycleIter+1);
            }
        }
    }

    
    return simulationData;
}

async function runDemo() {
    demoButton.removeEventListener('click', runDemo);

    while(cycleIter<20) {
        

        imageData.data.set(iterateLatticeDemo(simulationData, normalisedImage, cycleIter).map(val => val*255));

        cycleIter += 1;
        simulationCtx.putImageData(imageData, 0, 0);

        cycleSpan.innerHTML = cycleIter;

        await sleep(500);
    }

    demoButton.innerHTML = 'Reset';
    demoButton.addEventListener('click', resetDemo);
}

function resetDemo() {
    demoButton.removeEventListener('click', resetDemo);

    cycleIter = 0;

    simulationCtx.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);
    simulationData = new Float16Array(imageData.width * imageData.height * 4);

    demoButton.innerHTML = 'Simulate';
    document.getElementById("lattice-demo-run-sim").addEventListener('click', runDemo);
}

const demoButton = document.getElementById("lattice-demo-run-sim");

const demoDiv = document.getElementById("lattice-demo");
const cycleSpan = document.getElementById("lattice-demo-cycle-count");

const originalCanvas = document.getElementById('lattice-demo-original-img');
const simulationCanvas = document.getElementById('lattice-demo-simulation-img');
const canvasMaxWidth = 600;
const canvasMaxHeight = 600;

const originalCtx = originalCanvas.getContext("2d", {willReadFrequently: false});
const simulationCtx = simulationCanvas.getContext("2d", {willReadFrequently: true});

const originalImg = new Image();
originalImg.src = origin + "/images/test/test.png";

var imageData = null;
var normalisedImage = null;
var simulationData = null;
var cycleIter = 0;

originalImg.onload = () => {
    originalCanvas.width = originalImg.width;
    originalCanvas.height = originalImg.height;

    originalCtx.drawImage(originalImg, 0, 0, originalCanvas.width, originalCanvas.height);

    simulationCanvas.width = originalImg.width;
    simulationCanvas.height = originalImg.height;

    imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    normalisedImage = normaliseImage(imageData);

    simulationData = new Float16Array(imageData.width * imageData.height * 4);
}

document.getElementById("lattice-demo-run-sim").addEventListener('click', runDemo);


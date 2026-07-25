'use strict';

// THEME SETUP
// Initial colour setup is handled in page header
const themeToggleButton = document.getElementById('toggle-theme');
const defaultTheme = document.getElementById('default-theme').dataset
const primaryColor = defaultTheme.primaryColor;
const accentColor = defaultTheme.accentColor;
const backgroundColor = defaultTheme.backgroundColor;

// Custom select menu html handling new users
const initialCustomTheme = JSON.parse(localStorage.getItem('customTheme'));
var usingCustomTheme = initialCustomTheme==null? false : initialCustomTheme.active;
const initialCustomPrimaryColor = usingCustomTheme ? initialCustomTheme.primaryColor : '#FFFFFF';
const initialCustomBackgroundColor = usingCustomTheme ? initialCustomTheme.backgroundColor : '#000000';
const initialCustomAccentColor = usingCustomTheme ? initialCustomTheme.accentColor : '#FF0000';

const themeSelectMenu = `<div id="theme-menu-container">
    <form id="theme-form">
        <input class="theme-color-select" type="color" id="primary-color-selector" name="primary-color-selector" value="${initialCustomPrimaryColor}">
        <label class="theme-color-select" for="primary-color-selector">Primary Colour</label>
        
        <input class="theme-color-select" type="color" id="background-color-selector" name="background-color-selector" value="${initialCustomBackgroundColor}">
        <label class="theme-color-select" for="background-color-selector">Secondary Colour</label>

        <input class="theme-color-select" type="color" id="accent-color-selector" name="accent-color-selector" value="${initialCustomAccentColor}">
        <label class="theme-color-select" for="accent-color-selector">Accent Colour</label>
    </form>
</div>`

themeToggleButton.parentElement.innerHTML += themeSelectMenu;


// Update theme when colour changed and save changes when focus lost
const primaryColorPicker = document.getElementById('primary-color-selector');
const backgroundColorPicker = document.getElementById('background-color-selector');
const accentColorPicker = document.getElementById('accent-color-selector');
const themeMenuContainer = document.getElementById('theme-menu-container');

function updateCssVar(element, varName) {
    if (usingCustomTheme) document.documentElement.style.setProperty(varName, element.value);
}

function updateStoredTheme(element, field) {
    var currentCustomTheme = JSON.parse(localStorage.getItem('customTheme'));
    currentCustomTheme[field] = element.value;

    localStorage.setItem('customTheme', JSON.stringify(currentCustomTheme));
}

primaryColorPicker.addEventListener("input", (event)=>updateCssVar(primaryColorPicker, '--primary-color'));
backgroundColorPicker.addEventListener("input", (event)=>updateCssVar(backgroundColorPicker, '--background-color'));
accentColorPicker.addEventListener("input", (event)=>updateCssVar(accentColorPicker, '--accent-color'));

primaryColorPicker.addEventListener("blur", (event)=>updateStoredTheme(primaryColorPicker, 'primaryColor'));
backgroundColorPicker.addEventListener("blur", (event)=>updateStoredTheme(backgroundColorPicker, 'backgroundColor'));
accentColorPicker.addEventListener("blur", (event)=>updateStoredTheme(accentColorPicker, 'accentColor'));

// Hide away menu if clicked off of
// Pointerdown must be used instead of 'click' as it fires before focus changes
document.addEventListener('pointerdown', (event)=> {
    // if(! !themeToggleButton.contains(event.target)) {
    if (!document.getElementById('theme-menu-container').contains(event.target) 
        && !document.getElementById('toggle-theme').contains(event.target)
        && !primaryColorPicker.matches(':focus') && !backgroundColorPicker.matches(':focus')
        && !accentColorPicker.matches(':focus')) {
        themeMenuContainer.style.transform = "translateY(-105%)";
    }
});

// Ensure theme button appears correctly
const storedTheme = JSON.parse(localStorage.getItem('customTheme'));
if(storedTheme && storedTheme.active) document.getElementById('toggle-theme').classList.toggle("top-option-toggle-on");

// Handle pressing the theme button and creating custom theme
document.getElementById('toggle-theme').addEventListener('click', (event)=> {
    document.getElementById('toggle-theme').classList.toggle("top-option-toggle-on");

    const customTheme = JSON.parse(localStorage.getItem('customTheme'));

    // Create local custom theme for first time users
    if (customTheme == null) {
        const customPrimaryColor = "#FFFFFF";
        const customAccentColor = "#FF0000";
        const customBackgroundColor = "#000000"
        localStorage.setItem('customTheme', `{"active": true, "primaryColor": "${customPrimaryColor}", "accentColor": "${customAccentColor}", "backgroundColor": "${customBackgroundColor}"}`);

        document.documentElement.style.setProperty('--primary-color', customPrimaryColor);
        document.documentElement.style.setProperty('--accent-color', customAccentColor);
        document.documentElement.style.setProperty('--background-color', customBackgroundColor);
        
        themeMenuContainer.style.transform = "translateY(0%)";
        usingCustomTheme = true;
    }
    // Toggle theme off if on
    else if (customTheme.active) {
        customTheme.active = false;
        localStorage.setItem('customTheme', JSON.stringify(customTheme));

        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.documentElement.style.setProperty('--background-color', backgroundColor);

        themeMenuContainer.style.transform = "translateY(-105%)";
        usingCustomTheme = false;
    // Toggle theme on
    } else {
        customTheme.active = true;
        localStorage.setItem('customTheme', JSON.stringify(customTheme));

        document.documentElement.style.setProperty('--primary-color', customTheme.primaryColor);
        document.documentElement.style.setProperty('--accent-color', customTheme.accentColor);
        document.documentElement.style.setProperty('--background-color', customTheme.backgroundColor);

        themeMenuContainer.style.transform = "translateY(0%)";
        usingCustomTheme = true;
    }
});

// Custom button setup
const customCheckbox = Array.from(document.getElementsByClassName('custom-checkbox-container'));
customCheckbox.forEach(checkboxContainer => {
    checkboxContainer.addEventListener('click', function() {
        // When clicked, toggle active class based on checked status of related checkbox on all spans (which are the visual portion of the box)
        checkboxContainer.querySelectorAll('span').forEach(checkboxUiElem => {
            checkboxUiElem.classList.toggle('active', checkboxContainer.querySelector('input').checked);
        });
    });
});

// Custom SLIDER setup
const customSlider = Array.from(document.getElementsByClassName('slider-container'));
customSlider.forEach(sliderContainer => {
    const slider = sliderContainer.querySelector('input');
    slider.addEventListener('input', function(event) {
        sliderContainer.querySelector('span').style.width = Math.max(0, 11*(slider.value-1)-2)+"px";
    });
});

// Dropdown setup
const quantumComputingOption = document.getElementById("top-option-quantum");
const qunatumComputingDropdown = document.getElementById("dropdown-quantum");

const quantumComputingDropdownOptions = `<ul id="quantum-nav">
                                <li><a class="dropdown-option" href="/quantum-computing/qimp.html">Quantum Image Processing</a></li>
                            </ul>`

// <li><a class="dropdown-option" href="/quantum-computing/qnlp.html">Quantum Natural Language Processing</a></li>

qunatumComputingDropdown.innerHTML += quantumComputingDropdownOptions;

quantumComputingOption.addEventListener('mouseenter', function(event) {
    qunatumComputingDropdown.style.transform = 'translate(-50%, -0%)';
});

quantumComputingOption.addEventListener('mouseleave', function(event) {
    if(!qunatumComputingDropdown.matches(':hover')) qunatumComputingDropdown.style.transform = 'translate(-50%, -105%)';
});

qunatumComputingDropdown.addEventListener('mouseleave', function(event) {
    if(!quantumComputingOption.matches(':hover')) qunatumComputingDropdown.style.transform = 'translate(-50%, -105%)';
});

// Append reference list to bottom of page if any references exist
if (document.querySelectorAll("span.reference").length != 0) {
        document.getElementById("page-content").innerHTML += `<div id="reference-list">
    <h2>References</h2>
</div>`;

    const allRefs = document.querySelectorAll("span.reference");
    const referenceContainer = document.getElementById("reference-list");
    let i = 0;
    referenceContainer.innerHTML += '<ol>';
    allRefs.forEach(ref => {
        
        i++;
        referenceContainer.lastChild.innerHTML += '<li id="end-reference-'+i+'" class="end-reference">'+ref.dataset.ref+'</li>';
        const splitRefAnchor = ref.innerHTML.split(", ")
        ref.innerHTML = '<a class="accent-text" href="#end-reference-'+i+'">'+splitRefAnchor[0]+', ('+splitRefAnchor[1]+')</a>';
    });
    referenceContainer.innerHTML += '</ol>';
}

// Previous/Next page setup (for pages with relevant info)
const dataNav = document.getElementById("data-nav");

if(dataNav) {
    const previousPagePath = dataNav.dataset.previousPage;
    const nextPagePath = dataNav.dataset.nextPage;

    // If paths have been supplied generate nav
    if(!(previousPagePath==undefined && nextPagePath==undefined)) {
        const previousHTML = previousPagePath==undefined ? "" : `<a class="bottom-nav-previous" href="${previousPagePath}">
                <p class="accent-tex bra">Previous</p>
                <p class="small-text">${dataNav.dataset.previousPageTitle}</p>
            </a>`
        const nextHTML = nextPagePath==undefined ? "" : `<a class="bottom-nav-next" href="${nextPagePath}">
                <p class="accent-text ket">Next</p>
                <p class="small-text">${dataNav.dataset.nextPageTitle}</p>
            </a>`
        const bottomNavHTML =`<div class="bottom-nav">
                ${previousHTML}
                ${nextHTML}
            </div>`

        document.getElementById("page-content").innerHTML += bottomNavHTML;
    }
}

// Number equations
const allEquations = document.querySelectorAll("div.equation");
var equationCount = 1;
allEquations.forEach(equation => {
    equation.innerHTML = equation.innerHTML += `<p id="equation-${equationCount}" class="math equation-number">(${equationCount})</p>`
    equationCount++;
});

const allSqrts = document.querySelectorAll("span.sqrt");
allSqrts.forEach(sqrt => {
    sqrt.outerHTML = "&radic;"+sqrt.outerHTML;
});

const allFracs = document.querySelectorAll("span.frac");
allFracs.forEach(frac => {
    const numer = frac.innerHTML.split("#")[0];
    const denom = frac.innerHTML.split("#")[1];
    frac.innerHTML = `<span>${numer}</span>
        <span class="denom">${denom}</span>`;
});

const allSum = document.querySelectorAll("span.sum");
allSum.forEach(sum => {
    const limit = sum.innerHTML.split("~")[0];
    const init = sum.innerHTML.split("~")[1];
    sum.innerHTML = `<span class="sum-limit small-text">${limit}</span>
<span class="sum-sigma">&Sigma;</span>
<span class="sum-init small-text">${init}</span>`;
});

const allKets = document.querySelectorAll("span.ket, p.ket");
allKets.forEach(ket => {
    ket.innerHTML = '|'+ket.innerHTML+'<span class="no-italic">&RightAngleBracket;</span>';
});

const allBras = document.querySelectorAll("span.bra, p.bra");
allBras.forEach(bra => {
    bra.innerHTML = '<span class="no-italic">&LeftAngleBracket;</span>'+bra.innerHTML+'|';
});

// Automate math styling
// window.addEventListener("load", (event) => {
    const allMaths = document.querySelectorAll(".math, p.math, p.equation, .ket, .bra");
    allMaths.forEach(maths => {
        maths.innerHTML = maths.innerHTML.replace(/[\[\]()|:0-9]/g, match => {
        return `<span class="no-italic">${match}</span>`;
    });
    });
// });

// Add timestamp and citation tools to articles
const dataArticle = document.getElementById("data-article");

function clearCopyHighlights() {
    let i = 0;
    for(let childElem of document.getElementById("cite-options").children) {
        i++;

        if(i%2 == 1) continue;

        childElem.innerHTML = "&nbsp;&nbsp;&#9744";
    }
}

const date = new Date();
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
const formattedDate = `${year}-${month}-${day}`;

function generateBibTex() {
    const dateArray = dataArticle.dataset.datePublished.split('/');
    navigator.clipboard.writeText(`@misc{${dataArticle.dataset.author.split(' ')[1].toLowerCase()}${dateArray[2]},
    author = {${dataArticle.dataset.author}},
    title = {${document.getElementsByTagName('h1')[0].innerHTML}},
    year = {${dateArray[2]}},
    howpublished = {\\url{${window.location.href}}},
    note = {Accessed: ${formattedDate}}
}`);

    clearCopyHighlights();
    document.getElementById("cite-with-bibtex").nextElementSibling.innerHTML = "&nbsp;&nbsp;&#9745;"
}

function generateBibLaTex() {
    const dateArray = dataArticle.dataset.datePublished.split('/');
    navigator.clipboard.writeText(`@online{${dataArticle.dataset.author.split(' ')[1].toLowerCase()}${dateArray[2]},
    author = {${dataArticle.dataset.author}},
    title = {${document.getElementsByTagName('h1')[0].innerHTML}},
    year = {${dateArray[2]}},
    url = {${window.location.href}},
    urldate = {${formattedDate}}
}`);

    clearCopyHighlights();
    document.getElementById("cite-with-biblatex").nextElementSibling.innerHTML = "&nbsp;&nbsp;&#9745;"
}

// function generateHarvard() {
//     const dateArray = dataArticle.dataset.datePublished.split('/');
//     navigator.clipboard.writeText(`${dataArticle.dataset.author.split(' ')[1].toLowerCase()} (${dateArray[2]}) ${document.getElementsByTagName('h1')[0].innerHTML}. Available at: ${window.location.href} (Accessed),
//     author = {${dataArticle.dataset.author}},
//     title = {${document.getElementsByTagName('h1')[0].innerHTML}},
//     year = {${dateArray[2]}},
//     url = {${window.location.href}},
//     urldate = {${formattedDate}}
// }`);

//     clearCopyHighlights();
//     document.getElementById("cite-with-harvard").nextElementSibling.innerHTML = "&nbsp;&nbsp;&#9745;"
// }

if(dataArticle) {
    document.getElementsByTagName("h1")[0].outerHTML+=`
    <div id="article-header">
        <p>${dataArticle.dataset.datePublished} | ${dataArticle.dataset.timePublished} | ${dataArticle.dataset.author}</p>
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
    </div>`;

                    // <button id="cite-with-harvard">Copy Harvard</button>
                    // <p></p>

    const citeButton = document.getElementById("button-cite-me");
    const citeOptions = document.getElementById("cite-options");

    citeButton.addEventListener('click', function(event) {
        citeButton.classList.toggle('active');
        citeOptions.classList.toggle('active');
    });

    document.addEventListener('pointerdown', (event) => {
        if (!citeButton.contains(event.target) && !citeOptions.contains(event.target)) {
            citeButton.classList.remove('active');
            citeOptions.classList.remove('active');

            clearCopyHighlights();
        }
    });

    document.getElementById("cite-with-bibtex").addEventListener('click', generateBibTex);
    document.getElementById("cite-with-bibtex").nextSibling.nextSibling.addEventListener('click', generateBibTex);
    document.getElementById("cite-with-biblatex").addEventListener('click', generateBibLaTex);
    document.getElementById("cite-with-biblatex").nextSibling.nextSibling.addEventListener('click', generateBibLaTex);
    // document.getElementById("cite-with-harvard").addEventListener('click', generateHarvard);
    clearCopyHighlights();
}

import TreeGenerator from "./TreeGenerator.js";

// Elements
const newButton = document.getElementById("newButton")
const seedInput = document.getElementById("seedInput")

let generator = new TreeGenerator(123);

// Event handlers
const newClicked = () => {
    drawTree();
}
const seedChange = (value) => {
    ig.setNewUnits(value);
    ig.buildShape();
    ig.paint();
}
const drawTree = () => {
    generator = new TreeGenerator(seedInput.value);

    let timer;
    generator = new TreeGenerator(seedInput.value) ;
    let count = 10;
    const growStep = () => {
        count--;
        generator.growStep();
        if (count <= 0) clearInterval(timer);
    }
    timer = setInterval(growStep, 100);
    
}

// Set event handlers
newButton.addEventListener("click", newClicked);
seedInput.addEventListener("input", (e) => seedChange(e.target.value));



// RUN
drawTree();

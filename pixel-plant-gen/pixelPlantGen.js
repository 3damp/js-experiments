function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function randomColor(base, variance) {
    // base: [r,g,b], variance: int
    return `rgb(${clamp(base[0] + randomInt(-variance, variance), 0, 255)},${clamp(base[1] + randomInt(-variance, variance), 0, 255)},${clamp(base[2] + randomInt(-variance, variance), 0, 255)})`;
}

// Interpolate between two colors
function interpolateColorArray(color1, color2, factor) {
    return color1.map((c, i) => Math.round(c + (color2[i] - c) * factor));
}

// Gene structure: deterministic plant "DNA"
function randomGenes() {
    // Improved random flower color: pick a base and add variance
    const flowerBaseColors = [
        [220, 60, 120],   // pink
        [255, 200, 40],   // yellow
        [255, 255, 255],  // white
        [180, 80, 255],   // purple
        [255, 80, 80],    // red
        [80, 200, 255],   // blue
    ];
    const baseFlower = flowerBaseColors[randomInt(0, flowerBaseColors.length - 1)];
    const flowerVariance = randomInt(20, 60);
    const flowerColor = [
        clamp(baseFlower[0] + randomInt(-flowerVariance, flowerVariance), 0, 255),
        clamp(baseFlower[1] + randomInt(-flowerVariance, flowerVariance), 0, 255),
        clamp(baseFlower[2] + randomInt(-flowerVariance, flowerVariance), 0, 255)
    ];

    return {
        stemLen: randomInt(7, 11),
        stemColor: [randomInt(40, 80), randomInt(100, 140), randomInt(30, 60)],
        stemWalkChance: Math.random() * 0.5,
        leafColor: [randomInt(20, 80), randomInt(140, 220), randomInt(40, 100)],
        leafStart: randomInt(1, 3),
        leafSpacing: randomInt(1, 3),
        leafLenMin: randomInt(1, 2),
        leafLenMax: randomInt(3, 5),
        leafDirChance: Math.random(),
        flowerChance: Math.random(),
        flowerColor: flowerColor,
        flowerVariance: flowerVariance,
        topLeafColor: [randomInt(20, 80), randomInt(180, 240), randomInt(60, 120)],
        topLeafVariance: randomInt(20, 40)
    };
}

function generatePlant(genes = randomGenes(), canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 16, 16);

    // Stem
    let stemX = 8;
    let stemY = 15;
    let stemLen = genes.stemLen;
    let stemColor = `rgb(${genes.stemColor[0]},${genes.stemColor[1]},${genes.stemColor[2]})`;

    for (let i = 0; i < stemLen; i++) {
        ctx.fillStyle = stemColor;
        ctx.fillRect(stemX, stemY - i, 1, 1);

        // Gene-based random walk for stem
        if (Math.random() < genes.stemWalkChance) {
            stemX += randomInt(-1, 1);
            stemX = clamp(stemX, 4, 11);
        }
    }

    // Leaves
    let leafColor = `rgb(${genes.leafColor[0]},${genes.leafColor[1]},${genes.leafColor[2]})`;
    for (let i = genes.leafStart; i < stemLen - 1; i += genes.leafSpacing) {
        let y = stemY - i;
        let x = stemX + randomInt(-1, 1);
        let dir = Math.random() < genes.leafDirChance ? -1 : 1;
        let leafLen = randomInt(genes.leafLenMin, genes.leafLenMax);
        for (let l = 0; l < leafLen; l++) {
            ctx.fillStyle = leafColor;
            ctx.fillRect(x + dir * l, y + randomInt(-1, 1), 1, 1);
        }
    }

    // Flower or top leaves
    if (Math.random() < genes.flowerChance) {
        // Flower
        let fcol = genes.flowerColor;
        ctx.fillStyle = randomColor(fcol, genes.flowerVariance);
        ctx.fillRect(stemX, stemY - stemLen, 1, 1);
        // Petals
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (Math.abs(dx) + Math.abs(dy) === 1) {
                    ctx.fillStyle = randomColor(fcol, genes.flowerVariance + 10);
                    ctx.fillRect(stemX + dx, stemY - stemLen + dy, 1, 1);
                }
            }
        }
    } else {
        // Top leaves
        let topLeafColor = randomColor(genes.topLeafColor, genes.topLeafVariance);
        for (let dx = -1; dx <= 1; dx += 2) {
            ctx.fillStyle = topLeafColor;
            ctx.fillRect(stemX + dx, stemY - stemLen, 1, 1);
        }
    }
}

/**
 * Breed two gene sets together to produce a new set of genes.
 * Each property is randomly chosen from parentA or parentB, or averaged for numbers.
 */
function breedGenes(parentA, parentB) {
    function pick(a, b) {
        const rnd = Math.random();

        // For arrays (like colors), pick each channel randomly
        if (Array.isArray(a) && Array.isArray(b)) {
            return interpolateColorArray(a, b, rnd);
        }
        // For numbers, randomly pick or average (customize as desired)
        if (typeof a === 'number' && typeof b === 'number') {
            // 50% chance to pick from either, or average for more blending
            return Math.random() < 0.5 ? a : b;
        }
        // Fallback
        return Math.random() < 0.5 ? a : b;
    }

    return {
        stemLen: pick(parentA.stemLen, parentB.stemLen),
        stemColor: pick(parentA.stemColor, parentB.stemColor),
        stemWalkChance: pick(parentA.stemWalkChance, parentB.stemWalkChance),
        leafColor: pick(parentA.leafColor, parentB.leafColor),
        leafStart: pick(parentA.leafStart, parentB.leafStart),
        leafSpacing: pick(parentA.leafSpacing, parentB.leafSpacing),
        leafLenMin: pick(parentA.leafLenMin, parentB.leafLenMin),
        leafLenMax: pick(parentA.leafLenMax, parentB.leafLenMax),
        leafDirChance: pick(parentA.leafDirChance, parentB.leafDirChance),
        flowerChance: pick(parentA.flowerChance, parentB.flowerChance),
        flowerColor: pick(parentA.flowerColor, parentB.flowerColor),
        flowerVariance: pick(parentA.flowerVariance, parentB.flowerVariance),
        topLeafColor: pick(parentA.topLeafColor, parentB.topLeafColor),
        topLeafVariance: pick(parentA.topLeafVariance, parentB.topLeafVariance)
    };
}

// Initial plant
generatePlant();
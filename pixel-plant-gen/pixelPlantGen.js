function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function randomColor(base, variance) {
    // base: [r,g,b], variance: int
    return `rgb(${Math.max(0, Math.min(255, base[0] + randomInt(-variance, variance)))
        },${Math.max(0, Math.min(255, base[1] + randomInt(-variance, variance)))
        },${Math.max(0, Math.min(255, base[2] + randomInt(-variance, variance)))
        })`;
}

function generatePlant() {
    const canvas = document.getElementById('plantCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 16, 16);

    // Background transparent
    ctx.clearRect(0, 0, 16, 16);

    // Stem
    let stemX = 8;
    let stemY = 15;
    let stemLen = randomInt(7, 11);
    let stemColor = randomColor([60, 120, 40], 20);

    for (let i = 0; i < stemLen; i++) {
        ctx.fillStyle = stemColor;
        ctx.fillRect(stemX, stemY - i, 1, 1);

        // Slight random walk for stem
        if (Math.random() < 0.3) {
            stemX += randomInt(-1, 1);
            stemX = Math.max(4, Math.min(11, stemX));
        }
    }

    // Leaves
    let leafColor = randomColor([40, 180, 60], 30);
    for (let i = 2; i < stemLen - 1; i += randomInt(1, 3)) {
        let y = stemY - i;
        let x = stemX + randomInt(-1, 1);
        let dir = Math.random() < 0.5 ? -1 : 1;
        let leafLen = randomInt(2, 4);
        for (let l = 0; l < leafLen; l++) {
            ctx.fillStyle = leafColor;
            ctx.fillRect(x + dir * l, y + randomInt(-1, 1), 1, 1);
        }
    }

    // Flower or top leaves
    if (Math.random() < 0.6) {
        // Flower
        let flowerColors = [
            [220, 60, 120], [255, 200, 40], [255, 255, 255], [180, 80, 255]
        ];
        let fcol = flowerColors[randomInt(0, flowerColors.length - 1)];
        ctx.fillStyle = randomColor(fcol, 30);
        ctx.fillRect(stemX, stemY - stemLen, 1, 1);
        // Petals
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (Math.abs(dx) + Math.abs(dy) === 1) {
                    ctx.fillStyle = randomColor(fcol, 40);
                    ctx.fillRect(stemX + dx, stemY - stemLen + dy, 1, 1);
                }
            }
        }
    } else {
        // Top leaves
        let topLeafColor = randomColor([40, 200, 80], 30);
        for (let dx = -1; dx <= 1; dx += 2) {
            ctx.fillStyle = topLeafColor;
            ctx.fillRect(stemX + dx, stemY - stemLen, 1, 1);
        }
    }
}

// Initial plant
generatePlant();
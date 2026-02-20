let opacity = 1;

let characterGrid;
let lastTime = 0;
let lastUpdateTime = 0;

export function startAnimation() {
    console.log('Starting animation');
    opacity = 1;
    const canvas = document.getElementById('home-animation');
    runAnimationLoop(canvas);
}

function runAnimationLoop(canvas) {
    requestAnimationFrame((timestamp) => {
        if (opacity > 0) {
            opacity -= .0075;
            document.body.style.setProperty('--home-opacity', opacity);
            document.body.style.setProperty('--animation-opacity', Math.min(1, 1 - opacity));
        }
        const context = canvas.getContext('2d');

        if (!characterGrid) {
            const charSize = context.measureText('0');
            characterGrid = {};
            characterGrid.width = Math.floor(canvas.width / charSize.width);
            characterGrid.characterWidth = charSize.width;
            characterGrid.characterHeight = charSize.actualBoundingBoxAscent + charSize.actualBoundingBoxDescent;
            characterGrid.height = Math.floor(canvas.height / characterGrid.characterHeight);
            characterGrid.coordinates = [];
        }

        const lastUpdateDelta = timestamp - lastUpdateTime;
        if (lastUpdateTime === 0 || lastUpdateDelta >= 25) {
            lastUpdateTime = timestamp;
            updatePattern();
        }

        context.clearRect(0, 0, canvas.width, canvas.height);


        context.fillStyle = '#00a14b';
        for (let coordinate of characterGrid.coordinates) {
            context.fillText(coordinate.value, characterGrid.characterWidth * coordinate.x, (characterGrid.characterHeight * coordinate.y) + characterGrid.characterHeight);
        }

        let timeDelta = timestamp - lastTime;
        if (lastTime == 0 || timeDelta >= 3.333) {
            runAnimationLoop(canvas);
        } else {
            console.log('Resting');
            setTimeout(() => {
                runAnimationLoop(canvas);
            }, 3.333 - timeDelta);
        }
        lastTime = timestamp;
    });
}

function updatePattern() {
    if (characterGrid.coordinates.length === 0) {
        characterGrid.coordinates.push({ x: Math.floor(characterGrid.width / 2), y: Math.floor(characterGrid.height / 2), value: getFillValue() });
        return;
    }

    let minX = characterGrid.width + 1;
    let maxX = -1;
    let minY = characterGrid.height;
    let maxY = -1;

    for (let coordinate of characterGrid.coordinates) {
        minX = Math.min(coordinate.x, minX);
        minY = Math.min(coordinate.y, minY);
        maxX = Math.max(coordinate.x, maxX);
        maxY = Math.max(coordinate.y, maxY);
    }

    if (minX < -2 && maxX > characterGrid.width + 2 && minY < -2 && maxY > characterGrid.height + 2) {
        characterGrid.coordinates = [];
        return;
    }

    let newCoordinates = [];

    const startRow = minY - 1;
    const endRow = maxY + 2;
    const startColumn = minX - 1;
    const endColumn = maxX + 2;
    for (let row = startRow; row < endRow; row++) {
        const isYBorder = row - 2 < startRow || row + 1 > maxY;
        for (let column = startColumn; column < endColumn; column++) {
            const isXBorder = column - 2 < startColumn || column + 3 > endColumn;
            if (!isXBorder && !isYBorder) continue;

            newCoordinates.push({ x: column, y: row, value: getFillValue() });
        }
    }

    characterGrid.coordinates = newCoordinates;
}

function getFillValue() {
    return Math.random() * 2 > 1 ? '0' : '1'; 
}

export function stopAnimation() {
    console.log('Starting animation')
    opacity = 1;
}

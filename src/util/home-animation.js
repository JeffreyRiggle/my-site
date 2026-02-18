let opacity = 1;

let characterGrid;
let lastTime = 0;
let lastUpdateTime = 0;

export function startAnimation() {
    console.log('Starting animation');
    opacity = 1;
    const canvas = document.getElementById('home-animation');

    // TODO: Do something much better
    setInterval(() => {
        if (!characterGrid) return;

        const coordinateIndex = Math.floor(Math.random() * characterGrid.coordinates.length);
        let coordinate = characterGrid.coordinates[coordinateIndex];
        coordinate.value = coordinate.value == '1' ? '0' : '1';
    }, 300);
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
        if (lastUpdateTime === 0 || lastUpdateDelta >= 100) {
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
        characterGrid.coordinates.push({ x: Math.floor(characterGrid.width / 2), y: Math.floor(characterGrid.height / 2), value: '0' });
        return;
    }

    let fillMap = {};

    for (let i = 0; i < characterGrid.coordinates.length; i++) {
        const coordinate = characterGrid.coordinates[i];
        let xSpace = fillMap[coordinate.x];
        if (!xSpace) {
            xSpace = {};
        }
        xSpace[coordinate.y] = { ...coordinate, index: i };
        fillMap[coordinate.x] = xSpace;
    }

    let newCoordinates = [];

    for (const coordinate of characterGrid.coordinates) {
        let newCoordinateTop = { x: coordinate.x, y: coordinate.y + 1, value: '0' };
        let newCoordinateBottom = { x: coordinate.x, y: coordinate.y - 1, value: '0' };
        let newCoordinateLeft = { x: coordinate.x - 1, y: coordinate.y, value: '0' };
        let newCoordinateRight = { x: coordinate.x + 1, y: coordinate.y, value: '0' };

        if (shouldAddToMap(newCoordinateTop, fillMap)) {
            newCoordinates.push(newCoordinateTop);
            if (!fillMap[newCoordinateTop.x]) {
                fillMap[newCoordinateTop.x] = {};
            }
            fillMap[newCoordinateTop.x][newCoordinateTop.y] = newCoordinateTop;
        }
        if (shouldAddToMap(newCoordinateBottom, fillMap)) {
            if (!fillMap[newCoordinateBottom.x]) {
                fillMap[newCoordinateBottom.x] = {};
            }
            newCoordinates.push(newCoordinateBottom);
            fillMap[newCoordinateBottom.x][newCoordinateBottom.y] = newCoordinateBottom;
        }
        if (shouldAddToMap(newCoordinateLeft, fillMap)) {
            if (!fillMap[newCoordinateLeft.x]) {
                fillMap[newCoordinateLeft.x] = {};
            }
            newCoordinates.push(newCoordinateLeft);
            fillMap[newCoordinateLeft.x][newCoordinateLeft.y] = newCoordinateLeft;
        }
        if (shouldAddToMap(newCoordinateRight, fillMap)) {
            if (!fillMap[newCoordinateRight.x]) {
                fillMap[newCoordinateRight.x] = {};
            }
            newCoordinates.push(newCoordinateRight);
            fillMap[newCoordinateRight.x][newCoordinateRight.y] = newCoordinateRight;
        }
    }

    characterGrid.coordinates = newCoordinates;
}

function shouldAddToMap(newCoordinate, fillMap) {
    return !(fillMap[newCoordinate.x] && fillMap[newCoordinate.x][newCoordinate.y]) && newCoordinate.x <= characterGrid.width && newCoordinate.x >= 0 && newCoordinate.y <= characterGrid.height && newCoordinate.y >= 0;
}

export function stopAnimation() {
    console.log('Starting animation')
    opacity = 1;
}

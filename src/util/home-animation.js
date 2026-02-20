let opacity = 1;

let characterGrid;
let lastTime = 0;
let lastUpdateTime = 0;
let transitionStage = 0;
let fallPattern;

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
    if (transitionStage === 0) {
        generateInitialPattern();
        return;
    }

    if (transitionStage === 1) {
        generateExpandPattern();
    }

    if (transitionStage === 2) {
        generateFallPattern();
    }
}

function generateInitialPattern() {
    characterGrid.coordinates.push({ x: Math.floor(characterGrid.width / 2), y: Math.floor(characterGrid.height / 2), value: getFillValue() });
    transitionStage = 1;
}

function generateExpandPattern() {
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
        transitionStage = 2;
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

function generateFallPattern() {
    if (!fallPattern) {
        initializeFallPattern();
    } else if (fallPattern.step >= fallPattern.maxStep) {
        transitionStage = 3;
        characterGrid.coordinates = [];
        return;
    }

    let newCoordinates = [];
    const nextStep = fallPattern.step + 1;
    for (let x = 0; x < characterGrid.width; x++) {
        const pattern = fallPattern.pattern[x];
        const characterTail = fallPattern.step - pattern.offset;
        const characterHead = Math.max(0, characterTail - pattern.size);

        if (characterHead > characterGrid.height) continue;

        for (let y = characterHead; y < characterTail; y++) {
            newCoordinates.push({ x, y, value: getFillValue() });
        }
    }
    characterGrid.coordinates = newCoordinates;

    fallPattern.step = nextStep;
}

function initializeFallPattern() {
    fallPattern = {
        step: 0,
        maxStep: 0,
        pattern: []
    };

    for(let i = 0; i < characterGrid.width; i++) {
        const size = Math.floor(Math.random() * (characterGrid.height * 2));
        const offset = Math.floor(Math.random() * (characterGrid.height / 2));
        fallPattern.maxStep = Math.max(fallPattern.maxStep, size + offset + characterGrid.height);
        fallPattern.pattern.push({ size, offset });
    }
}

function getFillValue() {
    return Math.random() * 2 > 1 ? '0' : '1'; 
}

export function stopAnimation() {
    console.log('Starting animation')
    opacity = 1;
}

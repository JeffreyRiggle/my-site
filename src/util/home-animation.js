let opacity = 1;

let characterGrid;
let lastTime = 0;
let transitionStage = 0;
let fallPattern;
let particles = [];
let isMouseDown = false;
let canvasWidth, canvasHeight;
let options;
const chars = '0123456789ABCDEF';

function handleMouseMove(event) {
    if (options) {
        for(let option of options) {
            const isHover = (
                event.clientX > option.x && event.clientX < option.x + option.width &&
                event.clientY > option.y && event.clientY < option.y + option.height
            );
            option.hover = isHover;
        }
    }

    if (!isMouseDown) return;

    spawnParticles(5, event);
}

function handleMouseDown(event) {
    if (transitionStage < 3) return;

    spawnParticles(25, event);
    isMouseDown = true;

    if (options) {
        const targetOption = options.find(option => {
            return (
                event.clientX > option.x && event.clientX < option.x + option.width &&
                event.clientY > option.y && event.clientY < option.y + option.height
            );
        });

        if (targetOption) {
            setTimeout(() => {
                window.location.href = targetOption.ref;
            }, 250);
        }
    }
}

function handleMouseUp(event) {
    isMouseDown = false;
}

function spawnParticles(count, event) {
    for (let i = 0; i < count; i++) {
        const xDirection = Math.random() * 2 > 1 ? 1 : -1;
        const yDirection = Math.random() * 2 > 1 ? 1 : -1;
        particles.push({ 
            x: event.clientX,
            y: event.clientY,
            opacity: 1,
            fade: Math.max(.0075, Math.random() * .05),
            value: getFillValue(),
            xDelta: Math.random() * xDirection,
            yDelta: Math.random() * yDirection
        });
    }
}

export function startAnimation() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'home-animation');
    canvas.width = canvasWidth = window.innerWidth;
    canvas.height = canvasHeight = window.innerHeight;
    document.body.append(canvas);
    opacity = 1;
    runAnimationLoop(canvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
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
            context.font = "16px 'Courier New', Courier, monospace";
            const charSize = context.measureText('0');
            characterGrid = {};
            characterGrid.width = Math.floor(canvas.width / charSize.width);
            characterGrid.characterWidth = charSize.width;
            characterGrid.characterHeight = charSize.actualBoundingBoxAscent + charSize.actualBoundingBoxDescent;
            characterGrid.height = Math.floor(canvas.height / characterGrid.characterHeight);
            characterGrid.coordinates = [];
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        if (transitionStage < 3) {
            runTransitionLoop(context);
        } else {
            runMainLoop(context);
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

function runTransitionLoop(context) {
    updatePattern();

    context.fillStyle = '#00a14b';
    context.font = "16px 'Courier New', Courier, monospace";
    for (let coordinate of characterGrid.coordinates) {
        context.fillText(coordinate.value, characterGrid.characterWidth * coordinate.x, (characterGrid.characterHeight * coordinate.y) + characterGrid.characterHeight);
    }
}

function runMainLoop(context) {
    let newParticles = [];
    for (let particle of particles) {
        particle.opacity -= particle.fade;
        particle.x = particle.x - particle.xDelta;
        particle.y = particle.y - particle.yDelta;

        if (particle.opacity > 0) {
            newParticles.push(particle);
        }
    }
    particles = newParticles;

    if (!options) {
        const optionWidth = canvasWidth / 4;
        const optionHeight = canvasWidth / 8;
        const optionY = (canvasHeight / 2) - (optionHeight / 2);
        options = [
            { x: (canvasWidth * .25) - (optionWidth / 2), y: optionY, width: optionWidth, height: optionHeight, text: 'Projects', ref: 'projects' },
            { x: (canvasWidth * .75) - (optionWidth / 2), y: optionY, width: optionWidth, height: optionHeight, text: 'Blogs', ref: 'blogs' }
        ]
    }
    
    const originalShadowColor = context.shadowColor;
    const originalShadowBlur = context.shadowBlur;
    for (let option of options) {
        context.fillStyle = '#00b3b3';
        if (option.hover) {
            context.shadowColor = '#007f7f';
            context.shadowBlur = 25;
        }
        context.beginPath();
        context.rect(option.x, option.y, option.width, option.height);
        context.fill();

        context.fillStyle = '#021212';
        context.font = "24px 'Courier New', Courier, monospace";
        const textSize = context.measureText(option.text);
        context.fillText(
            option.text,
            (option.x + (option.width / 2)) - (textSize.width / 2),
            (option.y + (option.height / 2)) - ((textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2)
        );

        context.shadowColor = originalShadowColor;
        context.shadowBlur = originalShadowBlur;
    }

    for (let particle of particles) {
        context.font = "16px 'Courier New', Courier, monospace";
        context.fillStyle = `rgba(0, 161, 75, ${particle.opacity}`;
        context.fillText(particle.value, particle.x, particle.y);
    }
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
        const size = Math.floor(Math.random() * (characterGrid.height / 2));
        const offset = Math.floor(Math.random() * (characterGrid.height));
        fallPattern.maxStep = Math.max(fallPattern.maxStep, size + offset + characterGrid.height);
        fallPattern.pattern.push({ size, offset });
    }
}

function getFillValue() {
    const index = Math.random() * chars.length;
    return chars.charAt(index);
}

export function stopAnimation() {
    opacity = 1;
}

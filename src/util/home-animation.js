let opacity = 1;

let characterGrid;
let lastTime = 0;
let transitionStage = 0;
let fallPattern;
let particles = [];
let isMouseDown = false;
let canvasWidth, canvasHeight, horizon, canvasMiddle, roadDistance, segments, maxRoadWidth;
let options;
let cameraPosition = 0;
let pulses = [];
let wave;
let lastTimeStep, nextPulseGeneration, waveGeneration;
const chars = '0123456789ABCDEF';
const roadGutterWidth = 8;

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
            }, 500);
        }
    }
}

function handleMouseUp() {
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
    horizon = canvasHeight / 2;
    canvasMiddle = maxRoadWidth = canvasWidth / 2;
    roadDistance = canvasHeight - horizon;
    segments = Math.round(roadDistance);
    document.body.append(canvas);
    opacity = 1;
    runAnimationLoop(canvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
}

function updatePositions(dt) {
    cameraPosition += .0025 * dt;
    if (wave) {
        wave.ttl -= dt;
                    
        if (wave.ttl <= 0) {
            wave = null;
        } else {
            wave.amplitude += wave.acceleration * dt; 
        }
    }
                
    for (let pulse of pulses) {
        pulse.z += .01 * dt;
    }
}

function runAnimationLoop(canvas) {
    requestAnimationFrame((timestep) => {
        if (opacity > 0) {
            opacity -= .05;
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
            runMainLoop(context, timestep);
        }

        let timeDelta = performance.now() - lastTime;
        if (lastTime == 0 || timeDelta >= 33.333) {
            runAnimationLoop(canvas);
        } else {
            setTimeout(() => {
                runAnimationLoop(canvas);
            }, 33.333 - timeDelta);
        }
        lastTime = performance.now();
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

function runMainLoop(context, timestep) {
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
        initOptions();
    }

    let dt = timestep - (lastTimeStep ?? timestep);
    lastTimeStep = timestep;

    if (dt === 0) {
        nextPulseGeneration = timestep + Math.round(Math.random() * 5000);
        waveGeneration = timestep + (Math.ceil(Math.random() * 5) * 3000);
    }

    if (nextPulseGeneration <= timestep) {
        pulses.push({ z: -5, length: 5 });
        nextPulseGeneration = timestep + (Math.ceil(Math.random() * 5) * 1000);
    }

    if (waveGeneration <= timestep) {
        wave = { frequency: Math.random() * .1, amplitude: Math.ceil(Math.random() * 10), acceleration: Math.random() * .05, ttl: 1000 };
        waveGeneration = timestep + (Math.ceil(Math.random() * 5) * 3000);
    }

    updatePositions(dt);
    pulses = pulses.filter(p => p.z < segments);
    const cameraOffset = cameraPosition % 1;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const initialStrokeStyle = context.strokeStyle;

    for (let y = canvasHeight; y > horizon; y--) {
        const z = roadDistance / (y - horizon);
        const nextZ = y > horizon + 1 ? roadDistance / (y - 1 - horizon) : Infinity;
        let left, right;
        
        if (wave) {
            const leftMiddle = canvasMiddle + Math.cos(y * wave.frequency) * wave.amplitude;
            const rightMiddle = canvasMiddle + Math.sin(y * wave.frequency) * wave.amplitude;
            left = leftMiddle - (maxRoadWidth / z);
            right = rightMiddle + (maxRoadWidth / z);
        } else {
            const roadMiddle = canvasMiddle;
            left = roadMiddle - (maxRoadWidth / z);
            right = roadMiddle + (maxRoadWidth / z);
        }
        
        const isPulseLine = pulses.some(p => p.z <= z && p.z + p.length >= z);
        const segmentBoundary = Math.ceil(z + cameraOffset);
        const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ + cameraOffset;

        if (!isPulseLine) {
            context.beginPath();
            context.moveTo(!onSegment ? left : 0, y);
            context.lineTo(left + roadGutterWidth, y);
            context.moveTo(right, y);
            context.lineTo(!onSegment ? right + roadGutterWidth : canvasWidth, y);
            context.strokeStyle = 'green';
            context.stroke();
            continue;
        }
        
        context.beginPath();
        context.moveTo(!onSegment ? left : 0, y);
        context.lineTo(left, y);
        context.strokeStyle = 'green';
        context.stroke();

        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(left + roadGutterWidth, y);
        context.strokeStyle = 'lightgreen';
        context.stroke();

        context.beginPath();
        context.moveTo(right, y);
        context.lineTo(right + roadGutterWidth, y);
        context.strokeStyle = 'lightgreen';
        context.stroke();

        if (onSegment) {
            context.beginPath();
            context.moveTo(right + roadGutterWidth, y);
            context.lineTo(canvasWidth, y);
            context.strokeStyle = 'green';
            context.stroke();
        }
    }
    context.strokeStyle = initialStrokeStyle;
    const originalShadowColor = context.shadowColor;
    const originalShadowBlur = context.shadowBlur;
    const originalLineWidth = context.lineWidth;
    
    for (let option of options) {
        let initialStrokeStyle = context.strokeStyle;
        context.fillStyle = 'transparent';
        context.lineWidth = 5;
        context.strokeStyle = 'rgba(0, 179, 179, .8)';
        if (option.hover) {
            context.shadowColor = '#007f7f';
            context.shadowBlur = 25;
        }
        context.beginPath();
        context.rect(option.x, option.y, option.width, option.height);
        context.fill();
        context.stroke();

        context.fillStyle = 'rgb(0, 179, 179)';
        context.strokeStyle = initialStrokeStyle;
        context.font = "24px 'Courier New', Courier, monospace";
        const textSize = context.measureText(option.text);
        context.fillText(
            option.text,
            (option.x + (option.width / 2)) - (textSize.width / 2),
            (option.y + (option.height / 2)) - ((textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / 2)
        );

        context.shadowColor = originalShadowColor;
        context.shadowBlur = originalShadowBlur;
        context.lineWidth = originalLineWidth;
    }

    for (let particle of particles) {
        context.font = "16px 'Courier New', Courier, monospace";
        context.fillStyle = `rgba(0, 161, 75, ${particle.opacity}`;
        context.fillText(particle.value, particle.x, particle.y);
    }
}

function initOptions() {
    if (canvasWidth < 600) {
        initMobileOptions();
        return;
    }
    initDesktopOptions();
}

function initMobileOptions() {
    const optionWidth = canvasWidth / 2;
    const optionHeight = canvasWidth / 4;
    const optionX = (canvasWidth / 2) - (optionWidth / 2);
    const padding = 20;
    options = [
        { x: optionX, y: padding, width: optionWidth, height: optionHeight, text: 'Projects', ref: 'projects' },
        { x: optionX, y: (padding * 2) + optionHeight, width: optionWidth, height: optionHeight, text: 'Blogs', ref: 'blogs' },
        { x: optionX, y: (padding * 3) + (optionHeight * 2), width: optionWidth, height: optionHeight, text: 'Scenes', ref: 'scenes' }
    ]
}

function initDesktopOptions() {
    const optionWidth = canvasWidth / 4;
    const optionHeight = canvasWidth / 8;
    const optionY = (canvasHeight / 4) - (optionHeight / 2);
    options = [
        { x: (canvasWidth * .16) - (optionWidth / 2), y: optionY, width: optionWidth, height: optionHeight, text: 'Projects', ref: 'projects' },
        { x: (canvasWidth * .49) - (optionWidth / 2), y: optionY, width: optionWidth, height: optionHeight, text: 'Blogs', ref: 'blogs' },
        { x: (canvasWidth * .82) - (optionWidth / 2), y: optionY, width: optionWidth, height: optionHeight, text: 'Scenes', ref: 'scenes' },
    ];
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

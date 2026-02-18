let opacity = 1;

let characterGrid;
let lastTime = 0;

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
            characterGrid.coordinates.push({ x: 0, y: 0, value: '0' });
            characterGrid.coordinates.push({ x: 0, y: characterGrid.height, value: '0' });
            characterGrid.coordinates.push({ x: characterGrid.width, y: 0, value: '0' });
            characterGrid.coordinates.push({ x: characterGrid.width, y: characterGrid.height, value: '0' });
            characterGrid.coordinates.push({ x: Math.floor(characterGrid.width / 2), y: Math.floor(characterGrid.height / 2), value: '0' });
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

export function stopAnimation() {
    console.log('Starting animation')
    opacity = 1;
}

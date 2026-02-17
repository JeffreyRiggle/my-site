let opacity = 1;
let displayText = '100111001';

export function startAnimation() {
    console.log('Starting animation');
    opacity = 1;
    const canvas = document.getElementById('home-animation');

    // TODO: Do something much better
    setInterval(() => {
        const updateIndex = Math.floor(Math.random() * displayText.length);
        let isOn = displayText[updateIndex] == '1';
        displayText = displayText.substring(0, updateIndex) + (isOn ? '0' : '1') + displayText.substring(updateIndex + 1, displayText.length);
    }, 300);
    runAnimationLoop(canvas);
}

function runAnimationLoop(canvas) {
    requestAnimationFrame(() => {
        if (opacity > 0) {
            opacity -= .0075;
            document.body.style.setProperty('--home-opacity', opacity);
            document.body.style.setProperty('--animation-opacity', Math.min(1, 1 - opacity));
        }
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);


        const fillSize = context.measureText(displayText).width;
        context.fillStyle = '#00a14b';
        context.fillText(displayText, (canvas.width / 2) - (fillSize / 2), canvas.height / 2);
        runAnimationLoop(canvas);
    });
}

export function stopAnimation() {
    console.log('Starting animation')
    opacity = 1;
}

export function startAnimation() {
    console.log('Starting animation')
    const canvas = document.getElementById('home-animation');

    const context = canvas.getContext('2d');
    // TODO actually animate
    context.fillStyle = "green";
    context.fillRect(10, 10, 100, 100);
};

export function stopAnimation() {
    console.log('Starting animation')
}
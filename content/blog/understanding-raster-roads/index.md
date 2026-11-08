---
title: 'Understanding Pseudo-3D Roads'
date: '2026-10-02'
---

> "Not hearing is not as good as hearing, hearing is not as good as seeing, seeing is not as good as knowing, knowing is not as good as acting; true learning continues until it is put into action."
> - Xunzi

Personally action is realized by writing. My only goal here is learning. While I hope you read along I want it to be known that this work is completely derivative. If you want to learn this topic without derivation I would recommend reading [Lou's Pseudo 3D Page](https://www.extentofthejam.com/pseudo/index.html) then [How to build a racing game](https://jakesgordon.com/writing/javascript-racer/). I am 14 years behind a fad which was 30 years behind the origin of a technique.

## Setting the foundation

Recently I have been trying to understand 3D projection in a 2D space. This is an idea that has been around for quite some time and has been used in many games over the years. Most modern games use engines, frameworks, or libraries that hide the intricacies of the solution. I wanted to peak behind the curtain.

The common techniques I have seen so far are perspective projection, rasterization, and ray tracing. This blog is mostly concerned with perspective projection  as well as a sprinkle of rasterization. Over time we will build increasing layers of complexity on a projected road. At many points throughout this blog I will have interactive demos that you can run by hitting the play button. With that aside let's dive in.

## Scan line Rendering

The simplest road is just two straight lines vanishing once you reach the horizon. Think of the road as having some distance with a focal center point. Then we can draw the road one scan line at a time. This equates to computing the left and right x values for each line of y.

Now the only problem is how do we get the correct x value for each y? For this we need to know how to draw a three dimensional point in a two dimensional space.

The effect of distance can be created by making objects appear further away from the screen by changing their y position. Using the law of similar triangles we can determine by how much to move the position of the object along the y-axis. To do this we need to introduce a camera and use the following equation.

Now to put this all together we can create a simple animation loop. In this loop we walk all values of y from the bottom of the screen to the horizon and we project our left and right points using the `projectionScale` the relative position of `y` and the fixed camera position `cameraZ`. Fine you caught me they are not points they are 8px horizontal lines to make the road more defined.

```javascript
addEventListener('load', () => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    const canvasWidth = canvas.width = window.innerWidth;
    const canvasHeight = canvas.height = window.innerHeight;
    const canvasMiddle = roadMiddle = maxRoadWidth = canvasWidth / 2;
    const horizon = canvasHeight / 2;
    const projectionScale = canvasHeight - horizon;
    const roadGutterWidth = 8;
    const cameraZ = 1;
    const cameraHeight = 1;

    function run() {
        requestAnimationFrame(() => {
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let y = canvasHeight; y > horizon; y--) {
                const z = (projectionScale * cameraHeight) / (y - horizon);
                const left = roadMiddle - (maxRoadWidth / z);
                const right = roadMiddle + (maxRoadWidth / z);

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
            }
        });
    }
    run();
});
```

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = roadMiddle = maxRoadWidth = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const roadGutterWidth = 8; const cameraZ = 1; const cameraHeight = 1; function run() { requestAnimationFrame(() => { context.clearRect(0, 0, canvasWidth, canvasHeight); for (let y = canvasHeight; y > horizon; y--) { const z = (projectionScale * cameraHeight) / (y - horizon); const left = roadMiddle - (maxRoadWidth / z); const right = roadMiddle + (maxRoadWidth / z); context.beginPath(); context.moveTo(left, y); context.lineTo(left + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); context.beginPath(); context.moveTo(right, y); context.lineTo(right + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); } }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

I want to reiterate that we are walking each line of y one pixel at a time. Depending on your history, intuition might prevent you from realizing that you can easily draw ~1000 line segments multiple times a second. Doing this you should be easily be able to hit a frame rate consistent with your monitors refresh rate.

## Sprucing it up a bit

Now let's imagine we are looking at the road from the perspective of the inside of a car. Notice how it would be impossible to tell if we are moving? This is because there is no variation in the road nor any projected objects. To see motion on lets add some texture to the road. The easiest way to do this is to draw horizonal lines on either side of the road as visual makers. These effectively create road segments that the camera could progress through.

To make this work we now need to compute if a position of y would fall on a segment boundary. If it does we will extend our horizonal line to the far left and right edges of the screen. However we need to decide where these segment boundaries are. The easiest way I have found to do this is to draw an edge is by considering your current and next z values. If your current line is below the next line by more than one integer value then its time to draw a segment.

```javascript
addEventListener('load', () => {
    // Truncated
    const segments = Math.round(projectionScale);

    function run() {
        // Truncated
        requestAnimationFrame(() => {
            for (let y = canvasHeight; y > horizon; y--) {
                // Truncated
                const nextZ = y > horizon + 1 ? (projectionScale * cameraHeight) / (y - 1 - horizon) : Infinity;
                const segmentBoundary = Math.ceil(z);
                const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ;
                
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
        });
    }
    run();
});
```

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; const cameraZ = 1; const cameraHeight = 1; function run() { requestAnimationFrame(() => { context.clearRect(0, 0, canvasWidth, canvasHeight); for (let y = canvasHeight; y > horizon; y--) { const z = (projectionScale * cameraHeight) / (y - horizon); const nextZ = y > horizon + 1 ? (projectionScale * cameraHeight) / (y - 1 - horizon) : Infinity; const roadMiddle = canvasMiddle; const left = roadMiddle - (maxRoadWidth / z); const right = roadMiddle + (maxRoadWidth / z); const segmentBoundary = Math.ceil(z); const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ; context.beginPath(); context.moveTo(!onSegment ? left : 0, y); context.lineTo(left, y); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(left, y); context.lineTo(left + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); context.beginPath(); context.moveTo(right, y); context.lineTo(right + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); if (onSegment) { context.beginPath(); context.moveTo(right + roadGutterWidth, y); context.lineTo(canvasWidth, y); context.strokeStyle = \'green\'; context.stroke(); } } }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

Now we can see a road that is projecting out into the distance and has some markers to make motion more obvious. The only problem is we have no motion.

## Let there be motion

To get moving we are going to need to start using that camera. As you move the camera across the screen you need to adjust how the segments are drawn. If the camera moved one full segment per frame there would be no noticable movement. Because of this we need to make sure the camera only move a fraction of the distance between z values and adjust our scan lines accordingly.

Moving the camera requires us to adjust the camera position on each render frame. However not all computers have the same processing power and not all monitors have the same refresh rate. So, if we want a consistent experience we need to account for time. There are a few ways of doing this but I have found the easiest way to do this in the browser is with a variable frame rate and a delta time modifier.

```javascript
let cameraZ = 0;
let lastTime;

function run() {
    requestAnimationFrame((time) => {
        const dt = time - (lastTime ?? time);
        cameraZ += .0025 * dt; // .0025 is a completely arbirary number because I liked how it looked
        lastTime = time;
        
        // Truncated
    });
}
```

Now the first time around I had my equation wrong and when I updated the cameraZ update I was getting an odd effect. Instead of just correcting the article I decided it was worthwhile to show the mistake and show the impact of that mistake. Originally the equation I was using projected the z value incorrectly. With this incorrect calcuation the result was a zoom out effect on the road. The following is the diff to show what I got wrong.

```diff
-   const z = (projectionScale * cameraHeight) / (y - horizon) * cameraZ;
-   const nextZ = y > horizon + 1 ? (projectionScale * cameraHeight) / (y - 1 - horizon) * cameraZ : Infinity;
+   const z = (projectionScale * cameraHeight) / (y - horizon);
+   const nextZ = y > horizon + 1 ? (projectionScale * cameraHeight) / (y - 1 - horizon) : Infinity;
```

Even with this mistake out of the way, if you watch this animation for long enough you would notice that segments start disappearing. Leaving us with nothing more than what looks like our first road. This is happening because we have bounded segments. To deal with this we could grow our segments over time or we could play a little trick with the camera. Instead of moving over all segments we are just going to adjust our position within the first lines by using some modulo math.

![Visualization of camera trick](./camera-trick.png)

```javascript
function run() {
    requestAnimationFrame((time) => {
        // Truncated
        const cameraOffset = cameraZ % 1; // Only move a fraction of a z at any given time

        for (let y = canvasHeight; y > horizon; y--) {
            // Truncated
            const segmentBoundary = Math.ceil(z + cameraOffset);
            const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ + cameraOffset;
            
            // Truncated
        }
    });
}
```

Put all of this together and we have a pretty compelling visualization of moving down a road.

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; let cameraZ = 0; const cameraHeight = 1; let lastTime; function run() { requestAnimationFrame((time) => { let dt = time - (lastTime ?? time); lastTime = time; context.clearRect(0, 0, canvasWidth, canvasHeight); cameraZ += (dt * .0025); const cameraOffset = cameraZ % 1; for (let y = canvasHeight; y > horizon; y--) { const z = (projectionScale * cameraHeight) / (y - horizon); const nextZ = y > horizon + 1 ? (projectionScale * cameraHeight) / (y - 1 - horizon) : Infinity; const roadMiddle = canvasMiddle; const left = roadMiddle - (maxRoadWidth / z); const right = roadMiddle + (maxRoadWidth / z); const segmentBoundary = Math.ceil(z + cameraOffset); const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ + cameraOffset; context.beginPath(); context.moveTo(!onSegment ? left : 0, y); context.lineTo(left, y); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(left, y); context.lineTo(left + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); context.beginPath(); context.moveTo(right, y); context.lineTo(right + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); if (onSegment) { context.beginPath(); context.moveTo(right + roadGutterWidth, y); context.lineTo(canvasWidth, y); context.strokeStyle = \'green\'; context.stroke(); } } run(); }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

## Getting curvy

Now that we have motion wouldn't it be neat if we could create the effect of driving through a turn? Let's take a moment and observe something about how we are rendering each left and right position.

```javascript
const left = roadMiddle - (maxRoadWidth / z);
const right = roadMiddle + (maxRoadWidth / z);
```

Notice how we are positioning the left and right as relative positions of the middle of the road? What if the middle of the road didn't happen to be the middle of the screen but another position? If we moved this value lower the scan line would appear to shift left and higher right.

To make this appear correct we will have to integrate the position over each scan line to create a natural looking curve.

![Road middle integration visualization](./integrate-road-middle.png)

```javascript
const curveAmount = -.004;

let roadMiddle = canvasMiddle;
let deltaX = 0;
for (let y = canvasHeight; y > horizon; y--) {
    deltaX += curveAmount;
    roadMiddle += deltaX;
}
```

This change alone is neat, but now the motion code produces the effect of a neverending curve. To simulate moving out of the curve we can slowely decrease the `curveAmount` over time until we hit zero. This changes the shape of the road over time but produces the effect of moving out of a curve.

```javascript
if (curveAmount != 0) {
    curveAmount += .0000002 * dt;
}
if (curveAmount > 0) {
    curveAmount = 0;
}

let roadMiddle = canvasMiddle;
let deltaX = 0;
for (let y = canvasHeight; y > horizon; y--) {
    deltaX += curveAmount;
    roadMiddle += deltaX;
}
```

Pull in all of those changes and you get to see movement over a single curve.

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; let cameraZ = 0; const cameraHeight = 1; let lastTime; let curveAmount = -.004; function run() { requestAnimationFrame((time) => { let dt = time - (lastTime ?? time); lastTime = time; context.clearRect(0, 0, canvasWidth, canvasHeight); cameraZ += (dt * .0025); if (curveAmount != 0) { curveAmount += .0000002 * dt; } if (curveAmount > 0) { curveAmount = 0; } const cameraOffset = cameraZ % 1; let roadMiddle = canvasMiddle; let dx = 0; for (let y = canvasHeight; y > horizon; y--) { const z = (projectionScale * cameraHeight) / (y - horizon); const nextZ = y > horizon + 1 ? (projectionScale * cameraHeight) / (y - 1 - horizon) : Infinity; dx += curveAmount; roadMiddle += dx; const left = roadMiddle - (maxRoadWidth / z); const right = roadMiddle + (maxRoadWidth / z); const segmentBoundary = Math.ceil(z + cameraOffset); const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ + cameraOffset; context.beginPath(); context.moveTo(!onSegment ? left : 0, y); context.lineTo(left, y); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(left, y); context.lineTo(left + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); context.beginPath(); context.moveTo(right, y); context.lineTo(right + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); if (onSegment) { context.beginPath(); context.moveTo(right + roadGutterWidth, y); context.lineTo(canvasWidth, y); context.strokeStyle = \'green\'; context.stroke(); } } run(); }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

## Changing render strategy

Up until this point we have been rendering a road using scan lines. This has worked out well for us, but once we get to hills it becomes easier to start working with polygons. To add hills and keep the math sane it is easier to walk one segment at a time. Given our current road we could think of each segment as a polygon. However because of our rendering strategy we will instead draw it as individual lines resulting two shapes that resemable a polygon while not being one.

First, to reduce the complexity a bit we are going to walk back some of the complexity. Let's straighten out this road again and focus on the fundamentals from a new perspective.

![Visualization of draw strategy](poly-explain.png)

To make this work we are first going to have to stop iterating over every position of y and instead start iterating over each segment. This is a fairly trival change on the for loop.

```diff
- for (let y = canvasHeight; y > horizon; y--) {
+ for (let segment = 1; segment < segments; segment++) {
```

Now we have to change up the projection math a bit. Instead of just finding a left and a right for each y we now need to find a top y, top left x, top right x, bottom y, bottom left x, and bottom right x. Putthing that all together we get something like this.

```javascript
const topZ = segment + 1 - cameraOffset;
const bottomZ = segment - cameraOffset;

const topY = horizon + (projectionScale * cameraHeight) / topZ;
const bottomY = horizon + (projectionScale * cameraHeight) / bottomZ;
    
const topLeft = roadMiddle - (maxRoadWidth / topZ);
const topRight = roadMiddle + (maxRoadWidth / topZ);
    
const bottomLeft = roadMiddle - (maxRoadWidth / bottomZ);
const bottomRight = roadMiddle + (maxRoadWidth / bottomZ);

const topGutterWidth = roadGutterWidth / topZ;
const bottomGutterWidth = roadGutterWidth / bottomZ;
```

Finally we need to draw those individual segment pieces which will update our line drawing code to be a bit more verbose.

```javascript
// left side
context.beginPath();
context.moveTo(0, topY);
context.lineTo(topLeft - topGutterWidth, topY);
context.strokeStyle = 'green';
context.stroke();

context.beginPath();
context.moveTo(topLeft - topGutterWidth, topY);
context.lineTo(topLeft, topY);
context.lineTo(bottomLeft, bottomY);
context.lineTo(bottomLeft - bottomGutterWidth, bottomY);
context.closePath();
context.fillStyle = 'lightgreen';
context.fill();

context.beginPath();
context.moveTo(bottomLeft - (roadGutterWidth / 2), bottomY);
context.lineTo(0, bottomY);
context.strokeStyle = 'green';
context.stroke();

// right side
context.beginPath();
context.moveTo(canvasWidth, topY);
context.lineTo(topRight + (roadGutterWidth / 2), topY);
context.strokeStyle = 'green';
context.stroke();

context.beginPath();
context.moveTo(topRight - topGutterWidth, topY);
context.lineTo(topRight, topY);
context.lineTo(bottomRight, bottomY);
context.lineTo(bottomRight - bottomGutterWidth, bottomY);
context.closePath();
context.fillStyle = 'lightgreen';
context.fill();

context.beginPath();
context.moveTo(bottomRight + (roadGutterWidth / 2), bottomY);
context.lineTo(canvasWidth, bottomY);
context.strokeStyle = 'green';
context.stroke();
```

Now I could have added some functions and made this a bit easier to understand but I want to show the end result with as little abstraction as possible. This allows us to focus on the exact code required to make this work without hiding any complexity.

For those that are eagle-eyed observers you will notice that this logic fixes a bug we had up until this point. Up until this point we had the gutter be a constant 8px regradless of projection. As I was revisiting this and breaking down the problem into steps I found something I had missed in prior attempts at this.

With all of this we can put this together and get something familiar, a moving road.

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; let cameraZ = 0; const cameraHeight = 1; let lastTime; function run() { requestAnimationFrame((time) => { let dt = time - (lastTime ?? time); lastTime = time; context.clearRect(0, 0, canvasWidth, canvasHeight); cameraZ += (dt * .0025); const cameraOffset = cameraZ % 1; let roadMiddle = canvasMiddle; for (let segment = 1; segment < segments; segment++) { const topZ = segment + 1 - cameraOffset; const bottomZ = segment - cameraOffset; const topY = horizon + (projectionScale * cameraHeight) / topZ; const bottomY = horizon + (projectionScale * cameraHeight) / bottomZ; const topLeft = roadMiddle - (maxRoadWidth / topZ); const topRight = roadMiddle + (maxRoadWidth / topZ); const bottomLeft = roadMiddle - (maxRoadWidth / bottomZ); const bottomRight = roadMiddle + (maxRoadWidth / bottomZ); const topGutterWidth = roadGutterWidth / topZ; const bottomGutterWidth = roadGutterWidth / bottomZ; context.beginPath(); context.moveTo(0, topY); context.lineTo(topLeft - topGutterWidth, topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topLeft - topGutterWidth, topY); context.lineTo(topLeft, topY); context.lineTo(bottomLeft, bottomY); context.lineTo(bottomLeft - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomLeft - (roadGutterWidth / 2), bottomY); context.lineTo(0, bottomY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(canvasWidth, topY); context.lineTo(topRight + (roadGutterWidth / 2), topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topRight - topGutterWidth, topY); context.lineTo(topRight, topY); context.lineTo(bottomRight, bottomY); context.lineTo(bottomRight - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomRight + (roadGutterWidth / 2), bottomY); context.lineTo(canvasWidth, bottomY); context.strokeStyle = \'green\'; context.stroke(); } run(); }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

## Adding those hills

Now that we have changed our rendering strategy we can get around to adding in those hills. Up until this point our equations have assumed the world is flat and that the camera is at a stable y position. Getting hills to work just requires us to compute world y values and incorporate those into our y positioning logic.

First let's generate those world y values, we will take a trivial approach to this much like we did with curves.

```javascript
// Setup arbitrary hill location
const hillStart = 25;
const hillEnd = 100;
// Have hill go up, use a negative number to go down.
const hillAmount = .2;
const segmentHeights = new Array(segments);

// Truncated
let dy = 1;
// fill world heights
for (let i = 0; i < segmentHeights.length; i++) {
    const worldPosition = i + Math.floor(cameraZ);
    if (worldPosition >= hillStart && worldPosition <= hillEnd) {
        dy += hillAmount;
    }

    segmentHeights[i] = dy;
}

// Place camera on top of current segment
const cameraY = segmentHeights[0] + (segmentHeights[1] - segmentHeights[0]) * cameraOffset + cameraHeight;
```

With that in place we just need to touch up our projection logic.

```javascript
const topY = horizon + projectionScale * (cameraY - segmentHeights[segment]) / topZ;
const bottomY = horizon + projectionScale * (cameraY - segmentHeights[segment - 1]) / bottomZ;
```

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; let cameraZ = 0; const cameraHeight = 1; let lastTime; const hillStart = 25; const hillEnd = 100; const hillAmount = .2; const segmentHeights = new Array(segments); function run() { requestAnimationFrame((time) => { let dt = time - (lastTime ?? time); lastTime = time; context.clearRect(0, 0, canvasWidth, canvasHeight); cameraZ += (dt * .0025); const cameraOffset = cameraZ % 1; let roadMiddle = canvasMiddle; let dy = 1; for (let i = 0; i < segmentHeights.length; i++) { const worldPosition = i + Math.floor(cameraZ); if (worldPosition >= hillStart && worldPosition <= hillEnd) { dy += hillAmount; } segmentHeights[i] = dy; } const cameraY = segmentHeights[0] + (segmentHeights[1] - segmentHeights[0]) * cameraOffset + cameraHeight; for (let segment = 2; segment < segments; segment++) { const topZ = segment - cameraOffset; const bottomZ = segment - 1 - cameraOffset; const topY = horizon + projectionScale * (cameraY - segmentHeights[segment]) / topZ; const bottomY = horizon + projectionScale * (cameraY - segmentHeights[segment - 1]) / bottomZ; const topLeft = roadMiddle - (maxRoadWidth / topZ); const topRight = roadMiddle + (maxRoadWidth / topZ); const bottomLeft = roadMiddle - (maxRoadWidth / bottomZ); const bottomRight = roadMiddle + (maxRoadWidth / bottomZ); const topGutterWidth = roadGutterWidth / topZ; const bottomGutterWidth = roadGutterWidth / bottomZ; context.beginPath(); context.moveTo(0, topY); context.lineTo(topLeft - topGutterWidth, topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topLeft - topGutterWidth, topY); context.lineTo(topLeft, topY); context.lineTo(bottomLeft, bottomY); context.lineTo(bottomLeft - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomLeft - (roadGutterWidth / 2), bottomY); context.lineTo(0, bottomY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(canvasWidth, topY); context.lineTo(topRight + (roadGutterWidth / 2), topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topRight - topGutterWidth, topY); context.lineTo(topRight, topY); context.lineTo(bottomRight, bottomY); context.lineTo(bottomRight - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomRight + (roadGutterWidth / 2), bottomY); context.lineTo(canvasWidth, bottomY); context.strokeStyle = \'green\'; context.stroke(); } run(); }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

This is a great start, but if you pay close attention there is a problem on the horizon, there is no horizon. Road segments behind the hill are rendering and it is breaking the illusion.

The first thing we can attempt to do is quite simple. If the segment is has a larger top value than bottom value it is behind a hill and we can skip rendering it.

```javascript
if (topY >= bottomY) continue;
```

However if we change our hill direction from up to down we still have a problem.

```diff
-   const hillAmount = .2;
+   const hillAmount = -.2;
```

Now we can see the road through the hill and we don't want that. We are going to have to start considering world level occlusions. To do this we are going to have to start tracking the topmost y position rendered. As we progress from front to back we can check to make sure that our next polygon is at or below that point. If it is we will render it otherwise we will skip rendering it.

```javascript
let clipY = canvasHeight;
for (let segment = 2; segment < segments; segment++) {
    // Truncated
    
    const segmentTop = Math.min(topY, bottomY);
    if (segmentTop >= clipY)  continue;
    clipY = Math.min(clipY, segmentTop);

    // Truncated
}
```

This alone is a great start but it is incomplete. If we wanted to draw sprites or have a partially occuleded segment then this would not work. To make that work we need to start clipping on every segment. To do that first we need to start saving and restoring our context on every frame.

```javascript
context.save();
for (let segment = 2; segment < segments; segment++) {
    // Truncated
}
context.restore();
```

Once we have that out of the way we can apply our clip as we walk the segments.

```javascript
for (let segment = 2; segment < segments; segment++) {
    // Truncated
    context.beginPath();
    context.rect(0, 0, canvasWidth, Math.max(0, clipY));
    context.clip();
}
```

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; let cameraZ = 0; const cameraHeight = 1; let lastTime; const hillStart = 25; const hillEnd = 100; const hillAmount = -.2; const segmentHeights = new Array(segments); function run() { requestAnimationFrame((time) => { let dt = time - (lastTime ?? time); lastTime = time; context.clearRect(0, 0, canvasWidth, canvasHeight); context.save(); cameraZ += (dt * .0025); const cameraOffset = cameraZ % 1; let roadMiddle = canvasMiddle; let dy = 1; for (let i = 0; i < segmentHeights.length; i++) { const worldPosition = i + Math.floor(cameraZ); if (worldPosition >= hillStart && worldPosition <= hillEnd) { dy += hillAmount; } segmentHeights[i] = dy; } const cameraY = segmentHeights[0] + (segmentHeights[1] - segmentHeights[0]) * cameraOffset + cameraHeight; let clipY = canvasHeight; for (let segment = 2; segment < segments; segment++) { const topZ = segment - cameraOffset; const bottomZ = segment - 1 - cameraOffset; const topY = horizon + projectionScale * (cameraY - segmentHeights[segment]) / topZ; const bottomY = horizon + projectionScale * (cameraY - segmentHeights[segment - 1]) / bottomZ; const segmentTop = Math.min(topY, bottomY); if (segmentTop >= clipY) continue; clipY = Math.min(clipY, segmentTop); const topLeft = roadMiddle - (maxRoadWidth / topZ); const topRight = roadMiddle + (maxRoadWidth / topZ); const bottomLeft = roadMiddle - (maxRoadWidth / bottomZ); const bottomRight = roadMiddle + (maxRoadWidth / bottomZ); const topGutterWidth = roadGutterWidth / topZ; const bottomGutterWidth = roadGutterWidth / bottomZ; context.beginPath(); context.moveTo(0, topY); context.lineTo(topLeft - topGutterWidth, topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topLeft - topGutterWidth, topY); context.lineTo(topLeft, topY); context.lineTo(bottomLeft, bottomY); context.lineTo(bottomLeft - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomLeft - (roadGutterWidth / 2), bottomY); context.lineTo(0, bottomY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(canvasWidth, topY); context.lineTo(topRight + (roadGutterWidth / 2), topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topRight - topGutterWidth, topY); context.lineTo(topRight, topY); context.lineTo(bottomRight, bottomY); context.lineTo(bottomRight - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomRight + (roadGutterWidth / 2), bottomY); context.lineTo(canvasWidth, bottomY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.rect(0, 0, canvasWidth, Math.max(0, clipY)); context.clip(); } context.restore(); run(); }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

## Rolling hills

Now lets add some rolling hills. To do this we can change our world projection logic just a little bit to support many hills instead of a single hill.

```diff
-   const hillStart = 25;
-   const hillEnd = 100;
-   const hillAmount = -.2;
+   const hills = [{ start: 25, end: 100, amount: -.2}, { start: 125, end: 300, amount: .2 }];
```

```diff
-   if (worldPosition >= hillStart && worldPosition <= hillEnd) {
-       dy += hillAmount;
+   const onHill = hills.find(h => worldPosition >= h.start && worldPosition <= h.end);
+   if (onHill) {
+       dy += onHill.amount;
    }
```

Small change but a big impact. However if you are paying close attention, the horizon is giving us problems again. Looking at this road you cannot fully tell if the road is warped or you are about to go over a hill. To address this we can add an exponential fog. This fog allows the hill behind our front most hill to get a shading effect that makes it appear further back.

```javascript
const fogTransmittance = Math.exp(-5 * (segment / segments) ** 2);
if (fogTransmittance < 1) {
    context.globalAlpha = 1 - fogTransmittance;
    context.fillStyle = '#C9B8E8';
    context.fillRect(0, segmentTop, canvasWidth, Math.abs(bottomY - topY));
    context.globalAlpha = 1;
}
```

You put this all together and you get a pretty neat visual effect. Admittedly the fog effect is not as impactful with my choice of black background, green lines and purple shade. Having color on the road would have created a better effect but it would have also changed the aesthetic I was going for with this.

<div style="display: flex; justify-content: center; width: 100%;">
    <iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const projectionScale = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(projectionScale); const roadGutterWidth = 8; let cameraZ = 0; const cameraHeight = 1; let lastTime; const hills = [{ start: 25, end: 100, amount: -.2}, { start: 125, end: 300, amount: .2 }]; const segmentHeights = new Array(segments); function run() { requestAnimationFrame((time) => { let dt = time - (lastTime ?? time); lastTime = time; context.clearRect(0, 0, canvasWidth, canvasHeight); context.save(); cameraZ += (dt * .0025); const cameraOffset = cameraZ % 1; let roadMiddle = canvasMiddle; let dy = 1; for (let i = 0; i < segmentHeights.length; i++) { const worldPosition = i + Math.floor(cameraZ); const onHill = hills.find(h => worldPosition >= h.start && worldPosition <= h.end); if (onHill) { dy += onHill.amount; } segmentHeights[i] = dy; } const cameraY = segmentHeights[0] + (segmentHeights[1] - segmentHeights[0]) * cameraOffset + cameraHeight; let clipY = canvasHeight; for (let segment = 2; segment < segments; segment++) { const topZ = segment - cameraOffset; const bottomZ = segment - 1 - cameraOffset; const topY = horizon + projectionScale * (cameraY - segmentHeights[segment]) / topZ; const bottomY = horizon + projectionScale * (cameraY - segmentHeights[segment - 1]) / bottomZ; const segmentTop = Math.min(topY, bottomY); if (segmentTop >= clipY) continue; clipY = Math.min(clipY, segmentTop); const topLeft = roadMiddle - (maxRoadWidth / topZ); const topRight = roadMiddle + (maxRoadWidth / topZ); const bottomLeft = roadMiddle - (maxRoadWidth / bottomZ); const bottomRight = roadMiddle + (maxRoadWidth / bottomZ); const topGutterWidth = roadGutterWidth / topZ; const bottomGutterWidth = roadGutterWidth / bottomZ; context.beginPath(); context.moveTo(0, topY); context.lineTo(topLeft - topGutterWidth, topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topLeft - topGutterWidth, topY); context.lineTo(topLeft, topY); context.lineTo(bottomLeft, bottomY); context.lineTo(bottomLeft - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomLeft - (roadGutterWidth / 2), bottomY); context.lineTo(0, bottomY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(canvasWidth, topY); context.lineTo(topRight + (roadGutterWidth / 2), topY); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(topRight - topGutterWidth, topY); context.lineTo(topRight, topY); context.lineTo(bottomRight, bottomY); context.lineTo(bottomRight - bottomGutterWidth, bottomY); context.closePath(); context.fillStyle = \'lightgreen\'; context.fill(); context.beginPath(); context.moveTo(bottomRight + (roadGutterWidth / 2), bottomY); context.lineTo(canvasWidth, bottomY); context.strokeStyle = \'green\'; context.stroke(); const fogTransmittance = Math.exp(-5 * (segment / segments) ** 2); if (fogTransmittance < 1) { context.globalAlpha = 1 - fogTransmittance; context.fillStyle = \'#C9B8E8\'; context.fillRect(0, segmentTop, canvasWidth, Math.abs(bottomY - topY)); context.globalAlpha = 1; } context.beginPath(); context.rect(0, 0, canvasWidth, Math.max(0, clipY)); context.clip(); } context.restore(); run(); }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>
</div>

## Conclusion

If you made it this far thank you for reading my attempt to refine my own learning on this subject. As far as I can tell this is a baby step into understanding how 3D rendering works in practice done on a 2D canvas. Topics like rotation of polygons and ray tracing would be logical follow ons which I may investigate at some future point. Admittedly these set of topics is well out of my typical skill set and I might have misrepresented some concepts but I sure had fun doing it.
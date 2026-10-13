---
title: 'Faking 3d roads'
date: '2026-10-02'
---

> "Not hearing is not as good as hearing, hearing is not as good as seeing, seeing is not as good as knowing, knowing is not as good as acting; true learning continues until it is put into action."
> - Xunzi

For me action is realized by writing and the goal here is my personal learning. This work is completely derivative. If you want to learn this topic without derivation I would recommend reading [Lou's Pseudo 3D Page](https://www.extentofthejam.com/pseudo/index.html) then [How to build a racing game](https://jakesgordon.com/writing/javascript-racer/). Admittedly I am 14 years behind a fad which was 30 years behind the origin of a technique.

## Setting the foundation

Recently I have been building an understanding of 3D projection in a 2D space. This is an idea that has been around for quite some time and has been used in many games over the years. Most modern games use engines, frameworks, or libraries that hide the intricacies of the solution. I wanted to peak behind the curtain.

The common approaches I have found focus on rasterization and ray tracing techinques. I will be focusing on the rasterization technique as it was the easiest for me to understand.

## Scan lines

For the simplest road we can just use scan line rasterization. Think of the road as having some distance with a focal center point. Then we can draw the road one scan line at a time. This equates to computing the left and right x values for each line of y.

To figure out the correct x value for each y we are going to have to figure out how to draw a three dimensional point in a two dimensional space. If we were to look at the road from the top down then we wouldn't have to move x at all. However in our case we want to look out to a horizon and that requires x to be offset by some z value to create the effect of distance.

The effect of distance can be created by making objects appear further away from the screen by changing their y position. Using the law of similar triangles we can determine by how much to move the position of the object along the y-axis. To do this we need to introduce a camera and use the following equation.

```javascript
const y = cameraHeight * distanceFromCameraToScreen / distanceFromCameraToObject;

// However we want to render line by line going along y so lets compute the distance instead
let distanceFromCameraToObject = y / cameraHeight * distanceFromCameraToScreen;

// oops I lied, one last alteration since we don't want anything above a horizon
distanceFromCameraToObject = (y - horizon) / cameraHeight * distanceFromCameraToScreen;

// Now to project some x from a fixed y we will pull it all together
const x = worldX * distanceFromCameraToScreen / distanceFromCameraToObject
```

In case you are wondering where the law of similar triangles is coming into play, there are two triangles here. The first is a triangle from the camera to the screen and the second is the screen to the object. The second triangle is a projection of the first adding the depth to the object.

```javascript
addEventListener('load', () => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    const canvasWidth = canvas.width = window.innerWidth;
    const canvasHeight = canvas.height = window.innerHeight;
    const canvasMiddle = roadMiddle = maxRoadWidth = canvasWidth / 2;
    const horizon = canvasHeight / 2;
    const roadDistance = canvasHeight - horizon;
    const roadGutterWidth = 8;
    const distanceFromCameraToScreen = 1;

    function run() {
        requestAnimationFrame(() => {
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let y = canvasHeight; y > horizon; y--) {
                const z = roadDistance / (y - horizon) * distanceFromCameraToScreen;
                const nextZ = y > horizon + 1 ? roadDistance / (y - 1 - horizon) : Infinity;
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

            run();
        });
    }
    run();
});
```

<iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = roadMiddle = maxRoadWidth = canvasWidth / 2; const horizon = canvasHeight / 2; const roadDistance = canvasHeight - horizon; const roadGutterWidth = 8; const distanceFromCameraToScreen = 1; function run() { requestAnimationFrame(() => { context.clearRect(0, 0, canvasWidth, canvasHeight); for (let y = canvasHeight; y > horizon; y--) { const z = roadDistance / (y - horizon) * distanceFromCameraToScreen; const nextZ = y > horizon + 1 ? roadDistance / (y - 1 - horizon) : Infinity; const left = roadMiddle - (maxRoadWidth / z); const right = roadMiddle + (maxRoadWidth / z); context.beginPath(); context.moveTo(left, y); context.lineTo(left + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); context.beginPath(); context.moveTo(right, y); context.lineTo(right + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); } }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>

Notice how we are walking each line of y one pixel at a time. Depending on your history, intuition might prevent you from realizing that you can easily draw ~1000 line segments multiple times a second. Doing this you should be easily be able to hit a frame rate consistent with your monitors refresh rate.


## Sprucing it up a bit

If we imagine we are looking at the road from the perspective of the inside of a car, it would be impossible to tell if we are moving. To see motion on lets add some texture to the road. The easiest way to do this is to draw horizonal lines on either side of the road as visual makers. These effectively create road segments that the camera could progress through.

```javascript
addEventListener('load', () => {
    // Same old stuff
    const segments = Math.round(roadDistance);

    function run() {
        requestAnimationFrame(() => {
                    
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let y = canvasHeight; y > horizon; y--) {
                const z = roadDistance / (y - horizon) * distanceFromCameraToScreen;
                const nextZ = y > horizon + 1 ? roadDistance / (y - 1 - horizon) : Infinity;
                const roadMiddle = canvasMiddle;
                const left = roadMiddle - (maxRoadWidth / z);
                const right = roadMiddle + (maxRoadWidth / z);
                
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

            run();
        });
    }
    run();
});
```

<iframe height="400" width="600" style="border:none" srcdoc="<html> <head> <style> body { margin: 0; display: grid; place-items: center; width: 600px; height: 400px; } button { padding:8px; color:green; background-color:black; margin:auto auto; border:none; } </style> <script> function onClick() { document.querySelector('button').remove(); const ifr = document.createElement('iframe'); ifr.width='600px'; ifr.height='400px'; ifr.style.border='none'; ifr.srcdoc = '<html> <head> <style> body { margin: 0; background-color: black; } </style> <script type=\'text/javascript\'> addEventListener(\'load\', () => { let canvas = document.getElementById(\'canvas\'); let context = canvas.getContext(\'2d\'); const canvasWidth = canvas.width = window.innerWidth; const canvasHeight = canvas.height = window.innerHeight; const canvasMiddle = canvasWidth / 2; const horizon = canvasHeight / 2; const roadDistance = canvasHeight - horizon; const maxRoadWidth = canvasWidth / 2; const segments = Math.round(roadDistance); const roadGutterWidth = 8; function run() { requestAnimationFrame(() => { context.clearRect(0, 0, canvasWidth, canvasHeight); for (let y = canvasHeight; y > horizon; y--) { const z = roadDistance / (y - horizon); const nextZ = y > horizon + 1 ? roadDistance / (y - 1 - horizon) : Infinity; const roadMiddle = canvasMiddle; const left = roadMiddle - (maxRoadWidth / z); const right = roadMiddle + (maxRoadWidth / z); const segmentBoundary = Math.ceil(z); const onSegment = segmentBoundary <= segments && segmentBoundary < nextZ; context.beginPath(); context.moveTo(!onSegment ? left : 0, y); context.lineTo(left, y); context.strokeStyle = \'green\'; context.stroke(); context.beginPath(); context.moveTo(left, y); context.lineTo(left + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); context.beginPath(); context.moveTo(right, y); context.lineTo(right + roadGutterWidth, y); context.strokeStyle = \'lightgreen\'; context.stroke(); if (onSegment) { context.beginPath(); context.moveTo(right + roadGutterWidth, y); context.lineTo(canvasWidth, y); context.strokeStyle = \'green\'; context.stroke(); } } }); } run(); }); <\/script> </head> <body> <canvas id=\'canvas\'></canvas> </body></html>'; document.body.appendChild(ifr); } </script> </head> <body> <button onclick='onClick()'>Play</button> </body></html>"></iframe>

## Let there be motion

At this point we have a passable road with the illusion of depth but no motion. To get that going we are going to need to start using a camera. As you move the camera across the screen you need to move the segments as well. If you just jumped one full segment per frame there would be no noticable movement. Because of this we need to make sure the camera only move a fraction of the distance between z values and adjust our scan lines accordingly.

TODO
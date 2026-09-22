---
title: 'Moving green boxes'
date: '2026-09-14'
---

Insipred by one of my satirical blog posts, I decided to do a more detailed evaluation of the methods. If you haven't read it and appreciate satirical work I would point you [here](https://dev.to/jeffrey_riggle_e261fba011/do-you-even-render-bro-2bh2).

For those that haven't read it, the premise is take a simple animation and recreate many layers of complexity to do a similar animation.

All performance metrics provided in this blog are rough observations based on Google Chrome's task manager. They do not show strong evidence but rather provide the directional impact of each change.

## Humble beginnings

The article starts off with close to the most basic version of an animation you would want. Using CSS and two DOM nodes it creates the effect of a green square sliding back and forth on the screen. This is the standard and idiomatic way to do animations in the web. Likely the biggest debate would be the use of multiple properties instead of a single property for the animation.

As a baseline we are using ~20MB of memory and ~5% CPU.

<details>
	<summary>Basic animation code</summary>

```html
<html>
	<head>
		<style>
			body {
				margin: 0;
				display: grid;
				place-items: center;
			}

			#container {
				background-color: black;
				margin: auto auto;
				height: 600px;
				width: 800px;
			}

			#box {
				width: 100px;
				height: 100px;
				margin-top: 250px;
				background-color: green;
				animation-duration: 4s;
				animation-name: slide;
				animation-iteration-count: infinite;
			}

			@keyframes slide {
				0% {
					translate: 0 0;
				}
				50% {
					translate: 700px 0;
				}
				100% {
					translate: 0 0;
				}
			}
		</style>
	</head>
	<body>
		<div id="container"><div id="box"/></div>
	</body>
</html>
```
</details>


<iframe height="600" width="800" srcdoc="<html><head><style>body{margin: 0;display: grid;place-items: center;width:800px;height:600px;}button{padding:8px;color:green;background-color:black;margin:auto auto;border:none;}</style><script>function onClick() { document.querySelector('button').remove();const ifr = document.createElement('iframe'); ifr.width='800px';ifr.height='600px';ifr.srcdoc = '<html><head><style>body {margin: 0;display: grid;place-items: center;}#container {background-color: black;margin: auto auto;height: 600px;width: 800px;}#box {width: 100px;height: 100px;margin-top: 250px;background-color: green;animation-duration: 4s;animation-name: slide;animation-iteration-count: infinite;}@keyframes slide {0% {translate: 0 0;}50% {translate: 700px 0;}100% {translate: 0 0;}}</style></head><body><div id=\'container\'><div id=\'box\'/></div></body></html>';document.body.appendChild(ifr);}</script></head><body><button onclick='onClick()'>Play</button></body></html>"></iframe>

## Positioning elements

This is the first jump in complexity. While I wish I could say I have never seen anything like this, that would be a lie. Here we start taking a bit more control over the animation by moving the DOM elements manually. This is done by putting an absolute positioned element inside of a relative positioned container and moving the left property on the element for every animation frame.

By moving this animation to V8 and leveraging the left property we effectively made our animation span multiple components. What used to just be able to run in the compositor path now has to span V8, Blink's layout engine, and the compositor. This adds notable overhead to the solution.

Also notibly this has a few visual regressions. If you pay close attention the previous animation had an easing effect that is lost in this one. Additionally this animation is now frame rate dependant. If you don't hit 120 frames per second it will look like a massive slow down. In order to recapture these effects we would have to start tracking delta time and managing things like velocity and acceleration.

At this point we see our CPU usage jump to around 12% and memory around 22MB. This is a notable change but far from significant.

<details>
	<summary>Manual Positioning code</summary>

```html
<html>
	<head>
		<style>
			body {
				margin: 0;
				display: grid;
				place-items: center;
			}
			#container {
				background-color: black;
				margin: auto auto;
				height: 600px;
				width: 800px;
				position: relative;
			}
			#box {
				width: 100px;
				height: 100px;
				background-color: green;
				position: absolute;
				top: 250px;
				left: 0px;
			}
		</style>
		<script>
			window.addEventListener('load', () => {
				let target = document.getElementById('box');
				let left = 0;
				let direction = 1;

				function runAnimation() {
					requestAnimationFrame(() => {
						left = left + (2.9 * direction);
						if (left >= 700) {
							direction = -1;
						} else if (left <= 0) {
							direction = 1;
						}

						target.style.setProperty('left', `${left}px`);
						runAnimation();
					});
				}
				runAnimation();
			});
		</script>
	</head>
	<body>
		<div id="container"><div id="box"/></div>
	</body>
</html>
```

</details>

<iframe height="600" width="800" srcdoc="<html><head><style>body{margin: 0;display: grid;place-items: center;width:800px;height:600px;}button{padding:8px;color:green;background-color:black;margin:auto auto;border:none;}</style><script>function onClick() { document.querySelector('button').remove();const ifr = document.createElement('iframe'); ifr.width='800px';ifr.height='600px';ifr.srcdoc = '<html><head><style>body {margin: 0;display: grid;place-items: center;}#container {background-color: black;margin: auto auto;height: 600px;width: 800px;position: relative;}#box {width: 100px;height: 100px;background-color: green;position: absolute;top: 250px;left: 0px;}</style><script>window.addEventListener(\'load\', () => {let target = document.getElementById(\'box\');let left = 0;let direction = 1;function runAnimation() {requestAnimationFrame(() => {left = left + (2.9 * direction);if (left >= 700) {direction = -1;} else if (left <= 0) {direction = 1;}target.style.setProperty(\'left\', left + \'px\');runAnimation();});}runAnimation();});<\/script></head><body><div id=\'container\'><div id=\'box\'/></div></body></html>';document.body.appendChild(ifr); }</script></head><body><button onclick='onClick()'>Play</button></body></html>"></iframe>

## Transitioning to Canvas

The next jump in complexity takes traditional layout using the DOM and CSS out of the equation. We are no longer moving an abstract layout element across the screen. Instead we are leveraging animation frames to paint each new frame using a 2D Canvas. This is a fairly common use API if you are doing some highly interactive UX such as: creating a interactive chart, visualizing a graph, creating a drawing program, or building a game. In this case it is clearly overkill.

Now we are interacting with the compositor in a new way. Now we are drawing on a virtual canvas through a 2d context that translate to calls into Chromium and [skia](https://skia.org/) paint operations. These operations include things like drawing rectangles and lines. These operations get recorded and rasterized in the resource backing the canvas element. That backing is then passed over to the compositor for rendering on the screen.

The results this time around had been ~15% CPU and ~24MB almost the same as the last solution.

<details>
	<summary>Canvas code</summary>

```html
<html>
	<head>
		<style>
			body {
				margin: 0;
				display: grid;
				place-items: center;
			}

			#container {
				background-color: black;
				margin: auto auto;
			}
		</style>
		<script>
			window.addEventListener('load', () => {
				let left = 0;
				let direction = 1;
				let canvas = document.getElementById('container');
				let context = canvas.getContext('2d');
				function runAnimation() {
					requestAnimationFrame(() => {
						left = left + (2.9 * direction);
						if (left >= 700) {
							direction = -1;
						} else if (left <= 0) {
							direction = 1;
						}

						context.clearRect(0, 0, 800, 600);
						context.fillStyle = 'green';
						context.fillRect(left, 250, 100, 100);
						runAnimation();
					});
				}
				runAnimation();
			});
		</script>
	</head>
	<body>
		<canvas id="container" width="800px" height="600px"></canvas>
	</body>
</html>
```

</details>

<iframe height="600" width="800" srcdoc="<html><head><style>body{margin: 0;display: grid;place-items: center;width:800px;height:600px;}button{padding:8px;color:green;background-color:black;margin:auto auto;border:none;}</style><script>function onClick() { document.querySelector('button').remove();const ifr = document.createElement('iframe'); ifr.width='800px';ifr.height='600px';ifr.srcdoc = '<html><head><style>body {margin: 0;display: grid;place-items: center;}#container {background-color: black;margin: auto auto;}</style><script>window.addEventListener(\'load\', () => {let left = 0;let direction = 1;let canvas = document.getElementById(\'container\');let context = canvas.getContext(\'2d\');function runAnimation() {requestAnimationFrame(() => {left = left + (2.9 * direction);if (left >= 700) {direction = -1;} else if (left <= 0) {direction = 1;}context.clearRect(0, 0, 800, 600);context.fillStyle = \'green\';context.fillRect(left, 250, 100, 100);runAnimation();});}runAnimation();});<\/script></head><body><canvas id=\'container\' width=\'800px\' height=\'600px\'></canvas></body></html>';document.body.appendChild(ifr);}</script></head><body><button onclick='onClick()'>Play</button></body></html>"></iframe>

## Dynamic Bitmap generation

The next step in complexity completely left the realm of rational thinking. The rendering process has been replaced with per frame bitmap generation. Humorously this creates a crude implementation similar to the internal machinery Chrome's compositor has. This is clearly not a good idea for multiple reasons. First, we are mimicing, poorly at that, the internal machinery of Chromium in JavaScript. Second, we are causing additional memory copies as the image data goes uncompressed through multiple layers of the system.

To make this work a large array is generated for the bitmap. Then the bits of each pixel are updated on each animation frame. Originally I had this generate a new data array on each frame but that created notable lag. Turns out generating 1.92 MB of array data on every frame in JavaScript isn't a great idea. Believe it or not allocations still matter even in JavaScript. This was only part of the problem. Since there is no "put bytes" type API for image tags you have to get a bit creative to render a new bitmap on every frame. To get around this we generate a new base64 encoded string over that 1.92 MB of array data and update the image source to that.

To put this into perspective on every frame we set 1,920,000 elements in an array to 0. Then fill 40,000 elements with a green color. This then needs to be converted to a base64 string and finally the string is set as the source of an image tag. The image tag then has to read that base64 string convert it back to a bitmap and render it.

What is beyond shocking to me is that on my machine this animation still runs smoothly. However this comes at a cost. We see massive jump in CPU and memory consumption. What was taking ~20MB of Memory jumped to around 1GB of memory consumption and CPU usage jumped to ~50%.

<details>
	<sumamry>Bitmap code</summary>

```html
<html>
	<head>
		<style>
			body {
				margin: 0;
				display: grid;
				place-items: center;
			}

			#container {
				margin: auto auto;
			}
		</style>
		<script>
			window.addEventListener('load', () => {
				let left = 0;
				let direction = 1;
				const width = 800;
				const height = 600;
				const imageDataSize = 4 * width * height;  

				const imageHeader = [
					0x42, 0x4D,
					0x36, 0x4C, 0x1D, 0x00,
					0x00, 0x00,
					0x00, 0x00,
					0x36, 0x00, 0x00, 0x00
				];
				const infoHeader = [
					0x28, 0x00, 0x00, 0x00,
					0x20, 0x03, 0x00, 0x00,
					0x58, 0x02, 0x00, 0x00,
					0x01, 0x00,
					0x20, 0x00,
					0x00, 0x00, 0x00, 0x00,
					0x00, 0x00, 0x00, 0x00,
					0x00, 0x00, 0x00, 0x00,
					0x00, 0x00, 0x00, 0x00,
					0x00, 0x00, 0x00, 0x00,
					0x00, 0x00, 0x00, 0x00
				];
				let dataOffset = imageHeader.length + infoHeader.length;
				let data = new Array(imageDataSize + dataOffset);
			
				for (let i = 0; i < imageHeader.length; i++) {
					data[i] = imageHeader[i];
				}
				for (let i = 0; i < infoHeader.length; i++) {
					data[i + imageHeader.length] = infoHeader[i];
				}

				clearImage(data);
				const imgEl = document.getElementById('container');

				function clearImage(data) {
					for (let y = 0; y < height; y++) {
						let pitch = y * width;
						for (let x = 0; x < width; x++) {
							const offset = ((pitch + x) * 4) + dataOffset;
							data[offset] = 0;
							data[offset + 1] = 0;
							data[offset + 2] = 0;
							data[offset + 3] = 0;
						}
					}
				}  

				function drawRect(data, x, y, rWidth, rHeight, red, green, blue) {
					for (let dy = 0; dy < rHeight; dy++) {
						const pitch = (y + dy) * width;
						for (let dx = 0; dx < rWidth; dx++) {
							const offset = ((pitch + dx + x) * 4) + dataOffset;
							data[offset] = blue;
							data[offset + 1] = green;
							data[offset + 2] = red;
							data[offset + 3] = 0;
						}
					}
				}
				function updateImage(imgEl, imageHeader, infoHeader, data) {
					let imageData = new Uint8Array(data);
					imgEl.src = `data:image/bmp;base64,${imageData.toBase64()}`;
				} 

				function runAnimation() {
					requestAnimationFrame(() => {
						left = left + (2.9 * direction);
						if (left >= 700) {
							direction = -1;
						} else if (left <= 0) {
							direction = 1;
						}

						clearImage(data);
						drawRect(data, Math.round(left), 250, 100, 100, 0, 128, 0);
						updateImage(imgEl, imageHeader, infoHeader, data);
						runAnimation();
					});
				}
				runAnimation();
			});
		</script>
	</head>
	<body>
		<img id="container" width="800px" height="600px" />
	</body>
</html>
```

</details>

<iframe height="600" width="800" srcdoc="<html><head><style>body{margin: 0;display: grid;place-items: center;width:800px;height:600px;}button{padding:8px;color:green;background-color:black;margin:auto auto;border:none;}</style><script>function onClick() { document.querySelector('button').remove();const ifr = document.createElement('iframe'); ifr.width='800px';ifr.height='600px';ifr.srcdoc = '<html><head><style>body {margin: 0;display: grid;place-items: center;}#container {margin: auto auto;}</style><script>window.addEventListener(\'load\', () => {let left = 0;let direction = 1;const width = 800;const height = 600;const imageDataSize = 4 * width * height;const imageHeader = [0x42, 0x4D,0x36, 0x4C, 0x1D, 0x00,0x00, 0x00,0x00, 0x00,0x36, 0x00, 0x00, 0x00];const infoHeader = [0x28, 0x00, 0x00, 0x00,0x20, 0x03, 0x00, 0x00,0x58, 0x02, 0x00, 0x00,0x01, 0x00,0x20, 0x00,0x00, 0x00, 0x00, 0x00,0x00, 0x00, 0x00, 0x00,0x00, 0x00, 0x00, 0x00,0x00, 0x00, 0x00, 0x00,0x00, 0x00, 0x00, 0x00,0x00, 0x00, 0x00, 0x00];let dataOffset = imageHeader.length + infoHeader.length;let data = new Array(imageDataSize + dataOffset);for (let i = 0; i < imageHeader.length; i++) {data[i] = imageHeader[i];}for (let i = 0; i < infoHeader.length; i++) {data[i + imageHeader.length] = infoHeader[i];}clearImage(data);const imgEl = document.getElementById(\'container\');function clearImage(data) {for (let y = 0; y < height; y++) {let pitch = y * width;for (let x = 0; x < width; x++) {const offset = ((pitch + x) * 4) + dataOffset;data[offset] = 0;data[offset + 1] = 0;data[offset + 2] = 0;data[offset + 3] = 0;}}}function drawRect(data, x, y, rWidth, rHeight, red, green, blue) {for (let dy = 0; dy < rHeight; dy++) {const pitch = (y + dy) * width;for (let dx = 0; dx < rWidth; dx++) {const offset = ((pitch + dx + x) * 4) + dataOffset;data[offset] = blue;data[offset + 1] = green;data[offset + 2] = red;data[offset + 3] = 0;}}}function updateImage(imgEl, imageHeader, infoHeader, data) {let imageData = new Uint8Array(data);imgEl.src = `data:image/bmp;base64,${imageData.toBase64()}`;}function runAnimation() {requestAnimationFrame(() => {left = left + (2.9 * direction);if (left >= 700) {direction = -1;} else if (left <= 0) {direction = 1;}clearImage(data);drawRect(data, Math.round(left), 250, 100, 100, 0, 128, 0);updateImage(imgEl, imageHeader, infoHeader, data);runAnimation();});}runAnimation();});<\/script></head><body><img id=\'container\' width=\'800px\' height=\'600px\' /></body></html>';document.body.appendChild(ifr);}</script></head><body><button onclick='onClick()'>Play</button></body></html>"></iframe>

## Adding a C Server

I was about to stop at the last step but I wanted to push this to the absolute extreme. Where I landed was a clear misuse of a client server architecture.

To make this abusive next step I had a simple C HTTP server that hosted an HTML asset on one path and a dynamically generated image on the other. This approach opted for no JavaScript. Once again to produce the animation effect we had to get creative. To pull this off the HTML asset would refresh multiple times a second by using a meta tag with a refresh equivilent.

<details>
	<summary>Crazy Refresh</summart>

```html
<html>
	<head>
		<meta http-equiv="Refresh" content=".05"/>
		<style>
			body {
				margin: 0;
				display: grid;
				place-items: center;
			}

			#container {
				margin: auto auto;
			}
		</style>
	</head>
	<body>
		<img src="/img" id="container" width="800px" height="600px" />
	</body>
</html>
```

</details>

The end result did produce an animation but it had one heck of a strobe effect. Since I do not want to host a server just for people to get an incorrect view of this there will be no demo here. If you are interested in the code and want to try running it yourself you are welcome to as the source code is [here](https://github.com/JeffreyRiggle/green-box/tree/main/refresh-server). That being said it uses KQueue so if you are not on MacOS your milage my vary.

## Credit where credit is due

This was a fun little project that allowed me to explore the boundaries of modern web browsers. I am completely shocked that browsers like Chrome let me go soo far into madness with a next to no impact to visual end result. I assue you my processor and RAM disagree about the impact of the changes on the result. If nothing else this is a huge testiment to the massive shoulders every web developer stands on. Those 8 long years of work, sweating the details, and rewriting to [RenderingNG](https://developer.chrome.com/docs/chromium/renderingng-architecture) have not gone unnoticed by me.
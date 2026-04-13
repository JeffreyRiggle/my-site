---
title: 'First excusion into Electron'
date: '2026-04-12'
---

## Why use Electron anyway?

After a bit of a meandering journey through a silly little discord bot we now find ourselves evaluating the area I was particularly interested in learning Electron. My first experience with Electron was using the [Atom editor](https://atom-editor.cc/). Atom had become my daily driver because it was faster than [Visual Studio](https://visualstudio.microsoft.com/vs/), which at the time was a pretty low bar, it was more feature rich than [Notepad++](https://notepad-plus-plus.org/), and it was free unlike [Sublime Text](https://www.sublimetext.com/). I was intigued by the fact that they choose to combine Node and Chrome in a way that allowed you to develop desktop applications. This sounded like much better experience than I had previously using [Swing](https://en.wikipedia.org/wiki/Swing_(Java)), [JavaFx](https://openjfx.io/), [WinForms](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/), [WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/), and [Qt](https://doc.qt.io/).

Now what made this a uniquely good oppertunity to use electron was the fact that I wanted to manage another application running on my local machine. Since node has access to the system and the ability to spawn child processes this was my chance to finally give the tool a go.

## Diving back in

Getting back into this project it is a bit funny how the quick fixation issues amounted to being nerd sniped on code style. Upon reflection I realize that some of the things I wanted to complain about had little to no difference at execution time. For example many of them had just been new features like [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) or [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring).

Once I found a way to move past superficial critiques of my code I noticed a couple of other things that seem odd in modern times. The first was that I had no unit tests in any of my electron app or rendered application code. The second was that I was using plain JavaScript, no Typescript anywhere to be seen. At first I wanted to call this an issue but again with more reflection I think this was actually wise.

For the unit tests, unit tests are wonderful when you are building a production product. However, when you are just tinkering and learning it only serves to get in your way. Making assertions on fundamently flawed prototypes is a perfect waste of time. 

In the case of Typescript, a strong argument can be made that adding Typescript is only a net benefit. The common argument would be that you get to control how strict the types are an you can always abuse `any`, `function`, or `unknown` to unlock a higher velocity. That is certainly something I could not argue with. However, Typescript is not a first class citizen in this ecosystem. If you give Typescript to the browser it will fail and Node does not work in Typescript either. In order to leverage Typescript this means adding in a build step to compile your Typescript. This takes in in setting up the appropriate build pipeline and the execution time to compile your code. To make matters worse since you can fall back to such unrestrictive types you are just paying a development time cost for questionable gains. A code base that is typescript but only uses `any` is a net negative. While I am not against TypeScript in this case I would defend my choice not to use it.

## Package manager wars

One thing that kept coming up in these repositories was finding the use of [yarn](https://yarnpkg.com/). At the time it seemed like the clear winner, having the lock file was a massive win. I had been burned too many times with odd build artifacts due to some loose patch or minor version. Now years later I can see it is hard to dethrone the encumbant. A quick change to add a proper lock file and npm was back on top. That is not to say that yarn is not still valuable but a large majority of its popularty was erased in short time. In this case yarn was just another dependency I had to add to my machine and build pipelines so to make maintance easier I removed it.

## Getting started with Electron

Now that I have had a good rant about the general ecosystem lets look at the build out of this electron application. One of the first choices you have to make with an electron application is how you want to render your UI. Most examples will have you open a new Browser window without the chrome. Then you will display your application using standard web technologies. Generally the hardest choice is how you want to manage these static assets. Generally I have seen two patterns. The first invovles building your static assets and running the browser to load those local files. The other approach involves having a web server that hosts the static assets and then have the browser window point to that URL.

In this case I opted for the web server hosting the static assets. This allowed me to create two different experiences. If you viewed the application from a browser without the electron application you would be able to create a config file and download it to use locally. However if you ran it in the Electron application you would get the additional ability to start and manage the Robit server on your local machine.

### Enter IPC

Now in order to support these kinds of features you need to have an interprocess communication channel between the browser and the Node process. Now memory could be failing me but at the time the only way to do this was by using [ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main). This gave you an event emitter to handle messages between the browser and the Node process.

This worked well but it didn't fit my mental model. I wanted to be able to express two modes of communication. A client should be able to send a request and await it's response. It should also be able to subscribe to some event and get notifications over time. Since I couldn't find an easy way to do that with the standard feature set I built [ipc-bridge](https://ilusr.com/ipc-bridge/) to support my use cases. This abstraction allowed me to use my mental model across the IPC provided by Electron.

```javascript
let {client} = require('@jeffriggle/ipc-bridge-client');

// Sending single request to Node runtime.
client.sendMessage('doSomething', 'someData').then(() => {
    // Logic for when request passes
}).catch((err) => {
    // Logic for when request failed
});

// Getting incremental updates from Node runtime
client.subscribeEvent('customizablemessage', () => {
    // Logic for when message comes from main process
});
```

## Building static assets

Now since Electron just uses a Chrome browser as a rendering layer you have all the same choices as if you had been building a typical web front-end. The first of which is choosing if you are going to use a framework and what framework you would want to use. In this case I decided to use React. Before this project I had rarely used React, I was still quite a bit skeptical of the memory consumption required for the virtual DOM. However, what I did find compelling was the mental model of a single render function. To make this as easy as possible I used the react-start-app that existed at the time. This opted into a default test framework, build process, and even the use of a service worker. One of the more problematic defaults was the linters that mostly got in my way.

## Class verse function

When I started this project class based react components was the only option. As such all components in this project are class based. At the time I constantly ran into problems with callbacks. I kept running into the common problem of forgetting my binding on my callback functions. Now the way I dealt with this problem seems like it could be problematic from a memory use pattern.

```javascript
class MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            stateString: 'sup'
        };
    }

    doSomething() {
        console.log(this.state.stateString);
    }

    render() {
        return <button onClick={this.doSomething.bind(this)}></button>
    }
}
```

This would create a new bound instance of `doSomething` on every render call. Some alternatives I have seen use cached bind or arrow functions.

```javascript
class MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            stateString: 'sup'
        };

        this.doSomethingBound = this.doSomething.bind(this);
    }

    doSomething() {
        console.log(this.state.stateString);
    }

    render() {
        return <button onClick={this.doSomethingBound}></button>
    }
}
```

```javascript
class MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            stateString: 'sup'
        };
    }

    doSomething = () => {
        console.log(this.state.stateString);
    }

    render() {
        return <button onClick={this.doSomething}></button>
    }
}
```

Now functional components handle this problem much better by completely avoiding this class of problem as there is no `this` to contend with.

```javascript
const MyComponent = () => {
    const [stateString, _] = useState('sup');

    const doSomething = useCallback(() => {
        console.log(stateString);
    }, []);

    return <button onClick={doSomething}></button>
}
```

Every time I come back to this project I have to fight the urge to change all components to functional components. While it would feel better it is not strictly required.

## Front-end topics
* Observation that this would have been a perfect case for redux
* Writing files is silly but recently they introduced https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write wow
* Didn't really use a component library but pulled in libraries for tooltip and datepicker

## Node desktop topics
* Weird health check logic
* Different behaviors for dev verses production mode (dev tools/site url)
* Pretty funny how docker start worked if the operation didn't complete within 5 seconds it was considered a failure
* Used okctokit to download a single file from GH that could have been a single HTTP request

## Closing remarks
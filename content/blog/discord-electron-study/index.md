---
title: 'First excusion into Electron'
date: '2026-04-12'
---

## Why use Electron anyway?

After a bit of a meandering journey through a silly little Discord bot, we now find ourselves evaluating the Electron application. My first experience with Electron was using the [Atom editor](https://atom-editor.cc/). At the time, Atom was my daily driver. It was faster than [Visual Studio](https://visualstudio.microsoft.com/vs/), more feature-rich than [Notepad++](https://notepad-plus-plus.org/), and it was free, unlike [Sublime Text](https://www.sublimetext.com/). I was intrigued by the idea of combining Node and Chrome to develop desktop applications. This sounded like a much better experience than I had previously using [Swing](https://en.wikipedia.org/wiki/Swing_(Java)), [JavaFX](https://openjfx.io/), [WinForms](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/), [WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/), or [Qt](https://doc.qt.io/).

What made this a uniquely good opportunity to use Electron was that I wanted to manage another application running on my local machine. Since Node has access to the system and can spawn child processes, this was my chance to finally give the tool a go.

## Diving back in

In my first attempt to review the code, I found myself fixated on issues that amounted to preferences about code style. Upon reflection, I realized that many of these changes would amount to nearly identical bytecode. For example, many of them were new features, such as optional [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) or [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring).

As I moved past the superficial critiques, I noticed a few things that seemed non-standard. The first was that I had no unit tests in any of the code in my Electron application or rendered application code. The second was that I was using plain JavaScript, no TypeScript anywhere to be seen. At first, I saw this as an issue, but upon reflection, I think this was wise.

Unit tests are wonderful when you are building a production product. However, when you are just tinkering and learning, it only gets in your way. Making assertions on fundamentally flawed prototypes is a perfect waste of time.

When the domain is not well understood, as is common in learning and prototyping, a type system provides little benefit at a real cost. In these cases, types haven’t had time to solidify, and the usage of `any`, `unknown`, and `Function` are likely to come up. It’s hard to defend using Typescript in these cases. TypeScript is not a first-class citizen. If you give raw TypeScript to the browser or Node, it will fail. Leveraging TypeScript means adding a build step to compile your TypeScript. This adds complexity and additional time, both in compile time and setup.

## Getting started with Electron

Now that I have had a good rant about the general ecosystem, let’s focus more on this Electron application. The first choice I had to make for the electron application was how to render the UI. Most examples will have you open a new BrowserWindow to show content. Then you will display your application using standard web technologies. Generally, the hardest choice is managing these static assets. Generally, I have seen two patterns. The first involves building your static assets and running the browser to load those local files. The other approach involves using a web server to host the static assets. Then the browser window can leverage those via a URL.

In this case, I opted for the web server hosting the static assets. This allowed me to create two different experiences. The first experience was in-browser. If you viewed the website, you would be able to create a configuration file and download it. The other experience was loading the website from the Electron application. This experience would layer on the option to start and manage the Robit server on your local machine.

### Enter IPC

To support these kinds of features, you need to have an interprocess communication channel between the browser and the Node process. At the time, the only way to do this was by using [ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main). This gave you an event emitter to handle messages between the browser and the Node process.

This worked well, but it didn’t fit my mental model. I wanted to be able to express two modes of communication. A client should be able to send a request and await its response. It should also be able to subscribe to some event and get notifications over time. Since I couldn’t find an easy way to do that with the standard feature set, I built [ipc-bridge](https://ilusr.com/ipc-bridge/) to support my use cases. This abstraction allowed me to use my mental model across the IPC provided by Electron.

```javascript
let {client} = require('@jeffriggle/ipc-bridge-client');

// Sending single request to Node runtime.
client.sendMessage('doSomething', 'someData').then(() => {
    // Logic for when the request passes
}).catch((err) => {
    // Logic for when the request failed
});

// Getting incremental updates from Node runtime
client.subscribeEvent('customizablemessage', () => {
    // Logic for when a message comes from the main process
});
```

## Adding in the dual experience

As I mentioned before, I wanted to create multiple experiences on the website using the same static assets. This was something I had built into the `ipc-bridge`. This library exposes a property that lets the frontend know if the Electron application was hooked up.

```javascript
const handleElectronState = (available) => console.log('Is electron available? ', available ? 'Yes' : 'No');
handleElectronState(client.available);
client.on(client.availableChanged, handleElectronState);
```

By having the available state and a handler, I was able to dynamically load additional routes into my application.

## Building the front-end

Since Electron uses Chromium as its rendering layer, you have all the same choices you would have for building any other website. The first is choosing whether to use a framework and which framework you would want to use. In this case, I decided to use React. Before this project, I had rarely used React. I was still skeptical of the memory required for the virtual DOM. However, what I did find compelling was the mental model of a single render function. To make this as easy as possible, I used the react-start-app that existed at the time. This opted into a default test framework, build process, and even a service worker.

### Class versus function

When I started this project, class-based React components were the only option. As a result, I constantly ran into problems with callbacks. I kept running into the common problem of forgetting to bind callback functions. The way I dealt with this problem was problematic from a memory use perspective.

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

This would create a new bound instance of `doSomething` on every render call. Some alternatives I have seen cache the bind or utilize arrow functions.

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

Functional components handle this problem much better by completely avoiding this class of problem, as there is no `this` to contend with.

```javascript
const MyComponent = () => {
    const [stateString, _] = useState('sup');

    const doSomething = useCallback(() => {
        console.log(stateString);
    }, []);

    return <button onClick={doSomething}></button>
}
```

Every time I come back to this project, I have to fight the urge to update all components to be functional components. While it would feel better, it is not strictly required.

### A missed opportunity

Most of the frontend code in this project was building a dynamic configuration file using components. The way I approached this problem was interesting in hindsight. I created a `configManager` . This was not a class but a closure that housed a global configuration object. As you added actions, you would mutate the global actions array. A similar thing would happen for updating an action. Every time you created an action component, it would pull the related action metadata from the global state and mutate it in place.

```javascript
// relevant bits of configManager.js
let config = {
    greeting: "Robit online. Boop Boop",
    audioSources: [],
    access: {
        default: [],
        users: [],
        deniedMessage: "You do not have the rights to perform this action"
    },
    deferredactions: [],
    actions: []
};

export const addAction = (action) => {
    config.actions.push(action);
}

export const getActionById = (id) => {
    let retVal;

    config.actions.forEach(v => {
        if (!retVal && v.id === id) {
            retVal = v;
        }
    })

    return retVal;
}
```

```javascript
// relevant bits of Action component.
class Action extends Component {
  constructor(props) {
    super(props);

    this.action = getActionById(params.id);
  }

  // event handler to mutate state
  typeChanged(event) {
      let newType = event.target.value;

      this.action.type = newType;
      this.setState({
          selectedType: newType
      });
  }
}
```
There are a couple of issues I have with this. I didn’t store the action in the state. Instead, it was a member of the class. However, the more egregious offender was the implicit changes. This built up its configuration by modifying the same underlying action object as was in the global. A much more modern and acceptable solution to this same problem would have been to use [Redux](https://redux.js.org/). By using Redux, I would have the same global state I wanted, but with a couple of benefits. The first would be that I wouldn’t have implicit changes. The Redux pattern results in a global immutable state being changed over time by deterministic actions. The second benefit would be state consistency in the component. In this example, I am managing the state of the action outside the props or state. Going with a Redux pattern, this would not have been the case.

### Finally, a better way

As I was reviewing the code, I happened upon this pattern I am all too familiar with seeing.

```javascript
const save = (data, type, fileName) => {
    let el = document.createElement('a');

    el.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(data)}`);
    el.setAttribute('download', fileName);

    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}
```

Convinced that there had to be a better way, I set out to survey the landscape. Much to my excitement, a year ago, that better way is finally [here](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write).

## Getting to the Node runtime

Up until now, almost all of the logic I covered has been for the client assets. These would run fine with or without the desktop part. However, I think it is worthwhile to evaluate some of the choices in the Node runtime as well. There is far less of this code, so there is a bit less to uncover here.

### Detecting environment

Debugging the application was something I needed early on. I wanted the full application running on my local machine. I also wanted access to the devtools in the Chromium view. I was able to control this behavior by setting a `NODE_ENV` variable. When the variable was production, I would be able to do both of these behaviors.

```javascript
const isDev = process.env.NODE_ENV !== 'production';
const appUrl = isDev ? 'http://localhost:3000/robit' : 'http://ilusr.com/robit';

// opening the browser window
if (isDev) {
    window.webContents.openDevTools();
}

window.loadURL(appUrl);
```

### An excessive dependency

A key flow involved starting the web server locally. To do this, I would download the compiled Robit “application”, more like a JavaScript file, from GitHub. That’s right, I checked in the compiled version as well as the source, blasphemy. To download this single asset, I added [octokit](https://github.com/octokit/octokit.js) as a dependency. However, I could have made an HTTP GET and prevented including the extra dependency. The effort to use the HTTP library would have been low. To avoid this low effort, I took on the risk of including a large dependency and its current 222 dependencies. That wildly expanded the amount of code I had consumed. This, in turn, expanded the surface area for security issues.

### An overly aggressive timeout

Coming back to this, the Docker startup logic caught my attention. If the application determined you had Docker, it would allow you to start Robit as a Docker container. To detect Docker, a child process would be spawned.

```javascript
const dockerEnabled = () => {
    return new Promise((resolve, reject) => {
        exec('docker --version', (err, stdout, stderr) => {
            resolve(!err && !stderr);
        });
    });
}
```

Once eligibility was determined, you could choose to start this application in Docker. This was done by pulling the Docker container, starting it, and waiting for a health check to succeed. The problem was that this was a very aggressive health check. If you couldn’t start the application in 5 seconds, it would abandon the attempt.

```javascript
function waitUp(timeout) {
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        pollingInterval = setInterval(() => {
            request.get('http://localhost:8080/robit/state', (err, response, body) => {
                let json = JSON.parse(body);
                
                if (json.state === 'Stopped') {
                    clearInterval(pollingInterval);
                    resolve();
                } else if (timeout < Date.now() - startTime) {
                    clearInterval(pollingInterval);
                    reject('timed out waiting for docker server');
                }
            })
        }, 500);
    });
}

function startRunningDockerServer(config) {
    return new Promise((resolve, reject) => {
        exec('docker pull jeffriggle/robit && docker run -p 8080:8080 -d jeffriggle/robit', (err, stdout, stderr) => {
            if (err) {
                reject(err)
                return;
            }
    
            waitUp(5000).then(() => {
                request.post('http://localhost:8080/robit/start', {
                    json: config
                }, (err, response , body) => {
                    if (err) {
                        console.log(`Failed to set robit config. error ${err}, response: ${JSON.stringify(response)}. body: ${JSON.stringify(body)}`);
                        reject(err);
                        return;
                    }

                    resolve();
                });
            }).catch(err => {
                reject(err);
            });
        });
    });
}
```

I cannot think of many Docker containers I have pulled from the internet, started, and interacted with in under 5 seconds.

## Composition of services

This electron application was a multi-process architecture that required consideration at multiple levels. This had a web server hosting a frontend that interfaced with a desktop backend, which in turn interacted with a web server. This was a neat little problem all rolled up into one silly little application. What was especially interesting in this project was how many of the processes had been built to work in isolation. Despite it being the core focus area, you could run this entire application without ever using the electron part. While this sounds like it would have added a lot of extra scope, it was just a few lines of JavaScript to hide some visual elements controlled by a single event from the `ipc-bridge` abstraction I made. In this case, a small decision on how to load static assets made a world of difference in the final feature set. In retrospect, this was one of the more impactful decisions in the project, not because of its complexity, but because of how it shaped the way the system could be composed.
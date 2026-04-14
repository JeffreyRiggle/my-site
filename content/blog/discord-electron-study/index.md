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

## A missed oppertunity

A vast majority of the front-end code in this project was building up a dynamic configuration file using components. However the way I did this was a bit crazy. Basically what I did was create a `configManager` this manager was not a class but instead a closure that had a global configuration object in it. As you added actions you would mutate the global actions array. A similar thing would happen for updating an action. Everytime you created an action component it would pull the related action metadata from the global state and mutate it in place.

```javascript
// relevent bits of configManager.js
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
// relevant bit's of Action component.
class Action extends Component {
  constructor(props) {
    super(props);

    this.action = getActionById(params.id);
    // ommitted for brevity
  }

  // ommitted for brevity

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

Now a couple things are a bit weird about this. The first being that I didn't store the action in state it was a member on the class. Also this leveraged mutations to make implicit changes to the global state by modifying the same underlying action object as was in the global cache. A much more modern and React acceptable way of solving this same problem would have been to use [Redux](https://redux.js.org/). This is almost the perfect case for that technology as my entire application logic was just a series of components whose end objective was to build a single global state to be sent to a HTTP endpoint or saved to disk.

## Finally a better way

As I was reviewing this code I happened on this piece of code I am all to familiar with seeing.

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

I have seen and used similar bits of code just like this many times to programatically save something to the end users disk. Convinenced that there had to be a better way I set out to look this up on MDN and it turns out just a year ago that better way is finally [here](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write). I cannot wait to stop silently pressing links in the browser.

## Adding in the dual experience

Up until now all of the logic I have covered is specific to both experiences. However I didn't spend enough time talking about how I got two different experiences in the same front-end asset. This was something I had actually built into the `ipc-bridge` I discussed earlier. In this case I would expose a property that would let the front-end know if the electron app was hooked up. A slimmed down example of this can be seen here

```javascript
// Modified for brevity.
class App extends Component {
  constructor(props) {
    super(props);

    client.on(client.availableChanged, this.stateChanged.bind(this));

    this.state = {
      electron: client.available
    }
  }

  stateChanged(state) {
    this.setState({
      electron: state
    });
  }

  render() {
    return (
      <BrowserRouter basename="/robit">
        <div className="App">
          <div className="content">
            <div className="sidebar">
              <ul className="sidebar-list">
                {this.state.electron && <li><NavLink to="/server" className="sidebar-item">Server</NavLink></li>}
              </ul>
            </div>
            <div className="content-area">
              <Routes>
                {this.state.electron && <Route exact="true" path="/server" Component={Server}/>}
              </Routes>
              <Outlet />
            </div>
          </div>
          <footer>
            <Generator/>
          </footer>
        </div>
      </BrowserRouter>
    );
  }
}
```

By having the available state and a handler I was able to dynamically load additional routes into my application.

## Getting to the Node runtime

Up until now almost all of the logic I have talked about is the client assets. These would run fine with or without the destop part. However I think it is worthwhile to evaluate some of the choices in the Node runtime as well. There is far less of this code so there is a bit less to uncover here.

## Detecting version

One thing I often had to do during this project was debug the application. In order to do this I wanted the full application running on my local machine and I wanted access to the devtools for the electron application. I was able to control this behavior by setting a `NODE_ENV` varaible. When the variable was production I would be able to do both of these behaviors.

## An excessive dependency

One part of this application involved starting the web server locally. To do this I would download the compiled Robit application from GitHub, believe it or not I checked in the compiled version as well as the source. How I decided to solve this problem was to pull in [octokit](https://github.com/octokit/octokit.js) to get this file. However I could have just as easily did a simple HTTP GET and saved the extra dependency.

## An overly aggressive timeout

One area of code I found interesting coming back to this was the docker startup logic. Now if the application determined you had docker it would allow you to start up Robit as a docker container. To detect if you had docker a child process would be spawned to see if you had a docker version.

```javascript
const dockerEnabled = () => {
    return new Promise((resolve, reject) => {
        exec('docker --version', (err, stdout, stderr) => {
            resolve(!err && !stderr);
        });
    });
}
```

Once eligibility was determined you could opt to start this application in docker. This was done by pulling the docker container, starting it and waiting for a healthcheck to succeed. The problem was This was a very agressive health check. If you couldn't get the application started in 5 seconds it would abandon the attempt.

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

I don't know if times are different but I cannot think of may docker containers I have pulled from the internet, started, and been able to interact with in under 5 seconds.

## Closing remarks

This electron application in a way was a multi-process arcitecture that required some consideration at mulitple levels. This had a web front-end, talking to a desktop backend which in tern interacted with a web server. This was a neat little problem all rolled up into one silly little application. I am also continually reminded of the fact that the web ecosystem is in constant flux. It seems like no matter when you start a project if you do not keep up on the changes the web ecosystem will march on in a way that does not lead well to occasionally updated projects. This does not appear to be a problem with the technology itself, JavaScript. In fact code I wrote 10 years ago without a framework still runs just fine in modern browsers. This instead appears to be a result of cycles of hype and meta shifts in the landscape over years. I will be very curious to see if this is an artifact of the "pre-AI era" or if this pattern will continue to occur.
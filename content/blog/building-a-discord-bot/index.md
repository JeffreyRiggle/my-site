---
title: 'Building a Discord Bot'
date: '2026-04-03'
---

In the last blog I covered the high level overview of Robit. In this blog I will talk a bit more specifically on the build out of the server. As I mentioned in the last blog the main goal for this project was to learn electron, so the work on the server was not the main focus for me. What I wanted to do was handle messages from discord channels and do some action based on what was observed.

## Choosing a library

I wrote this server in Node.js because I wanted the path of least resistence. By this point in my career basically everything had shifted to JavaScript and taking the time to setup a proper C# or Java server required a bit more effort than just creating someting in node. Since I needed to interact with discord I did a quick search of what was available and found [discord.js](https://discord.js.org/). In an all to typical pattern for me I spent just enough time looking to find the popular option for the problem I had. I did not consider any alternatives and spend the bare minimum amount of time to figure out what I needed to get started. The result of this is I build a system that ignored most of what the library I was pulling in had to offer.

The way I used the library was to subscribe to any message on all channels for the server in question. Then I would parse each message. If the message happened to start with `!robit` the server would proceed to process the message. Now much has changed since I last looked at this project but it appears that much of what I did was supported by default with the concept of [commands](https://discordjs.guide/legacy/slash-commands/advanced-creation) in discord.js. A little more time spent researching and I could have narrowed the surface area of my backend even more.

## Running the server

This is another project where the runtime of the project changed overtime. My like other projects I had the entire configuation of this application was determined by a single JSON configuration file. This configuration file had all of the permissions, actions, etc defined inside of it. At the start of the project this would only run on a local machine and assumed you would run the program using node and passing in the configuration file.

```bash
> node main.js myconfig.json
```

Just looking at how I handled that is a bit humorous to me.

```javascript
let configFile;

process.argv.forEach((val, i, arr) => {
    if (val.endsWith('json')) {
        configFile = val;
    }
});
```

There are a couple problems I have with this. First it enumerates all arguments and second it takes the last JSON file. So if you provided multiple JSON files it would just read the last which may or may not be the desired case. Now there are many ways I could have handled this better. Some people would reach for a arguments parser like [Yargs](https://yargs.js.org/), but I didn't really need all that flexibility. What kind of bothers me now with this is just how much I felt compelled to use `forEach` instead of a standard for loop or a loop that could have had better performance. For example I would have preferred any of these options instead

```javascript
// So you just have to use functional programming
const configFile = process.argv.find(val => val.endsWith('json'))

// the forgotten for loop
let configFile;

for (let val of process.argv) {
    if (val.endsWith('json')) {
        configFile = val;
        break;
    }
}

// or you could just apply a convention
const configFile = require('./robit-config.json');
```

Now eventually I decided to expand the scope of this. Docker is cool so everything even toy projects need to run in docker right? As a result I went through the effort of making a docker setup.

## Containerization

With containers comes an interesting problem. If I build an artifact and give it to you now I have an issue of getting your specific config into my build container. A naive solution would be to provide the docker file and make you define your config and build your own docker image with the config inside. However if you are going to do that why use docker at all?

This created a bit of an issue for me. Now there are lot's of ways I could have solved this problem: use a volumne, pass in the JSON as an insanely long argument, require that the config is hosted somewhere and do a CURL against an argument to get the file, the list goes on. What I decided on was that my application would now have an HTTP API using [express](https://expressjs.com/) to allow you to set the configuration.

## Building the API

The primary goal of the API was to allow a user to create a config and send it to a running robit server to update the config. This also added the ability to start and stop the server. However the last an possibly most weird case was a log collection.

While not the topic of this particular blog post the way this worked was the electron application would interface with this API to manage the state of the application. This included a view in which you could see the log mesasge from the service. Now I could have piped the stdout of the container back to the electron app but what I did instead was pull the logs via an HTTP request. The result was not being allowed to use the `console` directly for my logging. There are plently of log wrappers that I could have used like [Winston](https://github.com/winstonjs/winston) but instead I just built my own thing.

```javascript
let watching = false;
let batchedLogs = [];

const setWatching = (watch) => {
    watching = watch;
}

const log = (message) => {
    if (watching) {
        batchedLogs.push(message);
    }

    console.log(message);
}

const flush = () => {
    let retVal = batchedLogs;
    batchedLogs = [];

    return retVal;
}

module.exports = {
    setWatching,
    log,
    flush
}
```

Now this is missing all sorts of featues that I would ideally like. Differing log levels and log formatting are just not part of the deal here. I could have saved myself some effort by just taking the time to properly enable stdout on the spawning of the docker process and just consuming the events from stdout.

## Security strikes again

Once again as I look back on this project I see that security was not my primary consideration. This surfaced in two different ways. The first an more unfortunate one was around the command processing. In the case of these commands I built a simple permission system. The idea was there might be some commands that you didn't want everyone on the server to be able to issue. To do this I stored the permissions as a key value pair. The key was the users name and the value was an array of all the permissions the user had. For example you might have something like this

```json
{
    "permissions": {
        "steve": ["help", "currentSong"],
        "sally": ["help", "coolMessage"],
        "admin": ["*"]
    }
}
```

Now if you haven't figured it out the big problem here is it was keyed off of display name. The funny thing about display names in discord is you can change them. So, if for instance sally changed their discord name to admin they would get permission to all actions.

The other area this surfaced was on the web server. As I mentioned the interaction with the server when using docker was via an HTTP API. This API had no permissioning and that "might" be considered safe if you are only running on your local without the port exposed to the outside world. However it it certainly poor form. To make matters worse regardless of if you ran in docker or not the HTTP server was always started even though it wasn't needed. Looking at this again I was reminded of the [zoom security issue](https://nvd.nist.gov/vuln/detail/cve-2019-13450) around running a local web server. If you don't need the web server for the flow maybe you shouldn't run it.

## Get that bundler out of here

One thing I immediately regretted seeing when looking back on this project could be summed up with `webpack.config.js`. I don't have a great memory of this decision but either I thought it would be wise to bundle my application into a single file or I wanted it bundled to make it easier to download off of GitHub. Whatever the true reason is I ended up using webpack to bundle my Node.js application into a single javascript file. This required weird things like the mixing of ESM and CJS module systems along with tools like babel.

Every time I upgrade a project the biggest pain point I have is around the build tooling. Sadly in this case I inflicted the pain on myself when it was not required.

## The features I forgot

Once again looking through the code of this project I was reminded of some interesting features I forgot to mention and figured I would mention here.

### Harassment as a feature

I am not proud of this and I don't even think I fully realized the issue at the time. However I created what I can only describe as the perfect harassment feature. You could configure an action to repeat whatever message you wanted to another channel. This could allow a user to send a message directly to Robit and it would happily repeat that message. I even created the action on my local server for a while and called it whisperbroadcast. So the following message "!robit whisperbroadcast Lenny's mother was a hamster and his father smelt of elderberries" would have sent the message to a larger channel to harass poor Lenny.

### Why shouldn't discord be a music player?

The other thing I realize I spend an extrodinary amount of time on was finding a way to use discord like a music player. I created a set of special actions that wold allow robit to read some part of the file system, gather all the files, and then allow you to play those in a voice channel. So if you configured that correctly in the JSON you could do something like "!robit playMusic" which would start a voice channel which would play music to that channel. You could then control the music with commands like "next", "shuffle", "stop".

Looking at this code I realized I commited the cardinal sin of Node.js programming.

```javascript
function getMusicFilesFromDirectory(dir) {
    let files = fs.readdirSync(dir);

    files.forEach(file => {
        let path = `${dir}/${file}`;
        if (fs.statSync(path).isDirectory()) {
            walkDir(path);
            return;
        }

        if (!validAudioFile.test(file)) {
            return;
        }

        addMusicFile(file, path);
    });
};
```

That is correct I used the "sync" options on the `fs` module. If you will excuse me for a brief tangent, this goes against much of what Node's creator would have wanted. Part of the initial thesis for Node was that even though Javascript is single threaded it is not the thread that makes things faster. For instance you could have a slow Java server that use 100 threads. Instead what you want is a fast loop on a single thread with a scheduler and blocking IO work being done outside of the main application loop. If you haven't watched it I highly recommend watching [this talk](https://www.youtube.com/watch?v=EeYvFl7li9E). Since this happened only once it is fine but a solution more in the spirit of Node would have been something like the following

```javascript
async function getMusicFilesFromDirectory(dir) {
    let files = await fs.readdir(dir);

    for (let file of files) {
        const fStat = await fs.stat(file);

        if (fStat.isDirectory()) {
            await getMusicFilesFromDirectory(dir);
            continue;
        }

        if (validAudioFile.test(file)) {
            addMusicFile(file, path);
        }
    }
}
```

## Javascript is a weird language

One thing I noticed when looking at this project that Javascript is a programming melting pot. In this project alone I see a interesting mix of functional and object oriented programming styles. All of my HTTP handling code and discord message processing code is written in a functional way. I cannot tell if that is because the libraries surrounding that promote that style of thinking or a creation of my own. However, where things get a bit more interesting is that for the action handling the composition of actions, their metadata, and associated actions had all been done in an object oriented way. These actions even had a base class that handled the sending of messages back to channels. For these actions I could have just as easily used a series of functions without class but instead I decided to mix paradigms.

## Rounding it out

Once again in this project I build more than was required, supported more deployments than I needed to, and to top it all off once again I neglected to understand the ecosystem I was building on. These problems appear to be all to common in these projects I have taken on. I also see where chasing the fad caused me issues later on. Having to continue to support my choice to use yarn or webpack created continued friction over time. As we close this chapter of Robit's development we prepare for a dive into the client that powered this server. This includes some learnings around electron and React.
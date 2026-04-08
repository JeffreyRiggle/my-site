---
title: 'Building a Discord Bot'
date: '2026-04-03'
---

In the last blog I covered the high level overview of Robit. In this blog I will talk a bit more specifically on the build out of the server. As I mentioned in the last blog the main goal for this project was to learn electron, so the work on the server was not the main focus for me. What I wanted to do was handle messages from discord channels and do some action based on what was observed.

## Choosing a library

I wrote this server in Node.js because I wanted the path of least resistence. By this point in my career I was completely preoccupied with JavaScript. Taking the time to setup a proper C# or Java server required more effort than creating someting in Node. To interact with discord I did a quick search and found [discord.js](https://discord.js.org/). As is typical, I spent the bare minimum amount of time to find the popular library. I did not consider any alternatives and learned the bare minimum about the library. The result, I build a system that ignored most of what the library I was pulling in had to offer.

The way I used the library was to subscribe to any message on all channels for the server in question. At this point Robit would parse each message. If the message happened to start with `!robit` the server would proceed to process the message. Much has changed since I last looked at this project. Much of what I did was supported by default with the concept of [commands](https://discordjs.guide/legacy/slash-commands/advanced-creation) in discord.js. A little more time spent researching and I could have narrowed the surface area of my backend even more.

## Running the server

This is another project where the supported runtime of the project changed overtime. Much like my like other projects, the entire configuation of this application was determined by a single JSON file. This configuration file had all of the permissions, actions, etc defined inside of it. In the beginning, this would only run on a local machine and assumed you would run the program using node while passing in the configuration file.

```bash
> node main.js myconfig.json
```

Looking at how I handled the agrument processing is a bit humorous to me.

```javascript
let configFile;

process.argv.forEach((val, i, arr) => {
    if (val.endsWith('json')) {
        configFile = val;
    }
});
```

There are a couple problems I have with this. First, it enumerates all arguments, and second it takes the last JSON file. If you provided multiple JSON files it would just read the last one. This may or may not be the desired case. Now there are many ways I could have handled this better. I could have made this an option instead of a positional arugment. For this I could have gone with an arguments parser like [Yargs](https://yargs.js.org/). However, positional arugments are not the worst thing ever. Another thing that bothers me now is just how much I felt compelled to use `forEach`. There are many other ways that I could have gotten the same effect with more precision and efficiency.

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

Eventually I decided to expand the scope of this. Docker is cool, so everything even toy projects need to run in docker right?

## Containerization

With containers comes an interesting problem. If I build an artifact and give it to you now I have an issue of getting your specific config into my built container. A naive solution would be to provide the Dockerfile and make you define your config and build your own docker image with the config inside. However if you are going to do that why use docker at all?

There are many ways I could have solved this problem: use a volumne, pass in the JSON as an insanely long argument, require that the config is hosted somewhere and do a CURL against an argument to get the file, the list goes on. What I decided on was that my application would be extended to have an HTTP API using [express](https://expressjs.com/). This API would allow you to set the configuration.

## Building the API

The primary goal of the API was to allow a user to create a configuration file and send it to a running robit server to update the configuration. This also added the ability to start and stop the server. However this also added another seemingly weird API which was log collection.

While not the topic of this particular blog post reason for this was rooted in the electron application. The electron application would interface with this API to manage the application. This included a view in which you could see the log mesasges from the running process. I could have piped the stdout of the container back to the electron application using the child process. What I did instead was pull the logs via an HTTP request. The result was not being allowed to use the `console` directly for my logging. There are plently of libraries that I could have used like [Winston](https://github.com/winstonjs/winston) but instead I just built my own thing.

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

This solution is missing all sorts of featues that I would ideally like. Differing log levels and log formatting are just not part of the deal here. There are many options I could have evaluated to make my life easier including the use a thrid party or proper leveraging of stdout.

## Security strikes again

Once again, I see that security was not my primary consideration. This surfaced in two different ways. The first an more unfortunate one was around command permisions. In the case of these commands I built a simple permission system. The idea was there might be some commands that you didn't want everyone on the server to be able to issue. The solution I created for permissions as a key value pair. The key was the users name and the value was an array of all the commands the user had access to.

```json
{
    "permissions": {
        "steve": ["help", "currentSong"],
        "sally": ["help", "coolMessage"],
        "admin": ["*"]
    }
}
```

If you haven't figured it out yet, the big problem is that the solution keyed off the display name. The funny thing about display names in discord is you can change them. So, if for instance, sally changed their discord name to admin they would get permission to all actions.

The other area security issues surfaced was on the web server. The interaction with the server when using docker was via an HTTP API. This API had no permissioning. That choice "might" be considered safe if you are running on your local machine without the port exposed to the outside world. However, it is certainly poor form and not secure. To make matters worse, regardless of if you ran in docker or not, the HTTP server was always used. This was despite the fact it wasn't needed. This remindes me of the [zoom security issue](https://nvd.nist.gov/vuln/detail/cve-2019-13450) from 2019 dealing with a local web server. If you don't need the web server maybe you shouldn't run it.

## Get that bundler out of here

Another regret could be summed up with `webpack.config.js`. I don't have a great memory of this decision. Either I thought it would be perfomant to bundle my Node application, or I a bundled to make it easier to download from GitHub. Whatever the reason, I ended up using webpack to bundle my Node.js application. As a result, strange tools like babel ended up being a part of my system.

Every time I upgrade a project the biggest pain point I have is around the build tooling. Sadly in this case I inflicted the pain on myself when it was not required.

## The features I forgot

Looking through the code, I was reminded of some interesting features I had not mentioned before.

### Harassment as a feature

I am not proud of this and I don't think I realized the issue I was creating. However I created what I can only describe as the perfect harassment feature. You could configure an action to repeat any message you wanted to another channel. This could allow a user to send a message directly to Robit and it would happily repeat that message without record of the orignating user. I even created the action on my local server for a while and called it "whisperbroadcast". In practice the following message "!robit whisperbroadcast Lenny's mother was a hamster and his father smelt of elderberries" send directly to the bot, would have sent the message to a larger channel to harass poor Lenny.

### Why shouldn't discord be a music player?

As it turns out, I spend an extrodinary amount of time on turning discord into a music player. I created a set of actions that would allow robit to read the file system, gather all the files, and then provide commands for you to play those in a voice channel. If you configured that correctly in the JSON, you could do something like "!robit playMusic" which would start a voice channel to play music in that channel. You could then control the music with commands like "next", "shuffle", "stop".

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

That's right I used a "sync" API from the `fs` module. Part of the initial thesis for Node was that even though Javascript is single threaded it is not the thread that makes things faster. Instead proper handling of IO is what is important.[This talk](https://www.youtube.com/watch?v=EeYvFl7li9E) does a far better job explaining this than I could ever do. Since this happened only once it is fine, but a solution more in the spirit of Node would have been the following

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

This project reminds me that Javascript is a melting pot. In this project alone I see a interesting mix of functional and object oriented programming paradigms. The HTTP handling code and discord message processing code is written in a functional way. However, the composition of actions, their metadata, and associated actions was done in an object oriented manner. These actions even had a base class that handled the sending of messages back to channels. For these actions I could have just as easily used a series of functions without class but instead I decided to mix paradigms. I assume this difference is because libraries like Express take on a functional paradigm while I was thinking in an object oriented fashion. This caused the parts that are closer to the library to take on a more functional paradigm where I was more comfortable with an object oriented paradigm at the time.

## Rounding it out

Once again I build more than was required, supported more deployments than needed, and once again I neglected to understand the ecosystem. These problems appear to be all to common in these projects I have taken on. Also chasing fads caused me issues later on. Having to continue to support the choice to use yarn or webpack created continued friction over time. As we close out this chapter of Robit's development, we prepare for a dive into the client that powered this server. This will focus on learnings specific to Electron and React.
---
title: 'Building a Discord Bot'
date: '2026-04-03'
---

With the high-level overview of Robit out of the way, it’s time to cover how the server was built. As I mentioned in the last blog, the main goal of this project was to learn Electron, so working on the server was not the primary focus. What I wanted the bot to do was handle messages from Discord channels and perform a set of actions based on the content. To create the path of least resistance, the server was written in Node.js. By this point in my career, I was completely preoccupied with JavaScript. Setting up a proper C# or Java server simply required more effort than using Node.

## Choosing a package

To interface with Discord, I did a quick search and found [discord.js](https://discord.js.org/). As is typical, I spent the bare minimum time to find the popular package. I did not consider any alternatives and learned the bare minimum about the package. The result: I built a system that ignored most of what the package I was pulling in provided.

The way I used the package involved subscribing to message events on all channels for the server in question. Then Robit would parse each message. If the message started with `!robit` the server would proceed to process the message content. Much of what I did was supported by default in Discord.js with [commands](https://discordjs.guide/legacy/slash-commands/advanced-creation). A little more time spent researching, and I could have narrowed the surface area of my backend even more.

## Running the server

Once again, the runtime of this project changed over time. The entire configuration of this application was determined by a single JSON file. This configuration file had all the permissions, actions, etc defined inside of it. In the beginning, this would only run on a local machine. It assumed the program would be run using Node with the configuration file as an argument.

```bash
> node main.js myconfig.json
```

In retrospect, the argument processing is a bit humorous to me.

```javascript
let configFile;

process.argv.forEach((val, i, arr) => {
    if (val.endsWith('json')) {
        configFile = val;
    }
});
```

As you could see, this will enumerate all arguments and then take the last JSON file. If you provided multiple JSON files, it would just read the last one. This may or may not be the desired case. Now there are many ways I could have handled this better. I could have made this an option instead of a positional argument. For this, I could have gone with an arguments parser like [Yargs](https://yargs.js.org/). However, positional arguments are not the worst thing ever. What bothers me most now is just how much I felt compelled to use `forEach`. There are many other ways to get the same effect with more precision and efficiency.

```javascript
// So you just have to use functional programming.
const configFile = process.argv.findLast(val => val.endsWith('json'))

// The forgotten for loop.
let configFile;

for (let i = process.argv.length - 1; i > 0; i--) {
    const val = process.argv[i];
    if (val.endsWith('json')) {
        configFile = val;
        break;
    }
}

// Why not just apply a convention?
// Maybe a forced file name
const configFile = './robit-config.json';

// Possibly a proper positional variable
const configFile = process.argv[process.argv.length - 1];
```

Eventually, I decided to expand the scope of this. Docker is cool, so everything, even toy projects, should run in Docker, right?

## Containerization

With containers comes an interesting problem. If I build an artifact and give it to you, I have created an issue. How can I get your specific config into my built container? A naive solution would be to provide the Dockerfile. Then you could define your configuration, provide it to the image, and build your own Docker container. However, if you are going to do that, why use Docker at all?

There are many ways I could have solved this problem: use [bind mounts](https://docs.docker.com/engine/storage/bind-mounts/), pass the configuration JSON as an insanely long argument, require the configuration to be hosted so CURL could be used to get the file, the list goes on. Instead, my application was extended to have an HTTP API using [Express](https://expressjs.com/). This API provided a way to initialize and update the configuration.

## Building the API

The primary goal of the API was to allow a user to create a configuration file and send it to a running Robit server to update the configuration. This also added the ability to start and stop the server. However, this also added another seemingly weird API, log collection.

While not the topic of this particular blog post, the reason for this was rooted in the Electron application. The Electron application would interface with this API to manage the server. This included a view of the log messages from the running process. I could have piped the stdout from the container back to the electron application using the child process. What I did instead was pull the logs via an HTTP request. The result was the loss of access to the `console` API for my logging. There are plenty of libraries that I could have used, like [Winston](https://github.com/winstonjs/winston), but instead, I just built my own thing.

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

This solution is missing all sorts of features. Differing log levels and log formatting are just not part of the deal here. There are many options I could have evaluated to make my life easier, including using a third party or properly leveraging stdout.

## Security strikes again

Once again, I see that security was not my primary consideration. This surfaced in two different ways. The first and more unfortunate one pertained to command permissions. With these commands, I built a simple permission system. The idea was that there might be some commands that you didn't want everyone on the server to be able to invoke. The solution I created for permissions was a key-value pair. The key was the user's name, and the value was an array of all the commands the user had access to.

```json
{
    "permissions": {
        "steve": ["help", "currentSong"],
        "sally": ["help", "coolMessage"],
        "admin": ["*"]
    }
}
```

If you haven't figured it out yet, the big problem is that the solution keyed off the display name. The funny thing about display names in Discord is that you can change them. So, if, for instance, Sally changed their Discord name to Admin, they would get permission for all actions.

The other area where security issues surfaced was on the web server. The interaction with the server when using Docker was via an HTTP API. This API had no permissioning. That choice "might" be considered safe if you are running on your local machine without the port exposed to the outside world. However, it is certainly poor form and not secure. To make matters worse, regardless of whether you ran in Docker, the HTTP server was always used. This was despite the fact that it wasn't needed. This reminds me of a [Zoom security issue](https://nvd.nist.gov/vuln/detail/cve-2019-13450) in which a local web server was the culprit. If you don't need the web server, maybe you shouldn't run it.

## Get that bundler out of here

Another regret could be summed up with `webpack.config.js`. I don't have a great memory of this decision. Either I thought it would be efficient to bundle my Node application, or it was bundled to make it easier to download from GitHub. Whatever the reason, I ended up using webpack to bundle my Node.js application. As a result, strange tools like Babel ended up being a part of my system.

Every time I upgrade a project, the biggest pain point is around the build tooling. Sadly, in this case, I inflicted the pain on myself when it was not required.

## The features I forgot

Looking through the code, I was reminded of some interesting features I had not mentioned before.

### Harassment as a feature

I am not proud of this, and I don't think I realized the issue I was creating. However, I created what I can only describe as the perfect harassment feature. You could configure an action to repeat any message you wanted to another channel. This could allow a user to send a message directly to Robit, and it would happily repeat that message without a record of the originating user. I even created the action on my local server for a while and called it "whisperbroadcast". In practice, the following message, "!robit whisperbroadcast Lenny's mother was a hamster and his father smelt of elderberries," sent directly to the bot, would have broadcast to a larger channel to harass poor Lenny.

### Why shouldn't Discord be a music player?

As it turns out, I spend an extraordinary amount of time turning Discord into a music player. I created a set of actions that would allow Robit to read the file system, gather all the files, and then provide commands for you to play those in a voice channel. If you configured that correctly in the JSON, you could do something like "!robit playMusic" which would start a voice channel to play music in that channel. You could then control the music with commands like "next", "shuffle", and "stop".

Looking at this code, I realized I committed the cardinal sin of Node.js programming.

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

That's right, I used a "sync" API from the `fs` module. The initial thesis of Node.js was that even though JavaScript is single-threaded, it is not the thread that makes things faster. Instead, proper handling of IO is the primary concern. [This talk](https://www.youtube.com/watch?v=EeYvFl7li9E) does a far better job explaining this than I could ever do. Since this happened only once, it is fine, but a solution more in the spirit of Node would have been the following.

```javascript
async function getMusicFilesFromDirectory(dir) {
    let files = await fs.readdir(dir);

    for (let file of files) {
        const path = `${dir}/${file}`;
        const fStat = await fs.stat(path);

        if (fStat.isDirectory()) {
            await getMusicFilesFromDirectory(path);
            continue;
        }

        if (validAudioFile.test(file)) {
            addMusicFile(file, path);
        }
    }
}
```

## JavaScript is a weird language

This project reminds me that JavaScript is a melting pot. In this project alone, I see an interesting mix of functional and object-oriented programming paradigms. The HTTP handling code and Discord message processing code are written in a functional way. However, the composition of actions, their metadata, and associated actions was done in an object-oriented manner. These actions even had a base class that handled the sending of messages back to channels. For these actions, I could just as easily have used a series of functions without a class, but instead I decided to mix paradigms. I assume this difference is because libraries like Express adopt a functional paradigm, but I was thinking in an object-oriented fashion. The parts closer to the library followed a more functional paradigm, but I was more comfortable with an object-oriented paradigm. As a result, core business logic would use a more object-oriented style.

## Rounding it out

Once again, I built more than was required, supported more deployments than needed, and neglected to understand the ecosystem. These problems appear to be all too common in these projects I have taken on. Also, chasing fads caused me issues later on. Having to support the choice of yarn and Webpack created continued friction over time. As we close out this chapter of Robit's development, we prepare for a dive into the client that powered this server. This will focus on learnings specific to Electron and React.
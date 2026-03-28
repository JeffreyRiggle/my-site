---
title: 'What is a robit?'
date: '2026-03-24'
---

## Building for someone else

Continuing the thread of past projects in creation order we arive at robit. Robit was never anything I took to seriously and yet somehow it ended up being another multi-repo application that was barely used. In passing someone had told me that I would be nice if they could have a discord bot to send scheduled messages and a few other things. I did no research at the time or now to know if that feature is supported but given the size of the community I would be surpized if this wasn't a standard feature by now.

## What I wanted to get out of this

I had nothing to gain from this work. I was not and still am not a daily discord user. On top of that while I did give information on how to use this to the person who asked I don't know that it was ever used. I certainly didn't ask for any payment for it.

So what did I have to gain from this? I was far more interested in learning how to build with electron than anything I was produced. Since the core focus was on learning electron, I decided to take the path of least resistance on everything else.

## Setting up the project

By this point I was quite proficient and JavaScript so I decided all of the code would be JavaScript. Creating the server in Java or C# would have been possible but I found that it was way faster to prototype with JavaScript so instead I landed on using a Node.js server.

The architecure I ended up creating was the following.

![Robit Architecture](./robit-architecture.png)

On the server machine, which in this case was a random computer I owned, there was the electron application (botclientnative). That communicated with my personal domain to access the static assets. Now depending on if you viewed the web page in the browser or on the electron app you would get a slightly different experience.

If you viewed the site on a browser you would just get the UI to build a config JSON file that you could provide to the server directly.

However, if you used the electron application you would get that experience plus the ability to start the robit server directly either by spawning a node process or by starting a docker container. 

## The typical scope expansion

Once again the scope expanded far beyond what I needed. The original goal was just learn electron and build a discord bot that could send scheduled messages. By the time I was done I had gone over the top on features again. The ending feature set was the following

* The ability to setup scheduled messages.
* The option to send commands that would be interpeted by the bot if your message started with `!robit`.
* The ability to play music in a voice channel.
* The ability to configure permissions for users to certain `!robit` commands.
* The ability to provide command help for each custom command.

As far as the commands go these commands included the following commands

* The ability to broadcast a specific message to a channel.
* The ability to broadcast a random message out of a set of messages to a channel.
* The ability to add embedded content to a channel.
* The ability to trigger a HTTP request.
* The ability to chain these actions together. For example Trigger HTTP request then broadcast a message.

Again the scope creep was not just in features but in process. Also with this project we resurface the problem of having too many run options. While it was more constained than in the past having the option to run in a local node process or docker was probably more than was strictly required.

## Getting back into this project

Before getting back into this project I wasn't sure how I would feel about it. As I have mentioned before I like to run these applications before writing about them. There are a couple of things that struck me with this on in particular. First, I am not a discord user so just remembering how the application worked is a bit of a challenge. This featured issues like: "what email did I register my user under again?", "How do I create a private server again?", and who can forget "How has the bot permission model changed over the last 6 years".

Once I remembered all of that I had to get the application working again. All repositories used hadn't been updated since node 10 was LTS and the tooling landscape had changed. This began the drudgery of upgrading every Node version to be compatible with LTS, fixing all of the project dependencies and dropping yarn.

## Not everything needs to be maintained

As I reflect on this project as a whole its clear I learned a fair amount about electron and discord. However, upon returning to this project what was once interesting has just became a chore. Because, I am not a heavy discord user, it is hard for me to form a strong attachment to this project. Having projects to learn a new tool or framework is incredibly valuable, but maintaining those project after they have provided the desired learning is a recipe for discontentment. Sometimes keeping a project as a static asset locked in time is for the best. In this case if it wasn't for this blog series I would agree with treating this more like an ancient artifact to be observed and not touched would have been for the best.

Now that I endured some pain and disatisfaction the real fun can begin. What I have been enjoying with these blogs is seeing what I can learn from my past projects. Now that I have done the drudgery I can get on to the fun. In the next blog I am going to explore the build out of the Node.js server. 
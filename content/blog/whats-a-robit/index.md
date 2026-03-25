---
title: 'What is a robit?'
date: '2026-03-24'
---

## Something about robit

Continuing the thread of past projects in creation order we arive at robit. Robit was never anything I took to seriously and yet somehow it ended up being another multi-repo application that was barely used. In passing someone had told me that I would be nice if they could have a discord bot to send scheduled messages and a few other things. By this point in time I am sure discord has a very robust feature set that completely invalidates the original purpose of the bot I created.

## What I wanted to get out of this

My interest in doing this was less about making a functioning discord bot. Instead I was far more interested in learning more about electron. At its core I wanted to this project to focus on learning more about electron and I would take any path of least resistance to focus on what I really wanted to learn.

## The typical scope expansion

Once again the scope expanded far beyond what I needed. The original goal was just learn electron and build a discord bot that could send scheduled messages. By the time I was done I had way more than I needed. In the end the feature set of this was following

* The ability to setup scheduled messages
* The option to send commands that would be interpeted by the bot if you used `!robit` at the start
* The ability to play music in a voice channel
* The ability to configure permissions for users to certain `!robit` commands
* The ability to set command help for each custom command

As far as the commands go these commands included the following commands 
* The ability to broadcast a specific message to a channel
* The ability to broadcast a random message out of a set of messages to a channel
* The ability to add embedded content to a channel
* The ability to trigger a http request
* The ability to chain these actions together. For example Trigger HTTP request then broadcast a message.

Again the scope creep was not just in features but in process. In the end I supported running the server from node.js directly as well as running it from a docker image.

## The tech

By this point I was quite proficient and JavaScript so I decided all of the code would be JavaScript. Creating the server in Java or C# would have been possible but I found that it was way faster to prototype with JavaScript so instead I landed on using a Node.js server.

The toy architecure I ended up creating looked something like this.

![Robit Architecture](./robit-architecture.png)

## Getting back into this project

Before getting back into this project I wasn't sure how I would feel about it. As I have mentioned before I like to run these applications before writing about them. There are a couple of things that struck me with this on in particular. First, I am not a discord user so just remembering my log in information is hard enough. Having to figure out all the things that changed with creating a discord server, creating a bot, and figuring out how bot permissions have changed is even harder.

Once I remembered all of that I had to get the application working again. All repo's in question hadn't been updated since node 10 so I had to go through something similar with node and package updates.

## Takeaways

In this project I learned a lot about electron and discord. What I have found however is that upon returning to this project what was moderatly interesting just became a chore. I am not a heavy discord user and it has been hard to form a strong attachment to this project. Now that I have setup what this project is and loosely how it is structured we will dive into the server in the next blog.
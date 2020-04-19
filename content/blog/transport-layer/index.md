---
title: 'Transport Layer'
date: '2020-04-19'
---

# Transport Layer
For the first time ever I am going to dedicate a series of blogs to a single topic. In this case I am going to dive into network protocols. In this series I am hoping to dive into a couple different protocols starting with UDP and ending with HTTP, possibly including HTTP/3.

## Why do this
I usually enjoy looking at the lower levels of client server applications, which in many cases is the network layer between the client and server. In the past I have used TCP and HTTP in client server based applications, but I have never really gotten to dig in as far as I would like to. I will also be using this as an opperturnity to learn more about the network protocols that I use often.

## General Format
In general these next few blogs will hopefully follow a consistent pattern.

### Reviewing the network protocol
At this point we will look at the network protocol and help break down how the protocol is supposed to work. This will mostly be a recap of related RFC's maybe with some diagrams or other visuals to help aid in explaining how the protocol is supposed to work.

### Building an example of the protocol
In this section I hope to create a very basic implementation of the protocol in either Java or Javascript. This will simply talk about building it and layout some highlights but most of the work will be done in a github repository and referenced in this section.

### Look at the results in a network capture
Take a bit to show how you could use a wire capture application like wireshark to look at the bytes in transit over the wire.

### Example of a standard library
Since creating your own implementation of a wire protocol is probably not the best idea and probably not the most secure, at this point I will give examples of more reliable libraries that do the same sort of transportation.

### Example of a client server application using the protocol
In this section we will use the protocol to create a simple client server application. This might be something simple like a chat system or something like that.

### Interesting finds.
In this section I will highlight any interesting finds I maybe have stumbled upon during my research. An example of something I might look at here would be Quake's use of UDP.

### References
What did I reference to create this blog post.

## What I will not be covering
While I am hoping to take a good look at network protocols in these blogs, I will not be looking at network security. In my opinion network security (UDPS, TLS, HTTPS) fall into a sightly different realm than what I am looking at right now. At some later point if I enjoy this process I might attempt another series on cryptogrophy in which I would look at things like https.

## Notes
* explain what the next couple blogs are going to be
    * upd
    * tcp
    * http
    * graphql?
    * http/2?
    * http/3?
* Why am I doing this?
    * Always have enjoyed looking at the network layer.
    * Excuse to learn more about different protocols I have used.
* general format
    * review of the network protocol
    * example of the protocol in java or javascript?
    * maybe show the results in a wire capture (wireshark or fiddler or something)
    * example of the protocol using a standard library
    * example using the protocol in a client server application
    * any other interesting finds, like how quake did UDP.
    * links to supporting resources.
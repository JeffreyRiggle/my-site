---
title: 'Transport Layer'
date: '2020-05-06'
---

# Transport Layer
For the first time, I am going to dedicate a series of blogs to a single topic. In this case, I am going to dive into network protocols. In this series I am hoping to dive into a couple of different protocols starting with UDP and ending with HTTP, possibly including HTTP/3.

## Why do this?
I usually enjoy looking at the lower levels of client-server applications, which in many cases is the network layer between the client and server. In the past, I have used TCP and HTTP in client server-based applications, but I have never really gotten to dig in as far as I would like to. I will also be using this as an opportunity to learn more about the network protocols that I use often.

## General Format
In general, these next few blogs should follow a consistent pattern.

### Reviewing the network protocol
At this point, we will look at the network protocol and help break down how the protocol is supposed to work. This will mostly be a recap of related RFC's maybe with some diagrams or other visuals to help aid in explaining how the protocol is supposed to work.

### Building an example of the protocol
In this section, I hope to create a very basic implementation of the protocol in either Java or Javascript. This will simply talk about building it and layout some highlights but most of the work will be done in a Github repository and referenced in this section.

### Look at the results in a network capture
Take a bit to show how you could use a wire capture application like Wireshark to look at the bytes in transit over the wire.

### Example of a standard library
Since creating a unique implementation of a wire protocol is probably not the best idea and probably not the most secure, at this point, I will give examples of more reliable libraries that do the same sort of transportation.

### Example of a client server application using the protocol
In this section, we will use the protocol to create a simple client-server application. This might be something simple like a chat system or something like that.

### Interesting finds
In this section, I will highlight any interesting finds I maybe have stumbled upon during my research.

### References
What I referenced to create this blog post.

## What I will not be covering
While I am hoping to take a good look at network protocols in these blogs, I will not be looking at network security. In my opinion network security (UDPS, TLS, HTTPS) fall into a slightly different realm than what I am looking at right now. At some later point if I enjoy this process I might attempt another series on cryptography in which I would look at things like https.

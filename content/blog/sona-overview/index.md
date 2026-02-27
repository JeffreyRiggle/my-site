---
title: 'Creating an issue tracker'
date: '2026-02-26'
---

# Who needs an issue tracker anyway?

In the last series of blogs I wrote about the first public project I ever created. It only seems natural that my next long winded series would be on the second application to join my graveyard. I called this project the Support Orient Notification Application, or SONA for short.

## What the heck was I making?

While working on the text adventure creator application I had the thought, "What if someone actually used this?" Certainly they should be able to flag issues with it. Then the even more absured thought occurred to me, "What if that user doesn't even know what GitHub is?" Clearly if the end user didn't know what Github was they wouldn't be able to create a GitHub issue. Those two thoughts alone caused me to create my own issue tracker.

### Whats in a name?

It was time to level up, "textadventurecreator" is about as good of a name as "issuetracker". Cool service names is not a skill I posses. I don't have what it takes to make a BRB-DLL. I landed on IONS, Incident Oriented Notification System, until a quick search revealed several existing companies with the same idea. So I landed on SONA, which as it turns out, was already globally indexed by a video game instead.

## Getting the requirements sorted

What I wanted here was a hybrid between JIRA and GitHub's issues. If you had been paying attention there was a constant emphasis on "notification system". The plan was to allow this application to interact with whatever application you needed to by using webhooks. Created an issue, cool we have a webhook for that. On top of that these were the features I wanted to support

* Unauthenticted creation of issues. I didn't want users to have to create an account to file an issue.
* Dynamic attribution. Each ticket should be allowed to have any attributes you want.
* File upload. The original case of this involved uploading a log file.
* Notes per ticket. Each ticket needed to have a collection of notes to track how the ticket was progressing. This was just plain text no need for fancy HTML or markdown.

## The tech stack

Creating this service was nice, but the real goal for me was to learn some new skills. If this didn't work out I wasn't going to be too upset. At the time I was itching for an excuse to use [Go](https://go.dev/), so I decided the back-end for this application would be Go. 

The front-end was a bit more complicated of a story. By this time the industry was starting to fall out of love with good ol' fashion thick clients. If you don't know, these applications used TCP socket to send data to some desktop client and were usually written in C++, C# or Java. At the time my day job was all in on [Angular.js](https://angularjs.org/) with obsure pockets of [Dojo](https://dojotoolkit.org/). This was also a turbulent time. [React](https://react.dev/) was rising, the death of Angular.js was coming, and the quesitonable future around [Angular 2](https://angular.dev/) was present. Why would anyone want to add a compiler to the front-end framework anyway? One framework that was really appealing to me at the time was [Aurelia](https://aurelia.io/). As this was a project that only impacted me, I decided to go all in on Aurelia.

Now over time this morphed to include [NGINX](https://nginx.org/) and [docker](https://www.docker.com/). While the enterpise space was catching up to all the front-end options, the back-end/infrastructure side was dumping VMs for docker. At least that was what I was experiencing in my bubble.

## Some lessons take a while to sink in

In this project I did a bit better than in the last one. I was building software to solve a problem I had. Even better, the scope was limited to my desires and requirements. However there was one little thing I couldn't decide on. That being how did I want to run this application? 

I fell into the trap of making the backend work for all sorts of technologies. I had created a json config file that would be loaded at application startup which would control a wide variety of options. For the file storage there was support for the file system or an [S3 bucket](https://aws.amazon.com/s3/?nc2=type_a). Where things got more complicated was on the persistent storage side. By the end of this project, you could store your issues in RAM (ephemeral runtime space), [MySQL](https://www.mysql.com/), [DynamoDB](https://aws.amazon.com/dynamodb/?nc2=type_a), and [DataStore](https://cloud.google.com/products/datastore). If you hadn't noticed this was a mix of relational and non-relational databases. This forced me to tourcher these databases to support a very dynamic filter system.

## Running the system

For a while I had an instance of this running and I even used swagger to generate a Java client for my text adventure creator to use. This was running in AWS on a single t1.small instance for a while. However, after a year of no tickets I decided it was time to save the small amount of money the system was costing me.

## Coming back years later

To prepare for writing these blogs I wanted to run the system again to remember how it worked. Normally coming back to projects 6+ years later can be painful but this one wasn't to bad. I only ended up having to solve two problems and it only took me an hour or so. The first issue was Go 1.8 and Go 1.26 are very different. As it so happens you cannot run an application without a `go.mod` file anymore. Getting this working was as simple as running two commands

```bash
go mod init <repo>
go mod tidy
```

I cannot overstate my joy in how simple this was compared to what I am used to for upgrades. I am looking at you jigsaw. The second issue was around my Node version on the front-end. The last time I ran Aurelia I was using Node 10. As it turns out, Apple silicon and Node 10 don't play to nicely together. After a bit of digging and I updated to Node 16 I was up and running.

### The feature I didn't remember

I started looking at the source code for a postmortem code review when I noticed something strange in my nginx config.

```nginx
location /repos {
    proxy_pass https://api.github.com/;
}
```

What was I doing here? I search the [front-end](https://ilusr.com/sona-client) and [back-end](https://ilusr.com/sona-server) documentation I created to no avail. Finally I found a component on the front-end and it started to click. I had a `GitIssueViewer` and I remembered. The original pain point was, "What if a user couldn't file a GitHub issue". I had created a hook in my use of the application to create issues generated by SONA. Then I would link them back to the SONA issue via a `gitissue` attribute. If a ticket had that attribute present I would call into GitHub's API to get the issue and its comments to display back in my application.

This might seem obsure and it kind of was. The reason I did this was to display the issue in my application without a link. Originally I was just going to iframe it in, but if you know anything about security you know where this is going. [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking) is a problem and GitHub does protect against it. As a result I rebuilt a minimal set of github issues in my application just for this flow.

## Looking to the future

Much like my other posts, I wanted to establish the context before revisiting the code with a more critical lens. That’s where the next entry begins.
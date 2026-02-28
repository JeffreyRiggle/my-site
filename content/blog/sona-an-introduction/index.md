---
title: 'Creating an issue tracker'
date: '2026-02-26'
---

# Who needs an issue tracker anyway?

In the last series of blogs, I wrote about the first public project I worked on. It only seems natural that my next long-winded series would be on the second application to join my graveyard. So begins the tale of the Support Orient Notification Application, or SONA for short.

## What the heck was I making?

While working on the text adventure creator application, I had the thought, "What if someone actually used this?" Certainly, they should be able to flag issues with it. Then the even more absurd thought occurred to me, "What if that user doesn't even know what GitHub is?" Clearly, if the user were unaware of GitHub, they wouldn't be able to create a GitHub issue. Those two thoughts alone caused me to create my own issue tracker.

### What's in a name?

It was time to level up. "issuetracker" is about as good a name as "textadventurecreator". Coming up with cool names for projects is not a skill I possess. I am just not cut out to create the next BRB-DLL. Despite my best efforts, I landed on IONS, the Incident Oriented Notification System. That was until a quick search revealed several existing companies with the same idea. Instead, I landed on SONA, which, as it turns out, was already globally indexed by a video game instead.

## Getting the requirements sorted

What I wanted was a hybrid between JIRA and GitHub issues. If you had been paying attention, there was a constant emphasis on "notification system". The plan was that this application would interact with whatever application you needed to by using webhooks. Created an issue, cool, there is a webhook for that. Aside from that, these were the features I wanted

* Unauthenticted creation of issues. I didn't want users to have to create an account to file an issue.
* Dynamic attribution. Each ticket should be allowed to have any attributes you want.
* File upload. The original use case involved uploading a log file.
* Notes per ticket. Each ticket should have a collection of notes to track the ticket status. Just plain text would do. No need for fancy HTML or markdown.

## Choosing the right tech

Having a working service was a nice-to-have. The primary goal for me in this project was to learn some new skills. At the time, I was itching to use [Go](https://go.dev/), so I decided the back-end for this application would be Go.

The front-end was a bit more complicated. By this time, the industry was starting to fall out of love with good ol' fashioned thick clients. For those who are unaware, these applications used a TCP socket to send data to a desktop client. These applications were usually written in C++, C#, or Java. My day job was primarily [Angular.js](https://angularjs.org/) with obscure pockets of [Dojo](https://dojotoolkit.org/) and [Ember](https://emberjs.com/). This was also a turbulent time in the industry. [React](https://react.dev/) was rising, the death of Angular.js was on the horizon, and the uncertain future of [Angular 2](https://angular.dev/) was present. Why would anyone want to add a compiler when JavaScript ran in the browser without it? One framework that appealed to me at the time was [Aurelia](https://aurelia.io/). As this was a project that only impacted me, I decided to use Aurelia.

Over time, this morphed to include [NGINX](https://nginx.org/) and [Docker](https://www.docker.com/). While the front-end was drowning in options, the back-end was dumping virtual machines to chase after Docker. At least that was what I was experiencing in my bubble.

## Some lessons take a while to sink in

In this project, I was starting to learn from my past mistakes. This time, I was building software to solve my problems. Even better, the scope was limited to my desires and requirements. However, there was one little thing I couldn't decide on: how should I run this application?

I fell into the trap of making the backend work for all sorts of technologies. I had created a JSON config file that would be loaded at application startup. This would control a wide variety of options. For the file storage, you could use the file system or an [S3 bucket](https://aws.amazon.com/s3/?nc2=type_a). Where things got more complicated was on the persistent storage side. By the end of this project, you could store issues in RAM (ephemeral runtime space), [MySQL](https://www.mysql.com/), [DynamoDB](https://aws.amazon.com/dynamodb/?nc2=type_a), or [DataStore](https://cloud.google.com/products/datastore). If you hadn't noticed, this was a mix of relational and non-relational databases. This forced me to torture these databases to support a very dynamic filter system.

## Running the system
For a while, I had an instance of this running. I even used [Swagger](https://swagger.io/) to generate a Java client for my text adventure creator to use. This was running in AWS on a single t1.small instance for a time. However, after a year of no tickets, I decided it was time to save the small amount of money the system was costing me.

## Coming back years later

To prepare for writing these blogs, I needed to remember how it worked. I find the best way to do this is to run the application. Normally, coming back to projects 6+ years later can be exceptionally painful. This time it wasn't too bad. I only ended up having to solve two problems, and it only took me an hour or so. The first issue was that Go 1.8 and Go 1.26 are very different. As it so happens, you cannot run an application without a `go.mod` file anymore. Getting this working was as simple as running two commands.

```bash
go mod init <repo>
go mod tidy
```

I cannot overstate my joy in how simple this was compared to what I am used to for upgrades. I am looking at you, Jigsaw. The second issue was around my Node version on the front-end. The last time I ran Aurelia, I was using Node 10. As it turns out, Apple silicon and Node 10 don't play nicely together. After a bit of digging, I updated to Node 16, and I was up and running.

### The feature I didn't remember

I began to interrogate the source code for a postmortem code review. Then I noticed something strange in my nginx config.

What was I doing here? I searched the [front-end](https://ilusr.com/sona-client) and [back-end](https://ilusr.com/sona-server) documentation I created to no avail. Finally, I found a component in the front-end, and it started to click. I had a `GitIssueViewer` component, and I remembered. The original pain point was, "What if a user couldn't file a GitHub issue?" I had created a hook in my use of the application to create GitHub issues when SONA created a ticket. Then I would link them back to the SONA issue via a `gitissue` attribute. If a ticket had that attribute present, the front-end would call GitHub's public API to load the issue and its comments, which would be displayed in the application.

This might seem obscure, and it was. However, there was a justification for my madness. I wanted to display this in my application without a link. Originally, I wanted to iframe the issue, but if you know anything about security, you know where this is going. [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking) is a problem, and GitHub does protect against it. As a result, I rebuilt a minimal set of GitHub issues in my application just for this flow.

## Looking to the future

Much like my other posts, I wanted to establish the context before revisiting the code with a more critical lens. That’s where the next blog begins.
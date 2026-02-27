---
title: 'Creating an issue tracker'
date: '2026-02-25'
---

# Who needs an issue tracker anyway?

In the last series of blogs I wrote about the first public project I ever created. It only seems natural that my next long winded series would be on the next application. The second entry in my growing list of unused projects was the Support Orient Notification Application, or SONA for short.

## The origin story

While working on the text adventure creator application I had the thought, "What if someone actually used this, certainly they should be able to flag issues with it?". Then the even more absured thought occurred to me, "What if that user doesn't even know what GitHub is?". Clearly if the end user didn't know what Github was they wouldn't be able to create a GitHub issue. Those two thoughts alone caused me to create my own issue tracker.

### Whats in a name

Originally I wanted to call the application IONS short for incident oriented notification system. However doing a quick google search I found quite a few refences to other companies in software called IONS. So, to avoid a very unlikely cease and desit I named the project to SONA. Now I am sure that name has been hyper indexed to be synonomous with the game league of legends which was not a connection I made at the time.

## The product requirements

So what I wanted here was some sort of hybrid between JIRA and GitHub's issues. If you had been paying attention there was a constant emphasis on "notification system". The plan was to allow this application to interact with whatever application you needed to by using webhooks. Created an issue cool we have a webhook for that. On top of that these had been all of the features I wanted to support

* Unauthenticted creation of issues. I didn't want users to have to create an account to file an issue
* Dynamic attribution, each ticket should be allow to have whatever attributes you want to on it and it should just be a dumb key value pair
* File upload. The original case of this involved uploading a log file and I wanted to make sure that worked.
* Notes per ticket. Each ticket needed to have a collection of notes to track how the ticket was progressing. This was just plain text no need for fancy HTML or markdown.

## The tech stack

In this case creating this service was nice but the real goal for me was to learn some new skills. If this didn't work out I wasn't going to be too upset. At the time I was itching for an excuse to use Go so I decided I would code my back-end for this application in Go. The front-end was a bit more complicated of a story By this time the industry was starting to fall out of love with good ol' fashion thick applications. For those of you that have no idea what I am saying these applications used TCP socket to send data to some desktop client. My day job was all in on [Angular.js](https://angularjs.org/) with obsure pockets of [Dojo](https://dojotoolkit.org/) represenation. This was also a turbulent time. [React](https://react.dev/) was rising, the death of Angular.js and the quesitonable future around [Angular 2](https://angular.dev/). What is this new typescript thing anyway? One framework that was really appealing to me at the time was [Aurelia](https://aurelia.io/). Since this was a project that only impacted me I decided why not give Aurelia a try.

Now over time this morphed to include [NGINX](https://nginx.org/) and [docker](https://www.docker.com/) as docker was also gaining in popularity at this time.

## Some lessons take a while to sink in

In this project I did a bit better than in the last one. I was building software to solve a problem I had and the scope was limited to my desires and requirements. However there was one little thing I couldn't decide on. That being how did I want to run this application? I fell into the trap of make this backend work for all sorts of technologies instead of just the one that works. On the backend, I had created a json config file that would be loaded at application startup that would control a wide variety of options. For the file storage those could be stored in a file system or in [S3](https://aws.amazon.com/s3/?nc2=type_a). Where things got more complicated was on the persistent storage side. By the end of this project you could store your issues in RAM (ephemeral runtime space), [MySQL](https://www.mysql.com/), [DynamoDB](https://aws.amazon.com/dynamodb/?nc2=type_a), and [DataStore](https://cloud.google.com/products/datastore). If you hadn't noticed this was a mix of relational and non-relational databases that forced me to tourcher these databases to support a very dynamic filter system.

## Running the system

For a while I had an instance of this running and I even used swagger to generate a Java client for my text adventure creator to use. I had this running the application in AWS on a single t1 instance for a while. However after a year of no tickets I decided it was time to save the small amount of money the system was costing me.

## Coming back years later

To prepare for writing these blogs I wanted to run the system again to remember how it worked. Normally coming back to projects 6+ years later can be painful but this one wasn't to bad. I only ended up having to solve two problems and it only took me an hour or so. The first issue was Go 1.8 and Go 1.26 are very different turns out you cannot run an application without a `go.mod` file anymore. Getting this working was as simple as running two commands

```bash
go mod init <repo>
go mod tidy
```

I cannot overstate my joy in how simple this was compared to what I am used to for things like this. The second issue was the last time I ran Aurelia I was using Node.js version 10. As it turns out Apple silicon and Node 10 don't play to nicely together. After a bit of digging and updating to use Node 16 I was up and running.

### The feature I didn't remember

As I was looking at the source code and doing basically a postmortem code review on all of my code I noticed a strange setting in my nginx config.

```nginx
location /repos {
    proxy_pass https://api.github.com/;
}
```

I search the [front-end](https://ilusr.com/sona-client) and [back-end](https://ilusr.com/sona-server) documentation I created for this application to no avail. Finally I found a component on the front-end and it started to click. I had a `GitIssueViewer` and I remembered. The original pain point was, "What if a user couldn't file a git issue". I had actually created a hook in my use of the application to create issues generated by SONA and then link them back to the SONA issue via a `gitissue` attribute. If a ticket had that attribute present I would actually call into GitHub's API to get the issue and its comments to display back in my application.

This might seem obsure but the reason I did this was I wanted to display the issue in my UI. Originally I was just going to iframe it in but if you know anything about security clickjacking is a thing and GitHub does protect against it. So because of that I rebuilt a minimal set of that UI in my application just for this flow.

## Looking to the future

Much like my other posts I wanted to give some high level context on this application before I started tearing it apart. Next I will be focusing on my view of the backend code and how it turned out.
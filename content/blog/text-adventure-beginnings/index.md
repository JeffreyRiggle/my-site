---
title: 'Side Project Beginnings'
date: '2026-01-03'
---

# Public side projects, a beginning

As I mentioned in the last blog entry I will be going over my past projects and evaluating them. The me the only logical step is to start from the beginning, or at least close to it. Very early on as I was leaving college and starting my first job as a software engineer it became a clear to me that college had given me the core foundational knowledge on computer science but I was lacking a ton of practical application skills. In order to better understand the field I decided it was time to start building some applications instead of focusing completely on algorithms and theory.

Since I had the most typical entry ramp into computer science I decided that I would do something with games. Given this I decided the easiest place to start would be something with text adventure games. Since I tend to lack creativity and storyline creation I set out to create a text adventure framework so that others could create games on my system. So began one of the largest projects I have done outside of work. This was also for an audiance of zero people. As far as I know to this day no one has every even attempted to use it.

> Consider, do I need a disclaimer about what I have learned, am I going to recap all learnings in a final post or do recaps along the way.

## Hello World

Energized with a fun idea I set out to build this framework. I had decided to go in with a couple of contraints.

### Built on Java

At the time I was mostly proficient with third generation programming languages and the majority of code I had written was either in Java or C#. My career at the time had me working heavily in C#. I had justified this choice a couple of ways. First I wanted it to be cross platform and I knew that by default Java was very much so cross platform and I would basically get that for free. This focus on cross platform was one of the major reasons I didn't do the project in C#. Also I knew that the all to popular up and coming game minecraft was written in Java. I figured if a 3d rendered game could run in Java so could a text adventure engine.

### Only standard Library

I had decided that if I wanted to learn something deeply I should only use the standard library and import nothing else. In the end I fell sort of this one. While I tend to cover this more later the notable exceptions ended up being Java Spring, JavaFx, and izpack.

## Execution

While I will not cover each topic very deeply here I do find it important to talk about how this project evolved over time.

### Early days

From very early on I decided that I would manage this project with Maven. In the earliest versions of this I had a single project that I was working on in eclipse and building with Maven. This started off just being a project that I kept on my local computer and backed up on an external harddrive and flash drive for a few years. Over time the project grew and it had become a monorepo of sorts with around 9 different libraries inside of it.

### Growing up

At some point I had lost my flash drive and it got me worried I could lose the project completely. Due to this little scare I decided it was time to start backing up my project online. For some reason I was worried about sharing my code publically so I decided I would create a bitbucket account and back the project up in a private repository.

During this time the industry had decided it was no longer cool to store all code in a single repositroy and that instead a ton of small repositories should be managed and versioned independently. Since I was trying to be a good engineer and follow the industry I spent a fair amount of time creating seprate projects for each of my 9 libraries. This involved breaking the library out of the monorepo, creating a new bitbucket repository, publishing an artifact to an s3 bucket on my AWS account just so I could download it again via Maven for the projects that depended on that code.

### Getting ready for "Release"

At some point I had decided enough is enough, I am going to put this code on GitHub as a public repository and that will be a released version. I was worried that once it was out there lots of people would see what I was working on so I decided to work feaverishly on geting the project "release ready". What I ended up defining as release ready was the following critera. 

First the project had to have very high test coverage. If there was a class it needed to be unit tested. It did not matter how small or pointless. To put this into context even the about dialog in the main application had unit tests. 

The next major requirement I had decided on being a "blocker" was that every public library need to have every single method documented with xmldoc and that all projects needed to have generated documents. This started off with spending tons of time writing xmldoc and making sure everything is covered. Then I had to fight with Maven to make sure the docs would actually generate correctly.

Lastly if I was going to send this out into the world every respectable bit of software that runs on a users machine needs and install right? This began a long journey of creating an install workflow to basically just plop a batch script into windows to start the game builder. In this effort I found izpack and spent a good long time learning how to create an install flow.


### Post Release

Soon after moving everything to GitHub and putting everything in a public repository I realized that no one is watching. If you want people to actually see what you are building you need to be able to market your work and that was not something I was good at nor wanted to get good at. From that point on I felt free to just work on the things that I had found interesting or wanted to learn.

One of the first major changes happened when I was building my personal website. I decided I wanted that website to scrape all of my GitHub content and have pages for everything I put in the docs folder of any of my projects along with any associated Java documentation. During that time I moved a lot of documentation I had sitting in html documents on an s3 bucket about how to use this application to markdown files in GitHub.

Not long after I created my website I decided I would go back and create github workflows for all of my projects. During that time all of these repositories got their own set of actions to build and test the repository on every PR. Also in order to build on every PR I realized that how I was integrating with Maven and S3 was not working out very well anymore. Due to this I switched over to having my projects publish to GitHub's Java repository.

At some point along the way Java updated to jigsaw and I decided it would be nice to make some of my "internals" actually internal so I updated to Java 9.

While I never really completed it the last thing I decided to focus on and never really got around to merging back into the project was creating some end-to-end tests for the main application. For this I was playing around with test-fx. Ultimately this never got completed because I was having a hard time getting the tests to pass on the runners. They had worked just fine on my local but for some reason I never really cared to debug fully I couldn't get them to pass in the runner.


## Current state of the project

Once the dust had all settled I had been working on and off on the project for at least a decade. In the end no one to my knowledge has ever used it and it remains mostly unheard of in GitHub.

### Project setup

The final makeup of the project was the following repositories. While I do not think lines of code is a great metric I do think in this case it highlights the amount of time spent on the project more so than anything.

| Name | Language | Purpose | Lines of code |
|-|-|-|
| [java-core](https://github.com/JeffreyRiggle/java-core) | Java | Library containing anything I deemed a core utility |
| [logrunner](https://github.com/JeffreyRiggle/logrunner) | Java | Abstraction to log output to csv or tsv file |
| [java-persistencelib](https://github.com/JeffreyRiggle/java-persistencelib) | Java | Library to save xml files to disk |
| [persist-lib](https://github.com/JeffreyRiggle/persist-lib) | Javascript | Javascript reimplementation of java-persistencelib |
| [playerlib](https://github.com/JeffreyRiggle/playerlib) | Java | Library for entity models and abstractions |
| [player-lib](https://github.com/JeffreyRiggle/player-lib) | Javascript | Javascript reimplementation of playerlib |
| [playerlib-example](https://github.com/JeffreyRiggle/playerlib-example) | Java | Example application using playerlib |
| [gsmlib](https://github.com/JeffreyRiggle/gsmlib) | Java | Library for game state models and abstractions |
| [gamestate-manager](https://github.com/JeffreyRiggle/gamestate-manager) | Javascript reimplemenation of gsmlib |
| [iroshell](https://github.com/JeffreyRiggle/iroshell) | Java | Multipurpose JavaFx application shell abstraction |
| [iroshell-examples](https://github.com/JeffreyRiggle/iroshell-examples) | Java | Example applications build on iroshell |
| [textadventurelib](https://github.com/JeffreyRiggle/textadventurelib) | Java | Core library required to play the text adventure games |
| [text-adventure-lib](https://github.com/JeffreyRiggle/text-adventure-lib) | Javascript | Javascript reimplemenation of textadventurelib |
| [textadventurecreator](https://github.com/JeffreyRiggle/textadventurecreator) | Java | The main application that created text adventure games |

This breaks out into a dependency graph that looks something like this.

![Dependency graph](./tav-deps.png)

### Features
I have written quite a bit of documentation on this in my personal site so I am not going to repeat all of it. Instead I will highlight some core features with some links. If you are interested the main documentation can be found [here](https://ilusr.com/textadventurecreator).

| Feature | Category | high level details |
|-|-|-|
| Export as App | Export | The ability to export the game as a jar |
| Export as Web | Export | The ability to export the game as an html document |
| Export as Electron | Export | The ability to export as an electron app |
| Entity creation | Core | The ability to define players and NPC's/enemies |
| Macros | Core | The ability to replace text with some player details |
| Game State creation | Core | The ability to define all actions and triggers in a game state |
| Text Trigger | Core-Triggers | The ability to trigger some action on user text |
| Timed Trigger | Core-Triggers | The ability to trigger some action on a timer |
| Player Triger | Core-Triggers | The ability to trigger some action based on player state |
| Scripted Trigger | Core-Triggers | The ability to trigger based on some executed javascript |
| Multi-part trigger | Core-Triggers | The ability to union multiple triggers together |
| Append Action | Core-Actions | Ability to add text to the game output |
| Complete Action | Core-Actions | The ability to complete a game state |
| Execute Action | Core-Actions | The unfortunate action that can trigger a process on the users machine. I have no idea why I thought this was a good idea. |
| Modify Player Action | Core-Actions | The ability to change player state |
| Save action | Core-Actions | The ability to save the game state |
| Script action | Core-Actions | Any action that could be expressed in javascript |
| Finish action | Core-Actions | The action that completed the game |
| Text and Input View | Layout | The base look and feel |
| Text and Button View | Layout | A look and feel that replaces a text input with buttons |
| Content Only | Layout | A display only view for things like transition images or videos |
| Custom layout | Layout | A customizable grid layout of whatever controls you want for the game state, including custom styling |
| Libraries | Libraries | User defined exportable collections of players/actions/triggers or layouts |
| Debugger | DevTools | A crude debugger to see how playing the game changed the state |
| Language Packs | Localization | The ability for users to define their own localization to be used in the IDE |
| Mods | DevTools | The ability for a developer to add a runtime loaded mod into the IDE |

The main point I want to make here is there was a rather large feature set to this thing.


## Lessons learned at the highlest level

* No one is watching and marketing is everything
* You can spend a lot of time doing things that don't matter (just because its industry standard doesn't mean it is a good idea for every project)
* Taking a look at the field can be nice. Turns out that there had been engines like twine that already existed and likely did a better job than me

## Moving forward

Close this off next one is going to be a deep dive into java-core and log runner.
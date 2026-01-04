---
title: 'Side Project Beginnings'
date: '2026-01-03'
---

# Public side projects, a beginning

As I mentioned in the last blog entry I will be going over my past projects and evaluating them. The only logical step is to start from the beginning, or at least close to it. Very early on as I was leaving college and starting my first job as a software engineer. At this time it became a clear to me that college had given me the core foundational knowledge on computer science, but I was lacking a ton of practical application skills. In order to better understand the field I decided it was time to start building some applications instead of focusing completely on algorithms and theory.

Since I had the most typical entry ramp into computer science I decided that I would do something with games. Given this I decided the easiest place to start would be something with text adventure games. Since I tend to lack creativity and storyline creation I set out to create a text adventure framework so that others could create games on my system. So began one of the largest projects I have done outside of work. This was also for an audiance of zero people. As far as I know to this day no one has every even attempted to use it.

## Hello World

Energized with a fun idea I set out to build this framework. I had decided to go in with a couple of contraints.

### Built on Java

At the time I was mostly proficient with third generation programming languages and the majority of code I had written was either in Java or C#. My career at the time had me working heavily in C#. I had justified this choice a couple of ways. First I wanted it to be cross platform and I knew that by default Java was very much so cross platform and I would basically get that for free. This focus on cross platform was one of the major reasons I didn't do the project in C#. Also I knew that the all to popular up and coming game [Minecraft](https://en.wikipedia.org/wiki/Minecraft) was written in Java. I figured if a 3d rendered game could run in Java so could a text adventure engine.

### Only standard Library

I had decided that if I wanted to learn something deeply I should only use the standard library and import nothing else. In the end I fell sort of this one. While I tend to cover this more later the notable exceptions ended up being Java Spring, JavaFx, and izpack.

## Execution

While I will not cover each topic very deeply here I do find it important to talk about how this project evolved over time.

### Early days

From very early on I decided that I would manage this project with [Maven](https://maven.apache.org/). In the earliest versions of this I had a single project that I was working on in [Eclipse](https://eclipseide.org/) and building with Maven. This started off just being a project that I kept on my local computer and backed up on an external harddrive and flash drive for a few years. Over time the project grew and it had become a monorepo of sorts with around 9 different libraries inside of it.

### Growing up

At some point I had lost my flash drive and it got me worried I could lose the project completely. Due to this little scare I decided it was time to start backing up my project online. For some reason I was worried about sharing my code publically so I decided I would create a bitbucket account and back the project up in a private repository.

During this time the industry had decided it was no longer cool to store all code in a single repositroy and that instead a ton of small repositories should be managed and versioned independently. Since I was trying to be a good engineer and follow the industry I spent a fair amount of time creating seprate projects for each of my 9 libraries. This involved breaking the library out of the monorepo, creating a new bitbucket repository, publishing an artifact to an s3 bucket on my AWS account just so I could download it again via Maven for the projects that depended on that code.

### Getting ready for "Release"

At some point I had decided enough is enough! I am going to put this code on GitHub as a public repository and that will be a released version. I was worried that once it was out there lots of people would see what I was working on so I decided to work feaverishly on geting the project "release ready". What I ended up defining as release ready was the following critera. 

First the project had to have very high test coverage. If there was a class it needed to be unit tested. It did not matter how small or pointless. To put this into context even the about dialog in the main application had unit tests. 

The next major requirement I had decided on being a "blocker" was that every public library need to have every single method documented with javadoc and that all projects needed to have generated documents. This started off with spending tons of time writing javadoc and making sure everything is covered. Then I had to fight with Maven to make sure the docs would actually generate correctly.

Lastly if I was going to send this out into the world every respectable bit of software that runs on a users machine needs and install right? This began a long journey of creating an install workflow to basically just plop a batch script into windows to start the game builder. In this effort I found [IzPack](https://izpack.org/) and spent a good long time learning how to create an install flow.


### Post Release

Soon after moving everything to GitHub and putting everything in a public repository I realized that no one is watching. If you want people to actually see what you are building you need to be able to market your work and that was not something I was good at nor wanted to get good at. From that point on I felt free to just work on the things that I had found interesting or wanted to learn.

One of the first major changes happened when I was building my personal website. I decided I wanted that website to scrape all of my GitHub content and have pages for everything I put in the docs folder of any of my projects along with any associated Java documentation. During that time I moved a lot of documentation I had sitting in html documents on an s3 bucket about how to use this application to markdown files in GitHub.

Not long after I created my website I decided I would go back and create github workflows for all of my projects. During that time all of these repositories got their own set of actions to build and test the repository on every PR. To build on every PR I realized that how I was integrating with Maven and S3 was not working out very well anymore. Due to this I switched over to having my projects publish to GitHub's Java repository.

At some point along the way Java updated to jigsaw and I decided it would be nice to make some of my "internals" actually internal so I updated to Java 9.

While I never really completed it the last thing I decided to focus on was creating some end-to-end tests for the main application. For this I was playing around with test-fx. Ultimately this never got completed because I was having a hard time getting the tests to pass on the runners. They had worked just fine on my local but for some reason I never really cared to debug fully I couldn't get them to pass in the runner.


## Current state of the project

Once the dust had all settled I had been working on and off on the project for at least a decade. In the end no one to my knowledge has ever used it and it remains unheard of.

### Project setup

The final makeup of the project was the following repositories. While I do not think lines of code is a great metric I do think in this case it highlights the amount of time spent on the project more so than anything.

| Name | Language | Purpose | Lines of code |
|-|-|-|
| [java-core](https://github.com/JeffreyRiggle/java-core) | Java | Library containing anything I deemed a core utility | 3562 |
| [logrunner](https://github.com/JeffreyRiggle/logrunner) | Java | Abstraction to log output to csv or tsv file | 293 |
| [java-persistencelib](https://github.com/JeffreyRiggle/java-persistencelib) | Java | Library to save xml files to disk | 1586 |
| [persist-lib](https://github.com/JeffreyRiggle/persist-lib) | Javascript | Javascript reimplementation of java-persistencelib | 270 |
| [playerlib](https://github.com/JeffreyRiggle/playerlib) | Java | Library for entity models and abstractions | 4100 |
| [player-lib](https://github.com/JeffreyRiggle/player-lib) | Javascript | Javascript reimplementation of playerlib | 956 |
| [playerlib-example](https://github.com/JeffreyRiggle/playerlib-example) | Java | Example application using playerlib | 1459 |
| [gsmlib](https://github.com/JeffreyRiggle/gsmlib) | Java | Library for game state models and abstractions | 935 |
| [gamestate-manager](https://github.com/JeffreyRiggle/gamestate-manager) | Javascript reimplemenation of gsmlib | 306 |
| [iroshell](https://github.com/JeffreyRiggle/iroshell) | Java | Multipurpose JavaFx application shell abstraction | 10940 |
| [iroshell-examples](https://github.com/JeffreyRiggle/iroshell-examples) | Java | Example applications build on iroshell | 1444 |
| [textadventurelib](https://github.com/JeffreyRiggle/textadventurelib) | Java | Core library required to play the text adventure games | 25045 |
| [text-adventure-lib](https://github.com/JeffreyRiggle/text-adventure-lib) | Javascript | Javascript reimplemenation of textadventurelib | 7437 |
| [textadventurecreator](https://github.com/JeffreyRiggle/textadventurecreator) | Java | The main application that created text adventure games | 55066 |

In total that is close to 115k lines of code split between java and javascript.

This breaks out into a dependency graph that looks something like this.

![Dependency graph](./tav-deps.png)

### Features
In the spirit of a fair analysis of all of this code I find that it is at least useful to document all of the features wrapped up in this project. Much of this is documentated on this in my personal site so I am not going to repeat all of it. Instead I will highlight some core features. If you are interested the main documentation can be found [here](https://ilusr.com/textadventurecreator).

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
| Execute Action | Core-Actions | The ability to trigger a process on the users machine |
| Modify Player Action | Core-Actions | The ability to change player state |
| Save action | Core-Actions | The ability to save the game |
| Script action | Core-Actions | Any action that could be expressed in javascript |
| Finish action | Core-Actions | The action that completed the game |
| Text and Input View | Layout | The base look and feel |
| Text and Button View | Layout | A look and feel that replaces a text input with buttons |
| Content Only | Layout | A display only view for things like transition images or videos |
| Custom layout | Layout | A customizable grid layout of whatever controls you want for the game state, including custom styling |
| Libraries | Libraries | User defined exportable collections of players/actions/triggers or layouts |
| Debugger | DevTools | A crude debugger to see how playing the game changes the state in the IDE |
| Language Packs | Localization | The ability for users to define their own localization to be used in the IDE |
| Mods | DevTools | The ability for a developer to add a runtime loaded mod into the IDE |


## Lessons learned at the project level

A warning to the reader. Many of these lessons are based around the constraints and end state of the project. Had this project been worked on by a team of engineers my perspectives would have been different. Remember that the end state of this project is a solo developer built a thing that was unused but is now in the public domain.

### Just because its on GitHub doesn't mean anyone will notice

I think this is one leason that I wish I would have learned early on. There was a fair amount of time I spent scrambling to get the code "ready for the public to view". I was concerned that once you put something on GitHub everyone would see it. In reality I think a handful of people have glanced at the landing page, saw there was a sparce readme and moved on. The largest reader of my code may be some AI model trained on all public GitHub data.

**The most important leason for me around this is that you can waste an immense amount of time expanding code coverage and documentation on a project.** If you are not working on a team and do not plan to market your work, the returns for high test coverage and documentation are questionable. At the very least critical or regression prone code paths should be tested and documented. Now in modern times this may be less important because you could offload some of this work to an AI agent or otherwise. However if you are going to do that you should really scrutize the output because it might not be documenting things correctly or testing things effectively. It is unclear to me if it is even worth the tokens or time to review to autogenerate these sorts of things for solo side projects. What is clear to me is that incorrect documentation or tests are worse than having no documentation or tests.

In time what I have come to assume is that if people are going to look at your project they will have to be lead to it via some sort of marketing on social media. Also if you want to capture your audiance you will want a nice readme and most likely some flashy images to really draw the attention. I do really have a desire to strongly market my work so these assumptions may be incorrect.

### Industry standards are highly contextual

In this case I think I made a classic junior to mid-level engineering mistake. That is the mindset of treating the industry standard as the best practice for all use cases. In time I have grown to realize that industry standards are guidelines and are highly contextualized for engineering with many active engineers working on the same project.

Take for instance with this project. I intentionally broke apart a mono-repo into a series of small targetted repositories without considering what I had to gain or lose. In this case I lost a lot of time breaking apart a mono-repo and incurred the cost of managing dependencies without getting observable benefits. Here are some cases that may have made the investment worth it.

#### Community involvement

I could have built a community around something like iroshell and got the benefit of many engineers helping me on this framework. This did not happen because I did not take an active effort to build a community. In a single instance a developer reached out with an interest in a single part of the framework and I choose not to engage with that engineer. Had I have been truely interested in a community I missed a real oppertunity there.

#### Code Reuse

Another possible benefit I could have gotten out of all of this work would have been to do more Java projects that built on things like iroshell, java-core, or logrunner. Instead I have not picked up another Java project since the completion of this one. This means I missed out on all of the hard work I put in to make iroshell reusable for other possible applications.

### Observing the problem space has its benefits

At no point during all of this work did I ever stop to look around at what other people had been doing. Had I have done so I would have found that there was already a pretty big community around tools very similar to the one I created. For instance [Twine](https://twinery.org/) is from what I gather a rather powerful tool that can do something very similar to what I created. I do not know that this would have detered me from taking on this project. However, taking the time to read about the project could have given me a chance to see what features others like and some of the pain points. If I wanted to create a product that got traction that was a missed oppertunity to build for the community.

### Not all features are worth the investment

There are a handful of features that I either question why I made them in the first place or know that they had been premature. In particular the execute action in the game engine itself is a feature without a strong purpose. I am still not sure what the benefit would be and it is mostly a security risk. On the other side features like modding and libraries had been premature. Without a community using the tool there was no reason to create commuity tools like modding. 

## The highlights

So far I have been very critial of all of the work I did so far but I would be remiss if I didn't point out the benefits. On the off chance a junior to mid level developer finds the blog and reads it I wouldn't want to give the impression that this was a completly wasted effort. While I may have some regrets about the features I choose to work on or the way the project was recieved it was a very valuable learning lesson even from a techinical level.

### Learned JavaFX

At the start of this project my experience with Java UI's had been very small college projects using [Swing](https://en.wikipedia.org/wiki/Swing_(Java)). At work I was learning about C# and WPF but those lessons had not been fully transferable. In this case I learned how to build a framework, a UI, and autogenerated games all on top of JavaFX. I really enjoyed learning about JavaFX's use of css and using tools like [ScenicView](https://github.com/JonathanGiles/scenic-view). While I have yet to use this knowledge in a professional setting it was great fun to learn.   

### Installers

While I do not think I nailed the implemenation I did get to learn the basics of installers and the pain points of creating one. Up until this point, the software I wrote either had a team working on an installer or was just a jar/exe that someone else had to figure out how to run for themselves. In the modern era with web first and electron apps this may be an irrelevant skill but it helped remind me that different users have different machines which may or may not have some of your prerequisits for your software to run.

### It still works

With fairly minimal effort I was able to come back to this years later and get the thing building again. The biggest pain points I had are the kinds that I expected. Those being things like setting up my machine to actually build Java again by installing OpenJDK and Maven, as well as configuring maven to install from GitHub.

### Project completion

This was the first project I really got to play every possible role in. I came up with the idea, oversaw all the technical decisions, implemented the entire project, designed the UX, and even did some terrible icon artwork to finish it all off. I got to see this thing from a silly drawing in a notebook to a completed project that could still be used today.

In this I learned how to stick something out even when it gets a bit hard or boring. There had been days when doubling down on a techinical issue by myself was hard and I wasn't finding any great documentation online.

I cannot overstate how valuable that was to me. I find that when working at a company with a clear goal in mind there are certain trade-offs you must make, and as an engineer those are not always to the benefit of your technical growth. You may want to spend a large amount of time optimizing a routine or playing around with a new technology/framework/language. In many cases doing that on the job is borderline neglagent and is not in the vested interest of the company. However when you are doing a project on your own without direct financial incentives you are free to make whatever choices you want. The cost incurred either monetarily or in time is on you as it should be when the learning is not directly aligned with the company goal. 

In the modern era of AI I am not sure how easy it would be to recreate this experience. For example a new developer that needed an icon in a specify way might not try to draw it themselves. Instead they might just ask an AI to generate it for them. Also AI can provide some excellent rubber ducking that was just not possible when I attempted this project.

## Digging deeper

By now I have told a pretty exhaustive history of this application covering topics across the board but I want to dive deeper into the technical design choices. To do this I will be writing some follow up blogs about specific libraries and some of the technical design choices I made and how I see those decisions now.
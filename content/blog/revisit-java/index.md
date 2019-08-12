---
title: 'Revisiting java'
date: '2019-08-12'
---

## Why java?

As part of creating my website, I decided it would be a good idea to go back and update some projects I haven't touched in a while. If you haven't read my last post the idea is that my projects are listed on my website and those pull from my GitHub repositories to create pages.

While going through these I stumbled upon some of the first projects I put into Github. Most of these projects had been java based projects. Looking back on these projects I wanted to do two things: package javadocs, and upgrade to java 11. All of my projects had been written in java 8 before [jigsaw](https://openjdk.java.net/projects/jigsaw/), so I knew this might be a bit of a challenge.

## Getting down to it.

Almost immediately I ran into issues. The first library I decided to work on was my [core library](https://github.com/JeffreyRiggle/java-core). The first change I noticed was that [JavaFX](https://openjfx.io/) was no longer in the standard library. It appears that this had a relatively short run under the jdk justified by [release cadence](https://blogs.oracle.com/java-platform-group/the-future-of-JavaFX-and-other-java-client-roadmap-updates).

So after figuring out my JavaFX issue the process went rather smoothly. Figuring out jigsaw was not as hard as I imagined it might be. My toolchain had little to no issue handling java 11. Maven worked fine and my testing frameworks continued to work great.

However, at some point I got around to working more with JavaFX and started to run into more issues. I think I might just be an edge case, but in java 8 I was abusing some `internal/protected` features of JavaFX to solve problems I had. Since jigsaw did a good job of encapsulating protected features, I immediately had issues to solve. The big problem I had was JavaFX seems to be a rather mature UI toolkit but it is still missing some features. 

The big feature I was having issues around was JavaFX's Tab. From what I can tell my use case might have been a bit of an edge case and there is an open issue with the [jdk](https://bugs.openjdk.java.net/browse/JDK-8091261) this issue. In the end, I had to duplicate logic from the library itself to accomplish the same outcome.

## Take aways

### Java is not my first choice for UI anymore.

I have spent a decent portion of my time writing software working with front-end technologies. I have used many frameworks and languages including: [WinForms](https://docs.microsoft.com/en-us/dotnet/framework/winforms/), [WPF](https://docs.microsoft.com/en-us/dotnet/framework/wpf/), [Silverlight](https://www.microsoft.com/silverlight/), [swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/), [JavaFX](https://openjfx.io/) and [qt](https://www.qt.io/). In my experience, the frameworks that seem to get it right separate the view logic from the interaction logic (sorry WinForms and swing). One thing I do really like about JavaFX is that it separates the view logic (fxml), the interaction logic (java) and the style logic (css).

I have, however, spent a good amount of time working in html/javascript based UI's. In this time I have noticed that UI development goes quite a bit faster when every tweak does not require a full recompile of your application. I have also noticed that it is rather nice to not have to switch between a bunch of optional tooling to debug your issues.

|                  | JavaFX                                                  | web                                              |
|------------------|---------------------------------------------------------|--------------------------------------------------|
| Code Debugging   | Console output or ide of your choice (eclipse/netbeans) | Browser of your choice                           |
| Style inspection | [Scenic View](https://github.com/JonathanGiles/scenic-view) | Browser of your choice                           |
| Toolchain        | Maven or Gradle                                         | Too many options, but none are actually required |

Outside of that, the things that java might be better able to handle are interacting with the OS and maybe performance.

#### Performance
I have not done any real performance testing and I might do this in the future. However, in both JavaFX and web-based technologies you are interacting with the OS via a virtual machine. The only framework above that would not be limited to a virtual machine would be qt. Because of this, I am likely to believe that performance should be relatively equal between JavaFX and web-based UI's.

#### OS access
This one is a bit tricky. While web-based technologies cannot and should not be able to access the host OS from the browser, there is a way to work around the restrictions of the browser. In many cases, this comes in the way of [Electron](https://electronjs.org/) or [NW.js](https://nwjs.io/).

There are plenty of resources for Electron, but I will give a quick recap. Electron allows you to distribute your web UI as a standalone application. This application ships its own version of chromium and uses NodeJS to interact with the host OS.

In the case of required OS access, there might be a good argument for using something like JavaFX instead of something like Electron.

### Final thoughts
Java isn't a terrible language nor is JavaFX a bad technology. However, lately, I am finding it hard to justify spending the extra time to write a side project in something like JavaFX versus a web-based technology.
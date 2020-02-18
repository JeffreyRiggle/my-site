---
title: 'Aurelia'
date: '2020-02-18'
---

# Coming back to Aurelia
A while back I was [comparing](https://github.com/JeffreyRiggle/useless-user-results) a couple of different javascript front-end frameworks. In hindsight, I probably could have saved some time using [Real World](https://github.com/gothinkster/realworld) for my comparisons. 

During this time I decided to give [Aurelia](https://aurelia.io/) a shot. At first, it seemed like an ideal framework. At the time I had mostly been using [Angularjs](https://angularjs.org/) (1.x era) and anything without scope was starting to sound like a better framework.

# Why Aurelia?
If you happened to look at the comparison you would notice that I evaluated two rather popular choices and one not so well known choice. At the time [React](https://reactjs.org/) still seemed like a questionable choice to me. I was having a hard time believing that the virutual dom would not cause so much memory pressure on the heap. 

As for Aurelia, it was similar to Angular in the sense that it used an MVC pattern to present the view. The one thing I had liked was the syntax and oftentimes lack of it. I realize that starting in Angular 2+ the syntax got better, but still confusing bindings like `[src]`, `*ngFor`, and `(click)` still bothered me. From a readability standpoint it's hard to remember the difference between those. Aurelia, on the other hand, chose to be a bit more explicit about its binding to the template. Instead, you would have bindings like `src.bind`, `repeat.for` and `click.delegate`. To me, this seemed a lot more readable and produced less mysterious-looking code.

# What I learned
While I fully enjoyed using Aurelia, I grew to find certain aspects of the framework to be painstaking. What I had come to realize is that like in many frameworks I would hit a snag in my work and have to turn to documentation or sources like stack overflow to get moving in the right direction again. However, this time I found out that finding the answers to my questions was a lot harder. Documentation was sparse on the issues I was running into and the examples I had found ended up being years out of date.

I had also found that access to different plugins and wrappers for the language was limited. Where in other popular frameworks I would have a slew of choices for plugins, libraries, and tools, in Aurelia most of these did not exist or appeared to be years out of date. 

Even finding the right combination of tools to use for something like testing was hard. Some examples showed and recommended jest while others used karma and jasmine. While the tool was not available at the time, eventually Aurelia did create a [CLI](https://aurelia.io/docs/cli/basics#introduction) which might have addressed many of the pain points I had encountered getting setup. 

The hardest challenge for Aurelia is the lack of a strong community. While this is not the best metric in the world, it seems pretty clear to me using Github stars that Aurelia is not a super popular choice. 

| Project | Stars |
|-|-|
| Aurelia | 653 |
| Angular | 57.9k |
| React | 144k |
| Vue | 157k |

I had never really known how much of a difference a large community makes on a project, but after this experience, it has become clear to me that it makes a rather large difference. I am personally glad I learn this lesson in a way that the maintenance burden only effects me.
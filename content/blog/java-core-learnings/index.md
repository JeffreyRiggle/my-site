---
title: 'Failure to read'
date: '2026-01-03'
---

# Failure to read

In the last blog entry I discussed in detail how I came to build a text adventure creator application. Much of that focused on high level learnings. These learnings had been more focused on project structure and reception of the work. However, to do a retrospective I wanted to focus more on the specific code choices to see what I think of them years later.

With the complicated web of depedencies that I created, breaking this analysis across core libraries and the application will be needed. In this case, core libraries are be anything other than iroshell, textadventurelib, and textadventurecreator.

## Who needs telemetry anyway?

Logrunner is very small and serves a simple purpose, write log entries to a series of tsv files as well as stdout.

Now you might think tsv a funny format and I will give you credit for that. However, at the time, I was using a log analysis tool that allowed you to query tsv files with a SQL like syntax and I found that very beneficial.

In most cases others would reach for [log4j](https://logging.apache.org/log4j/2.x/index.html), but I didn't need those features for my purposes.

Looking back, I don't have many complaints about this library. For some more advanced collection of data is required. In my case, I didn't need this kind of telemetry. If someone wanted help they could just send me their log files.

## Writing a bad core

When I look back on java-core I see some obvious mistakes. If I was to start this project all over this would be very different. Since there are a plethora of mistakes here I will pick them carefully.

### Failed wrapper abstractions

A very common pattern I am seeing looking back on this, especially around the xml logic, is a failure to create a meaningful abstraction. In many cases, I took an existing standard library and wrapped it in a method that just did the same thing. This can be a powerful abstraction if you want to switch out libraries, but there had been a few ways I got this wrong. Firstly, one stated goal of this project was only using the standard library. Wrapping the standard library with a limited feature added no value as I was never going to use a different third party in the future. Secondly, I would wrap the standard library but return the standard library classes to the consumer. This created a leaky abstraction and did not effectively abstract out the standard library.

### Failure to learn the ecosystem

If you are going to work in an ecosystem, you should use the tools in the ecosystem in the intended way. Instead I decided to create my own pattern. Just looking at this library I can pull two different examples in which a little more time spent researching would have created less friction and questionable choices.

#### Swing is not WPF

While none of this code is public, a one point I had a Swing based application in the mix. This application loaded the created games and ran them. This was completely written in Swing and happened before I figured out about JavaFX. One thing I was influenced by at the time was WPF. I was all in on MVVM (model view viewmodel), MVP (model view presenter), pick your acronym posion of choice. Of course Swing didn't easily fit into that pattern. I could have just stuck with a single view class as was common with Swing. However, I found it more fitting to create a monster.

If you don't know what this pattern is maybe this analysis is not for your. However if you want to know or want a refresher, this is a way to separate your view and interaction/data model logic. The often stated goal being it is easier to have "just UI" and "just behavior" changes. The flow between components is relevant so here is a visual aid.

![MVVM Pattern](./mvvm.png)

To accomplish a similar effect I decided would use: a model similar to the model before, a view that was just the Swing control, and a presenter. The implementation was an absolute mess. I ended up having all views and models extend from some base classes. These base classwa would then allow you to raise a change event. This event would then be picked up by the presenter and the presenter would use reflection to invoke the appropriate method on correspending view or model. This created some crazy code and failed to meet the desired abstraction.

Not only did this do MVP in a bad way but it forced you to pay the reflection tax. If I had scaled up this pattern more the application would have run much slower since none of the UI interactions would have been able to be effectively Jitted.

#### Localization is solved in the standard library

Another big mistep I took in the implementation was creating my own language file format for localization. If I had done a little bit of research, I would have found that Java has a robust solution for localization that involves properties files. Instead, I created an abstraction that was very similar to properties files but used a delimiter of `;=;` instead of `=`.

### Pulling in Spring

I am not against [Spring](https://spring.io/projects/spring-boot), but one of my stated goals was to only use the standard library. Instead, I pulled in one of the biggest common libraries for a very small purpose. I wanted to be able to do IoC and Spring had it. In doing so I saved myself a headache not trying to implement IoC myself, but I missed out on some of the learning I wanted to achive.

## Data formats are tricky

Much of what I built basically takes in some abstract state, serializes it to xml, then reads it back into classes to do something. When I created this abstraction, I assumed I would eventually use other formats. The problem is I made a very classic mistake, I build an abstraction before I had multiple use cases. This ended up creating an abstraction that was basically the java xml library with a few opinions. At one point, I had considered adding JSON support, but the abstraction I had build didn't make sense for any other data format. What the heck does it even mean to add an attribute to a JSON property?

## Building an entity model

The core of playerlib is the ability create an entity that described how I thought a player should work. This entity had a lot of opinions about players. Players have attributes, characteristics, inventory, etc. This even built in some features like listening for changes to the player entity. 

I didn't have too much of a problem with this, but then I remembered something. The one thing that this abstraction did that caused me a lot of grief was that the value type was not known at compile time. Let's take a simple example, a player can have attributes. In these attributes there can be different value types. For example, you might have an attribute `age` that is an `int` and another attibute `surname` that is a `string`. The way this was implemented originally stored the value as an `Object`. Rhe caller of the code had to figure out how to unwrap the value. Later on I remembered that Java had generics, certainly those would fix my problem! Of couse, that wasn't quite right in my implementation. What I effectively did was take a method like this

```java
Object getValue();
```

and turn it into this mess.

```java
<T> T getValue();
```

Now in hindsight there are probably a couple of ways I could have made this easier to reason about. The simplist would have been to introduce a correspending type enum that would help you unwrap the value.

```java
public enum ValueType {
    String,
    Integer,
    Double,
    Boolean
}

// interface
ValueType kind();
<T> T getValue();
```

That would have gotten rid of many type checks that had not been applied consistently. This abstraction would have come at the cost of some performance but the performance cost would have been negligable.

## Building a state machine

In gsmlib I assumed that I could represent any possible game with the abstraction created. This mental model being, all games are a series of game states, and there is some data passing between states. Also all games would have a finished state. This state would tell you the game is over. Also there was a concept of game state buffering. For buffering you would be able to load a couple game states into memory. Then as the game states change you could look at the current game state to load in the next game states needed.

I don't have much to complain about with this abstraction. However, to be fair in this analysis I must admit that this had the same shortcoming as playerlib. The game state data that was passed around from game state to game state was `Object` and did cause some issues. This also made an over generalization, this clearly would not apply to all possible games. In essence I just created another state machine.

## So what did I learn?

If I had to distill this long analysis down into key lessons learned this would be the TL;DR.

**Take some time to read about the ecosystem**. Reinventing patterns in a ecosystem is rarely to your benefit. This is doubly true if you are more junior. You can learn a lot doing this, but more often than not you are just creating a mess.

**Have more than one implementation before creating an abstraction**. Failure to do otherwise is creating a premature abstraction that is almost certainly wrong.

**If you abstraction is clever its probably wrong** Just because you can do something and got it working doesn't mean it was a good idea. Consider your trade offs and know what cost you are paying.

**Strong types are preferred** If you are just passing Object around or accepting a generic whose type hint cannot be statically inferred you are going to end up paying for it in the future. The runtime cost to determine the underlying type is not free, and the developer time wasted to write and maintain that code will be staggering. 
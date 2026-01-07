---
title: 'Failure to read'
date: '2026-01-03'
---

# Failure to read

In the last blog entry I discussed in detail how I came to build a text adventure creator application. Much of that focused on high level learnings more focused on project structure and reception of the work. However, to really do a retrospective I wanted to focus more on the specific code choices to see what I think of them years later.

Creating the complicated web of depedencies that I did I find it important to break this analysis across what I am calling the core libraries and the application. The core libraries will be basically anything other than iroshell, textadventurelib, and textadventurecreator.

## Logrunner

I think this one will be the easiest one to cover. Reall this whole library is very small and serves a simple purpose, write log entries to a series of tsv files as well as stdout.

Now you might think tsv a funny format and I will give you credit for that. However at the time I was using a log analysis tool that allowed you to query tsv files with a SQL like syntax and I found that very beneficial.

I think in many cases others would reach for something like [log4j](https://logging.apache.org/log4j/2.x/index.html) but I really didn't need all of those features.

I really don't have many complaints about this library. However, in modern times others might want to actually collect this sort of data from their users. In my case I didn't really care about this kind of telemetry and figured if someone wanted help they could just send me their log files.

## Java Core

Now this one is a lot more interesting. There are quite a few mistakes I see looking back on this. If I was to start this project all over this would probably be very different. There are a lot of mistakes here so I will try to pick them carefully.

### Failed wrapper abstractions

A very common pattern I am seeing looking back on this, especially around the xml logic, is a failure to create a meaninful abstraction. In many cases I took an existing standard library and wrapped it in a method that just did the same thing. Now this can be a powerful abstraction if you want to switch out libraries, but there had been a few ways I got this wrong. Firstly, in the spirit of this project I was only going to use the standard library. Wrapping the standard library with a limited feature set has no value because I was never going to use a different third party in the future. The second issue I am seeing is in many cases I would wrap the standard library and still return the standard library classes for the consumer to deal with. This in essence did not effectively abstract out the standard library.

### Failure to understand the language patterns

If you are going to work in an ecosystem it is very helpful to actually use the tools in the ecosystem in the intended way instead of creating your own patterns. Just looking at this library I can pull two different examples in which just a little more time spent might have created a lot less friction and weird choices in my code.

#### Swing is not WPF

While I don't think I have any of this code public, there was a point where I had a Swing based application that would actually load the created games and run them "Hosted". This application was completely written in Swing and happened before I figured out about JavaFX. Now one thing I was very influenced by at the time was WPF. MVVM (model view viewmodel), MVP (model view presenter), pick your acronym posion of choice, was what I was all in on. Of course, Swing didn't easily fit into that framing. Now I could have just stuck with a single view style class as was common with Spring, but instead I created a monster.

Now if you don't know what this pattern is it is basically a way to separate your view and interaction/data model logic in a way that should make it easier to have "just UI" and "just behavior" changes. The flow between components is relevant so here is a visual aid.

![MVVM Pattern](./mvvm.png)

Now to accomplish a similar effect I decided I would call it MVP and use a model similar to the model before, a view that was just the Swing control, and a presenter. Now how this worked in practice was a mess. What I ended up doing is having all views and models extend from some base class. That base class would then allow you to raise a change event from either the view or the model. This would then be picked up by the presenter and then the presenter would use reflection to invoke the appropriate method on the view or model based on the method signature. This created some crazy code and failed to meet the desired abstraction.

Not only did this do MVP in a bad way but it forced you to pay the reflection tax. I assume if I had scaled up this pattern more the application would have run much slower since none of the UI interactions would have been able to be effectively Jitted.

#### There is a standard solution for that

Another big mistep I see in the implementation here was I created my own language file format for localization. Had I have done just a little bit of research I would have found that Java has a pretty robust default solution for localization that involves properties files. Instead I created an abstraction that was very similar to properties files but used a delimiter of `;=;` instead of `=`.

### Pulling in Spring

Now I am not against Spring at all but one of my main goals was to only use the standard library and instead I pulled in one of the biggest common libraries for a very small purpose. All I wanted was to be able to do IoC and Spring had it. I am sure I saved myself a headache not trying to implement IoC myself but I missed out on some of the learning I wanted to achive.

I listed this one last because I only disagree with this in the context of my original stated goal.

## PersistLib

Much of what I build basically takes in some abstract state, serializes it to xml, then reads it back into classes later on to do something interesting. When I created this abstraction I always figured I would eventually use other formats. The problem is I made a very classic mistake, I build an abstraction before I had multiple use cases. What this ended up doing was creating an abstraction that was basically the java xml library with a few opinions on it. At one point I had considered adding JSON support but the abstraction I had build just didn't make sense for JSON.

## PlayerLib

The core goal of this library was to create an entity that described how I thought a player should work. Basically this entity had a lot of opinions about players have attributes, characteristics, inventory, etc. This even built in some features like listening for changes to the player entity. I didn't have too much of a problem with this, but then I remembered something. The one thing that this abstraction did that caused me a lot of grief was that the value type associated with certain things was not fixed. Lets take a simple example a player can have attributes. Now in these attributes there can be different data. For example you might have an attribute age that is a number and another attibute surname that is a string. The way this was implemented originally was the value was stored as an Object. Then the caller of the code had to figure out how to unwrap the value with no hint. Later on I remembered that Java had generics, certainly those would fix my problem. Of couse that wasn't quite right in my implementation. What I effectively did was take a method like this

```java
Object getValue();
```

and turn it into this mess.

```java
<T> T getValue();
```

Now in hindsight there are probably a couple of ways I could have made this better. The simplist would have been to introduce a correspending type enum that would help you unwrap the value.

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

That would have gotten rid of so many questionable type checks on the value later on in the implemenation of this project.

## GSMLib

When building this library I had assumed that I could capture any possible game in this library. This created a mental model that all games are a series of game states and there is some data passing between states. There is also the concept of a finished state that basically tells you the game is over. This also added on a concept of game state buffering. In this case you would be able to load a couple game states into memory and then as the game states are changing look at the current game state to load in the next game states that would follow.

For the most part I don't have much to complain about with this abstraction. However, to be fair in this analysis I must admit that this had the same shortcoming as playerlib. The game state data that was passed around from game state to game state was `Object` and did cause some issues. This also made an over generalization, I do not think this would apply to all possible games. What I had done in this case was just create another state machine.

## So what did I learn

If I had to distill this long analysis down into key lessons learned this would be the TL;DR.

**Take some time to read about the ecosystem**. Reinventing patterns in a ecosystem you are using is probably not to your benefit. This is double true if you are more junior. There are good reasons to break from the crowd and do something else. You can also learn a lot doing this, but the newer you are the more likely you are just to be creating a mess.

**If you abstraction is clever its probably wrong** Just because you can do something and got it working doesn't mean it was a good idea. Really consider your trade offs and know what cost you are paying.

**Object and Generic need associated metadata** If you are just passing Object around or accepting a generic with a type hint you are going to end up paying for it in the future. The runtime cost determine the underlying type is not free, and the developer time wasted to write that code will be staggering. 
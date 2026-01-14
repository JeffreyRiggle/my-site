---
title: 'IDE for Text Adenture Games?'
date: '2026-01-13'
---

## Building an IDE for text adventure games

By this point I have covered most of the core libraries required and I figured it was time to get into the core game building bits. The end result of all of my work was the creation of a IDE for making text adventure games that would feel somewhat familar for developers used to using an IDE.

## IROSHELL (come up with better title)

The last core library that I did not cover in the last blog was the IROShell. In general I don't have many grievences with this software. However I will say its shortcoming came from overengineering. I had built a Java UI framework on top of JavaFX that I intended to use going forward. However after this project basically all UI I did was in the web ecosystem and didn't use Java at all.

This framework required you to adopt a mindset of multiple tabs persisted for you and users having full control of tab placement. The end result for the UI was a lot of abstraction between you and the layout. You would compose views, menus and toolbars and the framework would put them in their correct place and allow the user to move them further.

This framework also had features like MDI (multiple document interface) vs SDI (single document interface), the ability to have custom pre-load screens like a splash screen or a login screen.

Looking back some of the biggest issues with this had been building on java-core and loggrunner. While it was very helpful for me to generate logs, having your framework generate logs for debugging your application shell on a users machine might have been a bad idea in hindsight.

Also while the feature was incredibly helpful the execution of the dyanmic styling feature was problematic. Basically there was a feature that would allow you to dynamically change the styles of the application just by changing some CSS file. This would watch the file for changes and host up an internal Java protocol for reapplying the styles. The problem was this required a new protocol to be defined and that protocal was called `interal://` which in hindsight was bad. It also required constantly creating new urls which likely lead to memory leaks.

## TextAdventureLib (better title)

The textadventurelib was the core of the game engine. This is where all of the real game logic happened and basically turned an XML representation of some game state into a functioning game. While this was powerful it had some mighty issues.

### In pursuit of clean code

In order to create the cleanest code I could think of I ended up creating indirection that is very hard and common on the front-end. One specific case that comes to mind is game state processing. To set the stage the general operation model was: a game has game states, a game state has options, options have triggers and actions. In many cases you would want to send a message from an action to the game state. However since the game state was the holder of the action you don't want that action to know about the game state, that wouldn't be clean right? What I decided to do about this created a different problem. Basically the actions would callback to an interface that the game state had. The problem was to wire all of this up the game state had to know about all possible actions to hook up any action that might call it back later. This created a problem where the game state had to attempt to infer the type of the action at startup time. 

```
Startup
load game state --> iterate all options --> find actions --> if action of type x add listener y
```

```
Send event
action triggered --> find all listeners --> call specific interface callback
```

To make matters worse the actions had been written in an overkill way to have multiple callback handlers when there would only ever be one.

This created ugly code like this

```java
for (IOption option : options) {
	if (option.action().getClass().isInstance(CompletionAction.class)) continue;
			
	if (option.action() instanceof CompletionAction) {
		CompletionAction act = (CompletionAction)option.action();
	    act.addListener(this);
	}
	if (option.action() instanceof AppendTextAction) {
		AppendTextAction action = (AppendTextAction)option.action();
	    action.addListener(this);
	}
	if (option.action() instanceof FinishAction) {
		FinishAction fAction = (FinishAction)option.action();
	    fAction.addFinishListener(this);
    }
}
```

Instead of doing all of this mess I could have done a message broker pattern or just gave all actions access to the game state directly.

### Just let people figure out images for themselves

This one is quick an minor but early on I decided it was very important that images be stretched to fit the image area, aspect ratio be dammed. In hindsight this was clearly a silly choice.


### Maybe the entity model wasn't that good

So much of this code is a complicated mess trying to get to or modify the data a specific action or trigger needed to work with. A lot of this complication had come from the choice to be so explicit and building mental models of real world concepts in code. What I mean is had I have just simplified player down to be a player is an entity that can have many properties I could have saved a lot of complexity. The important distiction between that and what I build is the dimensionality. In this alternative I would have had a flat list of properties. The choice to map to the real world abstraction more created a lot of cost in actions, triggers and macros. In all of these cases I had to build overly complex loosely typed models to allow you to modify or read a player attribute through the same abstraction as a property on an item equipped to the players arm. This created more cases of Object instead of type, as well as some unnessisary reflection.

### Macro's needlessly complicated

Another feature that was important to me was macro subsitution. Basically if you are going to store a bunch of attribution on a player you should show it in the game at some point. To do this I build a complex substitution pattern that basically recreated a worse language. Let's consider you have a player with an attribute age. To get that you would have to create this macro `{[player(PlayerName)@attribute(age)@value]}`. To make matters worse I actually abstracted out the separators so that it could be written other ways. To accomplish this I had to dynamically build regular expressions and use reflection to find the properties on objects that you wanted to show in the UI.

Looking back I think there are a couple of ways I could have done this differently. The easiest one is the last point, just make the entity model simpler. However, if I couldn't have done that there could have been options like creating a formula DSL or even maintaing a simple map of unique identifier to subsitution value. 

## TextAdventureCreator (better title)

* Dealing with code gen is a real pain especially when attempting to have build targets like html (built with react) and electron
* Building a debugger was neat but for it to have been practical it should have gotten a lot more attention
* Built out an overly verbose error handler and probably could have saved time just stopping
    * Had email option
    * Had SONA option
    * have to mention the penguin artwork
* Libraries had been a fun and simple idea and might have been a good investment to double down on
* Being able to run and debug the game without compiling was super handy
* Had way too many options for game creation (who cares about buffering)
* Progress indicator was fun but frequently frustrating
* Dynamic styles made css changes easier
* All the plugin stuff was neat but probably wasted
    * Had unneeded language builder (localization). I don't think it ever made sense to build this UI as I don't think people would have ever wanted custom language packs
    * Mods
* Because macros had been complex so was the macro builder UI
* Because player related actions/triggers had been complex so was the UI

## High level lessons learned
* Prototypes with crappy code are useful and prevent overengineering in the wrong ways (I might not have made the player model so complex)
* Fast reload is very useful and probably why the web is winning
* If you are duplicating models just for the sake of perisistence you are probably doing something wrong
* Know the maintenance cost of your features 
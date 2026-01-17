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

### Manual persistence code?

An overwhelming amount of code and classes I am seeing here are duplicated entities just defined for the sake of peristing with persistlib. A noticable amount of these codebases would simply not exist if just a little bit of metaprogramming was used to persist classes. There are ways to do this in Java but even if I wanted to do this with my own system making persistlib be metadata driven using java annotations would have saved so much effort.

## TextAdventureCreator (better title)

All of this work built up to the text adventure creator. This repository created an IDE for generating text adventure games using all of the prior libraries plus some javascript ports I didn't mention. All of the mistakes of the existing libraries would resonate here but there had been a few new ones as well.

### Code generation is brittle

Originally the end result asset was going to be either an xml file that could be provided to another application, or a compiled jar. In the end I instead supported all of these

* xml based file that could be provided to another application that did not exist
* generated jar
* generate maven project for developer to later generate a jar
* generate game as an HTML file
* generate game as an electron app.

The choice to support all of these with no users was painful. To make matters worse the html asset used a webpack build system and react for parts of the UI. What I learned is when you are not actively working on a web project every day you will get into a legacy state that is hard to get out of. In modern web development libraries, build systems, and node versions change at a nauseating pace. A failure to update every 6 months means you are going to feel incredibly behind if you wait 2+ years to update something.

Another thing that made this quite painful was I used very large format strings for all of this. Using a framework like handlebars or at least having a template file with more clear substitutions would have made this much easier when making changes to the generated assets.

### Player model strikes again

Not long ago I mentioned that having a complex player model made things like player specific triggers, actions, and macros hard. Turns out that resurfaces when you are building a UI for those actions, triggers, and macros. For decent UX you certainly don't want to keep a user guessing when they don't have to. For example if you wanted to create a trigger that fired every time a players health was below 10, you would want the UI to help you create that. The player model knows what attributes the player has, their types, and even their default value. To accomplish this I basically built a complex set of dynamic combo boxes, or selects for you web developers, these would be dynamically added or removed based on the combo box prior and their values would be tied to the entity model.

This worked functionally but the UX was still clunky. I think there could have been a better way to visualize this. However, all of that aside the interaction with all of these flows would have been significantly better if the model was simplified.

### I am not a designer

As evidenced by such beautiful artwork as below I am not a designer and probably will never be great at it.

![crappy artwork](./newerror.png)

This ment that a lot of my style choices came of looking crude and childish. In addition because it was not my interest I didn't spend much time refining it. In many cases this showed up as unstyled UI but in some cases it was just styled poorly. One of the cases where I think this shows the best is the debugging experience I build into the IDE. While I found that this was useful to a degree it looked terrible and didn't have all of the functionality you might expect from a debugger. What this ended up being was a poorly styled entity state tracker. Every time some action was triggered that changed a player state you would see removed entities in red, updated entities in blue and added entities in green. The problem was these had been styled so big and bulky it was hard to read the change.

Example of this visualization

![Add Characteristic](./add.png)
![Change Attribute](./update.png)

While this primative debugger was helpful for me I do think doubling down on making this better instead of focusing on other features would have been to my benefit.

### Feature bloat got in the way of deep work

Constantly going wide on this mean having to support tons of additional work without making the core experience better. This often lead to having to make a ton of UI changes just to support some new feature when I could have made the core product better. One place where this really shows up is in the initial game creation wizard. Over time what started as just something simple grew into a 3 page wizard that was constantly changing. To make matters worse most of the options didn't need to be there and every time I wanted to do another test it added a ton of time to just create a test game.

Had I focused on the core problem I could have spent more of my time making the experience better and wasted less time just making more UIs that refelected the ever changing options.

### Dynamic styling was very helpful

One thing I had mentioned earlier was I invested some time into being able to dynamically style IROShell. This came in very handy. While modern web developers probably cannot understand the pain, having to wait for an entire compile of a java application just to test one css change was miserable. Investing the time into that saved me a ton of recomiple time.

## High level lessons learned

**Prototypes are valuable!** Believe it or not you are allowed to write crappy or unclean code to learn what does and doesn't work in a system. Spending too much time making something clean can distract from understanding what the core problem is.

**Iteration time is everything!** I think this is part of why the web is doing so well. The time it takes to iterate on HTML, JS and CSS assets is just way faster than a compiled application is. You may disagree with this but if you think getting these changes is taking too long take a good hard look at your toolchain. You don't actually need a build system for the web and your iteration time is just a save and refresh away.

**If you are hand writing persistence code for each entity you are probably doing something wrong!**

**Each feature comes at a maintenance cost!** Without careful selection of features you will end up with so much bloat you cannot move forward. In all likelihood most of those features don't matter anyway.
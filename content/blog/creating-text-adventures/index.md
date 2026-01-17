---
title: 'IDE for Text Adenture Games?'
date: '2026-01-13'
---

## Building an IDE for text adventure games

By this point I have covered most of the core libraries used, now it is time to get into the core game building. The end product for all of my work was an IDE for making text adventure games. This IDE was supposed to feel somewhat familar for developers used to using an IDE.

## Building a UI Framework

The last core library I haven't covered to this point was IROShell. In general I don't have many grievences with this software. However, I will say its shortcoming came from overengineering. I had built a Java UI framework on top of JavaFX that I intended to use going forward. The problem was, after this project overwhelmingly the work I did was in the web ecosystem, so I didn't get to use this again.

This framework required you to adopt a mindset of multiple tabs persisted for you and users having full control of tab placement. The UI was a lot of abstraction between you and the end layout. You would define views, menus and toolbars and the framework would put them in their correct place and allow the user to move them further.

This framework also had features including different layout strategies namely MDI (multiple document interface) vs SDI (single document interface). It also had the ability to have custom pre-load screens like a splash screen or a login screen.

Looking back some of the biggest issues with this had been building on java-core and loggrunner. While it was very helpful for me to generate logs, having your framework generate logs for debugging your application shell on a users machine might have been a bad idea in hindsight.

Also while the feature was incredibly helpful the execution of the dyanmic styling feature was problematic. I had built a feature that would allow you to dynamically change the styles of the application just by changing some CSS file. This would watch the file for changes and host up an internal Java protocol for reapplying the styles. The problem was this required a new protocol to be defined and tthe protocal I choose was called `interal://`. In hindsight that was a terrible and careless naming decision. It also required constantly creating new urls which likely lead to memory leaks.

## Issues in the Core

The textadventurelib was the core of the game engine. This is where all of the real game logic happened, which just so happened to be turning an XML representation of some game state into a functioning game.

### In pursuit of clean code

In order to create the cleanest code I could think of, I ended up creating indirection that is hard to follow but also quite common in front-end development. One specific case that comes to mind is game state processing. 

To set the stage the general operation model broke down into the following

1. A game has game states
2. A game state has options
3. Options have triggers and actions.

In many cases you would want to send a message from an action to the game state. However since the game state was the holder of the action you wouldn't want that action to know about the game state, that isn't clean right? How I decided to do address this created a different problem. The actions would callback to an interface that the game state had. The problem was to wire all of this up the game state had to know about all possible actions to hook up any action that might call it back later. This created a problem where the game state had to infer the type of the action at startup time. 

```
Startup
load game state --> iterate all options --> find actions --> if action of type x add listener y
```

```
Send event
action triggered --> find all listeners --> call specific interface callback
```

To make matters worse the actions had been written in an overkill way to have multiple callback handlers, but in practice there would only ever be one.

This created ugly code like the following.

```java
for (IOption option : options) {
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

So much of this code is a complicated mess. This mess is a direct result of act on the data an action or trigger needed to work with. This complication had come from the choice to be so explicit and building mental models of real world concepts in code. What I mean is had I have just simplified player down to be a player is an entity that can have many properties I could have saved a lot of complexity. The important distiction between that and what I build is the dimensionality. In this alternative I would have had a flat list of properties. The choice to map classes to the real world abstraction created friction in actions, triggers and macros. In all of these cases I had to build overly complex loosely typed models just to allow you to modify or read the specific data you needed to act on. This resulted in more cases of Object instead of type, as well as some unnessisary reflection.

### Macro's needlessly complicated

Another feature that was important to me was macro subsitution. If you are going to store a bunch of attribution on a player you should show it in the game at some point. To do this I build a complex substitution pattern that basically recreated a worse language. Let's consider you have a player with an attribute age. To get that you would have to create this macro `{[player(PlayerName)@attribute(age)@value]}`. Just because that wasn't complex enough I decided to abstracted out the separators so that it could be written other ways. In actual execution this translated to dynamically building regular expressions and using reflection to find the properties on objects that you wanted to display.

Looking back I think there are a couple of ways I could have done this differently. The easiest one is the last observation, just make the entity model simpler. However, if I couldn't have done that there could have been options like creating a DSL or even maintaing a simple map of unique identifier to subsitution value. 

### Manual persistence code?

An overwhelming amount of code and classes I am seeing here are duplicated entities just defined for the sake of peristing with persistlib. A noticable amount of the code written would simply not exist if just a little bit of metaprogramming was used to persist classes. There are ways to do this in Java but even if I wanted to do this with my own system making persistlib be metadata driven using java annotations would have saved so much effort.

## Bringing it all together in an IDE

All of this work built up to the text adventure creator. This repository created an IDE for generating text adventure games using all of the prior libraries plus some javascript ports I didn't mention. All of the mistakes of the existing libraries would resonate here but there had been a few new ones as well.

### Code generation is brittle

Originally the end result asset was going to be either an xml file that could be provided to another application, or a compiled jar. In the end I instead supported all of these

* xml based file that could be provided to another application that did not exist
* generated jar
* generate maven project for developer to later generate a jar
* generate game as an HTML file
* generate game as an electron app.

The choice to support all of these with no users was painful. To make matters worse the HTML asset gneration used a webpack build system and React. When you are not actively working on a web project every day you will get into a legacy state that is hard to get out of. In modern web development libraries, build systems, and node versions change at a nauseating pace. A failure to update every 6 months means you are going to feel incredibly behind if you wait 2+ years to update something.

Another thing that made this quite painful was I used very large format strings for all of this. Using a framework like handlebars or at least having a template file with more clear substitutions would have made this much easier when making changes to the generated assets. Here is one example of the crazy code I ended up writing instead of doing templating well.

```java
public final static String GAMESTATEINITIALIZER = "package org.%s.%s;\r\n\r\n"
			+ "import ilusr.gamestatemanager.GameState;\r\n"
			+ "import ilusr.gamestatemanager.GameStateManager;\r\n"
			+ "import javafx.stage.Stage;\r\n"
			+ "import textadventurelib.persistence.TextAdventurePersistenceManager;\r\n\r\n"
			+ "public class GameStateInitializer {\r\n\r\n"
			+ "\tprivate Stage mainStage;\r\n"
			+ "\tprivate GameStateManager manager;\r\n\r\n"
			+ "\tpublic GameStateInitializer(Stage mainStage) {\r\n"
		    + "\t\tthis.mainStage = mainStage;\r\n\r\n"
		    + "\t\tinitialize();\r\n"
			+ "\t}\r\n\r\n"
		    + "\tprivate void initialize() {\r\n"
			+ "\t\tmanager = new <String>GameStateManager(\"NA\", new GameState(null));\r\n"
		    + "\t\tMainMenuGameState mainGameState = new MainMenuGameState(manager, mainStage);\r\n"
			+ "\t\tmanager.addGameState(GameStates.MAIN, mainGameState);\r\n"
		    + "\t\tmanager.addGameState(GameStates.TRANSITION, new TransitionGameState(mainStage, manager, buildPersistenceManager()));\r\n"
		    + "\t\tmanager.addGameState(GameStates.LOAD, new LoadGameState(manager, mainStage));\r\n"
		    + "\t\tmanager.currentGameState(mainGameState);\r\n"
	        + "\t}\r\n\r\n"
		    + "\tprivate TextAdventurePersistenceManager buildPersistenceManager() {\r\n"
	        + "\t\tTextAdventurePersistenceManager retVal = null;\r\n\r\n"
		    + "\t\ttry {\r\n"
			+ "\t\t\tretVal = new TextAdventurePersistenceManager(getClass().getResource(\"%s.xml\").toExternalForm());\r\n"
		    + "\t\t} catch (Exception e) {\r\n"
			+ "\t\t\te.printStackTrace();\r\n"
		    + "\t\t}\r\n\r\n"		
		    + "\t\treturn retVal;\r\n"
	        + "\t}\r\n\r\n"
	        + "\tpublic void run() {\r\n"
		    + "\t\tmanager.start();\r\n"
	        + "\t}\r\n"
            + "}";
```

Good luck trying to line those `%s` substitutions up.

### Player model strikes again

As we now know, a complex player model made things like player specific triggers, actions, and macros hard. Turns out that resurfaces when you are building a UI for those actions, triggers, and macros. For decent UX you certainly don't want to keep a user guessing. For example, if you want to create a trigger that fires every time a players health is below 10, you would want the UI to help you. The player model knows what attributes the player has, their types, and even their default value. To accomplish this I built a complex set of dynamic combo boxes, or selects for you web developers. These would be dynamically added or removed based on the combo box prior and their values would be tied to the entity model.

Despite getting this to work functionally, the UX was still clunky.

### I am not a designer

As evidenced by such beautiful artwork as below I am not a designer and probably will never be great at it.

![crappy artwork](./newerror.png)

As a result my style choices came of looking crude and childish. Because it was not my interest I didn't spend much time refining it. This often showed up as unstyled UI but in some cases it was just styled poorly. A prime example of this is the debugging experience I build into the IDE. While I found that this was useful to a degree, it looked terrible and didn't have all of the functionality you might expect from a debugger. The result was a poorly styled entity state tracker. Every time some action was triggered that changed a player state you would see removed entities in red, updated entities in blue and added entities in green. The problem was these had been styled so big and bulky it was hard to read the change.

Example of this visualization

![Add Characteristic](./add.png)
![Change Attribute](./update.png)

While this primative debugger was helpful for me, doubling down on making this better instead of focusing on other features would have been to my benefit.

### Feature bloat got in the way of deep work

Constantly going wide on this mean having to support tons of additional work without making the core experience better. This often lead to having to make a ton of UI changes just to support some new feature when I could have made the core product better. One place where this really shows up is in the initial game creation wizard. Over time something simple grew into a 3 page wizard that was constantly changing. To make matters worse most of the options didn't need to be there and every time I wanted to do another test it added a ton of time to just create a test game.

Had I focused on the core problem I could have spent more of my time making the experience better and wasted less time just making more UIs that refelected the ever changing options.

### Dynamic styling was very helpful

The investment in being able to dynamically style IROShell came in very handy. While developers that have only worked on web 2.0 likely wont understand, having to wait for an entire compile of a java application just to test one css change was miserable. Investing the time into that saved me a ton of recomiple time.

## High level lessons learned

**Prototypes are valuable!** Believe it or not you are allowed to write crappy or unclean code to learn what does and doesn't work in a system. Spending too much time making something clean can distract from understanding what the core problem is.

**Iteration time is everything!** I think this is part of why the web is doing so well. The time it takes to iterate on HTML, JS and CSS assets is just way faster than a typical compiled application is. If you disagree with this take a good hard look at your toolchain. You don't actually need a build system for the web and your iteration time is just a save and refresh away.

**If you are hand writing persistence code for each entity you are probably doing something wrong!**

**Each feature comes at a maintenance cost!** Without careful selection of features you will end up with so much bloat you cannot move forward. In all likelihood most of those features don't matter anyway.
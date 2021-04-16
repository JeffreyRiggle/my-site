---
title: 'Book Note - The Mythical Man-Month'
date: '2021-04-14'
---

# The Mythical Man-Month
[The Mythical Man-Month](https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959) is a book authored by [Frederick Brooks](https://en.wikipedia.org/wiki/Fred_Brooks).

## High level overview
This book is a series of essays from Frederick Brooks. In these essays the problems of software engineering and management are explored. Much of this book is polled from Fredricks own experiences while working on [IBM System/360](https://en.wikipedia.org/wiki/IBM_System/360).

## Notes

### The Tar Pit
| | |
|-|-|
| A <br> Program | A <br> Programming <br> System |
| A <br> Programming <br> Product | A <br> Programming <br> Systems <br> Product |

* Large system programming is a tar pit and many powerful beasts have thrashed in it.
    * many have made it out with running systems.
    * less have met goals, schedules, and budgets.
    * No one can escape this problem no matter how big or small the team is.
    * Most are surprised how sticky it is
* If this is such an issue why do small teams working in garages seem to be able to pull it off?
    * A functioning product is easy to build but a hardened tested product is much harder.
    * See chart above for next points.
    * Generally speaking, these teams create something in the top left quadrant.
    * To make a program more useful but more costly moving down or to the right adds 3 times the effort and expense
    * A programming product
        * Has Generalization
        * Has Testing
        * Has Documentation
        * Is Maintained
        * can be run, tested, and extended by anybody.
        * Is usable in many different operating systems.
        * This means a ton of testing
    * A programming system
        * Collection of interacting components.
        * coordinated in function and disciplined in format.
        * every input and output must conform to syntax and semantics with precisely defined interfaces.
        * must only use the prescribed amount of resources (RAM, CPU, etc)
        * must be tested with other components
    * A Programming Systems Product
        * cost 9 times as much as a simple program
        * Is a mix of a programming product and a programming system.
* Programming is fun
    * This is partly due to the joy of making things in general.
    * It is pleasurable to make something that works for other people.
    * It is puzzle-like which can be quite fun.
    * There is a joy to learning and programming is all about learning.
    * Programming is not generally bound by physical mediums. It is pure thought. Very few forms of media are as flexible when it comes to creation.
* Woes
    * The implementation must be perfect. Computers are quite dumb and only handle simple instructions. As humans, we often lack the discipline to define something perfectly.
    * The programmer rarely controls what they are working on. This often comes under the direction of a customer or third party.
    * Depending on others programs can be painful. It is very annoying to find a system you depend on has a bug in it and its not meeting it's required specifications.
    * Designing is fun but fixing bugs painstaking laborious work
    * Debugging gets harder as more bugs are solved.
    * In many cases, the product you have been laboring over is obsolete by the time you are ready to release it. This can lead to massive frustration.

### The Mythical Man-Month
* Notes needed

### The Surgical Team

### Aristocracy, Democracy, and System Design

### The Second-System Effect

### Passing the Word

### Why Did the Tower of Babel Fail?

### Calling the Shot

### Ten Pounds in a Five-Pound Sack

### The Documentary Hypothesis

### Plan to Throw One Away

### Sharp Tools

### The Whole and the Parts

### Hatching a Catastrope

### The Other Face

### No Silver Bullet - Essence and Accident

### "No Silver Bullet" Refined

### Propositions of the Mythical Man-Month: True or False?

### The Mythical Man-Month after 20 years

## Insights
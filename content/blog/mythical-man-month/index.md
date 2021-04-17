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
* Techniques of estimating are poorly developed
* estimating techniques confuse effort with progress. (This hides the assumption that people and months are interchangeable)
* since we are unsure of our estimates it makes software managers lives difficult
* progress is poorly monitored.
* when slipage is seen often the idea of adding more manpower is assumed to be a solution.
* All programmers are optimists
    * Often we assume things like "The time time this will surely run"
    * Often we assume all will go well.
    * Reference to The [Mind of the Maker](https://www.amazon.com/Mind-Maker-Dorothy-L-Sayers/dp/1520215185)
    * In many creative activities (not programming) there are physical limitations that can be expressed. The difficulty in these cases is often implementation
    * Since programming is pure thought we expect very few issues in implementation because it is all thought matter.
    * Since our ideas are faulty we end up with bugs. This invalidates our optimism.
* Man-Month
    * Cost varies as the number of men or months are tweaked. However, progress does not.
    * A man-month is a bad unit for measuring the size of a job.
    * Men and months are only interchangeable in tasks that do not require communication. Programming is not one of these tasks.
    * If a task cannot be partitioned due to sequential blockers more effort will have no effect on the schedule.
    * In the case that a task can be partitioned it often still requires a lot of communication. This adds to the amount of time required to complete the task.
    * There is a burden to adding more developers
        * training, every new member must be brought up to speed and trained accordingly.
        * intercommunication, as you add more people there is even more communication that needs to happen.
    * Often adding more developers lengthens instead of shortens a project.
* System test
    * Debugging of a component and testing of a system are very dependant on sequential constraints.
    * Time required is dependant on the subtlety and number of errors found.
    * Breakdown of a software task
        * 1/3 Planning
        * 1/6 coding
        * 1/4 component test and early systems test
        * 1/4 system test
    * The time devoted to planning is larger than normal
    * half of time schedule is debugging
    * the easy part to estimate only makes up for 1/6th of the work.
    * Failure to plan enough time for a system test is dangerous. This is often found out later into the project and the impact is usually severe.
* Estimating
    * It is easy to promise something that cannot be delivered. I can promise you an omelet in two minutes but when that time is up the customer must choose to wait or eat it raw.
    * False scheduling to meet customer demands is far more common in this industry.
    * We need to publicize productivity, bug incidents figures. The whole industry would benefit from this. (Maybe open source and github has helped with this)
    * Managers need stronger backbones until our estimation techniques get better.
* What to do when a task is falling behind
    * You can add more heads but do it smartly. There are limits to how much and to what effect adding more heads will do.
    * reschedule, push the task out.
    * Trim the task, drop scope.
    * Brooks Law simplified "Adding manpower to a late software project makes it later"

### The Surgical Team
* People favor small teams but small teams cannot produce large systems.
* There are wide productivity differences between good and bad programmers. (I assume this is about the controversial 10x programmer)
* There is no correlation between years of experience and productivity.
* a small team should not exceed 10 people
* Harlan Mills has a solution
    * A segment of a large job should be tackled by a team.
    * This team should be organized like a surgical team.
    * In this model, each team member has a specific role to play.
    * The Surgeon
        * Also known as the chief programmer.
        * defines functional and performance specifications.
        * designs code
        * tests code
        * writes documentation
        * should have 10 years experience (reminds me of clean coders master role)
    * The copilot
        * able to do anything the surgeon can.
        * is less experienced than the surgeon.
        * main role in design is as a thinker, discussant, and evaluator.
        * the surgeon works with them to form ideas but is not bound to their suggestions.
        * They may write code but are not responsible for the code.
    * The administrator
        * This is the surgeon's boss.
        * manages personal raises etc.
    * The editor
        * This role reviews the documentation generated by the surgeon.
        * Provides references in documentation
        * criticizes and reworks the documentation.
    * The secretaries
        * handle correspondence for the administrator and editor.
    * The program clerk
        * Maintains all records of the team in a programming-product library
        * Is a secretary for but machine and human-readable files.
        * Makes all computer runs visible
        * Basically agregates program output/build information. (I suspect this role is largely un-needed now with advanced CI pipelines)
    * The toolsmith
        * Creates and maintains special tools for the surgeon
        * each team has their own toolsmith
        * only produces tools wanted or needed by their surgeon.
    * The tester
        * creates system tests from functional specs
        * Plans testing sequences
    * The language lawyer
        * Understand the programming language in use very well.
        * Helps find ways to do things that are difficult in the language of choice.
        * Can aid many surgeons

### Aristocracy, Democracy, and System Design
* Notes needed

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
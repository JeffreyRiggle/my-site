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
        * aggregates program output/build information. (I suspect this role is largely un-needed now with advanced CI pipelines)
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
* Conceptual integrity is the most important consideration in system design.
* it's better to omit some features if it makes design ideas consistent.
* Programming systems are intended to make a computer easy to use.
* Ease of use is only enhanced if time gained in functional specification exceeds time lost in learning, remembering, and searching manuals.
* Every part of a system should reflect the same philosophies and use the same techniques in syntax.
* There are two ways to keep the design consistent with multiple people working on a project
    * Careful division of labor between architecture and implementation.
    * Structured teams discussed in the surgical team
* Separation of architecture and implementation is a powerful tool for conceptual integrity.
* Architect of the system
    * job is to bring professional and technical knowledge to bear in the interest of the user. This is as opposed to the interested of the salesman
    * must carefully be distinguished from implementation.
* Architecture is what happens implementation is how it happens.
* Just because implementers or users have good ideas does not mean they are the right ideas. It is more important to keep the system consistent and that is the job of the architect.
* There should be few architects
* Architecture work is not more creative than implementation. Just because you are setting the external boundaries does not mean you have made all the creative choices.
* The cost-performance ratio is often where the implementors creativity lies.
* Form can be liberating. Sometimes having additional constraints makes your work more creative. this is not just seen in software as it has been seen in other practices like art.
* Common concerns for implementors that can have from an architecture team.
    * Specifications can be too rich in function and not reflect practical cost considerations. This concern is valid.
    * Architects will get all the creative fun. This is argued to not be true.
    * They will have to sit by idly while waiting on specifications to arrive. Don't hire implementors until you have the specs.
* Implementors can start as soon as a vague idea of the specification exists.
* The Implementor has tons of work to do even before the specification exists.

### The Second-System Effect
* When a cost is too high the software architect has two options
    1. Cut the design
    2. challenge the estimate by suggesting cheaper impelementations.
* The second option gets in the way of the implementer doing their job correctly.
* To do this right the architect must
    * remember that the implementor has inventive and creative control over implementation.
    * always be prepared to suggest a way of implementing what he specifies.
    * deal with these suggestions
    * be ready to forego credit for suggested improvements.
* When an architect designs a system they often keep track of embellishments that could be used in a second system.
* second systems are dangerous
    * tendency to over-design the second system
    * tends to change the system a bit. Fundamental aspects of the first system might be lost
    * aspects of the old system can become obsolete.
* when starting on a second system
    * avoid functional ornamentation
    * avoid extrapolation of functions
    * discipline is key
* If a second system is required consider having an architect who has already done two systems take on the job of the lead architect as they will have learned from their mistakes in their second system.

### Passing the Word
* a manual is a necessary tool
* a manual is an external specification of the product.
* manuals should not only include what a user sees but it should also refrain from describing everything a user does not see.
* The style of a manual should be precise.
* Writers of manuals must strain the language they use to create the level of precision required for a manual.
* Merits of formal definitions
    * They are precise
    * They tend to be complete
* Problems with formal definitions
    * They lack comprehensibility
* many tools exist for formal definitions
* care should be made in distinguishing externals in a formal definition
* formal definition is an implementation.
* implementation can also serve as a formal definition
* using implementation as a definition has these advantages
    * All questions can be answered unambiguously with experimentation.
    * debate is never needed
    * answers are always a precise as one needs and are always correct
* implementation may over-prescribe
* In an unpoliced system side effects can occur.
* implementation as formal definition can lead to confusion on if it is in fact standard.
* meetings help keep everyone on board. This can prevent hardware and software specifications from drifting
* telephone logs should be kept by architects.
    * These logs record all questions and answers.
    * each week this log is concatenated amongst all architects and sent out to implementors.

### Why Did the Tower of Babel Fail?
* Many project failures occur because two groups of people in a large organization are not talking
    * Each team often has assumptions that have not been verified about the other team.
* How to communicate cross team
    * Informally. Keeping everyone informed and having a clear understanding of intergroup dependencies helps.
    * Meetings. Have project meetings in which team after team gives a technical briefing.
    * Workbook. Create a formal workbook.
* Project workbook
    * It is a structure imposed on documents.
    * All documents of a project should follow this structure
    * Things that should be included: objectives, external specifications, interface specifications, technical standards, internal specifications, and administrative memoranda.
    * This is important because technical prose lasts a long time.
    * It is important to get the structure right so that memos can be turned into product-quality manuals.
    * This also serves to control the distribution of information. This is to not restrict information but instead to get it into all the hands that need it.
    * To keep every programmer in the loop every programmer should have a workbook and that workbook should be current.
    * Maintenance of a physical workbook can get very difficult over a long period with many contributors.
        * In this example, they solved the problem with microfiche
        * Later goes on to reflect on how it might be done today (when the book was published several decades ago). In this, we imagine a direct access file that is LIFO and everyone can see it. No one could directly change the document but they could provide updates that later get aggregated and put back into this read-only LIFO document.
        * I imagine today something like wikis or confluence is serving a similar purpose.
* Organization in a large programming project
    * Tree-like structures are good for authority and responsibility but are terrible for communication.
    * A tree-like programming organization must have these roles to be successful
        * a mission
        * a producer
        * a technical director or architect
        * a schedule
        * a division of labor
        * interface definitions
    * What is a producer?
        * The produce assembles a team, divides work, and creates a schedule.
        * They require the necessary resources for the team.
        * A major role is communication outside of the team.
        * ensures the schedule is met.
    * What is a technical director?
        * thinks up the design to be built
        * identifies parts of the design
        * specifies how things will look from the outside.
        * sketches the internal structure.
        * brings unity and conceptual integrity to the design.
        * limits technical complexity.
        * invents solutions or redesigns the system as problems arise.
    * The producer and the technical director can be the same person.
        * Can often work on small teams but gets harder to maintain on larger teams.
        * A person with strong management and technical skills is super rare.
    * In some cases, the producer can be the boss and the technical direction his right-hand man.
        * the producer can do subtle things to help the technical director to avoid power struggles. Examples include office size, carpet, furnishing, carbon copies, etc.
    * Just like the producer can be the boss the roles could be inverted. In some cases, the technical director is the boss and the producer is the right-hand man.

### Calling the Shot
* Estimations should not be based on coding alone since that is only 1/6th the effort
* Charles Portman conducted a study on productivity.
    * Found that tasks had been taking twice as long as estimated.
    * 50% of the time was found to be debugging time and programming time
    * The remaining time was split between unrelated jobs, meetings, paperwork, company business, sickness, personal time, etc.
    * Data suggested that there are unrealistic assumptions around technical work hours in a man-year.
* Joel Anon studied programmer productivity.
    * In this study, the relationship of interactions amongst developers and instructions written per year had been used.
    * With few interactions, 10,000 instructions should be able to be completed in a man-year
    * With some interactions, 5,000 instructions should be able to be completed in a man-year
    * With many interactions, 1,500 instructions should be able to be completed in a man-year
* John Harr did another study on this topic
    * productivity was measured in debugged words per man-year

| | Prog units | Number of programs | Years | Man-years | Program words | Words/man-year |
|-|-|-|-|-|-|-|
| Operational | 50 | 83 | 4 | 101 | 52,000 | 515 |
| Maintenance | 36 | 60 | 4 | 81 | 51,00 | 630 |
| Compiler | 13 | 9 | 2.25 | 17 | 38,000 | 2230 |
| Translator | 15 | 13 | 2.5 | 11 | 25,000 | 2270 |
* Data from IBM OS/360 experience, Aron and Harr confirm that productivity is related to the complexity and difficulty of a task.
* According to this data, compilers are three times as bad as batch application programs, and operating systems are three times as bad as compilers.
* Corbto data looks at lines of PL/I per man-year instead of words per man-year. In this study, the lines of debugged PL/I code was found to be 1,200.
    * According to this data, productivity is constant in terms of statements
    * According to this data, productivity may increase as much as five times with a high-level programming language.

### Ten Pounds in a Five-Pound Sack
* Much of this is based on the memory consumption of applications on hardware. At the time this was authored renting even 1KB of data a month was not cheap.
* builder of software must set size targets, control size and devise size-reduction techniques.
* hardware builder sets component-count targets, controls component count, and devises count-reduction techniques.
* Size is not a bad thing but unnecessary size is
* Size control
    * This is partially a technical job and partly a managerial one for a product manager.
    * users and applications need to be studied to get sizes right
    * Setting targets is not all that needs to be done. In addition, all aspects of size must be budgeted.
    * disk access is slow. At this time magnetic tape was common and round trips to the disk had been very expensive.
    * A good way to help avoid issues around this kind of thing is to define exactly what a module must do.
    * During implementation, architects must be vigilant in ensuring system integrity.
* Space techniques
    * Making a program small requires invention and craftsmanship.
    * More function means more space.
    * The first area of craftmanship is trading function for size.
        * The more fine-grained the user's options are the more space the program will take up.
        * Breaking functions into small modules costs performance and space?
    * The second area of craftmanship is space-time trade-offs.
        * To do this make sure your team is trained in programming techniques and not just reliant on previous experience.
        * Each program should have access to two different library sets for the common functionality. The quick one and the squeezed one.
* Often time gains are made via strategic breakthrough instead of tactical cleverness.
* Most breakthroughs will come from redoing the representation of data.

### The Documentary Hypothesis
* What are the critical documents for managers?
    * Objectives define the need to be met and the goals.
    * Specifications are the computer manual plus performance specifications.
    * Schedule
    * Budget is a very useful document for managers.
    * Organization chart
    * Space allocations
    * Estimate, forecast, and prices.
        * determine the success or failure of a project
        * To generate a forecast you need performance specifications and postulated prices.
        * Forecasts determine a per-unit share of development and fixed costs.
        * Forecasts allow you to determine prices.
        * If prices are below the postulated value then a success spiral occurs.
            * unit costs can drop
            * prices can drop
        * If prices are above the postulated value then a disastrous spiral begins
            * Performance must be squeezed
            * costs must be squeezed down.
* Documents for University departments
    * Objectives
    * Course descriptions
    * Degree requirements
    * Research proposals
    * Class schedule and teaching assignments
    * Budget
    * Space allocation
    * Assignment of staff and graduate students.
* Documents for a Software Project
    * What: Objectives. These define the needs, goals, desiderata, constraints, and priorities
    * What: Product specifications. Starts as a proposal but ends up a manual/internal document.
    * When: schedule
    * How much: budget
    * Where: space allocation
    * Who: organization chart
        * If the system is free to change the organization must be prepared to change as well.
* Need for formal documents
    * Gaps can only be found once inconsistencies arise in written documents.
    * They communicate decisions to others.
    * Provides a database and checklist to help managers figure out where to put their efforts.
* The task of a manager is to develop a plan and then to realize it. A written plan is precise and communicable.

### Plan to Throw One Away
* Chemical engineers build a pilot plant before making a fully operational factory since what works in a lab does not necessarily work in a factory.
* Programmers do not seem to have this process and this is a constantly repeated mistake.
* In many projects, the first version is barely usable.
* Even the best planning will not be sufficient and eventually, all code gets rewritten.
* This is an interesting dilemma for managers. Do you plan to build a pilot to throw away?
    * You should because you are going to do it anyway
* You need to accept change is an inevitable fact of life.
    * It's better to be prepared for it than have to comes to terms with it later.
* Planning a system for change
    * Use careful modularization
    * Have a complete and precise definition of inter-module interfaces.
    * Have complete documentation for modules
    * Use a high-level language.
    * Use self-documenting techniques.
    * Use compile-time operations to enforce standard declarations.
    * Use module versioning
    * Have good version releasing practices.
* Planning for Organizational changes.
    * All plans should be treated as tentative.
    * reluctance to generate documentation does not come from laziness. Instead, it comes from a designer's unwillingness to commit themselves to the defense of decisions known to be tentative.
        * "By documenting a design, the designer exposes himself to the criticisms of everyone, and he must be able to defend everything he writes."
    * Structuring an organization for change is harder than designing a system for change.
        * Every developer must be given tasks to broaden their skill set.
        * The manager needs to keep two or three top programmers to jump in on the toughest issues.
        * Managers and technical people need to be interchangeable as talents allow.
        * Often has sociological barriers
        * A common trap is for managers to think of senior people as "too valuable" to use for actual programming.
            * Bell labs overcame this issue by getting rid of job titles.
        * It's easy to increase salary with job tiers, it's harder to give higher job tiers more prestige.
        * Switching from a technical path to a manager path should never result in a raise.
            * This is a reassignment, not a promotion.
        * A manager should have technical refresher courses.
        * Senior developers should have management training.
        * Senior people must be kept technically and emotionally ready to manage groups or to build programs.
* Programs do not stop changing once they are delivered to a customer.
* Hardware and Software have very different maintenance requirements.
* Software Maintenance
    * Requires constant fixing of defects.
    * The cost of maintenance is typically 40% more than developing it in the first place.
    * The more users you have the more bugs that are found.
    * Old bugs found and solved strangely seem to come back in future releases.
    * New functions of a new release often have defects.
    * Bugs begin to plateau over time but some of this might be customers becoming complacent with the bugs that are in the system.
    * Fixing a defect has a 20-50% chance of introducing another.
        * Unless the program is well documented it is too easy to make a local change at a minimum effort instead of looking at the wider-reaching impact of the change.
        * The repairer is often not the developer that wrote the code. This is often done by a junior programmer or trainee.
        * Results in far more system testing
        * Regression testing must be done but it can be very costly.
    * The total number of modules increases linearly with each release number. Repairs often destroy the structure and cause disorder to the system.
    * Over time less effort is spent on fixing the original design flaws and more time is spent fixing flaws introduced by earlier fixes.
    * Things are always best at their beginning from a statistical model.

### Sharp Tools
* Many programmers have their own personal set of tools that they acquire over time and do not share
    * I do not think this is true anymore, if anything we have too many shared tools.
* Individualized tools hamper instead of aiding communication
* There are not enough general-purpose tools
    * Again not sure I agree with this in modern times.
* Target machines
    * machine support can be broken down into target machine and vehicle machines
        * The target machine is the one that the software is being written for.
        * The vehicle machines are the ones that provide the services used in the build system.
    * Teams building new supervisors or core system software need machines of their own.
        * This comes with the overhead of operators and a system programmer or two to make sure the machines in use are serviceable.
    * Debugging machines need to be instrumented so that counts and measurements can be made on all kinds of program parameters.
    * Scheduling can be a real issue when there is a limited supply of the target machine.
        * Generally speaking, usage starts low but as teams start to get ready to debug their features demand for time on the system is very high. Generally, all teams hit this point at the same time.
        * In the S/360 project no matter how they tried to divvy up the time it was always an issue and in the end, they need to allocate large segments of time to teams for debugging.
        * Giving large chunks of time on a target machine tends to work out better for productivity.
* Vehicle Machines and Data Services
    * If the target computer is new you need a simulator.
        * Needs to exist long before the target does.
        * Gives access to dependable debugging. This is not to be confused with accurate debugging as only the target machine will give that to you.
        * Anymore hardware works correctly. This means if you have a bug it would be wise to start looking at the software first.
            * This is not true for new machines. In the case of new machines often there are hardware issues.
            * Simulators help when these hardware issues do crop up.
    * Compiler and assemblers
        * Compilers and assemblers should work on vehicle machines but compile down to the target machine.
        * With high-level languages, a lot more testing can be done on the vehicle machine before moving to the target machine.
    * Program Libraries
        * OS/360 used vehicle machines to maintenance program libraries.
            * All code tested was kept in the library
            * Libraries were sub-libraries with different access rules.
            * Programmers had playpen areas with no restrictions. These had been used for test cases and component scaffolding.
            * When a program was ready for integration, this code was passed off to a manager that put the code into a system integration sub-library.
                * At this point, the programmer could no longer change the code with permission from the integration manager.
            * When the system version was ready for larger use it would be promoted to the current version sub-library.
                * This version never changes unless there are crippling bugs.
            * What this did right were control and formal separation. In this case, changes went through different stages.
                * This reminds me a bit of dev, test stage, prod cycles that are common in the industry now.
    * Program tools
        * Developers need dumps, source-file editors, snapshot dumps, and traces.
        * Developers also need utilities for putting decks on disks, making tape copies, printing files, and changing catalogs.
            * Not sure I believe this is relevant anymore.
    * Documentation system
        * It is better to over document than to under document a system.
    * Performance simulators are a must-have.
    * High-Level Language and Interactive Programming
        * These are powerful tools that had not gotten enough inertia at the time. I think this has changed over time. Anymore I suspect it is harder to find a developer that will work in anything other than a high level-language (assuming you consider c++, rust, etc high level)
        * High-Level languages
            * Are far more productive
            * Have better debugging speeds.
            * There tend to be fewer bugs.
                * This is because many semantic bugs are no longer possible. An example would be misusing registers.
                * The compiler often finds your bugs for you at compile time.
            * Common objections to high-level languages
                * It doesn't let me do what I want
                * Object code is too big
                * Object code is too slow
            * Objections are no longer valid. Compilers are doing a much better job at optimization.
            * At the time of authoring the recommended high level-language was [PL/I](https://en.wikipedia.org/wiki/PL/I)
        * Interactive programming
            * The author believes interactive programming will never replace batch systems for more applications.
            * There is no evidence to prove these tools are useful.

### The Whole and the Parts
* Notes needed

### Hatching a Catastrope

### The Other Face

### No Silver Bullet - Essence and Accident

### "No Silver Bullet" Refined

### Propositions of the Mythical Man-Month: True or False?

### The Mythical Man-Month after 20 years

## Insights
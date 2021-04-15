---
title: 'Book Note - Clean Coder'
date: '2021-04-14'
---

# The Clean Coder
[The clean coder](https://www.amazon.com/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073) is a book authored by [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin). This is one book of many in Roberts clean series.

## High level overview
This book is about uncle bob's take on what it means to be a professional programmer. Some of the key skills this book tries to take on are

* What it means to behave as a software craftsman.
* How to deal with tight schedules and demanding managers.
* How to get into good coding habits.
* How to avoid burnout.
* How to manage your time.
* How to foster an environment where programmers can thrive.
* How and when to say no.
* How and when to say yes.

## Notes

### Forward
This forward contains an interesting anecdote in which Robert worked with another manager. At this time he pushed the team hard to meet a deadline. By the description of pushing hard, it seemed like the conduct to his fellow developers was poor. When all was said and done the developers meet their goal but due to a legal team with a different priority structure, their efforts had been in vain. The interesting takeaway is that the legal team in this story was treated as professionals while the software engineers had not been treated the same way.

### Preface
This preface while outlining the book's contents also contains another interesting anecdote. This anecdote is 3rd hand and is about the engineers and the failure of engineering and management on the challenger project. This failure ultimately leads to the death of seven individuals and the slowdown in space exploration in the United States.

### Professionalism
Professionalism is all about acting as a professional might in any other industry. As with many industries being a professional is something to be proud of. A major part of being a professional is increased accountability. This means you are responsible for knowing your code works and knowing what you can and cannot do in a given time. It also means respecting your QA. It is not your QA engineer's job to find bugs you knew existed.

A professional software engineer understands the code they are writing and follows good design practices when creating features.

Another major aspect of being a professional is taking responsibility for your own career and career direction. It is not your employer's job to make sure you are keeping up to date in the world of software. This means they do not owe you trips to conferences or training materials. Software is an ever-changing industry and you must spend time outside of work to stay up to date and practiced in this field.

#### Original notes
* Being a professional is something to be proud of, but it means that you need to take on more accountability.
* Professionals do not cut corners to meet a deliverable target.
* Call for a hippocratic oath for software.
* Sending broken code to QA is unprofessional. QA should not be finding known bugs.
* professionals know code works. They know this because they use rigorous testing practices.
* professionals do not compromise structure to deliver a feature. Doing so sets future work up for failure.
  * mention of the boy scout rule and various other topics from clean code.
  * code should always be changing (constantly refactored)
* it is not your employer's job to handle your future
  * employers should not have to pay for your training
  * employers should not have to send you to conferences
  * employers do not have to give you work time to learn something new
* The only thing you owe your employer is an amount of time and effort (40 hours a week)
* Professionals should spend 60 hours a week on programming (that's right 20 hours of personal time a week)
  * Uncle Bob argues that since you can focus on whatever topic you like this should not lead to burnout. In personal experience, I pretty much agree.
* Professionals know their field.
  * You should be aware of what is happening in your field
  * Just because a publication or idea is old does not mean that it is irrelevant now. (read old publications)
  * Every software professional should know the following
    * Design patterns ([GOF](https://www.amazon.com/Design-Patterns-Object-Oriented-Addison-Wesley-Professional-ebook/dp/B000SEIBB8))
    * Design principles ([SOLID](https://en.wikipedia.org/wiki/SOLID))
    * Methods ([XP](https://en.wikipedia.org/wiki/Extreme_programming), [Scrum](https://en.wikipedia.org/wiki/Scrum_(software_development)), [Waterfall](https://en.wikipedia.org/wiki/Waterfall_model), etc)
    * Disciplines ([TDD](https://en.wikipedia.org/wiki/Test-driven_development), [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming), etc)
    * Artifacts ([UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language), [DFD](https://en.wikipedia.org/wiki/Data-flow_diagram), etc)
* This is a field of continuous learning.
* Professional practice often.
* Collaboration is a key skill
* Mentoring is a great way to learn.
* Know your domain. If you are entering a field you should read up on the domain you are going to be working in.
* Understand that the employer's problems are your problems.
* Professionals should be humble, not arrogant.
* Statement I am not sure I agree with. If you caused a bug that cost the company 10k you should be willing to pay for it out of your paycheck.

### Saying No
A professional knows when and how to say no. Part of this is assessing a situation and making sure you can commit to something. If your boss asks you to mean a deadline and you agree to it knowing you cannot make the deadline you are acting unprofessionally.

Often when something is at stake others might ask you to compromise your initial estimate, or to attempt to "try harder". In these cases, you must stand your ground. Agreeing to "try harder" implies that you are not already giving it your all and that there is still some reserved effort you can exert.

The cost of saying yes can lead to an utter mess. In these cases, we might think we are meeting deadlines and giving the employer what they want but ultimately what often ends up happening is we create an unmaintainable mess.

#### Original notes
* starts with a tale of Bob being pressured to complete a project too quickly.
  * His manager would not budge on the date
  * Bob and the team did not have the spine to stand up to the manager.
  * the result was a disaster
    * an intermittent bug caused terminals to lock up at a rate of 1 time per hour.
    * they could not roll back the change so the pressure to fix it faster was mounted (4 weeks was unacceptable)
* Professionals know how to say no.
* Saying no to your boss is not unprofessional, agreeing and falling short is.
* Adversity is a good thing. Developers should stand their ground that is doing their job. Likewise, managers should pressure for quicker turnaround while understanding the developers. It is also their job to see things done on time.
* Never agree to try. That implies you can do more and you have been holding something in reserve.
* Do not compromise estimates, stand your ground. If timelines are an issue provide a reasonable feature expectation (we can have feature x but it will be missing y is that alright?)
* Be direct with your estimates.
* If you hit a snag that could compromise an estimate let management know as soon as possible.
* Be a team player.
* Do not be passive-aggressive. An example is keeping a log of memos to use against someone later instead of trying to resolve the issue.
* cost of saying yes. This is an interesting article about a developer that agreed to an unreasonable project with shifting requirements under a ridiculous time frame. In the end, this project died and the developer felt remorse about the terrible code they created.
  * Bob argues that the developer or his employer is at fault.

### Saying Yes
To be a professional you need to know the right way to say yes to something. Language is everything in this case. There are several statements that you can make that sound non-committal. For example words like need, should, hope, wish and let's imply a lack of commitment. When you commit you need to 

1. say you will do it in a way that sounds like you mean it
2. mean that you will do it
3. actually do it

A strong commitment often sounds like this, "I will ... by ...".

There are cases in which life happens and a commitment cannot be made. In these cases, it is imperative to raise a red flag as soon as possible.

#### Original notes
* starts with an interesting story about how bob had and lost a patent for voicemail and wanted to start a project around it not knowing the patent was not renewed.
* parts of a commitment: say you will do it, mean you will do it, actually do it.
* words that indicate a lack of commitment: need/should, hope/wish, let's. These imply a lack of concrete commitment.
* an example of a strong commitment sounds more like this: I will ... by ...
* Good commitments are binary (either you did it or you did not do it)
* You can only commit to things you have full control of, to help mitigate this some suggestions are offered.
  * work with external parties to understand your dependencies
  * create an interface that mirrors the dependency.
  * work with the build team to make sure your work will build.
  * use integration tests.
* Just because it cannot be done does not mean you cannot commit to things that move you in the right direction.
* life happens and sometimes commitments cannot be made. The responsible thing to do in these cases is raise a red flag as soon as possible.
* Don't use try also do not agree to try.
* professionals know how much overtime they can handle and require people to respect their time. For example at the end of this chapter overtime needs to be done. The programmer agrees to work the weekend with the pre-requisite that their family is alright with it and the understanding that they will take Tuesday off to make up for lost time on the weekend.

### Coding
This is a topic Bob, has a lot to say on. He has written a different book on this very topic [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882).

A major part of coding is being in the right mindset. You should not code when you are tired or distracted. In some cases, life events can serve as a distraction to good code. In these cases, you should try to resolve your life events before coding. Failing to do this can lead to code you regret later on.

One common topic that most developers talk about is getting into the zone. Often developers claim that being in the zone is a desirable thing because you feel more productive. In this book, Bob argues that the zone is a dangerous thing. The zone is a meditative state that lacks collaboration. In Bob's eyes, this is a problem is programming is a collaborative effort.

When coding one should strive to reduce debugging time. To do this we should follow strong TDD practices. This should assure us the code works and only does exactly what it is specified to do.

At some point, we all run into issues. In these cases, pairing is the best thing we can do. This is something that quite a few books echo. Although it may be comfortable to work solo, two heads are often better than one and coding is no exception.

#### Original notes
* mentions the clean code book.
* talks about the unique challenge of code.
  * it must work
  * it must solve a customer problem
  * it has to fit well in an existing system.
  * it has to be readable to other programmers.
* Don't write code while tired or distracted, it will end up having to be redone.
  * Bob tells a story about some 3 am code he regretted for a long time to come.
* life events can impact the quality of code since your focus is not on the code.
  * find a way to "shut down the background process" (life event)
  * take time to deal with your personal issue but not at the expense of your employer.
* Bob comments on the "flow state" or the "Zone".
  * coding in the zone is a bad thing.
  * more of a form of meditation than a mechanism for good.
  * the zone is only where you want to be when practicing.
  * it is a non-communicative state.
* Music while programming in Bob's opinion is bad and is just a tool to enter the "zone".
* handling interruptions.
  * when in the zone the natural response might be to respond rudely.
  * pair programming and TDD can help since the pair programmer or test can keep your context.
  * remember to be professional next time you might be the one causing an interruption.
* To deal with writer's block consider pair programming.
* coding is a creative process so focusing on creativity is a good thing (just not while coding).
  * read books
  * watch videos (unless you are bob)
  * listen to music, etc.
* contains an interesting story about bob debugging a terminal lockup problem he mentioned earlier in the book.
* Professional programmers should strive to spend less time debugging (use TDD to help with this).
* Debugging is part of programming.
* Software development is a marathon, not a sprint, pace yourself.
* When stuck on a problem disengage from it and come back to it later. You just might find yourself solving the problem in the shower, etc.
* Inevitably you will be late on some work, the goal is to be transparent about it. (I feel like this has been talked about before)
* Hope is not a strategy hope is a project killer. Do not hope you will get something done in 10 days.
* Do not rush, rushing never solves problems faster. Do not give in to pressure and rush through something
* Only take overtime if you can handle it. The following are recommended.
  * you can personally afford it.
  * it is short-term.
  * your boss has a fallback plan.
* The most unprofessional behavior a programmer can engage in is changing the definition of "done".
  * don't say something is done when it is not.
  * This is an overt lie.
  * It is too easy to rationalize.
  * This practice is contagious, if someone sees you doing it they are likely to do it themselves.
  * This leads to bad communication between managers and developers.
  * Example calling a task done with a failing build.
  * The best way to avoid this is to have business analysts and testers create automated acceptance tests.
* No matter how skilled you are you can and should still ask for help.
  * when being help accept the help do not "protect your turf"
  * Do not push away help. Give it time.
  * It is unprofessional to remain stuck on an issue when help is available.
  * In general, programmers need to work on collaboration. Bob uses the example of the stereotype that often plays out in software (arrogant, self-absorbed introverts)
  * More experienced programmers have the responsibility to mentor less experienced programmers.
  * Mentoring is a good way to learn.

### Test Driven Development
Test Driven Development or TDD is a way of writing code. In this methodology, one writes a test before any code is written. Only enough test code is written to cause a failure. Once this happens no more test code is to be written. After this production code must be written until the test is passing. Once the test is passing no more production code is to be written.

TDD is the professional option. There are very few cases in which this is not the right thing to do.

#### Original notes
* TDD was part of the XP (extreme programming wave)
* TDD helps reduce cycle time.
* TDD works and everyone should accept that.
* Interesting section from the chapter (I like this). "How can you consider yourself to be a professional if you do not know that all your code works? How can you know all your code works if you don't test it every time you make a change? How can you test it every time you make a change if you don't have automated unit tests with very high coverage? How can you get automated unit tests with very high coverage without practicing TDD?"
* Laws of TDD
  * you cannot write any production code until you have a failing test.
  * you are not allowed to write more of a unit test than is sufficient to fail.
  * you are not allowed to write more production code than is sufficient to pass the currently failing test.
* Benefits
  * Certainty, you know the code works so you can release it at any time.
  * The defect rate is very low.
  * You have the courage to fix bugs because tests will let you know when you mess up another use case.
  * Tests act as documentation.
* TDD is the professional option.
* Warning what TDD is not
  * You can still write bad code even if your tests pass.
  * There are rare situations where TDD is not appropriate and being dogmatic about it can be wrong to do.

### Practicing
All professionals practice programmers should be no exception. There are several different ways you can practice.

* [coding kata](https://en.wikipedia.org/wiki/Kata_(programming))
* wasa
* Contributing to open source

The important thing is that you practice and practice often to keep your skills sharp.

#### Original notes
* All professionals practice (examples: doctors, musicians, sports players, etc)
* practicing is not a new concept consider "Hello, World!"
* cycle times on development have gotten better due to Moore's law.
* There are things called coding dojo's in which you can solve a known issue with other developers in a room.
* A coding kata is a good way to sharpen your skills. Solve a known issue practicing TDD.
* A wasa is like a kata but done as a team.
  * For example, one person might write a test then the next might get it to pass and write the next test, and so on until the issue is solved.
* Open source is a good way to practice and build a resume.
* Professional programmers practice on their own time.
* become a polyglot
* "Practicing is what you do when you are not getting paid. You do it so that you will be paid, and paid well"

### Acceptance Testing
Acceptance tests are a great way to make sure the business needs are understood and tested when a feature is created. These tests serve as the best form of documentation of requirements for developers. Acceptance tests must be written in a collaborative effort by both programmers and stakeholders.

While acceptance tests are different than integration and unit tests they should be automated much the same as a unit or integration test would be. In a perfect world, developers would not write these tests instead QA or business analysts would write the tests.

#### Original notes
* A professional developer is a communications role as well as a development role.
* Starts with an interesting story about how Bob wrote a feature from start to finish with a coworker and gained insights on how features are communicated.
* premature precision is an issue on both sides.
  * Business people what you know what they are going to get before they ok a project
  * developers want to know what they are supposed to deliver before they estimate the project.
* Things appear differently on a piece of paper than they do in a working system.
* Even with perfect information developer estimates will have huge variance.
* requirements will change making perfect information impossible
* professional developers know that estimates can, and should be made based on low precision requirements.
* a solution to premature precision is to defer as long as possible.
  * This can lead to late ambiguity.
    * This can lead to incorrect features being developed.
* Acceptance tests are the answer. In this case, an acceptance test is "tests written by a collaboration of stakeholders and the programmers to define when a requirement is done."
* done is when all tests pass, QA and stakeholders have accepted.
* Professional developers work with stakeholders and QA to ensure that automated tests are a complete specification of done.
* The purpose of acceptance tests is communication, clarity, and precision.
* Acceptance tests should always be automated. The reason for doing this is simple manual tests cost more money.
* While it does appear that it is more work in the long run it is less work than having manual tests.
* In a perfect world, QA and stakeholders would collaborate to write tests and developers would review for consistency.
* If developers write tests then the developer who wrote the feature must not also write the test. (interesting)
* Business analysts tend to write happy path tests.
* QA tends to write unhappy path tests.
* developers should negotiate with test authors for better tests when the test does not make sense.
* Don't be passive-aggressive "Well, that's what the test says, so that's what I'm going to do." should never be the answer.
* Acceptance tests are not unit tests.
  * unit tests are written by developers for developers.
  * acceptance tests are written by business for business.
* GUIs are hard to acceptance test.
* GUIs should follow SRP (single responsibility principle)
* Test using the correct interface. It's often better to test via an API instead of via the GUI.
* Acceptance tests should be run often in [CI](https://en.wikipedia.org/wiki/Continuous_integration).
* If tests are broken in CI this should be viewed as an emergency.

### Testing Strategies
As a professional developer, it is important to have a good testing strategy. Generally, a testing strategy should have a mix of unit, component, integration, system, and manual tests.

Unit tests should cover most if not all code paths. These unit tests are tests for developers not for business. Unit tests should be run in CI.

Component tests are tests against individual components of a system. These are generally acceptance tests defined by the business. Since these only test a single component mocking strategies should be used. Ideally, these tests cover 50% of your code and are written by QA.

Integration tests are tests that run against multiple components. These tests make sure the connections between components are working properly. Component tests should be written by architects or designers and should not be run in CI. While these do not run in CI they should be automated and they should run periodically.

System tests are tests that run against the entire integrated system. These tests are written by architects or technical leads.

Manual tests are exploratory tests conducted by humans. These are important tests but they should have the least coverage. The important thing is humans are creative and will be able to find new ways to break things or notice subtle bad behaviors.

#### Original notes
* Every professional developer has a good testing strategy.
* Bug hunts can be a testing strategy.
* QA should find nothing wrong. This will rarely happen but when QA finds a bug this should cause alarm for the development team (how did we let this happen)
* QA and development should work together and not be adversarial.
* QA should create automated acceptance tests.
* QA should use the discipline of exploratory testing.
* Mention of the test automation pyramid.
  * ~100% unit test ([xunit](https://xunit.net/), [junit](https://junit.org/), [jest](https://jestjs.io/), etc)
  * ~50% component tests (api)
  * ~20% integration tests (api)
  * ~10% system tests (gui)
  * ~5% manual exploratory tests
* unit tests
  * written by programmers for programmers
  * in the programming language of the system.
  * Are executed in CI
  * Should provide as close to 100% coverage as possible
* Component tests
  * are written against individual components of a system.
  * these are acceptance tests for the business rules of the component.
  * appropriate mocking should be used.
  * written by QA.
  * cover about 50% of the system.
* Integration tests.
  * test a collection of components
  * basically a connections test.
  * Often written by system architects or lead designers of the system.
  * might include performance or throughput tests.
  * These are not part of CI
  * Run periodically (weekly or nightly)
* System tests
  * execute against the entire integrated system.
  * do not test business rules directly.
  * written by system architects and technical leads.
* Manual Exploratory tests
  * are not automated or scripted.
  * intended to find unexpected behaviors.
  * it helps to have human brains and human creativity to find issues with the system.
  * There should be no written test plan for these.
  * The goal is not coverage instead it is to make sure the system works correctly.

### Time Management
Part of being a professional developer is managing your time appropriately. A major key to this is good meeting etiquette. While meetings are critical they can also be major time wasters. As a professional, you need to balance what meetings you should and should not be attending. Some things to consider when accepting a meeting. It is important to remember, the person inviting you to a meeting is not responsible for your time. One of the most important duties of your manager is to keep you out of meetings. Since meetings are large time sinks it is important to keep them on topic. In general, you should never accept a meeting request if no agenda is present. If at any time a meeting strays from the agenda it is important to stop and consider if a new meeting needs to be created.

Disagreements are common in software engineering. The best way to deal with these is to provide data. Brute force is never the right approach to resolving a disagreement. If there is insufficient data for either side of a disagreement sometimes the best option is a coin flip.

#### Original Notes
* 8 hours is not a lot of time?
* meetings
  * According to bob meetings cost around 200$ per attendee
  * meetings are necessary
  * meetings are huge time wasters.
  * some attendees may find a meeting to be invaluable while others can find it redundant or useless.
  * You don't have to go to every meeting you are invited to, doing so would be unprofessional?
  * be careful about which meetings to politely refuse.
  * the person inviting you to the meeting is not responsible for your time you are.
  * examples that are choices you must make
    * something you are interested in but is not immediately necessary.
    * something you can contribute to but is not immediately significant.
    * In these cases, you can work with your manager to see if you should participate.
    * One of the most important duties of your manager is to keep you out of meetings.
  * Leaving is an option when meetings get boring leave?
    * Do this politely by asking if your presence is still required.
  * Meetings should have an agenda and a goal.
  * things you should know going into the meeting
    * what discussions are on the table?
    * how much time is allotted for them?
    * what is the goal to be achieved?
  * If the meeting agenda has been high-jacked or abandoned, request the new topic be tabled and the agenda forwarded.
  * Stand-up meetings.
    * part of the Agile cannon.
    * The only thing that should be discussed are these three topics.
      * What did I do yesterday?
      * What am I going to do today?
      * What's in my way?
    * each question should require no more than 20 seconds.
  * Iteration planning meetings
    * Also part of agile cannon.
    * It takes skill for these meetings to go well.
    * Point is to select backlog items to work on next iteration.
    * Estimates should be done for candidate items.
    * In an exceptionally good organization, acceptance/component tests will already be written or at least sketched out.
    * No more than 5 or 10 minutes should be spent on any one item.
      * If more discussion is needed it should be scheduled at a different time with a smaller subset of people.
    * Bob's rule of thumb this meeting should take no longer than 5% of the total time in the iteration. (ex: 1-week iteration should be over within two hours.)
* Iteration Retrospective and demo
  * Discuss what went right and wrong.
  * stakeholders see a demo.
  * These meetings are often abused.
  * Bob's rule of thumb these should take 45 minutes. 20 for retrospective and 25 for demo.
* Disagreements
  * "Any argument that can't be settled in five minutes can't be settled by arguing." Kent Beck.
  * Technical disagreements are rarely grounded in data.
  * Force does not settle disagreements data does.
  * Being passive-aggressive in an argument just to sabotage it later is the worst kind of unprofessional.
    * If you agree you must engage.
  * How to settle a disagreement.
    * run experiments.
    * sometimes flipping a coin is the best option.
  * It is a good idea to agree to a time and set of criteria for abandoning a path.
  * Avoid meetings that exist just to vent a disagreement.
  * If an argument must be settled ask each arguer to present their case to the team in five minutes or less.
* Programming is an intellectual exercise that requires extended periods of concentration and focus. After you have used up all your focus you will have to recharge by doing unfocused activities for an hour or more.
* Managing focus is a key skill for professional developers.
* Sleep is key to good focus.
* Caffeine can help with focus but too much can cause jitter focus
* Good ways to recharge focus
  * take a walk
  * spend some time looking out the window.
  * talk with friends
  * meditate
  * get a power nap.
  * listen to a podcast
* physical focus can help mental focus (workout)
* A good way to manage time and focus is to use the Pomodoro technique (kindly reject all distractions over a 25 minute period). Repeat this process with 5-30 minute breaks in between.
* priority inversion is when you convince yourself something is more important or urgent than a task you do not want to do (for whatever reason). Professionals should not engage in this behavior.
* Avoid blind alleys it's easy to get too far down a technical pathway that will go nowhere. Keep an open mind to other ideas so when you hit a dead-end you still have options.
* Messes are worse than blind alleys. A mess can be worked by sheer brute force but are major progress impeders
* Messes are often the result of a bad design choice realized late into the product.
* Once you realize you have a mess you hit an inflection point: you can go back and fix the design or you can continue to go forward.
  * Going back means reworking existing code.
  * Going back is never easy.
  * If you go forward you may never escape.
  * Professionals are always on the lookout for messes and will expend all necessary effort to escape from them as early as possible.

### Estimation
Estimation is an important part of feature development. In general, the business views an estimate as a commitment while a developer views an estimate as a guess. A professional developer mustn't commit unless they know they can achieve it. As a professional, it is your job to make a clear distinction between an estimate and a commitment.

Various strategies can be used to generate an estimate. One interesting but somewhat involved estimation process is [PERT](https://en.wikipedia.org/wiki/Program_evaluation_and_review_technique). In PERT you end up generating an estimate by considering the best possible case, worse possible case, and average case.

#### Original notes
* Businesses view estimates as commitments
* developers view estimates as guesses.
* Professionals do not make commitments unless they know they can achieve them.
  * never commit to something you are uncertain about.
  * missing a commitment is an act of dishonesty.
* An estimate is a guess, no commitment is implied.
* developers are bad at estimates.
* estimates are a probability distribution.
* professionals draw a clear distinction between estimates and commitments.
* [PERT](https://en.wikipedia.org/wiki/Program_evaluation_and_review_technique)
  * a simple but effective way to convert estimates into probability distributions.
  * when estimating a task provide 3 numbers (trivariate analysis)
    * O: Optimistic Estimate. A wildly optimistic number. (less than a 1% chance of happening)
    * N: Nominal Estimate. The most likely estimate to be true.
    * P: Pessimistic Estimate. A wildly pessimistic number. (less than a 1% chance of happening)
  * Distribution based on these numbers. µ = O+4N+P/6
  * µ is the expected duration of the task
  * To calculate the standard deviate one can use this equation. σ = P-O/6 (how uncertain is the task)
  * PERT is a good way to prevent overly optimistic estimates.
* Estimating should be done with teammates, the group can estimate better than the individual.
* wideband delphi is a technique that aims at a consensus in estimation.
* Flying fingers is a strategy where everyone sits at a table, discusses the issue carefully, and puts up some fingers 1-5. If an agreement is not reached the topic is discussed further (this seems like the only way I have known estimation to work)
* Planning poker (what I have used) for the most part is a software refinement on the flying fingers strategy.
* Affinity estimation
  * all cards of stories are laid out.
  * No talking is to happen.
  * Cards are moved left to right (left being easiest relative to others and right being hardest)
  * Anyone can move a card at any time.
  * If a card is moved N times then it is set aside for discussion.
* you can use these same strategies to generate your optimistic and pessimistic values.
* To mitigate error you can take advantage of the Law of Large Numbers.

### Pressure
A professional software engineer understands how to manage pressure while still behaving professionally. A large portion of this is understanding how to avoid and manage pressure.

As far as avoidance goes it is important to avoid making commitments unless you know they can be met. It is also important to reject unrealistic commitments as it is a disservice to everyone.

An interesting thing is under pressure you find what your disciplines are. If you find that in a bind you stop following TDD then you know that TDD is not something you value. In these cases, it is important to stick with what you believe in. If you start doubling down on practices you do not find value in it will only increase pressure.

When you are under pressure it is important to manage it as best as you can. One great way to help is to make sure you are getting enough sleep. Even though you are under pressure it is very important not to rush. Rushing will lead to problems later on and will likely cause more stress.

When you are under stress communication is a great tool. In these cases make sure your manager is aware and see if there is anything they can do to help. Another great trick is to pair program. This can help reduce your stress while keeping code quality high. Your peer might spot issues you are making while under stress. It is also important that when you see others in these situations you offer your help.

#### Original notes
* starts with a comparison of a surgeon to a typical developer. The surgeon is cool and collected under pressure the developer is not.
* goes on to explain his time at what sounds like a toxic startup with insane time pressures.
* a good way to stay calm under pressure is to avoid situations that cause pressure.
* avoidance is not always an option so limit the required high-pressure situations.
* avoid making commitments unless you are sure they can be met.
* accepting unrealistic commitments is a disservice to developers and the business.
* sometimes commitments are made for us. In those cases, we must help the business find a way to meet those commitments. That being said we do not have to accept the commitments. (Interesting)
  * By not accepting the commitment we hold those who committed responsible instead of taking the fall.
* You can always hunt for a new job.
* It is important to stay clean to meet deadlines.
* "Quick and dirty" is an oxymoron, dirty is always slow.
* A crisis is a good measure of what you believe. If you follow your disciplines in a crisis then you believe in those disciplines.
  * For example, if you use TDD in noncrisis times but abandon it in a crisis you do not think TDD is helpful.
* Handling Pressure
  * Sometimes you cannot avoid it.
  * Manage stress, get sleep.
  * Resist temptation and do not rush. Rushing only makes things worse.
  * Let your team and manager know you are in trouble.
    * Let them know your plans for getting out of that trouble.
    * ask for input/guidance.
    * avoid surprises.
  * trust your disciplines. you have them for a reason now is not the time to abandon them.
  * Instead of looking for a solution to get it done faster buckle down on what you know and your disciplines.
  * Do pair programming. Partners help you find things you missed and often have helpful ideas.
  * When someone else is under pressure offer them help.

### Collaboration
Software development is all about working with others. There is a stereotype that is sadly often true in this industry that all programmers are arrogant introverts. It is important for professionals not to act in such ways.

Outside of working well with other developers, a professional software engineer must also be able to work with a variety of other roles in the company with varying levels of technical skill. To help these communications you must understand the business's problems, not just technical solutions.

#### Original notes
* It is unprofessional to be a loner or a recluse on a team.
* Starts with an interesting tale of Bob and Tim working together to speed up a searching algorithm for their codebase.
* Most programmers are introverts that would rather work alone (based on stereotypes that are often true)
* It's good to be passionate about what we do, but it's also good to keep your eyes on the goals of the people who pay you.
* It is your job to meet the needs of your employer
  * This means you will have to work with other people: testers, business analysts, managers, etc.
  * You need to understand why you are writing the code you are writing and the benefit of that code.
  * The worst thing you can do is get wrapped up in the technology while the business is burning all around you.
  * take time to understand the business. Talk to people to understand it better
  * pay attention to the companies health.
  * Bob goes on to tell the story of the time he was fired from a job for not understanding his employer's needs and work culture.
* Programmer conflict
  * a symptom of a dysfunctional team is when each programmer safeguards their code and does not let anyone else touch it.
    * This often leads to massive code duplication.
    * It can also lead to incorrect interfaces.
  * It's important to break down walls of code ownership (silos are bad)
  * All team members should be allowed to make changes to any module.
  * Professionals do not prevent others from working in their code.
  * Professionals learn from working with each other.
* Pair-programming is the most efficient way to solve a problem(?)
* Pair programming is a great way to share knowledge.
* All team members have a position to play.
* Pairing is the best way to review code.
* Working alone might be better for you but it is not better for the team.
* While we might not have gotten into this industry to work with people, programming is all about working with people.

### Teams and Projects
A good team is something to be envied in software development. The best way to create a good team is to keep that team consistent. It often takes a long time for people to get used to working with one another and creating ad-hoc teams constantly does not help.

By keeping a consistent team it becomes easy to change priorities on a whim since a new team does not have to be formed and the team members are already used to working with one another.

#### Original notes
* There is no such thing as a half-person. Often we do not fully resource a developer to a task.
* It does not make sense to have a developer devoted to two different projects especially when there are different project managers, business analysts, developers, and testers on each project.
* It takes time for a team to form/gel
* A team that has "gelled" is very special as they know how to work with each other very well. In these cases, things get done much better.
* A team should consist of: programmers, testers, analysts, and a project manager.
* analysts develop the requirements and write automated acceptance tests.
* testers write those acceptance tests.
* the project manager tracks the team's progress and makes sure the team understands schedules and priorities.
* It takes a while for team members to work out their differences. This can take up to a year, but once it's done it's worth it.
* Once a team has gelled it would be crazy to break that team up.
* Professional development organizations allocate projects to existing teams, they do not create ad-hoc teams.
* To measure these teams look at their velocities.
* Reallocating priorities in an emergency is virtually impossible with ad-hoc teams.
* This allows the business to change priorities on a whim.
  * This can intimidate project owners(?) however it is part of their job to make a case of their project.
* Teams are harder to build than projects so keep functioning teams together.

### Mentoring, Apprenticeship, and Craftmanship
Mentoring is a major gap in the software industry currently. Often college graduates are expected to be able to go straight into the industry and be productive. This mentality is crazy. There are plenty of other fields in which this would never happen and software is becoming too critical to be built by un-prepared individuals.

One idea as to how to handle this issue is to introduce the concept of apprenticeships into the software industry. In this program, there would be three major roles the master, the journeyman, and the apprentice. 

Masters are veterans in the industry and have worked in many different programming languages and systems. The master needs to stay up to date on the technology. Part of the responsibilities of the master is working with journeymen and testing apprentices to see if they are ready to become journeymen.

Journeymen are individuals that are knowledgeable but have not quite yet proven themselves to be masters. They are often very skilled at one language and one system. For the most part, it is the responsibility of the journeyman to work closely with the apprentices and mentor them.

The apprentice is where everyone should start their career. Apprentices should be under close supervision by journeymen and should spend a good amount of time peer programming without actually directly authoring any code.

While this might not be the best approach it certainly seems better than the current approach of trial by fire on production-grade software.

#### Original Notes
* cs graduates have not been taught what programming is all about
* nearly all cs graduates taught themselves to code before college and continued to teach themselves during college.
  * The system can teach you but it can also act as a diploma farm
* cs programs often do not prepare people for what they will find in the industry.
  * This is apparently common in most disciplines?
* Mentoring can happen just through observation
* Mentoring can happen from a manual that is well written.
* Mentoring can come in many forms
* Doctors do not just start on the field. The medical field has a discipline of intense mentoring.
* The medical profession oversees universities to make sure graduates have the best education.
* Even with a degree doctors are required to send a year under supervision (internship). After this internship, they go on to do a residency for 3 to 5 years. Once all of this is done they can finally take an exam to become board certified.
* If doctors have this intense process why don't we do it for software? While deaths are uncommon from software there are possibilities for major monetary loss.
* It is insane to expect to hire someone right out of college and ask them to work with a team to build a critical system.
  * This practice is seen basically nowhere: plumbers, painters, and electricians do not even do this.
* This topic does matter software is far more important than we may realize basically our whole civilization runs on it anymore.
* Apprenticeship
  * Masters
    * Have taken lead on more than one significant project.
    * typically have 10+ years experience
    * have worked in many languages, systems, and operating systems.
    * know how to lead and coordinate multiple teams.
    * are proficient designers and architects.
    * can code circles around everyone else
    * Generally have been offered management positions
    * maintain a technical role by reading, studying, practicing, doing, and teaching.
  * Journeymen
    * Programmers that are trained, competent and energetic
    * Learns to work well with a team and how to become a team leader.
    * Knowledge about technology but lack experience with diverse systems.
    * Tend to know one language, one system, and one platform.
    * Average is around 5 years experience
    * Inbetween Master and Apprentice stages.
    * supervised by masters
    * seldom allowed autonomy
    * code is scrutinized.
  * Apprentices/Interns
    * Starting point
    * have no autonomy
    * closely supervised by journeymen
    * start off taking no tasks at all and instead just assist journeymen
    * Intense pair-programming stage.
    * foundational period for values
    * journeymen teach them: design principles, design patterns, disciplines, and rituals. For example, things like TDD, refactoring, and estimation would be taught this way.
    * Should last at least a year
    * masters should evaluate a deemed ready apprentice to see if they should become a journeyman.
  * In reality
    * Graduates are generally supervised by young team leads.
    * supervision is not technical
    * programmers get raises and promotions because that is just what you do
    * the key difference between reality and ideal (other points before this) is to focus on technical teaching, training, supervision, and review.
    * What is missing today is the responsibility of elders to teach the young.
* A craftsman is someone who works quickly, but without rushing, who provides reasonable estimates, and meets commitments.
* Craftsmanship is a mindset held by craftsmen (duh)
* Craftsmanship is handed from one person to another and is taught by elders to young.
* You can't convince people to be craftsmen. To get others to emulate craftsmanship you must become a craftsman first and let your craftsmanship show.
* It is time for apprenticeship to be a part of software.

### Tooling
As time has gone on tooling has become better. This chapter is mostly about Bob's preferences for tooling.

#### Original notes
* best source control tooling comes from open source. ones not made this way are generally tools that are sold to managers, not developers.
* pessimistic locking is dead. tooling has become more advanced and merging issues are now manageable.
* The power of git is its branching strategy.
* git and tools like it are the future of source control.
* editors
  * [vi](https://en.wikipedia.org/wiki/Vi) is tried and true it may be old but it maintains its presence due to its speed and ease of use.
  * [emacs](https://en.wikipedia.org/wiki/Emacs) is one of the most powerful editors around.
  * [Eclipse](https://www.eclipse.org/ide/) and [Intellij](https://www.jetbrains.com/idea/), these editors allow for much more sophisticated manipulation of source code. They have powerful tools for renaming variables, class manipulation, and other similar features.
  * [TextMate](https://macromates.com/) is powerful and lightweight
* common tools for issue tracking: [Pivotal Tracker](https://www.pivotaltracker.com/), [Lighthouse](https://lighthouseapp.com/), and Wikis. The best place to start is often manual then find a tool that matches your style.
* Having thousands of bugs or features often means you have done something wrong.
* CI
  * [Jenkins](https://www.jenkins.io/) is a solid tool.
  * CI should run automatically on every code check-in
  * The build must be working at all times.
  * Failure should never be allowed to persist for over a day or two.
* Unit testing
  * Bob's favorites: [JUnit](https://junit.org/), [RSPEC](https://rspec.info/), [NUnit](https://nunit.org/), [Midje](https://github.com/marick/Midje), [CppUTest](http://cpputest.github.io/)
  * features all testing frameworks should have.
    * should be quick and easy to run tests.
    * should give a clear pass-fail indication.
    * should give a clear visual indicator of progress.
    * should discourage individual tests for communicating with one another.
    * should make it easy to write tests.
* Component testing
  * API testing tools
  * [FitNesse](http://fitnesse.org/), is Bob's own creation and he likes to use it for component testing.
  * Other tools in this camp: RobotFx, Green Pepper, [Cucumber](https://cucumber.io/), and [JBehave](https://jbehave.org/).
* Good UI testing tools are [selenium](https://www.selenium.dev/) and [Watir](http://watir.com/).
* UML has not proven to be a sufficient tool to express all of the details of a program. This is why we still write code instead of UML documents.

## Insights
Coming into this book I did not know if I was going to like it or not. This book is highly focused on the soft skills of programming that are rarely focused on in our industry. While I do not agree with Robert on every point I found myself in agreement a good amount of the time.

There is a common thread I did notice while reading this book. Robert loves to tell a story. What is interesting about this is while some of these stories and annecdotes are amusing they often contain a nugget of wisdom. While I do not fully understand how someone can make some of the mistakes Robert has in his career I did enjoy reading them. I often find the best way to learn is to make a mistake and its even better when you can learn from someone elses mistakes. I am assured that some mistakes shown in this book are not just Robert being a stupid kid and are mistakes even would be professionals could make.

A lot of this book seems to talk about dealing with pressure. Maybe the industry has changed or I am a personally that is not easily impacted by unrealistic requests, but I do not often feel the same pressures as described in this book. I understand that I get pressure from product owners, product managers and business analysts but I am always sure to let them know what is at stake. In general I see it as me doing my job and them doing their job.

The concept of practicing and continued studying seems like a no brainer to me but I could see where others might not be willing to devote time into this practice and it is a good call out. Not everything you learn in this industry is on the job.

I think one of the most impactful parts of this book for me was the apprenticeship discussion. I have always felt like the industry has been missing this. I have often heard of people mixing bootcamps and college but that still doesn't quite feel right to me. Personally I prefer the idealized apprenticeship model discussed in this book. This is a practice that is done in many trades and professions and it still boggels my mind that this is not a common or documented practice in software.
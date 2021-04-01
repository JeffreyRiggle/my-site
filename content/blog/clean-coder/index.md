---
title: 'Book Note - Clean Coder'
date: '2021-03-25'
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
This forward contains an interesting annectdote in which Robert worked with another manager. In this time he pushed he team hard to meet a deadline. By the desciption of pushing hard it seemed like the conduct to his fellow developers was poor. When all was said and done the developers meet their goal but due to a legal team with a different proirty structure, their efforts had been in vein. The interesting takeway is that the legal team in this story was treated as professionals while the software engineers had not been treated the same way.

### Preface
This preface while outlining the books contents also contains another interesting annectdote. This annectdote is actually 3rd hand and is about the engineers and the failure of engineering and management on the challenger project. This failure ultimately lead to the death of seven individuals and the slow down in space exploration in the United States.

### Professionalism
* Being a professional is something to be proud of, but it means that you need to take on more accountability.
* Professionals do not cut corners to meet a deliverable target.
* Call for a hyppocratic oath for software.
* Sending broken code to QA is unprofessional. QA should not be finding known bugs.
* professionals know code works. They know this because they use rigous testing practices.
* professionals do no comprimise structure to devliver a feature. Doing so sets future work up for failure.
 * mention of the boy scout rule and various other topics from clean code.
 * code should always be changing (constantly refactored)
* it is not your employers job to handle your future
 * employers should not have to pay for your training
 * employers should not have to send you to conferences
 * employers do not have to give you work time to laarn something new
* The only thing you owe your employer is an amount of time and effort (40 hours a week)
* Professionals should spend 60 hours a week on programing (thats right 20 hours of personal time a week)
 * Uncle bob argues that since you can focus on whatever topic you like this should not lead to burnout. In personal experience I pretty much agree.
* Professionals know their field.
 * You should be aware of what is happening in your field
 * Just because a publication or idea is old does not mean that it is irrelevant now. (read old publications)
 * Every software professional should know the following
  * Design patterns (GOF book mentioned)
  * Design principles (SOLID)
  * Methods (XP, Scrum, Waterfall, etc)
  * Disciplines (TDD, OOP, etc)
  * Artifacts (UML, DFD, etc)
* This is a feild of continuous learning.
* Professional practice often.
* Collaboration is a key skill
* Mentoring is a great way to learn.
* Know your domain. If you are entering a feild you should read up on the domain you are going to be working in.
* Understand that the employers problems are your problems.
* Professionals should be humble not arrogant.
* Statement I am not sure I agree with. If you caused a bug that cost the company 10k you should be willing to pay for it out of your paycheck.

### Saying No
* starts off with a tale of bob being pressured to complete a project too quickly.
 * Manager would not budget on date
 * bob and team did not have the spine to stand up to the manager.
 * result was a disaster
  * intermittent bug caused terminals to lock up at a rate of 1 time per hour.
  * could not roll back the change but pressure to fix it faster was mounted (4 weeks was unacceptible)
* Professionals know how to say no.
* Saying no to your boss is not unprofessional, agreeing and falling short is.
* Advesity is a good thing. Developers should stand their ground that is doing your job. Likewise managers should pressure for quicker turn around while understanding the developers. It is also their job to see things done on time.
* Never agree to try. That implies you can do more and you have been holding something in reserve.
* Do not compromise estimates, stand your ground. If timelines are an issue provide a reasonable feature expecatation (we can have feature x but it will be missing y is that alright?)
* Be direct with your estimates.
* If you hit a snag that could comprimise an estimate let management know as soon as possible.
* Be a team player.
* Do not be passive agressive. An example is keeping a log of memos to use against someone later instead of trying to resolve the issue.
* cost of saying yes. This is an interesting article about a developer that agreed to an unreasonable project with shifting requirements under a rediculous time frame. In the end this project died and the developer felt remourse about the terrible code they created.
 * bob aruges that the developer or his employer is at fault.

### Saying Yes
* starts off with interesting story about how bob had and lost a patent for voicemail and wanted to start a project around it not knowning the patent was not renewed.
* parts of a commitment: say you will do it, mean you will do it, actually do it.
* words that indicate a lack of commitment: need/should, hope/wish, let's. These imply a lack of concrete commitment.
* an example of a strong commitment sounds more like this: I will ... by ...
* Good commitments are binary (either you did it or you did not do it)
* You can only commit to things you have full control of, to help mitigate this some suggestions are offered.
  * work with external parties to understand your dependencies
  * create an interface that mirrors the dependency.
  * work with build team to make sure your work will build.
  * use integration tests.
* Just because it cannot be done does not mean you cannot commit to things that move you in the right direction.
* life happens and sometimes commitments cannot be made. The resposible thing to do in these cases is raise a red flag as soon as possible.
* Don't use try also do not agree to try.
* professionals know how much overtime they can handle and require people to respect their time. For example in the end of this chaper overtime needs to be done. The programmer agrees to work the weekend with the pre-requisit that their family is alright with it and the understanding that they will take Tuesday off to make up for lost time on the weekend.

### Coding
* mentions the clean code book.
* talks about the unique challenge of code.
 * it must work
 * it must solve a customer problem
 * it has to fit well in an existing system.
 * it has to be readable to other programmers.
* Don't write code while tired or distracted, it will end up having to be redone.
 * Bob tells a story about some 3am code he regreted for a long time to come.
* life events can impact quality of code since your focus is not on the code.
 * find a way to "shut down the background process" (life event)
 * take time to deal with your personal issue but not at the expense of your employer.
* Bob comments on the "flow state" or the "Zone".
 * coding in the zone is a bad thing.
 * more of a form of meditation than a mechanism for good.
 * the zone is only where you want to be when practicing.
 * it is a non-communicative state.
* Music while programming in bobs opinion is bad and is just a tool to enter the "zone".
* handling interruptions.
 * when in the zone the natural response might be to respond in a rude way.
 * pair programming and TDD can help since the pair programmer or test can keep your context.
 * remember to be professional next time you might be the one causing an interruption.
* To deal with writers block consider pair programming.
* coding is a creative process so focusing on creativity is a good thing (just not while coding).
 * read books
 * watch videos (unless you are bob)
 * listen to music, etc.
* contains interesting story about bob debuging a terminal lockup problem he mentioned earlier in the book.
* Professional programmers should strive to spend less time debugging (use TDD to help with this).
* Debugging is part of programming.
* Software development is a marathon not a sprint, pace yourself.
* When stuck on a problem disengadge from it and come back to it later. You just might find yourself solving the problem in the shower, etc.
* Inevidtably you will be late on some work, the goal is to be transparent about it. (I feel like this has been talked about before)
* Hope is not a strategy hope is a project killer. Do not hope you will get something done in 10 days.
* Do not rush, rushing never solves problems faster. Do not give into pressure and rush thought something
* Only take overtime if you can handle it. The following are recommended.
 * you can personally afford it.
 * it is short term.
 * your boss has a fallback plan.
* The most unprofessional behavior a programmer can engage in is changing the definition of "done".
 * don't say something is done when it is not.
 * This is an overt lie.
 * It is too easy to rationalize.
 * This practice is contageous, if someone sees you doing it they are likely to do it themselves.
 * This leads to bad communication between managers and developers.
 * Example calling a task done with a failing build.
 * Best way to avoid this is to have business analysts and testers create automated acceptance tests.
* No matter how skilled you are you can and should still ask for help.
 * when being help accept the help do not "protect your turf"
 * Do not push away help. Give it time.
 * It is unprofessional to remain stuck on an issue when help is available.
 * In general programmers need to work on collaboration. Bob uses the example of the stereotype that often plays out in software (arrogant, self-absorbed introverts)
 * More experience programmers have the resposibility to mentor less experienced programmers.
 * Mentoring is a good way to learn.

### Test Driven Development
* TDD was part of the XP (extreme programming wave)
* TDD helps reduce cycle time.
* TDD works and everyone should accept that.
* Interesting section from chapter (I like this). "How can you consider yourself to be a professional if you do not know that all your code works? How can you know all your code works if you don't test it every time you make a change? How can you test it every time you make a change if you don't have automated unit tests with very high coverage? How can you get automated unit tests with very high coverage without practicing TDD?"
* Laws of TDD
 * you cannot write any production code until you have a failing test.
 * you are not allowed to write more of a unit test than is sufficient to fail.
 * you are not allowed to write more production code than is sufficient to pass the currently failing test.
* Benefits
 * Certainty, you know the code works so you can release at any time.
 * Defect rate is very low.
 * You have the courage to fix bugs because tests will let you know when you mess up another use case.
 * Tests act as documentation.
* TDD is the professional option.
* Warning what TDD is not
 * You can still write bad code even if your tests pass.
 * There are rare situations where TDD is not appropriate and being dogmatic about it can be wrong to do.

### Practicing
* All professionals practice (exmaples: doctors, musicians, sports players, etc)
* practicing is not a new concept consider "Hello, World!"
* cycle times on development have gotten better due to moores law.
* There are things called coding dojo's in which you can solve a know issue with other developers in a room.
* A coding kata is a good way to sharpen your skills. Solve a known issue practicing TDD.
* A wasa is like a kata but done as a team.
 * example one person might write a test then the next might get it to pass and write the next test and so on until the issue is solved.
* Open source is a good way to practice and build a resume.
* Professional programmers practice on their own time.
* become a polyglot
* "Practicing is what you do when you are not getting paid. You do it so that you will be paid, and paid well"

### Acceptance Testing
* A professional developer is a communications role as well as a development role.
* Starts off with an interesting story about how Bob wrote a feature from start to finish with a coworker and gained insights on how features are communicated.
* permature precision is an issue on both sides.
 * Business poeple what you know what they are going to get before they ok a project
 * developers wnat to know what they are supposed to deliver before they estimate the project.
* Things appear differently on a peice of paper than they do in a working system.
* Even with perfect information developer estimates will have huge variance.
* requirements will change making perfect information impossible
* professional developers know that estimates can, and should be made based on low precision requirements.
* a solution to premature precision is to defer as long as possible.
 * This can lead to late ambiguity.
   * This can lead to incorrect features being developed.
* Acceptance tests are the answer. In this case an acceptance test are "tests written by a collaboration of stakeholders and the programmers in order to define when a requirement is done."
* done is when all tests pass, QA and stakeholders have accepted.
* Professional developers work with stakeholders and QA to ensure that automated tests are a complete specification of done.
* The purpose of acceptance tests is communication, clarity and precision.
* Acceptance tests should always be automated. The reason for doing this is simple manual tests cost more money.
* While it does appear that it is more work in the long run it is less work than having manual tests.
* In a perfect world QA and stakeholders would collaborate to write tests and developers would review for consistency.
* If developers write tests then the developer who wrote the feature must not also write the test. (interesting)
* Business analysts tend to write happy path tests.
* QA tends to write unhappy path tests.
* developers should negotiate with tests authors for better tests when the test does not make sense.
* Don't be passive aggressive "Well, that's what the test says, so that's what I'm going to do." should never be the answer.
* Acceptance tests are not unit tests.
 * unit tests are written by developers for developers.
 * acceptance tests are written by business for business.
* GUIs are hard to acceptance test.
* GUIs should follow SRP (single responsibility principle)
* Test using the correct interface. Its often better to test via an API instead of via the GUI.
* Acceptance tests should be run often in CI.
* If tests are broken in CI this should be viewed as an emergency.

### Testing Strategies
* refresh on this

### Time Management
* current chapter

## Insights
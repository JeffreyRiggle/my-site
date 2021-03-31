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
* refresh on this

### Practicing
* refresh on this

### Acceptance Testing
* refresh on this

### Testing Strategies
* refresh on this

### Time Management
* current chapter

## Insights
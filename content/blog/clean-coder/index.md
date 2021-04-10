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
* Every professional developer has a good testing strategy.
* Bug hunts can be a testing strategy.
* QA should find nothing wrong. This will almost never happen but when QA finds a bug this should cause alarm for the development team (how did we let this happen)
* QA and development should work together and not be adversarial.
* QA should create automated acceptance tests.
* QA should use the discipline of exploratory testing.
* Mention of the test automation pyramid.
 * ~100% unit test (xunit, junit, jest, etc)
 * ~50% component tests (api)
 * ~20% integration tests (api)
 * ~10% system tests (gui)
 * ~5% manual exploratory tests
* unit tests
 * written by programmers for programmers
 * in programming language of system.
 * Are executed in CI
 * Should provide as close to 100% coverage as possible
* Component tests
 * written against individual components of a system.
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
 * execute against the entier integrated system.
 * do not test business rules directly.
 * written by system architects and technical leads.
* Manual Exploratory tests
 * not automated or scripted.
 * intended to find unexpected behaviors.
 * it helps to have human brains and human creativity to find issues with the system.
 * There should be no written test plan for these.
 * Goal is not coverage instead it is to make sure the system works correctly.

### Time Management
* 8 hours is not a lot of time?
* meetings
 * According to bob meetings cost around 200$ per attendee
 * meetings are necessary
 * meetings are huge time wasters.
 * some attendees may find a meeting to be invaluable while others can find it redundant or useless.
 * You don't have to go to every meeting you are invited to, doing so would be unprofessional?
 * be careful about which meetings to politely refuse.
 * person inviting you to the meeting is not responsible for your time you are.
 * examples that are choices you must make
  * something you are interested in but is not immediately necessary.
  * something you can contribute to but is not immediately significant.
  * In these cases you can work with your manager to see if you should participate.
  * One of the most important duties for your manager is to keep you out of meetings.
 * Leaving is an option, when meetings get boring leave?
  * Do this politely by asking if your presence is still required.
 * Meetings should have an agenda and a goal.
 * things you should know going into the meeting
  * what discussions are on the table
  * how much time is allotted for them.
  * what is the goal to be achieved.
 * If meeting agenda has been high-jacked or abandoned, request the new topic be tabled and the agenda forwarded.
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
  * In an exceptionally good organization acceptance/component tests will already be written or at least sketched out.
  * No more than 5 or 10 minutes should be spent on any one item.
   * If more discussion is needed it should be scheduled at a different time with a smaller subset of people.
  * Bobs rule of thumb this meeting should take no longer than 5% of the total time in the iteration. (ex: 1 week iteration should be over within two hours.)
* Iteration Retrospective and demo
 * Discuss what went right and wrong.
 * stakeholders see a demo.
 * These meetings are often abused.
 * Bobs rule of thumb these should take 45 mintues. 20 for retrospective and 25 for demo.
* Disagreements
 * "Any argument that can't be settled in five minutes can't be settled by arguing." Kent Beck.
 * Technical disagreements are rarely grounded in data.
 * Force does not settle disagrements data does.
 * Being passive agressive in a agrument just to sabotage it later is the worst kind of unprofessional.
  * If you agree you must engage.
 * How to settle a disagrement.
  * run experiments.
  * sometimes flipping a coin is the best option.
 * It is a good idea to agree to a time and set of critera for abandoning a path.
 * Avoid meetings that exist just to vent a disagreement.
 * If argument must be settled ask each arguer to present their case to the team in five minutes or less.
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
* A good way to manage time and focus is to use the pomodoro technique (kindly reject all distractons over a 25 minute period). Repeat this process with 5-30 minute breaks in between.
* priority inversion is when you convince yourself something is more important or urgent than a task you do not want to do (for whatever reason). Professionals should not engage in this behavior.
* Avoid blind alleys its easy to get too far down a technical pathway that will go nowhere. Keep an open mind to other ideas so when you hit a dead end you still have options.
* Messes are worse than blind alleys. A mess can be worked by sheer brute force but are major progress impeders
* Messes are often the result of a bad design choice realized late into the product.
* Once you realize you have a mess you hit an inflection point: you can go back and fix the design or you can continue to go forward.
 * Going back means reworking existing code.
 * Going back is never easy.
 * If you go foward you may never escape.
 * Professional are always on the lookout for messes and will expend all necessary effort to escape from them as early as possible.

### Estimation
* Businesses view estimates as commitments
* developers view estimates as guesses.
* Professionals do not make commitments unless they know they can achieve them.
 * never commit to something you are uncertain about.
 * missing a commitment is an act of dishonesty.
* An estimate is a guess, no commitment is implied.
* developers are bad a estimates.
* estimates are a probability disribution.
* professionals draw clear distinction between estimates and commitments.
* PERT
 * simple but effective way to convert estimates into probability distributions.
 * when estimating a task provide 3 numbers (trivariate analysis)
  * O: Optimistic Estimate. A wildly optimistic number. (less than a 1% chance of happening)
  * N: Nominal Estimate. The most likely estimate to be true.
  * P: Pessimistic Estimate. A wildly pessimistic number. (less than a 1% chance of happening)
 * Distribution based on these numbers. µ = O+4N+P/6
 * µ is the expected duration of the task
 * To calculate the standard deviate one can use this equation. σ = P-O/6 (how uncertain is the task)
 * PERT is a good way to prevent overly optimistic estimates.
* Estimating should be done with teammates, the group can estimate better than the individual.
* wideband delphi, is a technique that aims at consensus in estimation.
* Flying fingers is a strategy where everyone sits at a table, discusses the issue carefully and puts up a number of fingers 1-5. If agreement is not reached the topic is discussed further (this seems like the only way I have really known estimation to work)
* Planning poker (what I have actually used) for the most part this is a software refinement on the flying fingers stragegy.
* Affinity estimation
 * all cards of stories are layed out.
 * No talking is to happen.
 * Cards are moved left to right (left being easiest relative to others and right being hardest)
 * Anyone can move a card at any time.
 * If a card is moved N times then it is set aside for discussion.
* you can use these same strategies to generate your optimistic and pessimistic values.
* To mitigate error you can take advantage of the Law of Large Numbers.

### Pressure.
* starts off with a comparision of a surgeon to a typical developer. The surgeon is cool and collected under pressure the developer is not.
* goes on to explain his time at what sounds like a toxic startup with insane time pressures.
* a good way to stay calm under pressure is to avoid situations that cause pressure.
* avoidance is not always an option so limit the required high pressure situations.
* avoid making commitments unless you are sure they can be met.
* accepting unrelasitc commitments is a disservice to developers and the business.
* sometimes commitments are made for us. In those cases we must help the business find a way to meet those commitments. That being said we do not have to accept the commitments. (Interesting)
 * By not accepting the commitment we hold those who made the commitment resposible instead of taking the fall.
* You can always hunt for a new job.
* It is important to stay clean in order to meet deadlines.
* "Quick and dirty" is an oxymoron, dirty is always slow.
* Crisis is a good measure of what you really believe. If you follow your disciplines in a crisis then you believe in those disciplines.
 * Example if you use TDD in noncrisis times but abandon it in a crisis you do not think TDD is helpful.
* Handling Pressure.
 * Sometimes you cannot avoid it.
 * Manage stress, get sleep.
 * Resist temptation and do not rush. Rushing only makes things worse.
 * Let your team and manager know you are in trouble.
  * Let them know your plans for getting out of that trouble.
  * ask for input/guidance.
  * avoid suprises.
 * trust your disciplines. you have then for a reason now is not the time to abandon them.
 * Instead of looking for a solution to get it done faster buckle down on what you know and your disciplines.
 * Do pair programming. Partners help you find things you missed and often have helpful ideas.
 * When someone else is under pressure offer them help.

### Collaboration
* It is unprofessional to be a loner or a recluse on a team.
* Starts with an interesting tale of Bob and Tim working together to speed up a searching algorithm for their code base.
* Most programmers are introverts that would rather work alone (based on stereotypes which are often true)
* It's good to be passionate about what we do, but its also good to keep your eyes on the goals of the people who pay you.
* It is your job to meet the needs of your employer
 * This means you will have to work with other people: testers, business analyists, managers, etc.
 * You need to understand why you are writing the code you are writing and the benefit of that code.
 * The worst thing you can do is get wrapped up in the technology while the business is burning all around you.
 * take time to understand the business. Talk to people to understand it better
 * pay attention to the companies health.
 * Bob goes on to tell the story of the time he was fired from a job for not understanding his employers needs and work culture.
* Programmer conflict
 * a symptom of a dysfunctional team is when each programmer safe guards there code and does not let anyone else touch it.
  * This often leads to massive code duplication.
  * It can also lead to incorrect interfaces.
 * Its important to break down walls of code ownership (silos are bad)
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
* There is no such thing as a half person. Often times we do not fully resource a developer to a task.
* It does not make sense to have a developer devoted to two different projects especially when there are different project managers, business analysists, developers and testers on each project.
* It takes time of a team to form/gel
* A team that has "gelled" is very special as they know how to work with each other very well. In these cases things get done much better.
* A team should consist of: programmers, testers, analysts and a project manager.
* analysts develop the requirements and write automated acceptance tests.
* testers write those acceptance tests.
* project manager tracks teams progress and makes sure the team understands schedules and priorities.
* It takes a while for teammembers to work out their differences. This can take up to a year, but once its done it's worth it.
* Once a team has gelled it would be crazy to break that team up.
* Professional development organizations allocate projects to exsiting teams, they do not create adhoc teams.
* To measure these teams look at their velocities.
* Reallocating priorities in an emergency is virtually impossible with adhoc teams.
* This allows the business to change priorites on a whim.
 * This can intemidate project owners(?) however it is part of their job to make a case of their project.
* Teams are harder to build than projects so keep functioning teams together.

### Mentoring, Apprenticeship, and Craftmanship
* cs graduates have not been taught what programming is all about
* nearly all cs graduates taught themselves to code before college and continued to teach themselves during college.
 * The system can teach you but it can also act as a diploma farm
* cs programs often do not prepare people for what they will find in industry.
 * This is apparently common in most disciplines?
* Mentoring can happen just through observation
* Mentoring can happen from a manual that is well written.
* Mentoring can come in many forms
* Doctors do not just start on the field. The medical field has a discipline of instense mentoring.
* The medical profession oversees universities to make sure graduates have the best education.
* Even with a degree doctors are required to send a year under supervision (intership). After this internship they go on do a residency for 3 to 5 years. Once all of this is done they can finally take an exam to become board certified.
* If doctors have this intense process why don't we do it for software? While deaths are uncommon from software there are possibilities for major monetary loss.
* It is insane to expect to hire someone right out of college and ask them to work with a team to build a critical system.
 * This practice is seen basically nowhere: plumbers, painters and electritions do not even do this.
* This topic does matter software is far more important than we may realize basically our whole civilization runs on it anymore.
* Apprenticeship
 * Masters
  * Have taken lead on more than one significant project.
  * typically have 10+ years experience
  * have worked in many languages, systems and operating systems.
  * know how to lead and coordinate multiple teams.
  * are proficient designers and architects.
  * can code circles around everyone else
  * Generally have been offered management positions
  * maintain a techincal role by: reading, studying, practicing, doing and teaching.
 * Journeymen
  * Programmers that are trained, competent and energetic
  * Learns to work well with a team and how to become a team leader.
  * Knowledge about technology but lack experience with diverse systems.
  * Tend to know one language, one system and one platform.
  * Average is around 5 years experience
  * Inbetween Master and Apprentice stages.
  * supervised by masters
  * seldom allowed autonomy
  * code is scrutinized.
 * Apprentices/Interns
  * Starting point
  * have no autonomy
  * closely supervised by journeymen
  * start off taking no tasks at all and instead just provide assistance to journeymen
  * Intense pair-programming stage.
  * foundational period for values
  * journeymen teach them: design principals, design patterns, disciplines, and rituals. For example things like TDD, refactoring and estimation would be taught this way.
  * Should last at least a year
  * masters should evaluate a deemed ready apprentice to see if they should really become a journeyman.
 * In reality
  * Graduates are generally supervised by young team leads.
  * supervision is not technical
  * programmers get raises and promotions because that is just what you do
  * key difference between reality and ideal (other points before this) is focus on technical teaching, training, supervision and review.
  * What is missing today is the responsibility of elders to teach the young.
* A craftsman is someone who works quickly, but without rushing, who provides reasonable estimates and meets commitments.
* Craftmenship is a mindset held by craftsmen (duh)
* Craftmenship is handed from one person to another and is taught by elders to young.
* You can't convince people to be craftsmen. In order to get others to emulate craftmenship you must become a craftsman first and let your craftmenship show.
* It is time for apprenticeship to be a part of software.

### Tooling
* next chapter.

## Insights
Coming into this book I did not know if I was going to like it or not. This book is highly focused on the soft skills of programming that are rarely focused on in our industry. While I do not agree with Robert on every point I found myself in agreement a good amount of the time.

There is a common thread I did notice while reading this book. Robert loves to tell a story. What is interesting about this is while some of these stories and annecdotes are amusing they often contain a nugget of wisdom. While I do not fully understand how someone can make some of the mistakes Robert has in his career I did enjoy reading them. I often find the best way to learn is to make a mistake and its even better when you can learn from someone elses mistakes. I am assured that some mistakes shown in this book are not just Robert being a stupid kid and are mistakes even would be professionals could make.

A lot of this book seems to talk about dealing with pressure. Maybe the industry has changed or I am a personally that is not easily impacted by unrealistic requests, but I do not often feel the same pressures as described in this book. I understand that I get pressure from product owners, product managers and business analysts but I am always sure to let them know what is at stake. In general I see it as me doing my job and them doing their job.

The concept of practicing and continued studying seems like a no brainer to me but I could see where others might not be willing to devote time into this practice and it is a good call out. Not everything you learn in this industry is on the job.

I think one of the most impactful parts of this book for me was the apprenticeship discussion. I have always felt like the industry has been missing this. I have often heard of people mixing bootcamps and college but that still doesn't quite feel right to me. Personally I prefer the idealized apprenticeship model discussed in this book. This is a practice that is done in many trades and professions and it still boggels my mind that this is not a common or documented practice in software.
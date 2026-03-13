---
title: 'A Promise diverged'
date: '2026-03-12'
---

## An unexpected journey

As I was rounding out my last blog I wanted to better understand the promises and async/await divergence. I figured the best way would be to track back the history of promises. What I wasn't counting on is just how long that history is. The following is a long winding exploration of what I found and the people invloved.

## Setting a starting point

Early on I realized if I kept pulling this thread I would probably land at the dawn of computation. Where I decided to draw the line was at the first mention of the word promise. This puts our starting point at a paper published by [Barbara Liskov](https://en.wikipedia.org/wiki/Barbara_Liskov) in 1988. The thread I had to stop myself from following was MultiLisp and its concept of futures. If you the reader want to follow this and risk going mad digging through history this would be your [starting point](https://dl.acm.org/doi/10.1145/4472.4478).

## Coining Promises

The foundational paper that I am claiming started it all is, ["Promises: linguistic support for efficient asynchronous procedure calls in distributed systems"](https://dl.acm.org/doi/10.1145/960116.54016). In this paper Barbara talks about the difficulty of managing message exchange between systems. In this paper the message passing that is focused on is RCP and call-streams. RCP being most similar to modern day HTTP where you have a request and await a response. The call-stream concept would be closer to a websocket in which there are multiple messages on a stream over time. In this paper Barbara argues that we need a linguistic abstraction to put over these concepts to make them easier to work with, and so the promise was born. Now these promises are not quite like the promises that you may be used to if you come from Javascript. In these promises you create a promise and then you claim that promise. There is no then, catch, fufill, or reject.

While the abstraction is important I find it important to call out what promises had been trying to solve. At its core promises had been focused on better types and more specifically error types. If a promise failed you should be able to know why and it should be strongly typed. In addition to this the abstraction for promises should work over top of RPC or call-streams. The last point I would like to call out is that a promise can be claimed multiple times.

Now when a promise is claimed it would block the current executing fork or coenter until the claim is ready. Reading a claim that is already ready would not result in blocking and the state of if the promise had a value would be tracked. The following is an example directly from the paper written in the Argus language.

```
sinfo record [ stu string, grade: grade ]
info array [sinfo]

pt = promise returns (real)
averages = array [pt]

grades: info := % some pre-recored info not of interest

begin
	a: averages := averages$create(info$low(grades)) % create empty array with lower bound
	
	% record grades
	for s: sinfo in info$elements(grades) do
		averages$addh(a, stream record_grade (s.stu, s.grade))
		end
	flush record_grade

	%print
	for i: int in averages$indexes(a) do
		stream print(make_string(grades[i].stu, pt$clai(a[i])))
		end
	synch print
	end expect .. end
```

In this example recording a grade updates an average and returns a promise for when the grade is recorded. The `flush record_grade` waits for the call-stream to be cleared so that future `claim` operations do not have to block. You could think of it as a `Promise.all`. Finally it claims all the promises and writes the averages.

## Advent of a new language

Now we are going to jump forward to 1997. At this time [Mark Stiegler](https://www.skyhunter.com/) was working on the programming language E. In this programming language he talks about using promises and makes that a primitive in his programming language. This language aimed to handle the problems of distributed computing better than other languages of the time. A full justification for this new language can be found [here](https://www.skyhunter.com/marcs/ewalnut.html). In this language we can see that promises shifted a bit and start to represent modern day promises in Javascript a bit more.

```
def temperatureVow := carVow <- getEngineTemperature()
when (temperatureVow) -> {
    println(`The temperature of the car engine is: $temperatureVow`)
} catch prob {
    println(`Could not get engine temperature: $prob`)
}
println("execution of the when-catch waits for resolution of the promise,")
println("but the program moves on immediately to these printlns")
```

In this we can see the callbacks start to emerge a bit. You `when` a promise and you `catch` its error.

## Getting twisted

The work Mark did ended up inspiring our next character. In 2001 [Glyph Lefkowitz](https://blog.glyph.im/pages/about.html) was working on the [Twisted](https://twisted.org/) library in Python. In this library the concept of deferred was added. This was heavily inspired by Mark's work and in [pycon 2003](https://docs.twisted.org/en/twisted-22.8.0/historic/index.html) he wrote a paper about this topic that actually [cited a work](http://www.erights.org/talks/promises/paper/tgc05-submitted.pdf) from Mark on the E langauge. Now deferred changed up things a bit. I assume this is due to the limitations of not being able to change Python directy. In this [first implementation](https://github.com/twisted/twisted/commit/53dc26020ce1075e6a2936e7ab012cadfb05eaf6) you would create a deferred and register callbacks as well as error callbacks. This takes on a slightly new shape that we are used to now.

```python
from twisted.internet import reactor, defer

def getDummyData(inputData):
    print('getDummyData called')
    deferred = defer.Deferred()
    reactor.callLater(2, deferred.callback, inputData * 3)
    return deferred

def cbPrintData(result):
    print('Result received: {}'.format(result))

deferred = getDummyData(3)
deferred.addCallback(cbPrintData)

reactor.callLater(4, reactor.stop)
print('Starting the reactor')
reactor.run()
```

This condensed example from the twisted documentation site shows this new pattern. What is interesting here is now you can chain multiple callbacks on a promise and promise resolution be it a success or error is via a callback. One thing I find very important to call out here is that this was called a deferred not a promise. This seems like a deliberate choice. Notice how this isn't quite the same as a promise but is heavily inspired by them.

## Dojo did it first

In the early 2000's [Alex Russel](https://infrequently.org/about-me/) was busy working on [Dojo](https://dojotoolkit.org/). Much like many things in modern Javascript Dojo pioneered deferred in Javascript with its [deferred feature](https://dojotoolkit.org/reference-guide/1.7/dojo/Deferred.html) that was originally created sometime around 2005. This feature as best as I can understand was inspired by Twisted and used a familar but different API.

```javascript
var deferred = new dojo.Deferred();
setTimeout(function(){ deferred.resolve({success: true}); }, 1000);
deferred.then(function(value){
    // Do something on success.
  },
  function(error){
    // Do something on failure.
});
```

In this we can see even more patterns emerge. Now `addCallback` has been replaced with `then` and this then contains both the success and error callbacks. This is also where resolve and reject originate from.

## Promises/A

Starting in 2009 Kris Zap was busy trying to bring promises to node. This started off as a spirited [discussion](https://groups.google.com/g/commonjs/c/6T9z75fohDk) and resulted in a [Promises/A document](https://promisesaplus.com/). Now what I find interesting is Kris and Russel had some interaction in the past per this [blog](https://infrequently.org/2008/01/kris-zyp-joins-sitepen/). Kris went on to create [promise-io](https://github.com/kriszyp/promised-io) and [node-promise](https://github.com/kriszyp/node-promise). In promises-io the original approach was to continue the use of deferred but that appears to have been superceeded by node-promise which uses a very familiar syntax.

```javascript
promise.then(function(result){
   ... when the action is complete this is executed ...
},
function(error){
    ... executed when the promise fails
});
```

From this work many other libraries arose like [Q](https://github.com/kriskowal/q) with its wizard creator [Kris Kowal](https://kriskowal.com), [Bluebird](http://bluebirdjs.com/docs/getting-started.html), and [When](https://github.com/cujojs/when).

## Standarization

Due to the popularity of these languages [ES2015](https://262.ecma-international.org/6.0/#sec-promise-constructor) added support for promises as defined by the libraries out of the node community. This was shortly followed by [Node.js v4](https://nodejs.org/en/blog/release/v4.0.0) adding Promises directly into the node ecosystem. This marks the entry point for most modern web developers.

## The gap

Over time we can see how a solution to a distributed computation problem snowballed into a library in Javascript hated for the callback hell it created. What is facinating is in its roots there was no callback hell. This callback hell was a result of building a library when a language feature was needed. Async is far more in the spirit of the original promise concept. However where I think all implementations in the Javascript ecosystem have failed is the original requirement of error handling. One of the core problems promises aimed to solve was better error types. Unfortunately somewhere along the way we lost that. Even typescript wasn't able to resurrect this as the types for promise only include a result type and do not have an error type.
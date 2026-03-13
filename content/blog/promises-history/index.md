---
title: 'A Promise diverged'
date: '2026-03-12'
---

## An unexpected journey

As I was rounding out my last blog I felt compelled to better understand the promises and async/await divergence. I decided it was best to track the history of promises. What I wasn't counting on is just how long that history is. The following is a long winding exploration of what I found and the people invloved.

## Setting a starting point

Early on I realized if I kept pulling this thread I would probably land at the dawn of computation. I decided to draw the line at the first mention of the word promise. This puts our starting point at a paper published by [Barbara Liskov](https://en.wikipedia.org/wiki/Barbara_Liskov) in 1988. I had to stop myself from following MultiLisp and its concept of futures. If you would like to follow this and risk going mad digging through history this would be your [starting point](https://dl.acm.org/doi/10.1145/4472.4478).

## Coining Promises

The foundational paper that started it all is ["Promises: linguistic support for efficient asynchronous procedure calls in distributed systems"](https://dl.acm.org/doi/10.1145/960116.54016). In this paper Barbara talks about the difficulty of managing message exchange between systems. The message passing that is focused on is RCP and call-streams. Barbara argues that we need a linguistic abstraction to put over these concepts to make them easier to work with, and so the promise was born. These promises are not quite like the promises that you may be used to if you come from Javascript. In these promises you create a promise and then you claim that promise. There is no then, catch, fufill, or reject.

While the abstraction is important I find it important to call out what promises had been trying to solve. At its core promises had been focused on better types and more specifically error types. If a promise failed you should be able to know why and it should be strongly typed. In addition to this the abstraction for promises should work over top of RPC or call-streams. The last point I would like to call out is that a promise can be claimed multiple times.

When a promise is claimed it would block the current executing process until claim is ready. Reading a claim that is already ready would not result in blocking and would instead immediatly return the known value. The following is an example directly from the paper written in the Argus language.

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

In this example recording a grade updates an average and returns a promise for when the grade is recorded. The `flush record_grade` waits for the call-stream to be cleared so that future `claim` operations do not have to block.If you come from Javascript you could think of it as a `Promise.all`. Finally it claims all the promises and writes the averages.

## Advent of a new language

Now we are going to jump forward to 1997. At this time Mark S. Miller was working on the programming language E. In this programming language he talks about using promises and makes that a primitive in his programming language. This language aimed to handle the problems of distributed computing better than other languages of the time. A full paper surrounding this language  [here](http://www.erights.org/talks/promises/paper/tgc05-submitted.pdf). In this language we can see that promises shifted a bit and start to represent modern day promises in Javascript a bit more.

```
def asyncAnd(answers) {
    var countDown := answers.size()
    if (countDown == 0) { return true }
    def [result, resolver] := Ref.promise()
    for answer in answers {
        when (answer) -> {
            if (answer) {
                countDown -= 1
                if (countDown == 0) {
                    resolver.resolve(true)
                }
            } else {
                resolver.resolve(false)
            }
        } catch exception {
        resolver.smash(exception)
    }
}
return result
}
```

In this we can see the callbacks start to emerge a bit. You `when` a promise and you `catch` its error. We can also see the emergence of the resolve concept.

## Getting twisted

The work Mark did ended up inspiring our next character. In 2001 [Glyph Lefkowitz](https://blog.glyph.im/pages/about.html) was working on the [Twisted](https://twisted.org/) library in Python. In this library the concept of deferred was added. This was heavily inspired by Mark's work and in [pycon 2003](https://docs.twisted.org/en/twisted-22.8.0/historic/index.html) he wrote a paper about this topic that cited the paper from Mark on the E langauge. Deferred changed up things a bit. I assume this is due to the limitations of not being able to change Python directy. In this [first implementation](https://github.com/twisted/twisted/commit/53dc26020ce1075e6a2936e7ab012cadfb05eaf6) you would create a deferred and register callbacks as well as error callbacks.

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

This condensed example from the twisted documentation site shows the new pattern. Now you can chain multiple callbacks on a promise. These callbacks take the form of a success or error callback. I find interesting to note that this was called a deferred not a promise. This seems like a deliberate choice. Notice how this isn't quite the same as a promise but is heavily inspired by them.

## Dojo did it first

In the early 2000's [Alex Russel](https://infrequently.org/about-me/) was busy working on [Dojo](https://dojotoolkit.org/). Like many things in modern Javascript Dojo pioneered deferred in Javascript with its [deferred feature](https://dojotoolkit.org/reference-guide/1.7/dojo/Deferred.html). This was originally created sometime around 2005. The feature as I understand it was inspired by Twisted and used a familar API.

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

In this we can see even more patterns emerge. Now `addCallback` has been replaced with `then` and this then contains both the success and error callbacks.

## Promises/A

Starting in 2009 Kris Zap was busy trying to bring promises to NodeJS. This started off as a spirited [discussion](https://groups.google.com/g/commonjs/c/6T9z75fohDk) and resulted in a [Promises/A document](https://promisesaplus.com/). What I find interesting is Kris and Russel had some interaction in the past per this [blog post](https://infrequently.org/2008/01/kris-zyp-joins-sitepen/). Kris went on to create [promise-io](https://github.com/kriszyp/promised-io) and [node-promise](https://github.com/kriszyp/node-promise). In promises-io the original approach was to continue the use of deferred but that appears to have been superceeded by node-promise which uses a very familiar syntax.

```javascript
promise.then(function(result){
   ... when the action is complete this is executed ...
},
function(error){
    ... executed when the promise fails
});
```

From this work many other libraries arose like [Q](https://github.com/kriskowal/q) with its wizard creator [Kris Kowal](https://kriskowal.com), [Bluebird](http://bluebirdjs.com/docs/getting-started.html) and it's creator [Petka Antonov](https://github.com/petkaantonov), and [When](https://github.com/cujojs/when) with its creator [Brian Cavalier](http://www.briancavalier.com/).

## Standarization

Due to the popularity of these languages [ES2015](https://262.ecma-international.org/6.0/#sec-promise-constructor) added support for promises as defined by the libraries out of the node community. This was shortly followed by [Node.js v4](https://nodejs.org/en/blog/release/v4.0.0) adding Promises directly into the node ecosystem. This marks the entry point for most modern web developers.

This particular snip from the [Promises documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) seems to indicate a history of tension in the term "promise"

> Note: Several other languages have mechanisms for lazy evaluation and deferring a computation, which they also call "promises", e.g., Scheme. Promises in JavaScript represent processes that are already happening, which can be chained with callback functions. If you are looking to lazily evaluate an expression, consider using a function with no arguments e.g., f = () => expression to create the lazily-evaluated expression, and f() to evaluate the expression immediately.

## The gap

Over time we can see how a solution to a distributed computation problem snowballed into a library in Javascript hated for the callback hell it created. What is facinating is in its roots there was no callback hell. This callback hell was a result of building a library when a native language feature was needed. Async is far more in the spirit of the original promise concept. However where I think all implementations in the Javascript ecosystem have failed is the original requirement of error handling. One of the core problems promises aimed to solve was better error types. Unfortunately somewhere along the way we lost that. Even typescript wasn't able to resurrect this as the types for promise only include a result type and do not have an error type.
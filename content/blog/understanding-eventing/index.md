---
title: 'Why not build an event loop'
date: '2026-05-22'
---

In the last blog series I made reference to a talk from Ryan Dahl on NodeJS. It can be easy to dismiss Javascript as a low performance language on the observation that it is a single threaded environment. However this talk directly opposes that stating the the real problem is getting I/O out of the hot path. Similar talks in the data driven design space argue for similar points. Memory access is almost always the problem. Generally speaking even the slowest arithmatic operations like divide, cosine, and sine are significantly faster than reading from RAM. Reading from disk and network are orders of magnitude slower than reading from RAM. The key argument in this talk more so than in other talks is if you keep a single loop completely saturated while pushing blocking IO out of the hotpath you can get better performance at a reduced memory cost. Threading does come at a performance cost the moment you have to deal with shared memory. Once you have shared memory you have mutexes and complicated logic that can create worse problems than single threaded code. On top of that each thread comes with its own memory. At a minium every thread has its own stack which is easily 1 megabyte or more of memory required.

Upon thinking about this a bit more I thought it might be fun to try out building out a simple event loop on a silly little problem just to see what I might find.

## Doing some research

Before I got too into this I wanted to understand a bit better what was under the hood of NodeJS. Going into this I knew that NodeJS was largely a C++ project with V8 bindings. However I was a bit less familar with the machinery it used to handle its non-blocking IO. Doing a bit of research I found that modern NodeJS uses [uvlib](https://libuv.org/) to handle this. This library handles everything from file access and child processes to sockets and DNS resolution. What struck me as a little bit odd was in the original talk I referenced Ryan talked about using [libev](https://software.schmorp.de/pkg/libev.html) to handle eventing. In an attempt to find more I looked into that library and found that it was related to yet another eventing library [libevent](https://libevent.org/). Each library building their own unique features to allow for better performance in event loops. After digging a bit more I found that Ryan Dahl even [wrote](https://tinyclouds.org/iocp-links/) a bit about all of these libraries and how they came to libuv.

In many of these libraries the tradeoff focuses around what OS support they have and what APIs they build on. Many point the difference between [select](https://libevent.org/), [poll](https://man7.org/linux/man-pages/man2/poll.2.html), and [epoll](https://man7.org/linux/man-pages/man7/epoll.7.html). Each giving different performance benefits along the way. Since many of these optimizations operate at the kernal provided API surface to userland it can be quite difficult to create a multi-plaform, performant and coherent API.

## Setting up an experiment

While most of the literature on these eventing libraries had focused on sockets I was a bit more preoccupied with file access. I was still stuck on the original code a made that brough this all up, forcing a synchronous call on file access in NodeJS.

### Building up the scenario

First before I could do anything I had to set something up to test file access. What I decided would be a fairly easy thing to test would be reading a ton of JavaScript files, and doing some very basic parsing. Each file would have a collection of imports, a handful of constants and some functions. I decided the code in question would count the total constants and functions found across all files and follow the imports.

Doing some very basic research I found that a reasonable range of files for a project would be somewhere in the around 10 or so files for a smaller project and closer to 1000 for a larger project. Since I didn't want to manually create that many files I decided the best way to get this experiment setup would be to write a little node program that generated a bunch of files. I wanted imports but I also didn't want any circlar references to lead to strange complications during generation or processing. So to avoid cicular references I pulled out some good old [Targan's](https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm) to make sure non circular references got committed. Also to make it easier to parse I parsed the graph at the very end and referenced all roots in an index.js.

Lastly to entertain myself a bit I created a list of predefined words to generated files and variables with. This lead to fun little file names like `help-overwhelming-random.js`, `malware-darwin.js`, and `sqs-agentic-wheel-tokenizer.js`. 

### Figuring out what to test

Once I had a collection of different sized projects. I needed to settle on what to test. I decided I would start off by just comparing the performance of different cases across NodeJS and C. These would include the following

* A NodeJS application that blocked on IO.
* A NodeJS application that used the async libraries correctly.
* A C application that blocked on IO.
* A C application that used an event loop.

Now because I found that there was different sizes of projects I decided each one of these would be tested against a handful of different sized projects. 
* A tiny project with 10 files.
* A small project with 50 files.
* A medium project with 100 files.
* A large project with 500 files.
* A extra large project with 1500 files.

With all of these I would gather timings and compare how they did relative to each other.

### Benchmarking file access is tricky

Before I go into the specifics of each example I want to preface with a little benchmarking tidbit. While I was conducting this experiment I realized that I was getting some crazy outliers in my initial testing. Likely people closer to the OS and file based performance will know where I am going with this. OS's know that file access is slow and attempt to compensate for this in some cases quite agressively. In my case I would see a massive boost on the second run of a program. In the case of these tests I was running on a Macbook using and M3 chip. The best way I could find to get the lowest variance in these tests was to `sudo purge` between each run. I would say take the exact numbers with a grain of salk and look more at the trend more so than the result.

## Running the test

Each of these programs had required a bit of different effort. Admittedly I hadn't written much C in the past 15 years so it took me a while to get back into the swing of things.

### Blocking NodeJS example

This was the easiest one to write. In all cases I didn't want to do a full JavaScript parse. I just needed to do some simple testing and I abused that to its fullest. So instead of pulling out a proper parser, building an AST and travesting the tree I did a simple line by line check. The original form of this used a regular expression to get the import file path but I ended up scrapping I didn't like the Regex differences between JavaScript and C.

The ending result can be found [here](https://github.com/JeffreyRiggle/event-queue-testing/blob/main/simple-node/index.js). The most important part is that I used a while loop to do the processing

```Javascript
while (filesToProcess.length > 0) {
  let file = filesToProcess.pop();
  // Do processing
}
```

This took suprizingly little time to write and even at the largest scale it was a faily quick program. The slowest execution time for 1500 files was ~273ms.

### Async Node example

Moving on I implemented the callback compatible version of the same program to see the difference of just using the event loop properly. The biggest change I had to make was around that while loop. Now instead of blocking each file I would block on batches of files as I found them.

```Javascript
async function main() {
  while (filesToProcess.length > 0) {
    let fileRequests = [];
    for (let file of filesToProcess) {
      fileRequests.push(processFile(file));
    }

    await Promise.all(fileRequests);
  }
}
```

The final result can be found [here](https://github.com/JeffreyRiggle/event-queue-testing/blob/main/async-node/index.js).

However the resulting difference in performance was notable. In basically all but the tiny dataset the program ran twice as fast with the slowest observed time being ~124ms on the largest dataset.

### Basic C example

This is where things started to slow down a bit. Since it had been so long since I had written C it took me way to long to get back into it. Eventually I produced a working program that had comparable outputs to the NodeJS version.

Again I used the similar loop as seen before.

```c
  while (FILES_TO_PROCESS[FILE_TO_PROCESS_INDEX] != NULL)
  {
    processFile(FILES_TO_PROCESS[FILE_TO_PROCESS_INDEX]);
    FILE_TO_PROCESS_INDEX++;
  }
```

The code for this can be found [here](https://github.com/JeffreyRiggle/event-queue-testing/blob/main/simple-c/main.c).

However due to the inefficient array scanning this started to slow down at larger scales. This had performance as bad as 350ms in some of the worst cases.

### Eventing C example

This one required a bit of work. Originally I just tried putting some threads on the problem without much though. The main execution was done on a single thread but the way file memory was managed some terrible performance was created due to the inefficiencies of the threading and mutexes required. Eventually I got to a much more stable version that had a proper dynamically sizing thread pool and predicable event loop.

The main event loop ended up being similar to this.

```c
void run(EventLoop* loop)
{
  while (loop->completed == 0)
  {
    // grow pool to maxium if
    if (threadPool->size < MAX_POOL_SIZE)
    {
        // Calculate idle time.

        if (idleTime > GROW_THRESHOLD)
        {
            GrowPool(threadPool, 1);
        }
    }
    
    // dispatch events
    if (loop->lastDispatchedEvent < loop->nextEvent)
    {
        // Find and dipatch pending file events to idle threads.
    }

    for (int i = 0; i < threadPool->size; i++)
    {
        // Determine if thread has valid result
        if (isValid)
        {
            // Invoke file handler
            loop->handler(loop, threadPool->readers[i]->buffer, threadPool->readers[i]->fileSize);
            
            // Reset thread state
        }
    }
  }
}
```

In the end this version produced the fasted results with the slowest result being ~113ms. Similar to the other C example since I didn't use an efficient array search algorithm this could likely be faster.

## Considering the results

PUT SOME intereseting results from the sheet here

## TODO Better title for wrapping it up

In this project I got to have a lot of fun learning about the lower level of event loops. I also got to see first hand how building something in an event loop correctly can produce much better results. While writing C again was a bit of a learning curve I was reminded just how much fun it is for me to think about lower level details like memory allocations and pointers. However it was also a reminder that just because something is written in a low level language doesn't mean it will be fast. It is all to easy to write a low level program that runs way slower than a high level language because you didn't think about the low level primitives correctly. In the next blog we will see that in action all over again.
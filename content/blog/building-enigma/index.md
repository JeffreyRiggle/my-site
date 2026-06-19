---
title: 'Building Engima'
date: '2026-06-11'
---

As a continuation of the journey through old projects, we now arrive at my foray into [WASM](https://webassembly.org/). At the time WASM was evolving past [asm.js](http://asmjs.org/) and becoming a proper standard with a formal specification and binary format. To learn more, I wanted to come up with a problem to solve with WASM. While other people had been doing far more pratical things like getting existing C projects to run in the browser I wanted to build something else and I wanted to use Rust.

The problem was I had no idea what to build. I knew wanted to build something "I thought" would be a computationally complex task. While I am not good at it nor have I invested the hours to be good at it, I have a passing interest in cryptography. In the past I had written simple cyper programs like a [Caeser](https://en.wikipedia.org/wiki/Caesar_cipher) or [playfair](https://en.wikipedia.org/wiki/Playfair_cipher) cypher. This time I decided it was time to up the game. I resolved myself to learn about the engima machine and produce a working version of it.

## What is the Engima machine?

While I assume this is a fairly well known machine, I will attempt a breif history and the relevant parts of the machine to help build context. Engima was a electromechanical device used to encrypt messages. It is most commonly known for its use during WWII. In this time the German's used it as a means of sending encrypted communciations. In a sense you could think of it as an early version of modern [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security). This device is likely more well known amoungst software engineers due to its relationship to [Bombe](https://en.wikipedia.org/wiki/Bombe) and Alan Turing. If you are interested in a far better history of this device I recommend watching this [video](https://www.youtube.com/watch?v=G2_Q9FoD-oQ).

History aside, the key to know about this machine are the relevant components. The main input of this device was via a keyboard. This keyboard took mechanical actions routed them through a series of electrical components and lit up a bulb at the end to show the encrypted character. The first and most notable component used is the rotors. Each machine had three rotor slots and up to five different rotors. These rotors had one position for each letter in the latin alphabet. In the initial configuration of the machine you could use rotors in any order and at any starting position. In addition to the rotors there was a reflector that would pass the signal back through the rotors in reverse. Finally, the last component was a plugboard. This plugboard had 10 pins that allowed you to map two letters together. This mapping did a switch of input to a new letter before even moving the signal through the rotors.

The following digram I found on [this site](https://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/f2021/tdt46_vp237_yw446/tdt46_vp237_yw446/index.html) shows it best.

![Enigma Digram](https://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/f2021/tdt46_vp237_yw446/tdt46_vp237_yw446/img/internals.jpg)


## Setting up the approach

Armed with a simple understanding of how the machine worked I was ready to write some code that simulated engima. As is the theme with my projects, I decided I would compare the performance of two different solutions. First I would build the engine and get it working in JavaScript. After I would build the same engine again in Rust. The expectation being that WASM+Rust would be faster than JavaScript.

Once I had the engines working I wanted to build a web page that would visualize the machine as best as I could imagine. Since I could not get my hands on an engima machine, I wanted to at least visualize it because it seemed like a neat machine.

## Building the first version

The original work to get a working machine in JavaScript was a bit more cumbersome than I had through it would be. Getting all of the specifications right without access to a direct device was difficult for me. Figuring out the relationship between plugboard, rotors, and the reflector took me a while to understand. Originally I had forgot that I had to "complete the circut" and didn't pass the transform back from the reflector and through the rotors. The good news is there was a wealth of information out there and eventually I got something working. This whole process gave me a lot more empathy for anyone attempting to build Babbages [analytical engine](https://en.wikipedia.org/wiki/Analytical_engine).

### A look at the types

Once I had this working I had to figure out the correct configuration to pass to the machine to allow it to proceed. While I wrote this entierly in JavaScript the end Typescript version of the code I wrote would have looked something like this.

```typescript
export type EngiamRotorConfiguration = {
    // The rotor type to use
    type: 'I' | 'II' | 'III' | 'IV' | 'V';
    // The ring the rotor is on
    ring: number;
    // The initial position of the rotor. This would be some letter A-Z
    position: string;
};

export type EngimaConfiguration = {
    // The reflector to use
    reflector: 'B' | 'C' | 'B Dünn' | 'C Dünn';
    // The rotor configuration
    rotors: EngimaRotorConfiguration[];
    /**
     * A mapping of plugs. This is expected to be two uppercase characters.
     * For example: 'BV' would map 'B' to 'V'.
     */
    plugboard: string[];
}

export interface IEnigma {
    // Setup the configuration of the engima machine
    configure(configuration: EnigmaConfiguration): void;
    // Restore the enigma machine to its orginally defined configuration.
    reset();
    // Encrypt a message
    processMessage(message: string): string;
}
```

### Idiosyncradic JavaScript

As I look back on this code I noticed some interesting aspects. First since I didn't choose to write this in Typescript, I handled all the configruation edge cases via errors. An unexpected configuration provided to the configure method would result in a thrown exception. Why this stuck out is because normally I prefer using control flows that do not throw. I suspect I did this so it could behave as a public API might. This is another classic example of overengineering for a prototype. I wouldn't expect myself to use my own API incorrectly and this extra work was entirely wasted.

In this case it was clear I used an object-oriented paradigm for the build out of the machine. Engima was a class that used the Rotor and Plugboard class to dispatch parts of the encryption to other components. However I find interesting that I didn't make the reflector its own class. Instead it was just a function in the Engima class. The statefulness of classes was not needed for all aspects of this machine. For example, the plugboard was a simple transformation that could have been done with a simple helper function. Mixing paradigms here might not be the best solution, but it is clear I landed somewhere in between. Not everything needed to be class based and I could have used that mix a more.

## Now build it again in Rust

Now that I knew I could get the engine working and producing encryped messages it was time to write it in Rust. By this point in time I had hardly written anything in Rust and I was looking forward to the oppertunity go into battle with the compiler.

### Beginner Rust problems

Looking back on this code it is clear that I just took the JavaScript version, created some structs and traits then attempted to recreate the program in a new language. As is often the case with ports of this nature, I noticed a handful of things I was doing that are out of place in rust.

The first and most obvious to spot was the constant use of `unwrap`. Ideally these should be handled in some way instead of producing a panic. However, as I mentioned before this was just for learning. So, it might have been better that I didn't spend too much time with all the extra error handling as this was not a production workload.

The second and seemingly more agrejous to me is the complete lack of consistency with number precision. In the rotor code alone, I see the use of `u8`, `usize`, `i32`, and `u32`. All of these had been in service of character codes. Ideally, I should have choosen a single number type and stuck to it avoiding extra numeric casting and loss of precision issues.

The last and most expected was the inability to reason about the borrow checker. Instead I invent solutions out of it. In this code I saw many cases of `Clone()` when proper use of mutability or a pointer would have been more appropriate. I suspect this is the most common Rust novice problem and it is no suprize I made the same error.

### Building it again

Building this project is a bit different than other rust projects. Instead of just doing a basic compile and run, to produce a WASM compatible output different compile steps have to be taken. In order to do this you need to add the wasm toolchain, [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/), and compile using that toolchain instead of the default `cargo build`.

Remembing the correct series of commands to get this compiling again was a bit challenging. However, once I did I was able to test the original page I wrote.

```html
<html>
  <head>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type"/>
  </head>
  <body>
    <script src='./index.js'></script>
  </body>
</html>
```

```js
const rust = import('./engima_wasm');
const config = {
    reflector: 'B',
    rotors: [
        {rtype: 'I', ring: 0, position: 'A'},
        {rtype: 'II', ring: 1, position: 'A'},
        {rtype: 'III', ring: 2, position: 'A'}
    ],
    plugboard: [
        'AF',
        'BE',
        'CO',
        'DP',
        'GX',
        'HY',
        'IZ',
        'JW',
        'KT',
        'LN',
        'MR',
        'QS',
        'UV'
    ]
};

rust.then(m => {
    console.log(m.process_message('HELLOWORLD', JSON.stringify(config)));
});
```

## Creating the engima web page

With the two engines ready it was time to build a UI to visualize the engima machine as well as compare the outputs of the two engines. This site used a mix of technologies covered before as well as one that hasn't been used yet in this series. The usual suspects of SCSS, yarn, and webpack are all present. However, in this case the new one was [preact](https://preactjs.com/). As this was the time of framework wars, preact was the new cool kid on the scene making React fast by cutting asset size. Apparently I had to get in on that.

### Visualizing engima

Since I had already built the engine I had a sense of what the components should be. To structure this visualization I created components for the keyboard, plugboard, and rotors as before. However the net new component I needed to add was the lamp. To produce a satisfying replica of the machine it felt necissary to visualize the encrytped character via a lamp instead of just an updated string on the bottom of the screen.

To visualize this correctly I would have to update the rotor positions as you typed. A failure to do so wouldn't feel quite right. After a bit of fiddling around I got something working that would show the machine in motion while allowing you to set the initial configuration. In this visualization you could either press a button or use the keyboard to start encrypting a message.

### The power of proper abstraction

Once I had this all built out I started to see an issue with the abstraction I created. While it solved the problem, the engine was built around sending an entire message at a time. However this did not match the UX required. A single letter was sent at a time building up a message instead of the whole message at once. While I was able to get this working it did lead to state management issue. I had the challenge of maintaining the configuration outside of the engine, while still updateding the configuration on keypress. Since a key press would move the rotors I had to make sure that logic was handled. In the case of the JavaScript engine this was trivial but Rust was a different story. In Rust the memory boundary ended up being a problem. I couldn't easily have Rust mutate the state of something managed by the JavaScript runtime.

This resulted in an insane harness around the Rust engine. This harness allowed the engine to work the same way the JavaScript engine did. While I was able to code around it, by the time I pitted it up against the JavaScript engine it was orders of magnitude slower. This wrapper JavaScript code helps show just why it was soo much slower.

```javascript
sendMessage(message) {
    const config = this._transformConfig();

    return new Promise((resolve, reject) => {
        try {
            var start = performance.now()
            // Serialization boundary issue between runtimes
            let retVal = engine.process_message(String(message), JSON.stringify(config));

            this.originalMessage += message;
            this.encryptedMessage += retVal;
            this._timeTaken = performance.now() - start;
            
            // Required post processing of rotor positions
            this._updateRotorPositions(message.length);

            this.emit(this.messageProcessedEvent, retVal);
            resolve(retVal);
        } catch(err) {
            reject(err);
        }
    });
}
```

Notice all the extra work that was required here? On top of that the performance measuring was skewed in favor of this approach and it was still slower. See how we didn't even count the time it took to do the post message processing?

## A point completely missed

I realize now that a trival amount of planning would have shown that this performance comparision was silly. While enigma is a complex machine the actual set of transformations required to encrypt one of these messages is quite trivial. Almost all work is simple addition or subtraction operations with some number to string conversions. In the end the most consequential performance aspect ended up being the runtime boundary. Passing messages between JavaScript and Rust is far more expensive than any transformation logic could have ever been. Taking a bit of time to consider this I might not have attempted this specific project. However, in the process I learned a great deal about enigma and WASM.

By the time I realized this I breifly considered recreating a Bombe prototype. This would have a far larger amount of work to do than an engima prototype. In the end I decided against taking that sort of time investment. Partially because there isn't a great deal of information on how that machine worked, and partly because I didn't want to spend a large amount of time learning another machine.

If any of this piqued your interest I still have this prototype hosted [here](https://ilusr.com/enigma/).

By now we are almost caught up with my reflections on previous projects. There is only one more to write about to complete this series. Coming up we will mostly see familiar tools being used and some new commentary about their usage.
---
title: 'Building Engima'
date: '2026-06-11'
---

To continue the journey through old projects I have worked on we now arrive at my foray into WASM. At the time I WASM was evolving past asm.js and becoming a proper standard with bytecode and all to boot. I wanted to come up with a problem to solve with WASM. While other people had been doing far more pratical things like getting existing C projects to run in the browser I wanted to build something new and I wanted to use Rust.

The problem was I had no idea what to build. I wanted to build something that was different and I wanted to build something "I thought" would be a computationally complex task. While I am not good at it and have not put in the hours to be good at it I have always had a passing interest in the high level details of cryptography. In the past I had written very simple cyper programs like a ceaser or playfair cypher so I decided it was time to up the game. In this case I resolved myself to learn about the engima machine and produce a working version of it.


## What is the Engima machine?

While I assume this is a fairly well known machine I will attempt to recap a breif history and the relevant parts of the machine to help build context if you don't happen to have it already. Engima was a electromechanical device used to encrypt messages. It was most commonly known for its use during WWII. In this time the German's used it as a means of sending encrypted communciations. In a sense you could think of it as a very early version of modern TLS. This device is probably also more well known amoungst software engineers due to its relationship to Bombe and Alan Turing. If you are interested in a far better history of this device I recommend watching this [video](https://www.youtube.com/watch?v=G2_Q9FoD-oQ).

Now history aside the key things we have to know about this machine is the relevant components. This was a keyboard that took mechanical actions routed them through a series of electrical components and lit up a bulb at the end to show the correlated character. The first an most notable component was the rotors. Each machine had three rotor slots and up to five different rotors. These rotors had one position for each letter in the latin alphabet. In the initial configuration of the machine you could use rotors in any order and at any starting position. In addition to the rotors there was a reflector that would pass the signal back through the rotors in reverse. Finally the last component was a plugboard. This plugboard had 10 pins that allowed you to map two letters together. This mapping did a switch of input to a new letter before even moving the signal through the rotors.

I think this digram shows it best.

TODO put a digram here.


## Setting up the approach

Armed with a simple understanding of how the machine worked I was ready to write some code that would do the engima transformation. As is usually the theme with me I decided I would compare the performance of two different solutions. First I would build the abstraction and get it working in JavaScript. After I was going to build the same engine in Rust with the expectation that WASM+Rust would be faster than JavaScript.

Once I had the engines working I wanted to build a simple web page that would visualize the engima machine as best as I could imagine. Since I could not get my hands on an engima machine I wanted to at least visualize it because it seemed like a cool machine.


## Building the first version

The original work to get a working machine in JavaScript was a bit more cumbersome than I had through it would be. Getting all of the specifications right without access to a direct device was hard. Figuring out the relationship between rotors and reflectors took me a while to figure out. Originally I had forgot that I had to "complete the circut" and didn't pass the transform back through the rotors. The good news is there was a wealth of information out there and eventually I got something working. This whole process gave me a lot more empathy for anyone attempting to build Babbages [analytical engine](https://en.wikipedia.org/wiki/Analytical_engine).

### A look at the types

Once I had this working I had to figure out the correct configuration to pass to the machine to allow it to proceed. While I wrote this entierly in JavaScript the end Typescript version of the code I wrote would have looked like this.

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

### Interesting aspects of the code

As I look back on this code I notice a couple of things that are at least a bit interesting to me. First since I didn't choose to write this in Typescript I did all the error handling via errors. If you had some unexpected configuration the configure method would throw. This is interesting to me because normally I prefer using control flows that do not throw. I suspect I did this because I wanted it to behave as a public API might. However this is another classic example of overengineering for a prototype. I wouldn't expect myself to use my own API incorrectly and this extra work was mostly wasted.

Also in this case it was clear I used an object-oriented paradigm for the build out of the machine. Engima was a class that used the Rotor and Plugboard class to do the work. What I find interesting in this case is that I didn't make the reflector its own class and instead it was just part of the Engima class. Looking back on this code the statefulness of classes was not needed for all aspects of this machine. For example the plugboard was a simple transformation that could have been done with a simple helper function. Mixing paradigms here might not be the best solution but it is clear I landed somewhere inbetween and not everything needed to be class based.

### Running it again

Once again I looked at this project and saw the same slew of technologies and was anticipating a battle with dependencies. Old versions of node, the use of yarn and jasmine as a test runner had me prepared to waste a lot of time. However thankfully in this case it was fairly straightforward.

## Now build it again in Rust

Now that I knew I could get the engine working and producing encryped messages it was time to write it in Rust. By this point in time I had hardly written anything in Rust and was looking forward to the oppertunity to do battle with the compiler to produce some code.

### Looking at the code again

As I look at this code it is pretty clear that I just took the original JavaScript version, created some structs and traits and attempted to recreate the exact same thing. However, as I look at this code I notice some aspects of it that make me realize at least a handful of things I was doing that are probably in poor form.

The first and most obvious to spot is the constant use of `unwrap`. Ideally these should be handled more correctly instead of always producing a panic. However as I mentioned in the prior case this was just for my understanding so in this case it might have actually been better that I didn't spend too much time with all the extra error handling as this was not a production workload.

The second and seemingly more agrejous to me is the complete lack of consistency with number precision. In the rotor code alone I see the use of `u8`, `usize`, `i32`, and `u32`. All of these had been in service of character codes. Ideally I should have choose a single number type and stuck to it avoiding lots of numeric casting and possible loss of precision issues.

The last and most expected to me was the inability to reason about the borrow checker and instead invent solutions out of it. In this code I saw many cases of using `Clone()` when proper use of mutability or a pointer would have produced working code. I suspect this is the most common Rust novice problem and it is no suprize I made the same error.

### Building it again (TODO double check this)

Building this project is a bit different than other rust projects. Instead of just doing a basic compile and run we need to produce a WASM compatible output which is different from a standard Rust binary. In order to do this you need to add the wasm toolchain, [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/), and compile using that toolchain instead of the default.

Figuring out the correct series of commands to get this compiling again was a bit challenging but once I did I was able to re-test the original page I wrote to make sure the codegen was working.

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

## Creating a web page

Now with the two engines ready it was time to build a UI to visualize the engima machine and compare the outputs of the two engines. Looking back on this I see a mix of technologies we are used to with one that hasn't been used yet in this series. As was typical for my other projects SCSS, yarn, and webpack are all present. However, in this case the new one was [preact](https://preactjs.com/). As this was the time of framework wars preact was the new cool kid on the scene making React fast by cutting asset size and apparently I had to get in on that.

### Visualizing engima

In this case I had built the engine and had a sense of what the components should be. In this case I created components for the keyboard, plugboard, and rotors as before. However the net new component I needed to add was the lamp. To produce a satisfying replica of the machine it felt necissary to visualize the encrytped character via a lamp instead of just an updated string on the bottom of the screen.

Also to visualize this I would have to update the rotor positions as you typed otherwise it wouldn't feel quite right. After a bit of fiddling around I got something working that would show the machine in motion while allowing you to set the initial configuration. In this visualization you could either press a button or use the keyboard to start building a message.

### The problem with the abstraction

Once I had this all built out I started to see an issue with the abstraction I created. While it was entirely sufficient the engine was built around sending an entire message at a time. The problem was the UX required you to basically append a single letter at a time building up a message over time. While I was able to get this working well it did lead to some struggles with state management. Now I had to maintain the configuration outside while still getting the updated configuration from the keypress. Since a key press would move rotors I had to make sure that was preseved. This was trivial in the case of the JavaScript engine but not so trival in the case of Rust. In Rust the memory boundary ended up being a problem. I couldn't easily have Rust mutate the state of something managed by the JavaScript runtime.

This started a chain reaction of changes around the Rust engine to allow it to work the same way the JavaScript engine did. In the end while I was able to code around it by the time I pit it up against the JavaScript engine it was orders of magnitude slower. I think this wrapper JavaScript really helps show just why it was soo much slower

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

Notice all the extra work that was required here? Also on top of that the performance measuring was skewed in favor of this approach and it was still slower. We can see we didn't even count the time it took to do the post message processing.

## A point completely missed

As I look back on this code I realized just a trival amount of thinking would have shown how silly this performance comparision was. While enigma is a complex machine the actual set of transformations required to encrypt one of these messages is quite trivial. Almost all work is simple addition or subtraction operations with some number to string conversions. In the end the most consequential performance aspect of this ended up being the runtime boundary and passing messages between boundaries is far more expensive than any transformation logic could have ever been in this case. Taking a bit of time to consider this I might not have landed on this specific project to test out this logic, but in the process I learned a great deal about enigma and WASM.

By the time I realized this I breifly considered attempting to recreate a Bombe prototype. This would have a far larger amount of work to do than this engima prototype. However, in the end I decided against taking that sort of time investment. Partially because there still to my knowledge isn't a great deal of information on exactly how that machine worked and I didn't want to spend a very large amount of time learning how yet another machine worked.

If any of this piqued your interest I still have this prototype hosted [here](https://ilusr.com/enigma/).

By now we are almost caught up with my reflections on previous projects. There is only one more to write about to complete this series. In the next one we will mostly see familiar tools being used but commentary about their choices.
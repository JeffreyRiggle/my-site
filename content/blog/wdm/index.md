---
title: 'Learning WASM via WDM'
date: '2026-07-01'
---

In the last blog I realized that while I have used WASM I didn't fully understand WASM. Through the exercise of building my engima engine in rust and running it via WASM I built and understanding of the application of WASM and Rust toolchains supporting that flow. What I didn't learn was the specifics of what WASM has to offer.

## Learning via a new application of the technology

In order to properly understand this technology I was going to need to interact directly with the WASM interface. This required me to think of some problem that operated at that level. After some consideration I decided the easiest way to do that was to create a toy programming language. Let's call this language WASM Dumb Math or WDM for short. The reason it's "dumb" is because it is not feature rich and it only supports basic arithmatic. Also since its dumb math we are only going to use 32bit primitives since 64bits is too much for the silly types of programs we are creating.

## What is WAT?

Now before we get into anything around WDM we should understand a bit better how WASM works. Much like with assembly there are two representations we can work with. The first is the underlying binary representation of the program. This is a string of hexdecimal values representing the program. These are the `.wasm` files and are optimized for parse time and file size. The second is a slightly more friendly human readible version of the code. These are `.wat` files and they compile down to `.wasm` files using a program like [wabt](https://github.com/webassembly/wabt). To compare lets look at the output of the same simple program using both formats.

Base program written in the wat file format.
```wat
(module
  (func (export "add") (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.add
  )
)
```

Compiled output from the wasm file as a hexdump.
```bash
> hexdump -C module.wasm
00000000  00 61 73 6d 01 00 00 00  01 07 01 60 02 7d 7d 01  |.asm.......`.}}.|
00000010  7d 03 02 01 00 07 07 01  03 61 64 64 00 00 0a 09  |}........add....|
00000020  01 07 00 20 00 20 01 92  0b                       |... . ...|
00000029
```

## Features of WASM

TODO talk about instructions and types

## Getting into the language

### Choosing a parsing strategy

### Building our first small feature

### Adding in some additional operators

### What about function calls

### How about absolute values
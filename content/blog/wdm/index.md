---
title: 'Learning WASM via WDM'
date: '2026-07-01'
---

Reflecting on my last blog I realized, while I have used WASM I didn't fully understand WASM. Through the exercise of building my engima engine in rust and running it via WASM I built an understanding of the application of WASM and Rust toolchains supporting that flow. What I didn't learn was the specifics of what WASM has to offer.

## Learning via a new application of the technology

In order to properly understand this technology I needed to interact directly with WASM. This required me to think of a problem that operated at a lower level. After some consideration I decided the easiest way would be to create a toy programming language. Let's call this language WASM Dumb Math or WDM for short. The reason it's "dumb" is because it is not feature rich and it only supports basic arithmatic. Also since its "dumb math" we are only going to use 32bit primitives since 64bits is too much for the silly types of programs we will be creating.

## What is WAT?

Now before we get into anything around WDM we should understand a bit better how WASM works. Much like assembly there are two representations we can work with. The first is the underlying binary representation of the program. These are the `.wasm` files and are optimized for parse time and file size. The second is a slightly more readible human friendly version of the code. These are `.wat` files and they compile down to `.wasm` files using a program like [wabt](https://github.com/webassembly/wabt). To compare let's look at the output of the same simple program using both formats.

Here we have a simple exported function called `add` that adds to variables `$a` and `$b` represented as a `.wat`.
```wat
(module
  (func (export "add") (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.add
  )
)
```

When compiled the output from the wasm file as a hexdump would look like this.
```bash
$ hexdump -C module.wasm
00000000  00 61 73 6d 01 00 00 00  01 07 01 60 02 7d 7d 01  |.asm.......`.}}.|
00000010  7d 03 02 01 00 07 07 01  03 61 64 64 00 00 0a 09  |}........add....|
00000020  01 07 00 20 00 20 01 92  0b                       |... . ...|
00000029
```

## Features of WASM

At its core WASM is a very condensed binary representation of a program. This is often compared to traditional assembly versions like x86. As such it has a much more limited set of features than you might be used to if you have not worked in an assembly language. In WASM the supported primitive types are 32 and 64 bit integers and floats as well as a 128 bit vector type. To store these values you can use locals and globals. These are similar to registers in other assembly languages but without specific register names and semantics to focus on. Finally to manipulate these primitives there are different instructions. These include: control flow instructions like `if`, `else`, and `loop`, memory instructions like `load`, `store`, and `grow`, as well as numeric instructions like `add`, `subtract`, and `multiply`. Combining all of these features together you can take any program written in a language like rust and compile it down WASM and run in a browser. Alternatively if you want to try and run this programs outside of a browser like environment you can look at the [wasi](https://wasi.dev/) project. For the purposes of this explortation we will focus on running via NodeJS.

## Getting into the language

Armed with a  loose understanding of WASM features and syntax let's define our toy language. In this language we are going to keep things simple. First this will be a pure functional language. The compiled interface will export functions and those functions will have no side-effects. Additionally there will be no variable support. If you want to have dynamic calculations those will have to be provided as parameters to a function. Also since we are not interested in building a particularly useful language we will only support `i32` denoted as `i` and `f32` denoted as `f` types. Lastly to make this language slightly infuriating and different enough from other languages we will do a few things differently.

1. New line characters will be structurally important to parsing.
2. No keyword will be used to denote a function.
3. No tab, brace or other semantics will be used to denote a function body.

Here is an example set of functions that should work in this language.

```wdm
internalTest(a:f) f -> 12_f - a
pub subtract(a:f, b:f) f -> a - b
pub randomTest(a:f) f -> 10_f * subtract(5.35_f, 3.1_f) + internalTest(a)
pub add(a:f, b:f) f -> a + b
pub multiply(a:f, b:f) f -> a * b
pub divide(a:f, b:f) f -> a / b
pub five() i -> 5_i

```

With these examples we can loosely see the structure. There is an optional `pub` that denotes if the function is publically exposed. This is followed by a function name with parameters, then a return type, and finally the function body.

### Choosing a parsing strategy

Now to parse this I could write my own parser and lexer and get all of that working, or I could use one of many open source projects that already do this. Since my goal is not to learn about WASM and not lexing and parsing, existing tooling is the way to go. In this space there are many options like [antlr](https://www.antlr.org/), [JavaCC](https://javacc.github.io/javacc/), [lezer](https://lezer.codemirror.net/), and [tree-sitter](https://tree-sitter.github.io/tree-sitter/). In the end I landed on using antlr due to its maturity in the space.

### Setting up our generation

Now that we know what we are building and how we are parsing it we just need to settle on a few finishing touches. The definition of the grammar itself is not that interesting, we need to reduce it down to something executable. In this case we are going to have two targets. The first will be JavaScript, and the second will be the WAT representation that we can compile down to WASM using WABT. The reason we want to generate JavaScript is to have a point of comparision. With all of this we can setup our harness with a simple NodeJS application.

```javascript
const input = fs.readFileSync('./input.wdm', 'utf8');
const tree = getAntlrParseTree(input);

const jsBuilder = new JavascriptGenerator(tree);

let builtJS = jsBuilder.generate();
writeGenFile(builtJS, 'program.js');

const watBuilder = new WatGenerator(tree);
let builtWAT = watBuilder.generate();

writeGenFile(builtWAT, 'program.wat');
assembleWatWithWABT('program.wat', 'program.wasm');
```

### Building our first feature

Let's take a first step and work on a small feature. To do this we need to create the syntax required for this subset of the program. For starters, let's just support static math with only addition and subtraction supported. Also we will have this be an expression with a single export that is the main function. So in this version all we want to support is a program like the following.

```wdm
12_i + 13_i
```

This program would then be callable using the following code.

```javascript
import * as fs from 'fs';

async function run() {
  const wasmBuffer = fs.readFileSync('./gen/program.wasm');
  const wasmModule = await WebAssembly.instantiate(wasmBuffer, {});

  const { main } = wasmModule.instance.exports;
  console.log(main()); // 25 is logged to output
}

run();
```

 To support this simple case lets examine the grammar required.

 ```antlr
grammar wdm;
program: expression EOF;
expression
    : expression op=(PLUS|MINUS) expression # communicativeMath
    | INTEGER # integer
    | FLOAT # float;
INTEGER : [0-9]+'_i';
FLOAT : ([0-9]+'.')?[0-9]+'_f';
PLUS: '+';
MINUS: '-';
WS : [ \t\r\n]+ -> skip;
 ```

 Now to go along with this grammar we can create a very simple WAT generator.

 ```javascript
import wdmLexer from "./wdmLexer.js";
import wdmParser from './wdmParser.js';

export default class WatGenerator {
    constructor(tree) {
        this.tree = tree;
        this.currentNumberType = 'i32';
        this.tabCount = 0;
    }

    generate() {
        return this.visitProgram(this.tree);
    }

    visitProgram(context) {
        let res = '(module\n';
        this.tabCount++;
        res += `${this.getTabs()}(func (export "main")`;
        this.tabCount++;
        let body = '';
        for (let child of context.children) {
            if (child instanceof wdmParser.ExpressionContext) {
                body += this.visitExpression(child);
            }
        }
        this.tabCount--;
        res += ` (result ${this.currentNumberType})\n${body}${this.getTabs()})\n`;
        this.tabCount--;
        res += ')';
        return res;
    }

    visitExpression(context) {
        if (context instanceof wdmParser.CommunicativeMathContext) {
            return this.visitCommunicativeMath(context);
        }
        
        if (context instanceof wdmParser.IntegerContext) {
            return this.visitInteger(context);
        }

        if (context instanceof wdmParser.FloatContext) {
            return this.visitFloat(context);
        }

        return '';
    }

    visitCommunicativeMath(context) {
        return `${this.visitExpression(context.expression(0))}${this.visitExpression(context.expression(1))}${this.visitOperator(context)}`
    }

    visitInteger(context) {
        this.currentNumberType = 'i32';
        return `${this.getTabs()}i32.const ${context.INTEGER().getText().replace('_i', '')}\n`;
    }

    visitFloat(context) {
        this.currentNumberType = 'f32';
        return `${this.getTabs()}f32.const ${context.FLOAT().getText().replace('_f', '')}\n`;
    }

    visitOperator(context) {
        if (context.MINUS?.()) {
            return `${this.getTabs()}${this.currentNumberType}.sub\n`;
        }
        if (context.PLUS?.()) {
            return `${this.getTabs()}${this.currentNumberType}.add\n`;
        }
        return '';
    }

    getTabs() {
        let res = '';
        for (let i = 0; i < this.tabCount; i++) {
            res += '\t';
        }
        return res;
    }
}
```

 If we pass in our function from above we get the following outputs.

 ```javascript
 export function main() {
    return 12 + 13;
 }
 ```

```wat
(module
	(func (export "main") (result i32)
		i32.const 12
		i32.const 13
		i32.add
	)
)
```

```bash
$ hexdump -C ./gen/program.wasm 
00000000  00 61 73 6d 01 00 00 00  01 05 01 60 00 01 7f 03  |.asm.......`....|
00000010  02 01 00 07 08 01 04 6d  61 69 6e 00 00 0a 09 01  |.......main.....|
00000020  07 00 41 0c 41 0d 6a 0b                           |..A.A.j.|
00000028
```

### Adding in some additional operators

This is a pretty good start but we can do better. We still haven't supported all operators. We can trivially add support for parenthesis, divide, and multiplication. All we have to do is extend our grammar and add a bit of extra logic to our operator logic.

Let's tweek our grammar a bit first.

```antlr
grammar wdm;
program: expression EOF;
expression
    : '(' expression ')' #groupedExpression
    | expression op=(DIVIDE|MULTIPLY) expression # associativeMath
    | expression op=(PLUS|MINUS) expression # communicativeMath
    | INTEGER # integer
    | FLOAT # float;
INTEGER : [0-9]+'_i';
FLOAT : ([0-9]+'.')?[0-9]+'_f';
PLUS: '+';
MINUS: '-';
DIVIDE: '/';
MULTIPLY: '*';
WS : [ \t\r\n]+ -> skip;
```

Then add in a few more branches to an existing function.

```javascript
visitExpression(context) {
    if (context instanceof wdmParser.AssociativeMathContext) {
        return this.visitAssociativeMath(context);
    }
    // Existing contexts are omitted.
    return '';
}

visitOperator(context) {
  if (context.DIVIDE?.()) {
      return `${this.getTabs()}${this.currentNumberType}.div${this.currentNumberType === 'i32' ? _s : ''}\n`;
  }
  if (context.MULTIPLY?.()) {
      return `${this.getTabs()}${this.currentNumberType}.mul\n`;
  }
  // Existing operators are omitted.
}
```

With these changes we can start expressing programs like this.

```wdm
12_f * 15_f + 66_f
```

Which when compiled would produce the following outputs.

```javascript
export function main() {
    return 12 * 15 + 66;
}
```

```wat
(module
	(func (export "main") (result f32)
		f32.const 12
		f32.const 15
		f32.mul
		f32.const 66
		f32.add
	)
)
```

### What about function calls?

So now we have supported basic arithmatic but what about those function calls? Currently everything could be reduced down to a single number at compile time and there would be no compelling reason to even use this language. To support this we are going to have to expand our grammar dramatically. Concepts like function definitions, function bodies, parameters, and function call semantics now come into play.

Our updated grammar now allows you to have function definitions and calls.

```antlr
grammar wdm;
program: (expression | functiondef)+ EOF;
functiondef: PUBLICMARKER? NAME '(' PARAMETER? (',' PARAMETER)* ')' DATATYPE '->' expression'\n'+;
functioncall: NAME '(' (INTEGER | FLOAT | NAME)? (',' (INTEGER | FLOAT | NAME))* ')';
expression
    : functioncall #functionCall
    | '(' expression ')' #groupedExpression
    | expression op=(DIVIDE|MULTIPLY) expression # associativeMath
    | expression op=(PLUS|MINUS) expression # communicativeMath
    | INTEGER # integer
    | FLOAT # float
    | NAME # variable;
DATATYPE: ('f' | 'i');
PARAMETER: NAME ':' DATATYPE;
INTEGER : [0-9]+'_i';
FLOAT : ([0-9]+'.')?[0-9]+'_f';
PLUS: '+';
MINUS: '-';
DIVIDE: '/';
MULTIPLY: '*';
PUBLICMARKER: 'pub';
NAME: [a-zA-Z]+[a-zA-Z0-9]*;
WS : [ \t\r]+ -> skip;
```

I could show you all the changes required to make this work, but I think that would be a bit too distracting. Instead I will highlight this top level change to show how we expanded our support.

```javascript
visitProgram(context) {
    let res = '(module\n';
    this.tabCount++;
    for (let child of context.children) {
        if (child instanceof wdmParser.ExpressionContext) {
            res += this.visitExpression(child);
        }
            
        if (child instanceof wdmParser.FunctiondefContext) {
            res += this.visitFunctionDefinition(child);
        }
    }
    this.tabCount--;
    res += ')';
    return res;
}
```

Our program no longer declares a single export. We can now have many different functions defined or exported. With all of these features added we should now be able to produce working code for our original example.

```wdm
internalTest(a:f) f -> 12_f - a
pub subtract(a:f, b:f) f -> a - b
pub randomTest(a:f) f -> 10_f * subtract(5.35_f, 3.1_f) + internalTest(a)
pub add(a:f, b:f) f -> a + b
pub multiply(a:f, b:f) f -> a * b
pub divide(a:f, b:f) f -> a / b
pub five() i -> 5_i
```

This would now be represtented as the following outputs.

```javascript
function internalTest(a) {
	return 12 - a;
}
export function subtract(a, b) {
	return a - b;
}
export function randomTest(a) {
	return 10 * subtract(5.35, 3.1) + internalTest(a);
}
export function add(a, b) {
	return a + b;
}
export function multiply(a, b) {
	return a * b;
}
export function divide(a, b) {
	return a / b;
}
export function five() {
	return 5;
}
```

```wat
(module
	(func $internalTest (param $a f32) (result f32)
		f32.const 12
		local.get $a
		f32.sub
	)
	(func (export "subtract") (param $a f32) (param $b f32) (result f32)
		local.get $a
		local.get $b
		f32.sub
	)
	(func (export "randomTest") (param $a f32) (result f32)
		f32.const 10
		f32.const 5.35
		f32.const 3.1
		call 1
		f32.mul
		local.get $a
		call $internalTest
		f32.add
	)
	(func (export "add") (param $a f32) (param $b f32) (result f32)
		local.get $a
		local.get $b
		f32.add
	)
	(func (export "multiply") (param $a f32) (param $b f32) (result f32)
		local.get $a
		local.get $b
		f32.mul
	)
	(func (export "divide") (param $a f32) (param $b f32) (result f32)
		local.get $a
		local.get $b
		f32.div
	)
	(func (export "five") (result i32)
		i32.const 5
	)
)
```

Now if we pay closer attention we might notice the call semantics of a public function and a private function ended up being different. Notice in this code we call the public method `subtract` with `1` but the `internalTest` with `$internalTest`?

```wat
(func (export "randomTest") (param $a f32) (result f32)
		f32.const 10
		f32.const 5.35
		f32.const 3.1
		call 1
		f32.mul
		local.get $a
		call $internalTest
		f32.add
	)
```

In this case `1` is the function index of the function we want to call. WASM allows us to execute functions in this way if the exported function does not start with an `$`. Since our grammar does not allow functions to be defined this way we had to use the index to call those internally. Another thing that becomes interesting is if we focus in on the resulting hexdump.

```bash
$ hexdump -C ./gen/program.wasm
00000000  00 61 73 6d 01 00 00 00  01 10 03 60 01 7d 01 7d  |.asm.......`.}.}|
00000010  60 02 7d 7d 01 7d 60 00  01 7f 03 08 07 00 01 00  |`.}}.}`.........|
00000020  01 01 01 02 07 3a 06 08  73 75 62 74 72 61 63 74  |.....:..subtract|
00000030  00 01 0a 72 61 6e 64 6f  6d 54 65 73 74 00 02 03  |...randomTest...|
00000040  61 64 64 00 03 08 6d 75  6c 74 69 70 6c 79 00 04  |add...multiply..|
00000050  06 64 69 76 69 64 65 00  05 04 66 69 76 65 00 06  |.divide...five..|
00000060  0a 4b 07 0a 00 43 00 00  40 41 20 00 93 0b 07 00  |.K...C..@A .....|
00000070  20 00 20 01 93 0b 19 00  43 00 00 20 41 43 33 33  | . .....C.. AC33|
00000080  ab 40 43 66 66 46 40 10  01 94 20 00 10 00 92 0b  |.@CffF@... .....|
00000090  07 00 20 00 20 01 92 0b  07 00 20 00 20 01 94 0b  |.. . ..... . ...|
000000a0  07 00 20 00 20 01 95 0b  04 00 41 05 0b           |.. . .....A..|
000000ad
```

Notice that the compression of the `.wasm` vs the `.wat` file is quite significant here? In the `.wat` file we have used ~770 bytes where in the `.wasm` case we only used ~170. This makes a huge difference when you have to send that data over the network and parse it. 

### How about absolute values?

By now we have a pretty neat little language that allows us to do basic math and even handle values from external callers. However, there are still cases we cannot handle. The first of which is getting the absolute value of a number. There are a couple of ways we could do this. First, we could add syntax to denote an absolute value. If we draw from a mathematics background we might be tempted to support the following.

```wdm
pub abs(v:f) f -> |v|
```

This would cleanly translate to assembly with the [abs instruction](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Numeric/abs). Alas, I landed on a far less elegant solution to this problem. This is not because I thought it was better. Instead the solution choosen allowed me to work with more primitive instructions. Another way to get the absolute value of a number is to use bitwise operators.

```wdm
pub abs(a:i) i -> (a ^ (a >> 31_i)) - (a >> 31_i)
```

Since we know that these are always 32 bit signed values, we can manipulate a single bit to produce an absolute value. The resulting output for this is hopefully predictable.

```javascript
export function abs(a) {
	return (a ^ (a >> 31)) - (a >> 31);
}
```

```wat
(module
	(func (export "abs") (param $a i32) (result i32)
		local.get $a
		local.get $a
		i32.const 31
		i32.shr_s
		i32.xor
		local.get $a
		i32.const 31
		i32.shr_s
		i32.sub
	)
)
```

### Now let's break a rule

Now we have a pretty fun little language, but there are just some things that are still hard to express. For example, what if I want to get the floor of a floating point value? While I could attempt to do this with bitwise operators, this would be frought with error. Due to the mantissa and floating point nature of these values, I would almost certainly get the floor wrong. Again one way we could do this is we could do this is to extend the grammar to support floor.

```wdm
pub floor(v:f) f -> ⌊v⌋
```

However this would lead to constant grammar changes as the function set expanded: floor, round, ceil, etc. Another approach would be some sort of [intrinstics function](https://en.wikipedia.org/wiki/Intrinsic_function) like C has. As a result I could use this code to do the floor instead.

```wdm
pub floor(v:f) f -> _floor(v)
```

However I backed myself into a bit of an uncomfortable situation. Since I produce two targets JavaScript and WAT the intrinsic support is a bit different between those targets and things could get a bit messy. Even in this example for Javascript I would have to use [Math.floor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) while in WASM I would just use [floor](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Numeric/floor). Instead of dealing with this complexity I landed on using one more feature of WASM we haven't talked about yet. This being import statements. In WASM you can import external functions at load time to allow external code to be run inside of your WASM runtime. Now I can extend the grammar to include import functions.

```antlr
importDef: IMPORTMARKER NAME '(' PARAMETER? (',' PARAMETER)* ')' DATATYPE '->' '\n'+;
```

With this change we can finally support this case.

```wdm
import floor(a:f) f ->
pub main() f -> floor(6.7_f)
```

Which translates into the following outputs.

```javascript
let env = {};
export function setEnv(imp) {
	env = imp;
}
export function main() {
	return env.floor(6.7);
}
```

```wat
(module
	(import "env" "floor" (func $floor (param $a f32) (result f32)))
	(func (export "main") (result f32)
		f32.const 6.7
		call $floor
	)
)
```

Add in a little tweak to the calling code and now we have our floor example working.

```javascript
import * as fs from 'fs';

async function runWasmNode() {
  const wasmBuffer = fs.readFileSync('./gen/program.wasm');
  const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
    env: { floor: Math.floor }
  });

  const { main } = wasmModule.instance.exports;
  console.log(main());
}

runWasmNode();
```

If you are paying close attention we broke a rule of our original language, did you catch it? That's right, this language is no longer a pure functional language. We can now introduce side effects by importing functions that deal with time.

```wdm
import now() f ->
pub main() f -> now() / 10_f
```

This is a minor price to pay to reduce complexity and it provides more functionalty anyway.

## Admission of impracticality

At this point I need to say the obvious part out loud. This language and its approach are largely impractical. There are great tools like [LLVM](https://llvm.org/) that can handle all of this complexity for you and even compiled to more targets. If I was being serious about making a language I would both design it better and compile it down to LLVM's intermediate language to maximize optimizations and targets. However, if I took the time to compile to LLVM I would have learned an interesting lesson but not the lesson I wanted to. In the past I learned how to leverage WASM to run Rust code in the browser. Through this "suboptimal" exercise I learned what I wanted to all along. Letting LLVM do the heavy lifting would have robbed me of that experience all over again.

If you found any of this interesting all related code can be found [here](https://github.com/JeffreyRiggle/wdm).
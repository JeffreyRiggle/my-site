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

At its core Wasm is a very condensed binary representation of a program. This is often compared to traditional assembly versions like x86. As such it has a much more limited set of features than you might be used to if you have not worked in assembly. In the case of Wasm the supported primitive types are 32 and 64 bit integers and floats as well as a 128 bit vector type. To store these values you can use locals and globals. These are similar to registers in other assembly languages but without specific register names and semantics to focus on. Finally to manipulate these primitives there are different instructions. These include: control flow instructions like `if`, `else`, and `loop`, memory instructions like `load`, `store`, and `grow`, as well as numeric instructions like `add`, `subtract`, and `multiply`. Combining all of these features together you can take any program written in a language like rust and compile it down WASM and run in a browser.

## Getting into the language

So now that we have a loose understanding of WASM features and syntax let's define our toy language. In this language we are going to keep things very simple. First this will be a truely pure functional language. The compiled interface will only export functions and those functions will have no side-effects. Additionally there will be no variable support. If you want to have dynamic bits of data those will have to be provided as parameters to the function. Also since we are not interested in building a particularly useful language we will only support `i32` denoted as `i` and `f32` denoted as `f` types. Lastly to make this language possibly slightly infuriating and different enough from other languages we will do a few things differently.

1. New line characters part of the parsing
2. No keyword to denote a function
3. No tab, brace or other semantics to denote function body.

Here is an example set of functions that should work in this language.

```wdm
internalTest(a:f) f -> 12_f - a
pub subtract(a:f, b:f) f -> a - b
pub randomTest(a:f) f -> 10_f * subtract(5.35_f, 3.1_f) + internalTest(a)
pub add(a:f, b:f) f -> a + b
pub multiply(a:f, b:f) f -> a * b
pub divide(a:f, b:f) f -> a / b
```

In this we can see loosely the structure. There is an optional `pub` that denotes if the function is publically exposed. This is followed by a function name with parameters, then a return type, and finally the function body.

### Choosing a parsing strategy

Now to parse this I could write my own parser and lexer and get all of that working or I could use one of many open source projects that already do this. Since my goal was to learn about WASM and not lexing and parsing I decided to use existing tooling. In this space there are many options like [antlr](https://www.antlr.org/), [JavaCC](https://javacc.github.io/javacc/), [lezer](https://lezer.codemirror.net/), or [tree-sitter](https://tree-sitter.github.io/tree-sitter/). In the end I landed on using antlr due to it maturity in the space and prior exposure.

### Setting up our generation

So now that we know what we are building and how we are parsing it we just need to settle on a few more things. In order to work with this the parsed representation has to be reduced down to something. In this case we are going to have two targets for this. The first will be JavaScript and the second will be the WAT representation that we can compile down to WASM using WABT. The reason we want to generate JavaScript at all is just to have a point of comparision. With all of this we can setup our harness with a simple NodeJS application.

```javascript
const input = fs.readFileSync('./input.wdm', 'utf8');
const tree = getAntlrParseTree(input);
const jsBuilder = new JavascriptGenerator(tree);

let builtJS = jsBuilder.generate();
writeFile(buildJS, 'program.js');

const watBuilder = new WatGenerator(tree);
let builtWAT = watBuilder.generate();

writeFile(builtWAT, 'program.wat');
assembleWat('program.wat', 'program.wasm');
```

### Building our first feature

Now let's look at the very first and simple feature. Lets just create the syntax required to do a subset of thie program. Let's start by just supporting static math with only addition and subtraction supported. Let's also just have this be an expression with a single export that is the main function. So in this version all we want to support is a program like

```wdm
12_i + 13_i
```

This program would then be callable using the following code.

```javascript
import * as fs from 'fs';

async function runWasmNode() {
  const wasmBuffer = fs.readFileSync('./gen/program.wasm');
  const wasmModule = await WebAssembly.instantiate(wasmBuffer, {});

  const { main } = wasmModule.instance.exports;
  console.log(main()); // 25 is logged to output
}

runWasmNode();
```

 To support this simple case lets start with the grammar required.

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
WS : [ \t\r\n]+ -> skip ;
 ```

 Now to work with this we can create a very simple WAT generator.

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
        let body = '';
        for (let child of context.children) {
            if (child instanceof wdmParser.ExpressionContext) {
                body += this.visitExpression(child);
            }
        }
        res += `(result ${this.currentNumberType})\n${body}`;
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

 Now if we pass in our original function we get the following outputs

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

### Adding in some additional operators

Now this is a pretty good start but we can do better. We still haven't supported all operators, we can pretty trivially add support for parenthesis, divide, and multiplication. In this case all we have to do is extend our grammar and add a bit of extra logic to our operator logic.

Let's tweek our grammar a bit first
```antlr
grammar wdm;
program: (expression | functiondef | importDef)+ EOF;
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
WS : [ \t\r\n]+ -> skip ;
```

Then add in a few more branches to an existing function.

```javascript
visitOperator(context) {
  if (context.DIVIDE?.()) {
      return `${this.getTabs()}${this.currentNumberType}.div${this.currentNumberType === 'i32' ? _s : ''}\n`;
  }
  if (context.MULTIPLY?.()) {
      return `${this.getTabs()}${this.currentNumberType}.mul\n`;
  }

  if (context.MINUS?.()) {
      return `${this.getTabs()}${this.currentNumberType}.sub\n`;
  }
  if (context.PLUS?.()) {
      return `${this.getTabs()}${this.currentNumberType}.add\n`;
  }
  return '';
}
```

Now we can start expressing programs like this.

```wdm
12_f * 15_f + 66_f
```

This program being represented as the following outputs.

```javascript
export function main() {
    return 12 * 15 + 66;
}
```

```wat
(module
  (func (export "add") (result f32)
    f32.const 12
    f32.const 15
    f32.mul
    f32.const 66
    f32.add
  )
)
```

### What about function calls?

Alright so now we have supported some very basic arithmatic but what about those function calls. Without adding that in this could all be reduced down to a single number at compile time and there would be no compelling reason to even toy with this language. To do this we are going to have to really start to expand our grammar. Concepts like function definitions, function bodies, parameters, and function call semantics now have to come into play.

Our updated grammar starts to look a bit more complex.

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
WS : [ \t\r]+ -> skip ;
```

Now I could show you all the changes required to make this work but I think that would distract from the point here. Instead I will show this little snip to show loosely how we expand our support to handle this.

```javascript
visitProgram(context) {
    let res = '(module\n';
    this.tabCount++;
    for (let child of context.children) {
        if (child instanceof wdmParser.ImportDefContext) {
            res += this.visitImport(child);
        }
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

Now our visit program no longer declares a single export and we can now have many different function defined or exported. With all of these features added we should now be able to produce working code for our original example.

```wdm
internalTest(a:f) f -> 12_f - a
pub subtract(a:f, b:f) f -> a - b
pub randomTest(a:f) f -> 10_f * subtract(5.35_f, 3.1_f) + internalTest(a)
pub add(a:f, b:f) f -> a + b
pub multiply(a:f, b:f) f -> a * b
pub divide(a:f, b:f) f -> a / b
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
)
```

One thing that is a bit interesting here is that the call semantics of a public function and a private function end up being different. Notice in this code we call the public method `subtract` with `1` but the `internalTest` with `$internalTest`?

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

In this case 1 is the function index of the function we want to call. WAT allows us to execute functions in this way and allows us to use the same function internally and externally.

### How about absolute values

By now we have a pretty neat little language that allows us to do basic math and even provide values from external callers. However there are still some cases we cannot handle. The first of which is getting the absolute value of some number. Now there are a couple of ways we could do this. First we could add some sort of syntax to denote an absolute value. If we draw from a mathematics background we might be tempted to support something like the following

```wdm
pub abs(v:f) f -> |v|
```

This would even cleanly translate to assembly with the `abs` instruction. However I also realized that I could do the same with bitwise operations and apparently I really wanted to solve this problem with bitwise operations. Instead I landed on the far less elegant solution to this problem. This is not because I thought it was better but instead because it allowed me to work with more primitive instructions.

```wdm
pub abs(a:i) i -> (a ^ (a >> 31_i)) - (a >> 31_i)
```

Since I know that these are always 32 bit signed values I know I can always manipulate a single bit to produce the absolute value and do so. The resulting output for this is likely expected.

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

Now we have a pretty fun little language but there are just some things that are getting harder to express. For example what if I want to get the floor of some floating point value. While I could attempt to do this with bitwise operators this would be frought with error. Due to the mantissa and floating point nature of floats I would almost certainly get the floor wrong most of the time. Another way we could do this is we could do what was mentioned in the past and extend the grammar to support floor.

```wdm
pub floor(v:f) f -> ⌊v⌋
```

However this would lead to constant grammar changes as the function set expanded: floor, round, ceil, etc. Another way we could accomplish this is with the sort of intrinstics that C supports. For example I could just have some functions that I know are part of the underlying architecture that I call. For example I could use this code to do the floor instead.

```wdm
pub floor(v:f) f -> _floor(v)
```

However I backed myself into a bit of an uncomfortable situation. Since I produce two targets JavaScript and WAT the intrinsic support is a bit different between those targets and things could get a bit messy. Even in this example for Javascript I would have to use `Math.floor` while in WASM I would just use `floor`. Instead what I landed on was using one more feature of WASM we haven't talked about yet and that is import support. In WASM you can import external functions at load time to allow external code to be run inside of your WASM runtime. So now I can extend the grammar to include import functions.

```antlr
importDef: IMPORTMARKER NAME '(' PARAMETER? (',' PARAMETER)* ')' DATATYPE '->' '\n'+;
```

With this change we can finally support this case.

```wdm
import floor(a:f) f ->
pub main() f -> floor(6.7_f)
```

Translates into the following outputs.

```javascript
let imported = {};
export function setImports(imp) {
	imported = imp;
}
export function main() {
	return imported.floor(6.7);
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

Now if you are paying close attention we broke a rule of our original language, did you catch it? That is right this language is no longer a pure functional language. We can now introduce side effects by importing functions that deal with time for example.

```wdm
import now() f ->
pub main() f -> now() / 10_f
```

This is a minor price to pay to reduce complexity and it provides more functionalty anyway.

## Welcome to play

If you found any of this interesting you are more than welcome to read, fork, etc the code used to produce this post. All related code can be found [here](https://github.com/JeffreyRiggle/wdm). While I do not think this language is even remotely useful in practice I had a lot of fun working on it. This effort taught me a lot more of what I wanted to learn that the engima project. If we zoom out a bit it doesn't make sense to write directly to WAT. Producing a WAT output is questionable as LLVM supports WASM as a target and you would get a much bigger bang for your buck being able to produce LLVM compatible outputs instead. However if your end goal is just to learn about WASM then it is quite a bit of fun.
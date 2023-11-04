---
title: 'LLMs and TDD'
date: '2023-11-04'
---

# LLMs and TDD
With all the undeniable hype around LLMs and more specifically ChatGPT I decided it was time to give it a fair shot. For the last year or so almost everyone has been talking about how it is going to revolutionize how many of us do our jobs and completely change how software engineers write software. It has also been suggested that those of us who choose not to use the technology will be left in the dust by those who choose to use it.

This sort of hype is so common in our industry that I decided to give it a while before even attempting to use it. When I finally got around to using it at first I was impressed. Visually its presentation style is quite stunning and it provides very promising-looking results to the questions you give it. However, on further inspection, my initial take was it constantly makes mistakes and presents them in a way that sounds factual. Most of my common use cases for a tool like this would be to replace searching documentation on a third-party library I depend on, but alas it would often make up interfaces and function calls for the tool that didn't exist. After this first exposure, I decided to put the tool down and move on.

Over the past several months people in the industry kept singing its praises. This got me thinking maybe I wasn't using the tool the right way and if I could just find the right way to work with it I would become even more productive and might be able to accomplish things I would otherwise pass on due to difficulty.

## Understanding how others use it
The first step I figured was to see how other people had been using it and where they seemed to find value with the tool. Through this, I found that the most common use cases had been the following themes

* Document this code for me because it's hard to understand.
* Write tests for the code I have already authored.
* Write my code for me as I describe what it should do.
* Refactor some existing code to make it more readable.

Of these cases, the one case I found fascinating was the `Write my code for me as I describe what it should do`. This seems like an interesting replacement for pair programming in an industry where that sort of activity is becoming a bit rarer. However, most of the other cases just didn't work for me. I suspect it might just be me being stubborn or maybe I have subscribed too much to the dogma of people like [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin) and [Kent Beck](https://en.wikipedia.org/wiki/Kent_Beck) but some of these cases seemed a bit irresponsible. I understand documentation is hard to write and tests can be tedious but these seem like part of the rigor that comes along with any Job containing the title "Engineer".

## Thinking about how I would want to apply it
At this point, I decided to take some time and reflect. If I was going to use a tool like this how would I want to use it? Upon a fair amount of thinking I landed on the best way to use the tool and get the desired outcomes would be some sort of TDD loop. In this loop, I decided that the human would be in control of the inputs and outputs by writing the tests. This would in turn leave the implementation up to the AI.

At this point, I was starting to get excited and even thought a bit more about how transformative this kind of workflow could be. I even started to consider how it might start to draw parallels between other industries. For example, it's interesting that we design and build code as programmers but other industries like housing have architects that design the house but never have to do the construction.


## Starting off simple
At first, I decided to start off simple. In this case, I was going to use a language I use a lot and try something rather trivial. In this case, I decided something trivial would be a simple partitioned log that is backed by localStorage. Going into this I had already built up a few assumptions

* ChatGPT would not produce a working result faster
* ChatGPT would not write documentation by default
* ChatGPT would default to writing typescript when given a test with no types
* ChatGPT would write more code than was required.

After this test was completed I found the following. Much to my surprise, ChatGPT did not assume typescript by default. Also since I was in such a rush to set a time record to beat I made a mistake that assumed you would always append a log before reading the log. I also found that ChatGPT did produce a result faster however I had already written the tests in advance so that might account for the time difference.

### Expectation breakdowns
One thing I found rather quickly is that ChatGPT was not picking up on the expectations that my tests had been subtly impliying. For example in my test code I was mocking out `getItem` and `setItem` in local storage. However ChatGPT really wanted to index all items directly from local storage. For example instead of writing some code like this
```javascript
const value = localStorage.getItem(partition);
```

it really wanted to do this
```javascript
const value = localStorage[partition];
```

Another assumption I had built up was that if I just feed it the errors from execution it would be able to deduce what was wrong and at least attempt a change that would fix the failure. What I found instead was that often the change it made would actually produce more failures and might not even fix the originally failing test. In the end I found that I had to directly state my expectations around why I thought its implementation was failing tests.

### Result
In the end we worked out a solution that got all tests passing but still wasn't quite what I wanted. Ideally I wanted it to use generics for values on a log but due to how I wrote the tests `string` was sufficient. A bit tired from the converstation I gave up and accepted the result.

```javascript
class LocalStorageLog {
    private logs: Record<string, string[]> = {};

    constructor() {}

    private getLogFromLocalStorage(partition: string): string[] {
        const logJSON = localStorage.getItem(partition);
        if (logJSON) {
            return JSON.parse(logJSON);
        }
        return [];
    }

    private updateLocalStorage(partition: string): void {
        const logArray = this.logs[partition];
        if (logArray) {
            const logJSON = JSON.stringify(logArray);
            localStorage.setItem(partition, logJSON);
        }
    }

    readLog(partition: string): string[] {
        if (!this.logs.hasOwnProperty(partition)) {
            this.logs[partition] = this.getLogFromLocalStorage(partition);
        }
        return this.logs[partition];
    }

    appendLog(partition: string, value: string): void {
        if (!this.logs.hasOwnProperty(partition)) {
            this.logs[partition] = this.getLogFromLocalStorage(partition);
        }
        this.logs[partition].push(value);
        this.updateLocalStorage(partition);
    }
}

export { LocalStorageLog };
```

The result of this test can be found [here](https://github.com/JeffreyRiggle/ai-tdd-test/tree/master/robot/simple).

At this point I was feeling a bit defeated. I had hoped for so much and found that the result was not what I envisioned. However I had come up with a plan that involved multiple tests and I was determined to keep on trying.

## Trying something a bit less comfortable
Moving on another test I really wanted to try was using a language I was less comfortable with. I suspected in this case maybe I would have fewer opinions and might even be able to learn something about the language I had not picked up on before. In this case I decided to use rust and write a very similar bit of code. The twist was this time I would be using files to store data.

### Observations about my own coding experience
What I had found while trying to implement this first by myself was that it took me a significatly longer time to execute on than the previous example. Another observation I had made was that I ended up doing a lot of context switching between my IDE and the standard library. In the end I got a working result.

### Handing it over to ChatGPT
Much in the same fashion as before I decided to then take my tests and hand them off to ChatGPT and see what I could do. In this case I found some familiar issues but to my suprize in the end it produced working code without me having to explain directly how to fix the code. There however two new issues I did not encounter before. The first one was quite minor originally it failed to import something that was needed. The second issue for whatever reason struck a nerve with me. In this case I was writing tests and wanted only the implementation written however ChatGPT took it upon itself to rewrite my tests. In this case it was minor it decided that rust should be written in `snake_case` instead of `camelCase`, but I didn't like the idea of changing the tests this was supposed to be the human part of the job.

In the end I will say it did produce a more correct result and even added some documentation I was not expecting.

```rust
// Non GPT comment had to manually add File import
use std::fs::{self, File};
use std::fs::OpenOptions;
use std::io::{self, Read, Write};
use std::path::Path;

struct LogManager {
    log_dir: String,
}

impl LogManager {
    fn new(log_dir: &str) -> Self {
        // Create the log directory if it doesn't exist
        fs::create_dir_all(log_dir).expect("Failed to create log directory");
        LogManager { log_dir: log_dir.to_string() }
    }

    fn appendLog(&self, log_name: &str, message: &str) {
        let log_path = format!("{}/{}", self.log_dir, log_name);
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
            .expect("Failed to open log file for appending");

        // Append the message to the log file
        writeln!(file, "{}", message).expect("Failed to write to log file");
    }

    fn readLog(&self, log_name: &str) -> Vec<String> {
        let log_path = format!("{}/{}", self.log_dir, log_name);
        if let Ok(mut file) = File::open(&log_path) {
            let mut contents = String::new();
            file.read_to_string(&mut contents)
                .expect("Failed to read log file");
            contents.lines().map(String::from).collect()
        } else {
            vec![]
        }
    }
}

fn main() {

}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_log() {
        let manager = LogManager::new("./unittestdir");
        assert_eq!(manager.readLog("empty"), Vec::<String>::new()); // Gave up and changed test
    }

    #[test]
    fn test_append_log() {
        let manager = LogManager::new("./unittestdir");
        manager.appendLog("append", "My new Message");
        assert_eq!(manager.readLog("append"), vec!["My new Message"]); // Gave up and changed test
    }

    #[test]
    fn test_append_many_log() {
        let manager = LogManager::new("./unittestdir");
        manager.appendLog("appendMany", "My new Message");
        manager.appendLog("appendMany", "My Message 2");
        assert_eq!(manager.readLog("appendMany"), vec!["My new Message", "My Message 2"]); // Gave up and changed test
    }

    #[test]
    fn test_file_creation() {
        let manager = LogManager::new("./unittestdir");
        manager.appendLog("creation", "My creation message");
        assert_eq!(Path::new("./unittestdir/creation").exists(), true);
        assert_eq!(fs::read_to_string("./unittestdir/creation").unwrap(), "My creation message\n");
    }
}
```

The result of this test can be found [here](https://github.com/JeffreyRiggle/ai-tdd-test/tree/master/robot/less-used).


## Trying something a bit more complicated
With the previous tests out of the way it was time to attempt my final test. In this case I was going to give it something a bit more complex that would require implementing multiple files and a common type. This expanded on my first test but added an eventing system in front of the log on top of this we would also have both a localStorage an filesystem backed option for this eventing system.

In this case I had learned from my last experiences and was ready to do a couple things differently. First I was not going to try to time myself on the initial implementation. I wanted to take it slow and write what I would have wanted produced. Second, at this point I was ready to have to be a bit more interactive with ChatGPT. Instead of just throwing failures at it I was ready to give it subtle hits to get to the end goal with my sanity in tact.

What I had found in this case was that again it took ChatGPT a lot longer than I had anticipated to complete this task and again it did in fact require a lot of direct suggestions to get a working result. In this case since there was multiple files there was oppertunity to produce more typescript errors and it certainly did produce a fair amount of those which required me to debug the code and make suggestions on a type that would work. Most of the time during this exercise it felt like I was pair programming with a junior developer. That is not to say there is anything wrong with working with junior developers just I would rather use those oppertunities to teach another engineer instead of fighting with a machine to just have to do it all over again in the future.

In the end there had been a couple positives with this experience. Firstly I found that it exposed some assumptions I had with my file system backed implementation that could have been better. I had also found that the more files we worked on the better it got at producing what I wanted. For example it produced the final file with no issue the first time.

The result of this test can be found [here](https://github.com/JeffreyRiggle/ai-tdd-test/tree/master/robot/event-log).

## Unexpected suprize
In between these tests I decided to play around with ChatGPT a bit and decided to flip this problem on its head. Instead I would have ChatGPT write some tests and I would write the implementation for those tests. In the end I found this to be a lot more enjoyable and saw this as a good oppertunity to use the tool as more of a generalized hone your skills type tool similar to Robert C. Martin's idea of a code kata.

## Conclusions
I understand that this is not the most conculsive test and that there are other tools I could have explored. I am sure I would have seen slightly different results using something like GPT-4 from openai or copilot from GitHub. However after this experience I was not really willing to invest money to see if I would get a better result.

In the end many of the assumptions I had about the tool had been wrong in ways I didn't expect. However instead of being completely disappointed I did find one workflow I quite enjoyed with this tool and it did not end up being a complete was of time. ChatGPT may be useful for many but for the way I like to work with my tools it doesn't quite cut it for me.
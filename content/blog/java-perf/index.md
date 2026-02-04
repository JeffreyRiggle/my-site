---
title: 'Descending the Java Stack'
date: '2026-02-03'
---

## Some ideas won't leave you alone

As I was publishing the last series of blogs there was a constant nagging feeling that I left the biggest pain point underexplored. In the blog I often dismay the choice I made about supporting multiple attributes with dynamic values and I even suggested an approach to make the code more maintable. While I enjoy the developer ergonomics of the solution the thing I couldn't let go of was, "what is the cost of this abstraction?"

In general I find this to be an undervalued consideration which can lead to designs that have questionable performance characteristics but the developer velocity makes up for it. In many cases that is a completely reasonable tradeoff. However, doing a postmortem on a project that is unused gives me the flexibility to be as unreasonable as I want to be and streach the limits.

## Setting up the experiment

In this experiment I knew I wanted to test the original implementation, the implemeted solution, the suggested implementation, and an optimal solution. Now to stress this system I was going to break this down into two cases building an attributes list with 1,000,000 entities and then aggregating all of the values inside of it.

As a recap here is more or less the different data structures in play for each case

### Original implementation (Base Case)

This is a loose representation of the original solution I had.

```Java
class Attribute {
    private String name;
    private Object value;

    public Attribute(String name, Object value)
    {
        this.name = name;
        this.value = value;
    }

    public Object getValue() {
        return this.value;
    }
}
```

In this case the important thing to notice is that the value is just stored as an Object with no help for the consumer to know what the underlying value is


### Implemented solution (Generics Case)

This is roughly the solution that ended up in the code base

```Java
class GenericCaseAttribute {
    private String name;
    private Object value;
    private DataType dataType;

    public GenericCaseAttribute(String name, Object value, DataType dataType)
    {
        this.name = name;
        this.value = value;
        this.dataType = dataType;
    }

    public <T> T getValue() {
        return (T) this.value;
    }

    public DataType getDataType() {
        return dataType;
    }
}
```

Notice this isn't much better but it replaces Object with a generic.

### Suggested solution (Strong Case)

This is the suggestion I made in the recent blog post that was never implmented.

```Java
abstract class StrongCaseAttributeBase {
    private String name;
    private DataType dataType;

    public StrongCaseAttributeBase(String name, DataType dataType) {
        this.name = name;
        this.dataType = dataType;
    }

    public DataType getDataType() {
        return dataType;
    }
}

class StrongCaseInt extends StrongCaseAttributeBase {
    private int value;

    public StrongCaseInt(String name, int value) {
        super(name, DataType.Integer);
        this.value = value;
    }
    public int getValue() {
        return this.value;
    }
}
```

The important thing to note here is that Object is now gone and is replaced with a strong type.

### Optimal Solution (Best case)

In this case I removed any requirement and just did the solution I assumed would be the fastest

```Java
class BestCaseAttribute {
    private String name;
    private double value;

    public BestCaseAttribute(String name, double value)
    {
        this.name = name;
        this.value = value;
    }

    public double getValue() {
        return this.value;
    }
}
```

Notice that this actually breaks the requirements in an attempt to make things faster.

## Finding the benchmark

Originally I thought I could just go simple on this one and do a basic stopwatch style test where I wrote some Java grabbed the time before and after and then did the delta to get the time the implementation took. Simple enough right?

```Java
public static void main(String args[]) {
    long startTime = System.nanoTime();
    // Test here
    long endTime = System.nanoTime();
    System.out.println("Test took " + (endTime - startTime).toString());
}
```

Upon some reflection, I knew this was insufficient. The problem with timing Java is that it is a JITT'd language and as such it requires multiple passes over some code before its optimized. If I really wanted a good representation of the real impact I was going to have to do something a bit better. Turns out people have spent a lot more time thinking about this and there is an entire tool [JHM](https://github.com/openjdk/jmh) built for doing this type of test. Armed with new tool I decided to go with a pretty barebones setup in which I would test operations per second. Also since I wanted to test different parts of this logic I had to create a couple of different benchmarks.

### Full run benchmark
In the case of a full run I would benchmark the time it took to populate and aggregate the results leading to a test like the following.

```Java
@Benchmark
public void bestCase() {
    BestCase c = new BestCase();
    c.populate(1000000, 4);
    c.aggregateTotal();
}
```

### Population benchmark
This benchmark was basically the best case without the aggregation.

```Java
@Benchmark
public void bestCase() {
    BestCase c = new BestCase();
    c.populate(1000000, 4);
    c.aggregateTotal();
}
```

### Aggregation benchmark
This benchmark only tested the aggregation time and did the population outside of the benchmark

```Java
@State(Scope.Benchmark)
private static BestCase c = new BestCase();

@Setup
public void setup() {
    c.populate(1_000_000, 4);
}

public class MyBenchmark {
    @Benchmark
    public void bestCase() {
        c.aggregateTotal();
    }
}
```

## Looking at the results

After spending more time than I care to admit running all of these tests I ended up with a [dataset](./benchmarks.csv) I could play around with. If you filter out the V2 entires you will notice something shocking, the best case doesn't just to better than other cases it completely demolishes them. See there is one thing I didn't mention. In the best case I actually use a plain `Attribute[]` data type instead of an `ArrayList<Attribute>` which had a huge implication. I will come back to this but I did a minor change and generated some V2 benchmarks that made things line up better.

TODO find some charts to put here

## So wait was was the big difference between V1 and V2?

Great question, I would want to know that too. In the first version all implementations except the base case used an unsized ArrayList. Now some of you may know where this is going. Turns out if you don't presize your ArrayList and grow it incrementally you pay a real performance cost. In this case I insert 1,000,000 values sequentially growing the ArrayList along the way. As it turns out the base size of an ArrayList in Java is 10 entires and when you exceed the boundary it grows by 1.4x. This means in the end my arrays resized close to 30 times and produced an excess 250k compacity. This adds up to a crazy amount of time as the resizing event requires array copying and is very heavy hitting.


## But why stop there?

Now I could stop there but where is the fun in that. At this point I know loosely the time it takes but I noticed that I was getting variability in my test runs with JHM. While it does give direction it is not the end source of truth. The question is how can you get closer to the source of truth? In this case I decided the best way to know what is going on is to see the actual disassembly generated by the JVM and interpret that.

### Getting the tools

This required a fair amount of setup, first to really be able to reason about the assembly generated I got intelij IDEA setup with [Jitwatch4j](https://plugins.jetbrains.com/plugin/25979-jitwatch4i/home). Then since the benchmarking was run as a jar I had to make sure the run actually generated a hotspot log file that actually contained all of the disassembly. In the end I ran some crazy command like this

```shell
$ java \
  -XX:+UnlockDiagnosticVMOptions \
  -XX:+PrintAssembly \
  -XX:+LogCompilation \
  -jar target/benchmarks.jar
```

once I had the log files I could then load them into Jitwatch4j and look at the disassembly. However, I was finding that I still wasnt't finding everything I wanted to see. As it turns out some instructions are pre-defined in the JVM and seeing the disassembly really just means seeing a jump to some instruction you cannot find. After some searching around I found [hsdis](https://chriswhocodes.com/hsdis/) which gave me everything I was looking for.

### Looking at the disassembly

TODO find some interesting insights on the assmbly, maybe make mention of having to learn arm since I have only ever looked at x86 in the past.

### Finding metrics to pull from the disassembly

After spending a good amount of time looking at the disassembly I realized it was going to be hard to really find significat findings just looking at 800+ lines of assembly and comparing them to another 800+ lines where there is an illegible diff. Then I remembered something, generally speaking the slowest operations on the CPU should be memory access especially if that access could miss the L1 cache. Looking at the disassembly most operations outside of memory access had been operations that I would expect to have fairly low time complexity. Basically all operations had been very simple arithmatic and things like sin, cos, or even divsion really didn't show up.

With this new insight I decided to count up all of the memory access operations for each case and plot them in this [dataset](./asmmetrics.csv).

## Correlation between data sets

Now I realize that just the number of memory access operations or number of lines of assembly code are a flawed metric for determining performance. This is due to the fact that you don't actually know how the branches will be used at runtime. However, I found it to be shockingly correlated to the timing dataset from JHM. Basically the more memory access operations you have defined in the routine the more operations you can do per second.

TODO example graphs here.

## Leasons learned

* Proper use of arrays is more important than you may think
* it is hard to judge performance of a Java program
* you can actually see the machine code that is generated by the JVM
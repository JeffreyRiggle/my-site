---
title: 'Indexing the web'
date: '2025-08-22'
---

# Taking stock

If you are just jumping into this blog post, I would highly recommend reading the "Journey into search" blog I posted before this one. This helps set the tone for what I am talking about here. If you don't have time for that and want a quick recap, here it is. Basically, I ended up starting a "little" side project to get used to using a terminal-based editor and fell down the deep rabbit hole that is search. Moving forward, I am digging into the first topic, indexing the web.

# Indexing the web

The internet is full of interesting data; you just have to go out and find it. Now, Most of us don't think much about that because we let companies with lots of money find the interesting data for us. This turns into companies like Microsoft, Google, Meta, and at one point in time, Yahoo and AltaVista having a lot of indexed data. Now I am sure most are probably aware of that, but what does it actually take to build and maintain these indexes?

This became a decent part of what I spent my time doing when working on my little search project.

# Compiling assumptions

Often, when going after projects like this one, I start by setting up some assumptions. I like to see how far off my assumptions are from the ground truth.

## Setting the scope

Before listing the assumptions, the following are some basic plans going into this project. I was going to write a web crawler. This web crawler was going to be written in Python. I chose Python because I had used beautifulsoup4 in the past and found it rather effective for parsing html documents. Then I would use SQLite to store the data because that would be the fastest option to bootstrap this.

## Assumptions going in

* SQLite will be insufficient for the volume and scale of data.
* Most time will be spent waiting on HTTP responses.
* 5% or less of the traffic I will encounter will be SPAs.
* The Average main asset (HTML file) will be between 15 and 50kb.
* The initial attempt will miss many links because other linking strategies than anchor tags will be used.
* 99% of sites will have more than 1kb of Javascript.
* The Average size of css will exceed 3kb.
* The total execution time will be less than a day to start.
* The total db size will be over 1gb on disk (.db file).
* The total number of unique domains will be between 100 and 500.
* The most linked site will be Wikipedia.
* 90% of all pages will use compression.

# Constraining the problem

Now I knew going into this that I was just going to run a Python program on my local computer. I also knew there was way too much data on the internet to possibly get a program to complete. Because of this, I had to constrain the problem a bit. What I landed on was that I would point my crawler at a domain and then restrict the crawler activity to only that domain.

Since many of my assumptions had not been limited to HTML, I also knew that I would have to consider all types of assets, not just HTML pages.

To deal with this, I landed on using different policies for different domains. Since these metrics by themselves are only interesting if you can get a couple of different domains involved, the domains would either be crawled, read, or blocked.

# Site selection

Now it was time to start writing some code and running some tests. The problem was I wasn't really sure what to crawl. I knew if I wanted diverse content, I would want to crawl Wikipedia, but there was no way I was going to be able to crawl all of Wikipedia. Since I lack originality and spend a good amount of my time listening to podcasts about software, I figured that would be a good place to start.

A majority of the podcasts I listen to often have their own websites, and I figured that would be a relatively smaller dataset. I eventually came to find out that not all podcasts are treated equally, and some have a shocking amount of content. While I indexed a handful of sites in my testing, I will primarily focus on my findings when indexing [the changelog](https://changelog.com/).

# And so the learning begins

To get started, I figured I would focus on crawling the changelog; this ended up being a mistake. Going into this, I didn't realize just how much content was on the changelog. I also didn't realize just how many different linking strategies they used and just how many domains they owned. Let's take a journey through all the dumb mistakes and self-inflicted challenges I had during this time.

## Href be crazy

Even if you just constrain links to href attributes on an anchor tag, it turns out that one string has a ton of possibilities. If you get this wrong, you might hit a bunch of dead links because you forgot that hrefs can be relative or absolute. Also, you may forget that you can link to a different part of a page using a `#` in the link and either fail to process that page, or even worse, process the same page a ton of times.

## Assets are hiding everywhere

Given the original assumptions, I needed to figure out things like the total JavaScript used. One way to measure this would be to just look at the script tags with a source and measure those. However, that wouldn't be very accurate because JavaScript on a page might be coming from an external source or embedded in the document itself. For example, you could have a script tag with a body or with a src attribute. Likewise, you have similar problems with CSS.

To deal with this, you end up having to consider all sorts of fun ways that JavaScript and CSS can get loaded and used on a page.

Now this could have been the end but instead I started to think about the other supporting assets. What about the images, JSON files, XML files, and audio files? I might as well download and inspect those too, right? In the end, I think the only file types I didn't actively look for were video files. To support all of this content type, I ended up having to do massive refactors to my program, but it was worth it or at least that is what I kept telling myself.

## You wanted that data compressed?

Just because a site supports compression doesn't mean you are going to get compressed content. One of the things I was noticing while looking at my data was that the bytes just didn't add up. I would go to a site in a browser and use the network inspector, and come up with a completely different number than my crawler. For some reason, my crawler had always downloaded more bytes. How could that be? Turns out that those HTTP headers you often forgot about are very important. Also, Python's default HTTP client doesn't help you fall into the pit of success. It is on you to make sure you set that `Accept-Encoding` header and also handle any encodings you claim to handle. From what I have seen, the most popular types of encoding are `brotli` and `gzip`, so I added support for those, and the numbers started tying out.

# Did I forget to mention performance?

What I have neglected to tell you is that through all of these learnings, my crawler was crashing after very long runs. You know how I mentioned the dataset was large, well, that large dataset was causing me to crash a lot, but very slowly. I would start up a run, do something else, and come back to a crashed app hours later. Then I would have to play detective to see what went wrong. Most of the time, it was silly design decisions I made.

## You don't always have to query small data

While this did not end up being a substantial issue, I quickly found out that I was constantly reading the same data from the SQLite database. This data was largely asking the question "Have I seen this URL yet?". In these sorts of crawl patterns, you will often end up finding links back to sites you have already processed. Because of this, I ended up adding a little cache of previously processed URLs and saw a small speed boost.

## Massive columns are bad

I knew this was a bad idea going into the first database design; I just didn't know how bad. In the first version of the database schema, I dumped the entire site HTML into a single column as a raw string. No compression, no special treatment. This was causing me to get databases as big as 3GB before crashing. Doing the sensible thing and saving that content to a file and having a column that stored the file path made a massive diffrence.

## Writes don't always have to be small

By this point, I had made some notable improvements to the performance, but things had still been way slower than I wanted them to be. One thing I was not paying attention to initially was just how often I was writing the database. Turns out that when you are constantly writing to the database as you process each page, you have a lot of small writes. Doing some batching of these writes made the process much quicker.

## Absurd memory usage

By this point, I had solved many of the obvious database issues, but now a new issue was starting to crop up. After running for a while, the process would start to slow down a lot, and the memory was growing. At one point, I got the process up to 30GB of RAM in use before the program crashed. At first, I noticed that I wasn't quite using the http client correctly, but even addressing that was still causing an absurd amount of memory to be used. After figuring out how to profile in Python, I found that almost all of the memory was being used up by beautifulsoup4.

The process I had been using up to this point was a very naive approach. First, I would get a page and process it. Then I would find all of its links. Then I would repeat the process on the newly found pages that had not already been processed. These pages would be classes that had a property for the beautifulsoup4 content. You could imagine the code as something like the following

```python
def crawl(pending_links):
    new_links = []
    for link in pending_links
        # Process link
        # Add to new_links
    
    if len(new_links) > 0:
        crawl(new_links)
```

As you may be able to imagine, after a certain point, you get very large lists of pages to process that all have to be completed before getting reclaimed. What I ended up doing to address this was as simple as doing an iteration by popping off a list instead of doing a foreach style enumeration. Creating something closer to this.

```python
def crawl(pending_links):
    new_links = []
    while len(pending_links) > 0:
        link = pending_links.pop()
        # Process link
        # Add to new_links

    if len(new_links) > 0:
        crawl(new_links)
```

## Python has threads

By this point, I had finally had a successful run, but processing one of the sites I wanted to ended up taking 4 days to complete. This was not optimal. Up until this point, I was doing everything in a single thread on a single process. As you can imagine, reading all of this data this way takes a very long time. In order to speed this process up, I started using Python's thread pool feature. This made things much faster, but I found Pythons memory management cross-thread/process to be quite frustrating to deal with.

# Evaluating the results

At this point, I had crawled a handful of sites and had enough data to do some evaluations based on my original considerations.

## SQLite is solid

Outside of mistakes of my own making with the database, I never really ran into a case where SQLite was an insufficient choice. Eventually, I added support for Postgres as well, but that was mostly for hosting reasons later on. By the end, with the largest amount of data I had crawled, the biggest my database size got to was 260mb.

## This is a network-bound problem

Not so surprisingly, the biggest bottleneck in the end was network time. The amount of time spent waiting for HTTP responses was overwhelmingly larger than any processing time or database time.

## There might not have been enough variance in my testing

Most, if not all, of my crawling was on podcast websites. The limit diversity even more, almost all of these had been tech podcasts. As such, I found that the data was pretty similar. During this time, I didn't encounter a single SPA. I also did not find a single site that didn't support some form of compression.

## I was way off on the domains

Throughout my attempts, I encountered thousands of domains, not just hundreds of domains. That being said, Wikipedia was linked quite a few times, so maybe I get partial credit.

## Asset sizes

I had assumed that most sites, especially sites that are not SPAs, would try to limit the amount of JavaScript, HTML, and CSS used. What I ended up finding was what appeared to be quite the opposite to me. The average JavaScript used on the pages I crawled was nearly 1mb, and the average CSS was 150kb. Compare this with the average HTML size, which was only 12Kb. It really does seem like JavaScript has eaten the world and a large chunk of compute on consumer devices.

# Additional considerations

As I was going through this and expanding my crawls, I started to run into quite a few sites that have made crawling much harder. I assume this is largely due to AI crawlers. Also, much of the time, I couldn't help but notice that people are constantly visiting websites and processing this same data on their local hardware. This made me realize that if I were a browser vendor like Google with Chrome, I might be tempted to send "telemetry" data to help me build my index on someone else's hardware. Hopefully, none of the browsers do that, but I can understand the temptation.

# Moving on

If you made it this far, maybe you are invested enough to read more about my silly little project. The next topic I plan on writing about would be the admin app that I created using [Actix](https://actix.rs/) and [htmx](https://htmx.org/).
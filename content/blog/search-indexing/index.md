---
title: 'Indexing the web'
date: '2025-08-22'
---

# Indexing the web

The internet is full of interesting data you just have to go out and find it. Now most of us don't think much about that because we let companies with lots of money find the interesting data for us. This turns into companies like Microsoft, Google, Meta, and at one point in time Yahoo and AltaVista having a lot of indexed data and use that to play middleman to what we actually care about. Now I am sure most are probably aware of that but what does it actually take to build and maintain these indexes?

This became a decent part of what I spent my time doing when working on my little search project.

# Compiling assumptions

Often when going after projects like this one I start by setting up some assumptions. I like to see how far off my assumptions are from the ground truth.

Before listing the assumptions the following are some basic plans going into this project. I was going to write a web crawler. This web crawler was going to be written in Python. I chose Python I had used beautifulsoup4 in the past and found it rather efficient for parsing html documents. Then I would use SQLite to store the data because that would be the fastest option to bootstrap this.

Given that these are the assumptions I came up with when starting this project

* SQLite will be insufficient for the volume and scale of data.
* Most time will be spent waiting on HTTP responses.
* 5% or less of traffic I will encounter will be SPAs.
* The Average main asset (html file) will be between 15 and 50 kb.
* Initial attempt will miss many links because other linking strategies than anchor tags will be used.
* 99% of sites will have more than 1kb of Javascript.
* The Average size of css will exceed 3kb.
* The total execution time will be less than a day to start.
* The total db size will be over 1gb on disk (.db file).
* The total number of unique domains I will be between 100 and 500.
* The most linked site will be Wikipedia.
* 90% of all pages will use compression.

# Constraining the problem

Now I knew going into this that I was just going to run a python program on my local computer and I knew there was way too much data on the internet to possibly get a program to complete. Because of this I had to constrain the problem a bit. What I landed on was that I would point my crawler at a domain and then restrict the crawler activity to only that domain.

Since may of my assumptions had not been limited to html I also knew that I would have to consider all types of assets not just html pages.

One other thing I knew I would want to do would be to have different policies for different domains. These metrics by themselves are only interesting if you can get a couple different domains involved.

# Site selection

Now it was time to start writing some code and running some tests. Problem was I wasn't really sure what to crawl. I knew if I wanted diverse content I would want to crawl Wikipedia, but there was no way I was going to be able to crawl all of Wikipedia. Since I lack originality and spend a good amount of my time listening to podcasts about software, I figured that would be a good place to start.

A majority of the podcasts I listen to often have their own websites and I figured that would be a relatively smaller dataset. I eventually came to find out that not all podcasts are treated equally and some have a shocking amount of content. While I indexed a handful of sites in my testing I will primarily focus on my findings when indexing [the changelog](https://changelog.com/) and [oxide](https://oxide.computer/).

# And so the learning begins

To get started I figured I would focus on crawling the changelog, this ended up being a mistake. Going into this I didn't realize just how much content was on the changelog. I also didn't realize just how many different linking stragies they used and just how many domains the owned. Let's take a journey through all the dumb mistakes and self-inflicted challenges I had during this time.

## Href be crazy

Even if you just constrain links to href attributes on an anchor tag it turns out that one string has a ton of possibilites. Turns out if you get this wrong you might hit a bunch of dead links because you forgot that hrefs can be relative or absolute. Also you may forget that you can link to a different part of a page using an `#` in the link and either fail to process that page, or even worse process the same page a ton of times.

## Assets are hiding everywhere

Given the original assumptions I had in this there had been statements about things like total javascript used. Now one way to measure this would be to just look at the script tags with a source and measure those. However, that wouldn't be very accurate because javascript on a page might be coming from an external sourcce or embedded in the document itself. For example you could do a script tag with a body or with a src atribute. Likewise you have similar problems with css.

To deal with this you end up having to consider all sorts of fun ways that javascript and css can get loaded and used on a page.

Now this could have been the end but instead I started to think about the other supporting assets. What about the images, json files, xml files, and audio files? I might as well download an inspect those too right? In the end I think the only file types I didn't actively look for had been video files.


## You wanted that data compressed?

Just because a site supports compression doesn't mean you are going to get compressed content. One of the things I was noticing while looking at my data was that the bytes just didn't add up. I would go to a site in a browser and use the network inspector and come up with a completely different number than my crawler. For some reason my crawler had always downloaded more bytes. How could that be? Turns out that those http headers you often forgot about are very important and Python's default http client doesn't help you fall into the pit of success. It is on you to make sure you set that `Accept-Encoding` header and also handle any encodings you claim to handle. From what I have seen the most popular types of encoding are `brotli` and `gzip` so I added support for those and the numbers started tying out.

# Did I forget to mention performance

What I have neglected to tell you is that through all of these learnings my crawler was crashing after very long runs. You know how I mentioned the dataset was large, well that large dataset was causing me to crash a lot but very slowly. I would start up a run, do something else and come back to a crashed app hours later. Then I would have to play detective to see what went wrong. Most of the time it was silly design decisions I made.

## Hammering the database

While this did not end up being a substancial issue I quickly found out that when you are constantly writing and reading to a SQLite database you can get a bit further by just using some in memory caches on previously executed urls. In these sort of crawl patterns you will often end up finding links back to sites you have already processed.

## Massive columns are bad

I knew this was a bad idea going into the first database design, I just didn't know how bad. In the first version of the database schema I dumped the entire site html into a single column as a raw string. No compression no special treatment. This was causing me to get databases as big as 3GB before crashing. Doing the sensible thing and saving that content to a file and having a column that stored the file path made a massive diffrence.

## Batch your writes dummy

TODO Comment about making larger commits

## Absurd memory usage

TODO write about how I was crashing with OOM

# Notes

## Crawler execution notes

* First run failed and took a very long time. End db size when program died was 750mb and average processing time was close to 3 seconds
* Second run cached seen urls in application memory. This allowed me to get a db size of 2.5 GB before the application died. This got processing down to about 2 seconds.
* Third run I moved html content into adjacent folder structure. Eventually I killed the app due to an obvious logic error (I was downloading too much). This ended up going way faster with app time being close to 1 second per page and the end db size was 4.9mb
* Tested a couple times with a smaller dataset (oxide.computer) during this I found that a lot of time was on db commits. Moved to larger commits and cut time in half for smaller dataset
* Retested with less commits and found that memory hit 30gb RAM. Clearly there is a memory leak. At first I found an issue with how I was using openurl but then I found that this problem leads to larger and larger memory growth as more pages are loaded in larger batches. Attempting to pop instead of foreach this passed but took 4 days to finish on changelog
* Made a change to download js and css in parallel saw a massive improvement
* Threading in python is kind of a pain makes me miss non-blocking IO
* As time is going on I am realizing the depth of this area is increasing
	* If you really want to download most/all things you need to consider more than just html,js and css. There are also data (json, xml, etc), audio, video, image and font files. Also almost all of these files could have more links embedded in them
	* Favicons are something I do not think about much but apparently you can target different browsing experiences with different attributes (size, type, media)
	* In order to handle all of this different data I ended up having to do a massive refactor
		* This refactor ended up slowing things down quite a bit because it would basically load every asset all the time. I still need to find a way to make this faster.
		* This appears to be in an endless cycle look at this tomorrow/another time
* I am not sure if this is issues with the sites I am crawling or if this is increasing restrictions on the web because of things like chatgpt but I am getting a lot of 403s

## Changelog dataset notes

* Final db size was 260.7mb
* 7687 unique domains found (maybe this is wrong?)
* 46780 pages/links had been found
* perf db had 784790 entries due to many duplications?
* In general network look longer than processing time
* took 368993.8601837158 ms to finish
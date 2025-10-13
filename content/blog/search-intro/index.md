---
title: 'Journey into search'
date: '2025-08-14'
---

# Falling down the rabbit hole
When I started all of this madness, I had two very simple goals in mind. First, I was going to start using a terminal-based editor. The second was that I was going to crawl a couple of pages and measure the time it took. Now, some two years later, I have a small three service system that can be run locally or in AWS. It turns out that once you start crawling the web, you are reminded that the [Memex](https://en.wikipedia.org/wiki/Memex) is vast and there are links in every content type imaginable. Also, you start to realize that you end up with a fair amount of semi-structured data that can be fun to play around with.

# A warning to the reader

At this point, I find it relevant to warn the reader that I am not an expert in search engines or crawlers. I am just some dude playing around, having a good time, and sharing my findings.

# Original scope

As I mentioned before, my original scope for this "little" project was to create a web crawler. This crawler was going to take an entry point and restrict its crawling to a single domain. While doing that, I would collect the time it took to load the assets from the network and parse those assets using [beautifulsoup4](https://pypi.org/project/beautifulsoup4/).

Also, since I don't use Python a whole lot, it was going to be a chance to dig a little deeper on something I touch every once in a while.

Since I knew what I was going to collect, I took a bit of time before writing any code and made some assumptions about what I might find. I will go over these assumptions and how the crawler evolved in a later blog post.

# And so the scope expands

Once I had run a couple of tests and built up a small index or two of the websites I was interested in, I hit my first scope expansion. I decided it would be nice to save a couple of the queries I was running into an admin style web app that would show a handful of specific performance metrics I cared about.

Now I could have done something sensible and written this application in something I was familiar with, but instead I decided to do something completely different. There was this semi-new quasi-front-end framework that had recently hit the spotlight, and I wanted to check it out. Apparently, picking up htmx wasn't enough; no, I had to go all out and write my backend in Rust.

Now with this new found admin app in hand, I started to find other things I wanted. I started to consider things like, "wouldn't it be nice if I controlled what kinds of assets get downloaded?", and "I really should be able to crawl and manage multiple domains". This led to a slew of features to control the crawler.

# But hold on, what about UX?

Armed with data and hours of playing around with crawlers, I decided it was time to do something else. Those more inclined by profits might suggest figuring out how to train a neural network, but apparently, that is not for me. You see, I prefer the simpler things in life. Things like visualizing data into a planetary map.

I was about to set out to build an interactive canvas that would visualize a search as a collection of solar entities and make those different sizes based on the entities' perceived importance. This led me to realize that I needed to change my crawler again. I ended up taking another detour back into the crawler to build some edges between URLs and stored those in an edge table. Then, since the new goal was to compare the importance of the URLs, I took another side quest to learn how to implement a crude version of PageRank.

Now that my crawler and database finally matched my aspirations, I could finally set out on building this interactive canvas. In this process, I was reminded that there are a lot of things you learn to take for granted when doing UI in a framework of any kind. All of this I hope to cover in yet another blog post.

# Why not just try a typical search page?

Around this time, I started to think, why not just build a typical search page? I have some data, and there is no way it will be as hard as building an interactive canvas. So I pulled back out my htmx and rust and got back to work.

As is the theme with this whole adventure, I decide well, that is good and fine, but maybe I should add a twist. Since the fascination I was finding was with how data was connected and general metadata, I decided it would be neat to interpret some of this data. In this search page, I would have additional options to see what the page links to and general information about the web primitives the page used without visting it.

This, of course, lead to figuring out how to parse html, javascript, and css in rust. Which, as you can imagine, was another adventure.

# What more could you possibly want to do?

Now with three services and two different UI's it was time to make the finishing touch, deploying the thing. Once again, this came with its own set of challenges, most of which came from my choice to use rust.

After cutting my teeth for a while, mucking with cdk and rewriting parts of my service to optionally use s3 as a storage layer, I finally had something that could be deployed by anyone brave enough to take a stranger's CDK project and deploy it into their own AWS account.

# Still ideas persist

Admittedly, I do not know what it was about this project that became so consuming. Many times, while I was working on this, I would think of something new I wanted to learn about, but I wouldn't be able to pull myself to do that until I "finished" whatever this was becoming.

What is maybe even more shocking for me is that I still have a long list of things I didn't yet do that I would potentially like to one day do. These are some of the things I have still been fighting the urge to act on.

## Vector search

Currently, the search behavior of my site is pretty primitive and rather crappy. While apparently no one uses search anymore, those who do expect a certain amount of flexibility in their textual query. As I understand, most deal with this by using a vector search approach. This being done by generating embeddings on the content and the user input, then you follow that up with some sweet cosine similarity magic and use that to pop out better results.

## Robots.txt

I suspect I should feel some shame that my crawler does not respect robots.txt. However, I take solice in the fact that I am not running an entire datacenter of crawl compute and network IO. That being said, it would be nice for my crawler to be a better actor in the crawling space.

## Why not a shared library?

While I have no good reason to do it, I have considered making parts of my crawler a shareable Python module. I don't really think the world needs yet another crawler, but it would be a nice opportunity to refactor some of my code.

## Sub Indexes

One concept I had considered was the idea of being able to have sub-indices of the main index. Since I have no interest in gathering user data to create more relevant queries, the use of different indexes could fill that void. These indexes would be a way for users of the system to define a more constrained index, so they would just be searching the things they care about. This would be done by having the user choose to either blacklist or whitelist domains of interest to them. These indices could then be shared between users of the system.

## Snow Crash Librarian

In the novel [Snow Crash](https://en.wikipedia.org/wiki/Snow_Crash), there was an interesting bit in which the main protagonist started working with a piece of software called the librarian. This software would find information for the protagonist and summarize the information he has gathered. While not a profound realization, I realize that now with modern LLMs, you could create something quite similar. This would be done by first doing a search query to "gather pages". Then you could present this in a UI and have an interface with an LLM summarize the search results in an interactive dialog.

# What's next?

While I am not sure if I will continue to let this project take up my free time, I do plan on at least wrapping up part of what I set out to do. That being write a series of blog posts about the lessons I have learned along the way. This will start with a blog about crawling the web and building an index. After that, I am considering writing about the following topics
* htmx and actix
* page rank
* using a 2d canvas

If any of the additional ideas end up getting done, I may very well write about those topics as well. If any of this work sounds interesting, feel free to [check out the code on Github](https://github.com/JeffreyRiggle/caribou). Alternatively, if you just want to see what I have built for the time being, I am [hosting it here](http://caribou.ilusr.com/). I make no guarantees for how long I will keep it up. Also, the index will mostly be based on random software engineering podcasts and other similar resources.
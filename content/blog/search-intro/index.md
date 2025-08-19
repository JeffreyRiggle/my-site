---
title: 'Journey into search'
date: '2025-08-14'
---

# Falling down the rabbithole
When I started all of this maddness I had two very simple goals in mind. First I was going to start using a terminal based editor. The second was I was going to crawl a couple of pages and measure the time it look. Now some two years later I have a small three service system that can be run locally or in AWS. It turns out once you start crawling the web you are reminded that the [Memex](https://en.wikipedia.org/wiki/Memex) is vast and there are links in every content type imaginable. Also you start to realize that you end up with a fair amount of semi-structured data that can be fun to play around with.

# A warning to the reader

At this point I find it relevant to warn the reader that I am not an expert in search engines or crawlers. I am just some dude playing around having a good time and sharing my findings.

# Original scope

As I mentioned before my original scope for this "little" project was to create a web crawler. This crawler was going to take some entry point and restrict its crawling to a single domain. While doing that I would collect the time it took to load the assets from the network and parse those assests using beautiful soup.

Also since I don't use Python a whole lot it was going to be a chance to dig a little deeper on something I touch every once in a while.

Since I knew what I was going to collect, I took a bit of time before writing any code and made some assumptions about what I might find. I will go over these assumptions and how the crawler evolved in a later blog post.

# And so the scope expands

Once I had run a couple tests and built up a small index or two of the websites I was interested in I hit my first scope expansion. I decided it would be nice to save a couple of the queries I was running into a admin style web app that would show a handful of specific performance metrics I cared about.

Now I could have done something sensible and written this application in something I was familiar with, but instead I decided to do something completely different. There was this semi-new quasi-front-end framework that had recently hit the spotlight and I wanted to check it out. Also just picking up htmx wasn't enough, no, I had to go all out and write my backend in rust.

Now with this new found admin app in hand I started to find other things I wanted. I started to consider things like, "wouldn't it be nice if I controlled what kinds of assets get downloaded?", and "I really should be able to crawl and manage multiple domains". This lead to a slew of features to control the crawler.

# But hold on what about UX?

Armed with data and hours of playing around with crawlers, I decided it was time to do something else. Those more inclinded by profits might suggest figuring out how to train a nerual network, but apparently that is not for me. You see I prefer the simpler things in life. Things like visualizing data into a planetary map.

I was about to set out to built a interactive canvas that would visualize a search as a collection of solar entities and make those different sizes based on the entities precieved importance. This lead me to realize that I needed to change my crawler again. I ended up taking another detour back into the crawler to build some edges between URLs and store those in an edge table. Then since the new goal was to rank the URLs I took another side quest to learn how to implement a crude version of page rank.

Now that my crawler and database finally matched my asparations, I could finally set out on building this interactive canvas. In this process I was reminded that there are a lot of things you learn to take for granted when doing UI in a framework of any kind. All of this I hope to cover in yet another blog post.

# Why not just try a typical search page

Around this time I started to think, why not just build a typical search page. I have some data and there is no way it will be as hard as building an interactive canvas. So I pull back out my htmx and rust and get back to work.

As is the theme with this whole adventure, I decide well that is good and fine but maybe I should add a twist. Since the facination I was finding was with how data was connected and general metadata, I decided it would be neat to interpret some of this data. In this search page, I would have additional options to see what the page linked and general information about the web primitives the page used without visting it.

This of course lead to figuring out how to parse html, javascript, and css in rust. Which as you can imagine was another adventure.

# What more could you possibly want to do?
TODO Talk about deploying to AWS

# Still ideas persist
TODO talk about all the ideas that still haven't been able to be implemented
* vector search
* robots.txt
* shared library
* 3d visulization
* snow crash librarian
* Sub indexes

# Whats next?
* Link to project
* Link to hosted site
* Talk about upcoming blog posts
    * crawler
    * htmx and actix
    * page rank
    * canvas
    * Vector search (maybe)
    * robots.txt (maybe)
    * User indexes (maybe)

# Notes

* This is an intro to a series of posts I plan on creating
* Warning I am not an expert in search engines or index building
* My intention was to do something while playing around with neovim but I went over the deepend
* Original scope for this was just to crawl a couple domains and record stats
* Expanded scope included a search engine and an interactive canvas
* Provide overview of project in its current state
* list things that could be better
    * vector search
    * robots.txt
    * better crawler design
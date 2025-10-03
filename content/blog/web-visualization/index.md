---
title: 'Web visualization'
date: '2025-09-27'
---

# Visualizing the web

So now we come to the end of our planned journey. If you have been following along so far here is a quick recap. What started off as a plan to work on a small project in neovim ended with me doing all sorts of extra work. I have covered how I build a web crawler, an administrative application, and a PageRank implementation. With all of this work we can look at the final visualization work I did.

For this final stage I did a mostly standard search based UI and another one that was a bit more interactive with some visualizations.

## Basic search

Just to do some basic testing I pulled back out Rust and HTMX to build out a basic search page. This is a very simplied version of what you might have seen from Google, Yahoo!, or Bing. However I decided to do one thing a bit differently. In this search page I added some extra details.

### With an insepection twist

While working with a crawler I found that how pages connect to other pages and assets became an interest of mine. Due to this I added a feature to see all links in a sidebar for a given page.

Another feature that I decided to create was an inspection of the page. I was already downloading all of the HTML, Javascript and CSS, so I figured it would be neat to see what I could pull out of those assets. 

For CSS, I started off by getting all links I could find in the documents. Then I decided to get a list of all of the classes, ids and selectors used. I also decided to find all css functions that had been used.

In the case of Javascript, I decided to look for all properties and functions that had been used on the window and document. I also decided to look at every string that was defined because usually those strings contain URLs.

For HTML files, I of course started off by grabbing all links. Then I pulled in all node types, attributes, ids and classes used. Finally, I finished off by processing all inline Javascript and CSS using the rules above.

This work did require a bit of additional parsing in Rust. My prior experience with [ASTs](https://en.wikipedia.org/wiki/Abstract_syntax_tree) and [vistor patterns](https://en.wikipedia.org/wiki/Visitor_pattern) made this relatively easy to pick up on.

## Interactive search

For the interactive search feature, I decided I would try something rather different. Originally I wanted to create a large graph of all of the pages and their connections. However, I also really wanted to show how PageRank impacts the importance of pages. I didn't really think that would highlight the importance as much as I wanted. So after some more consideration I landed on a visualization that was a collection of stars. Each star was the result from a search and each star would have a size relative to its page rank. 

Soon after I got that working I decided to do a couple of screen transitions. When you clicked on a star you could explore the star. Exploring the star would switch to a different view that would instead show that search result as the center of a solar system. This solar system would be made up of all of the pages it linked to. On that page, you could either follow a planet and see its links or you could explore the planet. If you explored the planet you would see all of the assets the page used and the relative footprint of the asset on the page. For example if a page had 10 images each 10kb in size and one Javascript file 1MB in size you would see 11 elements with the Javascript one being larger than the others.

### Tooling for visualization

While I kept the Rust backend around I completely droppped HTMX to pull this off. Instead I did all of this visualization by drawing to a 2d canvas. Now when I say I drew to a 2d canvas I mean I did this only using the native browser API with no library on top of it. I decided to forego the use of any build step for this page. Instead I just used the esm import style of the document. I found that it was very nice to get the benefit of multiple javascript files and ESM import styles without needing a build step or any javascript libraries.

### Building on canvas is different

When you start drawing directly on a canvas and building interactive features manually after doing typical web development you start to see things other developers already know. I am sure most developers working on games, browsers, or operating systems already know everything I found well and far better than I do.

#### Elements and Controls are an abstraction

You don't need html elements or common controls for interactivity. While you get a lot of benefits like accessibility for using the DOM correctly you don't actually need a button element to make a button. Instead you could draw a rectange and put some text in the center. Then you can watch the mouse events and determine if the mouse is hovering over the element, or pressing the element. In these cases you can just draw a different state in the button.

#### Behaviors require consideration

I somewhat mentioned this before but just doing a hover or a click requires careful consideration of the current mouse position and state. The more complex the shape gets the harder it is to determine if the mouse is within the element. Also simple seeming concepts like word wrapping or truncation require careful measuring of the text and the size of its container. Most web developers take all of this for granted. You can easily apply css rules and not even think twice about what needed to be done to make hover trigger correctly on both a square and cirular button.

#### Trigonometry is everywhere

While it could have been my application of the canvas, I found that I was constantly having to write code that would have to use some trigonometry. I kept finding cases where I would have to plot some visualization along some arc. I would constantly find myself pulling out trigonometry to pull off certain visualiation effects.

After spending so much time doing traditional web development it is easy to forget just how much math is done in the layers of abstraction you are building on.

### Reflecting on the process

I found this to be radically different from what I had been doing for so long and had a blast doing it. I never quite got the effect I wanted to. One aspect of this was that I didn't really have good images for the stars or the planets. I think with some better images or spritesheets I could get a much better effect. I also didn't really consider adding the apsect of a camera with a viewpoint. I think adding this element would have allowed for some more interesting searching experiences when looking at some of the scenes.

That being said while I had a lot of fun doing it I don't know that I would ever do it for a commercial grade project. While I learned a lot using semantic HTML gives tons of benefits. The most notable being accessibility. I do not even being to pretend to know how you could make a site that only uses a canvas usable for someone who couldn't see.

## And so it ends

If you have read this blog and all the blogs before it thank you. While I do not know if I have provided any additional insights for anyone who may have read this, I found that some of what I was doing was a touch out of the norm. I had a lot of fun doing this but there are other things I have been wanting to explore for some time now. I do not know how long this project will be hosted as such I will finish off with some images of this in case I take down the site due to cost, lack of interest, or something else.

**Basic Search**
![Basic Search View](./standard-search.png)

**Interactive Search**
![Interactive Search View](./graph-view.gif)
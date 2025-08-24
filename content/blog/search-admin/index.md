---
title: 'Build admin site for crawler'
date: '2025-08-24'
---

# So you want an intro?



# Notes
## Rust/Actix notes
* parsing css took me longer than I thought it would
* parsing javascript was pretty hard at first. Finding good examples was exceedingly hard and chatgpt failed to generate good examples
* I really struggle to read rust docs
* Once I got used to it I was really enjoying the match pattern
* I think there is a secret art to reading rust documentation that I haven't quite figured out yet
* Really think the proper use of error handling is evading me. I can tell using unwrap is a bad thing but I keep doing it, this is probably a common noob mistake.
* Somewhat annoyingly to make simple html changes I need to restart the server because Tera seems to cache templates https://github.com/rwf2/Rocket/issues/163
* Traits are really cool once you can figure them out
* There are a ton of crates out there and relying on them too much might make you think rust can do less than it really can. In my case I needed to get actix to use either postgres or sqlite based on environment variables. This seemed impossible with r2d2 (connection pooling library) and postgres_r2d2. Instead I have to write my own r2d2 implementation which worked out great.
* Tera has its own learning curve. For a while it felt like I was doing some basic templating with js possibilities until I encountered the length function. I wanted to see the length of an array and had to find that `| length` was the way to do it instead of `.length`
* Still haven't found a good way to template in tera. In my case I ended up repeating a large portion of content for javascript and css details
* Getting a docker container running for actix was a bit of a nightmare. I am not sure if I am just terrible at docker, if rust does not lead itself well to docker or if actix is the problem
	* This was a mix of me not knowing and there not being great documentation for this online. In the end I didn't realize that you could have multiple FROM statements in a single docker file mixed with the fact that you cannot access sibling folders without changing the docker context. Example `COPY ../foo /usr/src/foo` will fail

## HTMX Notes
Recently I started playing around with htmx for the admin site I am working on for Caribou. This technology attempts to fill in the gaps with hypermedia to allow for richer web experiences without a ton of javascript needed. I suspect if it succeeds it will become a web standard much like jQuery did. Related site https://htmx.org.

* All functionality is controlled with html attributes prefixed with hx
* API server is expected to take in form type data and respond with html
* JSON bodies can be sent to the API using an extension `hx-ext="json-enc"`
* Setting custom css based loading effect was harder than expected but I was able to get what I was going for by using `has()`
* Doing something like a GET with a query parameter based on an input seems exceedingly hard and a solution is not documented well. This ended up being easy to do but hard for me to figure out.
* Interesting browser spec quirks became very noticeable. For instance I wanted to do a put with a form body containing a single field "download". In this case on the DOM I used a checkbox and applied a name "download". When disabling the checkbox it is standard to send an empty event per the browser spec. This caused the htmx abstraction to send a completely empty body on put when disabling a feature. To get around this is Just had to do a select with a yes and no (not ideal)
* Turns out I struggle with the basics of web 1. That is to say I have been doing web 2 with SPA so long that I am forgetting the basics of forms etc. Doing this the web 1 way requires a lot more convention but results in a lot less authored code (specifically javascript)

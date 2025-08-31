---
title: 'Build admin site for crawler'
date: '2025-08-24'
---

# So you want an intro?

If you have been following along by now you know that I have been working on a bit of a search project and have covered what it took to make a crawler. If you are interested in that go ahead and stop now and read the "Indexing the web" blog post.

# Building an admin app

So by now I had build a python script that would crawl the web and put some data into a SQLite database. The problem was the amount of command line arguments was growing. Also I was often modifying the database directly inbetween runs.

To deal with this I setteled on creating a very basic administrative style application. This application would handle setting the domain policy, setting the download policy, and it would show some insights on the data crawled so far. Eventually this was extended to trigger runs of the crawling script. Since I have no plans of writing much about that, what ended up happening there was a minor refactor to the python script to also run as a [flask](https://flask.palletsprojects.com/en/stable/) application that allowed you to trigger and view pervious runs of the crawler.

Now as was the theme with this project I wanted to learn something new. I could have done something comfortable and build this web application in a front-end framework I use often like React or Angular. However, instead of doing that I decided it was time to give HTMX a go. Also on the back-end I could have done the same using something like Node.js, Java, or dotnet core, but instead I decided to pick up Rust again.

# Picking a front-end framework

One thing I was paying close attention to while working on this project was the amount of JavaScript that was on the web. I knew for a very boring administrative app with no major features there would be no reason to have a lot of JavaScript as the amount of interactive features would be low. I also have noticed that even "libraries", because some might get angry if I call it a framework, like React, seem to be growing in bundle size without end.

## The sales pitch

I had heard the pitch for HTMX in the past, the following is a quick summary as best as I could remember it. Back before AJAX and web 2.0 we got along just fine. There was just one problem, fetching net new data required a full page load. To deal with this a lot of work was done to optimize performance by effectively mangaging DNS, HTTP headers, and document size. After web 2.0 we had a new shiny tool for handling this and we used it for everything. Along the way we lost sight of what hypertext media should have been. Basically we started off strong with the anchor, and form tags but hypertext media failed to deliver more features. The web didn't have to be this way so the creators of HTMX set out to make hypertext media what it should have been. Somewhat paradoxically they did this by creating a JavaScript library. One might hope if their project is successful that the hypertext media primatives that HTMX attempts to establish just becomes part of the browser implementation.

## But what the heck does that even mean?

So apparently web 1.0 and hypertext media are a good thing, but what does it mean to expand that feature set? I would summarize it as making better use of DOM attributes to control document behavior. Outside of loading a JavaScript file most of what HTMX does is add new special attributes to DOM nodes. All of these attributes are prefixed with `hx-`. The types of things that these new attributes allow you to do are attach behaviors to DOM nodes. For example, you might want to say, when a user clicks a button, make a GET request and put the body in some other area. In a framework like Angular this might look something like this

```javascript
@Component({
   'selector': 'my-super-cool-search',
   'template': `
       <input type="text" [(ngModel])="searchText" [keyup.enter]="doSearch()" />
       <div>
         Resulting data: {{randomData()}}
       </div>
    `
})
export class MySuperCoolComponent {
    private httpClient: HttpClient = inject(HttpClient);
    public randomData = signal<string[]>();

    public searchText = signal<string>();

    public doSearch() {
        this.httpClient.get(`/api/so-cool/search?q={this.searchText()}`).subscribe(res => this.randomData.set(res));
    }
}
```

What we will notice is that is just a small subset of the total code required to make this happen. There is a whole lot of setup and other components that may be required just to be able to use this component. Also a compile step is required to do this very simple task. In the realm of HTMX this might instead look something like this.

```html
<html>
  <body>
    <input type="text" hx-get="search" name="q" hx-trigger="keyup[key=='Enter']" hx-target="#result-area" hx-swap="innerHtml" />
    <div id="result-area"></div>
    <script src="path/to/htmx.min.js"></script>
  </body>
</html>
```

As you can see using HTMX basically makes all the JavaScript disappear and gets rid of a build setup. The downside is it comes with the requirement that you learn a new set of attributes and their behavior. The one thing here that took me a while to fully come to terms with was the target and swap. The target is the DOM node that will be impacted by some action and the swap is what will change. So in this case when you press enter you set the innerHtml of the result-area div with the contents from the API call. 

## But doesn't that change my back-end?

It is true that a front-end that uses HTMX is not a rip and replace framework. HTMX works a lot like how JSP, and Ruby on Rails work. JSON is dead an HTML is back. This means that in order to effectively use HTMX you will either have to write your application with this in mind or create some sort of proxy API server or translation layer on your existing back-end.

I would argue that this comes with some benefits and some drawbacks. The benefit is in some ways debugging the DOM gets a bit easier. No longer will you have to look at how the mess of JavaScript you have created to understand how it converts JSON into DOM nodes. On top of this HTTP headers around cache control can be even more impactful. On the drawback side, one thing that JSON did was make it easier to have multiple clients for the same API. Going all in on HTML as a transport can impact non-web clients, for example a mobile application that uses native rendering.

## There are some weird things in the browser specification

One of HTMX's greatest strenghts is also one of its weaknesses. One thing modern frameworks do very well is paper over some of the rough edges of the browser specification. While the browser specification is getting better, there are still some rough areas in there. In my case, the one that threw me for a loop was posting a form with a checkbox in it. As it turns out, I am not the only person that encountered this issue and there is an issue that documents it well in HTMX [here](https://github.com/bigskysoftware/htmx/issues/894).

# Jumping over to the back-end

I have used Rust in the past for a couple of things, but I have never used it for a web server. While I know it is often considered the "systems programming language" I figured there had to be a few more people out there that wanted to use it for a web server. After doing a bit of research I stumbled on [Actix](https://actix.rs/) which appears to be a popular Rust framework for doing web development.

## But why Rust?

As will always be the theme with this project, it was to learn more. While it is true I had used Rust in the past, it was never for anything of substancial scale. Since all of the previous uses I had for it had been so small, I hadn't got the opperturnity to learn as much about it as I wanted. Also strangely while it can be a rather infurriating language work work with I do quite enjoy using it.

## Doubling up on front-end frameworks

To say I was just using HTMX is a bit of a lie. On the back-end I was also using the rendering framework [tera](https://keats.github.io/tera/docs/) to do some basic html templating before sending the html off to the client. Tera is a Jinja2 and Django compliant templating framework. In hindsight I am not sure that I really needed this framework as my template substitutions had been so small.

One issue I ran into pretty early on was that my [templates had been cached](https://github.com/rwf2/Rocket/issues/163). Turns out when using tera you have to restart your server everytime you make a change to any html template. This caused the turn around time to debug issues to be longer than I have been accustom to. Also since I had never really used Django I found myself struggling with some of the syntax and concepts. For example checking the length of an array being `| length` was something that took me some time to figure out.

## Crates, crates everywhere

Package managers are a blessing and a curse. What I found is that Rust in some ways has the same issue as Node.js. Since there is a module system and its very easy to use, there are a ton of modules of varying degress of quality. Also because there are so many modules you can kind of cheat on learning the language by cobbling together a ton of modules that solve the hard problems. I used quite a few modules on this project and I don't think I could have done it all without some of them. That being said, I do think I would learn even more about the language if I would try to further limit my crate usage in the future.

## Documentation is hard

I am not sure if this is a personal issue or if this is a general issue in Rust. In other languages I have been pretty easily able to understand a majority of the concepts a package provides just by reading the documentation. Yes, I would inevitably pull open the source to understand a few things but that was rare. However, in Rust, I constantly found myself looking at the documentation, getting confused, trying something out, reading the documentation again, just to ultimately end up looking at the source code to figure out what the heck is going on.

I am not sure if others in Rust have found the same thing or if I just haven't figure out the art of reading the Rust documentation sites. An alternative possibility is that I do not have enough experience in the ecosystem to know that I am choosing some questionable crates. Regardless of the reason this was, this was the single thing that I found to be the hardest about working in Rust.

## Now what about docker?

Towards the later stages of what I was working on I found it a bit annoying to have to start three apps and maintain them locally. Because of this I switched over to using docker-compose to run my applications. However, in order to use docker compose you have to put your applications in a docker container. Doing this took a bit more time that I was used to. In many cases I would just extend from some base language specific image like Go, or Python and layer on the stuff I needed. In the case of Rust I found this harder to do. In the end, I had to use two FROM statements which I didn't even realize was an option. The first from would pull a rust builder and build the asset. In the second from it would actually create the final image with the runtime and the program.

# Looking forward

By this point we have created a functional crawler in Python and an app to administer it using HTMX and Actix. This is a good start but at this point there is nothing to really play with. All of the data is in tables on a database and there are no searching or visualization methods for this data. While we could talk about that next we are going to take a breif detour to talk about page rank in the next post.

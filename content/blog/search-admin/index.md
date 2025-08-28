---
title: 'Build admin site for crawler'
date: '2025-08-24'
---

# So you want an intro?

If you have been following along by now you know that I have been working on a bit of a search project and have covered what it took to make a crawler. If you are interested in that go ahead and stop now and read the "Indexing the web" blog post.

# Building an admin app

So by now I had build a python script that would crawl the web and put some data into a SQLite database. The problem was the amount of command line arguments was growing. Alos I was often modifying the database directly like some sort of monster in between runs.

To deal with this I setteled on creating a very basic administrative style application. This application would handle setting the domain policy, setting the download policy, and show some insights on the data crawled so far. Eventually this was hooked up to trigger runs of the crawling script. Since I have no plans of writing much about that, what ended up happening there was a minor refactor to the python script to a flask application that allowed you to trigger and view pervious runs of the crawler.

Now as was the theme with this project I wanted to learn something new. I could have done something comfortable and build this web application in a front-end framework I used often like React or Angular. Instead of doing that I decided it was time to give HTMX a go. Also on the back-end I could have done the same using something like Node.js, Java, or dotnet core, but instead I decided to pick up Rust again.

# Picking a front-end framework

Now as was the theme with this project I wanted to learn something new. I could have done something comfortable and build this web application in a front-end framework I used often like React or Angular. Instead of doing that I decided it was time to give HTMX a go. 

One thing I was paying close attention to in this project was the amount of JavaScript that was on the web. I knew for a very boring administrative app with no major features there would be no reason to have a lot of JavaScript as the amount of interactive features would be low. I also have noticed that even "libraries", because some might get angry if I call it a framework, like React, seem to be growing in bundle size without end.

## The sales pitch

Now I had heard the pitch for HTMX in the past, the following is a quick summary as best as I could remember it. Back before AJAX and web 2.0 we got along just fine, there was just one problem fetching net new data required a full page load. To deal with this a lot of work was done to optimize performance by effectively mangaging DNS, HTTP headers, and document size. After web 2.0 we had a new shiny tool for handling this and we used it for everything. Along the way we lost sight of what hypertext media should have been. Basically we started off strong with the anchor, and form tags but hypertext media failed to deliver more features. The web didn't have to be this way so the creators of HTMX set out to make hypertext media what it should have been. They did this of course by creating a JavaScript library. Now one might hope if their project is successful that the hypertext media primatives that HTMX attempts to establish just becomes part of the browser implementation.

## But what the heck does that even mean?

So apparently web 1.0 and hypertext media are a good thing but what does it mean to expand that feature set? I would summarize it as making better use of DOM attributes to control document behavior. Basically outside of loading a JavaScript file most of what HTMX does is add new special attributes to DOM nodes. All of these attributes are prefixed with `hx-`. Now the types of things that these new attributes allow you to do are attach behaviors to DOM nodes. For example you might want to say, when a user clicks a button, make a GET request and put the body in some other area. In a framework like Angular this might look something like this

```javascript
@Component({
   'selector': 'my-super-cool-search',
   'template': `
       <input type="text" [(ngModel])="searchText" />
       <button (click)="doSearch()">Search</button>
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
        this.httpClient.get(`/api/so-cool/search?q={this.searchText()}`).subscribe(res => this.randomData.set(res);
    }
}
```

Now that is a lot of code and a compile step to do a very simple task. In the realm of HTMX this might instead look something like this.

```html
<html>
  <body>
    <!-- TODO this needs to be updated to use a button -->
    <input type="text hx-get="search" name="q" hx-target="#result-area" hx-swap="innerHtml" />
    <div id="result-area"></div>
    <script src="path/to/htmx.min.js"></script>
  </body>
</html>
```

As you can see using HTMX basically makes all the JavaScript disappear and gets rid of a build setup, but it comes with the requirement that you learn a new set of attributes and their behavior. The one thing here that took me a while to fully come to terms with was the target and swap. Basically the target is the DOM node that will be impacted by some action and the swap is what will change. So in this case when you press the button you set the innerHtml of the result-area div with the contents from the API call. 

## But doesn't that change my back-end?

It is true that a front-end that uses HTMX is not a rip and replace framework. HTMX works a lot like how ASP.Net, JSP, and Ruby on Rails work. Basically JSON is dead an HTML is back. This means that in order to effectively use HTMX you will either have to write your application with this in mind or create some sort of proxy API server or translation layer on your existing back-end.

I would argue that this comes with some benefits and some drawbacks. The benefit is in some ways debugging the DOM gets a bit easier, you don't have to look at how the mess of JavaScript you have probably created converts JSON into DOM nodes. On top of this HTTP headers around cache control can be even more impactful. On the drawback side one thing that JSON did was make it easier to have multiple clients for the same API. Going all in on HTML as a transport can impact non-web clients, for example a mobile application that uses native rendering.

## There are some weird things in the browser spec

One of HTMX's greatest strenghts is also one of its weaknesses for developers that have been using modern frameworks for quite some time now. One thing modern frameworks do very well is paper over some of the rough edges of the browser spec. While the browser spec is getting better there are still some rough areas in there. In my case the one that really threw me for a loop was posting a form with a checkbox in it. As it turns out I am not the only person that encountered this issue and there is an issue that documents it well in HTMX [here](https://github.com/bigskysoftware/htmx/issues/894).

# Picking a back-end framework
Also on the back-end I could have done the same using something like Node.js, Java, or dotnet core, but instead I decided to pick up Rust again.
TODO talk about Actix at a high level

# Lessons learned

TODO go over the things I learned


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

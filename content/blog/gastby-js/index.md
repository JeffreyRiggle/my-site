---
title: 'Using Gatsbyjs'
date: '2019-07-15'
---

## The idea
Recently I decided it was time to make my own personal website. You might be on this site right now. I knew to go into this that I was going to want to make a `static` site of some sort but I was not sure what I would settle on.


## The requirements
I wanted this site to combine data about all the little projects I work on in my free time into a site. I also wanted to get this data as dynamically as possible so that when I made changes in github I would have to do very little to update this site.


## First attempt
Initially, I thought I would just cobble together some kind of nodejs application that takes data from multiple sources and transform data and markdown files into html files. However, I quickly found that doing this was leading to difficult to maintain spaghetti code. At this point, I was starting to realize that maybe a framework would help me accomplish my goals.


## After a bit of research
After some research, I found a couple of different frameworks that might help. During this period I looked at [jekyll](https://jekyllrb.com/), [Eleventy](https://www.11ty.io/), and [Gatsby](https://www.gatsbyjs.org/).


### Jekyll
From what I was able to gather this has been around for a while, is stable and has been used by quite a few. To be fair I did not give this an honest try. While I know ruby I prefer to avoid using it where I can.


### Eleventy
This seemed similar to Jekyll but build on nodejs instead. While I gave this an initial try the big hang-up I had was is was pretty hard to get sources from github and get them into a format that worked. It required a lot of manual pulling of files and attempting transforms on existing markdown files. While I found this to be an interesting choice, the process just didn't work well enough for my use case.


### Gasbyjs
As you might be able to tell by the title of this post, this is the framework I eventually landed on. It seemed like Gatsby was built to handle the type of issue I was trying to solve, combining data from multiple sources into components. It also helped that it has a setup that feels like a rather modern web development experience. These are the major reasons I ended up sticking with this choice.

* Graphql
* Reactjs
* webpack like system.
* community

## Thoughts


### Graphql
While working on with Gatsby early on it became apparent that I was going to have to learn graphql. I have heard a lot about graphql but I had never had a reason to use it up until this point.

The way I understood graphql was that it was a query language for API's that allows you to join multiple or complex requests into one request. What I found is that is true but I expected graphql to do more that it does.

The query I wanted to create would pull all repositories I owned and then would grab the content using a different request. My initial approach did not work because you cannot pass results from one query into another. So in my case, I was trying to make the following requests.

```
GET users/JeffreyRiggle/repos
```
```
GET repos/JeffreyRiggle/{resultn}/readme
```

This is not able to be expressed in graphql so I had to go with a different approach. that just used the `repo` api.

```
{
  viewer {
    name
    repositories(last: 100) {
      nodes {
        name
        description
        id
        descriptionHTML
        url
        first: object(expression: "master:README.md") {
          id
          ... on Blob {
            text
          }
        }
        second: object(expression: "master:doc/doc.json") {
          id
          ... on Blob {
            text
          }
        }
      }
    }
  }
}
```

The only issue I have with this approach is the last 100 bit. While it's minor I ended up having to maintain a basic knowledge of how many repositories I have.


### Reactjs
This is a rather familiar framework for me by now. This made creating components easy for me to figure out in Gatsbyjs.


### Webpack
Gatsby uses a Webpack like configuration system. Since webpack is becoming a standard these days it was pretty easy to reason about how the configuration would work in Gatsbyjs.


### Community
This is really what sold me on Gatsbyjs. It just has a really large community. I did not struggle to find any documentation or examples of how others have been using this tool. This was a really big win for me since I have a limited amount of free time to figure things out.


## How the generation actually came together
In the end, I created a simple website that has information about the side projects I work on in github and a blog.

The github part queries github using the earlier mentioned graphql statement. Then it creates pages for each project. However, if the project has a doc.json file it will do some extra work to create a more complex page with additional child pages. This allows me to create different pages for Installation, Usage, development or whatever else I might need.

After all this is done it scraps the current directory structure to generate my blog pages.


## Final thoughts
All in all this was a pretty fun project and I got to learn a lot about static site generation. Since I had never had a reason to do static site generation before I had a lot to learn. Gastbyjs  made this process easy for me and I would recommend it to anyone familiar with a more modern frontend web stack.
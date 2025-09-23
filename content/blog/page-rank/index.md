---
title: 'Figuring out Page Rank'
date: '2025-09-21'
---

# Figuring out what is important

By now we have built a functioning web crawler and even generated some administrive tooling to allow us to crawl a bit better. The problem now is we don't really know what data is important. This is not a particuarly new problem and research has been done on this. The most notable research in this field would be [Bringing Order to the Web](http://ilpubs.stanford.edu:8090/422/1/1999-66.pdf). In this paper the concept of a page ranking system was proposed. We will be taking some time to examine this a bit more.

## A brief aside

Now this is the part where I am glad I am writing a series of blog posts regardless of the fact that I will likely be the only one to read them. Going into this blog entry I assumed I had taken notes on implemeting page rank and I also assumed I had implemented in correctly. Over the past few days I found that I was very wrong on this and I only found that out because I wanted to create this entry.

## Bringing Order to the Web

Back in 1998 Sergy Brin and Larry Page wrote a paper on how to deal with this problem. Why I didn't read this on the first attempted implementation I have no idea. This paper not only explains how to determine what pages are important, but it also goes over some of the challenges of crawling the web, many of which I encountered. In this paper, they discuss how to approached the problem and elaborated on some applications of the algorithm in two different search engines.

The key insight behind the page rank algorithm is that any given pages importance can be derrived from the importance of all pages that link to it. 

### The difficulty with links

The primary focus of the algorithm is on so called back links. One of the major issues with back links is it is impossible to know if you have all back links to a page. This is impossible to know because you can only tell the forward links for a page. If you could effectively gather every page on the internet then you could produce a proper graph with the correct back links. However, since the content on the internet is constantly changing and growing you can only ever work on a partial subset of the internet. Because of this certain considerations had been made that could make the algorithm more effective.

### The algorithm

I will spare you the formal notation of the algorithm because if you are interested in that you should just read the paper. Walking through the algorithm we have to start off with some setup before we can actually do the calculation. The first step is to build an adjaceny matrix of all pages and their edges. In this paper they suggested building an N by N matrix where all values are either a 0 or a 1 this bit correlating to the existence of an edge. In this matrix the N value is all of the known pages on the internet. After this is done we need to normalize the matrix such that each page is sending an equal weight to all of its links. Once this is done we generate any random vector of size N as our starting point. We then repeatedly multiply the vector by the normalized adjaceny matrix until it converges.

![Page Rank Algorithm](./page_rank_algo.gif)

The property of convergence comes from the fact that this is an eigenvector problem. If you find yourself more interested in the mathmatics of this problem I would suggest reading more into [eigenvectors](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors) and [markov chains](https://en.wikipedia.org/wiki/Markov_chain).

### Additional considerations

This paper talks about a couple of additional considerations as it relates to this alogrithm. The ones of note here would be dangling references and the personalization vector.

#### Dangling references

One problem with this alorithm is if you have a page with no outbound links it ends up being a bit of a rank sink. Often times when this happens it is not because the page doesn't link to anything but rather that the page has not been processed yet. To deal with this the suggestion is to pull dangling references out of the original calculation and then add them back in later with some initial value.

#### Personalization Vector

Another issue with search is contextualization. The example given in this paper is someone searching for "wolverine". The additional context here is that wolverine is or maybe was the administrative tool used by students at Michigan University. When the typical person searches for wolverine they would expect to find more details about the animal. However, when a student at Michigan University does the same search they might be interested in the tool. The suggestion proposed in this paper is that we could create personalization vectors that get added to the equation to make one of the search contexts more likely for the given person.

## Examining some implemenations

Sometimes it really helps to see how others have implemented the solution. I took the time to look at a couple of implemenations publically shared on Github to better understand how others have actually implemented this algorithm.

### Memgraph

[Memgraph](https://memgraph.com/) is a graph based database written in c++. It is common for graph databases to provide functionality like page rank out of the box because it is a clear graph alogorithm. Another very popular graph database that provides the same functionality would be [Neo4j](https://neo4j.com/).

The majority of the interesting parts of the code can be found [here](https://github.com/memgraph/mage/blob/main/cpp/pagerank_module/algorithm/pagerank.cpp). Now in this implementation there are a couple of optimizations added on to the original implemenation algorithm. The first optimization is that instead of building a square matrix of all nodes a coordinate list is created. So instead of having a data structure like this
```javascript
[
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 0]
]
```

we could instead have this
```javascript
[[0, 1], [1, 0], [2, 0], [2, 1], [3, 2]]
```

The second optimization that was applied was the use of parallel execution. In the memgraph implementation each cycle of the vector by matrix multiplication step is broken up amongst the cores available for execution. Meaning the multiplication is split into batches. Those batches are executed in parallel and then finally merged back together in a final pass.

### NetworkX

[NetworkX](https://networkx.org/documentation/stable/index.html) is a python library for dealing with network related algorithms. This appears to align a bit more with the academic side of this topic. The implemenation of the algorithm can be found [here](https://github.com/networkx/networkx/blob/main/networkx/algorithms/link_analysis/pagerank_alg.py). This algorithm can make use of [SciPy](https://scipy.org/) or [NumPy](https://numpy.org/). My research mainly focused on the SciPy implementation. For the most part this was very similar to the Memgraph implementation with some notable differences. One of the differences was the was no explicit multithreading. All operations had been doing doing matrix operations on SciPy classes. Since I have no looked into how SciPy does things like the `@` operator it is entierly possible that under the covers these matrix operations are happening in parallel.

One thing I found interesting was how true to the paper this algorithm was in how it was expressed. It worked on matrix multiplication of adjacency graphs and the bulk of the operation can be summed up in this line of python.

```python
x = alpha * (x @ A + sum(x[is_dangling]) * dangling_weights) + (1 - alpha) * p
```

Now in this case A is the adjaceny matrix but it is actually a coordindate graph in storage. We will also notice that in this implementation dangling nodes are handled and interestingly they actualy make use of the personalization vector `p`.

## Wrapup (better title)

Even though we have moved far beyond just using a page rank algorithm to do search, it was a lot of fun for me to explore this. This was one of a few times where I actually got to read a white paper. Since so much of this for me had been for learning I actually created my own implementation of page rank. My goal was not to be efficient but to really understand it so I even hand rolled the matrix multiplication logic. I have been timing my implemenation and at the current scale I am testing with the bottleneck is certainly the time to crawl all pages. Also in my implementation I do a crazy inefficent scan of pages to build the initial adjaceny matrix. I suspect I will optimize that as needed instead of reaching for one of these libraries to do the trick.

By now we have covered basically all of the back-end processing and collection I planned on covering. Going forward I will take some time to talk about some of the searching UI's and visualizations I put on top of this data.

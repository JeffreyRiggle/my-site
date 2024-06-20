---
title: 'IDE shake-up'
date: '2024-06-17'
---

# Whats old is new (to me)
It has been a while since I have changed anything about my normal developer flow and decided it was time to give something else a try. It is a rare occasion that I ever look at switching up my tools but I have noticed latetly that on some days a constant use of switching between keyboard and mouse can cause me some wrist pain. In an effort to try and reduce the possibility of future issues I decided it was time to give some other setup a try.

## What is the flow I have been using
**Clean this up its way to rambly**

My experience with coding environments has undergone a bit of change since I started but in general I think I followed a pretty standard flow. The first couple of programs I wrote was in the windows notepad app and then compile using the default terminal application. From there I found that there was a program called notepad++ and it was a bit better for code. This was basically my setup until college. Once in college we had been all in on Java and it was time to upgrade to a fully fleged IDE in the war of Netbeans vs Eclipse I landed in the Eclipse camp. After a while I landed a job at a dotnet shop and my environment changed a little instead of using Eclipse for everything I started using Visual Studio and welcomed powershell into my toolkit. This conintued on for a good long while but eventually I had to start working in the web domain. At this point I found that Visual Studio and Eclipse had been terrible tools for editing javascript, html, and css. Finally I landed on using sublime text. This was a decent environment but it never fully clicked for me. Since this never clicked I started looking around and found Atom. I really enjoyed that editor for a while but eventually someone got me hooked on VSCode. I was very skeptical at first since I had been tired of the poor performance of Visual Studio. If a native Visual Studio was slow how was a web based one going to be any faster? After giving it an honest try I have been hooked for years now.

## Figuring out the right editor
Armed with a "simple" idea for a program I set out to find the editor I was going to try out. I knew I wanted it to be a terminal based application. From past experience I knew nano was not going to work. This left either emacs or some variant of vi. Since I have seen more commutity representation in vi based editors I decided this was the route to go down given my past experience with poor community support (aurelia). Immediately I knew that vi would probably not be the right choice because it was not as rich of an environment as vim and neovim. In the end I landed on neovim because it appears to be the latest encarnation of vi.

## Setting expectations
As I set out on my journey to use a new editor I did what I usually do in these situtations, laid out some expectations. In this I assumed that it was going to be slower at first to edit in neovim than just using the tools I had been. I also assumed that figuring out the keybindings would take a while. Another thing I assumed was that pretty early on I would have to add plugins and might even have to use tmux. In the end I assumed I would enjoy the end result and might even use it full time.

## Getting started
Starting this process out I was running on a ubuntu based machine. The first task was installing neovim which was pretty easy to do with apt-get. Once in it was pretty clear to me that the default settings didn't quite work for me. I spent a bit of time figuring out the correct numbering scheme and color settings. Then it came time for the hard part, sifting through all too many resources to figure out what plugins I needed and how to set them up.

### Getting the config down
The first thing I found was that I just wanted to set some editor properties and move on with my coding; However, it appeared there was two ways to setup configuration. You can either use a `vim.init` file in your config space or write some lua code to configure your editor. Most online tutorials had been all in on lua but I just wanted something quick, simple and easy for me to understand. For this I decided to proceed with the `vim.init` pattern.

### First round of plugins
Once I got my editor looking the way I wanted and persisted in my init config it was time to pick my first couple of plugins. In the end I landed on airline and nerdtree. I assumed that it would be nice to have a plugin that showed me very clearly what mode I was in (edit vs view). I also assumed what IDE doesn't have a project tree so of course I would need that right?

## Keybindings don't have to have a modifier?
One thing that took me a long time to wrap my head around was that due to the different modes present in neovim/vi you don't have to do crazy keybindings to accomplish different tasks. Some examples include jumping to next word or jumping to end of line. In a edit only type editor these types of commands require some modifier key like control/command/alt but in neovim they can be an operation like change to view mode and press `w` key.

This took me a while to get used to but once I did I really ended up enjoying having the different modes and less strange finger contortion to accomplish a simple task. During this time I found the [following resource](https://vim.rtorr.com) to be very helpful.

The one thing that took me a very long time to get used to was cut. For some reason copy verses yank wasn't to hard to map mentally but `d` being cut/delete took me a long time to commit to memory.

## Spolied on sensible defaults
Through this experience I think something I have taken for granted with all of the editors I typically use is sensible formatting etc defaults baked into the editor. In the past I had seen defaults break down a bit when doing something like javascript development in Visual Studio (at least circa 2015) or Eclipse. However, normally these standard IDEs handled the default formatting for the language they where defined for very well. Moving forward VSCode took that to the next level by having different default formats for different languages and even detecting different tools that you should install based on the language you are attempting to author.

The behavior of VSCode really reduces the congnitie load for developers that just want sensible defaults and don't want to spend a lot of time picking out there tools. At times this was something I missed as I do not always enjoy going down a rabbit hole to find a sutible option for the task I am working on.

## The hunt for appropriate plugins
Pretty early on it was clear to me that the original set of plugins I installed wasn't cutting it. Neovim is great but at its core it is a text editor that needs plugins to accomplish things we don't always think about. One of those things is autocomplete. By default neovim had limited or no autocomplete, but with many common IDEs it so more or less something you expect. Most commonly used languages have language servers that provide completion results, type information and hints. After looking around a bit I found CoC (Conquerer of Completion). This tool worked fine but it never fully set well with me. The first issue was it was a bit weird to have to deal with a plugin system in one of my plugins. The second issue while minor was that it was a bit strange that one of my plugins was built on nodejs requiring specific node versions to be present. In the end this ended up being the right tool to unblock me but I still cannot help but wonder if there is a better way to handle this problem.

After I got that working the next issue I ran into was I found that I really like to be able to fuzzy search specifically for files. It turns out I rarely actually interact with my tree structure and almost exclusively naviage around by fuzzy finding the files I am interested in. While there might have been a way to get this with CoC I was not finding it. Doing some searching I ended up finding telescope but it didn't seem like it was able to be used on the stable version of neovim. After some fussing around with versions I ended up dropping that attempt and landed on fzf. This is hands down my favorite plugin I ended up installing. It did exactly what I wanted and really didn't involve any special setup on my end.

## Now do it again
A while into this experiment I ended up getting a new laptop and I found myself in the position of having to recreate all of this configuration on a new machine with another operating system. What I found was the initial setup was pretty easy but getting all the plugins and `init.vim` setting setup correctly was a bit of a pain. Some of this was a difference in reserved keys between operating systems but a majority of it was recrating the config by hand. In this effort I can see the reason why many devs who run with this setup full time end up using putting all of there dot files or lua code in a github reponsitory that can just be pulled down locally. While this didn't take an insane amount of time I could see that repository saving a couple of hours of time every time you have to work on a new setup.

## Enter tmux
As I predicted eventually the time came where I need to use tmux. For the longest time I was just working on a python process that had a slow feedback loop. In these cases opening neovim, putting it in the background, running the process, waiting for the result and switching back was not that big of a pain point. However once I started creating a web interface on top of the result of the process it became clear that rapid iteration in this fashion was just not fast enough. The ceremony of control/alt+z, run process, control/alt+c, fg repeat became too much. In this case I was just altering static assets so the run process really didn't need to keep being kicked off. Switching to tmux and having both the process run and editor visible at the same time was a big productivity win for me.

## What I learned
* Talk more about the "Simple" program

* I like this setup sometimes but I would probably never use it full time
* There are certain features I really expect to be able to use in my dev environment
    * Signature information (help)
    * Autocomplete
* Really enjoyed the hotkeys and the power of visual vs edit mode
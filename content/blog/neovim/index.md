---
title: 'IDE shake-up'
date: '2024-06-17'
---

# What's Old is New (to me)
It’s been a while since I’ve altered my development workflow, but I decided it was time for a change. Latetly I have noticed constant switching between keyboard and mouse can cause me some wrist pain. In an effort to try and reduce the possibility of future issues I decided it was time to give some other setup a try.

## My Usual Workflow

My journey with coding environments has evolved over the years. I started with [Windows Notepad]((https://en.wikipedia.org/wiki/Windows_Notepad)) and the default terminal for compiling. Then, I discovered [Notepad++](https://notepad-plus-plus.org/) in high school, which I used until college. In college, we primarily used Java, and it was time to upgrade to a fully fleged IDE. In the war of [Netbeans](https://netbeans.apache.org/front/main/index.html) vs [Eclipse](https://eclipseide.org/) I landed in the Eclipse camp.

After college, I joined a .NET shop and switched to [Visual Studio](https://visualstudio.microsoft.com/), incorporating [PowerShell](https://en.wikipedia.org/wiki/PowerShell) into my toolkit. Later, when I moved into web development, I found Visual Studio and Eclipse lacking for JavaScript, HTML, and CSS, so I tried [Sublime Text]((https://www.sublimetext.com/)). It didn’t fully click for me, leading me to [Atom](https://atom-editor.cc/), which I enjoyed until I discovered [VSCode](https://code.visualstudio.com/). Despite initial skepticism, I’ve been hooked on VSCode for years.

## Choosing right editor
Armed with a "simple" program idea, I set out to find a terminal-based editor. From past experience I knew [nano](https://en.wikipedia.org/wiki/GNU_nano) was not going to work. This left either [emacs](https://en.wikipedia.org/wiki/Emacs) or some variant of [vi](https://en.wikipedia.org/wiki/Vi_(text_editor)). Since I have seen more commutity representation in vi based editors I decided this was the route to go down given my past experience with poor community support (aurelia). Immediately I knew that vi would probably not be the right choice because it was not as rich of an environment as [vim](https://www.vim.org/) and [neovim](https://neovim.io/). In the end I landed on neovim because it appears to be the latest encarnation of vi.

## Setting Expectations
As I set out on my journey to use a new editor I did what I usually do in these situtations, laid out some expectations. In this I assumed that it was going to be slower at first to edit in neovim than just using the tools I had been. I also assumed that figuring out the keybindings would take a while. Another thing I assumed was that pretty early on I would have to add plugins and might even have to use tmux. In the end I assumed I would enjoy the end result and might even use it full time.

## Getting started
I began on an Ubuntu machine and installed Neovim with apt-get. The default settings weren’t suitable, so I adjusted the numbering scheme and color settings. Then it came time for the hard part, sifting through all too many resources to figure out what plugins I needed and how to set them up.

### Configuring Neovim
The first thing I found was that I just wanted to set some editor properties and move on with my coding; However, it appeared there was two ways to setup configuration. You can either use a `vim.init` file in your config space or write some lua code to configure your editor. Most online tutorials had been all in on lua but I just wanted something quick, simple, and easy for me to understand. For this I decided to proceed with the `vim.init` pattern.

### First Round of Plugins
After getting Neovim setup the way I wanted, I installed my first plugins: [airline](https://github.com/vim-airline/vim-airline) and [nerdtree](https://github.com/preservim/nerdtree). I installed Airline because it helped me distinguish between edit and vidw modes. As for NerdTree, I figured all IDE's have a project tree so of course I would need that right?

## Keybindings don't have to have a modifier?
Understanding Neovim’s keybindings took time. Unlike traditional editors, Neovim’s different modes eliminate the need for complex keybindings. For instance, jumping to the next word or end of the line doesn’t require a modifier key. This approach reduced finger strain and improved my workflow. The [Vim Cheat Sheet](https://vim.rtorr.com) was invaluable during this period.

The hardest part was memorizing the cut command. While copying (yank) was intuitive, using d for cut/delete took some getting used to.

## Spolied by Sensible Defaults
Through this experience I learned having sensible formatting etc defaults baked into the editor is something I take for granted. In the past I had seen defaults break down a bit when writing javascript in Visual Studio, at least circa 2015, or Eclipse. However, normally these standard IDEs handled the default formatting for the language they where designed for very well. VSCode took that to the next level by having different default formats for different languages and even detecting different tools that you should install based on the language you are writing in.

The behavior of VSCode reduces the congnitie load for developers who just want sensible defaults and don't want to spend a lot of time picking out there tools. At times this was something I missed. As it turns out, I do not always enjoy going down a rabbit hole to find a sutible option for the task I am working on.

## Finding the Right Plugins
Pretty early on it was clear to me that the original set of plugins I installed wasn't cutting it. Neovim is great but at its core it is a text editor that gets better with plugins. By default neovim had limited or no autocomplete, but with many modern IDEs it is something you expect. After looking around a bit I found [CoC (Conquerer of Completion)](https://github.com/neoclide/coc.nvim). This tool worked fine but it never fully enjoyed using it. It was a bit weird to have to deal with a plugin system in one of my plugins. Also it was a bit strange that one of my plugins was built on nodejs requiring specific node versions to be present. In the end this ended up being the right tool to unblock me but I still cannot help but wonder if there is a better way to handle this problem.

As it turns out I really like to be able to fuzzy search, specifically for files. I realized that I nenver actually interact with my tree structure and  exclusively naviage around by fuzzy finding the files. While there might have been a way to get this with CoC I was not finding it. I ended up finding [telescope](https://github.com/nvim-telescope/telescope.nvim) but it didn't seem like it was able to be used on the stable version of neovim. After some fussing around with versions I ended up dropping that attempt and landed on [fzf](https://github.com/junegunn/fzf.vim). This is hands down my favorite plugin I ended up installing. It did exactly what I wanted and really didn't involve any special setup on my end.

## Now do it again
During this experiment I ended up getting a new laptop. This put me at having to recreate all of this configuration on a new machine with another operating system. The initial setup was pretty easy but getting all the plugins and `init.vim` setup correctly was a bit of a pain. Some of this was a difference in reserved keys between operating systems, but a majority of it was recrating the config by hand. I can see the reason why many devs who run with this setup full time end up using putting all of there dot files or lua code in a github reponsitory. While this didn't take an insane amount of time, I could see that repository saving a couple of hours of time for every new setup.

## Enter tmux
As I predicted eventually the time came where I need to use [tmux](https://github.com/tmux/tmux/wiki). For the longest time I was just working on a python process that had a slow feedback loop. In these cases opening neovim, putting it in the background, running the process, waiting for the result, and switching back was not that big of a pain point. However, once I layered in a web interface it became clear that rapid iteration in this fashion was just not fast enough. The ceremony of control/alt+z, run process, control/alt+c, fg repeat became too much. I was just altering static assets so the run process didn't need to keep being kicked off. Switching to tmux and having both the process run and editor visible at the same time was a big productivity win for me.

## What I learned
While I really enjoyed working in this way I do not see me making this my full time setup. Having to keep on top of what plugins I want for commonly supported IDE workflows does not seem to be how I enjoy spending my time. During this process I found out which editor features are truely important to me, if my IDE has decent autocomplete, inline signature help, and fuzzy file finding I am pretty happy. I was a bit suprised to find that I do not use the file tree view much if at all.

Turns out working on a laptop without access to a mouse is far more enjoyable in neovim. When working on a laptop in another IDE I am reminded how much I struggle to use a touchpad effectively, working in neovim really gets rid of this classification of issue for me.

As is often the case with my side projects I found that my "simple" program expanded into something far more complicated. This program ended up loosely resembling a search engine. This also ended up using Python, Rust and standard web primiatives (javascript, css, html) which lead to more and more autocompletion flows I needed to consider. Since I ended up really enjoying the semi search engine project I will probably add some additional blog entries about that in the future.
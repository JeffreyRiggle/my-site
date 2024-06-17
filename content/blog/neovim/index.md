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
TODO: Talk about the choice to use neovim over vi or vim

TODO: Talk about the overwhelming amount of suggested plugins and setup options

TODO: Talk about minimal setup
* Neovim
* Standard config (no lua)
* First round of plugins
    * airline
    * nerdtree

## Keybindings don't have to have a modifier?

## Spolied on sensible defaults
Talk about how most IDEs paper over the defaults and when you have to think about them it can be a pain. Ex: indent size on javascript files

## Something clever about plugins
TODO: Talk more about the plugins I initially installed

TODO: Talk about how as time went on I needed more and more plugins

TODO: Talk about adding CoC and the issues I had with it

TODO: Talk about adding fzf (probably the best thing I added)

## Now do it again
Talk about having to do it all over again for my laptop and the things I found doing that

## Enter tmux
Talk about finally breaking down and using tmux and how big of a deal that was

## What I learned
* Talk more about the "Simple" program

* I like this setup sometimes but I would probably never use it full time
* There are certain features I really expect to be able to use in my dev environment
    * Signature information (help)
    * Autocomplete
* Really enjoyed the hotkeys and the power of visual vs edit mode
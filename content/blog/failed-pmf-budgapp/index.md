---
title: 'Failed Product Market fit with a single customer'
date: '2026-07-12'
---

Every once in a rare moon I create something I want to use. Many engineers build projects by scratching an itch. I am not that engineer. Usually my little toy projects are to learn something new. Maybe there is a new framework, or library or langauge. The end product is rarely something I interested in. The project is one of the rare exceptions. In this case I wanted to build an application to budget the way I thought of budgetting.

You see for a while before taking on this project I would manage my budget in excel. However I found that it is easy to mess things up in excel. Also I really hated trying to visualize the data I had created in excel. For the reasons I set out to create an application I called budgapp.

## Building the application

The build out wasn't too far off from other projects. In this case many familiar technologies came into play: React, Sass, Electron, ipc-bridge. However there had been some new entrants: [Spectron](https://github.com/electron-userland/spectron), [webdriverio](https://webdriver.io/), [lerna](https://lerna.js.org/).

Much like with the robit application I had a native application using electron and some static web assets for the client. This was also built in the same way as robit where it used ipc-bridge to to the communication across web page and native app, as well as suppoted the native app or standalone website with less features.

By coding standards this was possibly a bit better than my last few projects. I had finally built a public project using TypeScript, well kind of. All of the client code that ran in the browser used TypeScript. I also had high amounts of unit tests and even coverage thresholds for CI. In an effort to continue to up my game I did proper end-to-end testing with page object models to boot.

## Highlighting the key features

To help with the rest of this blog I am going to describe some of the key features. The main building blocks of this application had been the concept of categories, budget and income. 

Categories had been a way of labelling the budget. An example category might be housing in which you might set aside some budget for paying rent or a mortgage. Some categories had a concept I called rollover. For this case imagine you have a personal spending budget. Let's say this is $150 now you might want something that costs $1500. The approach I took to this problem was you could build up to that by letting the budget rollover. If you didn't spend anything for 10 months your in luck and you could by that cool $1500 item.

Budget and income were a lot simpler. Budget was all of the transactions you made that cost you money, while income was all transactions that netted you money.

In addition to this I wanted to be able to compare how I was trending, was some budget rising, or maybe I was underspending in an area? For this I had a historical view that allowed for showing the spend and you could filter down to categories.

The last thing was I wanted to encrypt the budget at rest. I didn't like the idea of senstive data sitting on my computer and wanted to be able to password protect the file. This resulted in password management and using a password before viewing the file.

## Formation of cracks

This application was doing everything I wanted it to do and solving the problems I wanted. However at some point some issues started to show up. 

### Bad storage planning

The first one I noticed was making changes to the application was getting harder. One choice I made early on was to store all configuration and data in a single JSON file. This worked well for the initial stages and allowed me to move fast. However eventually migrations needed to occur. As these migrations occurred I had to do painful JSON to JSON structure conversions without a more rigid system. Taking the time to use SQLite and plan some database tables could have saved me a lot of effort here.

### Currency is challenging

Anyone who has worked with money and software is aware of the challenges with floating point arithmatic. This pain is made worse in JavaScript your only choice for numbers is the [IEEE 754 standard.](https://en.wikipedia.org/wiki/IEEE_754). This comes with the classic challenge of `0.1 + 0.2 = 0.30000000000000004`. Now in many cases this isn't a problem but I prefer my personal finance not to have these sorts of issues. To get around this I decided to store all values as integers representing total value in cents. This worked out well but often led to weird cases where either I wouldn't display something correctly or I would accidently be off by 100x during a write or read.

### Rollover isn't that straightforward

What started as a simple feature got more complex. To support rollovers I would compute the effective rollover during operations. For example If you didn't spend $50 on a $100 category last month, the current months view would take all of the deltas for all of the months in the past add those together and then add that to the current month. This was a pretty straight forward calcuation to do. While this is not the code I used, we could imagine some code for this.

```typescript
async function calculateBudgetRollover(category) {
    const budgetItems = await getAllBudgetItems();
    const budgetByMonth = budgetItems.reduce((prev, curr) => {
        const date = `${curr.date.getDate()}/${curr.date.getFullYear()}`;

        if (!prev[date]) {
            prev[date] = curr.amount;
            return prev;
        }

        prev[date] += curr.amount;
        return prev;
    }, {});

    const categoryConfig = await getCategoryConfig(category);

    return budgetByMonth.values().reduce((prev, curr) => {
        return prev + (categoryConfig.target - curr);
    }, 0);
}
```

Aside from some optimizations this is fine. However it gets more complicated. You see over time your allocations can change. For example maybe food spend year was $150 a month but this year you are finding you have to spend $200 a month. Now you have a rolling window of logic for computing your deltas. Maybe you continue to do what you had been doing before but instead change the aggregation logic.

```typescript
async function calculateBudgetRollover(category) {
    const budgetItems = await getAllBudgetItems();
    const budgetByMonth = budgetItems.reduce((prev, curr) => {
        const date = `${curr.date.getDate()}/${curr.date.getFullYear()}`;

        if (!prev[date]) {
            prev[date] = curr.amount;
            return prev;
        }

        prev[date] += curr.amount;
        return prev;
    }, {});

    const categoryConfigs = await getCategoryConfigHistory(category);
    const categoryTargetByDate = categoryConfigs.reduce((prev, curr) => {
        const date = `${curr.date.getDate()}/${curr.date.getFullYear()}`;
        prev[date] = curr.target;
        return prev;
    }, {});

    return budgetByMonth.entries().reduce((prev, [key, value]) => {
        return prev + (categoryTargetByDate[key] - value);
    }, 0);
}
```

Perhaps instead you insert rollover items along the way but then you have the challenge of computing those and updating them.

```typescript
async function calculateBudgetRollover(category) {
    const budgetItems = await findBudgetItemsByName('<SPECIAL ROLLVOER ID>');
    return budgetItems.reduce((prev, curr) => prev + curr, 0);
}
```

In either case this proved to be an annoying case I didn't antcipate having to solve.

## Non-technical cracks are worse

Despite these little challenges in implementation I was feeling good. I was fixing the issues and the application was doing what I wanted. Eventually I got to a stage where all I was doing as using the application. As a weekly tool this took on a different shape. I was becoming less willing to deal with issues the application presented. 

I didn't give enough credit to how many transactions pile up over a week. If you only make 2 transactions a day and still have to enter those manually that is 14 transactions a week. If you are a slacker and miss a couple weeks that is 60 transactions a month. Let's also be honest you are probably averaging more than 60 transactions a month.

With this volume of manual entry you just want the UI to get out of your way. I don't want to have to interact with a date picker 60 times or press add transaction 60 times. Excel has a bit of a super power here. I can just arrow around and hotkey my way through tons of manual entires. A grid is an excellent UI for this kind of problem.

## Maybe you can agument the experience?

At this point I could take the time to build a different UI, but I was on to other things and I didn't want to take on a huge rebuild of the tool. Instead I decided it would be best to offload some of this work. What if I just did all the manual entry in excel but then stored it in some format that I could read back into the application to get the views I wanted?

I got to work and built some logic that took in my `xslx` file and I was up and running. For quite some time I continued on this way. Do the manual entry in excel, load into my app to visualize, rinse, repeat. However as time went on I was starting to wonder why I would even put up with that? Excel is doing most of the work so why do I even have this application at all?

## The pain not solved

In the end the real pain I wanted to solve was a bulk upload of my transactions with tagging and visulizations. The application I build didn't handle most of this pain and instead gathered dust.

If I would attempt to solve this problem again I would start from the source pain. I thought I understood it but I was wrong. What I really wanted to do was analyze my transaction history offline. Viewing that as the primary problem would have probably caused me to write a program I continued to use to this day.

## Wow it's done!

So now we come to an end to our series on past projects. This was the second from last project I worked on and now everything has been written about. You may ask your self "second from last, where is the last?" The answer is I actually blogged about that project before starting this series. If you want to complete the series and haven't already read it the next blog to check out would be [this one](https://ilusr.com/search-intro/).

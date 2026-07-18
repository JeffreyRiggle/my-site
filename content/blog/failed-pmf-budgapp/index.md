---
title: 'Failed Product Market Fit With a Single Customer'
date: '2026-07-12'
---

Every once in a rare moon I create something I want to use. Many engineers build projects by scratching an itch. I am not that engineer. Usually my little toy projects are to learn something I haven’t used yet. Maybe the new thing is a domain, a framework, a library, or a language. The end product is rarely something I'm interested in. The project is one of the rare exceptions. In this case, I wanted to build an application to budget the way I thought of budgeting.

For a while before taking on this project, I would manage my budget in Excel. However, I found that it is easy to mess things up in Excel. Also, I hated trying to visualize the data I had created in Excel. For the reasons I set out to create Budgapp.

## Building the application

The build out wasn't too far off from other projects. In this case many familiar technologies came into play: React, Sass, Electron, ipc-bridge. However there had been some new entrants: [Spectron](https://github.com/electron-userland/spectron), [webdriverio](https://webdriver.io/), and [lerna](https://lerna.js.org/).

Much like with the robit application, I had a native application using Electron and some static web assets for the client. This was also built in the same way as Robit. Ipc-bridge managed communication between the web page and native application, in addition to supporting either the native app or standalone website.

By coding standards alone, this was a bit better than my last few projects. I had finally built a public project using TypeScript, well kind of. All of the client code that ran in the browser used TypeScript. I also had high amounts of unit tests and even coverage thresholds for CI. In an effort to up my game, I did proper end-to-end testing with page object models to boot.

## Highlighting the key features

To help with the rest of this blog, I will describe some key features. The main building blocks of this application were categories, budget, and income.

Categories were a way of labelling the budget. An example category might be housing; you might set aside some budget for paying rent or a mortgage. Some categories had a concept I called rollover. For this case, imagine you have a personal spending budget. Let’s say this is $150. Now you might want to buy something that costs $1500. The approach I took to this problem was building up by letting the budget roll over. If you didn’t spend anything for 10 months, you’re in luck, and you could buy that cool $1500 item.

In addition to this, I wanted to be able to compare how I was trending: was some budget rising, or maybe I was underspending in an area? For this, I had a historical view that showed the spend, and you could filter down to categories.

The last thing was I wanted to encrypt the budget at rest. I didn’t like the idea of sensitive data sitting on my computer and wanted to be able to password protect the file. This resulted in password management and using a password before viewing the file.

## Formation of cracks

This application was doing everything I wanted it to and solving the problems I wanted solved. However, at some point some issues started to show up.

### Bad storage planning

The first one I noticed was that making changes to the application was getting harder. One choice I made early on was to store all configuration and data in a single JSON file. This worked well for the initial stages and allowed me to move fast. However, eventually migrations needed to occur. As these migrations occurred, I had to do painful JSON-to-JSON structure conversions without a more rigid system. This was made worse by the fact I didn’t encode a version in my JSON file. For example, one thing that came up was transitioning categories from fixed to time-based. Originally, categories were close to this data structure.

```json
{
    // other properties
    "categories": [
        { name: "groceries", amount: 200 },
        { name: "rent", amount: 1000 }
    ]
}
```

However, over time I realized that I needed these to be date-specific, which required a migration. Now one shape I thought about was the following.

```json
{
    // other properties
    "categories": {
        "groceries": [ { date: "1/1/2025", amount: 200 }, { date: "1/1/2026", amount: 300 } ],
        "rent": [ { date: "1/1/2025", amount: 1000 } ]
    }
}
```

However, that is a difficult migration to make dynamically at runtime. Having a version tag as a JSON property would make that migration significantly easier. In this case, instead of dealing with the complexities of that migration, I just added a date property and made categories a flat list. Taking the time to use SQLite and plan some database tables could have saved me effort here. Databases are good at schema management, and dynamically adding a column later is trivial.

### Currency is challenging

Anyone who has worked with money and software is aware of the challenges with floating-point arithmetic. This pain is made worse in JavaScript; your only choice for numbers is the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754). This comes with the classic challenge of `0.1 + 0.2 = 0.30000000000000004`. In many cases this isn’t a problem, but I prefer my personal finance not to have these sorts of issues. To get around this, I decided to store all values as integers representing total value in cents. This worked out well but often led to weird cases where either I wouldn’t display something correctly, or I would accidentally be off by 100x during a write or read.

### Rollover isn't that straightforward

What started as a simple feature got more complex. To support rollovers, I would compute the effective rollover during operations. For example, if you didn’t spend $50 from a $100 category last month, the current month’s view would take all of the deltas for all of the months in the past, add those together, and then add that to the current month. This was a pretty straightforward calculation. While this is not the code I used, we could imagine some code for this.

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

    return Object.values(budgetByMonth).reduce((prev, curr) => {
        return prev + (categoryConfig.target - curr);
    }, 0);
}
```

Aside from some optimizations, this is fine. However, it gets more complicated. You see, over time your allocations can change. For example, maybe last year's food budget was $150 a month. However, this year you have to spend $200 a month. Now you have a rolling window of logic for computing your deltas. Maybe you continue what you had been doing before but instead change the aggregation logic.

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

    return Object.entries(budgetByMonth).reduce((prev, [key, value]) => {
        return prev + (categoryTargetByDate[key] - value);
    }, 0);
}
```

Perhaps instead you insert rollover items along the way, but then you have the challenge of computing those and updating them.

```typescript
async function calculateBudgetRollover(category) {
    const budgetItems = await findBudgetItemsByName('<SPECIAL ROLLOVER ID>');
    return budgetItems.reduce((prev, curr) => prev + curr, 0);
}
```

In either case, this proved to be an annoying case I didn’t anticipate having to solve.

## Non-technical cracks are worse

Despite these little challenges in implementation, I was feeling good. I was fixing the issues and the application was doing what I wanted. Eventually I got to a stage where all I was doing was using the application. As a weekly tool, this took on a different shape. I was becoming less willing to deal with issues the application presented.

I didn’t give enough credit to how many transactions pile up over a week. If you only make 2 transactions a day and still have to enter those manually, that is 14 transactions a week. If you are a slacker and miss a couple weeks, that is 60 transactions a month. Let’s also be honest, you are probably averaging more than 60 transactions a month.

With this volume of manual entry, you just want the UI to get out of your way. I don’t want to have to interact with a date picker 60 times or press add transaction 60 times. Excel has a bit of a super power here. I can just arrow around and hotkey my way through tons of manual entries. A grid is an excellent UI for this kind of problem.

## Maybe you can augment the experience?

At this point I could have taken the time to build a different UI, but I was on to other things. I didn’t want to take on a huge rebuild of the tool. Instead I decided it would be best to offload some of this work. What if I just did all the manual entry in Excel and then stored it in a format that I could read back into the application to get the views I wanted?

I got to work and built some logic that worked on an `xslx` file, and I was up and running. For quite some time I continued on this way. Do the manual entry in Excel, load into my app to visualize, rinse, repeat. However, as time went on, I started to wonder why I would even put up with that? Excel is doing most of the work, so why do I even have this application at all?

## The pain not solved

In the end, I found the real pain I wanted to solve was a bulk upload of my transactions with tagging and visualizations. The application I built didn’t handle most of this pain and instead gathered dust.

If I were to attempt to solve this problem again, I would start from the source pain. I thought I understood it, but I was wrong. What I really wanted to do was analyze my transaction history offline. Viewing that as the primary problem would probably have caused me to write a program I continued to use to this day.

## Wow, it's done!

So now we come to the end of our series on past projects. This was the second-to-last project I worked on. Now everything has been written about. You may ask yourself, “Second from last, where is the last?” The answer is I actually blogged about that project before starting this series. If you want to complete the series and haven’t already read it, the next blog to check out would be [this one](https://ilusr.com/search-intro/).

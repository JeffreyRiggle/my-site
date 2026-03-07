---
title: 'SONA frontend and changing times'
date: '2026-03-05'
---

## The face of SONA

To round out the SONA blog series I find it fitting to end with the front-end. As a look back on this project I am reminded that the web front-end landscape is ever evolving. A while back I wrote a very [short piece on Aurelia](https://ilusr.com/aurelia/) so I won't go over all of that again. What strikes me most is the rate of change on the front-end.

## Event passing

In modern frameworks we don't have to think too deeply about passing state between components. For example in Angular you are likely using an event emitter or an output signal to pass state between components.

```ts
@Component({
  selector: 'component-a',
  standalone: true,
  template: `<component-b (action)="handle($event)" />`
})
export class ComponentA {
  handle(evt) {
    console.log('Got event ', evt);
  }
}

@Component({
  selector: 'component-b',
  standalone: true,
  template: `<button (click)="actioned()">Click Me</button>`
})
export class ComponentA {
  action = output<string>();
  actioned() {
    action.emit('Yo!');
  }
}
```

Even in react this is a pretty straight forward pattern, assuming you don't want to use the redux pattern.

```tsx
function ComponentB({ action }) {
    const act = useCallBack(() => {
        action('Yo!');
    }, [action]);
    return <button onClick={act}>Yo</button>
}

function ComponentA() {
    return <ComponentB action={evt => console.log('Got event ', evt)} />;
}
```

However before these frameworks you could pass state by emitting a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) from DOM elements directly. I did find it quite interesting that this is how state passing was done in Aurelia, or at least my usage of it. Causing this sort of pattern to emerge.

```js
@customElement('component-b')
@inject(Element)
export class AttachmentItem {
    actioned() {
        let evt = new window.CustomEvent('action', { detail: 'Yo!' });
        this.element.dispatchEvent(evt);
    }
}
```

## Style preprocessors

Another thing I noticed in this project was that it used [less](https://lesscss.org/). From what I can tell less has lost a lot of popularity and frameworks like Angular tend to more fully embrace a very similar concept in [sass](https://sass-lang.com/). I have no idea what React is doing anymore. The last I knew JSS style frameworks like [emotion](https://emotion.sh/docs/introduction) were the way to go but it is highly likely that has changed. I am also sure there are a large group of people that do not use a preprocessor but use [tailwindcss](https://tailwindcss.com/) instead.

Looking at this particular projects usage of less I could have gotten everything I needed with the introduction of [css custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Anymore I find it hard to find a compelling case to use a css preprocessor since the base css feature set has gotten so much better over the years. In a lot of ways it seems like many of these abstraction should be getting phased out for native browser functionality just like how when [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) was introduced and incorporated a large portion of what [jQuery](https://jquery.com/) had to offer.

## Accessiblity issues

One major issue I see in this project is just how much it is not accessible.

### Button contents affect screen readers

A major violation I see a lot in this project is the continued use of `x` as the text for a button. While this reads fine for many users, the screen reader experience is terrible. Here is one such example.

```html
<button class="attachment-remove" click.delegate="remove()">x</button>
```

Using the not so handy [rule guide](https://www.w3.org/TR/WCAG20-TECHS/ARIA14.html) we can see this should have been.
```html
<button class="attachment-remove" click.delegate="remove()" aria-label="remove">x</button>
```

### Live text

Another mistake I am seeing is around the notification system. While I am not sure all the notifications I created had been valuable the main way of knowing if a request failed was via a failure notification. The problem with this is it didn't use a [live region](https://www.w3.org/TR/WCAG20-TECHS/ARIA19.html) so it is unlikely that a screen reader would have given the user the information they needed.

Here is an example from the application.
```html
<!-- Notification Area -->
<template>
    <require from="./notification-item"></require>
    <div id="notification-area" class="${notifications.length > 0 ? 'show-notification' : 'hide-notification'}">
        <notification-item repeat.for="notification of notifications" notification.bind="notification"></notification-item>
    </div>
</template>
```

A better version of this would have been

```html
<!-- Notification Area -->
<template>
    <require from="./notification-item"></require>
    <div id="notification-area" class="${notifications.length > 0 ? 'show-notification' : 'hide-notification'}" role="alert" aria-atomic="true">
        <notification-item repeat.for="notification of notifications" notification.bind="notification"></notification-item>
    </div>
</template>
```

## Promises vs async

Something else I found interesting in my read through of this is that I started on this when [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) had been introduced but [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) had not. Because of this most of this code used promises.

What is even more interesting to me is how quickly promises had been adopted to only be more or less superceeded by async/await 2 years later. In an effort to better understand this quick evolution I did some research on this. The best I can tell the actual implementation of promises in Javascript came from the Node.js ecosystem. Digging a bit more the [originally popularized API](https://dl.acm.org/doi/10.1145/960116.54016) for promises actually came out of the distributed systems with Barbara Liskov. What is interesting is that there wasn't really a great way to leverage the same API with the promises in Javascript. Adding async/await seemed like a way to attempt to bridge that gap but still didn't quite nail it.

As best as I can understand a more historically appropriate promises API in Javascript might have looked more like this.

```javascript
function asyncWork() { /* some work to do async */ }
function doOtherWork() { /* some sync work to do */ }

function run() {
    const p = new Promise(asyncWork);
    doOtherWork();
    // suspension happens here.
    p.get();
}
```

Now I think with async/await and the promises API you can get closer to this but it still doesn't quite seem the same.

```javascript
async function asyncWork() { /* some work to do async */ }
function doOtherWork() { /* some sync work to do */ }

async function run() {
    const p = asyncWork();
    doOtherWork();
    // suspension happens here.
    await Promise.all([p]);
}
```

## Tools I don't miss

One thing I noticed looking back on this was that I had used [webpack](https://webpack.js.org/) and [gulp](https://gulpjs.com/). Over time I have realized that as powerful as these tools they create something that is inheritly hard to maintain. If you are using webpack you are probably using lots of different plugings. Some of these features may have moved into the core over time. That being said my memory is having to all sorts of plugins. You need to ship in multiple browsers will you need the babel plugin for that. Oh you wanted to use less as your preprocessor, there is another. Did you say you actually wanted to use some css as well, another plugin for you. Having to install all of these plugins just to build a simple web app makes coming back later very hard as plugins stop being maintained. This is often my biggest source of nightmare when coming back to side projects years later. Hopefully up and coming build tools like vite will do a bit better on this front but there are still plugins there.

## But what about the acutal client

For the most part I have been rambling on about how the javascript ecosystem has changed. However I do think it would be beneficial if I at least called out some specific learnings from this project.

### Design isn't getting better
While in some ways I can see I was exploring with the UI when I look back on this it just looks like a watered down and worse JIRA. The design flair that I tried to add was some animations specifically around remove attributes from a ticket. This project continues to show that I could use improvement on my design skills.

### Auth pain

As I mentioned before the authorization pattern was the following. First you need to login, then you will get a "token", finally you need to send that token in a `X-Sona-Token` header. The problem with this is this ment if you wanted to keep the token between pages refreshes you would have to find a way to store that token. What I ended up doing was managing the token manually in javascript but putting the token in localStorage. This would have been all much more simple if the token was just set in a cookie. In that case the client side javascript wouldn't have had to do anything with local storage or have some custom logic in its fetch calls to make sure the header was set.

### More routing

One thing I see in this application is that it's an SPA but it barely uses other routes. There was basically three different routes: login, incidents list, and incident. Some routes that could have been helpful would have been: a 404 page, a 401 page, and a user profile page. Not having the 404 and 401 page seems very strange to me anymore.

## Closing it out

I do have many other small critiques of my code here around specific css choices and some other miscellaneous issues. However, I didn't want to spend a lot of time talking about these very specific complaints.

One thing that has stuck with me a lot when considering Aurelia again was part of why I was drawn to it in the first place. At the time it seemed very reasonable that some subset of what Aurelia was doing would just become standardized in the browsers. This creates an interesting link for me. I also really enjoyed using HTMX and I know it [has similar asparations](https://htmx.org/essays/future/). I am hoping they get trackion but maybe this is a cautionary tale that HTMX may never make it into the standards. 

The overwhelming theme I was noticing over this review was even in the last 10 years the front-end ecosystem has changed massively. If you extend that period by another 10 years the changes are even more shocking. Layers of abstraction are added then removed and configuration vs convention is a constant battle. In the meantime the browser primatives have been getting much better which may be getting missed by the framework battles. Maybe on your next project try Javascript without a framework, you just might be suprized what you can do.
---
title: 'SONA frontend and changing times'
date: '2026-03-05'
---

## The face of SONA

To round out the SONA blog series I will be focusing on the front-end. As a look back on this project I am reminded that the front-end landscape is ever evolving. A while back I wrote a [short piece on Aurelia](https://ilusr.com/aurelia/). This piece lamented the state of Aurelia. In this blog I will instead focus on general issues with my front-end. Much of what I noticed during my post mortem review was patterns that have fallen out of favor and mistakes that exist regardless of framework choice.

## Event passing

In modern frameworks passing state between components is decided for us. This passing of state is so well abstracted in the framework, you might not realize there is a way to pass state without a framework. For example, in Angular you are can use either an event emitter or an output signal to pass state between components.

```ts
@Component({
  selector: 'component-a',
  template: `<component-b (action)="handle($event)" />`
})
export class ComponentA {
  handle(evt) {
    console.log('Got event ', evt);
  }
}

@Component({
  selector: 'component-b',
  template: `<button (click)="actioned()">Click Me</button>`
})
export class ComponentA {
  action = output<string>();
  actioned() {
    action.emit('Yo!');
  }
}
```

Even in react this is a pretty straight forward pattern, assuming you don't want to use a redux style pattern.

```tsx
function ComponentB({ action }) {
    const act = useCallBack(() => {
        action('Yo!');
    }, [action]);
    return <button onClick={act}>Click me</button>
}

function ComponentA() {
    return <ComponentB action={evt => console.log('Got event ', evt)} />;
}
```

However there is another way indepentant of these frameworks you could pass state. You can emit a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) from DOM elements directly. This is the pattern that is done in Aurelia. This pattern might look like the following.

```html
<!--component-b template-->
<button click.delegate="actioned">Click me</button>
```
```js
@customElement('component-b')
@inject(Element)
export class ComponentB {
    actioned() {
        let evt = new window.CustomEvent('action', { detail: 'Yo!' });
        this.element.dispatchEvent(evt);
    }
}
```
```html
<!--Component A template-->
<component-b actioned.tigger="handle($event)">
```
```js
@customElement('component-a')
@inject(Element)
export class ComponentA {
    handle(evt) {
        console.log('Got event ', evt.detail)
    }
}
```

## Style preprocessors

In this project I used [less](https://lesscss.org/). From what I can tell less has lost a lot of popularity. Angular has embraced a similar framework [sass](https://sass-lang.com/). What React is doing seems to be constantly shifting. The last I knew JSS style frameworks like [emotion](https://emotion.sh/docs/introduction) were the popular choice. I wouldn't be suprized to find there yet another community that doesn't use a preprocessor but instead use [tailwindcss](https://tailwindcss.com/).

Looking at this particular projects usage of less, I could have dropped the preprocessor completely. Everything I needed is now handled with the introduction of [css custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Increasingly I find it hard to find a compelling case to use a css preprocessor. The base css feature set has gotten so much better over the years. Many of these abstractions should be getting phased out for native browser functionality, similar to what happened with [jQuery](https://jquery.com/) and [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).

## Accessiblity issues

One major issue I see in this project revolves around accessiblity. I found countless accessibility violations but decided to cover two.

### Button contents affect screen readers

A major violation I see a lot in this project is the continued use of `x` as the text for a button. While this looks find for many users, the screen reader experience is terrible. Here is one such example.

```html
<button class="attachment-remove" click.delegate="remove()">x</button>
```

Using the not so handy [rule guide](https://www.w3.org/TR/WCAG20-TECHS/ARIA14.html) we can see this should have been.
```html
<button class="attachment-remove" click.delegate="remove()" aria-label="remove">x</button>
```

Appling this treatment would cause the screen reader to read something closer to "button remove" instead of "button x".

### Live text

The notification system is another place where I had issues. In this application the main way of knowing if a request failed was via a failure notification. This notification was a toast that would appear on the screen after error occurred. Then it would slowly fade out. The problem with this is it didn't use a [live region](https://www.w3.org/TR/WCAG20-TECHS/ARIA19.html). Because of this it is unlikely that a screen reader would have given the user the information they needed.

Here is the example from the notification area component.

```html
<!-- Notification Area -->
<template>
    <require from="./notification-item"></require>
    <div id="notification-area" class="${notifications.length > 0 ? 'show-notification' : 'hide-notification'}">
        <notification-item repeat.for="notification of notifications" notification.bind="notification"></notification-item>
    </div>
</template>
```

A version of this that would have been compliant would be the following.

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

This project is that it was written during an interesting period in JavaScript history. [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) had recently been introduced, but [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) had not landed yet. Because of this all the asynchronous code in the project uses the promises API. This caaused some callback chaining that was very hard to follow.

```js
httpManager.get(`/sona/v1/incidents/${value.id}`).then((incident) => {
     // Process incident

     httpManager.get(`/sona/v1/incidents/${incident.id}/attachments`).then(data => {
         // process attachements
     }).catch(err => {
         // handle attachment failure
     });
 }).catch(err => {
     // handle incident failure
 });
```
The async version is a bit easier to follow and would be easier yet if the error handling in both cases was the same.

```js
try {
    const incident = await httpManager.get(`/sona/v1/incidents/${value.id}`);
    // process incident
    try {
        const data = await httpManager.get(`/sona/v1/incidents/${incident.id}/attachments`);
    }
    catch {
        // handle attachemenbt failure
    }
}
catch {
    // handle incident failure
}
```

## Tools I don't miss

Another thing I used was [webpack](https://webpack.js.org/) and [gulp](https://gulpjs.com/). Webpack in particular is powerful but it creates something that is inheritly hard to maintain. Effective use of webpack requires lots of plugins. For example if you need to ship in multiple browsers, you will need the babel plugin. The same holds true for css preprocessors like less as well as minification of javascript. Installing all of these plugins to build a web app makes coming back later hard. As time goes on plugins stop being maintained or fall out of favor. This is the inevitable nightmare I face when coming back to side project years later. Hopefully up and coming build tools like [vite](https://vite.dev/) will do a bit better but there are still plugins involved.

## Getting more specific on SONA

For the most part I have been rambling on about how the javascript ecosystem has changed. However I do think it would be beneficial to call out some specific learnings from this project.

### My Design isn't getting better

I can see I was exploring with the UI, but when I see this project it looks like a watered down version JIRA. The few bits of design flair that I tried to add where some gradients and a few animations. This project continues to show that I could use improvement on my design skills.

### Auth pain

As I mentioned before the authorization pattern was the following. First you need to login, then you will get a "token", finally you need to send that token in a `X-Sona-Token` header. This however created a  problem. If you wanted to keep the token between page refreshes you would have to find a way to store that token. What I ended up doing was managing the token manually in javascript by putting the token in localStorage. This would have been much simplier if the token was set in a cookie instead. Rhe client side javascript wouldn't have had to interact with local storage nor would it have needed custom logic in its fetch calls to make sure the header was set.

### A lack of routes

This is SPA but it barely makes use of routes. There was basically three different routes: login, incidents list, and incident. Some routes that could have been helpful would have been: a 404 page, a 401 page, and a user profile page. Not having the 404 and 401 page seems strange to me anymore.

## Closing it out

I do have many other small critiques of my code around specific css choices and some other miscellaneous issues. However, I didn't want to spend a lot of time talking about these very specific opinions.

What has stuck with me when considering Aurelia again was why I was drawn to it in the first place. It seemed reasonable that some subset of what Aurelia would become standardized in the browsers. This creates an interesting observation to me. I also enjoyed using HTMX. I know it alos [has similar asparations](https://htmx.org/essays/future/). While I hope they get trackion, this is a cautionary tale that HTMX may never make it into the standards. 

In the last 10 years the front-end ecosystem has changed massively. If you extend that period by another 10 years the changes are even more shocking. Layers of abstraction are added then removed. Configuration vs convention is a constantly evloving battle. In the meantime the browser primatives have been getting much better. A fixation on frameworks can hide this fact. On your next project try Javascript without a framework, you just might be suprized what you can do.
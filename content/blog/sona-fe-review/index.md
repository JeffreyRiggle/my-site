---
title: 'SONA frontend and changing times'
date: '2026-03-05'
---

## The face of SONA

To round out the SONA blog series, I will be focusing on the front-end. Looking back on this project, I’m reminded how quickly the front-end ecosystem evolves. A while back, I wrote a [short piece on Aurelia](https://ilusr.com/aurelia/). This piece lamented the state of Aurelia. In this blog, I will instead focus on general issues with my front-end. Much of what I noticed during my post-mortem review was patterns that have fallen out of favor and mistakes that exist regardless of framework choice.

## Event passing

In modern frameworks, the way state is passed between components is largely decided for us. This passing of state is so well abstracted in the framework that you might not realize there is a way to pass state without a framework. For example, in Angular, you can use either an event emitter or an output signal to pass state between components.

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
export class ComponentB {
  action = output<string>();
  actioned() {
    action.emit('Yo!');
  }
}
```

Even in React, this is a straightforward pattern, assuming you don't want to use a Redux-style pattern.

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
However, there is another way to pass state without these frameworks. You can emit a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) from DOM elements directly. This is the pattern used in Aurelia. This pattern looks like the following.

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

In this project, I used [Less](https://lesscss.org/). From what I can tell, Less has lost a lot of popularity. Angular has embraced a similar framework, [Sass]((https://sass-lang.com/)). What React is doing seems to be constantly shifting. The last I knew, JSS-style frameworks like [emotion](https://emotion.sh/docs/introduction) were the popular choice. I wouldn't be surprised to find another community that doesn't use a preprocessor but instead uses [TailwindCSS]((https://tailwindcss.com/)).

With how this project used Less, I could have dropped the preprocessor completely. Everything I needed is now handled with the introduction of CSS [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Increasingly, I find it hard to find a compelling case for a CSS preprocessor. The base CSS feature set has gotten better over the years. Many of these abstractions should be phased out by native browser functionality, similar to what happened with [jQuery](https://jquery.com/) and the [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) API.

## Accessibility issues

One major issue I see in this project revolves around accessibility. I found countless accessibility violations, but decided to cover two.

### Button contents affect screen readers

A major violation I see repeated in this project is the continued use of x as the text for a button. While this works for many users, the screen reader experience is terrible. Here is one such example.

```html
<button class="attachment-remove" click.delegate="remove()">x</button>
```

Using the not-so-handy [rule guide](https://www.w3.org/TR/WCAG20-TECHS/ARIA14.html), we can see this should have been.

```html
<button class="attachment-remove" click.delegate="remove()" aria-label="remove">x</button>
```

Applying this treatment would cause the screen reader to read something closer to "button remove" instead of "button x".

### Live text

The notification system is another place where I had issues. In this application, if a request failed, the user was informed by a failure notification. This notification was a toast that would appear on the screen after an error occurred. Then it would slowly fade out. The problem with this is that it didn't use a [live region](https://www.w3.org/TR/WCAG20-TECHS/ARIA19.html). Because of this, it is unlikely that a screen reader would have alerted the user to the failure.

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

This project was written during an interesting period in JavaScript history. [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) had recently been introduced, but [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) had not landed yet. As a result, all asynchronous code in the project used the Promises API. This resulted in callback chaining that was very hard to follow.

```js
httpManager.get(`/sona/v1/incidents/${value.id}`).then((incident) => {
     // Process incident

     httpManager.get(`/sona/v1/incidents/${incident.id}/attachments`).then(data => {
         // process attachments
     }).catch(err => {
         // handle attachment failure
     });
 }).catch(err => {
     // handle incident failure
 });
```

The async version is a bit easier to follow, but it would be more legible if the error handling in both cases were the same.

```js
try {
    const incident = await httpManager.get(`/sona/v1/incidents/${value.id}`);
    // process incident
    try {
        const data = await httpManager.get(`/sona/v1/incidents/${incident.id}/attachments`);
    }
    catch {
        // handle attachment failure
    }
}
catch {
    // handle incident failure
}
```

## Tools I don't miss

I also used [Webpack](https://webpack.js.org/) and [gulp](https://gulpjs.com/). Webpack, in particular, is powerful, but it creates something that is hard to maintain. Effective use of Webpack requires many plugins. For example, if you need to ship in multiple browsers, you will need the Babel plugin. The same holds true for CSS preprocessors like Less. It also applies to the minification of JavaScript. Installing all these plugins to build a web app creates a problem. Over time, plugins stop being maintained or fall out of favor. This is the inevitable nightmare I face when returning to a side project years later. Hopefully, up-and-coming build tools like [Vite](https://vite.dev/) will be better, but plugins are still involved.

## Getting more specific on SONA

For the most part, I have been rambling on about how the JavaScript ecosystem has changed. However, it would be beneficial to elaborate on some specific learnings from this project.

### My Design isn't getting better

I can see I was exploring with this UI, but when I use this project, it looks like a watered-down version of JIRA. The design flair I added was some gradients and a few animations. This project continues to showcase that I could use improvement in my design skills.

### Auth pain

As I mentioned previously, the authorization pattern involved the following. First, you need to log in. Then you will get a "token". Finally, you need to send that token in an `X-Sona-Token` header. This, however, created a problem. To keep the token between page refreshes, you had to store this token. What I ended up doing was managing the token manually in JavaScript by putting the token in localStorage. This would have been much simpler if the token had been set in a cookie instead. The client-side JavaScript wouldn't have had to interact with local storage, nor would it have needed custom logic in its fetch calls to make sure the header was set.

### A lack of routes

This is SPA, but it barely uses routes. There were three different routes: login, incidents list, and incident. Some routes that could have been helpful would have been: a 404 page, a 401 page, and a user profile page. Not having the 404 and 401 pages seems strange to me anymore.

## Closing it out

I have other critiques of my code, like specific CSS choices and some other miscellaneous issues. However, I didn't want to spend a lot of time talking about these very specific opinions.

What has stuck with me when considering Aurelia again was why I was drawn to it in the first place. It seemed reasonable that some subset of what Aurelia would become standardized in the browsers. This creates an interesting observation for me. I also enjoyed using HTMX. I know it also [has similar aspirations]((https://htmx.org/essays/future/)). While I hope they get traction, this is a cautionary tale that HTMX may never find its way into the standards.

Over the last decade, the front-end ecosystem has undergone massive change. If you extend that period by another decade, the changes are even more shocking. Layers of abstraction are added, then removed. Configuration vs convention is a constantly evolving battle. In the meantime, the browser primitives have been improving. A fixation on frameworks can hide this fact. On your next project, try JavaScript without a framework; you might be surprised at what you can do.
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

However before these frameworks you could pass state by emitting `CustomEvents` from DOM elements directly. I did find it quite interesting that this is how state passing was done in Aurelia, or at least my usage of it. Causing this sort of pattern to emerge.

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

Use the notification example https://www.w3.org/TR/WCAG20-TECHS/ARIA19.html

## Promises vs async

Observation that I used promises, maybe mention the liskov paper here

## Abstractions that you don't need

fetch is a pretty good API

## Tools I don't miss

* webpack
* gulp

## Specific pains of the client

* UI still looks primitive (not a big step up from the Java stuff)
* Putting the token in localstorage instead of on the cookie expanded risk
* Not having routes/pages for 404 and 403 seems odd to me now.

## Closing it out

* do a sign off
* make an obseravation that the front-end changes at an incredible rate.
* draw link between Aurelia and HTMX (hopefully htmx doesn't fail the standards check)
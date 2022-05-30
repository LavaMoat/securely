const objects = require('./objects');
const prototypes = require('./prototypes');
const specifics = require('./specifics');

let allowNativesAccess = false;

function shouldAllowNativesAccess() {
    return allowNativesAccess;
}

function natively(win, cb) {
    const ifr = win.document.createElement('iframe');
    win.document.head.appendChild(ifr);
    cb(ifr.contentWindow);
    ifr.parentElement.removeChild(ifr);
}

function securely(cb, a, b, c, d, e, f, g, h, i, j) {
    const state = allowNativesAccess;

    allowNativesAccess = true;

    let ret, err;
    try {
        ret = cb(a, b, c, d, e, f, g, h, i, j);
    } catch (e) {
        err = e;
    }

    if (!state) {
        allowNativesAccess = false;
    }

    if (err) {
        throw err;
    }

    return ret;
}

function secure(win, config = { objects: {}, prototypes: {}}) {
    natively(win, (nativeWin) => {
        securely(() => {
            objects(win, nativeWin, shouldAllowNativesAccess, config.objects || {});
            prototypes(win, nativeWin, shouldAllowNativesAccess, config.prototypes || {});
            specifics(win, nativeWin, shouldAllowNativesAccess);
        });
    });

    return securely;
}

module.exports = secure;
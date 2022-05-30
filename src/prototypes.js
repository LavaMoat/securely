function zzz(func, shouldAllowNativesAccess) {
    return function(a, b, c, d, e) {
        if (!shouldAllowNativesAccess()) {
            return;
        }

        return func(this, a, b, c, d, e);
    };
}

function xxx(nativeWin, desc, shouldAllowNativesAccess) {
    const value = desc.value;
    const set = desc.set || (() => {});
    const get = desc.get || (() => value);

    desc.configurable = false;

    delete desc.value;
    delete desc.writable;

    const getter = nativeWin['Function'].prototype.call.bind(get);
    const setter = nativeWin['Function'].prototype.call.bind(set);

    desc.get = zzz(getter, shouldAllowNativesAccess);
    desc.set = zzz(setter, shouldAllowNativesAccess);

    return desc;
}

function yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype, property) {
    let proto = win[prototype];
    const arr = [];
    while (true) {
        const desc = nativeWin['Object'].getOwnPropertyDescriptor(proto.prototype, property);
        nativeWin['Array'].prototype.push.call(arr, proto.prototype);
        if (desc) {
            break;
        }
        proto = nativeWin['Object'].getPrototypeOf(proto.prototype).constructor;
    }
    const desc = nativeWin['Object'].getOwnPropertyDescriptor(arr[arr.length - 1], property);
    while (arr.length) {
        const proto = nativeWin['Array'].prototype.pop.call(arr);
        if (!done[proto.constructor.name] || !nativeWin['Array'].prototype.includes.call(done[proto.constructor.name], property)) {
            nativeWin['Object'].defineProperty(proto, property + 'S', xxx(nativeWin, desc, shouldAllowNativesAccess));
            done[proto.constructor.name] = done[proto.constructor.name] || [];
            nativeWin['Array'].prototype.push.call(done[proto.constructor.name], property);
        }
    }
}

module.exports = function prototypes(win, nativeWin, shouldAllowNativesAccess, prototypes) {
    const done = new nativeWin.Object();
    for (const prototype in prototypes) {
        const native = nativeWin[prototype];
        nativeWin['Object'].defineProperty(win, prototype + 'S', {
            configurable: false,
            get: function() {
                if (!shouldAllowNativesAccess()) {
                    return;
                }

                return native;
            }
        });
        done[prototype] = done[prototype] || [];
        const properties = prototypes[prototype];
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype, property);
            yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype + 'S', property);
        }
    }
}
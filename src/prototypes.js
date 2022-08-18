function method(func, shouldAllowNativesAccess) {
    return function(a, b, c, d, e) {
        if (!shouldAllowNativesAccess()) {
            return;
        }

        return func(this, a, b, c, d, e);
    };
}

function descriptor(nativeWin, desc, shouldAllowNativesAccess) {
    const value = desc.value;
    const set = desc.set || (() => {});
    const get = desc.get || (() => value);

    desc.configurable = false;

    delete desc.value;
    delete desc.writable;

    const getter = nativeWin['Function'].prototype.call.bind(get);
    const setter = nativeWin['Function'].prototype.call.bind(set);

    desc.get = method(getter, shouldAllowNativesAccess);
    desc.set = method(setter, shouldAllowNativesAccess);

    return desc;
}

function prototype(win, nativeWin, done, shouldAllowNativesAccess, prototype, property) {
    let proto = win[prototype];
    const arr = new nativeWin.Array();
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
            nativeWin['Object'].defineProperty(proto, property + 'S', descriptor(nativeWin, desc, shouldAllowNativesAccess));
            done[proto.constructor.name] = done[proto.constructor.name] || new nativeWin.Array();
            nativeWin['Array'].prototype.push.call(done[proto.constructor.name], property);
        }
    }
}

module.exports = function prototypes(win, nativeWin, shouldAllowNativesAccess, prototypes) {
    const done = new nativeWin.Object();
    for (const proto in prototypes) {
        const native = nativeWin[proto];
        nativeWin['Object'].defineProperty(win, proto + 'S', {
            configurable: false,
            get: function() {
                if (!shouldAllowNativesAccess()) {
                    return;
                }

                return native;
            }
        });
        done[proto] = done[proto] || new nativeWin.Array();
        const properties = prototypes[proto];
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            prototype(win, nativeWin, done, shouldAllowNativesAccess, proto, property);
            prototype(win, nativeWin, done, shouldAllowNativesAccess, proto + 'S', property);
        }
    }
}
module.exports = function objects(win, nativeWin, shouldAllowNativesAccess, objects) {
    for (const object in objects) {
        const apis = objects[object];
        for (let i = 0; i < apis.length; i++) {
            const api = apis[i];
            let native = nativeWin[object][api];
            if (typeof native === 'function') {
                native = native.bind(win[object]);
            }
            nativeWin['Object'].defineProperty(win[object], api + 'S', {
                configurable: false,
                get: function () {
                    if (!shouldAllowNativesAccess()) {
                        return;
                    }

                    return native;
                },
            });
        }
    }
}
module.exports = function specifics(win, nativeWin, shouldAllowNativesAccess) {
    let getDocumentCurrentScript = nativeWin['Object'].getOwnPropertyDescriptor(win.Document.prototype, 'currentScript').get.bind(win.document);
    nativeWin['Object'].defineProperty(win.document, 'currentScript' + 'S', {
        configurable: false,
        get: function() {
            if (!shouldAllowNativesAccess()) {
                return;
            }

            return getDocumentCurrentScript();
        }
    });
}
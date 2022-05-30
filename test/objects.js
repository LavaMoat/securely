const config = require('./config');
const setup = require('./index');

describe('test secured objects', async () => {
    before(setup.bind(null, config));

    it('should successfully create and access native objects', async () => {
        const result = await browser.execute(function(config, debug) {
            if (debug) debugger;
            return SECURELY(() => {
                for (const object in config.objects) {
                    const properties = config.objects[object];
                    for (let i = 0; i < properties.length; i++) {
                        const property = properties[i];
                        if (undefined === window[object][property + 'S']) {
                            return false;
                        }
                    }
                }
                return true;
            })
        }, config, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe(true);
    });

    it('should successfully create a native version of window.fetch', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            return SECURELY(() => {
                return window.fetchS + '';
            })
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe('function () { [native code] }');
    });

    it('should successfully create a native version of document.createElement', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            document.createElement = function(tag) {
                return { tagName: 'XXX' };
            }
            const fake = document.createElement('a');
            const real = SECURELY(() => {
                return document.createElementS('a');
            });
            if (fake.tagName !== 'XXX') {
                return false;
            }
            if (real.tagName !== 'A') {
                return false;
            }
            if (document.createElementS) {
                return false;
            }
            return true;
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe(true);
    });
});
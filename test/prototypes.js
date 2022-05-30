const config = require('./config');
const setup = require('./index');

describe('test secured prototypes', async () => {
    before(setup.bind(null, config));

    it('should successfully create and access native prototypes', async () => {
        const result = await browser.execute(function(config, debug) {
            if (debug) debugger;
            return SECURELY(() => {
                for (const object in config.prototypes) {
                    const properties = config.prototypes[object];
                    for (let i = 0; i < properties.length; i++) {
                        const property = properties[i];
                        if (!Object.getOwnPropertyDescriptor(window[object].prototype, property + 'S')) {
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
                return [].includesS + '';
            })
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe('function includes() { [native code] }');
    });

    it('should successfully create a native version of Map.prototype.set', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            Object.defineProperty(Map.prototype, 'set', {value: () => 1});
            const map = new Map();
            map.set('a', '2');
            SECURELY(() => {
                map.setS('b', '3');
            });
            if (map.get('a') === '2') {
                return false;
            }
            if (map.get('b') !== '3') {
                return false;
            }
            if (Map.prototype.setS) {
                return false;
            }
            return true;
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe(true);
    });
});
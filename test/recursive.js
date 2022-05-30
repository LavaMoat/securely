const config = require('./config');
const setup = require('./index');

describe('test recursive calls for securely', async () => {
    before(setup.bind(null, config));

    it('should work even when securely is called recursively', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            if (document.createElementS) {
                return false;
            }
            const res = SECURELY(() => {
                if (!document.createElementS) {
                    return false;
                }
                const res = SECURELY(() => {
                    if (!document.createElementS) {
                        return false;
                    }
                    return true;
                });
                if (!res) {
                    return false;
                }
                if (!document.createElementS) {
                    return false;
                }
                return true;
            });
            if (!res) {
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
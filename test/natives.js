const setup = require('./index');

describe('test natives overwrites', async () => {
    before(setup.bind(null, {}, false));

    it('should work even when natives used by securely are modified', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            return false;
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe(true);
    });
});
const setup = require('./index');

describe('test without Securely', async () => {
    before(setup.bind(null, {}, false));

    it('should successfully verify fetchS does not exist', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            return window.fetchS;
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe(null);
    });

    it('should succeed overwrite fetchS', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            Object.defineProperty(window, 'fetchS', {value: 1});
            return window.fetchS;
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe(1);
    });
});
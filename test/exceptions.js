const config = require('./config');
const setup = require('./index');

describe('test exceptions handling by securely', async () => {
    before(setup.bind(null, config));

    it('should throw exceptions thrown by secured operation', async () => {
        const result = await browser.execute(function(debug) {
            if (debug) debugger;
            return SECURELY(() => {
                try {
                    const a = document.createElementS(1);
                } catch (e) {
                    return e.message;
                }
            })
        }, false); // change to 'true' in order to break on the beginning of this test in the browser
        expect(result).toBe('Failed to execute \'createElement\' on \'Document\': The tag name provided (\'1\') is not a valid name.');
    });
});
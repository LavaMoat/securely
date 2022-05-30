const fs = require('fs');
const path = require('path');

const securely = fs.readFileSync(path.join(__dirname, '../securely.prod.js')).toString();

module.exports = async function setup(config = {}, injectSECURELY = true) {
    await browser.url(`https://facebook.com/`);

    if (!injectSECURELY) return;

    // inject SECURELY
    await browser.execute(function(js) {
        const script = document.createElement('script');
        script.textContent = js;
        document.head.appendChild(script);
    }, securely);

    // use SECURELY to disable atob
    await browser.execute(function(config) {
        top.SECURELY = SECURE(window, config);
    }, config);
}
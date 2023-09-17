const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://coinmarketcap.com/currencies/ethereum/');

    let usd_value;
    try {
        usd_value = await page.$eval('span.sc-16891c57-0.dxubiK.base-text', element => element.innerHTML);
    } catch (error) {
        console.error("Could not find price, closing browser session.");
        return await browser.close();
    }
    
    let usd_value_int = parseInt(usd_value.replace(/[^0-9\.]+/g, ""));
    const content = {
        "price": usd_value_int
    };

    fs.writeFile('./files/eth-price.json', JSON.stringify(content), error => {
        if (error) { return console.error(error); }
        return console.log('Price scraped and saved as eth-price.json');
    });
    await browser.close();
})();
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://www.myproperty.co.za/search?last=1y&office%5Bid%5D=1002&office%5Bname%5D=Preferental%20Platform&office%5Bsid%5D=20&page=1")

let price = await page.evaluate(() => {
  return Array.from(document.querySelectorAll("card property-card")).map(x => x.getAttribute('href'))
})

  console.log("price", price);

  await browser.close()
}

start()
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

exports.startMyPropertyScraping = async (req, res) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.myproperty.co.za/search?agent=Preferental%20Platform', {
    waitUntil: 'load',
    // Remove the timeout
    timeout: 0
  })


  let pagination = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".pagination")).map(x => x.textContent)
  })
  console.log(pagination);

  pagination = pagination.toLocaleString()

  await browser.close();
}
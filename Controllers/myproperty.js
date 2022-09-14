const puppeteer = require("puppeteer")
const fs = require("fs/promises")

exports.startMyPropertyScraping = async (req, res) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()  
  // await page.goto("https://www.myproperty.co.za/agents/preferental-platform-510359")
  await page.goto("https://www.myproperty.co.za/search?agent=Preferental%20Platform")

  page.evaluate((_) => window.scrollBy(0, 1000));
  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 5000));

  let property = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".card__favorite")).map(x => x.getAttribute('data-ref'))
  })

  console.log("property check: ", property);

  await browser.close()
}
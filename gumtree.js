// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://www.property24.com/to-rent/agency/preferental-platform/preferental-platform/233159")
//   await page.goto("https://learnwebcode.github.io/practice-requests/")

//   const names = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)
//   })

// const price = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll(".p24_price")).map(x => x.textContent)
//   }) 
let price = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_price")).map(x => x.textContent)
  })

  console.log("price", price);

  await browser.close()
}

start()
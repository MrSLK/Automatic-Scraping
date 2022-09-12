const puppeteer = require("puppeteer")
const fs = require("fs/promises")

let link = 'https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p'
let toPass;
let price = [];
async function start() {
  let limiter = await getRep()

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let i = 1; i <= limiter; i++) {

    toPass = link + i
    console.log("toPass: ", toPass);
    await page.goto(toPass)

    let temp = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".related-ad-title")).map(x => x.getAttribute('href'))
    })
    price.push(temp)
    
    console.log("price", price);
    console.log("Array of hrefs", temp.length);

    for (let x = 0; x < temp.length; x++) {
      console.log("href",temp[x]);
      await scrape(temp[x])
    }

  }
  await browser.close()
}

async function scrape(latestLink) {
  let defaultLink = 'https://www.gumtree.co.za'
  let newLink = defaultLink + latestLink
  console.log("New link", newLink);

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(newLink)

  let desc = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".phoneclick-increment")).map(x => x.getAttribute('href'))
  })

  desc = desc.toLocaleString()

  var numb = desc.match(/\d/g);
  console.log("numb", numb);
  numb = numb.join("");

  let prefNumber = `Pref${numb}`;

  console.log("prefNumber", prefNumber);

  await browser.close()
}


async function getRep() {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p1')

  let pagination = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".page-box")).map(x => x.textContent)
  })

  pagination = pagination.toLocaleString()
  let pricePagination = pagination.split(',').pop();

  await browser.close()

  return pricePagination
}

start()
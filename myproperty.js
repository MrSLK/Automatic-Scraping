const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://www.myproperty.co.za/agents/preferental-platform-510359")

  page.evaluate((_) => window.scrollBy(0, 1000));
  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 5000));

  let property = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".card__favorite")).map(x => x.getAttribute('data-ref'))
  })

  console.log("property check: ", property);


  //   await fs.writeFile("names.txt", names.join("\r\n"))

  //   await page.click("#clickme")
  //   const clickedData = await page.$eval("#data", el => el.textContent)
  //   console.log(clickedData)

  //   const photos = await page.$$eval("img", imgs => {
  //     return imgs.map(x => x.src)
  //   })

  //   await page.type("#ourfield", "blue")
  //   await Promise.all([page.click("#ourform button"), page.waitForNavigation()])
  //   const info = await page.$eval("#message", el => el.textContent)

  //   console.log(info)

  //   for (const photo of photos) {
  //     const imagepage = await page.goto(photo)
  //     await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())
  //   }

  await browser.close()
}

start()
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
const title = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_title")).map(x => x.textContent)
  })
  const location = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_location")).map(x => x.textContent)
  })
  const address = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_address")).map(x => x.textContent)
  })
  const description = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_excerpt")).map(x => x.textContent)
  })
  const size = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_size")).map(x => x.textContent)
  })
  const bathroom = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_bathroomIcon")).map(x => x.textContent)
  })
  var bedroom = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_featureDetails")).map(x => x.textContent)
  })

  const runDate = new Date(Date.now())

  let newMe = [];
  let tempBed = []
  let newBed = []
  let tempBath = []
  let newSize = []
  let tempSize = []

  for (let i = 3; i < price.length; i++) {

    newMe[i - 3] = price[i].toString()
    newMe[i - 3] = newMe[i - 3].toString().replace(/\s/g, '').substring(1);
  }

  for(let x = 0; x < bedroom.length; x++) {
    bedroom[x] = bedroom[x].toString();
    tempBed[x] = bedroom[x].toString().match(/(\d+)/);
    tempBed[x] = tempBed[x].toString().substring(2);
  }

  let temp;
  for(let p = 0; p < tempBed.length; p++) {

    if(p % 2 === 0) {
      temp = tempBed[p]
    tempBath.push(tempBed[p]);
    } else {
      temp = tempBed[p]
      newBed.push(tempBed[p]);
    }
      
  }


  for(let x = 0; x < size.length; x++) {
    size[x] = size[x].toString();
    
    newSize[x] = size[x].toString().match(/(\d+)/);
    tempSize[x] = newSize[x].toString().substring(2);
  }

  console.log("Execution time", runDate);
  console.log("price", newMe);
  console.log("title", title);
  console.log("location", location);
  console.log("address", address);
  // console.log("description", descriptlsion);
  console.log("Bedroom", newBed);
  console.log("Bathroom", tempBath);
  console.log("size:",tempSize);


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
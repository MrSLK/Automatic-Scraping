// const request = require('request');
// const cheerio = require('cheerio');
// const fs = require('fs');

// //Detemines how many times . appears in a string 
// function count(str, find) {
//     return (str.split(find)).length - 1;
// }
// // Headers
// // writeStream.write('[ \n');
// let link = 'https://www.myproperty.co.za/search?last=1y&office%5Bid%5D=1002&office%5Bname%5D=Preferental%20Platform&office%5Bsid%5D=20&page='
// // for (let x = 1; x < 999; x++) {
//     request(`${link}1`, (err, response, html) => {

//         console.log("This is called");
//         if (!err) {
//             const $ = cheerio.load(html)
//             //Get other files
//             $('.cards').each((index, elem) => {
//                 const title =$(elem).attr('a')
//                 console.log("Title: ", title);

//             });


//             // $('.pagination').each((index, elem) => {
//             //     const pages = $(elem).find('.pageNumber').text()
//             //     max = pages.substring(pages.indexOf('7') + 1, pages.indexOf('Next'))
//             //     mogs = parseInt(max)
//             //     console.log("from pagination: ", mogs)

//             // });
//         }
//     });
// // }


// in a new folder be sure to run "npm init -y" and "npm install puppeteer" container container_type_global-grid 
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
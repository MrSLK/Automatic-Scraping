const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('properties by preferental.json')

//Detemines how many times . appears in a string 
function count(str, find) {
  return (str.split(find)).length - 1;
}
// Headers
// writeStream.write('[ \n');
// let link = 'https://www.privateproperty.co.za/estate-agency/preferental/rental-listings/10490'
let link = 'https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p'
let individual_links = []
let property_link;
let default_link = 'https://www.gumtree.co.za'
// let prefId;
//  for (let x = 0; x < 999; x++) {

//  }

function scrape() {

  for (let i = 1; i < 20; i++) {
    request(`${link}${i}`, (err, response, html) => {
      
      if (!err) {
        const $ = cheerio.load(html)
  
        //Get other files
        $('.related-ad-title').each((index, elem) => {
          var url = $(elem).attr('href')
          individual_links.push(url)
  
  
          // console.log("individual_links:", individual_links);
          property_link = default_link + individual_links[i]
          request(property_link, (err, response, html) => {
            if (!err) {
              const p = cheerio.load(html)
  
              //Get other files
              p('.description-content').each((index, el) => {
                var prefId = p(el).children('span').children('.phoneclick-increment ').children('a').children('href')
                // console.log("Im calling u");
                console.log("PrefID: ", prefId);
              });

            }
          });
        });
        // $('.pagination').each((index, elem) => {
        //     const pages = $(elem).find('.pageNumber').text()
        //     max = pages.substring(pages.indexOf('7') + 1, pages.indexOf('Next'))
        //     mogs = parseInt(max)
        //     console.log("from pagination: ", mogs)
  
        // });
      }
    });
  }
}

scrape();

// // in a new folder be sure to run "npm init -y" and "npm install puppeteer"
// const puppeteer = require("puppeteer")
// const fs = require("fs/promises")

// async function start() {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   await page.goto("https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p1")

// let price = await page.evaluate(() => {
//     return Array.from(document.getElementsByClassName('.title title-mult-lines')).map(x => x.textContent)
//   })

//   console.log("price", price);

//   await browser.close()
// }

// start()
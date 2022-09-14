// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
const puppeteer = require("puppeteer")
const db = require("../Models");
const Property24 = db.property24;

exports.startProperty24Scraping = async (req, res) => {
  
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://www.property24.com/to-rent/agency/preferental-platform/preferental-platform/233159/p1")
 
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
  console.log();
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
  let fullAddress = [];
  let tempAdd;

  console.log("price", price[3]);
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

  for (let a = 0; a <address.length; a++) {
    tempAdd = address[a] + ', ' +  location[a]
    fullAddress.push(tempAdd);
  }

  let data = {
    price: '',
    title: '',
    address: '',
    bedroom: '',
    bathroom: '',
    size: ''
  }
  let properties = []

  for (let b = 0; b < 30; b++) {
    data = {
      price: newMe[b],
      title: title[b],
      address: fullAddress[b],
      bedroom: newBed[b],
      bathroom: tempBath[b],
      size: tempSize[b]
    }
  
    await Property24.save(data).then((response) => {
      if (response) {
        res.status(201).send("Property24 loaded to db!");
      } else {
        res.status(201).send("Property24 not loaded to db!");
      }
    }).catch((err) => {          
      console.log(err);
    });

    properties.push(data);
  }
  
  console.log("Property", properties)

  await browser.close()
}

// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
const puppeteer = require("puppeteer")
const db = require("../Models");
const Property24 = db.property24;

let data = {
  newPrice: '',
  newSize: '',
  fullAddress: '',
  propertyType: '',
  title: '',
  runDate: ''
}

const startProperty24 = async (req, res) => {

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
  const size = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_size")).map(x => x.textContent)
  })

  let fullAddress = [], newPrice = [], newSize = [], propertyType = [], tempPropertyType, tempSize, tempAdd;
  for (let i = 3; i < size.length; i++) {
    tempSize = size[i].replace(/[\r\n]/gm, '');
    tempSize = tempSize.trim();
    // newSize.push(tempSize);
  }

let lastWord;
  for (let x = 0; x < title.length; x++) {
    lastWord = title[x].split(' ').pop();
    propertyType.push(lastWord);
  }

  for (let a = 0; a < address.length; a++) {
    tempAdd = address[a] + ', ' + location[a]
    fullAddress.push(tempAdd);
  }

  for (let i = 3; i < price.length; i++) {

    newPrice.push(price[i].toString().replace(/\s/g, '').substring(1));
  }

  for (let a = 0; a < address.length; a++) {
    tempAdd = address[a] + ', ' + location[a]
    fullAddress.push(tempAdd);
  }


  let properties = []

  const runDate = new Date(Date.now())

  for (let b = 0; b < price.length; b++) {
    data = {
      newPrice: newPrice[b],
      newSize: newSize[b],
      fullAddress: fullAddress[b],
      propertyType: propertyType[b],
      title: title[b],
      runDate: runDate
    }

    const property24 = new Property24({
      newPrice: newPrice[b],
      newSize: newSize[b],
      fullAddress: fullAddress[b],
      propertyType: propertyType[b],
      title: title[b],
      runDate: runDate
    });
    // const uploadedProperty = await property24.save(property24);

    properties.push(data);
    
  }
  await browser.close()

  return properties;
}

exports.startProperty24Scraping = async (req, res) => {
  const props = await startProperty24();
  console.log("All properties", props);

  return res.status(200).send(props)
}

exports.getAllProperty24Data = (req, res) => {

  Property24.find({}).then((response) => {
    console.log("Response", response);

    if(response.length > 0){

      return res.status(201).json(response);
    } else {
      return res.status(400).json({message: "No data found"});
    }
  }).catch((err) => {
    console.log(err);
  });
}

exports.getCounter = (req, res) => {
  const counter = Property24.find({}).count();
  console.log("Property24 counter", counter);
}
const db = require("../Models");
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

const Gumtree = db.gumtree;

let link = 'https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p'
let toPass;
let price = [];
let prefs = [];

exports.startGumtreeScraping = async (req, res) => {

  let limiter = await getRep()
  console.log("Limiter:", limiter);

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let i = 1; i <= limiter; i++) {

    toPass = link + i
    console.log("toPass: ", toPass);
    await page.goto(toPass, {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
    });


    let temp = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".related-ad-title")).map(x => x.getAttribute('href'))
    })
    price.push(temp)

    console.log("price", price);
    console.log("Array of hrefs", temp.length);

    let tempLink, tempPrefNum;
    for (let x = 0; x < temp.length; x++) {
      console.log("href", temp[x]);
      tempLink = temp[x];
      tempPrefNum = await scrape(tempLink)

      console.log("prefNumber", tempPrefNum);

      const gumtree = new Gumtree({
        prefNumber: tempPrefNum
      });

      await gumtree.save(gumtree).then((response) => {
        console.log(response);
      }).catch((err) => {
        console.log(err);
      });

      prefs.push(tempPrefNum);
    }

    console.log("All prefNumbers", prefs);

  }
  await browser.close()
}

async function getRep() {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p1', {
    waitUntil: 'load',
    // Remove the timeout
    timeout: 0
  })

  let pagination = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".page-box")).map(x => x.textContent)
  })

  pagination = pagination.toLocaleString()
  let pricePagination = pagination.split(',').pop();

  await browser.close()

  return pricePagination
}

async function scrape(latestLink) {
  let defaultLink = 'https://www.gumtree.co.za'
  let newLink = defaultLink + latestLink
  console.log("New link", newLink);

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(newLink, {
    waitUntil: 'load',
    // Remove the timeout
    timeout: 0
  })

  let desc = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".phoneclick-increment")).map(x => x.getAttribute('href'))
  })

  console.log("desc", desc);
  desc = desc.toLocaleString()

  var numb = desc.match(/\d/g);
  console.log("numb", numb);
  if (numb != null) {
    numb = await numb.join("");
  }

  let prefNumber = `Pref${numb}`;

  await browser.close();

  return prefNumber;
}

exports.getAllGumtreeData = (req, res) => {

  Gumtree.find({}).then((response) => {
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

exports.getCounterGumtree = (req, res) => {

  Gumtree.count({}).then((response) => {
    console.log("Gumtree counter", response);
    return res.status(200).json(response)
  }).catch((error) => {
    console.log(error);
  })
}
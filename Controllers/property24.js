// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
const puppeteer = require("puppeteer")
const db = require("../Models");
const Property24 = db.property24;

let data = {
  price: '',
  size: '',
  address: '',
  propertyType: '',
  title: '',
  runDate: ''
}

const mainLink = "https://www.property24.com/to-rent/agency/preferental-platform/preferental-platform/233159/p1"

const startProperty24 = async () => {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(mainLink)

  const pagination = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".pagination")).map(x => x.textContent)
  })

  let pages = [], tempLength;
  for (let i = 0; i < pagination.length; i++) {
    pages.push(pagination[i].toString().replace(/\s/g, '').substring(1));
  }

  tempLength = pages[0];
  tempLength = tempLength.charAt(tempLength.length-1)
  tempLength = parseInt(tempLength)

   await browser.close()

   return tempLength;
}

const startScraping = async (link) => {

  const browser = await puppeteer.launch()
  const p = await browser.newPage()
  await p.goto(link)

  let price = await p.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_price")).map(x => x.textContent)
  })
  const title = await p.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_title")).map(x => x.textContent)
  })
  const location = await p.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_location")).map(x => x.textContent)
  })
  const address = await p.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_address")).map(x => x.textContent)
  })
  const size = await p.evaluate(() => {
    return Array.from(document.querySelectorAll(".p24_size")).map(x => x.textContent)
  })

  let fullAddress = [], newPrice = [], newSize = [], propertyType = [], tempSize, tempAdd, lastWord;
  for (let i = 3; i < size.length; i++) {
    tempSize = size[i].replace(/[\r\n]/gm, '');
    tempSize = tempSize.trim();
    newSize.push(tempSize);
  }

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

  propertyType.pop();

  const runDate = new Date(Date.now())

  for (let b = 0; b < address.length; b++) {
    data = {
      price: newPrice[b],
      size: newSize[b],
      address: fullAddress[b],
      propertyType: propertyType[b],
      title: title[b],
      runDate: runDate
    }

    const property24 = new Property24({
      price: newPrice[b],
      size: newSize[b],
      address: fullAddress[b],
      propertyType: propertyType[b],
      title: title[b],
      runDate: runDate
    });
    console.log("property24:", property24);
    property24.save(data).then((result) => {
      console.log("result", result);
    }).catch((error) => {
      console.log(error);
    })
  }
}

exports.startProperty24Scraping = async (req, res) => {
  let pages = await startProperty24();
  let link;

  console.log("How many times to loop", pages);
  for (let i = 1; i <= pages; i++) {
    link = `https://www.property24.com/to-rent/agency/preferental-platform/preferental-platform/233159/p${i}`;
    await startScraping(link);
  }

  return res.status(200).send("Successfully scraped property24");
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

exports.getCounterProperty24 = (req, res) => {

    Property24.count({}).then((response) => {
      console.log("Property24 counter", response);
      return res.status(200).json(response)
    }).catch((error) => {
      console.log(error);
    })
}

exports.findDuplicates = (req, res) => {
  let results = [];
  Property24.aggregate([
      {
        $group: {
          // collect ids of the documents, that have same value 
          // for a given key ('val' prop in this case)
          _id: '$fullAddress',
          ids: {
            $push: '$_id'
          },
          // count N of duplications per key
          totalIds: {
            $sum: 1,
          }
        }
      },
      {
        $match: {
          // match only documents with duplicated value in a key
          totalIds: {
            $gt: 1,
          },
        },
      },
      {
        $project: {
          _id: false,
          documentsThatHaveDuplicatedValue: '$ids',
        }
      },
    ]).then((response) => {

      if(response) {
          for(let x = 0; x < response.length; x++){
              for(let p = 1; p < response[x].documentsThatHaveDuplicatedValue.length; p++){
               let id = response[x].documentsThatHaveDuplicatedValue[p]
               Property24.deleteOne({"_id": id}).then((shiba) => {
               console.log("From: ", shiba)
               results.push(shiba);
           }).catch((err) => (console.log(err)))
              }
          }
          // return results
          return res.status(201).send("Removed duplicates")
      } else {
          // return "Failed to delete duplicates"
          return res.status(400).json(response)
      }
  }).catch((err) => {
      console.log(err);
  });
}
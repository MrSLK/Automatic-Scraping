const db = require("../Models");
const playwright = require("playwright")
const Gumtree = db.gumtree;
const runDate = new Date(Date.now())

let link = 'https://www.gumtree.co.za/u-seller-listings/preferental-platform/v1u114570700p'
let toPass;
let price = [];

exports.startGumtreeScraping = async (req, res) => {

  let myArr = [];
  const prefs = await Gumtree.find({});

  for (let i = 0; i < prefs.length; i++) {
    myArr.push(prefs[i].prefNumber)
  }

  let limiter = await getRep();

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  for (let i = 1; i <= limiter; i++) {

    toPass = link + i;
    await page.goto(toPass, {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
    });

    let temp = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".related-ad-title")).map(x => x.getAttribute('href'))
    })
    price.push(temp);

    let tempLink, tempPrefNum;
    for (let x = 0; x < temp.length; x++) {
      tempLink = temp[x];
      tempPrefNum = await scrape(tempLink);

      const gumtree = new Gumtree({
        prefNumber: tempPrefNum,
        link: `https://www.gumtree.co.za${tempLink}`,
        runDate: runDate
      });

      if (myArr.includes(tempPrefNum)) {
        // console.log("Already uploaded", tempPrefNum);
      } else {
        await gumtree.save(gumtree).then((response) => {
          // console.log(response);
        }).catch((err) => {
          console.log(err);
        });

      }
    }

  }
  await browser.close()

  let deletedProperties = [];
  Gumtree.aggregate([
    {
      $group: {
        // collect ids of the documents, that have same value 
        // for a given key ('val' prop in this case)
        _id: '$prefNumber',
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

    if (response) {
      for (let x = 0; x < response.length; x++) {
        for (let p = 1; p < response[x].documentsThatHaveDuplicatedValue.length; p++) {
          let id = response[x].documentsThatHaveDuplicatedValue[p]
          Gumtree.deleteOne({ "_id": id }).then((results) => {
            deletedProperties.push(results);
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

async function getRep() {

  const browser = await playwright.chromium.launch()
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

  await browser.close();

  return pricePagination
}

async function scrape(latestLink) {
  let defaultLink = 'https://www.gumtree.co.za'
  let newLink = defaultLink + latestLink;

  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  await page.goto(newLink, {
    waitUntil: 'load',
    // Remove the timeout
    timeout: 0
  })

  let desc = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".phoneclick-increment")).map(x => x.getAttribute('href'))
  })

  desc = desc.toLocaleString()

  var numb = desc.match(/\d/g);
  if (numb != null) {
    numb = await numb.join("");
  }

  let prefNumber = `Pref${numb}`;
  if (prefNumber.length > 12) {
    prefNumber = prefNumber.substring(0, 12)
  }

  await browser.close();

  return prefNumber;
}

exports.getAllGumtreeData = (req, res) => {

  Gumtree.find({}).then((response) => {
    if (response.length > 0) {
      return res.status(201).json(response);
    } else {
      return res.status(400).json({ message: "No data found" });
    }
  }).catch((err) => {
    console.log(err);
  });
}

exports.getCounterGumtree = (req, res) => {
  Gumtree.aggregate( [
    { $count: "myCount" }
 ]).then((response) => {
  if (response.length > 0) {
    return res.status(201).json(response[0].myCount);
  } else {
    return res.status(400).json({ message: "No data found" });
  }
}).catch((err) => {
  console.log(err);
});
}
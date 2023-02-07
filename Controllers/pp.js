const playwright = require("playwright");
const db = require("../Models");
const PP = db.pp;
const runDate = new Date(Date.now())

const link = 'https://www.privateproperty.co.za/estate-agency/preferental/rental-listings/10490?page='
exports.pp = async (req, res)  => {

    let myArr = [];
    const prefs = await PP.find({});
  
    for (let i = 0; i < prefs.length; i++) {
      myArr.push(prefs[i].prefNumber)
    }  
    let limiter = await getRep();
    const browser = await playwright.chromium.launch()
    const page = await browser.newPage()
  
    for (let i = 1; i <= limiter; i++) {
      
      toPass = link + i;
      
      await page.goto(toPass, {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
      });
  
      let temp = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".listingResult")).map(x => x.getAttribute('href'))
      })
      
      let tempLink, tempPrefNum;
      for (let x = 0; x < temp.length; x++) {
        tempLink = temp[x];
        tempPrefNum = await scrape(tempLink);
  
        const pp = new PP({
          prefNumber: tempPrefNum,
          link: `https://www.privateproperty.co.za${tempLink}`,
          runDate: runDate
        });
  
        if (myArr.includes(tempPrefNum)) {
          // console.log("Already uploaded", tempPrefNum);
        } else {
          await pp.save(pp).then((response) => {
            // console.log(response);
          }).catch((err) => {
            console.log(err);
          });
  
        //   return response.status(201).send("Successfully scraped");
        }
      }
  
    }
    await browser.close()
  }
  
  async function getRep() {
  
    const browser = await playwright.chromium.launch()
    const page = await browser.newPage()
    // Configure the navigation timeout
    await page.goto('https://www.privateproperty.co.za/estate-agency/preferental/rental-listings/10490', {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
    })
  
    let pagination = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".pageNumberText")).map(x => x.textContent)
    })
  
    pagination = pagination.toLocaleString()
    let pricePagination = pagination.split(',').pop();
  
    await browser.close();
  
    return pricePagination.charAt(pricePagination.length-1)
  }

  async function scrape(latestLink) {
    // console.log("Function scrape", latestLink);
    let defaultLink = 'https://www.privateproperty.co.za'
    let newLink = defaultLink + latestLink;
    // console.log("new link: ", newLink);
  
    const browser = await playwright.chromium.launch()
    const page = await browser.newPage()
    await page.goto(newLink, {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
    })
  
    let desc = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".seeMoreContainer")).map(x => x.textContent)
    })
  
    let myString = desc[0].substring(desc[0].search(/Pref/));
  
    return myString.slice(0,12);
  }

  exports.getAllPPData = (req, res) => {

    PP.find({}).then((response) => {
      // console.log("Response", response);
  
      if (response.length > 0) {
  
        return res.status(201).json(response);
      } else {
        return res.status(400).json({ message: "No data found" });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  
  exports.getCounterPP = (req, res) => {
  
    PP.aggregate( [
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
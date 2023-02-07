const playwright = require("playwright");
const db = require("../Models");
const Prop24 = db.prop24;
const runDate = new Date(Date.now())

const link = 'https://www.property24.com/to-rent/agency/preferental-platform/preferental-platform/233159/p'
exports.prop24 = async (req, res)  => {

    // let myArr = [];
    // const prefs = await Prop24.find({});
  
    // for (let i = 0; i < prefs.length; i++) {
    //   myArr.push(prefs[i].prefNumber)
    // }
  
    // let limiter = await getRep();
  
    // const browser = await playwright.chromium.launch();
    // const page = await browser.newPage();
  
    // for (let i = 1; i <= limiter; i++) {
      
    //   toPass = link + i;
      
    //   await page.goto(toPass, {
    //     waitUntil: 'load',
    //     // Remove the timeout
    //     timeout: 0
    //   });
  
    //   let temp = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll(".p24_content")).map(x => x.getAttribute('href'))
    //   })
      
    // //   let tempLink, tempPrefNum;
    // //   for (let x = 0; x < temp.length; x++) {
    // //     tempLink = temp[x];
    // //     tempPrefNum = await scrape(tempLink);
  
    // //     const prop24 = new Prop24({
    // //       prefNumber: tempPrefNum,
    // //       link: `https://www.property24.com${tempLink}`,
    // //       runDate: runDate
    // //     });
  
    // //     if (myArr.includes(tempPrefNum)) {
    // //       console.log("Already uploaded", tempPrefNum);
    // //     } else {
    // //       await pp.save(pp).then((response) => {
    // //         console.log(response);
    // //       }).catch((err) => {
    // //         console.log(err);
    // //       });
  
    // //     //   return response.status(201).send("Successfully scraped");
    // //     }
    // //   }
  
    // }
    // await browser.close()
  }
  
  // async function getRep() {
  
  //   const browser = await playwright.chromium.launch()
  //   const page = await browser.newPage()
  //   await page.goto('https://www.property24.com/to-rent/agency/preferental-platform/preferental-platform/233159/p1', {
  //     waitUntil: 'load',
  //     // Remove the timeout
  //     timeout: 0
  //   })
  
  //   let pagination = await page.evaluate(() => {
  //     return Array.from(document.querySelectorAll(".pagination")).map(x => x.textContent)
  //   })

  //   let mynewArr = [];

  //   pagination.map((p, i) =>{
  //     mynewArr.push(p)
  //   })

  //   let lastElem = mynewArr[mynewArr.length-1]
  //   myChar = lastElem.substring(lastElem.length-32)

  //   pagination = pagination.toLocaleString()
  //   let pricePagination = pagination.split(',').pop();
  
  //   await browser.close();

  //   // return pricePagination.charAt(pricePagination.length - 1)
  //   return myChar
  // }

  // async function scrape(latestLink) {
  //   let defaultLink = 'https://www.property24.com'
  //   let newLink = defaultLink + latestLink;
  
  //   const browser = await playwright.chromium.launch()
  //   const page = await browser.newPage()
  //   await page.goto(newLink, {
  //     waitUntil: 'load',
  //     // Remove the timeout
  //     timeout: 0
  //   })
  
  //   let desc = await page.evaluate(() => {
  //     return Array.from(document.querySelectorAll(".seeMoreContainer")).map(x => x.textContent)
  //   })
  
  //   let myString = desc[0].substring(desc[0].search(/Pref/));
  
  //   return myString.slice(0,12);
  // }

  exports.sendP24Data = async (req, res) => {

    myArr = req.body.myArr

    let fromDB = []

    const prefs = await Prop24.find({});

    for (let i = 0; i < prefs.length; i++) {
      fromDB.push(prefs[i].prefNumber)
    }

  myArr.map(async (prop) => {
    prefNumber = prop['Source Reference']
    const prop24 = new Prop24({
      prefNumber: prefNumber,
      runDate: runDate
    })
    console.log(prefNumber);
     if (fromDB.includes(prefNumber)) {
      console.log("Already uploaded", prefNumber);
    } else {
      await prop24.save(prop24).then((response) => {
        console.log(response);
      }).catch((err) => {
         console.log(err);
      });
    }

  })
  }

  exports.getAllProperty24Data = (req, res) => {

    Prop24.find({}).then((response) => {
      // console.log("Response", response);
  
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
    Prop24.aggregate( [
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
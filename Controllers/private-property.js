const request = require('request');
const cheerio = require('cheerio');

const db = require("../Models");
const PrivateProperty = db.privateproperty;
const runDate = new Date(Date.now())

function count(str, find) {
  return (str.split(find)).length - 1;
}
const link = 'https://www.privateproperty.co.za/estate-agency/preferental/rental-listings/10490'

exports.startPrivatePropertyScraping = (req, res) => {

  let uploadedProperties = [];
  let counter = 0;
  for (let x = 0; x < 999; x++) {
    request(`${link}?page=${x}`, (err, response, html) => {
      if (!err) {
        const $ = cheerio.load(html)

        //Get other files
        $('.listingResult').each((index, elem) => {
          // console.log(index);
          var url = $(elem).attr('href')
          url = url.substring(9)
          const province = url.substring(0, url.indexOf('/'))
          // console.log("Province: ", province)
          url = url.substring(url.indexOf('/') + 1)
          const city = url.substring(0, url.indexOf('/'))
          // console.log("City: ", city);
          url = url.substring(url.indexOf('/') + 1)
          const area = url.substring(0, url.indexOf('/'))
          // console.log("Area: ", area)
          url = url.substring(url.indexOf('/') + 1)
          const suburbs = url.substring(0, url.indexOf('/'))
          // console.log("Suburb: ",suburbs)
          const reference = url.substring(url.indexOf('RR'))
          // console.log("reference: ", reference)
          const title = $(elem).find('.title').text()
          var rent = $(elem).find('.priceDescription').text().substring(1)
          const monthly_rent = parseFloat(rent.replace(/ /g, ''))
          const property_type = $(elem).find('.propertyType').text()
          const suburb = $(elem).find('.suburb').text()
          const features = $(elem).find('.uspsString').text()
          var rooms = $(elem).find('.number').text()
          var number_of_bedrooms, number_of_bathrooms, garage

          if (count(rooms, '.') > 1) {
            number_of_bedrooms = parseFloat(rooms.substring(0, 3))

            // console.log("number_of_bedrooms: ", number_of_bedrooms)
            number_of_bathrooms = parseFloat(rooms.substring(3, 6))
            // console.log("number_of_bathrooms: ", number_of_bathrooms)

            if (rooms.length > 5) {
              garage = parseFloat(rooms.substring(5))
            } else {
              garage = parseInt("0");
            }

          } else {
            if (rooms.indexOf('.') == 2) {
              //If the "." is on 2(starting to count from 2)
              number_of_bedrooms = parseFloat(rooms.substring(0, 1))
              // console.log("number_of_bedrooms: ", number_of_bedrooms)
              number_of_bathrooms = parseFloat(rooms.substring(1, 4))
              // console.log("number_of_bathrooms: ", number_of_bathrooms)

              if (rooms.length > 4) {
                garage = parseFloat(rooms.substring(4))
              } else {
                garage = parseInt("0");
              }

            } else if (rooms.indexOf('.') == 1) {
              // number_of_bedrooms
              number_of_bedrooms = parseFloat(rooms.substring(0, 3))
              // console.log("number_of_bedrooms: ", number_of_bedrooms)
              number_of_bathrooms = parseFloat(rooms.substring(3))
              // console.log("number_of_bathrooms: ", number_of_bathrooms);

              if (rooms.length > 4) {
                garage = parseFloat(rooms.substring(4))
              } else {
                garage = parseInt("0");
              }
            } else {
              number_of_bedrooms = parseFloat(rooms.substring(0, 1))
              // console.log("number_of_bedrooms: ", number_of_bedrooms)
              rooms = rooms.substring(1)
              number_of_bathrooms = parseFloat(rooms.substring(0, 1))
              // console.log("number_of_bathrooms: ", number_of_bathrooms)
              rooms = rooms.substring(1)
              if (rooms.length > 0) {
                garage = parseFloat(rooms)
              } else {
                garage = parseInt("0");
              }
            }
          }
          data = {
            province: province,
            title: title,
            monthly_rent: monthly_rent,
            property_type: property_type,
            area: area,
            city: city,
            suburb: suburb,
            features: features,
            number_of_bedrooms: number_of_bedrooms,
            number_of_bathrooms: number_of_bathrooms,
            garage: garage,
            reference: reference,
            runDate: runDate
          }
          uploadedProperties.push(data)
          
          const privateProperty = new PrivateProperty({
            province: province,
            title: title,
            monthly_rent: monthly_rent,
            property_type: property_type,
            area: area,
            city: city,
            suburb: suburb,
            features: features,
            number_of_bedrooms: number_of_bedrooms,
            number_of_bathrooms: number_of_bathrooms,
            garage: garage,
            reference: reference,
            runDate: runDate
          });
          
          // PrivateProperty.find({reference: reference}).then((response) => {
          //   if (response.length > 0) {
          //     console.log("Property already exists");
          //   } else {
          //      privateProperty.save(data).then((ress) => {
          //       console.log("uploadedProperties", ress);
          //       counter = counter + 1;
          //       console.log("counter", counter);
          //     }).catch((err) => {
          //       console.log(err);
          //     })
          //   }
          // }).catch((error) => {
          //   console.log(error);
          // });

        });
      }
    });

    
  }
  console.log("================================");
  console.log("uploadedProperties", uploadedProperties);

 

  let deletedProperties = [];
  PrivateProperty.aggregate([
    {
      $group: {
        // collect ids of the documents, that have same value 
        // for a given key ('val' prop in this case)
        _id: '$reference',
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
          PrivateProperty.deleteOne({ "_id": id }).then((results) => {
            deletedProperties.push(results);
          }).catch((err) => (console.log(err)))
        }
      }
      // return results
    } else {
      // return "Failed to delete duplicates"
    }
  }).catch((err) => {
    console.log(err);
  });


  
  const updateCounterAsync = (counter) => {
    console.log("--> This is if statement", counter)
    if (counter > 0){
      return res.status(201).send(counter + " properties were scraped successfully")
    } else {
      return res.status(400).json({msg: "No properties were uploaded"})
    }

  }


  
}

exports.getAllPrivatePropertyData = (req, res) => {

  console.log("This is called")

  PrivateProperty.find({}).then((response) => {
    console.log("Response", response);

    if (response.length > 0) {

      return res.status(201).json(response);
    } else {
      return res.status(400).json({ message: "No data found" });
    }
  }).catch((err) => {
    console.log(err);
  });
}

exports.getCounterPrivateProperty = (req, res) => {

  PrivateProperty.aggregate( [
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

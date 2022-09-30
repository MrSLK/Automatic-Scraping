const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('property - middelburg.json')

const db = require("../Models");
const PrivateProperty = db.privateproperty;

//Detemines how many times . appears in a string 
function count(str, find) {
    return (str.split(find)).length - 1;
}
// Headers
// writeStream.write('[ \n');
let link = 'https://www.privateproperty.co.za/estate-agency/preferental/rental-listings/10490'

exports.startPrivatePropertyScraping =   (req, res) => {
    for (let x = 0; x < 999; x++) {
        request(`${link}?page=${x}`, (err, response, html) => {
        // shiba = shiba + 1;
        let data;
        if(!err){
            const $ = cheerio.load(html)
    
            //Get other files
            $('.listingResult').each( async (index, elem) => {
                // console.log(index);
                var url = $(elem).attr('href')
                url = url.substring(9)
                const province = url.substring(0,url.indexOf('/'))
                // console.log("Province: ", province)
                url = url.substring(url.indexOf('/') + 1)
                const city = url.substring(0, url.indexOf('/'))
                // console.log("City: ", city);
                url = url.substring(url.indexOf('/') + 1)
                const area = url.substring(0,url.indexOf('/'))
                // console.log("Area: ", area)
                url = url.substring(url.indexOf('/') + 1)
                const suburbs = url.substring(0,url.indexOf('/'))
                // console.log("Suburb: ",suburbs)
                const reference = url.substring(url.indexOf('RR'))
                // console.log("reference: ", reference)
                const title =$(elem).find('.title').text()
                var rent =$(elem).find('.priceDescription').text().substring(1)
                const monthly_rent = parseFloat(rent.replace(/ /g, ''))
                const property_type =$(elem).find('.propertyType').text()
                const suburb =$(elem).find('.suburb').text()
                const features = $(elem).find('.uspsString').text()
                var rooms = $(elem).find('.number').text()
                var number_of_bedrooms, number_of_bathrooms, garage
    
                
                
               if(count(rooms, '.') > 1){
                number_of_bedrooms = parseFloat(rooms.substring(0,3))
    
                // console.log("number_of_bedrooms: ", number_of_bedrooms)
                number_of_bathrooms = parseFloat(rooms.substring(3, 6))
                // console.log("number_of_bathrooms: ", number_of_bathrooms)
                
                if(rooms.length > 5){
                    garage = parseFloat(rooms.substring(5))
                } else {
                    garage = parseInt("0");
                }
                
               } else {
                if(rooms.indexOf('.') == 2 ){
                    //If the "." is on 2(starting to count from 2)
                    number_of_bedrooms = parseFloat(rooms.substring(0,1))
                    // console.log("number_of_bedrooms: ", number_of_bedrooms)
                    number_of_bathrooms = parseFloat(rooms.substring(1,4))
                    // console.log("number_of_bathrooms: ", number_of_bathrooms)
    
                    if(rooms.length > 4){
                        garage = parseFloat(rooms.substring(4))
                    } else {
                        garage = parseInt("0");
                    }
    
                } else if(rooms.indexOf('.') == 1){
                    // number_of_bedrooms
                    number_of_bedrooms = parseFloat(rooms.substring(0,3))
                    // console.log("number_of_bedrooms: ", number_of_bedrooms)
                    number_of_bathrooms = parseFloat(rooms.substring(3))
                    // console.log("number_of_bathrooms: ", number_of_bathrooms);
    
                    if(rooms.length > 4){
                        garage = parseFloat(rooms.substring(4))
                    } else {
                        garage = parseInt("0");
                    }
                } else {
                    number_of_bedrooms = parseFloat(rooms.substring(0,1))
                    // console.log("number_of_bedrooms: ", number_of_bedrooms)
                    rooms = rooms.substring(1)
                    number_of_bathrooms = parseFloat(rooms.substring(0, 1))
                    // console.log("number_of_bathrooms: ", number_of_bathrooms)
                    rooms = rooms.substring(1)
                    if(rooms.length > 0){
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
                    reference: reference
                }  
                const privateProperty = new PrivateProperty ({
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
                    reference: reference
                  });
                
                 const uploadProperties = await privateProperty.save(privateProperty);
                 console.log("uploadProperties", uploadProperties);
    
                let myLoop = 0;
                myLoop++;
            });
        }
    });
     }
 }

 exports.getAllPrivatePropertyData = (req, res) => {

    PrivateProperty.find({}).then((response) => {
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

 exports.getCounterPrivateProperty = (req, res) => {

    PrivateProperty.count({}).then((response) => {
      console.log("Private property counter", response);
      return res.status(200).json(response)
    }).catch((error) => {
      console.log(error);
    })
}
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('property - middelburg.json')

//Detemines how many times . appears in a string 
function count(str, find) {
    return (str.split(find)).length - 1;
}
// Headers
// writeStream.write('[ \n');
let link = 'https://www.privateproperty.co.za/estate-agency/preferental/rental-listings/10490'
 for (let x = 0; x < 999; x++) {
    request(`${link}?page=${x}`, (err, response, html) => {
    // shiba = shiba + 1;
    let data;
    if(!err){
        const $ = cheerio.load(html)

        //Get other files
        $('.listingResult').each((index, elem) => {
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

            let myLoop = 0;
            myLoop++;
            // data = [province, title, monthly_rent, property_type, city, area, suburb, features, number_of_bedrooms, number_of_bathrooms]
            // console.log("Property: ", data)
           do {
                if(myLoop == elem.length){
            
                    myString = JSON.stringify(data)
                    writeStream.write(myString)
                } else {
                    let myString = JSON.stringify(data) + ', \n'
                    writeStream.write(myString)
                }
            }  while (myLoop <= elem.length )
        
            
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
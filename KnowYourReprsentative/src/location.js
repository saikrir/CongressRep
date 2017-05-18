'use strict';
let request = require('request');
const APP_CONSTANTS = require('./constants').appConstants;


module.exports = {

    capitalizedFirstCharStr: function(string) {
       return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getZipCode: function(city, state, callback) {
        let stateCode = APP_CONSTANTS.
                            statesToCode[this.capitalizedFirstCharStr(state)];
        console.info('city, stateCode '+ city + ', ' +stateCode);
        let zipCodeApiUrl = this.zipCodeApiUrl(city, stateCode);
        request.get(zipCodeApiUrl, function(error, response, body) {
            if(error) {
                callback(error);
            }else{
                try{
                    let responseObj = JSON.parse(body);
                    if(responseObj.zip_codes.length >0 ) {
                        callback(null, responseObj.zip_codes[0]);
                    }else{
                        callback(new Error( 'No Zipcodes matched ' +
                                        city + ', ' + state ), null);
                    }
                } catch(error) {
                    console.error('Error Parsing Schema ', error);
                }
            }
        });
    },

    getLocation: function(city, state, callback) {
        let self = this;
        this.getZipCode(city, state, function(error, zipCode) {
             if(error) {
                 callback(error, null);
             } else {
                request.get(self.locationApiUrl(zipCode), function(error, response, body) {
                    if(error) {
                        callback(error, null);
                    } else {
                         let responseObj = JSON.parse(body);
                         callback(null, responseObj);
                    }
                });
             }
        });
    },
    zipCodeApiUrl: function(city, state) {
        return `https://www.zipcodeapi.com/rest/${APP_CONSTANTS.zipCodeAPIKey}/city-zips.json/${city}/${state}`;
    },
    locationApiUrl: function(zipCode) {
        return `https://www.zipcodeapi.com/rest/${APP_CONSTANTS.zipCodeAPIKey}/info.json/${zipCode}/degrees`;
    },
};

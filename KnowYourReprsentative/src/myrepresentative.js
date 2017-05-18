'use strict';
let request = require('request');
const APP_CONSTANTS = require('./constants').appConstants;

module.exports = {
    getMyRepresentativeAPIUrl: function(lat, lon) {
        return `https://congress.api.sunlightfoundation.com/legislators/locate?latitude=${lat}}&longitude=${lon}`;
    },

    getRepresentativeForZipCode: function(lat, lon, callback) {
        console.log(this.getMyRepresentativeAPIUrl(lat, lon));
       request.get(this.getMyRepresentativeAPIUrl(lat, lon),
                    function(error, response, body) {
            if(error) {
                callback(error, null);
            } else {
                try{
                    let responseObj = JSON.parse(body);
                    let results = responseObj.results;
                    if(results && results.length > 0 ) {
                        let result = results[0];
                        callback(null, result);
                    }
                }catch(error) {
                    console.error('Error parsing JSON ' + zipCode);
                }
            }
        });
    },
    getParty: function(partyCode) {
        return APP_CONSTANTS.partyCodes[partyCode];
    },
};

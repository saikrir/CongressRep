'use strict';
let location = require('./location');
let myrepresentative= require('./myrepresentative');


location.getLocation('Providence', 'Rhode Island', function(error, location) {
    if(error) {
        console.error('ZipCode lookup Error', error);
    }else{
        console.info('Location ', location.lat, location.lng);
        myrepresentative.getRepresentativeForZipCode(location.lat, location.lng,
                            function(error, record) {
            console.log('Record -> ' +record.first_name + ' ' + record.last_name);
        });
    }
});


'use strict';
let location = require('./location');
let myrepresentative= require('./myrepresentative');

let Alexa = require('alexa-sdk');
let APP_ID = 'amzn1.ask.skill.eb7ea372-ac39-482d-b881-4ecc4f6cfd0e';


exports.handler = function(event, content, callback) {
    let alexa = Alexa.handler(event, content);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

let handlers = {
    'LaunchRequest': function() {
        let welcomeMessage = 'Welcome to find a congress representative,'
                                 + 'please tell us city and state';
        let rePromptMessage = 'Would you like to ' +
                                    'find congress representative, ' +
                                    'please tell us city and state';
        this.emit(':ask', welcomeMessage, rePromptMessage);
    },
    'MyRepresentativeIntent': function() {
        let stateSlot = this.event.request.intent.slots.state;
        let citySlot = this.event.request.intent.slots.city;
        let state;
        if(stateSlot && stateSlot.value) {
            state= stateSlot.value;
        }

        let city;
        if(citySlot && citySlot.value) {
            city = citySlot.value;
        }

        if(city && state) {
            let self = this;
            location.getLocation(city, state, function(error, location) {
                if(error) {
                    self.emit(':tell', error.message);
                }else{
                    console.log( 'Location : ', location);
                    if(error) {
                        self.emit(':tell', 'We could not find a congress '+
                                    'representative for ' + city +', ' + state);
                    }else{
                        myrepresentative.
                            getRepresentativeForZipCode(location.lat,
                                                        location.lng,
                                function(error, rep) {
                                    self.attributes['representative'] = rep;
                                    let middleName = rep.middle_name || '';
                                    let repName = `${rep.first_name}  ${middleName}  ${rep.last_name}`;
                                    self.emit(':ask', 'Your Representative is '
                                                        + repName + ' from '
                                                        + myrepresentative.getParty(rep.party)
                                                        + ' Party, ' + rep.first_name + '\'s term ends on ' + rep.term_end
                                                        + ', Would you like Office or Phonenumber? ');
                                });
                    }
                }
            });
        } else { // When you did not recieve state information
            let message = 'We could not get city and state information' +
                        'please tell us city and state again';
            this.emit(':ask', message);
        }
    },
    'MyRepresentativePhoneIntent': function() {
        if(this.attributes['representative']) {
            let rep = this.attributes['representative'];
            let message = rep.first_name +'\'s Phone number is ' + rep.phone
                          + ', Would you like Office or Phonenumber?';
            this.emit(':ask', message);
        }else{
            let message = 'Please tell us city and state again';
            this.emit(':ask', message);
        }
    },
    'MyRepresentativeOfficeIntent': function() {
        if(this.attributes['representative']) {
            let rep = this.attributes['representative'];
            let message = rep.first_name +'\'s Office is ' + rep.office
                          + ', Would you like Office or Phonenumber?';
            this.emit(':ask', message);
        }else{
            let message = 'Please tell us city and state again';
            this.emit(':ask', message);
        }
    },
    'MyRepresentativeYesIntent': function() {
        if(this.attributes['representative']) {
            this.emit(':ask', 'Ok! Please say phonenumber or office');
        }else{
            let message = 'Please tell us city and state again';
            this.emit(':ask', message);
        }
    },
    'MyRepresentativeNoIntent': function() {
        this.emit(':tell', 'Ok, Thank you!');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', 'If you have an city and state that'+
                          'you would like to know a congress respresentative',
                          'Try saying a city and state');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.',
                                                     'Try saying a number.');
    },
};

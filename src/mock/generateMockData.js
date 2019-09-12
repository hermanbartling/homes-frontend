/* This script generates mock data for local development.
 This way you don't have to point to an actual API,
 but you can enjoy realistic, but randomized data,
 and rapid page loads due to local, static data.
 */

//https://github.com/marak/Faker.js/

var jsf = require('json-schema-faker');
var faker = require('faker');
faker.locacle = "sv";
jsf.extend('faker', () => faker);
var mockDataSchema = require('./mockDataSchema');
var fs = require('fs');

jsf.format('pastDate', () => faker.date.past().toISOString());
jsf.format('futureDate', () => faker.date.future().toISOString());
jsf.format('earliestPossibleStartDate', () => {
    var localDate = faker.date.future();
    localDate.setHours(6);
    localDate.setMinutes(0);
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);
    return localDate.toISOString();
});

var json = JSON.stringify(jsf(mockDataSchema));

fs.writeFile("./src/mock/db.json", json, function (err) {
    if (err) {
        return console.log(err);
    } else {
        console.log("Mock data generated.");
    }
});
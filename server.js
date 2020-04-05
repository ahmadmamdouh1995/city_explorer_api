'use stric';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
    response.status(200).send('Home Page!');
});
app.get('/bad', (request, response) => {
    throw new Error('oh nooo!');
});

app.get('/location', (request, response) => {
    try {
        const geoData = require('./data/geo.json');
        const city = request.query.city;
        const locationData = new Location(city, geoData);
        response.status(200).json(locationData);

    } catch (error) {
        errorHandler(error, request, response);
    }
});

app.get('/weather', (request, response) => {
    try {
        const darksky = require('./data/darksky.json');
        const weather = request.query.weather;
        const weatherData = new Weather(weather, darksky);
        response.status(200).json(weatherData);
    } catch (error) {
        errorHandler(error, request, response);
    }
});


// let d = (new Date('darksky.data[0].valid_date')).toUTCString();
// // "time": "Mon Jan 01 2001"
// console.log(d);
// let a = d.split(" ");
// console.log(a);
// let date = `${a[0]} ${a[1]} ${a[2]} ${a[3]}`;
// console.loge(date);

app.use('*', notFoundHandler);

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

function Weather(weather, darksky) {
    this.search_query = weather;
    this.description = darksky.data[0].weather.description;
    let d = (new Date(darksky.data[0].valid_date)).toUTCString();
    let  a = d.split(" ");
    let date = `${a[0]} ${a[1]} ${a[2]} ${a[3]}`;
    // "time": "Mon Jan 01 2001"
    // console.log(d);
    // let a = d.split(" ");
    // console.log(a);
    // let date = `${a[0]} ${a[1]} ${a[2]} ${a[3]}`;
    // console.loge(date);
    this.valid_date = date;
}

function notFoundHandler(request, response) {
    response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
    response.status(500).send(error);
}

app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));

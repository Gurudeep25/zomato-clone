const express = require('express');
const app = express();

const restaurantData = require('./JSON/restaurant.json');
const locationData = require('./JSON/location.json');
const mealType = require('./JSON/mealtype.json');

const port = 8900;

app.get("/getAllRestaurants", (req, res) => {
    res.send(restaurantData);
});

app.get("/getAllMealTypes", (req, res) => {
    res.send(mealType);
});

app.get("/getRestaurantsByLocation/:cityName", (req, res) => {
    res.send(locationData);
});

app.listen(port, () => {
    if(err) throw err;
    console.log(`Restaurants app listening on port ${port}!`);
});


app.post("/postRestaurants");
app.use(express.json());
const fs = require('fs');
fs.readFile( , (err, result) => {
    if(err) {
        throw err;
    }else {
        res.send(JSON.parse(result));
    }
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RestaurantsModel = require('./models/RestaurantModel');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/restaurants', async (req, res) => {
  const restaurants = await RestaurantsModel.find({});
  return res.status(200).send(restaurants);
});

module.exports = app;

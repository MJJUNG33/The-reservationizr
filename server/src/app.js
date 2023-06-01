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

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'id provided is invalid' });
  }

  const restaurant = await RestaurantsModel.findById(id);

  if (restaurant === null) {
    return res.status(404).send({ error: 'id not found' });
  }

  return res.status(200).send(restaurant);
});

module.exports = app;

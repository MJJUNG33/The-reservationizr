const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { auth } = require('express-oauth2-jwt-bearer');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const { date } = require('joi');
const RestaurantsModel = require('./models/RestaurantModel');
const ReservationModel = require('./models/ReservationModel');
const app = express();

const checkJwt = auth({
  audience: 'https://Reservationizr.com',
  issuerBaseURL: `https://dev-4byfagrcflsqo0mx.us.auth0.com/`,
});

app.use(cors());
app.use(express.json());

app.post(
  '/reservations',
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().min(1).required(),
      date: Joi.date().greater('now').required(),
      restaurantName: Joi.string().required(),
      userId: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { body, auth } = req;
      const reservationBody = {
        createdBy: auth.payload.sub,
        ...body,
      };
      const reservation = new ReservationModel(reservationBody);
      await reservation.save();
      return res.status(201).send(reservation);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);

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

app.use(errors());

module.exports = app;

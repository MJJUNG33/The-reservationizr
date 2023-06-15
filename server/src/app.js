const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { auth } = require('express-oauth2-jwt-bearer');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const RestaurantsModel = require('./models/RestaurantModel');
const ReservationModel = require('./models/ReservationModel');
const app = express();

const checkJwt = auth({
  audience: 'https://Reservationizr.com',
  issuerBaseURL: `https://dev-4byfagrcflsqo0mx.us.auth0.com`,
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
    }),
  }),
  async (req, res, next) => {
    const { body, auth } = req;
    const reservationBody = {
      userId: auth.payload.sub,
      ...body,
    };
    const reservation = new ReservationModel(reservationBody);
    await reservation.save();

    return res.status(201).send(reservation);
  }
);

app.get('/restaurants', async (req, res) => {
  const restaurants = await RestaurantsModel.find({});
  return res.status(200).send(restaurants);
});

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'invalid id provided' });
  }

  const restaurant = await RestaurantsModel.findById(id);

  if (!restaurant) {
    return res.status(404).send({ error: 'restaurant not found' });
  }

  return res.status(200).send(restaurant);
});

app.get('/reservations', checkJwt, async (req, res) => {
  const userId = req.auth.payload.sub;
  const reservations = await ReservationModel.find({
    userId,
  });
  return res.status(200).send(reservations);
});

app.get('/reservations/:id', checkJwt, async (req, res) => {
  const { id } = req.params;
  const { auth } = req;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'invalid id provided' });
  }

  const reservation = await ReservationModel.findById(id);

  if (!reservation) {
    return res.status(404).send({ error: 'not found' });
  }

  if (reservation.userId !== auth.payload.sub) {
    return res.status(403).send({
      error: 'user dose not have permission to access this reservation',
    });
  }

  return res.status(200).send(reservation);
});

app.use(errors());

module.exports = app;

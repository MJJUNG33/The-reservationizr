// FIXME: Add a Mongoose model here
const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Restaurant = mongoose.model('restaurant', restaurantSchema);
module.exports = Restaurant;

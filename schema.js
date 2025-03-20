const Joi = require("joi");

const validCategories = [
  "mountains",
  "rooms",
  "farms",
  "arctic",
  "trending",
  "icons",
  "Castles",
  "Amazing Pools",
  "Historical homes",
  "Camping",
  "Farms",
  "Beach",
  "Skiing",
  "Lakes",
  "Hiking",
];

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object().allow("", null),
    category: Joi.string()
      .valid(...validCategories)
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

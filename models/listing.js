const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  category: {
    type: String,
    enum: [
      "moutains",
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
    ],
    required: true,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//delete middleware for reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

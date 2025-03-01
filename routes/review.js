const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapasync = require("../utils/wrapasync");
const ExpressError = require("../utils/ExpressError");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Reviews Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapasync(reviewController.createReview)
);

// Review Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapasync(reviewController.deleteReview)
);

module.exports = router;

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index,Create Route
router
  .route("/")
  .get(wrapasync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(listingController.createListing)
  );

//Search Route
router.get(
  "/search",
  wrapasync(async (req, res) => {
    const query = req.query.query; // Get the query from the search form

    if (!query) {
      return res.redirect("/listings"); // If no query, redirect to the homepage
    }

    try {
      // Search for listings that match the query (case-insensitive search)
      const results = await Listing.find({
        title: { $regex: query, $options: "i" }, // Regex search, case insensitive
      });

      // Render search.ejs with the results and the search query
      res.render("./listings/search.ejs", {
        results: results,
        query: query,
      });
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// Filter Route
router.get(
  "/listings/filters",
  wrapasync(async (req, res) => {
    try {
      console.log("✅ Route accessed with filter:", req.query.filter);
      const { filter } = req.query;
      let sortQuery = {};

      if (filter === "price-low") {
        sortQuery = { price: 1 }; // Low to High
      } else if (filter === "price-high") {
        sortQuery = { price: -1 }; // High to Low
      } else if (filter === "rating") {
        sortQuery = { rating: -1 }; // Best Rating First
      }

      const results = await Listing.find({}).sort(sortQuery);
      res.render("listings/filters", { results, filter });
    } catch (error) {
      console.error("❌ Filter error:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Update, Delete
router
  .route("/:id")
  .get(wrapasync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapasync(listingController.deleteListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapasync(listingController.renderEditForm)
);

module.exports = router;

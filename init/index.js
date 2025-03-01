const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Heavenly");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67a70b636d2d6262b1d397ec",
  }));
  initData.data = initData.data.map((obj) => ({ ...obj, category: "rooms" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialised");
};
initDB();

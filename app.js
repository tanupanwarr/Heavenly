const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require(path.join(__dirname,"models","listing"));
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync");
const ExpressError  = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");

main().then(()=>{   
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/Heavenly");
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMssg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMssg );
    }
    else{
        next();
    }
}

//Root Route
app.get("/", (req, res)=>{
    res.send("Hi, Welcome to Home Page");
});

//Index Route
app.get("/listings", wrapasync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapasync(async (req, res)=> {
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("./listings/show.ejs", {listings});
}));

//Create Route
app.post("/listings", validateListing, wrapasync(async (req, res,next) => {
    // let {title,description,image,price,location,country} = req.body;
    // if(!req.body.listing)
    // {
    //     throw new ExpressError(400, "Send valid data for listings")
    // }
    const  newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapasync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", validateListing, wrapasync(async (req,res)=> {
    let {id} = req.params;
    const UpdatedList = {...req.body.listing};
    await Listing.findByIdAndUpdate(id, UpdatedList, {new: true});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapasync( async(req,res)=> {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.get("/testListing",async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Heavenly Villa",
//         description: "A spot of paradise",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample Saved");
//     res.send("sucessful testing");
// });

// Error handler
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//Middleware for error handling
app.use((err,req,res,next)=>{
    let { status = 500, message = "Something went wrong!"} = err;
    res.status(status).render("error.ejs",{message})
    // res.status(status).send(message);
});

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});
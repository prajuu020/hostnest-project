require("dotenv").config();

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN
});



const Listing = require("../models/listing");  
//const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req,res) => {
  let search = req.query.search;

  let allListings;

  if (search && search.trim() !== "") {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ]
    });
  } else {
    allListings = await Listing.find({});
  }

  console.log("RESULT:", allListings); // 👈 debug

  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = async(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) =>{
    let{id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
       if(!listing){
        req.flash("error","Cannot find that listing!"); 
         return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
 
};

module.exports.createListing = async(req,res,next)=>{
   let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 2
}).send();

  let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,'..',filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing created successfully!"); 
    res.redirect("/listings");
};

module.exports.renderEditForm =  async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!"); 
         return res.redirect("/listings");
    }
    let OrginnalImageUrl = listing.image.url;
    OrginnalImageUrl = OrginnalImageUrl.replace("/uploads","/upload/w_250");
    res.render("listings/edit.ejs",{listing,OrginnalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  console.log("FILE", req.file); 
  console.log("BODY", req.body); 
    let { id } = req.params;
    let updatedData = { ...req.body.listing };
    // 🌍 geocoding
    const geoData = await geocoder.forwardGeocode({
        query: updatedData.location,
        limit: 1,
    }).send();

    updatedData.geometry = geoData.body.features[0].geometry;
    // 🟢 STEP 1: get existing listing
    let listing = await Listing.findById(id);
    // 🟢 STEP 2: update text fields
    Object.assign(listing, updatedData);
    // 🔥 STEP 3: update image IF new one uploaded
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
  }
    // 🟢 STEP 4: save everything together
    await listing.save();
    // 🟢 STEP 5: redirect
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res,next)=>{
     let{ id }=req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success","New listing deleted successfully!"); 
     res.redirect("/listings");
};
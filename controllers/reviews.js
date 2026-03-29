const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{
    console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);//finding the id and requesting to add review
  let newReview = new Review(req.body.review);//adding new review
  newReview.author = req.user._id;
  listing.reviews.push(newReview);//adding new review into reviews array
  await newReview.save();
  await listing.save();
req.flash("success","New Review created successfully!"); 
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res) => {
    let{id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!"); 
    res.redirect(`/listings/${id}`);

};
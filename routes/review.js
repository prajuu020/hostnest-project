const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware");

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
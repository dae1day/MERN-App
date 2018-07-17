const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); //deals with database
const passport = require("passport"); // protect routes

// load profile model
const Profile = require("../../models/Profile");
// load user profile
const User = require("../../models/User");

// @route           GET api/profile/test
// @description     Tests profile route
// @access          Public route
router.get("/test", (req, res) => res.json({ msg: "Profile works!" }));
// takes in request and response like any route
//res.json is similar to res.send but will output json thats what we want from this api
//pass in curly braces ({}) <-- its an object

// @route           GET api/profile
/// should get current users profile
// when we have protected routes we're getting a token that has a payload with the users information
// makes it very secure. have to be logged in to get that user's info
// @description     get current users profil
// @access          private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      //use the profile model
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;

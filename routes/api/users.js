const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load user model
const User = require("../../models/User");

// @route           GET api/users/test
// @description     Tests users route
// @access          Public route
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));
// takes in request and response like any route
//res.json is similar to res.send but will output json thats what we want from this api
//pass in curly braces ({}) <-- its an object

// @route           GET api/users/register
// @description     register user
// @access          Public route
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //first find if the email exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "email already exists!";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
      //take in 10 characters then a call back
    }
  });
  //pass in object , find emai lthat matches req.body.email
  //access it with req.body
});

// @route           GET api/users/login
// @description     login user / returning JWT token
// @access          Public route
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "user not found!";
      return res.status(404).json(errors);
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create jwt payload
        // sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token //bearer is certain type of protocol
            });
          }
        );
        //takes in: payload  what we want to include in the token
        //user info, secret or key, expiration
      } else {
        errors.password = "password is incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route           GET api/users/current
// @description     return current user
// @access          Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;

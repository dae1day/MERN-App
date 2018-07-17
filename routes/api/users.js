const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
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
  //first find if the email exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email already exists!" });
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

module.exports = router;

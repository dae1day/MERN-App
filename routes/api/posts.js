const express = require("express");
const router = express.Router();

// @route           GET api/posts/test
// @description     Tests posts route
// @access          Public route
router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));
// takes in request and response like any route
//res.json is similar to res.send but will output json thats what we want from this api
//pass in curly braces ({}) <-- its an object

module.exports = router;

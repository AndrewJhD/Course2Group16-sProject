const router = require("express").Router();
const path = require("path");

const serveLandingPage = (req, res) => { 
  res.sendFile(path.join(__dirname, "../public/index.html"));
};

router.get("/", serveLandingPage);

router.get("/aboutUs", serveLandingPage);

router.get("/browse", (req, res) => { 
  res.sendFile(path.join(__dirname, "../public/browse.html")); 
}); 

module.exports = router;
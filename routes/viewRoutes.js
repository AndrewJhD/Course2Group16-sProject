const router = require("express").Router();
const path = require("path");

const serveLandingPage = (req, res) => { 
  res.sendFile(path.join(__dirname, "../public/index.html"));//
};

router.get("/aboutUs", serveLandingPage);

router.get("/", (req, res) => {  //this section has blanks because we will use this for the music player / input page (possiblly)
  res.sendFile(path.join(__dirname, "../public/.html")); 
});

module.exports = router;
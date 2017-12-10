var router = require('express').Router();

// route to handle all angular requests
router.get('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.sendfile('./public/index.html'); // load our public/index.html file
});

module.exports = router;

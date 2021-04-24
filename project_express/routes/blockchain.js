var express = require('express');
var router = express.Router();

//example
router.get('/', function(req, res, next) {
  res.send('Blockchain');
});

module.exports = router;

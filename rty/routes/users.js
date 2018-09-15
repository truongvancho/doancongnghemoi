var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("qwe");
});

module.exports = router;

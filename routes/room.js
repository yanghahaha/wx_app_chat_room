var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user-list', function(req, res, next) {
  res.send('respond user list');
});

module.exports = router;

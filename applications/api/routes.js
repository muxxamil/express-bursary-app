const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200).send("Api's index page");
});

router.get('/sample', (req, res) => {
    res.status(200).send("Api's sample page");
  });

  module.exports = router;
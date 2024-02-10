// backend/routes/index.js
const express = require('express');
const router = express.Router();


//TEST ROUTE//
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

//Auth me 1: add API ROUTER
//finished the error-handling--forgot where I was
const apiRouter = require('./api');

router.use('/api', apiRouter);

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router;

// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Spot} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//* GET ALL SPOTS

router.get('/', async(req,res,next)=>{
    const allSpots = await Spot.findAll();
    return res.json(allSpots)
})

module.exports = router;

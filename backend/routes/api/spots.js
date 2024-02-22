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

//*GET ALL SPOTS OWNED BY CURR USER
//* REQUIRE AUTHENTICATION
router.get('/current', requireAuth, async(req,res,next)=>{
    const currId = req.user.dataValues.id
    const ownedSpots = {};

    let Spots = await Spot.findAll({
        where: {ownerId: currId}
    })
    ownedSpots.Spots = Spots;
    // console.log(ownedSpots);
    return res.json(ownedSpots)
})

//!THIS WORKS BUT I NEED TO ADDRESS AN ON DELETE
//! CASADE FOR WHEN A USER IS DELETED,
//! THEN THEIR SPOTS ARE DELETED.
module.exports = router;

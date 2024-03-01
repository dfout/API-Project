const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot, Booking} = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Return all the bookings that the current user has made
router.get('/current',requireAuth, async(req,res,next)=>{

    const userId = req.user.id;

    const currBookings = await Booking.findAll({
        where:{userId:userId},
        include:[{model: Spot}]

    })

    return res.json({Bookings:currBookings})
});



module.exports = router;

const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/current', requireAuth, async(req,res,next)=>{
    const userId = req.user.dataValues.id;
    const userReviews = {}

    const Reviews = await Review.findAll({
        where: {userId:userId},
        include: [
            {model: Spot},
            {model: ReviewImage}
        ]
    })
    userReviews.Reviews = Reviews;
    return res.json(userReviews)

})




module.exports = router;

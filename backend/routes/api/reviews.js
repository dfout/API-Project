const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

function deepAuth(userId,review){
    //if the userId matches the ownerId on the spot,
    //then send back a true
    if (review.userId === userId) return true
    else{
        return false
    }

    //else, send back false then send an error message
}

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

router.post('/:reviewId/images', requireAuth, async (req,res,next)=>{
    const { currId } = req.user.dataValues.id;
    const { reviewId } = req.params;
    const review = Review.findByPk(reviewId);
    if(!review){
        res.status(404);
        return res.json({
            message:"Review couldn't be found"
        })
    }

    if(!deepAuth(currId,review)){
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    };

    const reviewImages = ReviewImage.findAll({
        where: {reviewId:reviewId}
    });

    if (reviewImages.length === 10){
        res.status(403)
        return res.json({
            message:"Maximum number of images for this resource was reached"
        })
    };

    const newReviewImage = await ReviewImage.create(req.body)
    res.status(200);
    return res.json(newReviewImage)
})



module.exports = router;

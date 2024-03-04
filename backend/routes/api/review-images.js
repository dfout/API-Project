const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot, Booking, SpotImage} = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const isOwner = function(userId, review){
    if(review.userId === userId) return true
    else{
        return false
    }
}


//*Delete a review-image
// requireAuth
// Review must belong to the current user
router.delete('/:imageId', requireAuth, async(req,res,next)=>{
    const { imageId } = req.params;
    const userId = req.user.id;
    const reviewImageObj = await ReviewImage.findByPk(imageId);
    if (!reviewImageObj){
        res.status(404);
        return res.json({
            message: "Review Image couldn't be found"
        });
    };
    const reviewId = reviewImageObj.reviewId;
    const review = await Review.findByPk(reviewId);
    const owned = isOwner(userId, review)
    if(!owned){
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };

    await reviewImageObj.destroy();
    return res.json({
        message: "Successfully deleted"
    })

});

module.exports = router;

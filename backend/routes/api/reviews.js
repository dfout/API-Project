const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

var deepAuth = function(currId,review){
    //if the userId matches the ownerId on the spot,
    //then send back a true

    if (review.userId === currId) return true
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
    const currId  = req.user.id;

    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if(!review){
        res.status(404);
        return res.json({
            message:"Review couldn't be found"
        })
    }
    //deep auth: review must belong to the current user
    const isDeepAuth = deepAuth(currId, review)

    if(!isDeepAuth){
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    };

    const reviewImages =  await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId,
        }
    });


    if (reviewImages.length >= 10){
        res.status(403)
        return res.json({
            message:"Maximum number of images for this resource was reached"
        })
    };

    const { url } = req.body;

    if(!url){
        const e = new Error()
        e.message = "Bad Request"
        e.errors = {
            url: "Image link or url is required"
        }
        res.status(400)
        return res.json(e)
    }

    const newReviewImage = await ReviewImage.create({url, reviewId})

    //return just the id and url in the body
    const responseBody = {
        id: newReviewImage.id,
        url: newReviewImage.url
    }


    res.status(200);
    return res.json(responseBody)

    //reviews made only by id 3 ===
    // is reviewId 3 and 5 only
});

router.put('/:reviewId', requireAuth, async(req,res,next)=>{
    const { reviewId } = req.params;
    const currId = req.user.id;
    //! SEQUELIZE AUTOMATICALLY HAS AN ERROR HANDLING FOR IF A REVIEW ID INTEGER DOES NOT GET INPUT
    // if(typeof reviewId !== 'number'){
    //     res.status(404)
    //     return res.json({
    //         message: "Error: Page not found"
    //     })
    // }
    const reviewObj = await Review.findByPk(reviewId);
    if (!reviewObj){
        res.status(404);
        return res.json({
            message: "Review could not be found"
        })
    }

    const isDeepAuth = deepAuth(currId, reviewObj);
    if(!isDeepAuth){
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    };

    const { review, stars } = req.body;

    //Body Validation Errors
    const errors = {};
    if(!review){
        errors.review = 'Review text is required'
    };

    if (!stars || (stars < 1 || stars > 5)|| typeof stars !== 'number'){
        errors.stars = 'Stars must be an integer from 1 to 5'
    }

    // Body Validation Errors
    if(errors.review || errors.stars){
        e = new Error()
        e.message = "Bad Request"
        e.errors = errors;
        res.status(400);
        return res.json(e)
    }

    await reviewObj.update({
        review,
        stars
    });



    return res.json(reviewObj);
});


router.delete('/:reviewId', requireAuth, async(req,res,next)=>{
    let { reviewId } = req.params;
    reviewId= Number(reviewId)
    const reviewObj = await Review.findByPk(reviewId);
    if(!reviewObj){
        res.status(404);
        return res.json({
            message: "Review could not be found"
        })
    }
    const currId = req.user.id;
    const isDeepAuth = deepAuth(currId, reviewObj);
    if(!isDeepAuth){
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    };

    await reviewObj.destroy()


    res.status(200);
    return res.json({
        message: "Successfully deleted"
    })
})



module.exports = router;

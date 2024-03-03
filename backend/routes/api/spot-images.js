const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot, Booking, SpotImage} = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const isOwner = function(userId, spot){
    if(spot.ownerId === userId) return true
    else{
        return false
    };
}

//*Delete a SpotImage
//Spot must belong to curr User
router.delete('/:imageId', requireAuth, async(req,res,next)=>{
    const {imageId} = req.params;
    const imageObj = await SpotImage.findByPK(imageId);
    if(!imageObj){
        res.status(404);
        return res.json({
            message: "Spot Image couldn't be found"
        })
    }
    const spotId = imageObj.spotId;
    const spot = await Spot.findByPK(spotId);

    const userId = req.user.id;
    const owned = isOwner(userId,spot);
    if(!owned){
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };

    await imageObj.destroy();
    return res.json({
        message: "Successfully deleted"
    })
})



module.exports = router;

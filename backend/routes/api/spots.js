// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Spot, SpotImage, User, Review, Booking} = require('../../db/models');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//*Helper Function: Does Spot Exist?

// function doesExist(spot){

// }

//*Helper Function for DeepAuth:
function deepAuth(userId,spot){
    //if the userId matches the ownerId on the spot,
    //then send back a true
    if (spot.ownerId === userId) return true
    else{return false}

    //else, send back false then send an error message
}

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


//* GET ALL SPOTS FROM ID

router.get('/:spotId', async(req,res,next)=>{
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId,{
        include: [{model:SpotImage},{model:User, as: 'Owner'}]
    });
    if (spot === null){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    return res.json(spot);

})



//? TITLE OF BAD REQUEST STILL SHOWS UP
const validateSpot = [
    check('address')
        .exists().notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists().notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists().notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists().notEmpty()
        .withMessage("Country is required"),
    //? HOW TO DEFAULT LAT AND LNG?
    check('lat')
        .exists().isFloat({min: -89, max: 91})
        .withMessage("Latitude must be within -90 and 90"),
    check('lng')
        .exists().isFloat({min: -181, max: 181})
        .withMessage("Longitude must be within -180 and 180"),
    check('name')
        .exists().notEmpty().isLength({max:50})
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists().notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists().isInt({gt: 0})
        .withMessage("Price per day must be a positive number"),
    handleValidationErrors
];


//* ADD AN IMAGE TO A SPOT

router.post('/:spotId/images', requireAuth, async(req,res,next)=>{
    const currId = req.user.dataValues.id;
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(spotId)
    if (spot === null){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    }else if(!deepAuth(currId,spot)){
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    }else{
        const newImage = await SpotImage.create({url,spotId, preview});

        const response = {
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        }
        return res.json(response)
    }

})

//* CREATE A SPOT
//? MADE AVG RATING AND PREVIEW IMAGE DEFAULT TO UNDEFINED ON MODEL
//? SO THAT IT DOESN'T SHOW UP UNLESS THEY MAKE IT.

router.post('/', requireAuth, validateSpot, async(req,res,next)=>{
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.dataValues.id

    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price});

    return res.json(newSpot)
});

//*EDIT A SPOT
//*IT CHANGED IT YAY!




router.put('/:spotId', requireAuth,validateSpot,async(req,res,next)=>{
    const currId = req.user.dataValues.id;
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId);
    if (spot === null){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }else if (!deepAuth(currId,spot)){
            res.status(403);
            return res.json({
                message:"Forbidden"
            })
        }else{
            const { address, city, state, country, lat, lng, name, description, price} = req.body;

            await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            })


            //? NEED TO CHECK TO MAKE SURE THE EDITS ARE
            //? OKAY BEFORE WE PUSH THEM TO THE DB

            return res.json(spot)
        }
});


router.delete('/:spotId',requireAuth, async(req,res,next)=>{
    const currId = req.user.dataValues.id;
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId);
    if (spot === null){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }else if (!deepAuth(currId,spot)){
        res.status(403);
        return res.json({
            message:"Forbidden"
        })
    }else{
        await spot.destroy();
        res.status(200);
        return res.json({
            message:"Successfully deleted"
        })
    }
})







module.exports = router;

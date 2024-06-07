// backend/routes/api/users.js
const express = require('express');
const { Op, FLOAT } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Spot, SpotImage, User, Review, ReviewImage, Booking} = require('../../db/models');

const { check, validationResult } = require('express-validator');
// const { validateReview } = require('./reviewValidator.js')
const { handleValidationErrors, checkBookingConflicts} = require('../../utils/validation');

const router = express.Router();


//? TITLE OF BAD REQUEST STILL SHOWS UP
const validateSpot = [
    check('address')
        .exists().notEmpty()
        .withMessage('Address is required'),
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
    // check('lat')
    //     .exists().isFloat({min: -89, max: 91})
    //     .withMessage("Latitude must be within -90 and 90"),
    // check('lng')
    //     .exists().isFloat({min: -181, max: 181})
    //     .withMessage("Longitude must be within -180 and 180"),
    check('name')
        .exists().notEmpty().withMessage('Name is required')
        .isLength({max:50}).withMessage("Name must be less than 50 characters"),
    check('description')
        .exists().notEmpty()
        .withMessage("Description needs a minimum of 30 characters"),
    check('price')
    .custom((value) => {
        if (value !== "") { // Only validate if previewImage has a value
          if (value <= 0) {
            throw new Error('Price per day must be a positive number');
          }
        }else{
            throw new Error('Price is required')
        }
        return value
      }),
    check('previewImage')
        .custom((value) => {
            if (value !== "") { // Only validate if previewImage has a value
              if (!value.match(/\.(png|jpg|jpeg)$/i)) {
                throw new Error('Preview Image URL must end in .png, .jpg, or .jpeg');
              }
            }else{
                throw new Error('Preview Image is required')
            }
            return value
          }),
    handleValidationErrors
];

const validateBooking = [
    check('startDate')
    .notEmpty()
    .custom((value, ) => {
        if (new Date(value) < new Date()) {
          throw new Error('startDate cannot be in the past');
        }
        return true;
      }),
    check('endDate')
      .notEmpty()
      .custom((value, { req }) => {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);

        if (endDate <= startDate) {
          throw new Error('endDate cannot be on or before startDate');
        }
        return true;
      }),

      handleValidationErrors,
      checkBookingConflicts

  ]

//*Helper Function: Does Spot Exist?
async function findConflictingBookings(spotId, newStartDate, newEndDate) {
    const conflictingBooking = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            // Overlapping dates
            [Op.and]: [
              { startDate: { [Op.lt]: newEndDate } }, // Existing booking starts before new end date
              { endDate: { [Op.gt]: newStartDate } }, // Existing booking ends after new start date
            ],
          },
          {
            // Same start & end date (single booking)
            [Op.and]: [
              { startDate: { [Op.eq]: newStartDate } },
              { endDate: { [Op.eq]: newEndDate } },
            ],
          },
          {
            // Start date on existing start date
            [Op.and]: [
              { startDate: { [Op.eq]: newStartDate } },
            ],
          },
          {
            // End date on existing end date
            [Op.and]: [
              { endDate: { [Op.eq]: newEndDate } },
            ],
          },
          {
            // Dates within existing booking
            [Op.and]: [
              { startDate: { [Op.gt]: newStartDate } },
              { endDate: { [Op.lt]: newEndDate } },
            ],
          },
        ],
      },
    });
    return conflictingBooking;
  }

//*Helper Function for checking if user owns the spot:
function isOwner(userId,spot){
    //if the userId matches the ownerId on the spot,
    //then send back a true
    if (spot.ownerId == userId) return true
    else{return false}

    //else, send back false then send an error message
}

const bookingOwner = function(userId, booking){
    if (booking.userId === userId) return true
    else{return false}
};


// //*Get all Reviews by Spot's Id:

router.get('/:spotId/reviews', async(req,res,next)=>{
    let {spotId} = req.params;
    spotId = Number(spotId)
    const spot = await Spot.findByPk(spotId);

    if (!spot || spot === null){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    }else{
        const allReviews = {};

        const Reviews = await Review.findAll({
            where:{spotId:spotId},
            include:[{model:ReviewImage}, {model: User}]
        })
        allReviews.Reviews = Reviews;
        return res.json(allReviews)

    };

});

//Get all Bookings for a Spot based on the Spot's Id
//RequireAuth

router.get('/:spotId/bookings', requireAuth, async(req,res,next)=>{
    const userId = req.user.id
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId)
    if (!spot){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }

    const owned = isOwner(userId, spot)

    //Response for if you own the spot
    if(owned){
        //do not include the userId's
        const allBookings = await Booking.findAll({
            include: [{
                model:User,
                attributes:{
                    exclude: ['username','hashedPassword','email', 'createdAt','updatedAt']
                }
               // Want the scope used HERE!
            }],
            where: {spotId:spotId}
        });
        return res.json({Bookings:allBookings})

    }else{

    //Response for if you do NOT own the spot
    const allBookings = await Booking.scope('hideUser').findAll({
        where:{
            spotId:spotId
        },
    });

    return res.json({Bookings:allBookings})

    };
})

//*Create a booking from a spot based on the Spot's Id
//Require Auth
//isOwner must be false
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res)=> {

    let currUser = req.user
    let {spotId} = req.params
    let {startDate, endDate} = req.body

    let spot = await Spot.findByPk(spotId)

    if (!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if (spot.ownerId === currUser.id){
        res.status(403);
        return res.json({
            message:"Forbidden"
        })
    }
    if (spot.ownerId !== currUser.id ){

        let newBooking = await Booking.create({
            userId: currUser.id,
            spotId: spot.id,
            startDate,
            endDate
        })

        let formattedStartDate = newBooking.startDate.toISOString().split('T')[0];
        let formattedEndDate = newBooking.endDate.toISOString().split('T')[0];


    let createdAtDate = new Date(newBooking.createdAt);
    let updatedAtDate = new Date(newBooking.updatedAt)

    let createdAtD = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
    let updatedAtD = updatedAtDate.toISOString().replace('T', ' ').split('.')[0];


        let formattedResponse = {
            id: newBooking.id,
            userId: newBooking.userId,
            spotId: newBooking.spotId,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            createdAt: createdAtD,
            updatedAt: updatedAtD
        }

        return res.status(200).json(formattedResponse)
    }


})

//* GET ALL SPOTS
//! FOR Getting All Spots I should Calculate the AvgRating
router.get('/', async(req,res)=>{
    let {
        page = 1,
        size = 20,
        minLat = null,
        maxLat = null,
        minLng = null,
        maxLng = null,
        minPrice = null,
        maxPrice = null
    } = req.query;

    const filter = {
        where: {},
        limit: size,
        offset: (page - 1) * size,
        include:[{model: Review, include:[{model:ReviewImage}]}, {model:SpotImage}]
    };

    const queryValidErrors = {};

    function isNumeric(str) {
        return /^\d+$/.test(str);
    }


    //*Check Page and Size


    if(!isNumeric(page)){
        queryValidErrors.page = "Page must be an integer"

    }else if(page < 1){
        queryValidErrors.page = "Page must be greater than or equal to 1"
    }else if(page >10){
        queryValidErrors.page = "Page must be less than or equal to 10"
    }
    //Check size
    if(!isNumeric(size)){
        queryValidErrors.size = "Size must be an integer"
    }else if(size < 1){
        queryValidErrors.size = "Size must be greater than or equal to 1"
    }else if(size > 20){
        queryValidErrors.size = "Size must be less than or equal to 20"

    };


    //Check Lat
    if(maxLat !== null){
        //if it is not null, then it was put in.
        //Make it into a number incase it is negative
        //Now it is either a number or NaN
        const isNotNumber = isNaN(maxLat)
        if(isNotNumber){
            queryValidErrors.maxLat = "Maximum Latitude is invalid"
        }else if(!isNotNumber){
            maxLat = Number(maxLat);
            if((maxLat > 90.00 || maxLat < -90.00)){
                queryValidErrors.maxLat = "Maximum Latitude is invalid";
            }
        }
    };
    if(minLat !== null){
        //if it is not null, then it was put in.
        //Make it into a number incase it is negative
        //Now it is either a number or NaN
        const isNotNumber = isNaN(minLat)
        if(isNotNumber){
            queryValidErrors.minLat = "Minimum Latitude is invalid"
        }else if(!isNotNumber){
            minLat = Number(minLat);
            if((minLat > 90.00 || minLat < -90.00)){
                queryValidErrors.minLat = "Minimum Latitude is invalid";
            }
        }
    };

    //Check Lng
    if(minLng !== null){
        //if it is not null, then it was put in.
        //Make it into a number incase it is negative
        //Now it is either a number or NaN
        const isNotNumber = isNaN(minLng)
        if(isNotNumber){
            queryValidErrors.minLng = "Minimum longitude is invalid"
        }else if(!isNotNumber){
            minLng = Number(minLng);
            if((minLng > 180.00 || minLng < -180.00)){
                queryValidErrors.minLng = "Minimum longitude is invalid";
            }
        }
    };
    if(maxLng !== null){
        //if it is not null, then it was put in.
        //Make it into a number incase it is negative
        //Now it is either a number or NaN
        const isNotNumber = isNaN(maxLng)
        if(isNotNumber){
            queryValidErrors.maxLng = "Maximum longitude is invalid"
        }else if(!isNotNumber){
            maxLng = Number(maxLng);
            if((maxLng > 180.00 || maxLng < -180.00)){
                queryValidErrors.maxLng = "Maximum longitude is invalid";
            }
        }
    };

    if(minPrice !== null){
        const isNotNumber = isNaN(minPrice)
        if(isNotNumber){
            queryValidErrors.minPrice = "Minimum price is invalid"
        }else if(!isNotNumber){
            minPrice = Number(minPrice);
            if(minPrice < 0){
                queryValidErrors.minPrice = "Minimum price must be greater than or equal to 0"
            }
        }

    };
    if(maxPrice !== null){
        const isNotNumber = isNaN(maxPrice)
        if(isNotNumber){
            queryValidErrors.maxPrice = "Maximum price is invalid"
        }else if(!isNotNumber){
            maxPrice = Number(maxPrice);
            if(maxPrice < 0){
                queryValidErrors.maxPrice = "Maximum price must be greater than or equal to 0"
            }
        }

    };

    if(queryValidErrors.page ||queryValidErrors.size || queryValidErrors.minLat || queryValidErrors.maxLat || queryValidErrors.minLng || queryValidErrors.maxLng ||queryValidErrors.minPrice || queryValidErrors.maxPrice ){
        res.status(400);
        const e = new Error()
        e.message = "Bad Request"
        e.errors = queryValidErrors;
        return res.json(e)
    }
    // const avgRating = reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length;

    // spot.dataValues.avgRating = avgRating;
    if (minLat && maxLat) {
        filter.where.lat = {
            [Op.between]: [parseFloat(minLat), parseFloat(maxLat)],
        };
    }

    if (minLng && maxLng) {
        filter.where.lng = {
            [Op.between]: [parseFloat(minLng), parseFloat(maxLng)],
        };
    }

    if (minLat){
        filter.where.lat = {
            [Op.gte]: parseFloat(minLat)
        }
    }

    if (maxLat){
        filter.where.lat = {
            [Op.lte]: parseFloat(maxLat)
        }
    }

    if (minLng){
         filter.where.lng = {
            [Op.gte]: parseFloat(minLng)
        }
    }

    if (maxLng){
         filter.where.lng = {
            [Op.lte]: parseFloat(maxLng)
        }
    }

    if (minPrice){
        filter.where.price = {
            [Op.gte]: parseFloat(minPrice)
        }
    }

    if (maxPrice){
        filter.where.price = {
            [Op.lte]: parseFloat(maxPrice)
        }
    }


    if (minPrice && maxPrice) {
        filter.where.price = {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)],
        };
    }


    let allSpots = await Spot.findAll({...filter});
    // sqlize fnc 
    // console.log("ALL SPOTS---------------------------------",allSpots)
    allSpots.forEach((spot)=> {
    const initialValue = 0;
    const rating = spot?.Reviews.reduce((acc, curr)=> acc + curr.stars, initialValue)
    if(rating){
        spot.avgRating = (rating / spot.Reviews.length).toFixed(2)
    }
    })


    return res.json({
        Spots: allSpots,
        page: parseInt(page),
        size: parseInt(size),
    });
});

//*GET ALL SPOTS OWNED BY CURR USER
router.get('/current', requireAuth, async(req,res,next)=>{
    const currId = req.user.dataValues.id
    const ownedSpots = {};

    let Spots = await Spot.findAll({
        where: {ownerId: currId},
        include:[{model:SpotImage}]
    })
    ownedSpots.Spots = Spots;

    return res.json(ownedSpots)
})

//!THIS WORKS BUT I NEED TO ADDRESS AN ON DELETE
//! CASCADE FOR WHEN A USER IS DELETED,
//! THEN THEIR SPOTS ARE DELETED.


//* GET DETAILS OF A SPOT FROM AN ID
router.get('/:spotId', async(req,res,next)=>{
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId,{
        include: [{model:Review, include:{model:User}},{model:SpotImage},{model:User, as: 'Owner', attributes: {exclude: ['username']}}]
    });
    if (spot === null){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }else{
        spot.numReviews = spot.Reviews.length;
        return res.json(spot);
    }
    

})





// ADD AN IMAGE TO A SPOT

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
    }else if(!isOwner(currId,spot)){
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    }else{
        const newImage = await SpotImage.create({url,spotId, preview});
        await spot.update(
            {
                previewImage: url
            }
        );

        const response = {
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        }
        return res.json(response)
    };

})


//? MADE AVG RATING AND PREVIEW IMAGE DEFAULT TO UNDEFINED ON MODEL
//? SO THAT IT DOESN'T SHOW UP UNLESS THEY MAKE IT.

//*POST api/spot/:spotId/reviews:
// Create a Review for a Spot based on the Spot's Id
router.post('/:spotId/reviews', requireAuth, async(req,res,next)=>{
    let { spotId } = req.params;
    spotId = Number(spotId)
    const spot = await Spot.findByPk(spotId)
    if (!spot){
        res.status(404)
        return res.json({
            message:"Spot couldn't be found"
        })
    }
    const  userId  = req.user.id;
    const { review, stars } = req.body;
    //Body Validation Errors
    let errors = {};
    if(!review){
        errors.review = 'Review text is required'
    };
    // if the stars are less than 1 or more than 5 or if in general the type of stars is not a number then
    // throw this error
    if ((stars < 1 || stars > 5) || typeof stars !== 'number'){
        errors.stars = 'Stars must be an integer from 1 to 5'
    }
    if(errors.review || errors.stars){
        e = new Error()
        e.message = "Bad Request"
        e.errors = errors;

        res.status(400)
        return res.json(e)
    }
    const isAlreadyReview = await Review.findOne({
        where: {
            userId:userId,
            spotId:spotId
        }
    })
    if(isAlreadyReview) {
        res.status(500)
        return res.json({message: "User already has a review for this spot"})
    }
    const newReviewForSpot = await Review.create({userId,spotId,review,stars})
    res.status(201);
    return res.json(newReviewForSpot)

});

//CREATE A SPOT

router.post('/', requireAuth, validateSpot, async(req,res,next)=>{

    // console.log('we are here \n\n\n\n')
    const {address, city, state, country, lat= null, lng = null, name, description, price, previewImage, SpotImages} = req.body;
    console.log(lat, lng)
    const ownerId = req.user.id;

    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price, previewImage, SpotImages});
    res.status(201);
    const formattedResponse = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng:newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        previewImage: newSpot.previewImage,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt,
    }
    return res.json(formattedResponse)
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
    }else if (!isOwner(currId,spot)){
            res.status(403);
            return res.json({
                message:"Forbidden"
            })
        }else{
            const { address, city, state, country, lat, lng, name, description, price, previewImage} = req.body;

            await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
                previewImage,
            })


            //? NEED TO CHECK TO MAKE SURE THE EDITS ARE
            //? OKAY BEFORE WE PUSH THEM TO THE DB

            return res.json(spot)
        }
});


router.delete('/:spotId',requireAuth, async(req,res,next)=>{
    const currId = req.user.id;
    const {spotId} = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }else if (!isOwner(currId,spot)){
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

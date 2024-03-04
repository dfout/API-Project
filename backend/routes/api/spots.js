// backend/routes/api/users.js
const express = require('express');
const { Op, FLOAT } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Spot, SpotImage, User, Review, ReviewImage, Booking} = require('../../db/models');

const { check, validationResult } = require('express-validator');
// const { validateReview } = require('./reviewValidator.js')
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


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
//*Helper Function: Does Spot Exist?

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
    const {spotId} = req.params;
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
            include:[{model:ReviewImage}]
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
router.post('/:spotId/bookings', requireAuth, async(req,res,next)=>{
    const userId = req.user.id;
    let { spotId } = req.params;
    spotId = Number(spotId)

    //Ensure Spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot){
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }
    //Ensure user is not the owner
    const owned = isOwner(userId, spot);
    //if user is owner, throw an error
    if (owned){
        res.status(403);
        return res.json({
            message:"Forbidden"
        });
    };

    const { startDate, endDate } = req.body;
    let newStartDate = new Date(startDate);
    let newEndDate = new Date(endDate);


    const bnewStartDate = newStartDate.toISOString().split('T')[0];
    const bnewEndDate= newEndDate.toISOString().split('T')[0];



    //Check for any Validation Errors
    let errors = {};

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    //Ensure that the startDate is not in the past
    if (bnewStartDate < formattedDate){
        errors.startDate = "startDate cannot be in the past"

    };
    //Ensure that the endDate is not the same as or before the startDate
    if (bnewEndDate === bnewStartDate || bnewEndDate < bnewStartDate){
        errors.endDate = "endDate cannot be on or before startDate"
    };
    if (errors.startDate || errors.endDate){
        res.status(400);
        const e = new Error()
        e.message = "Bad Request";
        e.errors = errors;
        return res.json(e)
    }
    const isConflict = await Booking.findOne({
        where:{
            [Op.or]:{
                startDate: {
                    [Op.between]:[bnewStartDate,bnewEndDate]
                },
                endDate: {
                    [Op.between]:[bnewStartDate,bnewEndDate]
                }
            }
        }
    })

    const bookingErrors = {};

    if(isConflict){
        let sd = isConflict.startDate;
        let ed = isConflict.endDate;
        sd= sd.toISOString().split('T')[0];
        ed= ed.toISOString().split('T')[0];
        console.log(sd,ed)
        console.log(bnewStartDate,bnewEndDate)

        if(sd === bnewStartDate || ed === bnewStartDate){
            bookingErrors.startDate = "Start date conflicts with an existing booking";
        }
        if (sd == bnewEndDate || (bnewStartDate < sd && bnewEndDate < ed)){
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
        if (bnewStartDate < sd && ed == bnewEndDate){
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
        if(bnewStartDate < sd && ed < bnewEndDate){
            bookingErrors.startDate = "Start date conflicts with an existing booking";
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
        if (sd == bnewStartDate && ed == bnewEndDate){
            bookingErrors.startDate = "Start date conflicts with an existing booking";
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
        if ((sd == bnewStartDate || sd < bnewStartDate) && ed < bnewEndDate){
            bookingErrors.startDate = "Start date conflicts with an existing booking";
        }
        if ((sd == bnewStartDate || sd < bnewStartDate) && bnewEndDate < ed){
            bookingErrors.startDate = "Start date conflicts with an existing booking";
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
        if(sd < bnewStartDate && ed == bnewEndDate){
            bookingErrors.startDate = "Start date conflicts with an existing booking";
            bookingErrors.endDate = "End date conflicts with an existing booking";
        }
    };


    if (bookingErrors.startDate || bookingErrors.endDate){
        res.status(403);
        const e = new Error()
        e.message = "Sorry, this spot is already booked for the specified dates"
        e.errors = bookingErrors;
        return res.json(e)
    }

    //If there are no errors/conflicts
    const newBooking = await Booking.create({
        spotId:spotId,
        userId:userId,
        startDate:bnewStartDate,
        endDate:bnewEndDate
    });

    return res.json(newBooking)
});

// const validateQueryFilters = [
//     check('page')
//         .exists({checkFalsy:true})
//         .isEmail()
//         .withMessage('Invalid email'),
//     check('size')
//         .exists({checkFalsy:true})
//         .isLength({min:4}).withMessage('Please provide a username with at least 4 characters.'),
//     check('maxLat')
//         .exists({values: 'undefined'}).withMessage('Username is required'),
//     check('minLat')
//         .not()
//         .isEmail()
//         .withMessage('Username cannot be an email'),
//     check('minLng')
//         .notEmpty()
//         .withMessage('First Name is required'),
//     check('maxLng')
//         .notEmpty()
//         .withMessage('Last Name is required'),
//     check('minPrice')
//         .exists({checkFalsy:true})
//         .isLength({min:6})
//         .withMessage('Password must be 6 characters or more.'),
//         check('minPrice')
//         .exists({checkFalsy:true})
//         .isLength({min:6})
//         .withMessage('Password must be 6 characters or more.'),
//     handleValidationErrors
// ];
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
            if((maxLat > 180.00 || maxLat < -180.00)){
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
            if((minLat > 180.00 || minLat < -180.00)){
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


    const allSpots = await Spot.findAll({...filter});

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
        where: {ownerId: currId}
    })
    ownedSpots.Spots = Spots;

    return res.json(ownedSpots)
})

//!THIS WORKS BUT I NEED TO ADDRESS AN ON DELETE
//! CASCADE FOR WHEN A USER IS DELETED,
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

        const response = {
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        }
        return res.json(response)
    };

})

// CREATE A SPOT
//? MADE AVG RATING AND PREVIEW IMAGE DEFAULT TO UNDEFINED ON MODEL
//? SO THAT IT DOESN'T SHOW UP UNLESS THEY MAKE IT.

//*POST api/spot/:spotId/reviews:
// Create a Review for a Spot based on the Spot's Id
router.post('/:spotId/reviews', requireAuth, async(req,res,next)=>{
    const { spotId } = req.params;

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



router.post('/', requireAuth, validateSpot, async(req,res,next)=>{
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id;

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
    }else if (!isOwner(currId,spot)){
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

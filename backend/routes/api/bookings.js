const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot, Booking} = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

function deepAuth(userId, booking){
    if(booking.userId===userId) return true;
    else{
        return false
    };
}

// Return all the bookings that the current user has made
router.get('/current',requireAuth, async(req,res,next)=>{

    const userId = req.user.id;

    const currBookings = await Booking.findAll({
        where:{userId:userId},
        include:[{model: Spot}]

    })

    return res.json({Bookings:currBookings})
});

router.put('/:bookingId', requireAuth, async(req,res,next)=>{
    const { bookingId } = req.params;
    const userId = req.user.id;
    // does booking exist?
    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        });
    }
    // Authorization Check
    const isOwner = deepAuth(userId, booking);
    if (!isOwner){
        res.status(403);
        return res.json({
            message:"Forbidden"
        });
    };
    //Validation Errors:
    const { newStartDate, newEndDate } = req.body;

    //Check for any Validation Errors
    let errors = {};

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;



    //Ensure that the startDate is not in the past
    if (newStartDate < formattedDate){
        errors.startDate = "startDate cannot be in the past"

    };
    //Ensure that the endDate is not the same as or before the startDate
    if (newEndDate === newStartDate || newEndDate < newStartDate){
        errors.endDate = "endDate cannot be on or before startDate"
    };
    if (errors.startDate || errors.endDate){
        res.status(400);
        const e = new Error()
        e.message = "Bad Request";
        e.errors = errors;
        return res.json(e)
    }

    //Cannot edit a booking that's past the end date
    if(formattedDate > newEndDate){
        res.status(403);
        return res.json({
            message: "Past bookings can't be modified"
        })
    }

    //Booking Conflicts:
    const isConflictingStart = Booking.findOne({
        //find where the date range might inc
        where: {
            startDate:{
                [Op.between]:[newStartDate, newEndDate]
            }

        }

    });
    const isConflictingEnd = Booking.findOne({
        where:{
            endDate:{
                [Op.between]:[newStartDate,newEndDate]
            }
        }
    });

    //Check for Booking conflicts
    const bookingErrors = {};
     Conflicts:
    // start date is included in a date range (inclusive date range)
    if(isConflictingStart){
        bookingErrors.startDate = "Start date conflicts with an existing booking"
    };
    //endDate is included in a date range (inclusive date range)
    if(isConflictingEnd){
        bookingErrors.endDate = "End date conflicts with an existing booking"
    };

    if (bookingErrors.startDate || bookingErrors.endDate){
        res.status(403);
        const e = new Error()
        e.message = "Sorry, this spot is already booked for the specified dates"
        e.errors = bookingErrors;
        return res.json(e)
    }
    //If there are no conflicts:
    const updatedBooking = await booking.update(req.body)
    return res.json(updatedBooking)
});





module.exports = router;

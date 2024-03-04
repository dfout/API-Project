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
    //If there are no conflicts:
    const updatedBooking = await booking.update(req.body)
    return res.json(updatedBooking)
});

// *DELETE a booking
router.delete('/:bookingId', requireAuth, async(req,res,next)=>{
    const userId = req.user.id;
    const { bookingId } = req.params;

    // *Does booking exist?
    const booking = await Booking.findByPk(bookingId)
    if (!booking){
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        })
    };

    //*Are they the owner of the booking?
    const isOwner = deepAuth(userId, booking)
    if(!isOwner){
        res.status(403);
        return res.json({
            message:"Forbidden"
        });
    };


    //* Bookings that have started cannot be deleted
    //Current Date:
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    //Compare dates
    if(booking.startDate < formattedDate){
        res.status(403);
        return res.json({
            message: "Bookings that have been started can't be deleted"
        })
    };
    //if no errors are thrown,
    //* Return a successfully deleted message

    await booking.destroy();
    return res.json({
        message: "Successfully deleted"
    });

});





module.exports = router;

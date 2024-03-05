const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot, Booking} = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors,checkBookingConflicts, checkBookingConflictsUpdates,checkBookingConflictsBookings } = require('../../utils/validation');

const router = express.Router();

function deepAuth(userId, booking){
    if(booking.userId===userId) return true;
    else{
        return false
    };
}

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
  ]


// Return all the bookings that the current user has made
router.get('/current',requireAuth, async(req,res,next)=>{

    const userId = req.user.id;

    const currBookings = await Booking.findAll({
        where:{userId:userId},
        include:[{model: Spot}]

    })

    return res.json({Bookings:currBookings})
});

router.put('/:bookingId', requireAuth, validateBooking, async (req, res)=> {
    let currUser = req.user
    let {bookingId} = req.params
    let {startDate, endDate} = req.body

    let booking = await Booking.findByPk(Number(bookingId))

    if (!booking){
        return res.status(404).json({message: "Booking couldn't be found"})
    }


    let queriedEndTime = new Date (booking.endDate).getTime()


    if (booking.userId !== currUser.id){
        return res.status(403).json({message: 'Forbidden'})
    }

    let startBookingDate = new Date (startDate).getTime()
    let endBookingDate = new Date (endDate).getTime()

    let currDateTime = new Date().getTime()

    if (currDateTime > queriedEndTime ){
        res.status(403).json({message: "Past bookings can't be modified"})
    }

    let excludingCurrentBooking = await Booking.findAll({
        where: {
            id: {
                [Op.ne]: bookingId
            },

            spotId: booking.spotId


        }
    })



    for (let otherBooking of excludingCurrentBooking){

        let startDateOtherBooking = new Date(otherBooking.startDate).getTime()
        let endingDateOtherBooking = new Date (otherBooking.endDate).getTime()

        if ((startBookingDate < endingDateOtherBooking && endBookingDate > startDateOtherBooking) ||
           (startBookingDate === endingDateOtherBooking || endBookingDate === startDateOtherBooking)) {


            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                  startDate: 'Start date conflicts with an existing booking',
                  endDate: 'End date conflicts with an existing booking'
                }
            });
        }

    }





    if (booking.userId === currUser.id){

        // await booking.update({ startDate, endDate });

        booking.startDate = startDate
        booking.endDate = endDate

        await booking.save()

        let createdAtDate = new Date(booking.createdAt);
        let updatedAtDate = new Date(booking.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        updatedAtDate = updatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let bookingStartDate = booking.startDate.toISOString().split('T')[0];
        let bookingEndDate = booking.endDate.toISOString().split('T')[0];

        let formattedResponse = {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: bookingStartDate,
            endDate: bookingEndDate,
            createdAt: createdAtDate,
            updatedAt: updatedAtDate

        }


       return res.status(200).json(formattedResponse)
    }


})

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

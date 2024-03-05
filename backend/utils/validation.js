const { validationResult } = require('express-validator');
const {Booking} = require('../db/models')
const {Op} = require('sequelize')
const {Sequelize} = require('sequelize')

const handleValidationErrors = (req, _res, next) =>{
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()){
        const errors = {};

        validationErrors
            .array()
            .forEach(error=> errors[error.path] = error.msg);

        const err = new Error();
        err.errors = errors;
        err.status = 400;
        err.message = 'Bad request.'
        // err.title = 'Bad request'
        err.stack = undefined;
        err.title=undefined;
       return _res.json({message:err.message, errors:err.errors})
    }
    next()
};


async function checkBookingConflicts(req, res, next) {
    const { startDate, endDate } = req.body;

    const bookingConflict = await Booking.findOne({
      where: {
        spotId: req.params.spotId,
        [Op.or]: [

          { endDate: { [Op.between]: [startDate, endDate] } },

          {
            [Op.and]: [

              { startDate: { [Op.lte]: startDate } },

              {endDate:{[Op.gte]:startDate}}
            ],
          },

          {
            [Op.and]: [

              { startDate: { [Op.lte]: endDate } },

              { endDate: { [Op.gte]: endDate } },
            ],
          },

          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },

          {endDate: {[Op.eq]: new Date(startDate)}},

        ],
      }
    });

    if (bookingConflict) {
      return res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors: {
          startDate: 'Start date conflicts with an existing booking',
          endDate: 'End date conflicts with an existing booking'
        }
      });
    }

    next();
  }

module.exports = {
    handleValidationErrors, checkBookingConflicts
}

//*Conflicting Booking Helper Func
//CASES:

                     //* Double Sandwich// Both
                    // sd nsd ned ed
                    // sdnsd edned
                    //sdnsd ned ed
                    // sd nsd neded

                    // nsd  sd  ed ned
                    // nsd sd ned ed
                    //* StartDates //NSD
                    // sdnsd ed ned
                    //*NewStart Date + ED //NST
                    // nsded ed
                    //* SD + NewEndDate// NED
                    //nsd sdned ed
                    //*NewEndDate + SD //NED
                    // nsd nedsd

//more recent dates are greater
// 1   2    3    4   5   6   7   8   9  10
//past dates are lower
// right now, I am not interpreting results, only finding the first conflict.
//then I will interpret the results and put out the right error messages
/**Easy Cases:
    startDate == newStartDate  //off to the wrong start --likely has endDate conflict too
    startDate == newEndDate   //endDate

    endDate == newStartDate    //startDate
    endDate == newEndDate      //off to the wrong start ---likely has startDate conflict too


        b            |-------------|          b
    startDate < newStartDate && newEndDate < endDate    //start and end

        b             |-------------b----------|
    startDate < newStartDate && endDate < newEndDate    //start and end

        |----------------b-------------|       b
    newStartDate < startDate && newEndDate < endDate    //end date
        |----------------b----------b---------|
    newStartDate < startDate && endDate < newEndDate   //end date


***/
// const findConflictingBooking = async (spotId, newStartDate, newEndDate)=>{
//     const conflictingBooking = await Booking.findOne({
//         where: {
//             spotId,
//             [Op.or]: [{startDate: newStartDate},
//                 {endDate:newEndDate},
//                     {[Op.or]: [
//                         {startDate:newEndDate},
//                         {endDate: newStartDate}
//                     ]},

//             ]
//         },
//     })
//     return [conflictingBooking.startDate, conflictingBooking.endDate]
// };

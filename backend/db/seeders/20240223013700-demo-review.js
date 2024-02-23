'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Review.bulkCreate([
    {
      userId:1,
      spotId:2,
      review:"Liked the stay.",
      stars: 3.0
    },
    {
      userId:2,
      spotId:1,
      review:"Place was clean.",
      stars: 3.5
    },
    {
      userId:3,
      spotId:1,
      review:"Great Location",
      stars:4.5
    },
    {
      userId:1,
      spotId:2,
      review: "Could be better",
      stars:2.0
    },
   ], {validate:true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      userId: {[Op.in]: [1,2,3]}
    }, {})
  }
};

'use strict';
const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await SpotImage.bulkCreate([
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-5.jpg',
        spotId:1,
        preview: false,
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-5.jpg',
        spotId:1,
        preview: false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-5.jpg',
        spotId:1,
        preview:false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-5.jpg',
        spotId:1,
        preview:false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-13.jpg',
        spotId:2,
        preview:false,
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-13.jpg',
        spotId:2,
        preview:false
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-13.jpg',
        spotId:2,
        preview:false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/interiors/images-13.jpg',
        spotId:2,
        preview:false
      }

    ], {validate:true})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
  const Op = Sequelize.Op;
  return queryInterface.bulkDelete(options,{
    spotId: {[Op.in]: [1,2]}
  }, {})

  }
  
};

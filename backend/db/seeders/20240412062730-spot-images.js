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
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-QH2FJevcbfY-unsplash.jpg',
        spotId:1,
        preview: false,
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-QH2FJevcbfY-unsplash.jpg',
        spotId:1,
        preview: false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-QH2FJevcbfY-unsplash.jpg',
        spotId:1,
        preview:false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-QH2FJevcbfY-unsplash.jpg',
        spotId:1,
        preview:false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/hans-isaacson-sHGWuQtDv_U-unsplash.jpg',
        spotId:2,
        preview:false,
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/hans-isaacson-sHGWuQtDv_U-unsplash.jpg',
        spotId:2,
        preview:false
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/hans-isaacson-sHGWuQtDv_U-unsplash.jpg',
        spotId:2,
        preview:false
      },
      {
        url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/hans-isaacson-sHGWuQtDv_U-unsplash.jpg',
        spotId:2,
        preview:false
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/johnny-africa-RGvbdyhsh_U-unsplash.jpg',
        spotId:3,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/johnny-africa-RGvbdyhsh_U-unsplash.jpg',
        spotId:3,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/johnny-africa-RGvbdyhsh_U-unsplash.jpg',
        spotId:3,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/johnny-africa-RGvbdyhsh_U-unsplash.jpg',
        spotId:3,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/karsten-winegeart-tnEPrPX86Ts-unsplash.jpg',
        spotId:4,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/karsten-winegeart-tnEPrPX86Ts-unsplash.jpg',
        spotId:4,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/karsten-winegeart-tnEPrPX86Ts-unsplash.jpg',
        spotId:4,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/karsten-winegeart-tnEPrPX86Ts-unsplash.jpg',
        spotId:4,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/kelcie-papp-YVGtHXF6qZg-unsplash.jpg',
        spotId:5,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/kelcie-papp-YVGtHXF6qZg-unsplash.jpg',
        spotId:5,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/kelcie-papp-YVGtHXF6qZg-unsplash.jpg',
        spotId:5,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/kelcie-papp-YVGtHXF6qZg-unsplash.jpg',
        spotId:5,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/madhur-shrimal-jo8pclRHmCI-unsplash.jpg',
        spotId:6,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/madhur-shrimal-jo8pclRHmCI-unsplash.jpg',
        spotId:6,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/madhur-shrimal-jo8pclRHmCI-unsplash.jpg',
        spotId:6,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/madhur-shrimal-jo8pclRHmCI-unsplash.jpg',
        spotId:6,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/naoram-sea-7jCABgMFW7I-unsplash.jpg',
        spotId:7,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/naoram-sea-7jCABgMFW7I-unsplash.jpg',
        spotId:7,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/naoram-sea-7jCABgMFW7I-unsplash.jpg',
        spotId:7,
        preview: false,
      },
      {
        url:'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/naoram-sea-7jCABgMFW7I-unsplash.jpg',
        spotId:7,
        preview: false,
      },
        // Spot ID 8
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-44f42VRbGQg-unsplash.jpg',
    spotId: 8,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-44f42VRbGQg-unsplash.jpg',
    spotId: 8,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-44f42VRbGQg-unsplash.jpg',
    spotId: 8,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-44f42VRbGQg-unsplash.jpg',
    spotId: 8,
    preview: false
  },

  // Spot ID 9
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-5m3v4GBB82o-unsplash.jpg',
    spotId: 9,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-5m3v4GBB82o-unsplash.jpg',
    spotId: 9,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-5m3v4GBB82o-unsplash.jpg',
    spotId: 9,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-5m3v4GBB82o-unsplash.jpg',
    spotId: 9,
    preview: false
  },

  // Spot ID 10
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-reuIAvaxUMk-unsplash.jpg',
    spotId: 10,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-reuIAvaxUMk-unsplash.jpg',
    spotId: 10,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-reuIAvaxUMk-unsplash.jpg',
    spotId: 10,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-reuIAvaxUMk-unsplash.jpg',
    spotId: 10,
    preview: false
  },

  // Spot ID 11
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis--L5Xx5sugq8-unsplash.jpg',
    spotId: 11,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis--L5Xx5sugq8-unsplash.jpg',
    spotId: 11,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis--L5Xx5sugq8-unsplash.jpg',
    spotId: 11,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis--L5Xx5sugq8-unsplash.jpg',
    spotId: 11,
    preview: false
  },

  // Spot ID 12
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-1f8OGhDKqUI-unsplash.jpg',
    spotId: 12,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-1f8OGhDKqUI-unsplash.jpg',
    spotId: 12,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-1f8OGhDKqUI-unsplash.jpg',
    spotId: 12,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-1f8OGhDKqUI-unsplash.jpg',
    spotId: 12,
    preview: false
  },

  // Spot ID 13
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-4oapbWR-8ZI-unsplash.jpg',
    spotId: 13,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-4oapbWR-8ZI-unsplash.jpg',
    spotId: 13,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-4oapbWR-8ZI-unsplash.jpg',
    spotId: 13,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-4oapbWR-8ZI-unsplash.jpg',
    spotId: 13,
    preview: false
  },

  // Spot ID 14
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/frederic-bourbeau-qECV3wh4uZM-unsplash.jpg',
    spotId: 14,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/frederic-bourbeau-qECV3wh4uZM-unsplash.jpg',
    spotId: 14,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/frederic-bourbeau-qECV3wh4uZM-unsplash.jpg',
    spotId: 14,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/frederic-bourbeau-qECV3wh4uZM-unsplash.jpg',
    spotId: 14,
    preview: false
  },

  // Spot ID 15
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-IHmk3tSR_BI-unsplash.jpg',
    spotId: 15,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-IHmk3tSR_BI-unsplash.jpg',
    spotId: 15,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-IHmk3tSR_BI-unsplash.jpg',
    spotId: 15,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-IHmk3tSR_BI-unsplash.jpg',
    spotId: 15,
    preview: false
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-jIUmnlLPfzk-unsplash.jpg',
    preview:false,
    spotId:16
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-jIUmnlLPfzk-unsplash.jpg',
    preview:false,
    spotId:16
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-jIUmnlLPfzk-unsplash.jpg',
    preview:false,
    spotId:16
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-jIUmnlLPfzk-unsplash.jpg',
    preview:false,
    spotId:16
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-on_wnJU2n7g-unsplash.jpg',
    preview:false,
    spotId:17
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-on_wnJU2n7g-unsplash.jpg',
    preview:false,
    spotId:17
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-on_wnJU2n7g-unsplash.jpg',
    preview:false,
    spotId:17
  },
  {
    url: 'https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-on_wnJU2n7g-unsplash.jpg',
    preview:false,
    spotId:17
  },
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

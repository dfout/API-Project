'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Example City',
        state: 'CA',
        country: 'USA',
        lat: '37.7749',
        lng: '-122.4194',
        name: 'Beautiful Spot 1',
        description: 'A lovely spot with a great view.',
        price: 100.00,
        // avgRating: 3.25,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-QH2FJevcbfY-unsplash.jpg"
      },
      {
        ownerId: 2,
        address: '456 Oak Ave',
        city: 'Another City',
        state: 'NY',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Cozy Retreat',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        avgRating: 4.51,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/hans-isaacson-sHGWuQtDv_U-unsplash.jpg"
      },
      {
        ownerId: 2,
        address: '678 Pike Ave',
        city: 'Another City',
        state: 'GA',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Cozy Retreat',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/johnny-africa-RGvbdyhsh_U-unsplash.jpg"
      },
      {
        ownerId: 1,
        address: '220 Main Ave',
        city: 'Example City',
        state: 'MA',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Adventurous Stay',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/karsten-winegeart-tnEPrPX86Ts-unsplash.jpg"
      },
      {
        ownerId: 1,
        address: '1189 Sicamore St',
        city: 'Port Townsend',
        state: 'WA',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Warm Stay',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/kelcie-papp-YVGtHXF6qZg-unsplash.jpg"
      },
      {
        ownerId: 2,
        address: '103 Maple Rd',
        city: 'Example City',
        state: 'OH',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Fun stay',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/madhur-shrimal-jo8pclRHmCI-unsplash.jpg"
      },
      {
        ownerId: 2,
        address: '123 Capitol Rd',
        city: 'Example City',
        state: 'PA',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Fun stay',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/naoram-sea-7jCABgMFW7I-unsplash.jpg"
      },
      {
        ownerId: 1,
        address: '220 Main Ave',
        city: 'Example City',
        state: 'MA',
        country: 'USA',
        lat: '40.7128',
        lng: '-74.0060',
        name: 'Adventurous Stay',
        description: 'Perfect spot for a weekend getaway.',
        price: 150.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-44f42VRbGQg-unsplash.jpg"
      },
      {
        ownerId: 1,
        address: '1189 Sicamore St',
        city: 'Port Townsend',
        state: 'WA',
        country: 'USA',
        lat: '48.1170',
        lng: '-122.7604',
        name: 'Warm Stay',
        description: 'Cozy and inviting place to relax.',
        price: 180.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-5m3v4GBB82o-unsplash.jpg"
      },
      {
        ownerId: 2,
        address: '103 Maple Rd',
        city: 'Columbus',
        state: 'OH',
        country: 'USA',
        lat: '39.9612',
        lng: '-82.9988',
        name: 'Fun Stay',
        description: 'Enjoy a fun-filled stay with family and friends.',
        price: 200.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/aislinn-spaman-reuIAvaxUMk-unsplash.jpg"
      },
      {
        ownerId: 2,
        address: '123 Capitol Rd',
        city: 'Harrisburg',
        state: 'PA',
        country: 'USA',
        lat: '40.2732',
        lng: '-76.8867',
        name: 'Urban Retreat',
        description: 'Experience the city life in this modern apartment.',
        price: 220.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis--L5Xx5sugq8-unsplash.jpg"
      },
      {
        ownerId: 3,
        address: '456 Elm St',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: '30.2672',
        lng: '-97.7431',
        name: 'Luxe Living',
        description: 'Stay in the heart of Austin with all amenities.',
        price: 250.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-1f8OGhDKqUI-unsplash.jpg"
      },
      {
        ownerId: 3,
        address: '789 Pine St',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        lat: '39.7392',
        lng: '-104.9903',
        name: 'Mountain View',
        description: 'Beautiful views of the mountains and nature.',
        price: 300.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/andrea-davis-4oapbWR-8ZI-unsplash.jpg"
      },
      {
        ownerId: 4,
        address: '1010 Cedar St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: '34.0522',
        lng: '-118.2437',
        name: 'Hollywood Home',
        description: 'Live like a star in this chic Hollywood home.',
        price: 400.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/frederic-bourbeau-qECV3wh4uZM-unsplash.jpg"
      },
      {
        ownerId: 4,
        address: '1212 Spruce St',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        lat: '47.6062',
        lng: '-122.3321',
        name: 'Seattle Serenity',
        description: 'Peaceful retreat in the heart of the city.',
        price: 350.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-IHmk3tSR_BI-unsplash.jpg"
      },
      {
        ownerId: 5,
        address: '1313 Oak St',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        lat: '41.8781',
        lng: '-87.6298',
        name: 'Windy City Stay',
        description: 'Comfortable stay in the windy city.',
        price: 270.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-jIUmnlLPfzk-unsplash.jpg"
      },
      {
        ownerId: 5,
        address: '1414 Birch St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: '37.7749',
        lng: '-122.4194',
        name: 'Golden Gate Getaway',
        description: 'Lovely place near the Golden Gate Bridge.',
        price: 320.00,
        previewImage: "https://squatspot.s3.us-east-2.amazonaws.com/photos.unsplash/gabrielle-maurer-on_wnJU2n7g-unsplash.jpg"
      }
      
      
    ], {validate :true})
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['456 Oak Ave', '123 Main Street'] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

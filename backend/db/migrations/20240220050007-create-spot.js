'use strict';
let options ={};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Users',
          key:'id'
        },
        onDelete: "CASCADE"
      },
      address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.FLOAT,  
        allowNull:true
      },
      lng: {
        type: Sequelize.FLOAT,
        allowNull:true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      avgRating:{
        type:Sequelize.FLOAT,
        defaultValue: undefined
      },
      numReviews:{
        type:Sequelize.INTEGER,
        defaultValue: null
      },
      previewImage:{
        type:Sequelize.STRING,
        defaultValue: undefined
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.dropTable(options);
  }
};

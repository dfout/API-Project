'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {

    static hideUserScope() {
      return {
        attributes: {
          exclude: ['id','userId', 'createdAt', 'updatedAt']
        }
      };
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot,{foreignKey:'spotId'});
      //Would like to have many people added to the booking at some point
      //for a new feature. So a join table or something might be necessary.
      Booking.belongsTo(models.User,{foreignKey: 'userId'})

    }
  }
  Booking.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
    scopes:{
      hideUser: Booking.hideUserScope
    }
  });
  return Booking;
};

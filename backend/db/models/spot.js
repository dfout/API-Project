'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,{foreignKey:'ownerId'});
      Spot.hasMany(models.Review, {foreignKey:'spotId'});
      Spot.belongsToMany(models.Booking,{
        through: {
          model: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }
      });
      Spot.hasMany(models.SpotImage,{foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

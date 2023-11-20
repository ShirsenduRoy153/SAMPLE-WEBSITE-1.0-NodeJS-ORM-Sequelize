'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class u3 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  u3.init({
    addedu_id: DataTypes.STRING,
    degree: DataTypes.STRING,
    board: DataTypes.STRING,
    year: DataTypes.INTEGER,
    marks: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'u3',
  });
  return u3;
};
const {Sequelize,Model,DataTypes} = require('sequelize')
class AssetsBrrow extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'AssetsBrrow', 
                comment: "借用记录信息"
            }
        )
    }
    static associate(models){
    }
}

module.exports = AssetsBrrow
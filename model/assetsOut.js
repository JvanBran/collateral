const {Sequelize,Model,DataTypes} = require('sequelize')
class AssetsOut extends Model {
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
                modelName: 'AssetsOut', 
                comment: "出库记录信息"
            }
        )
    }
    static associate(models){
    }
}

module.exports = AssetsOut
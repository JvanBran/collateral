const {Sequelize,Model,DataTypes} = require('sequelize')
class AssetsTransferOut extends Model {
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
                modelName: 'AssetsTransferOut', 
                comment: "调拨出库记录信息"
            }
        )
    }
    static associate(models){
    }
}

module.exports = AssetsTransferOut
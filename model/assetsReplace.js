const {Sequelize,Model,DataTypes} = require('sequelize')
class AssetsReplace extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                oldAssetsId:{
                    type: DataTypes.UUID,
                    allowNull:false,
                    comment: '被置换资产id'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'AssetsReplace', 
                comment: "置换记录信息"
            }
        )
    }
    static associate(models){
    }
}

module.exports = AssetsReplace
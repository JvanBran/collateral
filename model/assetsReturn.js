const {Sequelize,Model,DataTypes} = require('sequelize')
class AssetsReturn extends Model {
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
                modelName: 'AssetsReturn', 
                comment: "归还记录信息"
            }
        )
    }
    static associate(models){
    }
}

module.exports = AssetsReturn
const {Sequelize,Model,DataTypes} = require('sequelize')
class Dictionary extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true
                },
                key:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '键'
                },
                value:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '值'
                },
                type:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '类型'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Dictionary', 
                comment: "系统信息"
            }
        )
    }
    static associate(models){
        models.Dictionary.belongsTo(models.Organizational)
    }
}

module.exports = Dictionary
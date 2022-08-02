const {Sequelize,Model,DataTypes} = require('sequelize')
class Organizational extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                dept_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '组织架构名'
                },
                parent_id:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '父亲节点编号'
                },
                order_num:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '同层排序'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Organizational', 
                comment: "组织架构"
            }
        )
    }
    static associate(models){
        models.Organizational.hasMany(models.Owner)
        models.Organizational.hasMany(models.Storage)
        models.Organizational.hasMany(models.Assets)
        models.Organizational.hasMany(models.SysConfig)
        models.Organizational.hasMany(models.Dictionary)
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsBrrow})
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsOut})
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsInt})
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsReplace})
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsReturn})
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsTransferInt})
        models.Organizational.belongsToMany(models.Assets,{through: models.AssetsTransferOut})
    }
}

module.exports = Organizational
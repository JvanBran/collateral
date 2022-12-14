const {Sequelize,Model,DataTypes} = require('sequelize')
class Owner extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                owner_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '管理员用户名'
                },
                owner_password:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '管理员密码'
                },
                owner_phone:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '管理员手机'
                },
                owner_email:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '管理员邮箱'
                },
                owner_status:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '管理员状态'
                },
                owner_ramke:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '备注'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Owner', 
                comment: "管理员用户信息"
            }
        )
    }
    static associate(models){
        models.Owner.belongsTo(models.Organizational)
        models.Owner.belongsTo(models.Role)
        models.Owner.hasMany(models.InventoryTask)
        models.Owner.hasMany(models.InventoryOrder)
        models.Owner.hasMany(models.Assets)
        models.Owner.hasMany(models.InventoryRecord)
        models.Owner.hasMany(models.AssetsBrrow)
        models.Owner.hasMany(models.AssetsOut)
        models.Owner.hasMany(models.AssetsInt)
        models.Owner.hasMany(models.AssetsReplace)
        models.Owner.hasMany(models.AssetsTransferInt)
        models.Owner.hasMany(models.AssetsTransferOut)
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsBrrow})
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsOut})
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsInt})
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsReplace})
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsReturn})
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsTransferInt})
        models.Owner.belongsToMany(models.Assets,{through: models.AssetsTransferOut})
    }
}

module.exports = Owner
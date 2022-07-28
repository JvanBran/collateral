const {Sequelize,Model,DataTypes} = require('sequelize')
class DepartmentUser extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                department_user_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '入库人名'
                },
                department_user_phone:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '入库人手机'
                },
                department_user_email:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '入库人邮箱'
                },
                department_user_ramke:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '备注'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'DepartmentUser', 
                comment: "入库人用户信息"
            }
        )
    }
    static associate(models){
        models.DepartmentUser.belongsTo(models.Department)
        models.DepartmentUser.hasMany(models.Assets)
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsBrrow})
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsOut})
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsInt})
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsReplace})
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsReturn})
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsTransferInt})
        models.DepartmentUser.belongsToMany(models.Assets,{through: models.AssetsTransferOut})
    }
}

module.exports = DepartmentUser
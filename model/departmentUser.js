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
                departmentUser_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '入库人名'
                },
                departmentUser_phone:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '管理员手机'
                },
                departmentUser_email:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '管理员邮箱'
                },
                departmentUser_ramke:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '备注'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'DepartmentUser', 
                comment: "管理员用户信息"
            }
        )
    }
    static associate(models){
        models.DepartmentUser.belongsTo(models.Department)
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
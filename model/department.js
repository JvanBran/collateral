const {Sequelize,Model,DataTypes} = require('sequelize')
class Department extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                department_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '仓库名'
                },
                department_ramke:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '仓库描述'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Department', 
                comment: "仓库信息"
            }
        )
    }
    static associate(models){
        models.Department.hasMany(models.DepartmentUser)
        models.Department.hasMany(models.Assets)
    }
}

module.exports = Department
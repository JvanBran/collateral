const {Sequelize,Model,DataTypes} = require('sequelize')
class Role extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                role_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '角色名'
                },
                role_desc:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '角色描述'
                },
                role_is:{
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                    allowNull: false,
                    comment: '是否默认'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Role', 
                comment: "角色信息"
            }
        )
    }
    static associate(models){
        models.Role.hasMany(models.Owner)
        models.Role.belongsTo(models.Organizational)
    }
}

module.exports = Role
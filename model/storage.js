const {Sequelize,Model,DataTypes} = require('sequelize')
class Storage extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                storage_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '仓库名称'
                },
                storage_rfid:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '仓库rfid'
                },
                storage_rfid_status:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    comment: '仓库rfid打印状态:0未打 1已打 2排队'
                },
                storage_ramke:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '备注'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Storage', 
                comment: "仓库信息"
            }
        )
    }
    static associate(models){
        models.Storage.belongsTo(models.Organizational)
        models.Storage.hasMany(models.Assets)
        models.Storage.hasMany(models.InventoryRecord)
    }
}

module.exports = Storage
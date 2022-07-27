const {Sequelize,Model,DataTypes} = require('sequelize')
class InventoryRecord extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                upload_time:{
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '上传时间'
                },
                inventory_position:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '盘点位置'
                },
                inventory_status:{
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '盘点状态：0，已盘；1，位置错误；2，未盘'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'InventoryRecord', 
                comment: "资产盘点记录"
            }
        )
    }
    static associate(models){
        models.InventoryRecord.belongsTo(models.InventoryTask)
        models.InventoryRecord.belongsTo(models.InventoryOrder)
        models.InventoryRecord.belongsTo(models.Assets)
        models.InventoryRecord.belongsTo(models.Storage)
        models.InventoryRecord.belongsTo(models.Owner)
    }
}

module.exports = InventoryRecord
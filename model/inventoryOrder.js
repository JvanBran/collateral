const {Sequelize,Model,DataTypes} = require('sequelize')
class InventoryOrder extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                task_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '盘点单名称'
                },
                start_time:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '开始时间'
                },
                end_time:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '结束时间'
                },
                remark:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '备注'
                },
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'InventoryOrder', 
                comment: "盘点单"
            }
        )
    }
    static associate(models){
        models.InventoryOrder.belongsTo(models.InventoryTask)
        models.InventoryOrder.belongsTo(models.Owner)
        models.InventoryOrder.hasMany(models.InventoryRecord)
    }
}

module.exports = InventoryOrder
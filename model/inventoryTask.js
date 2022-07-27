const {Sequelize,Model,DataTypes} = require('sequelize')
class InventoryTask extends Model {
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
                    comment: '盘点任务名称'
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
                status:{
                    type: DataTypes.BIGINT(1),
                    allowNull: false,
                    comment: '盘点状态：0，未结束；1，已结束'
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
                modelName: 'InventoryTask', 
                comment: "盘点任务"
            }
        )
    }
    static associate(models){
        models.InventoryTask.hasMany(models.InventoryOrder)
        models.InventoryTask.hasMany(models.InventoryRecord)
        models.InventoryTask.belongsTo(models.Owner)

    }
}

module.exports = InventoryTask
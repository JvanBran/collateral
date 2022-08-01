const {Sequelize,Model,DataTypes} = require('sequelize')
class Assets extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: DataTypes.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true
                },
                sequenceNum:{
                    type: DataTypes.INTEGER(10),
                    allowNull: false,
                    defaultValue: 0, //0是没有排序的
                    comment: '顺序编号'
                },
                rfid_code:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: 'rfid编号'
                },
                rfid_status:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '打印状态: 0未打 1已打 2排队'
                },
                affiliation:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '机构编号'
                },
                asset_num:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '资产编号'
                },
                evaluation_value:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '资产价值'
                },
                warrant_num:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '权证编号'
                },
                droi_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '所有权人名称'
                },
                contract_no:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '合同号'
                },
                borrower:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '借款人'
                },
                registrar:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '登记机关'
                },
                register_date:{
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '登记时间'
                },
                collateral_type:{
                    type: DataTypes.INTEGER(1),
                    allowNull: false,
                    comment: '抵质押物类型 0 抵押 1 质押'
                },
                
                warehousing_time:{
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '入库时间'
                },
                asstes_behaviour:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                    comment: '资产行为' //行为: 0入库 1 借用 2归还 3维修 4减少 5调拨 6领用 7移交 8置换
                },
                asstes_status:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                    comment: '资产状态' //状态: 0 在库 1出库 2调拨中 
                },
                source_of_assets:{
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                    allowNull: false,
                    comment: '资产数据来源' //状态: 0 rfid 1uecm 
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'Assets', 
                comment: "资产信息"
            }
        )
    }
    static associate(models){
        models.Assets.hasMany(models.InventoryRecord)
        models.Assets.belongsTo(models.ArticlesClass)
        models.Assets.belongsTo(models.Department)
        models.Assets.belongsTo(models.Organizational)
        models.Assets.belongsTo(models.Owner)
        models.Assets.belongsTo(models.Storage)
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsBrrow})
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsOut})
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsInt})
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsReplace})
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsReturn})
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsTransferInt})
        models.Assets.belongsToMany(models.DepartmentUser,{through: models.AssetsTransferOut})
    }
}

module.exports = Assets
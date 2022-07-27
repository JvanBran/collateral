const {Sequelize,Model,DataTypes} = require('sequelize')
class ArticlesClass extends Model {
    static init(sequelize){
        return super.init(
            {
                id:{
                    type: Sequelize.INTEGER(10),
                    autoIncrement: true,
                    allowNull:false,
                    primaryKey: true
                },
                articles_name:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '分类名'
                },
                parent_id:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '父亲节点编号'
                },
                order_num:{
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '同层排序'
                }
            },
            { 
                sequelize, 
                freezeTableName: true,
                modelName: 'ArticlesClass', 
                comment: "分类信息"
            }
        )
    }
    static associate(models){
        models.ArticlesClass.hasMany(models.Assets)
    }
}

module.exports = ArticlesClass
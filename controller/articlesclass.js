const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
const {transListToTreeData,transTreeToListData} = require('@util/totree.js');
class ArticlesClassController{
    static async List (ctx){
        const { pageNo, pageSize, articles_name} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = articles_name ? { 'articles_name' : { [Op.like]: `%${articles_name}%` } } : {}
        const info = await models.ArticlesClass.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "articles_name", 
                "parent_id", 
                "order_num",
                "created_at",
                "updated_at",
            ],
            offset,
            order: [ [ 'created_at', 'DESC' ]],//倒序
        })
        ctx.success({
            data: info.rows,
            total: info.count,
            pageNo: Number(pageNo),
            pageSize: Number(pageSize)
        })
    }
    static async ListTree (ctx){
        const arrList = await models.ArticlesClass.findAll({
            attributes: [
                "id",
                "articles_name", 
                "parent_id", 
                "order_num",
                "created_at",
                "updated_at",
            ]
        })
        let returnList = []
        let returnTree = []
        arrList.forEach(item => {
            returnList.push(item.dataValues)
        });
        transListToTreeData(returnList,returnTree,0)
        ctx.success(returnTree)
    }
    static async Add (ctx){
        const { articles_name, parent_id= 0, order_num} = ctx.request.body
        const Info = await models.ArticlesClass.create({
            articles_name, parent_id, order_num
        })
        ctx.success(Info)
    }
    static async Edit (ctx){
        const { id, articles_name, parent_id, order_num} = ctx.request.body
        const updateStatus =  await models.ArticlesClass.update({
            articles_name, parent_id, order_num
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdatedArticles =  await models.ArticlesClass.findOne({
                where:{
                    id
                },
                attributes: [
                    "id",
                    "articles_name", 
                    "parent_id", 
                    "order_num",
                    "created_at",
                    "updated_at",
                ]
            })
            ctx.success(returnUpdatedArticles)
        }else{
            ctx.fail('更新失败',9002,{})
        }
    }
    static async Delete (ctx){
        const { id } = ctx.query
        // 该节点没有被使用过
        const infoList = await models.ArticlesClass.findAndCountAll({
            where:{
                parent_id:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该节点正在被使用',9001,{})
        }else{
            await models.ArticlesClass.destroy({
                where:{
                    id
                }
            })
            ctx.success({}, '删除成功')
        }
    }
}
module.exports = ArticlesClassController

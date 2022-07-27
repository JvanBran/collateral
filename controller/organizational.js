const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
const {transListToTreeData,transTreeToListData} = require('@util/totree.js');
class OrganizationalController{
    static async List (ctx){
        const { pageNo, pageSize, dept_name} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = dept_name ? { 'dept_name' : { [Op.like]: `%${dept_name}%` } } : {}
        const info = await models.Organizational.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "dept_name", 
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
        const { id } = ctx.query
        const Filter = id ? { 'parent_id' : id  } : {}
        const arrList = await models.Organizational.findAll({
            where:Filter,
            attributes: [
                "id",
                "dept_name", 
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
        const { dept_name, parent_id= 0, order_num} = ctx.request.body
        const userInfo = await models.Organizational.create({
            dept_name, parent_id, order_num
        })
        ctx.success(userInfo)
    }
    static async Edit (ctx){
        const { id, dept_name, parent_id, order_num} = ctx.request.body
        await models.Organizational.update({
            dept_name, parent_id, order_num
        },{
            where:{
                id
            }
        })
        const returnUpdatedOrganizational =  await models.Organizational.findOne({
            where:{
                id
            },
            attributes: [
                "id",
                "dept_name", 
                "parent_id", 
                "order_num",
                "created_at",
                "updated_at",
            ]
        })
        ctx.success(returnUpdatedOrganizational)
    }
    static async Delete (ctx){
        const { id } = ctx.query
        // 该节点没有被使用过
        const infoList = await models.Organizational.findAndCountAll({
            where:{
                parent_id:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该节点正在被使用',9001,{})
        }else{
            await models.Organizational.destroy({
                where:{
                    id
                }
            })
            ctx.success({}, '删除成功')
        }
    }
}
module.exports = OrganizationalController

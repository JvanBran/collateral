const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
class RoleController{
    static async List (ctx){
        const { pageNo, pageSize, role_name} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = role_name ? { 'role_name' : { [Op.like]: `%${role_name}%` } } : {}
        const info = await models.Role.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "role_name", 
                "role_desc", 
                "role_is",
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
    static async Add (ctx){
        const { role_name, role_is = 1, role_desc} = ctx.request.body
        const Info = await models.Role.create({
            role_name, role_is, role_desc
        })
        ctx.success(Info)
    }
    static async Edit (ctx){
        const { id, role_name, role_desc} = ctx.request.body
        const updateStatus =  await models.Role.update({
            role_name, role_desc
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdated =  await models.Role.findOne({
                where:{
                    id
                },
                attributes: [   
                    "id",
                    "role_name", 
                    "role_desc", 
                    "role_is",
                    "created_at",
                    "updated_at",
                ]
            })
            ctx.success(returnUpdated)
        }else{
            ctx.fail('更新失败',9002,{})
        }
        
    }
    static async Delete (ctx){
        const { id } = ctx.query
        // 该节点没有被使用过
        const infoList = await models.Owner.findAndCountAll({
            where:{
                RoleId:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该角色正在被使用',9001,{})
        }else{
            await models.Role.destroy({
                where:{
                    id
                }
            })
            ctx.success({}, '删除成功')
        }
    }
}
module.exports = RoleController
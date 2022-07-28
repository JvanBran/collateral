const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
const { conformsTo } = require('lodash');
class DepartmentController{
    static async List (ctx){
        const { pageNo, pageSize, department_name} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = department_name ? { 'department_name' : { [Op.like]: `%${department_name}%` } } : {}
        const info = await models.Department.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "department_name", 
                "department_ramke", 
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
        const { department_name, department_ramke} = ctx.request.body
        const Info = await models.Department.create({
            department_name, department_ramke
        })
        ctx.success(Info)
    }
    static async Edit (ctx){
        const { id, department_name, department_ramke} = ctx.request.body
        const updateStatus =  await models.Department.update({
            department_name, department_ramke
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdatedRole =  await models.Department.findOne({
                where:{
                    id
                },
                attributes: [   
                    "id",
                    "department_name", 
                    "department_ramke", 
                    "created_at",
                    "updated_at",
                ]
            })
            ctx.success(returnUpdatedRole)
        }else{
            ctx.fail('更新失败',9002,{})
        }
        
    }
    static async Delete (ctx){
        const { id } = ctx.query
        // 该节点没有被使用过
        const infoList = await models.DepartmentUser.findAndCountAll({
            where:{
                DepartmentId:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该部门正在被使用',9001,{})
        }else{
            await models.Department.destroy({
                where:{
                    id
                }
            })
            ctx.success({}, '删除成功')
        }
    }
}
module.exports = DepartmentController
const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
class DepartmentUserController{
    static async List (ctx){
        const { pageNo, pageSize, department_user_name,department_id} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                department_user_name ? { department_user_name: { [Op.like]: `%${department_user_name}%` } } : {},
                department_id ? { DepartmentId: { [Op.like]: `%${department_id}%` } } : {},
            ]
        }
        const info = await models.DepartmentUser.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "department_user_name",
                "department_user_phone",
                "department_user_email",
                "department_user_ramke",
                "department_id",
                [Sequelize.col('Department.department_name'), 'department_name'],
                [Sequelize.col('Department.department_ramke'), 'department_ramke'],
                "created_at",
                "updated_at",
            ],
            include:[{
                attributes: [],
                model:models.Department,
                require: false,
            }],
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
        const { department_user_name, department_user_phone,department_user_email,department_user_ramke,department_id } = ctx.request.body
        const Info = await models.DepartmentUser.create({
            department_user_name, 
            department_user_phone,
            department_user_email,
            department_user_ramke,
            DepartmentId:department_id
        })
        ctx.success(Info)
    }
    static async Edit (ctx){
        const { id, department_user_name, department_user_phone,department_user_email,department_user_ramke,department_id} = ctx.request.body
        const updateStatus =  await models.DepartmentUser.update({
            department_user_name, department_user_phone,department_user_email,department_user_ramke,DepartmentId:department_id
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdated =  await models.DepartmentUser.findOne({
                where:{
                    id
                },
                attributes: [   
                    "id",
                    "department_user_name",
                    "department_user_phone",
                    "department_user_email",
                    "department_user_ramke",
                    "department_id",
                    [Sequelize.col('Department.department_name'), 'department_name'],
                    [Sequelize.col('Department.department_ramke'), 'department_ramke'],
                    "created_at",
                    "updated_at",
                ],
                include:[{
                    attributes: [],
                    model:models.Department,
                    require: false,
                }],
            })
            ctx.success(returnUpdated)
        }else{
            ctx.fail('更新失败',9002,{})
        }
        
    }
    static async Delete (ctx){
        const { id } = ctx.query
        const infoList = await models.Assets.findAndCountAll({
            where:{
                department_user_id:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该入库人正在被使用',9001,{})
        }else{
            const info = await models.DepartmentUser.destroy({
                where:{
                    id
                }
            })
            if(info[0]>0){
                ctx.success({}, '删除成功')
            }else{
                ctx.fail('入库人删除失败',9002,{})
            }
            
        }
    }
}
module.exports = DepartmentUserController
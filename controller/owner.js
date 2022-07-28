const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
class DepartmentUserController{
    static async List (ctx){
        const { pageNo, pageSize, owner_name,owner_phone,owner_email,organizational_id,role_id} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                owner_name ? { owner_name: { [Op.like]: `%${owner_name}%` } } : {},
                owner_phone ? { owner_phone: { [Op.like]: `%${owner_phone}%` } } : {},
                owner_email ? { owner_email: { [Op.like]: `%${owner_email}%` } } : {},
                organizational_id ? { OrganizationalId: { [Op.like]: `%${organizational_id}%` } } : {},
                role_id ? { RoleId: { [Op.like]: `%${role_id}%` } } : {},
            ]
        }
        const info = await models.Owner.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "owner_name",
                "owner_phone",
                "owner_email",
                "owner_status",
                "owner_ramke",
                "organizational_id",
                "role_id",
                [Sequelize.col('Organizational.dept_name'), 'dept_name'],
                [Sequelize.col('Organizational.parent_id'), 'parent_id'],
                [Sequelize.col('Role.role_name'), 'role_name'],
                [Sequelize.col('Role.role_desc'), 'role_desc'],
                "created_at",
                "updated_at",
            ],
            include:[{
                attributes: [],
                model:models.Organizational,
                require: false,
            },{
                attributes: [],
                model:models.Role,
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
        const { owner_name, owner_password,owner_phone,owner_email,owner_status,owner_ramke,organizational_id,role_id } = ctx.request.body
        const Info = await models.Owner.create({
            owner_name, 
            owner_password,
            owner_phone,
            owner_email,
            owner_status,
            owner_ramke,
            OrganizationalId:organizational_id,
            RoleId:role_id
        })
        ctx.success(Info)
    }
    static async Edit (ctx){
        const { id, department_user_name, department_ramke} = ctx.request.body
        const updateStatus =  await models.DepartmentUser.update({
            department_user_name, department_ramke
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdatedRole =  await models.DepartmentUser.findOne({
                where:{
                    id
                },
                attributes: [   
                    "id",
                    "department_user_name", 
                    "department_user_phone", 
                    "department_user_email",
                    "department_user_ramke",
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
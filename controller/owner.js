const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
class OwnerController{
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
        const { id, owner_name, owner_password, owner_password_old,owner_phone,owner_email,owner_status,owner_ramke,organizational_id,role_id} = ctx.request.body
        // TODO 如果修改密码 则需要校验密码
        if(owner_password_old){
            const Info =  await models.Owner.findOne({
                where:{
                    id
                }
            })
            const updateStatus =  await models.Owner.update({
                owner_name, owner_password,owner_phone,owner_email,owner_status,owner_ramke,OrganizationalId:organizational_id,RoleId:role_id
            },{
                where:{
                    id
                }
            })
            if(updateStatus[0]>0){
                const returnUpdated =  await models.Owner.findOne({
                    where:{
                        id
                    },
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
                    ],include:[{
                        attributes: [],
                        model:models.Organizational,
                        require: false,
                    },{
                        attributes: [],
                        model:models.Role,
                        require: false,
                    }],
                })
                ctx.success(returnUpdated)
            }else{
                ctx.fail('更新失败',9002,{})
            }
        }else{
            const updateStatus =  await models.Owner.update({
                owner_name,owner_phone,owner_email,owner_status,owner_ramke,OrganizationalId:organizational_id,RoleId:role_id
            },{
                where:{
                    id
                }
            })
            if(updateStatus[0]>0){
                const returnUpdated =  await models.Owner.findOne({
                    where:{
                        id
                    },
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
                    ],include:[{
                        attributes: [],
                        model:models.Organizational,
                        require: false,
                    },{
                        attributes: [],
                        model:models.Role,
                        require: false,
                    }],
                })
                ctx.success(returnUpdated)
            }else{
                ctx.fail('更新失败',9002,{})
            }
        }
    }
    static async Delete (ctx){
        const { id } = ctx.query
        const info = await models.Owner.destroy({
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
module.exports = OwnerController
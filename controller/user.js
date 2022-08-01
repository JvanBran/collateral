const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
const jwt = require('jsonwebtoken');
class UserController{
    static async Login (ctx){
        const { username, passowrd} = ctx.request.body
        const info =  await models.Owner.findOne({
            where:{
                owner_name:username, owner_password:passowrd
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
        })
        if(info == null){
            ctx.fail('用户密码错误',10002,{})
        }else{
            console.log(info)
            const token = jwt.sign(
                {
                    id: info.dataValues.id,
                    owner_status:info.dataValues.owner_status,
                    role_name:info.dataValues.role_name,
                    role_id:info.dataValues.role_id,
                    organizational_id:info.dataValues.organizational_id,
                    dept_name:info.dataValues.dept_name,
                    parent_id:info.dataValues.parent_id
                }, 
                'collateral',
                { expiresIn: "7d" }
            )
            console.log(token)
            ctx.success({info,token:token})
        }
        
    }
}
module.exports = UserController
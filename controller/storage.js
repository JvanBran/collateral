const {Sequelize,Op} = require('sequelize');
const {models} = require('@model/index.js');
class StorageController{
    static async List (ctx){
        const { pageNo, pageSize, storage_name,storage_rfid,storage_rfid_status,organizational_id} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                storage_name ? { storage_name: { [Op.like]: `%${storage_name}%` } } : {},
                storage_rfid ? { storage_rfid: { [Op.like]: `%${storage_rfid}%` } } : {},
                storage_rfid_status ? { storage_rfid_status: { [Op.like]: `%${storage_rfid_status}%` } } : {},
                organizational_id ? { OrganizationalId: { [Op.like]: `%${organizational_id}%` } } : {}
            ]
        }
        const info = await models.Storage.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "storage_name",
                "storage_rfid",
                "storage_rfid_status",
                "storage_ramke",
                "organizational_id",
                [Sequelize.col('Organizational.dept_name'), 'dept_name'],
                [Sequelize.col('Organizational.parent_id'), 'parent_id'],
                "created_at",
                "updated_at",
            ],
            include:[{
                attributes: [],
                model:models.Organizational,
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
        const { storage_name,storage_rfid,storage_rfid_status,storage_ramke,organizational_id } = ctx.request.body
        const Info = await models.Storage.create({
            storage_name, 
            storage_rfid,
            storage_rfid_status,
            storage_ramke,
            OrganizationalId:organizational_id,
        })
        ctx.success(Info)
    }
    static async Edit (ctx){
        const { id, storage_name,storage_rfid,storage_rfid_status,storage_ramke,organizational_id} = ctx.request.body

        const updateStatus =  await models.Storage.update({
            storage_name,storage_rfid,storage_rfid_status,storage_ramke,OrganizationalId:organizational_id
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdated =  await models.Storage.findOne({
                where:{
                    id
                },
                attributes: [   
                    "id",
                    "storage_name",
                    "storage_rfid",
                    "storage_rfid_status",
                    "storage_ramke",
                    "organizational_id",
                    [Sequelize.col('Organizational.dept_name'), 'dept_name'],
                    [Sequelize.col('Organizational.parent_id'), 'parent_id'],
                    "created_at",
                    "updated_at",
                ],include:[{
                    attributes: [],
                    model:models.Organizational,
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
        // 该节点没有被使用过
        const infoList = await models.Assets.findAndCountAll({
            where:{
                StorageId:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该角色正在被使用',9001,{})
        }else{
            await models.Storage.destroy({
                where:{
                    id
                }
            })
            ctx.success({}, '删除成功')
        } 
    }
}
module.exports = StorageController
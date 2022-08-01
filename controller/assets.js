const {Op} = require('sequelize');
const {models,transaction} = require('@model/index.js');
const {transListToTreeData,transTreeToListData,getRfidCode} = require('@util/util.js');
const RedisStore = require('@plugins/redis.js')
const redisStore = new RedisStore()
class AssetsController{
    static async List (ctx){
        const { pageNo, pageSize, articles_name} = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = articles_name ? { 'articles_name' : { [Op.like]: `%${articles_name}%` } } : {}
        const info = await models.Assets.findAndCountAll({
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
        const arrList = await models.Assets.findAll({
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
        const { 
            affiliation, 
            asset_num, 
            order_num, 
            evaluation_value,
            warrant_num, 
            droi_name, 
            register_date, 
            warehousing_time, 
            departmentId, 
            departmentUserId,
            collateral_type,
            registrar,
            contract_no,
            borrower,
            articlesClassId,
            storageId,
            rfid_status=0,
            asstes_behaviour=0,
            asstes_status=0,
            source_of_assets=0,
            organizationalId=ctx.userInfo.organizational_id,
            roleId=ctx.userInfo.role_id
        } = ctx.request.body
        // const Info = await models.Assets.create({
        //     rfid_code:getRfidCode(),
        //     rfid_status,
        //     asstes_behaviour,
        //     asstes_status,
        //     affiliation, 
        //     asset_num, 
        //     order_num, 
        //     evaluation_value,
        //     warrant_num, 
        //     droi_name, 
        //     register_date, 
        //     warehousing_time, 
        //     departmentId, 
        //     departmentUserId,
        //     collateral_type,
        //     registrar,
        //     contract_no,
        //     source_of_assets,
        //     borrower,
        //     articlesClassId,
        //     storageId,
        //     organizationalId,
        //     roleId
        // })
        /**
         * 创建成功之后更新顺序值
        */
        // 根据组织架构id+仓库id+库区id 创建锁key
        //const lock = await redisStore.redlock.acquire(['sequenceNum:lock:'+organizationalId+':'+departmentId+':'+storageId],5000)
        // 根据组织架构id+仓库id+库区id 创建自增顺序id
        const sequenceNum = await redisStore.redis.get('sequenceNum:lock:num:'+organizationalId+':'+departmentId+':'+storageId) || 0
        // const result = await transaction(async (t) => {
        //     const Info = await models.Assets.create({
        //         rfid_code:getRfidCode(),
        //         rfid_status,
        //         asstes_behaviour,
        //         asstes_status,
        //         affiliation, 
        //         asset_num, 
        //         order_num, 
        //         evaluation_value,
        //         warrant_num, 
        //         droi_name, 
        //         register_date, 
        //         warehousing_time, 
        //         departmentId, 
        //         departmentUserId,
        //         collateral_type,
        //         registrar,
        //         contract_no,
        //         source_of_assets,
        //         borrower,
        //         articlesClassId,
        //         storageId,
        //         organizationalId,
        //         roleId
        //     }, { transaction: t })
        //     return [Info];
        // })
        // console.log(result)
        // transaction(function(t){
        //     return transaction( function(t) {
        //         return models.Assets.create({
        //             rfid_code:getRfidCode(),
        //             rfid_status,
        //             asstes_behaviour,
        //             asstes_status,
        //             affiliation, 
        //             asset_num, 
        //             order_num, 
        //             evaluation_value,
        //             warrant_num, 
        //             droi_name, 
        //             register_date, 
        //             warehousing_time, 
        //             departmentId, 
        //             departmentUserId,
        //             collateral_type,
        //             registrar,
        //             contract_no,
        //             source_of_assets,
        //             borrower,
        //             articlesClassId,
        //             storageId,
        //             organizationalId,
        //             roleId
        //         }, {transaction: t}).then(function (Info) {
        //             return models.Assets.update({
        //                 sequence_num: parseInt(sequenceNum)+1
        //             },{
        //                 where:{
        //                     id:Info.dataValues.id
        //                 }
        //             },{transaction: t})
        //         })
        //     }).then(function (result) {
        //         ctx.success(result)
        //     }).catch(function (err) {
        //         console.log(err)
        //     })
        // })
        
        
        // 根据已有的顺序id尝试做更新
        // if(updateInfo[0]>0){
        //     //如果更新成功则触发rdies自增 增加记录
        //     await redisStore.redis.incr('sequenceNum:lock:num:'+organizationalId+':'+departmentId+':'+storageId)
        //     //释放锁
        //     lock.release();
        //     const findInfo = await models.Assets.findOne({
        //         where:{
        //             id:Info.dataValues.id
        //         }
        //     })
        //     ctx.success(findInfo)
        // }else{
        //     ctx.fail('创建失败',9002,{})
        // }
        // let t = transaction()
        const asd = await transaction({},{})
        ctx.success(asd)
    }
    static async Edit (ctx){
        const { id, articles_name, parent_id, order_num} = ctx.request.body
        const updateStatus =  await models.Assets.update({
            articles_name, parent_id, order_num
        },{
            where:{
                id
            }
        })
        if(updateStatus[0]>0){
            const returnUpdatedArticles =  await models.Assets.findOne({
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
        const infoList = await models.Assets.findAndCountAll({
            where:{
                parent_id:id
            }
        })
        if(infoList.count>0){
            ctx.fail('该节点正在被使用',9001,{})
        }else{
            await models.Assets.destroy({
                where:{
                    id
                }
            })
            ctx.success({}, '删除成功')
        }
    }
}
module.exports = AssetsController

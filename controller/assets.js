const {Sequelize,Op} = require('sequelize');
const {models,transaction} = require('@model/index.js');
const {getRfidCodeA} = require('@util/util.js');
const RedisStore = require('@plugins/redis.js')
const redisStore = new RedisStore()
class AssetsController{
    static async List (ctx){
        const { pageNo, pageSize, 
            affiliation, 
            asset_num, 
            evaluation_value,
            warrant_num, 
            droi_name, 
            register_date, 
            warehousing_time, 
            DepartmentId, 
            DepartmentUserId,
            collateral_type,
            registrar,
            contract_no,
            borrower,
            ArticlesClassId,
            StorageId,
            rfid_status,
            asstes_behaviour,
            asstes_status,
            source_of_assets,
            OrganizationalId=ctx.userInfo.organizational_id
        } = ctx.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                affiliation ? { affiliation: { [Op.like]: `%${affiliation}%` } } : {},
                asset_num ? { asset_num: { [Op.like]: `%${asset_num}%` } } : {},
                evaluation_value ? { evaluation_value: { [Op.like]: `%${evaluation_value}%` } } : {},
                warrant_num ? { warrant_num: { [Op.like]: `%${warrant_num}%` } } : {},
                register_date ? { register_date: { [Op.like]: `%${register_date}%` } } : {},
                warehousing_time ? { warehousing_time: { [Op.like]: `%${warehousing_time}%` } } : {},
                droi_name ? { droi_name: { [Op.like]: `%${droi_name}%` } } : {},
                DepartmentId ? { DepartmentId: { [Op.like]: `%${DepartmentId}%` } } : {},
                DepartmentUserId ? { DepartmentUserId: { [Op.like]: `%${DepartmentUserId}%` } } : {},
                collateral_type ? { collateral_type: { [Op.like]: `%${collateral_type}%` } } : {},
                registrar ? { registrar: { [Op.like]: `%${registrar}%` } } : {},
                contract_no ? { contract_no: { [Op.like]: `%${contract_no}%` } } : {},
                borrower ? { borrower: { [Op.like]: `%${borrower}%` } } : {},
                ArticlesClassId ? { ArticlesClassId: { [Op.like]: `%${ArticlesClassId}%` } } : {},
                StorageId ? { StorageId: { [Op.like]: `%${StorageId}%` } } : {},
                rfid_status ? { rfid_status: { [Op.like]: `%${rfid_status}%` } } : {},
                asstes_behaviour ? { asstes_behaviour: { [Op.like]: `%${asstes_behaviour}%` } } : {},
                asstes_status ? { asstes_status: { [Op.like]: `%${asstes_status}%` } } : {},
                source_of_assets ? { source_of_assets: { [Op.like]: `%${source_of_assets}%` } } : {},
                OrganizationalId ? { OrganizationalId: { [Op.like]: `%${OrganizationalId}%` } } : {},
            ]
        }
        const info = await models.Assets.findAndCountAll({
            where:Filter,
            limit: Number(pageSize),
            attributes: [
                "id",
                "affiliation",
                "asset_num",
                "evaluation_value",
                "warrant_num", 
                "droi_name", 
                "register_date", 
                "warehousing_time", 
                "DepartmentId", 
                "DepartmentUserId",
                "collateral_type",
                "registrar",
                "contract_no",
                "borrower",
                "ArticlesClassId",
                "StorageId",
                "rfid_status",
                "asstes_behaviour",
                "asstes_status",
                "source_of_assets",
                "OrganizationalId",
                [Sequelize.col('Organizational.dept_name'), 'dept_name'],
                [Sequelize.col('Organizational.parent_id'), 'parent_id'],
                [Sequelize.col('Storage.storage_name'), 'storage_name'],
                [Sequelize.col('Storage.storage_rfid'), 'storage_rfid'],
                [Sequelize.col('Department.department_name'), 'department_name'],
                [Sequelize.col('Department.department_ramke'), 'department_ramke'],
                [Sequelize.col('DepartmentUser.department_user_name'), 'department_user_name'],
                [Sequelize.col('DepartmentUser.department_user_phone'), 'department_user_phone'],
                [Sequelize.col('DepartmentUser.department_user_email'), 'department_user_email'],
                [Sequelize.col('ArticlesClass.articles_name'), 'articles_name'],
                [Sequelize.col('ArticlesClass.parent_id'), 'articles_parent_id'],
                [Sequelize.col('Owner.owner_name'), 'owner_name'],
                [Sequelize.col('Owner.owner_phone'), 'owner_phone'],
                "created_at",
                "updated_at",
            ],
            include:[{
                attributes: [],
                model:models.Organizational,
                require: false,
            },{
                attributes: [],
                model:models.Storage,
                require: false,
            },{
                attributes: [],
                model:models.Department,
                require: false,
            },{
                attributes: [],
                model:models.DepartmentUser,
                require: false,
            },{
                attributes: [],
                model:models.ArticlesClass,
                require: false,
            },{
                attributes: [],
                model:models.Owner,
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
        const { 
            affiliation, 
            asset_num, 
            order_num, 
            evaluation_value,
            warrant_num, 
            droi_name, 
            register_date, 
            warehousing_time, 
            DepartmentId, 
            DepartmentUserId,
            collateral_type,
            registrar,
            contract_no,
            borrower,
            ArticlesClassId,
            StorageId,
            rfid_status=0,
            asstes_behaviour=0,
            asstes_status=0,
            source_of_assets=0,
            OwnerId=ctx.userInfo.id,
            OrganizationalId=ctx.userInfo.organizational_id,
            RoleId=ctx.userInfo.role_id
        } = ctx.request.body
        // 根据组织架构id+仓库id+库区id 创建锁key
        const lock = await redisStore.redlock.acquire(['sequenceNum:lock:'+OrganizationalId+':'+DepartmentId+':'+StorageId],5000)
        // 根据组织架构id+仓库id+库区id 创建自增顺序id
        const sequenceNum = await redisStore.redis.get('sequenceNum:lock:num:'+OrganizationalId+':'+DepartmentId+':'+StorageId) || 0
        // 创建并生成记录
        const Info = await transaction(async(t)=>{
                let Info = await models.Assets.create({
                    rfid_code:getRfidCodeA(),
                    rfid_status,
                    asstes_behaviour,
                    asstes_status,
                    affiliation, 
                    asset_num, 
                    order_num, 
                    evaluation_value,
                    warrant_num, 
                    droi_name, 
                    register_date, 
                    warehousing_time, 
                    DepartmentId, 
                    DepartmentUserId,
                    collateral_type,
                    registrar,
                    contract_no,
                    source_of_assets,
                    borrower,
                    ArticlesClassId,
                    StorageId,
                    OwnerId,
                    OrganizationalId,
                    RoleId
                },{transaction: t})
                await models.AssetsInt.create({
                        AssetId: Info.dataValues.id,
                        DepartmentUserId: Info.dataValues.DepartmentUserId,
                        OwnerId:Info.dataValues.OwnerId,
                        OrganizationalId:Info.dataValues.OrganizationalId
                },{transaction: t})
                return Info
        })
        let updateInfo = await models.Assets.update({
            sequence_num: parseInt(sequenceNum)+1
        },{
            where:{
                id:Info.dataValues.id
            }
        })
        if(updateInfo[0]>0){
            //如果更新成功则触发rdies自增 增加记录
            await redisStore.redis.incr('sequenceNum:lock:num:'+OrganizationalId+':'+DepartmentId+':'+StorageId)
            //释放锁
            lock.release();
            const findInfo = await models.Assets.findOne({
                where:{
                    id:Info.dataValues.id
                },
                attributes: [
                    "id",
                    "affiliation",
                    "asset_num",
                    "evaluation_value",
                    "warrant_num", 
                    "droi_name", 
                    "register_date", 
                    "warehousing_time", 
                    "DepartmentId", 
                    "DepartmentUserId",
                    "collateral_type",
                    "registrar",
                    "contract_no",
                    "borrower",
                    "ArticlesClassId",
                    "StorageId",
                    "rfid_status",
                    "asstes_behaviour",
                    "asstes_status",
                    "source_of_assets",
                    "OrganizationalId",
                    [Sequelize.col('Organizational.dept_name'), 'dept_name'],
                    [Sequelize.col('Organizational.parent_id'), 'parent_id'],
                    [Sequelize.col('Storage.storage_name'), 'storage_name'],
                    [Sequelize.col('Storage.storage_rfid'), 'storage_rfid'],
                    [Sequelize.col('Department.department_name'), 'department_name'],
                    [Sequelize.col('Department.department_ramke'), 'department_ramke'],
                    [Sequelize.col('DepartmentUser.department_user_name'), 'department_user_name'],
                    [Sequelize.col('DepartmentUser.department_user_phone'), 'department_user_phone'],
                    [Sequelize.col('DepartmentUser.department_user_email'), 'department_user_email'],
                    [Sequelize.col('ArticlesClass.articles_name'), 'articles_name'],
                    [Sequelize.col('ArticlesClass.parent_id'), 'articles_parent_id'],
                    [Sequelize.col('Owner.owner_name'), 'owner_name'],
                    [Sequelize.col('Owner.owner_phone'), 'owner_phone'],
                    "created_at",
                    "updated_at",
                ],
                include:[{
                    attributes: [],
                    model:models.Organizational,
                    require: false,
                },{
                    attributes: [],
                    model:models.Storage,
                    require: false,
                },{
                    attributes: [],
                    model:models.Department,
                    require: false,
                },{
                    attributes: [],
                    model:models.DepartmentUser,
                    require: false,
                },{
                    attributes: [],
                    model:models.ArticlesClass,
                    require: false,
                },{
                    attributes: [],
                    model:models.Owner,
                    require: false,
                }]
            })
            ctx.success(findInfo)
        }else{
            //释放锁
            lock.release();
            ctx.fail('更新顺序编号失败',9002,{})
        }
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

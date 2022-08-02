var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/assets.js');
router
  .get('/list',datalize.query([
    field('pageNo').required(), //页码
    field('pageSize').required(), //分页数
    field('affiliation'), //机构编号
    field('asset_num'), //资产编号
    field('evaluation_value'), //资产价值
    field('warrant_num'), //权证编号
    field('collateral_type'), //抵质押物类型 0 抵押 1 质押
    field('droi_name'), //所有权人名称
    field('contract_no'), //合同号
    field('borrower'), //借款人
    field('registrar'), //登记机关
    field('register_date'), //登记时间
    field('warehousing_time'), //入库时间
    field('ArticlesClassId'), //类型id
    field('DepartmentId'), //部门id
    field('StorageId'), //库区id
    field('asstes_behaviour'), //
    field('asstes_status'),//
    field('source_of_assets'), //
    field('rfid_status'), //打印状态
    field('OrganizationalId')//组织架构
  ]),List)
  .post('/add', datalize([
    field('affiliation').required(), //机构编号
    field('asset_num').required(), //资产编号
    field('evaluation_value').required(), //资产价值
    field('warrant_num').required(), //权证编号
    field('collateral_type').required(), //抵质押物类型 0 抵押 1 质押
    field('droi_name').required(), //所有权人名称
    field('contract_no').required(), //合同号
    field('borrower').required(), //借款人
    field('registrar').required(), //登记机关
    field('register_date').required(), //登记时间
    field('warehousing_time').required(), //入库时间
    field('ArticlesClassId').required(), //类型id
    field('DepartmentId').required(), //部门id
    field('StorageId').required(), //库区id
    field('DepartmentUserId').required()//入库人id
  ]), Add)
module.exports = router
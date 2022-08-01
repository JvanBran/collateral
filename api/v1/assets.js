var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, ListTree, Add, Edit, Delete } = require('@controller/assets.js')
router
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
    field('articlesClassId').required(), //类型id
    field('departmentId').required(), //部门id
    field('storageId').required(), //库区id
    field('departmentUserId').required()//入库人id
  ]), Add)
module.exports = router
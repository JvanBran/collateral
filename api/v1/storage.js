var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/storage.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('storage_name'),  //仓库名称
        field('storage_rfid'),  //仓库rfid
        field('storage_rfid_status'), //仓库rfid打印状态:0未打 1已打 2排队
        field('organizational_id'), //组织架构id
        field('role_id') //角色id
    ]),List)
    .post('/add', datalize([
        field('storage_name').required(), //仓库名称
        field('storage_rfid').required(), //仓库rfid
        field('storage_rfid_status').required(), //仓库rfid打印状态:0未打 1已打 2排队
        field('storage_ramke'), //备注
        field('organizational_id').required(), //组织架构id
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //部门id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //部门id
    ]), Delete)
module.exports = router
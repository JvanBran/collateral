var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/departmentuser.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('department_user_name'), //入库人名
        field('department_id') //部门id
    ]),List)
    .post('/add', datalize([
        field('department_user_name').required(), //入库人名
        field('department_user_phone').required(), //入库人手机
        field('department_user_email').required(), //入库人邮箱
        field('department_user_ramke').required(), //备注
        field('department_id').required(), //部门id
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //部门id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //部门id
    ]), Delete)
module.exports = router
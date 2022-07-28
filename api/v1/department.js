var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/department.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('department_name') //部门名
    ]),List)
    .post('/add', datalize([
        field('department_name').required(), //部门名
        field('department_ramke').required() //部门描述
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //部门id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //部门id
    ]), Delete)
module.exports = router
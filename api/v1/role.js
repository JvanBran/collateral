var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/role.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('role_name') //角色名称
    ]),List)
    .post('/add', datalize([
        field('role_name').required(), //角色名称
        field('role_desc').required(), //角色描述
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //组织架构id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //组织架构id
    ]), Delete)
module.exports = router
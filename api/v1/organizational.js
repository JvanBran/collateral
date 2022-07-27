var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, ListTree, Add, Edit, Delete } = require('@controller/organizational.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('dept_name') //架构名称
    ]),List)
    .get('/listtree',datalize.query([
        field('id') //组织架构id
    ]),ListTree)
    .post('/add', datalize([
        field('dept_name').required(), //组织架构名
        field('parent_id').required(), //父级架构id
        field('order_num').required(), //同层排序
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //组织架构id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //组织架构id
    ]), Delete)
module.exports = router
var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/sysconfig.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('type'), //分类
        field('organizational_id') //组织架构
    ]),List)
    .post('/add', datalize([
        field('type').required(), //分类名
        field('key').required(), //key
        field('value').required(), //value
        field('organizational_id') //组织架构
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //分类id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //分类id
    ]), Delete)
module.exports = router
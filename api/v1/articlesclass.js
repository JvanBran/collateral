var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, ListTree, Add, Edit, Delete } = require('@controller/articlesclass.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('articles_name') //分类名称
    ]),List)
    .get('/listtree',datalize.query([]),ListTree)
    .post('/add', datalize([
        field('articles_name').required(), //分类名
        field('parent_id').required(), //父级分类id
        field('order_num').required(), //同层排序
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //分类id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //分类id
    ]), Delete)
module.exports = router
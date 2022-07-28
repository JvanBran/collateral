var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { List, Add, Edit, Delete } = require('@controller/owner.js')
router
    .get('/list',datalize.query([
        field('pageNo').required(), //页码
        field('pageSize').required(), //分页数
        field('owner_name'),  //管理员用户名
        field('owner_phone'),  //管理员手机
        field('owner_email'), //管理员邮箱
        field('organizational_id'), //组织架构id
        field('role_id') //角色id
    ]),List)
    .post('/add', datalize([
        field('owner_name').required(), //管理员用户名
        field('owner_password').required(), //管理员密码
        field('owner_phone').required(), //管理员手机
        field('owner_email'), //管理员邮箱
        field('owner_status').required(), //管理员状态
        field('owner_ramke'), //备注
        field('organizational_id').required(), //组织架构id
        field('role_id').required(), //角色id
    ]), Add)
    .put('/edit', datalize([
        field('id').required(), //部门id
    ]), Edit)
    .del('/del', datalize.query([
        field('id').required(), //部门id
    ]), Delete)
module.exports = router
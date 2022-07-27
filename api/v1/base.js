var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
router
  .post('/ldap', datalize([
    field('name').required(), //用户名
    field('password').required(), //密码
  ]), ()=>{

  })
module.exports = router
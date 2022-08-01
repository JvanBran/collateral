var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { Login } = require('@controller/user.js')
router
  .post('/login', datalize([
    field('username').required(),
    field('passowrd').required()
  ]), Login)
module.exports = router
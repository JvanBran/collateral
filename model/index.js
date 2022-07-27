const sequelize = require('./sequelize.js')
const fs = require('fse')
const path = require('path')
const files = fs
    .readdirSync(__dirname)
    .filter((f)=> !['sequelize.js','index.js'].includes(f) && f.endsWith('.js')
    )
for(const item of files){
    require(path.join(__dirname,item)).init(sequelize)
}
Object.values(sequelize.models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(sequelize.models));

sequelize.sync({ force: true})
// sequelize.sync({ alter: true})
module.exports = sequelize
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('collateral','root','123.com',{
    host: '172.18.5.171',
    port: '3306',
    dialect:'mysql',
    logging: log,
    dialectOptions: {
        charset: "utf8",
        bigNumberStrings: true,
        connectTimeout: 20000,
        dateStrings: true,
        typeCast: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci', 
        createdAt:'created_at',
        updatedAt:'updated_at',
        deletedAt:'deleted_at',
        underscored: true
    },
    timezone: '+08:00' //东八时区
});
function log(sql,detail){
    console.log(sql);
}
module.exports = sequelize
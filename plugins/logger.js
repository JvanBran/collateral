import log4js from "log4js";
log4js.configure({
    appenders: {
        mysql: { type: "file" ,filename:'logs/mysql.log'},
        system: { type: "file" ,filename:'logs/app.log'},
        console: { type: "console" }
    },
    categories: { 
        default: { appenders: ['console'], level: "info" }, 
        mysql: { appenders: ["mysql"], level: "info" }, 
        system: { appenders: ["system",'console'], level: "info" }, 
    }
});
export default log4js
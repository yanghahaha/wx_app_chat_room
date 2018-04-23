const squelize = require('sequelize')
const {MYSQL_CONFIG} = require('../config')
module.exports = new squelize(
    MYSQL_CONFIG.NAME,
    MYSQL_CONFIG.USER,
    MYSQL_CONFIG.PWD,
    {
        host: MYSQL_CONFIG.HOST,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
)
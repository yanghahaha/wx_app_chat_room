const { INTEGER, STRING} = require('sequelize')
const mysqlClient = require('../utils/mysqlClient')
const User = mysqlClient.define('user',{
    user_id: {type:INTEGER, primaryKey: true, autoIncrement: true},
    open_id: {type:STRING, allowNull: false},
    push_url: {type:STRING},
    rtmp_play_url: {type:STRING}
}, {comment:'用户表', freezeTableName: true, indexes: [{unique: false, fields:['open_id']}]})
module.exports = User
User.sync()
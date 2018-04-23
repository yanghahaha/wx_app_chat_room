const mysqlClient = require("../utils/mysqlClient")
const {INTEGER, STRING} = require('sequelize')
const testTable = mysqlClient.define('test_table',{
    id: {type:INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
    name: {type:STRING, allowNull: true},
    age: {type:INTEGER, allowNull: true}
})
function testInsert(){
    for(let i=0;i<10;i++) {
        const data = {name:'test' + i, age: 10+i}
        const model = new testTable(data)
        model.save().then(()=>{console.log('success:', i)})
    }
}
function testFind() {
    testTable.findOne({where:{id: 3}}).then((data)=>{console.log(data.toJSON())})
}
// testFind()
const WebSocket = require('ws')
var bodyParser = require('body-parser')
const wss = new WebSocket.Server({port: 3001})
const messageTypes = ['login', 'message']
//握手完成 ws是WebSocket的一个实例
wss.on('connection', function connection(ws, req) {
    console.log(ws);
    console.log(req)
    //const location = url.parse(ws.upgradeReq.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  //发生错误
    ws.on('error', function incoming(message) {
      console.log('error: %s', message);
    });
  
  //断开连接
    ws.on('close', function incoming(message) {
      console.log('close: %s', message);
    });
  
  //收到消息
    ws.on('message', function incoming(message) {
        if(typeof message !== 'string') {
            singleSend(ws, {code: -1, message: '消息格式错误'})
            return
        }
        message = JSON.parse(message)
        console.log('received: ', message)
        if(!validateMessage(message)) {
            singleSend(ws, {code: -1, message: '消息格式错误'})
            return
        }
        if(message.type == 'login') {
            ws.userInfo = message.userInfo
            ws.logined = true
            singleSend(ws, {code: 1000, message: 'login success'})
            broadCast({code:2000, user:message.userInfo.userName})
            broadCast({code:2001, userList: getAllUserInfo()})
            return
        } else if(!ws.logined) {
            singleSend(ws, {code: -1, message: '请先登录'})
            return
        }
        if(message.type == 'message') {
            broadCast({code:3000, body:message.body, userName:ws.userInfo.userName})
        }
    });
})
function singleSend(ws, message) {
    ws.send(JSON.stringify(message))
}
function broadCast(message) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client.logined) {
            client.send(JSON.stringify(message))
        }
    })
}
function validateMessage(message) {
    if(typeof message !== 'object') return false
    if(!message.type) return false
    if(!messageTypes.includes(message.type)) return false
    return true
}
function getAllUserInfo() {
    const userArr = []
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client.logined) {
            userArr.push({userName:client.userInfo.userName, playUrl:client.userInfo.playUrl})
        }
    })
    return userArr
}
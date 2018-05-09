var express = require('express');
const co = require('co')
const axios = require("axios")
const config = require('../config')
const User = require('../model/User')
// const Buffer = require('buffer')

var router = express.Router();

router.get('/info', function(req, res, next) {
  const oid = req.query.oid
  if(!oid) {
    return res.json({code: 0, message: 'need param: oid'})
  }
  co(function*(){
    const open_key = Buffer.from(oid,'utf8').toString("base64");
    let user = yield User.findOne({where:{open_id:open_key}})
    if(!user){
      [user, msg] = yield createNewUser(open_key)
      if(!user) {
        return res.json({code: 0, message: msg})
      }
    }
    res.json({
      code: 1,
      info: user
    })
  }).catch(e=>{
    res.send(e.toString())
  })
});

function *createNewUser(openId){
  const request = yield axios.get(config.LIVE_API_HOST + '/live/create?token=ejutest')
  if(!request || request.status != 200) {
    return [null, '调用liveSaaS接口异常']
  }
  if(request.data.status != 1) {
    return [null, '调用liveSaaS接口创建直播通道失败']
  }
  data = {
    open_id:openId,
    push_url: request.data.mess.pushUrl,
    rtmp_play_url: request.data.mess.play
  }
  const user = new User(data)
  const result = yield user.save()
  if(!result) {
    return [null, '保存用户入库信息失败']
  }
  return [user.toJSON(), 'success']
}

module.exports = router;

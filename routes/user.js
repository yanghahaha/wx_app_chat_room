var express = require('express');
const co = require('co')
const axios = require("axios")
const config = require('../config')
const User = require('../model/User')

var router = express.Router();

router.get('/info', function(req, res, next) {
  const oid = req.query.oid
  if(!oid) {
    return res.json({code: 0, message: 'need param: oid'})
  }
  co(function*(){
    let user = yield User.findOne({where:{open_id:oid}})
    if(!user){
      [user, msg] = yield createNewUser(oid)
      if(!user) {
        return res.json({code: 0, message: msg})
      }
    }
    res.json({
      code: 1,
      info: user
    })
  }).catch(e=>{
    console.log(e)
    res.send('error')
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

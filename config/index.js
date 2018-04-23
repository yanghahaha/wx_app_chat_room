let config

if (!config) {
    try {
        config = require('../config/base')
        // 先中pm2的config中取env值，没有的话，再从node的启动argv中取env，没有的话默认dev
        console.log(process.env.NODE_ENV)
        const env = (process.env.NODE_ENV && config.ALL_ENVS.indexOf(process.env.NODE_ENV) !== -1) ? process.env.NODE_ENV : ((process.argv.length > 2 && config.ALL_ENVS.indexOf(process.argv[2]) !== -1) ? process.argv[2] : config.DEFAULT_NODE_ENV)
        console.log(`--------------------------, env is ${env}`)
        const customconfig = require(`../config/${env}`)
        Object.assign(config, customconfig)
    } catch (e) {
        console.log(e)
        console.log('Please make sure if config variable NODE_ENV is set.')
        process.exit()
    }
}

module.exports = config

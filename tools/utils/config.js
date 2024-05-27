const Configstore = require('configstore')

let ENV = 'dev'

const config = new Configstore('liturgy-maker')

module.exports.setEnv = (env) => {
  ENV = env
}

module.exports.has = key => config.has(`${ENV}.${key}`)

module.exports.get = key => config.get(`${ENV}.${key}`)

module.exports.set = (key, value) => config.set(`${ENV}.${key}`, value)

module.exports.delete = key => config.delete(`${ENV}.${key}`)

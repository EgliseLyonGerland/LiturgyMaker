const firebase = require('firebase')
const { prompt } = require('inquirer')

const config = require('../utils/config')

module.exports.command = 'login'
module.exports.desc = 'Login'

module.exports.handler = async function handler() {
  if (config.has('user')) {
    const data = JSON.parse(config.get('user'))
    console.log(`Already logged as ${data.email}`)

    return
  }

  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.NONE)
    .catch(console.error)
    .then(async () => {
      const { email, password } = await prompt([
        { name: 'email', message: 'Email' },
        { name: 'password', message: 'Password', type: 'password' },
      ])

      return firebase.auth().signInWithEmailAndPassword(email, password)
    })
    .then(({ user }) => {
      config.set('user', JSON.stringify(user))
      console.log(`Successfull logged as ${user.email}`)
    })
}

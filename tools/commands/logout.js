const Configstore = require('configstore');

const config = new Configstore('liturgy-maker');

module.exports.command = `logout`;
module.exports.desc = 'Logout';

module.exports.handler = async function handler({ env }) {
  config.delete(`${env}.user`);
  console.log('Logout successfull');
};

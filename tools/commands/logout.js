const config = require('../utils/config');

module.exports.command = `logout`;
module.exports.desc = 'Logout';

module.exports.handler = async function handler() {
  config.delete('user');
  console.log('Logout successfull');
};

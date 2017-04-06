var LdapStrategy = require('passport-ldapauth');
var passport = require('passport');


module.exports = function (config) {

passport.use(new LdapStrategy(config.OPTS));

}
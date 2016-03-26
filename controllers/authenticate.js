var Imap = require('imap');
var host = "10.0.0.173";
var port = 143;

module.exports.authenticate=function(username, password, callback){

  var imap = new Imap({
    user: username,
    password: password,
    host: host,
    port: port,
    tls: false
  });

  imap.once('ready', function() {
    // console.log("Logged In");
    imap.end();
    callback(null,1);
  });

  imap.once('error', function(err) {
    // console.log(err);
    callback(err);
  });

  imap.connect();
};

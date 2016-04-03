var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rembook');
var Users = require('../models/Users');

var domain = "octa.edu";
var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://10.0.0.39:389'
});
var getDepartment = function (rollNumber) {
  var departmentCode = rollNumber.slice(0,4);
  var department= "";
  switch (departmentCode) {
    case '1011':
    department = "ARCH";
    break;
    case '1021':
    department = "CIV";
    break;
    case '1031':
    department = "CHEM";
    break;
    case '1061':
    department = "CSE";
    break;
    case '1071':
    department = "EEE";
    break;
    case '1081':
    department = "ECE";
    break;
    case '1101':
    department = "ICE";
    break;
    case '1111':
    department = "MECH";
    break;
    case '1121':
    department = "PROD";
    break;
    case '1141':
    department = "MME";
    break;
  }
  return department;
};

var generateDN = function (rollNumber) {
  var year = "20"+ rollNumber.slice(4,6);
  var department = getDepartment(rollNumber);
  var DN = "CN="+rollNumber+",OU="+year+",OU=UG,OU="+department+",DC=octa,DC=edu";
  return DN;
};

var generateRollNumbers = function (init ,rollNumbers) {
  var i, j;
  for (i=0;i<init.length;i++){
    var start = parseInt(init[i].start);
    var end = parseInt(init[i].end);
    for (j = start; j <= end; j++){
      rollNumbers.push(j+"");
    }
  }
};


var username ="";
var password = "";
var cn = username+'@'+domain;
client.bind(cn,password,function(err){});

var i;
var init= [
  {start:"111113001", end:"111113101"},
  {start:"107113001", end:"107113106"},

];
var rollNumbers = [];
generateRollNumbers(init, rollNumbers);

var resultFound = function (err, res) {
  if (err){
    callback(err);
  }else{
    res.on('searchEntry', function(entry) {
      var data = {};
      data.rollNumber = entry.object.name;
      data.email = data.rollNumber + "@nitt.edu";
      data.name = entry.object.displayName.trim();
      data.department = getDepartment(data.rollNumber);
      Users.createProfile(data.rollNumber, data, function (err,doc){
        if (err){
          console.log(err);
        }
      });
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
    });
  }
};

var opts = {
  scope: 'sub',
};
var DN;

for (i = 0; i < rollNumbers.length; i++){
  DN = generateDN(rollNumbers[i]);
  client.search(DN, opts,resultFound);
}

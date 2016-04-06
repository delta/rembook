var username =""; //Octa Username
var password = ""; //Octa Password
//Add rollNumbers below
var init= [
  {start:"101112001", end: "101112008"},
  {start:"101112010", end: "101112049"},
  {start:"102112001", end: "102112070"},
  {start:"103112001", end: "103112106"},
  {start:"106112001", end: "106112107"},
  {start:"107112001", end: "107112105"},
  {start:"108112001", end: "108112107"},
  {start:"110112001", end: "110112099"},
  {start:"111112001", end: "111112109"},
  {start:"112112001", end: "112112060"},
  {start:"114112001", end: "114112100"},
];

var mongoose = require('mongoose');
var globalConfig = require('../config').config;
mongoose.connect(globalConfig.db);
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
    department = "ARCHI";
    break;
    case '1021':
    department = "CHL";
    break;
    case '1031':
    department = "CIV";
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
    department = "MME";
    break;
    case '1141':
    department = "PROD";
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


var username ="112112008";
var password = "Octa112";
var cn = username+'@'+domain;
client.bind(cn,password,function(err){});

var i;
var init= [
  {start:"101113001", end:"101113120"},
  {start:"102113001", end:"102113120"},
  {start:"103113001", end:"103113120"},
  {start:"106113001", end:"106113120"},
  {start:"107113001", end:"107113120"},
  {start:"108113001", end:"108113120"},
  {start:"110113001", end:"110113120"},
  {start:"111113001", end:"111113120"},
  {start:"112113001", end:"112113120"},
  {start:"114113001", end:"114113120"},

  {start:"101114001", end:"101114120"},
  {start:"102114001", end:"102114120"},
  {start:"103114001", end:"103114120"},
  {start:"106114001", end:"106114120"},
  {start:"107114001", end:"107114120"},
  {start:"108114001", end:"108114120"},
  {start:"110114001", end:"110114120"},
  {start:"111114001", end:"111114120"},
  {start:"112114001", end:"112114120"},
  {start:"114114001", end:"114114120"},


  {start:"101115001", end:"101115120"},
  {start:"102115001", end:"102115120"},
  {start:"103115001", end:"103115120"},
  {start:"106115001", end:"106115120"},
  {start:"107115001", end:"107115120"},
  {start:"108115001", end:"108115120"},
  {start:"110115001", end:"110115120"},
  {start:"111115001", end:"111115120"},
  {start:"112115001", end:"112115120"},
  {start:"114115001", end:"114115120"},
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

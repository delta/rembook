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
    case '1011': // UG Arch
    department = "ARCHI";
    break;
    case '1021': // UG Chem Engg
    department = "CHL";
    break;
    case '2023': // PG Chemm Engg (Energy Engg)
    department = "CEESAT";
    break;
    case '2021': // MSc. Chem Engg
    department = "CHEM";
    break;
    case '1031': // UG Civil
    case '2031': // PG Transportation Engg
    case '2032': // PG Structural Engg
    case '2034': // PG Environmental Engg
    department = "CIV";
    break;
    case '1061': // UG CSE
    case '2061': // PG CSE
    department = "CSE";
    break;
    case '1071': // UG EEE
    case '2071': // PG Power Systems
    case '2072': // PG Power Electronics
    department = "EEE";
    break;
    case '1081': // UG ECE
    case '2081': // PG Communication Systems
    case '2082': // PG VLSI
    department = "ECE";
    break;
    case '1101': // UG ICE
    case '2101': // PG PCI
    department = "ICE";
    break;
    case '1111':
    case '2112': // Industrial safety
    case '2113': // Thermal Power Engg
    department = "MECH";
    break;
    case '1121': // UG MME
    case '2122': // PG Material Science
    case '2123': // PG Industrial Metallurgy
    case '2121': // PG Welding
    department = "MME";
    break;
    case '1141': // UG PROD
    case '2141': // Manufacturing Tech
    case '2142': // Industrial Engg and Mgmt
    department = "PROD";
    break;
    case '2162': // actually, Msc. CS. But ldap doesn't differentiate between the two
    department = "MCA";
    break;
    case '2051': // real MCA
    department = "MCA";
    break;
    case '2131': // NDT
    case '2132': // MSc. Phy
    department = "PHY";
    break;
    case '2151': // DOMS
    department = "MBA";
    break;
  }
  return department;
};

var generateDN = function (rollNumber) {
  var year = "20"+ rollNumber.slice(4,6);
  var department = getDepartment(rollNumber);
  var pgOrUg = rollNumber[0] == "1" ? "UG" : "PG";
  if(/^216/.test(rollNumber)) year = "OR & CA"; // Well. Weird things happen all the time.
  var DN = "CN="+rollNumber+",OU="+year+",OU="+pgOrUg+",OU="+department+",DC=octa,DC=edu";
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
  {start:'205114001', end:'205114091'}, // real MCA

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
  {start:'202315001', end:'202315021'}, // PG Chemm Engg (Energy Engg)
  {start:'202115001', end:'202115026'}, // MSc. Chem Engg
  {start:'203115001', end:'203115029'}, // PG Transportation Engg
  {start:'203215001', end:'203215030'}, // PG Structural Engg
  {start:'203415001', end:'203415020'}, // PG Environmental Engg
  {start:'206115001', end:'206115100'}, // PG CSE
  {start:'207115001', end:'207115028'}, // PG Power Systems
  {start:'207215001', end:'207215031'}, // PG Power Electronics
  {start:'208115001', end:'208115030'}, // PG Communication Systems
  {start:'208215001', end:'208215030'}, // PG VLSI
  {start:'210115001', end:'210115025'}, // PG PCI
  {start:'211215001', end:'211215027'}, // Industrial safety
  {start:'211315001', end:'211315030'}, // Thermal Power Engg
  {start:'212215001', end:'212215017'}, // PG Material Science
  {start:'212315001', end:'212315020'}, // PG Industrial Metallurgy
  {start:'212115001', end:'212115029'}, // PG Welding
  {start:'214115001', end:'214115029'}, // Manufacturing Tech
  {start:'214215001', end:'214215029'}, // Industrial Engg and Mgmt
  {start:'216215001', end:'216215019'}, // actually, Msc. CS. But ldap doesn't differentiate between the two
  {start:'205115001', end:'205114100'}, // real MCA
  {start:'213115001', end:'213115027'}, // NDT
  {start:'213215001', end:'213215026'}, // MSc. Phy
  {start:'215115001', end:'215115075'}, // DOMS

  {start:"101116001", end:"101116120"},
  {start:"102116001", end:"102116120"},
  {start:"103116001", end:"103116120"},
  {start:"106116001", end:"106116120"},
  {start:"107116001", end:"107116120"},
  {start:"108116001", end:"108116120"},
  {start:"110116001", end:"110116120"},
  {start:"111116001", end:"111116120"},
  {start:"112116001", end:"112116120"},
  {start:"114116001", end:"114116120"},
  {start:'202316001', end:'202316050'}, // PG Chemm Engg (Energy Engg)
  {start:'202116001', end:'202116050'}, // MSc. Chem Engg
  {start:'203116001', end:'203116050'}, // PG Transportation Engg
  {start:'203216001', end:'203216050'}, // PG Structural Engg
  {start:'203416001', end:'203416050'}, // PG Environmental Engg
  {start:'206116001', end:'206116150'}, // PG CSE
  {start:'207116001', end:'207116050'}, // PG Power Systems
  {start:'207216001', end:'207216050'}, // PG Power Electronics
  {start:'208116001', end:'208116050'}, // PG Communication Systems
  {start:'208216001', end:'208216050'}, // PG VLSI
  {start:'210116001', end:'210116050'}, // PG PCI
  {start:'211216001', end:'211216050'}, // Industrial safety
  {start:'211316001', end:'211316050'}, // Thermal Power Engg
  {start:'212216001', end:'212216050'}, // PG Material Science
  {start:'212316001', end:'212316050'}, // PG Industrial Metallurgy
  {start:'212116001', end:'212116050'}, // PG Welding
  {start:'214116001', end:'214116050'}, // Manufacturing Tech
  {start:'214216001', end:'214216050'}, // Industrial Engg and Mgmt
  {start:'216216001', end:'216216050'}, // actually, Msc. CS. But ldap doesn't differentiate between the two
  {start:'205116001', end:'205116100'}, // real MCA
  {start:'213116001', end:'213116050'}, // NDT
  {start:'213216001', end:'213216050'}, // MSc. Phy
  {start:'215116001', end:'215116050'}, // DOMS
];
var rollNumbers = [];
generateRollNumbers(init, rollNumbers);

var resultFound = function (query, err, res) {
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
      console.error('error: ' + err.message + " Query was: " + query);
    });
  }
};

var opts = {
  scope: 'sub',
};
var DN;

for (i = 0; i < rollNumbers.length; i++){
  DN = generateDN(rollNumbers[i]);
  client.search(DN, opts,resultFound.bind(this,DN));
}

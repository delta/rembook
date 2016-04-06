var config ={
  db:"mongodb://localhost/rembook",

  base : "/home/manix/rembook16temp/public",
  phantomPath:"./node_modules/phantomjs/bin/phantomjs",
  pdfsDirectory:"./pdfs/",

  remPicPath:"./public/rempic/",
  profilePicPath:"./public/profilepic/",

  maxCharPerResonose : 1000,
  maxRemsForPrint:5,
};
module.exports.config = config;

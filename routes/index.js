var express = require('express');
var router = express.Router();
var sessionCheck = require('../controllers/session-check');
var login = require('../controllers/authenticate');
var users = require('../controllers/users');
var bio = require('../controllers/bio');
var rems = require('../controllers/rems');
var notifications = require('../controllers/notifications');
var printMyRem = require('../controllers/printMyRem');
var profilepic = require('./profilepic');
var finalRembook = require('../controllers/finalRembook');
var forgotPassword = require('../controllers/forgotPassword');
var multer = require('multer');
var upload = multer({
  dest:"./public/rempics",
});
router.get('/forgotPassword', function(req,res,next){
  if (!req.session.rollNumber && !req.query.token) return res.render('forgotPassword',{title:'Rembook'});
  console.log(req);
  return login.resetPassword(req,res,next);
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Rembook' });
});
router.post('/login',login.processLogin);
router.get('/updatePassword', function(req, res, next) {
  if (!req.session.rollNumber && !req.query.token) return res.redirect('/login');
  var rollNumber = req.session.rollNumber || req.query.rollNumber;
  res.render('updatePassword', { title: 'Rembook', token: req.query.token, rollNumber: rollNumber });
});
router.post('/forgotPassword',login.forgotPassword);
router.post('/updatePassword', login.updatePassword);
router.use(sessionCheck);
router.get('/', login.initalPage);
router.get('/profile/:rollNumber',users.getUserByRollNumber);
router.post('/profile/:rollNumber',users.updateProfile);
router.post('/hardcopy',users.hardCopyRequest);
router.get('/bio/:rollNumber',bio.getBioOf);
router.post('/bio/:rollNumber', bio.editBioOf);
router.get('/rem/:rollNumber', rems.getAllRemsTo);
router.post('/rem/', rems.updateRem);
router.post('/rem/approve/:id', rems.approveRem);
router.post('/rempic/:rollNumber', upload.single('rempic'), rems.uploadPic);
router.get('/notifications',notifications.getAllNotifications);
router.get('/search',users.search);
router.get('/printMyRem', printMyRem.printMyRem );
router.get('/logout', login.logout);
router.get('/finalRembook',finalRembook.download);
router.get('/profilepic/*', function(req, res) { res.redirect('/profilepic/temp.png'); });
router.get('/thumbnail/*', function(req, res) { res.redirect('/thumbnail/temp.png'); });
profilepic.uploadFile(router);

module.exports = router;

var express = require('express');
var router = express.Router();
var login = require('../controllers/authenticate');
var users = require('../controllers/users');
var bio = require('../controllers/bio');
var rems = require('../controllers/rems');
var notifications = require('../controllers/notifications');
var printMyRem = require('../controllers/printMyRem');
var profilepic = require('./profilepic');
var finalRembook = require('../controllers/finalRembook');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Rembook' });
});
router.post('/login',login.processLogin);
router.get('/', login.initalPage);
router.get('/profile/:rollNumber',users.getUserByRollNumber);
router.post('/profile/',users.updateProfile);
router.post('/hardcopy',users.hardCopyRequest);
router.get('/bio/:rollNumber',bio.getBioOf);
router.post('/bio/', bio.editBioOf);
router.get('/rem/:rollNumber', rems.getAllRemsTo);
router.post('/rem/:rollNumber', rems.updateRem);
router.post('/rem/approve/:id', rems.approveRem);
router.get('/notifications',notifications.getAllNotifications);
router.get('/search',users.search);
router.get('/printMyRemPreview', printMyRem.printMyRemPreview );
router.get('/logout', login.logout);
router.get('/finalRembook',finalRembook.download);

profilepic.uploadFile(router);

module.exports = router;

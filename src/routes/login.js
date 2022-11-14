const express = require('express');
const {registerView, registerUser, loginView, loginUser } = require('../controllers/loginController');
const router = express.Router();
router.get('/register', registerView);
router.post('/register', registerUser);
router.get('/login', loginView);
router.post('/login', loginUser);
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
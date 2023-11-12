const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const userController = require('./controllers/userController');
const { mustHavePrivilege, mustLoggedIn } = require('./middlewares/gatePassMiddleware');

router.use('/', authController);
router.use('/dashboard', mustLoggedIn, mustHavePrivilege(['view_dashboard'], 'any'), dashboardController);
router.use('/user', mustLoggedIn, mustHavePrivilege(['add_user', 'manage_profile'], 'any'), userController);

router.get('/pageNotFound', mustLoggedIn, function (req, res, next) {
    res.render('admin/pageNotFound', {layout : 'admin'});
});

module.exports = router;
const express = require('express');
const {dashboardView } = require('../controllers/dashboardController');
const {disksView} = require('../controllers/disksController');
const {sharesView} = require('../controllers/sharesController');
const {usersView} = require('../controllers/usersController');
const {containersView} = require('../controllers/containersController');
const {vmsView} = require('../controllers/vmsController');
const {settingsView} = require('../controllers/settingsController');
const {logsView} = require('../controllers/logsController');
const router = express.Router();
const { protectRoute } = require("../core/protect");

router.get('/', protectRoute, dashboardView);
router.get('/dashboard', protectRoute, dashboardView);
router.get('/disks', protectRoute, disksView);
router.get('/shares', protectRoute, sharesView);
router.get('/users', protectRoute, usersView);
router.get('/containers', protectRoute, containersView);
router.get('/vms', protectRoute, vmsView);
router.get('/settings', protectRoute, settingsView);
router.get('/logs', protectRoute, logsView);
module.exports = router;
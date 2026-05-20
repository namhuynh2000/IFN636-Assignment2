const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getHome } = require('../controllers/homeController');

const router = express.Router();

router.get('/', protect, getHome);

module.exports = router;


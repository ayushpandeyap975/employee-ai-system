const express = require('express');
const router = express.Router();
const { getAIRecommendation, rankEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getAIRecommendation);
router.get('/rank', protect, rankEmployees);

module.exports = router;
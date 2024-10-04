const express = require('express');
const router = express.Router();
const SeriesController = require('../controllers/seriesController');

// CMS routes
router.get('/cms/series-approved', SeriesController.getApprovedSeries);  // Read series dengan approval_status = 1
router.get('/cms/series-input', SeriesController.getUnapprovedSeries);   // Read series dengan approval_status = 0
router.post('/cms/series-input', SeriesController.createSeries);         // Create new series
router.put('/cms/series-approved/:id', SeriesController.updateApprovalStatus);  // Update approval status
router.delete('/cms/series-approved/:id', SeriesController.deleteSeries); // Delete series

module.exports = router;

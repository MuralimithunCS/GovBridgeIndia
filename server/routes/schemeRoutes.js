const express = require('express');
const router = express.Router();
const { getAllSchemes, getSchemeById, createScheme } = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);
router.post('/', createScheme);

module.exports = router;

const express = require('express');
const UrlController = require('../controller/UrlController');

const router = express.Router();
const controller = new UrlController();

router.post('/api/urls', controller.createShortUrl);
router.post('/api/urls/', controller.createShortUrl);
router.get('/api/urls', controller.listShortUrls);
router.get('/api/urls/', controller.listShortUrls);
router.get('/api/urls/:shortCode', controller.getShortUrl);
router.get('/api/urls/:shortCode/', controller.getShortUrl);
router.delete('/api/urls/:shortCode', controller.deleteShortUrl);
router.delete('/api/urls/:shortCode/', controller.deleteShortUrl);
router.get('/:shortCode', controller.resolveShortUrl);
router.get('/:shortCode/', controller.resolveShortUrl);

module.exports = router;

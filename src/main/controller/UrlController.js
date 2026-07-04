const UrlService = require('../service/UrlService');

class UrlController {
    constructor(service = new UrlService()) {
        this.service = service;
    }

    createShortUrl = (req, res, next) => {
        try {
            const originalUrl = req.body?.originalUrl || req.body?.url || req.body?.original_url || req.query?.url;
            const result = this.service.createShortUrl(originalUrl);
            return res.status(201).json(result);
        } catch (error) {
            return next(error);
        }
    };

    listShortUrls = (req, res, next) => {
        try {
            const result = this.service.listShortUrls();
            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };

    getShortUrl = (req, res, next) => {
        try {
            const result = this.service.getShortUrl(req.params.shortCode);
            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };

    deleteShortUrl = (req, res, next) => {
        try {
            this.service.deleteShortUrl(req.params.shortCode);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };

    resolveShortUrl = (req, res, next) => {
        try {
            const result = this.service.resolveShortUrl(req.params.shortCode);
            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = UrlController;

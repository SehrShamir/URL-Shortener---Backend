const crypto = require('crypto');
const UrlMapping = require('../model/UrlMapping');
const UrlRepository = require('../repository/UrlRepository');
const UrlResponse = require('../dto/UrlResponse');
const ShortCodeNotFoundException = require('../exception/ShortCodeNotFoundException');

class UrlService {
    constructor(repository = UrlRepository) {
        this.repository = repository;
    }

    isValidUrl(value) {
        try {
            const parsed = new URL(value);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    generateShortCode() {
        return crypto.randomBytes(3).toString('hex').slice(0, 6);
    }

    createShortUrl(originalUrl) {
        if (typeof originalUrl !== 'string' || !this.isValidUrl(originalUrl)) {
            const error = new Error('Invalid or missing URL');
            error.status = 400;
            throw error;
        }

        let shortCode = this.generateShortCode();
        while (this.repository.exists(shortCode)) {
            shortCode = this.generateShortCode();
        }

        const mapping = new UrlMapping({ shortCode, originalUrl });
        this.repository.save(mapping);

        return new UrlResponse(mapping.toJSON());
    }

    listShortUrls() {
        return this.repository.findAll().map((entry) => new UrlResponse(entry.toJSON()));
    }

    getShortUrl(shortCode) {
        const mapping = this.repository.findByShortCode(shortCode);
        if (!mapping) {
            throw new ShortCodeNotFoundException();
        }

        return new UrlResponse(mapping.toJSON());
    }

    deleteShortUrl(shortCode) {
        const deleted = this.repository.deleteByShortCode(shortCode);
        if (!deleted) {
            throw new ShortCodeNotFoundException();
        }
    }

    resolveShortUrl(shortCode) {
        const mapping = this.repository.findByShortCode(shortCode);
        if (!mapping) {
            throw new ShortCodeNotFoundException();
        }

        mapping.incrementClickCount();
        return { originalUrl: mapping.originalUrl, clickCount: mapping.clickCount };
    }
}

module.exports = UrlService;

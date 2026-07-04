const UrlMapping = require('../model/UrlMapping');

class UrlRepository {
    constructor() {
        this.store = new Map();
    }

    save(mapping) {
        this.store.set(mapping.shortCode, mapping);
        return mapping;
    }

    findAll() {
        return Array.from(this.store.values());
    }

    findByShortCode(shortCode) {
        return this.store.get(shortCode) || null;
    }

    deleteByShortCode(shortCode) {
        return this.store.delete(shortCode);
    }

    exists(shortCode) {
        return this.store.has(shortCode);
    }
}

module.exports = new UrlRepository();

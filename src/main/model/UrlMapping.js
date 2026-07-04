class UrlMapping {
    constructor({ shortCode, originalUrl, clickCount = 0, createdAt = new Date().toISOString() }) {
        this.shortCode = shortCode;
        this.originalUrl = originalUrl;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
    }

    incrementClickCount() {
        this.clickCount += 1;
        return this.clickCount;
    }

    toJSON() {
        return {
            shortCode: this.shortCode,
            shortUrl: `short.ly/${this.shortCode}`,
            originalUrl: this.originalUrl,
            clickCount: this.clickCount,
            createdAt: this.createdAt,
        };
    }
}

module.exports = UrlMapping;

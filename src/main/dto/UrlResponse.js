class UrlResponse {
    constructor({ shortCode, shortUrl, originalUrl, clickCount, createdAt }) {
        this.shortCode = shortCode;
        this.shortUrl = shortUrl;
        this.originalUrl = originalUrl;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
    }
}

module.exports = UrlResponse;

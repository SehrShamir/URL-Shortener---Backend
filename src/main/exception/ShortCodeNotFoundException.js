class ShortCodeNotFoundException extends Error {
    constructor(message = 'Short code not found') {
        super(message);
        this.name = 'ShortCodeNotFoundException';
        this.status = 404;
    }
}

module.exports = ShortCodeNotFoundException;

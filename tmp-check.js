const app = require('./src/server');
const http = require('http');
const server = http.createServer(app);
server.listen(0, () => {
    const { port } = server.address();
    const paths = ['/api/urls', '/api/urls/', '/api/urls/abc', '/abc'];
    const runIndex = (index) => {
        if (index >= paths.length) {
            server.close();
            return;
        }
        const path = paths[index];
        const req = http.request({ hostname: '127.0.0.1', port, path, method: 'GET' }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(path, '=>', res.statusCode, body);
                runIndex(index + 1);
            });
        });
        req.on('error', (err) => {
            console.error(err);
            server.close();
        });
        req.end();
    };
    runIndex(0);
});

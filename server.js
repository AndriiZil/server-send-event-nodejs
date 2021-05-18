const http = require('http');
const path = require('path');
const fs = require('fs');

http.createServer((req, res) => {
    const url = new URL(`http://${req.headers.host}${req.url}`);

    if (url.pathname === '/stream') {
        sse(req, res);
        return;
    }

    if (url.pathname === '/send-message') {
        data = url.searchParams.get('message');
        res.end(data);
        return;
    }

    const fileStream = fs.createReadStream(path.join(__dirname, 'index.html'));
    fileStream.pipe(res);
}).listen(8080, () => {
    console.log('Server running on port 8080');
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let data = '';
function sse(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let id = 0;

    const timer = setInterval(() => {
        // data = getRandomInt(100);

        if (data) {
            res.write(`data: some ${data} \n`);
            res.write(`id: ${++id}\n`);
            res.write('\n');
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(timer);
        res.write(`event: end-of-stream\n`);
        res.write('data: this is the end\n')
        res.write('\n');
        res.end();
    }, 5000);
}

import http from "http"

import app from '../app'

const port: Number = parseInt(<string>process.env.PORT, 10) || 8002;

app.set('port', port);

const server = http.createServer(app)
server.listen(port)
console.log(`Running on http://localhost:${port}`);

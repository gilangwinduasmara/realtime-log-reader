import { Router } from 'express';
import fs from 'fs';
import http from 'http';
import readLastLines from 'read-last-lines';
import { Server } from 'socket.io';
import app from './app';
import FileController from './controllers/FileController';

const port = 8000;

const server = http.createServer(app);
const io = new Server(server);
const router = Router();

const clients = new Set();

const fileController = new FileController(router);

const emitFileChange = (path:string, filename:string) => {
    readLastLines.read(path, 50)
    .then((lines) => {
        io.emit('file-changed', {
            path: filename,
            data: lines,
        });
    });
}

fs.watch(process.env.LOG_PATH + '/', (event, filename) => {
    if (filename.endsWith('.log')) {
        const path = process.env.LOG_PATH + '/' + filename;
        console.log(`File ${path} Changed`);
        emitFileChange(path, filename)
    }
});

router.get('/tes', (req, res) => res.send('ok'));
router.route('/files')
    .get(fileController.get);


app.use(router);

io.on("connection", (socket) => {
    console.log(clients)
    if(!clients.has(socket.id)) {
        clients.add(socket.id)
        console.log('client connected')
    }
});

server.listen(port, () => {
    console.log('Server is running on port: ' + port);
})


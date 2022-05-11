import { Router } from 'express';
import fs from 'fs';
import http from 'http';
import {Server} from 'socket.io';
import app from './app';
import FileController from './controllers/FileController';

const port = 8000;

const server = http.createServer(app);
const io = new Server(server);
const router = Router();

const clients = new Set();

const fileController = new FileController(router);

fs.watch(process.env.LOG_PATH+'/',(event,filename)=>{
    if(filename)
        console.log(`File ${filename} Changed`);
        fs.readFile(process.env.LOG_PATH+'/'+filename, 'utf8', function(err, data){
            io.emit('file-changed', {
                path: filename,
                data,
            });
        });
});

router.get('/tes', (req, res) => res.send('ok'));
router.route('/files')
    .get(fileController.get);


app.use(router);

io.on("connection", (socket) => {
    clients.add(socket.id)
    console.log('client connected')
});

server.listen(port, () => {
    console.log('Server is running on port: ' + port);
})


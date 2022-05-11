import Controller from './Controller';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import readLastLines from 'read-last-lines';
class FileController extends Controller {
    public get = async (req:Request, res:Response) => {
        const path = process.env.LOG_PATH;
        if (path) {            
            const files = await fs.readdir(path);
            const data = await Promise.all(files.map(async file => {
                const lines = await readLastLines.read(path+'/'+file, 50);
                return {
                    path: file,
                    data: lines,
                }
            }));
            return res.status(200).send({
                data,
            });
        }else {
            return res.status(500).send('error')
        }
    }
}

export default FileController;
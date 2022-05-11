import Controller from './Controller';
import fs from 'fs/promises';
import { Request, Response } from 'express';
class FileController extends Controller {
    public get = async (req:Request, res:Response) => {
        const path = process.env.LOG_PATH;
        if (path) {
            const files = await fs.readdir(path);
            return res.status(200).send({
                data: files
            });
        }else {
            return res.status(500).send('error')
        }
    }
}

export default FileController;
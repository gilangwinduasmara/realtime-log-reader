import { Router, Request, Response } from "express";

class Controller {

    req!:Request;
    res!:Response;

    constructor(router: Router) {
        router.use((req, res, next) => {
            this.req = req;
            this.res = res;
            next();
        })
    }

    protected sendResponse = (data:any) => {
        this.res.send({
            data,
            success: true,
        })
    }
}

export default Controller;
import * as express from 'express'
import { hospitalService } from '../service/hospital.service'
import { verifyHospital } from '../middleware/auth.middleware';
import multer from 'multer';
import { S3Upload, uploadImg } from "../utils/imageUpload.util";

class HospitalRoute {
    public hospitalRouter: express.Router = express.Router();
    private upload;

    constructor() {
        this.upload = multer();
        this.hospitalRouter.post('/review/img', verifyHospital, S3Upload('reviewImage').single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.hospitalRouter.get('/hospital', listHospital);
        this.hospitalRouter.get('/hospital/:hpid', getHospital);
    }
}

async function listHospital(req: express.Request, res: express.Response) {
    try {
        let { filter } = req.query; // { lon:127.026,lat:37.5872 }
        filter = JSON.parse(filter);

        const result = await hospitalService.listHospital(filter);
        res.send({
            success: true,
            result,
            statusCode: 200,
            message: 'listHospital'
        })
    } catch (err) {
        res.send({
            success: false,
            result: err,
            statusCode: 500,
            message: 'listHospital: 500'
        })
    }
}

async function getHospital(req: express.Request, res: express.Response) {
    let hpid = req.params.hpid;
    const sequelize = req.app.locals.sequelize;
    try {
        const result = await hospitalService.getHospital(hpid, sequelize);
        res.send({
            success: true,
            result,
            statusCode: 200
        })
    } catch (err) {
        res.send({
            success: false,
            statusCode: 500,
            message: 'getHospital: 500'
        })
    }
}

export const hospitalRoute = new HospitalRoute();
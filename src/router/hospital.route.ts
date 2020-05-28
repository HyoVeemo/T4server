import * as express from 'express'
import { hospitalService } from '../service/hospital.service'
import { verifyHospital } from '../middleware/auth.middleware';
import multer from 'multer';
import { S3Upload, uploadImg } from "../utils/imageUpload.util";
import { auth } from '../utils/auth.util';

class HospitalRoute {
    public hospitalRouter: express.Router = express.Router();
    private upload;

    constructor() {
        this.upload = multer();
        this.hospitalRouter.post('/hospital/img', verifyHospital, S3Upload('hospitalImage').single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.hospitalRouter.patch('/hospital/img', verifyHospital, this.upload.none(), postHospitalImg);

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

async function postHospitalImg(req: express.Request, res: express.Response) {
    const { hpid } = auth(req);
    const imgUrl = req.body.img
    try {
        await hospitalService.postHospitalImg(hpid, imgUrl);

        res.status(200).send({
            success: true
        });
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            statusCode: 500
        });
    }
}

export const hospitalRoute = new HospitalRoute();
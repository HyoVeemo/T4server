import * as express from 'express'
import { hospitalService } from '../service/hospital.service'

class HospitalRoute {
    public hospitalRouter: express.Router = express.Router();
    constructor() {
        this.hospitalRouter.get('/hospital/:hpid', getHospital);
        this.hospitalRouter.get('/hospital', listHospital);
    }
}

async function listHospital(req, res): Promise<any> {
    try {
        let { filter } = req.query; // { lon:127.026,lat:37.5872 }
        filter = JSON.parse(filter);

        const result = await hospitalService.listHospital(filter);
        res.send({
            success: true,
            statusCode: 200,
            result: result,
            message: 'listHospital'
        })
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            statusCode: 500,
            message: 'listHospital: 500'
        })
    }
}

async function getHospital(req, res): Promise<any> {
    let hpid = req.params.hpid;
    const sequelize = req.app.locals.sequelize;
    try {
        const result = await hospitalService.getHospital(hpid, sequelize);
        res.send({
            success: true,
            statusCode: 200,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            statusCode: 500,
            message: 'getHospital: 500'
        })
    }
}



export const hospitalRoute: HospitalRoute = new HospitalRoute();
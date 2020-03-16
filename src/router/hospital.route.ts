import * as express from 'express'
import { hospitalService } from '../service/hospital.service'
import { auth } from '../utils/auth.util'
class HospitalRoute {
    public hospitalRouter: express.Router = express.Router();
    constructor() {
        this.hospitalRouter.get('/hospital/:hpid', getHospital)
        this.hospitalRouter.get('/hospital', pageListHospital)
        this.hospitalRouter.get('/debug', loginTest);
    }
}

async function loginTest(req, res): Promise<any> {
    try {

        const token = auth(req);
        console.log(token);

        res.send({
            success: true,
            statusCode: 200,
            result: token
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

async function pageListHospital(req, res): Promise<any> {
    try {
        let { filter, order, pn } = req.query;
        const result = await hospitalService.pageListHospital(filter, order, pn);
        res.send({
            success: true,
            statusCode: 200,
            result: result,
            message: 'pageListHospital'
        })
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            statusCode: 500,
            message: 'pageListHospital: 500'
        })
    }
}
export const hospitalRoute: HospitalRoute = new HospitalRoute();
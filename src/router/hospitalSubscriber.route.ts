import * as express from 'express';
import { hospitalSubscriberService } from '../service/hospitalSubscriber.service';
import { auth } from '../utils/auth.util'
import { verifyUser } from '../middleware/auth.middleware';

class HospitalSubscriberRoute {
    public hospitalSubscriberRouter: express.Router = express.Router();
    constructor() {
        this.hospitalSubscriberRouter.put('/hospitalSubscriber/hpid/:hpid', verifyUser, updateHospitalSubscriber);
        this.hospitalSubscriberRouter.get('/allHospitalSubscriber', verifyUser, getAllHospitalSubscribers);
    }
}

async function getAllHospitalSubscribers(req, res) {
    try {
        const { tokenIndex: userIndex } = auth(req);
        let { location } = req.query;
        location = JSON.parse(location);
        //console.log(location.lat);
        const result = await hospitalSubscriberService.getAllHospitals(userIndex,location);
        res.send({
            success: true,
            result,
            message: 'getAllHospitalSubscribers: 200'
        })
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            statusCode: 500,
            message: 'getAllHospitalSubscribers: 500'
        })
    }
}

async function updateHospitalSubscriber(req, res): Promise<any> {
    try {
        const hpid = req.params.hpid;
        let { tokenIndex: userIndex } = auth(req);
        let resultHopitalSubscriber = await hospitalSubscriberService.getHospitalSubscriber(userIndex, hpid);
        let result;

        //구독 정보가 있는 경우
        if (!resultHopitalSubscriber) {
            result = await hospitalSubscriberService.createHospitalSubscriber({
                hpid: hpid,
                userIndex: userIndex,
                isScrap: 1
            })
        } else {
            result = await hospitalSubscriberService.deleteHospitalSubscriber(hpid, userIndex);
        }

        
        //delete result[0].userIndex;
        res.send({
            success: true,
            statusCode: 200,
            result: result,
            message: 'putHospitalSubscriber: 200'
        })

    } catch (err) {
        res.send({
            success: false,
            statusCode: 500,
            message: 'putHospitalSubscriber: 500'
        })
    }
}

export const hospitalSubscriberRoute: HospitalSubscriberRoute = new HospitalSubscriberRoute();
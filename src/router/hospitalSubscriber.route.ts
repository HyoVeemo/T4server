import * as express from 'express';
import { hospitalSubscriberService } from '../service/hospitalSubscriber.service';
import { auth } from '../utils/auth.util'


class HospitalSubscriberRoute{
    public hospitalSubscriberRouter: express.Router = express.Router();
    constructor(){
        this.hospitalSubscriberRouter.put('/hospitalSubscriber/hpid/:hpid',updateHospitalSubscriber);
    }
}

async function updateHospitalSubscriber(req,res):Promise<any>{
    try{
        const hpid = req.params.hpid;
        let {tokenIndex: userIndex} = auth(req);
        let result = await hospitalSubscriberService.getHospitalSubscriber(userIndex,hpid);
        
        
        
        //구독 정보가 있는 경우
        if(!result){ 
            await hospitalSubscriberService.createHospitalSubscriber({
                hpid: hpid,
                userIndex: userIndex,
                isScrap: req.body.isScrap === undefined ? 0 : 1
            })
        }else{
            await hospitalSubscriberService.updateHospitalSubscriber(hpid, userIndex, req.body);
        }

        result = await hospitalSubscriberService.getHospitalSubscriber(hpid, userIndex)
        if(result[0].isScrap===0){
            await hospitalSubscriberService.deleteHospitalSubscriber(hpid, userIndex);
        }
        
        delete result[0].userIndex;
        res.send({
            success: true,
            statusCode: 200,
            result: result[0],
            message: 'putHospitalSubscriber: 200'
        })

    }catch(err){
        console.log(err);
        res.send({
            success:false,
            statusCode: 500,
            message: 'putHospitalSubscriber: 500'
        })
    }
}

export const hospitalSubscriberRoute: HospitalSubscriberRoute = new HospitalSubscriberRoute();
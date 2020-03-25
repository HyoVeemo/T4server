import HospitalSubscriber from '../models/HospitalSubscriber.model';

export class HospitalSubscriberService{
    constructor(){
    }

    /**
     * service: 병원 즐겨찾기 생성
     */
    async createHospitalSubscriber(hospitalSubscriberData:any):Promise<any>{
        let resultHospitalSubscriber = await HospitalSubscriber.create(hospitalSubscriberData);
        return resultHospitalSubscriber;
    }

    /**
     * service:병원 즐겨찾기 조회
     * @param userIndex 
     * @param hpid 
     */
    async getHospitalSubscriber(userIndex:number, hpid: string):Promise<any>{
        let resultHospitalSubscriber = await HospitalSubscriber.findOne({
            where:{
                userIndex: userIndex,
                hpid: hpid
            }
        });

        return resultHospitalSubscriber.toJSON();
    }


    async updateHospitalSubscriber(hpid:string,userIndex:number,hospitalSubscriberData:any):Promise<any>{
        const result = await HospitalSubscriber.update(hospitalSubscriberData,{
            where:{
                hpid: hpid,
                userIndex: userIndex
            }
        });
        return result;

    }

    async deleteHospitalSubscriber(hpid:string, userIndex:number):Promise<any>{
        const result = await HospitalSubscriber.destroy({
            where:{
                hpid: hpid,
                userIndex: userIndex
            }
        })
    }
}

export const hospitalSubscriberService:HospitalSubscriberService = new HospitalSubscriberService();
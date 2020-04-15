import HospitalSubscriber from '../models/HospitalSubscriber.model';
import Hospital from '../models/Hospital.model';
import Sequelize from 'sequelize'
class HospitalSubscriberService {
    constructor() {
    }

    /**
     * service: 병원 즐겨찾기 생성
     */
    async createHospitalSubscriber(hospitalSubscriberData: any): Promise<any> {
        let resultHospitalSubscriber = await HospitalSubscriber.create(hospitalSubscriberData);
        return resultHospitalSubscriber;
    }

    /**
     * service:병원 즐겨찾기 조회
     * @param userIndex 
     * @param hpid 
     */
    async getHospitalSubscriber(userIndex: number, hpid: string): Promise<any> {
        let resultHospitalSubscriber = await HospitalSubscriber.findOne({
            where: {
                userIndex: userIndex,
                hpid: hpid
            }
        });
        return resultHospitalSubscriber;
    }

    async getAllHospitals(userIndex: number, location:any) {
        // location = {lon, lat}
        console.log(location.lon, location.lat);
        const resultHospitals = await HospitalSubscriber.findAndCountAll({
            where: { userIndex: userIndex },
            attributes:[
                [Sequelize.literal("(6371*acos(cos(radians("+location.lat+"))*cos(radians(`hospital`.`wgs84lat`))*cos(radians("+location.lon+") - radians(`hospital`.`wgs84lon`))+ sin(radians("+location.lat+"))*sin(radians(`hospital`.`wgs84lat`))))"),'distance']
            ],
            include: [
                {
                    model: Hospital,
                    required: true
                }
            ]
        });
//'FROM `HospitalSubscribers` AS `HospitalSubscriber` INNER JOIN `Hospitals` AS `ho
        let results = [];
        for (const row of resultHospitals.rows){
            results.push(row.toJSON());
        }

        
        return results;

    }


    async updateHospitalSubscriber(hpid: string, userIndex: number, hospitalSubscriberData: any): Promise<any> {
        const result = await HospitalSubscriber.update(hospitalSubscriberData, {
            where: {
                hpid: hpid,
                userIndex: userIndex
            }
        });
        return result;

    }

    async deleteHospitalSubscriber(hpid: string, userIndex: number): Promise<any> {
        const result = await HospitalSubscriber.destroy({
            where: {
                hpid: hpid,
                userIndex: userIndex
            }
        })
    }


}

export const hospitalSubscriberService = new HospitalSubscriberService();
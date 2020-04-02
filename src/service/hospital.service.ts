import Hospital from '../models/Hospital.model'
import HospitalCategory from '../models/HospitalCategory.model';
import Category from '../models/Category.model';
import Review from '../models/Review.model';
import HospitalOffice from '../models/HospitalOffice.model';
import { Op, QueryTypes } from 'sequelize';


interface IHospitalCreateData {
    hpid: string,
    dutyName: string,
    dutyAddr?: string,
    wgs84Lon?: number,
    wgs84Lat?: number,
    dutyTime1?: string,
    dutyTime2?: string,
    dutyTime3?: string,
    dutyTime4?: string,
    dutyTime5?: string,
    dutyTime6?: string,
    dutyTime7?: string,
    dutyTime8?: string,
    dutyTel?: string,
    dutyInf?: string,
}

export class HospitalService {
    constructor() {

    }

    /**
     * service: 병원 생성
     */
    async createHospital(hospitalData: IHospitalCreateData): Promise<any> {
        let resultHospital = await Hospital.create(hospitalData);
        return resultHospital;
    }


    /**
     * service: 병원 목록 조회
     * @param filter 
     * @param order 
     * @param pn 
     */
    async listHospital(filter?: any): Promise<any> {
        const lon = filter.lon;
        const lat = filter.lat;
        console.log(lon, lat)
        const query = `SELECT
        t1.hpid,
        t1.dutyName,
        t1.dutyTel,
        t1.dutyAddr,
        t1.dutyInfom
        t1.wgs84Lon,
        t1.wgs84Lat,
        t1.dutyTime1,
        t1.dutyTime2,
        t1.dutyTime3,
        t1.dutyTime4,
        t1.dutyTime5,
        t1.dutyTime6,
        t1.dutyTime7,
        t1.dutyTime8,
        (6371*acos(cos(radians(:lat))*cos(radians(t1.wgs84Lat))*cos(radians(t1.wgs84Lon)-radians(:lon)) 
        +sin(radians(:lat))*sin(radians(t1.wgs84Lat)))) AS distance,
        t3.hospitalCategoryName
        FROM Hospitals AS t1
        INNER JOIN HospitalCategories AS t2 ON t1.hpid = t2.hpid
        INNER JOIN Categories AS t3 ON t2.dgid = t3.dgid
        HAVING distance < 5
        ORDER by distance ASC limit 50;`;
        const values = {
            lat: lat,
            lon: lon
        }

        let resultHospital = await Hospital.sequelize.query(query,{
            replacements: values,
            type: QueryTypes.SELECT,
            raw: true
        });
        console.log(resultHospital);

        return resultHospital;
    }

    /**
     * 병원 조회
     * @param hpid 
     */
    async getHospital(hpid: string, sequelize): Promise<any> {
        let resultHospital = await Hospital.findAll({
            where: {
                hpid: hpid
            },
            attributes: [
                'hpid',
                'dutyName',
                'dutyAddr',
                'wgs84Lon',
                'wgs84Lat',
                'dutyTime1',
                'dutyTime2',
                'dutyTime3',
                'dutyTime4',
                'dutyTime5',
                'dutyTime6',
                'dutyTime7',
                'dutyTime8',
                'dutyTel',
                'dutyInf',
                [sequelize.fn('AVG', sequelize.col('review.rating')), 'ratingAvg']
            ],
            include: [
                {
                    model: Review,
                    as: 'review',
                    attributes: [],
                    required: false
                },
                {
                    model: Category,
                    as: 'category',
                    required: true
                },
            ],
            group: ['hpid', 'category.dgid']
        });
        return resultHospital;
    }

    async getHpidByOfficeIndex(officeIndex: number): Promise<any> {
        let resultHospitalOffice: HospitalOffice = await HospitalOffice.findOne({
            where: {
                officeIndex: officeIndex
            }
        });
        return resultHospitalOffice;
    }
}

export const hospitalService: any = new HospitalService();
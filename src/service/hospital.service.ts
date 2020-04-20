import Hospital from '../models/Hospital.model'
import HospitalCategory from '../models/HospitalCategory.model';
import Category from '../models/Category.model';
import Review from '../models/Review.model';
import HospitalOffice from '../models/HospitalOffice.model';
import { hospitalOfficeService } from '../service/hospitalOffice.service';
import { QueryTypes } from 'sequelize';

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
    dutyInf?: string
}

class HospitalService {
    constructor() {

    }

    /**
     * service: 병원 생성
     */
    async createHospital(hospitalData: IHospitalCreateData) {
        let resultHospital = await Hospital.create(hospitalData);
        return resultHospital;
    }

    /**
     * service: 병원 목록 조회
     * @param filter 
     * @param order 
     * @param pn 
     */
    async listHospital(filter?: any) {
        const lon = filter.lon;
        const lat = filter.lat;
        const query = `SELECT 
        t1.hpid, 
        t1.dutyName, 
        t1.dutyAddr, 
        t1.dutyMapimg, 
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
        t1.dutyTel, 
        t1.dutyInf, 
        (6371*acos(cos(radians(:lat))*cos(radians(t1.wgs84Lat))*cos(radians(t1.wgs84Lon)-radians(:lon)) 
        +sin(radians(:lat))*sin(radians(t1.wgs84Lat)))) AS distance, 
        AVG(review.rating) AS ratingAvg
        FROM Hospitals AS t1 
        LEFT OUTER JOIN Reviews AS review ON t1.hpid = review.hpid 
        GROUP BY hpid
        HAVING distance < 5 
        ORDER BY distance ASC limit 50;`;

        const values = {
            lat: lat,
            lon: lon
        }

        let resultHospital = await Hospital.sequelize.query(query, {
            replacements: values,
            type: QueryTypes.SELECT,
            raw: true
        });

        /**
         * 카테고리, 진료실/진료항목 찾아 넣어주기.
         */
        let categories: Array<string>; // 각 병원의 카테고리 넣을 배열.
        for (const hospital of resultHospital) {
            /** 각 병원의 카테고리를 찾는다 */
            let hpid = hospital["hpid"];
            let resultCategory = await HospitalCategory.findAll({
                where: {
                    hpid: hpid
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        required: true
                    }
                ],
            });
            /** 카테고리 배열에 찾은 카테고리들을 넣어준다. */
            categories = [];
            for (const i of resultCategory) {
                categories.push(i.category.hospitalCategoryName);
            }
            hospital["category"] = categories;

            /* 각 병원의 진료실과 진료항목을 찾는다 */
            let hospitalOffices = await hospitalOfficeService.getOfficeNameAndTreatmentByHpid(hpid);
            let offices = [];
            let treatments;
            for (const office of hospitalOffices) {
                let treatmentNames = [];
                let obj;
                treatments = office.getDataValue('treatment');
                for (const treatment of treatments) {
                    treatmentNames.push(treatment.getDataValue('treatmentName'));
                }
                obj = {
                    officeIndex: office.getDataValue('officeIndex'),
                    officeName: office.getDataValue('officeName'),
                    treatment: treatmentNames
                }
                offices.push(obj);
            }
            hospital["office"] = offices;
        }

        /** 결과 리턴 */
        return resultHospital;
    }

    /**
     * 병원 개별 조회
     * @param hpid 
     */
    async getHospital(inputHpid: string, sequelize) {
        try {
            let resultHospital = await Hospital.findAll({
                where: {
                    hpid: inputHpid
                },
                attributes: [
                    'hpid',
                    'dutyName',
                    'dutyAddr',
                    'dutyMapimg',
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
                    }
                ],
                group: ['hpid']
            });

            const hospital = resultHospital[0]['dataValues'];
            /**
            * 카테고리, 진료실/진료항목 찾아 넣어주기.
            */
            let categories: Array<string>; // 각 병원의 카테고리 넣을 배열.
            /** 각 병원의 카테고리를 찾는다 */
            let hpid = hospital["hpid"];
            let resultCategory = await HospitalCategory.findAll({
                where: {
                    hpid: hpid
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        required: true
                    }
                ],
            });
            /** 카테고리 배열에 찾은 카테고리들을 넣어준다. */
            categories = [];
            for (const i of resultCategory) {
                categories.push(i.category.hospitalCategoryName);
            }
            hospital["category"] = categories;

            /* 각 병원의 진료실과 진료항목을 찾는다 */
            let hospitalOffices = await hospitalOfficeService.getOfficeNameAndTreatmentByHpid(hpid);
            let offices = [];
            let treatments;
            for (const office of hospitalOffices) {
                let treatmentNames = [];
                let obj;
                treatments = office.getDataValue('treatment');
                for (const treatment of treatments) {
                    treatmentNames.push(treatment.getDataValue('treatmentName'));
                }
                obj = {
                    officeIndex: office.getDataValue('officeIndex'),
                    officeName: office.getDataValue('officeName'),
                    treatment: treatmentNames
                }
                offices.push(obj);
            }
            hospital["office"] = offices;

            return hospital;

        } catch (err) {
            console.error(err);
        }

    }

    async getHpidByOfficeIndex(officeIndex: number): Promise<any> {
        let resultHospitalOffice = await HospitalOffice.findOne({
            where: {
                officeIndex: officeIndex
            }
        });
        return resultHospitalOffice['dataValues']['hpid'];
    }
}

export const hospitalService = new HospitalService();

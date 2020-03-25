import Hospital from '../models/Hospital.model'
import HospitalCategory from '../models/HospitalCategory.model';
import Category from '../models/Category.model';
import Review from '../models/Review.model';
import HospitalOffice from '../models/HospitalOffice.model';
import { Op } from 'sequelize';


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
     * service: 병원 목록 리스트 개수 조회
     * @param filter 
     */
    async listHospital(filter?: any): Promise<any> {

    }

    /**
     * service: 병원 목록 조회
     * @param filter 
     * @param order 
     * @param pn 
     */
    async pagelistHospital(filter?: any, order?: any, pn?: any): Promise<any> {
        let hospitalWhere: any = {};

        if (filter) {
            if (filter.hospitalCategoryName) {
                hospitalWhere.hospitalCategoryName = filter.hospitalCategoryName
            }
            if (filter.dutyName) {
                hospitalWhere.dutyName = filter.dutyName
            }
        }

        let option: any = {
            where: {
                [Op.or]: [
                    {
                        dutyName: hospitalWhere.dutyName
                    },
                    {
                        '$hospital->hospitalCategory->category.hospitalCategoryName$': hospitalWhere.hospitalCategoryName
                    }
                ]
            },
            include: [
                {
                    model: HospitalCategory,
                    required: true,
                    include: [
                        {
                            model: Category,
                            required: true,
                            attributes: [
                                'hospitalCategoryName'
                            ]
                        }
                    ]
                }
            ],
        }

        /** 정렬 */
        if (order) {
            option.order = order;
        } else {
            option.order = [['dutyName', 'DESC']]
        }

        if (pn) {
            option.limit = pn.limit; // 개수
            option.offset = pn.offset; // 시작 위치
        }

        let resultHospital = await Hospital.findAndCountAll(option);
        let results: Array<any> = [];
        for (const row of resultHospital.rows) {
            results.push(row.toJSON);
        }

        return results;
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
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hospital_model_1 = __importDefault(require("../models/Hospital.model"));
const HospitalCategory_model_1 = __importDefault(require("../models/HospitalCategory.model"));
const Category_model_1 = __importDefault(require("../models/Category.model"));
const Review_model_1 = __importDefault(require("../models/Review.model"));
const HospitalOffice_model_1 = __importDefault(require("../models/HospitalOffice.model"));
const hospitalOffice_service_1 = require("../service/hospitalOffice.service");
const sequelize_1 = require("sequelize");
class HospitalService {
    constructor() {
    }
    /**
     * service: 병원 생성
     */
    createHospital(hospitalData) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultHospital = yield Hospital_model_1.default.create(hospitalData);
            return resultHospital;
        });
    }
    /**
     * service: 병원 목록 조회
     * @param filter
     * @param order
     * @param pn
     */
    listHospital(filter) {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
            let resultHospital = yield Hospital_model_1.default.sequelize.query(query, {
                replacements: values,
                type: sequelize_1.QueryTypes.SELECT,
                raw: true
            });
            /**
             * 카테고리, 진료실/진료항목 찾아 넣어주기.
             */
            let categories; // 각 병원의 카테고리 넣을 배열.
            for (const hospital of resultHospital) {
                /** 각 병원의 카테고리를 찾는다 */
                let hpid = hospital["hpid"];
                let resultCategory = yield HospitalCategory_model_1.default.findAll({
                    where: {
                        hpid: hpid
                    },
                    include: [
                        {
                            model: Category_model_1.default,
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
                let hospitalOffices = yield hospitalOffice_service_1.hospitalOfficeService.getOfficeNameAndTreatmentByHpid(hpid);
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
                    };
                    offices.push(obj);
                }
                hospital["office"] = offices;
            }
            /** 결과 리턴 */
            return resultHospital;
        });
    }
    /**
     * 병원 개별 조회
     * @param hpid
     */
    getHospital(hpid, sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultHospital = yield Hospital_model_1.default.findAll({
                where: {
                    hpid: hpid
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
                        model: Review_model_1.default,
                        as: 'review',
                        attributes: [],
                        required: false
                    },
                    {
                        model: Category_model_1.default,
                        as: 'category',
                        required: true
                    },
                ],
                group: ['hpid', 'category.dgid']
            });
            return resultHospital;
        });
    }
    getHpidByOfficeIndex(officeIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultHospitalOffice = yield HospitalOffice_model_1.default.findOne({
                where: {
                    officeIndex: officeIndex
                }
            });
            return resultHospitalOffice['dataValues']['hpid'];
        });
    }
}
exports.hospitalService = new HospitalService();
//# sourceMappingURL=hospital.service.js.map
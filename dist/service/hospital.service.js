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
const Category_model_1 = __importDefault(require("../models/Category.model"));
const Review_model_1 = __importDefault(require("../models/Review.model"));
const HospitalOffice_model_1 = __importDefault(require("../models/HospitalOffice.model"));
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
            console.log(lon, lat);
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
            };
            let resultHospital = yield Hospital_model_1.default.sequelize.query(query, {
                replacements: values,
                type: sequelize_1.QueryTypes.SELECT,
                raw: true
            });
            console.log(resultHospital);
            return resultHospital;
        });
    }
    /**
     * 병원 조회
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
            return resultHospitalOffice;
        });
    }
}
exports.HospitalService = HospitalService;
exports.hospitalService = new HospitalService();
//# sourceMappingURL=hospital.service.js.map
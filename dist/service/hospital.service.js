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
     * service: 병원 목록 리스트 개수 조회
     * @param filter
     */
    listHospital(filter) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * service: 병원 목록 조회
     * @param filter
     * @param order
     * @param pn
     */
    pagelistHospital(filter, order, pn) {
        return __awaiter(this, void 0, void 0, function* () {
            let hospitalWhere = {};
            if (filter) {
                if (filter.hospitalCategoryName) {
                    hospitalWhere.hospitalCategoryName = filter.hospitalCategoryName;
                }
                if (filter.dutyName) {
                    hospitalWhere.dutyName = filter.dutyName;
                }
            }
            let option = {
                where: {
                    [sequelize_1.Op.or]: [
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
                        model: HospitalCategory_model_1.default,
                        required: true,
                        include: [
                            {
                                model: Category_model_1.default,
                                required: true,
                                attributes: [
                                    'hospitalCategoryName'
                                ]
                            }
                        ]
                    }
                ],
            };
            /** 정렬 */
            if (order) {
                option.order = order;
            }
            else {
                option.order = [['dutyName', 'DESC']];
            }
            if (pn) {
                option.limit = pn.limit; // 개수
                option.offset = pn.offset; // 시작 위치
            }
            let resultHospital = yield Hospital_model_1.default.findAndCountAll(option);
            let results = [];
            for (const row of resultHospital.rows) {
                results.push(row.toJSON);
            }
            return results;
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
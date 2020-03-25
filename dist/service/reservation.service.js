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
const Reservation_model_1 = __importDefault(require("../models/Reservation.model"));
const ReservationLog_model_1 = __importDefault(require("../models/ReservationLog.model"));
const Hospital_model_1 = __importDefault(require("../models/Hospital.model"));
const HospitalOffice_model_1 = __importDefault(require("../models/HospitalOffice.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
class ReservationService {
    constructor() { }
    /**
     * service: 예약 중복 검사
     * @param sequelize
     * @param reservationData
     */
    getDuplicated(sequelize, reservationData) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCount;
            let query = "SELECT COUNT(*) FROM Reservations WHERE reservationDate = DATE(:reservationDate)";
            query += " AND officeIndex = :officeIndex";
            query += " AND ( TIME_FORMAT(reservationTime, '%T') BETWEEN TIME_FORMAT(:reservationTime, '%T')";
            query += " AND ADDTIME(TIME_FORMAT(:reservationTime, '%T'), '00:15:00')"; // 진료 시작 시간
            query += " OR ADDTIME(TIME_FORMAT(reservationTime, '%T'), '00:15:00') BETWEEN TIME_FORMAT(:reservationTime, '%T') AND ADDTIME(:reservationTime, '00:15:00') )"; // 진료 종료 시간
            const values = {
                officeIndex: reservationData.officeIndex,
                reservationDate: reservationData.reservationDate,
                reservationTime: reservationData.reservationTime
            };
            console.log(reservationData);
            yield sequelize.query(query, { replacements: values })
                .spread(function (results, metadata) {
                resultCount = results[0];
            }, function (err) {
                console.error(err);
            });
            return resultCount;
        });
    }
    ;
    /**
     * service: 예약 생성
     * @param reservationData
     */
    createReservation(reservationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultReservation = yield Reservation_model_1.default.create(reservationData);
            return resultReservation;
        });
    }
    getReservation(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    userIndex: userIndex
                },
                include: [{
                        model: Hospital_model_1.default,
                        attributes: ['dutyName']
                    }, {
                        model: HospitalOffice_model_1.default,
                        attributes: ['officeName']
                    }, {
                        model: User_model_1.default,
                        attributes: ['userName', 'age', 'tel', 'email']
                    }]
            };
            const result = yield Reservation_model_1.default.findAndCountAll(option);
            return result;
        });
    }
    getReservationLog(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    userIndex: userIndex
                },
                include: [{
                        model: Hospital_model_1.default,
                        attributes: ['dutyName']
                    }, {
                        model: HospitalOffice_model_1.default,
                        attributes: ['officeName']
                    }, {
                        model: User_model_1.default,
                        attributes: ['userName', 'age', 'tel', 'email']
                    }]
            };
            const result = yield ReservationLog_model_1.default.findAndCountAll(option);
            return result;
        });
    }
    /**
     * service: 예약 취소
     * @param reservationIndex
     * @param userIndex
     */
    deleteReservation(reservationIndex, userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    reservationIndex: reservationIndex,
                    userIndex: userIndex
                }
            };
            const result = yield Reservation_model_1.default.destroy(option);
            if (result === 0) {
                return '해당 예약이 존재하지 않아 변화 없음.';
            }
        });
    }
}
exports.reservationService = new ReservationService();
//# sourceMappingURL=reservation.service.js.map
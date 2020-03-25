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
const express_1 = __importDefault(require("express"));
const auth_util_1 = require("../utils/auth.util");
const reservation_service_1 = require("../service/reservation.service");
const hospital_service_1 = require("../service/hospital.service");
class ReservationRoute {
    constructor() {
        this.reservationRouter = express_1.default.Router();
        this.reservationRouter.post('/reservation/officeIndex/:officeIndex', reserveHospital); // 병원 예약하기
        this.reservationRouter.get('/reservation', getReservation); // 예약 현황 보기
        this.reservationRouter.get('/reservation/history', getReservationLog); // 지난 예약 내역 보기
        this.reservationRouter.delete('/reservation/reservationIndex/:reservationIndex', cancelReservation); // 예약 취소하기
    }
}
function reserveHospital(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = req.app.locals.sequelize;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        try {
            const office = yield hospital_service_1.hospitalService.getHpidByOfficeIndex(req.params.officeIndex);
            const reservationData = {
                userIndex: userIndex,
                officeIndex: req.params.officeIndex,
                hpid: office['dataValues']['hpid'],
                reservationDate: req.body.reservationDate,
                reservationTime: req.body.reservationTime,
                alterUserName: req.body.alterUserName || null,
                alterAge: req.body.alterAge || null,
                alterTel: req.body.alterTel || null,
                alterEmail: req.body.alterEmail || null
            };
            const countRow = yield reservation_service_1.reservationService.getDuplicated(sequelize, reservationData);
            if (countRow['COUNT(*)'] === 2) { // 예약이 이미 2자리 차있으면
                res.send({
                    success: false,
                    result: '예약이 두 자리 다 찼음.',
                    message: 'createReservation: 200'
                });
            }
            else {
                const result = yield reservation_service_1.reservationService.createReservation(reservationData);
                res.send({
                    success: true,
                    result,
                    message: 'createReservation: 200'
                });
            }
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'createReservation: 500'
            });
        }
    });
}
function getReservation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        try {
            const result = yield reservation_service_1.reservationService.getReservation(userIndex);
            res.send({
                success: true,
                result,
                message: 'getReservation: 200'
            });
        }
        catch (err) {
            res.send({
                success: false,
                message: 'getReservation: 500'
            });
        }
    });
}
function getReservationLog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        try {
            const result = yield reservation_service_1.reservationService.getReservationLog(userIndex);
            res.send({
                success: true,
                result,
                message: 'getReservationLog: 200'
            });
        }
        catch (err) {
            res.send({
                success: false,
                message: 'getReservationLog: 500'
            });
        }
    });
}
function cancelReservation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reservationIndex = req.params.reservationIndex;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        try {
            const result = yield reservation_service_1.reservationService.deleteReservation(reservationIndex, userIndex);
            res.send({
                success: true,
                result,
                message: 'cancelReservation: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'cancelReservation: 500'
            });
        }
    });
}
exports.reservationRoute = new ReservationRoute();
//# sourceMappingURL=reservation.route.js.map
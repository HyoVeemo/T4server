import express from 'express';
import { auth } from '../utils/auth.util'
import { reservationService } from '../service/reservation.service';
import { hospitalService } from '../service/hospital.service';

class ReservationRoute {
    public reservationRouter: express.Router = express.Router();
    constructor() {
        this.reservationRouter.post('/reservation/officeIndex/:officeIndex', reserveHospital); // 병원 예약하기
        this.reservationRouter.get('/reservation', getReservation); // 예약 현황 보기
        this.reservationRouter.get('/reservation/history', getReservationLog) // 지난 예약 내역 보기
        this.reservationRouter.delete('/reservation/reservationIndex/:reservationIndex', cancelReservation); // (사용자 본인이) 예약 취소하기
        this.reservationRouter.patch('/reservation/reservationIndex/:reservationIndex', acceptReservation); // 병원 측에서 예약 수락 시 status 업데이트 (PENDING -> ACCEPTED)
        this.reservationRouter.patch('/reservation/reservationIndex/:reservationIndex', refuseReservation); // 병원 측에서 예약 거절 시 status 업데이트 (PENDING -> REFUSED)
    }
}

async function refuseReservation(req, res) {
    try {
        const reply = 'refuse';
        const result = await reservationService.updateReservationStatus(req.params.reservationIndex, reply);
        res.send({
            success: true,
            result,
            message: 'updateReservationStatus: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'updateReservationStatus: 500'
        });
    }
}

async function acceptReservation(req, res) {
    try {
        const reply = 'accept';
        const result = await reservationService.updateReservationStatus(req.params.reservationIndex, reply);
        res.send({
            success: true,
            result,
            message: 'updateReservationStatus: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'updateReservationStatus: 500'
        });
    }
}

async function reserveHospital(req, res) {
    const sequelize = req.app.locals.sequelize;
    const { tokenIndex: userIndex } = auth(req);
    try {
        const office = await hospitalService.getHpidByOfficeIndex(req.params.officeIndex);

        const reservationData = {
            userIndex: userIndex,
            officeIndex: req.params.officeIndex, // 진료실
            hpid: office['dataValues']['hpid'],
            reservationDate: req.body.reservationDate,
            reservationTime: req.body.reservationTime,
            alterUserName: req.body.alterUserName || null,
            alterAge: req.body.alterAge || null,
            alterTel: req.body.alterTel || null,
            alterEmail: req.body.alterEmail || null
        };

        const countRow = await reservationService.getDuplicated(sequelize, reservationData);

        if (countRow['COUNT(*)'] === 2) { // 예약이 이미 2자리 차있으면
            res.send({
                success: false,
                result: '예약이 두 자리 다 찼음.',
                message: 'createReservation: 200'
            });
        } else {
            const result = await reservationService.createReservation(reservationData);

            res.send({
                success: true,
                result,
                message: 'createReservation: 200'
            });
        }
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'createReservation: 500'
        });
    }
}


async function getReservation(req, res) {
    const { tokenIndex: userIndex } = auth(req);
    try {
        const result = await reservationService.getReservation(userIndex);
        res.send({
            success: true,
            result,
            message: 'getReservation: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'getReservation: 500'
        });
    }
}

async function getReservationLog(req, res) {
    const { tokenIndex: userIndex } = auth(req);
    try {
        const result = await reservationService.getReservationLog(userIndex);
        res.send({
            success: true,
            result,
            message: 'getReservationLog: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'getReservationLog: 500'
        });
    }
}

/**
 * 예약 취소
 * @param req 
 * @param res 
 */
async function cancelReservation(req, res) {
    const reservationIndex = req.params.reservationIndex;
    const { tokenIndex: userIndex } = auth(req);
    try {
        const result = await reservationService.deleteReservation(reservationIndex, userIndex);
        res.send({
            success: true,
            result,
            message: 'cancelReservation: 200'
        });
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            result: err,
            message: 'cancelReservation: 500'
        });
    }
}

export const reservationRoute = new ReservationRoute();

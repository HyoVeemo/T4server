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
        this.reservationRouter.delete('/reservation/reservationIndex/:reservationIndex', cancelReservation); // 예약 취소하기
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
        console.error(err);
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

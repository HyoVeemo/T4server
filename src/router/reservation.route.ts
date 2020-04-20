import express from 'express';
import { auth } from '../utils/auth.util'
import { reservationService } from '../service/reservation.service';
import { hospitalService } from '../service/hospital.service';
import { hospitalOfficeService } from '../service/hospitalOffice.service';
import { verifyUser, verifyHospital } from '../middleware/auth.middleware';

class ReservationRoute {
    public reservationRouter: express.Router = express.Router();
    constructor() {
        this.reservationRouter.post('/reservation/officeIndex/:officeIndex', verifyUser, reserveHospital); // 병원 예약하기
        this.reservationRouter.get('/reservation', verifyUser, getReservation); // 예약 현황 보기
        this.reservationRouter.get('/reservation/reservationIndex/:reservationIndex', verifyUser, loadReservation); // 새로고침용(?)
        this.reservationRouter.get('/reservation/history', verifyUser, getReservationLog) // 지난 예약 내역 보기
        this.reservationRouter.patch('/cancel/reservationIndex/:reservationIndex', verifyUser, cancelReservation); // (사용자 본인이) 예약 취소하기
        this.reservationRouter.delete('/reservation/reservationIndex/:reservationIndex', verifyUser, deleteReservation); // (사용자 본인이) 예약 삭제하기
        this.reservationRouter.patch('/accept/reservationIndex/:reservationIndex', verifyHospital, acceptReservation); // 병원 측에서 예약 수락 시 status 업데이트 (PENDING -> ACCEPTED)
        this.reservationRouter.patch('/refuse/reservationIndex/:reservationIndex', verifyHospital, refuseReservation); // 병원 측에서 예약 거절 시 status 업데이트 (PENDING -> REFUSED)
    }
}

async function reserveHospital(req, res) {
    const sequelize = req.app.locals.sequelize;
    const { tokenIndex: userIndex } = auth(req);
    const officeIndex = req.params.officeIndex;
    const treatmentName = req.body.treatmentName;
    try {
        const hpid = await hospitalService.getHpidByOfficeIndex(req.params.officeIndex);
        const treatmentIndex = await hospitalOfficeService.getTreatmentIndexByOfficeIndexAndTreatmentName(officeIndex, treatmentName);

        const reservationData = {
            userIndex: userIndex,
            hpid: hpid,
            officeIndex: req.params.officeIndex, // 진료실
            treatmentIndex: treatmentIndex,
            treatmentName: treatmentName,
            comment: req.body.comment,
            reservationDate: req.body.reservationDate,
            reservationTime: req.body.reservationTime
        };
        const result = await reservationService.getDuplicated(sequelize, reservationData);

        if (result['COUNT(*)'] === 2) { // 예약이 이미 2자리 차있으면
            res.send({
                success: false,
                result: '예약이 두 자리 다 찼음.',
                message: 'createReservation: 200'
            });
        } else if (result === '중복 예약 불가') {
            res.send({
                success: false,
                result,
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
            message: 'createReservation: 500'
        });
    }
}

async function loadReservation(req, res) {
    try {
        const reservationIndex = req.params.reservationIndex;
        const result = await reservationService.getOneReservation(reservationIndex);
        res.send({
            success: true,
            result,
            message: 'createReservation: 200'
        });
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
        const result = await reservationService.getMyReservation(userIndex);
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
        const result = await reservationService.getMyReservationLog(userIndex);
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
        await reservationService.cancelReservation(reservationIndex, userIndex);
        res.send({
            success: true,
            message: 'cancelReservation: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'cancelReservation: 500'
        });
    }
}

/**
 * 진료 내역 삭제
 * @param req 
 * @param res 
 */
async function deleteReservation(req, res) {
    const reservationIndex = req.params.reservationIndex;
    const { tokenIndex: userIndex } = auth(req);
    try {
        const result = await reservationService.deleteReservation(reservationIndex, userIndex);
        res.send({
            success: true,
            result,
            message: 'deleteReservation: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'deleteReservation: 500'
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
            message: 'acceptReservation: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'acceptReservation: 500'
        });
    }
}

async function refuseReservation(req, res) {
    try {
        const reply = 'refuse';
        const result = await reservationService.updateReservationStatus(req.params.reservationIndex, reply);
        res.send({
            success: true,
            result,
            message: 'refuseReservation: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'refuseReservation: 500'
        });
    }
}

export const reservationRoute = new ReservationRoute();

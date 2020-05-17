import express from 'express';
import { auth } from '../utils/auth.util';
import { verifyHospital } from '../middleware/auth.middleware';
import { hospitalManagementService } from "../service/hospitalManagement.service";

class HospitalManagementRoute {
    public hospitalManagementRouter: express.Router = express.Router();
    constructor() {
        this.hospitalManagementRouter.get('/manage/reservation/waiting', verifyHospital, getWaitingReservations); // 응답 대기중인 예약 보기
        this.hospitalManagementRouter.get('/manage/reservation/accepted', verifyHospital, getAcceptedReservations); // 수락된 예약 목록 보기
        this.hospitalManagementRouter.get('/manage/reservation/history', verifyHospital, getReservationLogs); // 지난 예약 내역 보기(취소/거절/타임아웃)
        this.hospitalManagementRouter.patch('/manage/accept/reservationIndex/:reservationIndex', verifyHospital, acceptReservation); // 병원 측에서 예약 수락 시 status 업데이트 (PENDING -> ACCEPTED)
        this.hospitalManagementRouter.patch('/manage/refuse/reservationIndex/:reservationIndex', verifyHospital, refuseReservation); // 병원 측에서 예약 거절 시 status 업데이트 (PENDING -> REFUSED)
        this.hospitalManagementRouter.delete('/manage/delete/reservationIndex/:reservationIndex', verifyHospital, deleteReservation); // (병원측에서) 지난 예약 내역 삭제하기
    }
}

async function getWaitingReservations(req: express.Request, res: express.Response) {
    try {
        const { hpid } = auth(req);
        const result = await hospitalManagementService.getWaitingReservations(hpid);

        res.status(200).json({
            success: true,
            result,
            message: 'getWaitingReservations succeeded'
        })
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'getWaitingReservations failed'
        });
    }
}

async function getAcceptedReservations(req: express.Request, res: express.Response) {
    try {
        const { hpid } = auth(req);
        const result = await hospitalManagementService.getAcceptedReservations(hpid);

        res.status(200).json({
            success: true,
            result,
            message: 'getAcceptedReservations succeeded'
        })
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'getAcceptedReservations failed'
        });
    }
}

async function getReservationLogs(req: express.Request, res: express.Response) {
    try {
        const { hpid } = auth(req);
        const result = await hospitalManagementService.getReservationLogs(hpid);

        res.status(200).json({
            success: true,
            result,
            message: 'getReservationLogs succeeded'
        })
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'getReservationLogs failed'
        });
    }
}

async function acceptReservation(req: express.Request, res: express.Response) {
    try {
        const reply = 'accept';
        const result = await hospitalManagementService.updateReservationStatus(req.params.reservationIndex, reply);
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

async function refuseReservation(req: express.Request, res: express.Response) {
    try {
        const reply = 'refuse';
        const result = await hospitalManagementService.updateReservationStatus(req.params.reservationIndex, reply);
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

async function deleteReservation(req: express.Request, res: express.Response) {
    try {
        const { hpid } = auth(req);
        const reservationIndex = req.params.reservationIndex;
        const result = await hospitalManagementService.deleteReservation(hpid, reservationIndex);

        res.status(200).json({
            success: true,
            result,
            message: 'deleteReservation succeeded'
        })
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'deleteReservation failed'
        });
    }
}

export const hospitalManagementRoute = new HospitalManagementRoute();

import Reservation from '../models/Reservation.model';
import Hospital from '../models/Hospital.model';
import HospitalOffice from '../models/HospitalOffice.model';
import User from '../models/User.model';
import { Op, Sequelize } from 'sequelize';
import notify from '../utils/notification.util';

class HospitalManagementService {
    constructor() {

    }

    async commentOnReservation(reservationIndex, diagnosis) {
        const result = await Reservation.update({ diagnosis }, { where: { reservationIndex, status: 'TIMEOUT' } });

        if (result[0] === 1) {
            return '변경 완료';
        } else {
            return '변경 사항 없음 - TIMEOUT 상태인 예약만 변경 가능.'
        }
    }

    async getCommentOnReservation(reservationIndex) {
        const option = {
            where: {
                reservationIndex
            },
            include: [{
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel']
            }]
        }

        return await Reservation.findOne(option);
    }

    async getPatientMedicalHistory(hpid, userIndex) {
        const option = {
            where: {
                userIndex,
                hpid,
                [Op.or]: [
                    {
                        status: 'REFUSED'
                    },
                    {
                        status: 'TIMEOUT'
                    },
                    {
                        status: 'CANCELED'
                    }
                ]
            },
            order: [Sequelize.literal(`STR_TO_DATE(CONCAT(reservationDate, ' ', reservationTime), '%Y-%m-%d %H:%i:%s') DESC`)],
            include: [{
                model: Hospital,
                attributes: ['dutyName']
            }, {
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel']
            }]
        };

        return await Reservation.findAndCountAll(option);
    }

    async getWaitingReservations(hpid: string) {
        return await Reservation.findAndCountAll({
            where: {
                hpid,
                status: 'PENDING'
            },
            order: [Sequelize.literal('createdAt ASC')],
            include: [{
                model: Hospital,
                attributes: ['dutyName']
            }, {
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel']
            }]
        });
    }

    async getAcceptedReservations(hpid: string) {
        return await Reservation.findAndCountAll({
            where: {
                hpid,
                status: 'ACCEPTED'
            },
            order: [Sequelize.literal(`STR_TO_DATE(CONCAT(reservationDate, ' ', reservationTime), '%Y-%m-%d %H:%i:%s') ASC`)],
            include: [{
                model: Hospital,
                attributes: ['dutyName']
            }, {
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel']
            }]
        });
    }

    async getReservationLogs(hpid: string) {
        return await Reservation.findAndCountAll({
            where: {
                hpid,
                [Op.or]: [
                    {
                        status: 'TIMEOUT'
                    },
                    {
                        status: 'CANCELED'
                    },
                    {
                        status: 'REFUSED'
                    }
                ],
            },
            order: [Sequelize.literal(`STR_TO_DATE(CONCAT(reservationDate, ' ', reservationTime), '%Y-%m-%d %H:%i:%s') DESC`)],
            include: [{
                model: Hospital,
                attributes: ['dutyName']
            }, {
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel']
            }]
        });
    }

    /* 병원 측에서 예약 요청 수락 또는 거절 시 상태 변경 */
    async updateReservationStatus(req, reply) {
        const reservationIndex = req.params.reservationIndex;
        const reservation = await Reservation.findOne({ where: { reservationIndex } });
        const hospital = await Hospital.findOne({ where: { hpid: reservation.getDataValue("hpid") } });

        let change;
        let msg = `[${hospital.getDataValue("dutyName")}]\n 
        🌟진료항목🌟 ${reservation.getDataValue("treatmentName")}\n
        🌟날짜🌟 ${reservation.getDataValue("reservationDate")}\n
        🌟시간🌟 ${reservation.getDataValue("reservationTime")}\n`;

        if (reply === 'accept') {
            change = { status: 'ACCEPTED' }; // 수락
            msg += '예약이 수락되었습니다. 방문 시간을 지켜주세요❗';
        } else {
            change = { status: 'REFUSED' }; // 거절
            msg += '예약이 거절되었습니다😢';
        }

        const option = {
            where: {
                reservationIndex
            }
        }
        const result = await Reservation.update(change, option);

        if (result[0] === 1) {
            notify(req, reservation.getDataValue("userIndex"), msg);
        }
    }

    async deleteReservation(hpid: string, reservationIndex: string) {
        await Reservation.destroy({
            where: {
                hpid,
                reservationIndex
            }
        });
    }
}

export const hospitalManagementService = new HospitalManagementService();

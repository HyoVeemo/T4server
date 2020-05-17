import Reservation from '../models/Reservation.model';
import Hospital from '../models/Hospital.model';
import HospitalOffice from '../models/HospitalOffice.model';
import User from '../models/User.model';
import { Op, Sequelize } from 'sequelize';

class HospitalManagementService {
    constructor() {

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
    async updateReservationStatus(reservationIndex, reply) {
        let change;
        if (reply === 'accept') {
            change = { status: 'ACCEPTED' }; // 수락
        } else {
            change = { status: 'REFUSED' }; // 거절
        }

        const option = {
            where: {
                reservationIndex: reservationIndex
            }
        }

        await Reservation.update(change, option);
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

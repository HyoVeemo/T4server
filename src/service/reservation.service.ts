import Reservation from '../models/Reservation.model';
import Hospital from '../models/Hospital.model';
import HospitalOffice from '../models/HospitalOffice.model';
import User from '../models/User.model';
import { Op, Sequelize } from 'sequelize';

interface IReservationCreateData {
    userIndex: number;
    hpid: string;
    officeIndex: number;
    treatmentIndex: number;
    treatmentName: string;
    reservationDate: string;
    reservationTime: string;
}

class ReservationService {
    constructor() { }

    /**
     * service: 예약 중복 검사
     * @param sequelize 
     * @param reservationData 
     */
    async getDuplicated(sequelize, reservationData) {
        const option = {
            where: {
                officeIndex: reservationData.officeIndex,
                reservationDate: reservationData.reservationDate,
                reservationTime: reservationData.reservationTime,
                userIndex: reservationData.userIndex
            }
        }
        const data = await Reservation.findOne(option);
        if (!data) {
            let resultCount;
            let query = "SELECT COUNT(*) FROM Reservations WHERE ( officeIndex = :officeIndex";
            query += " AND reservationDate = :reservationDate";
            query += " AND reservationTime = :reservationTime";
            query += " AND status = :status )";

            const values = {
                officeIndex: reservationData.officeIndex,
                reservationDate: reservationData.reservationDate,
                reservationTime: reservationData.reservationTime,
                status: 'ACCEPTED'
            };

            await sequelize.query(query, { replacements: values })
                .spread(function (results, metadata) {
                    resultCount = results[0];
                    console.log(resultCount);
                }, function (err) {
                    console.error(err);
                });
            /**
             * resultCount = 해당 진료실 / 예약날짜 / 예약시간의 예약 수
             */
            return resultCount;

        } else {
            const result = '중복 예약 불가';
            return result;
        }

    };

    /**
     * service: 예약 생성
     * @param reservationData 
     */
    async createReservation(reservationData: IReservationCreateData): Promise<any> {
        const resultReservation = await Reservation.create(reservationData);
        return resultReservation;
    }

    async getMyReservation(userIndex) {
        const option = {
            where: {
                userIndex: userIndex,
                [Op.or]: [
                    {
                        status: 'PENDING'
                    },
                    {
                        status: 'ACCEPTED'
                    }
                ]
            },
            order: [Sequelize.literal('createdAt DESC')],
            include: [{
                model: Hospital,
                attributes: ['dutyName']
            }, {
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel', 'email']
            }]
        }
        const result = await Reservation.findAndCountAll(option);

        return result;
    }

    async getOneReservation(reservationIndex: number) {
        return await Reservation.findOne({
            where: { reservationIndex: reservationIndex }
        });
    }

    async getMyReservationLog(userIndex) {
        const option = {
            where: {
                userIndex: userIndex,
                deleted: false,
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
                attributes: ['dutyName', 'dutyTel']
            }, {
                model: HospitalOffice,
                attributes: ['officeName']
            }, {
                model: User,
                attributes: ['userName', 'age', 'tel', 'email']
            }]
        }
        return await Reservation.findAndCountAll(option);
    }

    async cancelReservation(reservationIndex: number, userIndex: number) {
        const change = { status: 'CANCELED' };
        const option = {
            where: {
                reservationIndex: reservationIndex,
                userIndex: userIndex
            }
        }

        await Reservation.update(change, option);
    }

    /**
     * service: 예약 삭제
     * @param reservationIndex 
     * @param userIndex 
     */
    async deleteReservation(reservationIndex, userIndex) {
        const change = { deleted: true };
        const option = {
            where: {
                reservationIndex: reservationIndex,
                userIndex: userIndex
            }
        }

        const result = await Reservation.update(change, option);
        if (result[0] === 0) {
            return '해당 예약이 존재하지 않아 변화 없음.';
        }
    }
}

export const reservationService = new ReservationService();
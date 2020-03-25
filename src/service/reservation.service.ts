import Reservation from '../models/Reservation.model';
import ReservationLog from '../models/ReservationLog.model';
import Hospital from '../models/Hospital.model';
import HospitalOffice from '../models/HospitalOffice.model';
import User from '../models/User.model';
import { Sequelize } from 'sequelize/types';

interface IReservationCreateData {
    userIndex: number;
    officeIndex: number;
    hpid: string;
    reservationDate: string;
    reservationTime: string;
    alterUserName?: string;
    alterAge?: string;
    alterTel?: string;
    alterEmail?: string;
}

class ReservationService {
    constructor() { }

    /**
     * service: 예약 중복 검사
     * @param sequelize 
     * @param reservationData 
     */
    async getDuplicated(sequelize, reservationData) {
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
        await sequelize.query(query, { replacements: values })
            .spread(function (results, metadata) {
                resultCount = results[0];
            }, function (err) {
                console.error(err);
            });

        return resultCount;

    };

    /**
     * service: 예약 생성
     * @param reservationData 
     */
    async createReservation(reservationData: IReservationCreateData): Promise<any> {
        const resultReservation = await Reservation.create(reservationData);
        return resultReservation;
    }

    async getReservation(userIndex) {
        const option = {
            where: {
                userIndex: userIndex
            },
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

    async getReservationLog(userIndex) {
        const option = {
            where: {
                userIndex: userIndex
            },
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
        const result = await ReservationLog.findAndCountAll(option);

        return result;
    }

    /**
     * service: 예약 취소
     * @param reservationIndex 
     * @param userIndex 
     */
    async deleteReservation(reservationIndex, userIndex) {
        const option = {
            where: {
                reservationIndex: reservationIndex,
                userIndex: userIndex
            }
        }
        const result = await Reservation.destroy(option);
        if (result === 0) {
            return '해당 예약이 존재하지 않아 변화 없음.';
        }
    }
}

export const reservationService = new ReservationService();
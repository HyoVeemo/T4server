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
        /** 
         * 입력받은(요청 통해서 넘어온) 예약날짜와 진료실 번호, 그리고 예약시간과 예약시간 + 15분 사이에 예약 돼있는 모든 로우 count하는 쿼리. 
         * 즉 기존 예약 정보와 시간이 겹치는 부분이 있으면 count++함.
        */
        let query = "SELECT COUNT(*) FROM Reservations WHERE reservationDate = DATE(:reservationDate)"; // reservationDate -> 예약날짜
        query += " AND officeIndex = :officeIndex"; // officeIndex -> 진료실 번호
        query += " AND ( TIME_FORMAT(reservationTime, '%T') BETWEEN TIME_FORMAT(:reservationTime, '%T')"; // reservationTime -> 예약시간
        query += " AND ADDTIME(TIME_FORMAT(:reservationTime, '%T'), '00:15:00')"; // 15분 = 한 사람 진료하는 데 걸리는 시간이라 가정. 
        query += " OR ADDTIME(TIME_FORMAT(reservationTime, '%T'), '00:15:00') BETWEEN TIME_FORMAT(:reservationTime, '%T') AND ADDTIME(:reservationTime, '00:15:00') )"; // 진료 종료 시간

        const values = {
            officeIndex: reservationData.officeIndex,
            reservationDate: reservationData.reservationDate,
            reservationTime: reservationData.reservationTime
        };

        //console.log(reservationData);
        await sequelize.query(query, { replacements: values })
            .spread(function (results, metadata) {
                resultCount = results[0];
            }, function (err) {
                console.error(err);
            });
        /**
         * resultCount = 해당 진료실 / 예약날짜 / 예약시간의 예약 수
         */
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
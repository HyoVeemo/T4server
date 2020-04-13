import Reservation from '../models/Reservation.model';
import Hospital from '../models/Hospital.model';
import HospitalOffice from '../models/HospitalOffice.model';
import User from '../models/User.model';
import { Op } from 'sequelize';

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
        const data = await Reservation.findOne(option); // 그 시간에 예약한 게 없으면
        if (!data) {
            let resultCount;
            /** 
             * 입력받은(요청 통해서 넘어온) 예약날짜와 진료실 번호, 그리고 예약시간과 예약시간 + 15분 사이에 예약 돼있는 모든 로우 count하는 쿼리. 
             * 즉 기존 예약 정보와 시간이 겹치는 부분이 있으면 count함.
            */
            let query = "SELECT COUNT(*) FROM Reservations WHERE ( officeIndex = :officeIndex"; // reservationDate -> 예약날짜
            query += " AND reservationDate = :reservationDate"; // officeIndex -> 진료실 번호
            query += " AND reservationTime = :reservationTime"; // reservationTime -> 예약시간
            query += " AND status = :status )"; // ACCEPTED 상태인 예약이 두 개면 안 됨.

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
                [Op.or]: [ // 응답대기중, 예약됨.
                    {
                        status: 'PENDING'
                    },
                    {
                        status: 'ACCEPTED'
                    }
                ]
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

    async getMyReservationLog(userIndex) {
        const option = {
            where: {
                userIndex: userIndex,
                [Op.or]: [ // 거절됨, 타임아웃, 취소됨.
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
        const result = await Reservation.findAndCountAll(option);

        return result;
    }

    /**
     * 병원 측에서 예약 요청 수락 또는 거절 시 상태 변경.
     * @param reservationIndex 
     */
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
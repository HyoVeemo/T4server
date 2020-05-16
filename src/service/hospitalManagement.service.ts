import Reservation from '../models/Reservation.model';

class HospitalManagementService {
    constructor() {

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
}

export const hospitalManagementService = new HospitalManagementService();

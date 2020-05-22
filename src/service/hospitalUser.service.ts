import HospitalUser from '../models/HospitalUser.model';
import { hashSync } from 'bcryptjs';

class HospitalUserService {
    constructor() {
    }

	/**
	 * service: 유저 생성
	 */
    async createHospitalUser(hospitalUserData) {
        const hashedPassword = hashSync(hospitalUserData.hospitalUserPw, 8);
        hospitalUserData.hospitalUserPw = hashedPassword;

        let resultHospitalUser = await HospitalUser.create(hospitalUserData);
        return resultHospitalUser.toJSON();
    }

    async getHospitalUserByEmail(email: string) {
        let resultHospitalUser: HospitalUser = await HospitalUser.findOne({
            where: {
                email
            }
        })
        return resultHospitalUser;
    }

    async getHospitalUserByHpid(hpid: string) {
        let resultHospitalUser: HospitalUser = await HospitalUser.findOne({
            where: {
                hpid
            }
        })
        return resultHospitalUser;
    }

	/**
	 * service: 유저 정보 업데이트
	 */
    async updateHospitalUser(hospitalUserIndex: number, hospitalUserData: any) {
        if (hospitalUserData.hospitalUserPw) {
            const hashedPassword = hashSync(hospitalUserData.hospitalUserPw, 8);
            hospitalUserData.hospitalUserPw = hashedPassword;
        }
        const result = await HospitalUser.update(hospitalUserData, {
            where: {
                hospitalUserIndex
            }
        });

        return result;
    }

	/**
	 * service: 유저 삭제
	 */
    async deleteHositalUser(hospitalUserIndex: number) {
        await HospitalUser.destroy({
            where: {
                hospitalUserIndex
            }
        })
    }
}

export const hospitalUserService = new HospitalUserService();

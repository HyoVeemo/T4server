import HospitalUser from '../models/HospitalUser.model';
import { hashSync, compareSync } from 'bcryptjs';

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

	/**
	 * service: 유저 조회
	 */
    async getHospitalUser(email: string) {
        let resultHospitalUser = await HospitalUser.findOne({
            where: {
                email: email
            }
        })
        return resultHospitalUser;
    }

	/**
	 * service: 로그인 정보 인증
	 */
    async validateHospitalUser(hospitalUserData): Promise<any> {
        //유저 조회 
        let resultHospitalUser = await this.getHospitalUser(hospitalUserData.email); // DB에서 일치하는 userData 가져옴.
        if (!resultHospitalUser) {
            throw new Error('user id does not exist');
        }

        const IsPasswordValid = compareSync(hospitalUserData.hospitalUserPw, resultHospitalUser.hospitalUserPw);
        if (!IsPasswordValid) {
            throw new Error('inValid password');
        }

        return resultHospitalUser.toJSON();
    }

	/**
	 * service: 유저 정보 업데이트
	 */
    async updateHospitalUser(hospitalUserIndex: number, hospitalUserData: any): Promise<any> {
        if (hospitalUserData.hospitalUserPw) {
            const hashedPassword = hashSync(hospitalUserData.hospitalUserPw, 8);
            hospitalUserData.hospitalUserPw = hashedPassword;
        }
        const result = await HospitalUser.update(hospitalUserData, {
            where: {
                hospitalUserIndex: hospitalUserIndex
            }
        });

        return result;
    }

	/**
	 * service: 유저 삭제
	 */
    async deleteHositalUser(hospitalUserIndex: number): Promise<any> {
        await HospitalUser.destroy({
            where: {
                hospitalUserIndex: hospitalUserIndex
            }
        })
    }
}

export const hospitalUserService = new HospitalUserService();

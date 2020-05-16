import HospitalUser from '../models/HospitalUser.model';
import { hashSync, compareSync } from 'bcryptjs';
import { Op } from 'sequelize';

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
    async getHospitalUser(hospitalData) {
        const email = hospitalData.email || null;
        const hpid = hospitalData.hpid || null;
        let resultHospitalUser = await HospitalUser.findOne({
            where: {
                [Op.or]: [{ email }, { hpid }]
            }
        })
        return resultHospitalUser;
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
	 * service: 로그인 정보 인증
	 */
    async validateHospitalUser(hospitalUserData) {
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

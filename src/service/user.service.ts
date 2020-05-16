import User from '../models/User.model';
import { hashSync, compareSync } from 'bcryptjs';
import { Op } from 'sequelize';

interface IUpdateUser {
	userPw?: string;
	userNickName?: string;
	tel?: string;
}

class UserService {
	constructor() {
	}

	/**
	 * service: 유저 생성
	 */
	async createUser(userData: any) {
		const hashedPassword = hashSync(userData.userPw, 8);
		userData.userPw = hashedPassword;

		let resultUser = await User.create(userData);
		return resultUser.toJSON();
	}

	/**
	 * service: 유저 조회
	 */
	async getUser(userData: any) {
		const { email, userNickName } = userData;
		let resultUser: User = await User.findOne({
			where: {
				[Op.or]: [{ email }, { userNickName }]
			}
		})
		return resultUser;
	}

	/**
	 * service: 유저 아이디 조회
	 * @param userData 
	 */
	async getUserByEmail(email: string){
		let resultUser: User = await User.findOne({
			where: {
				email: email
			}
		})
		return resultUser;
	}

	/**
	 * service: 유저 닉네임 조회
	 * @param userData 
	 */
	async getUserByUserNickName(userNickName: string){
		let resultUser: User = await User.findOne({
			where: {
				userNickName: userNickName
			}
		})
		return resultUser;
	}

	/**
	 * service: 로그인 정보 인증
	 */
	async validateUser(userData: any) {
		//유저 조회 
		let resultUser = await this.getUser(userData.email); // DB에서 일치하는 userData 가져옴.
		if (!resultUser) {
			throw new Error('user id does not exist');
		}

		const IsPasswordValid = compareSync(userData.userPw, resultUser.userPw);
		if (!IsPasswordValid) {
			throw new Error('inValid password');
		}

		return resultUser.toJSON();
	}

	/**
	 * service: 유저 정보 업데이트
	 */
	async updateUser(userIndex: number, userData: IUpdateUser) {
		if (userData.userPw) { // 비밀번호 수정
			const hashedPassword = hashSync(userData.userPw, 8);
			userData.userPw = hashedPassword;
		}
		if (userData.userNickName) { // 닉네임 중복 검사
			const result = await User.findOne({
				where: {
					userNickName: userData.userNickName
				}
			});

			if (result) {
				return '중복된 닉네임입니다.'
			}
		}

		const updateResult = await User.update(userData, {
			where: {
				userIndex: userIndex
			}
		});

		if (updateResult[0] === 1) {
			return '변경 완료';
		}
	}

	/**
	 * service: 유저 삭제
	 */
	async deleteUser(userIndex: number) {
		await User.destroy({
			where: {
				userIndex: userIndex
			}
		})
	}
}

export const userService = new UserService();

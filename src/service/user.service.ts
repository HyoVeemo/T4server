import User from '../models/User.model';
import { hashSync, compareSync } from 'bcryptjs';
import { Op } from 'sequelize';

interface IUpdateUser {
	userPw?: string;
	userNickName?: string;
	tel?: string;
}

interface IGetUser {
	email?: string;
	userNickName?: string;
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
	async getUser(userData: IGetUser) {
		const email = userData.email || null;
		const userNickName = userData.userNickName || null;
		let resultUser: User = await User.findOne({
			where: {
				[Op.or]: [{ email }, { userNickName }]
			}
		})
		return resultUser;
	}

	async getUserByEmail(email: string) {
		let resultUser: User = await User.findOne({
			where: {
				email
			}
		})
		return resultUser;
	}

	async getUserByUserNickName(userNickName: string):Promise<any> {
		let resultUser: User = await User.findOne({
			where: {
				userNickName
			}
		})
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

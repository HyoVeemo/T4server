import User from '../models/User.model';
import { hashSync, compareSync } from 'bcryptjs';
import { Op } from 'sequelize';

export class UserService {
	constructor() {
	}

	/**
	 * service: 유저 생성
	 */
	async createUser(userData: any): Promise<any> {
		const hashedPassword = hashSync(userData.userPw, 8);
		userData.userPw = hashedPassword;

		let resultUser = await User.create(userData);
		return resultUser.toJSON();
	}

	/**
	 * service: 유저 조회
	 */
	async getUser(userArg: string): Promise<User> {
		let resultUser: User = await User.findOne({
			where: {
				[Op.or]: [{ email: userArg }, { userNickName: userArg }]
			}
		})
		return resultUser;
	}

	/**
	 * service: 로그인 정보 인증
	 */
	async validateUser(userData: any): Promise<any> {
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
	async updateUser(userIndex: number, userData: any): Promise<any> {
		if (userData.userPw) {
			const hashedPassword = hashSync(userData.userPw, 8);
			userData.userPw = hashedPassword;
		}
		const result = await User.update(userData, {
			where: {
				userIndex: userIndex
			}
		});

		return result;
	}

	/**
	 * service: 유저 삭제
	 */
	async deleteUser(userIndex: number): Promise<any> {
		await User.destroy({
			where: {
				userIndex: userIndex
			}
		})
	}
}

export const userService: UserService = new UserService();

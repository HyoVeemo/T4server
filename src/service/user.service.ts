import User from '../models/User.model';
import Review from '../models/Review.model';
import Reservation from '../models/Reservation.model';
import { hashSync, compareSync } from 'bcryptjs';

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

	async getUserByEmail(email: string) {
		let resultUser: User = await User.findOne({
			where: {
				email
			}
		})
		return resultUser;
	}

	async getUserBySNSId(snsId: string) {
		const resultUser: User = await User.findOne({
			where: {
				snsId
			}
		})
		return resultUser;
	}

	async getUserByUserNickName(userNickName: string) {
		let resultUser: User = await User.findOne({
			where: {
				userNickName
			}
		})
		return resultUser;
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
	async deleteUser(userIndex: number, userInputPw: string) {
		const resultUser = await User.findOne({ where: { userIndex } });

		if (resultUser.provider === 'local') {
			const IsPasswordValid = compareSync(userInputPw, resultUser.userPw);

			if (IsPasswordValid) {
				await User.destroy({
					where: {
						userIndex
					}
				});

				return {
					success: true,
					message: 'closeAccount: 200 - 로컬 사용자 탈퇴 완료.'
				};
			}

			return {
				success: false,
				message: 'closeAccount: 401 - 비밀번호가 틀렸습니다.'
			};
		}

		// 카카오 사용자는 비밀번호 인증 없이 즉각 탈퇴
		await User.destroy({
			where: {
				userIndex
			}
		});

		return {
			success: true,
			message: 'closeAccount: 200 - 카카오 사용자 탈퇴 완료.'
		};


	}
}

export const userService = new UserService();

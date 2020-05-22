import User from '../models/User.model';
import { userService } from '../service/user.service';
import * as jwt from 'jsonwebtoken';

interface IUpdateUser {
    userName: string;
    userNickName: string;
    age: number;
    gender: string;
    tel: string;
}

class KaKaoUserService {
    constructor() { }

    async signUp(req) {
        const { snsId, provider } = req.body;
        //데이터 없음
        if (snsId === undefined || provider === undefined) {
            throw new Error('No UserData Input');
        }

        // 유저 조회 
        const exSNSId = await userService.getUserBySNSId(snsId);

        if (exSNSId) {
            return 'exSNSId exists';
        } else {
            const resultUser = await User.create({ snsId, provider });

            const token = jwt.sign({
                userIndex: resultUser['dataValues']['userIndex'],
                snsId,
                provider
            }, req.app.locals.secret);

            return token;
        }
    }

    async updateKakaoUser(userData: IUpdateUser, userIndex) {
        const updateResult = await User.update(userData, {
            where: {
                userIndex
            }
        });

        if (updateResult[0] === 1) {
            return '변경 완료';
        } else {
            return '변화 없음';
        }
    }
}

export const kakaoUserService = new KaKaoUserService();
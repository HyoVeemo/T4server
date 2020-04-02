
import * as jwt from 'jsonwebtoken';
import { userService } from "../service/user.service";
import { hashSync, compareSync } from 'bcryptjs';
import { jwtToken } from '../utils/jwt.util';
import User from '../models/User.model';

interface ICreateUserData { // 회원가입용
    userId: string;
    userPw: string;
    userName: string;
    userNickName: string;
    age?: number;
    gender?: string;
    tel: string;
    email: string;
    avatar?: string;
}

interface ILoginData { // 로그인용
    userId: string;
    userPw: string;
}

export class AuthService {
    constructor() { }

    /**
     * service: 회원가입
     * @param userData 
     */
    async signUp(userData: ICreateUserData): Promise<any> {
        //아이디 중복 검사
        const result = await userService.getUser(userData.userId);
        if (result) return { error: true, status: 409, message: 'Duplicated Id' };

        const createAccount = await userService.createUser(userData);
        return createAccount;
    }

    /**
     * service: 로그인
     * @param userData 
     */
    async signIn(userData: ILoginData): Promise<any> {
        console.log('userData: ', userData);
        //데이터 없음
        if (userData.userId === undefined || userData.userPw === undefined) {
            throw new Error('No UserData Input');
        }
        //유저 조회 
        let resultUser = await userService.getUser(userData.userId);
        console.log('resultUser: ', resultUser)

        //일치하는 유저 없음
        if (!resultUser) {
            throw new Error('user id does not exist');
        }

        //비밀번호 틀림
        const IsPasswordValid = compareSync(userData.userPw, resultUser.userPw);
        if (!IsPasswordValid) {
            throw new Error('inValid password');
        }

        resultUser = resultUser.toJSON() as User;

        if (resultUser) {

            // Token 생성. 
            const token = jwt.sign({
                tokenIndex: resultUser.userIndex,
                tokenId: resultUser.userId,
                tokenName: resultUser.userName,
                tokenNickName: resultUser.userNickName,
                tokenAvartar: resultUser.avartar,
                tokenAge: resultUser.age,
                tokenGender: resultUser.gender,
                tokenTel: resultUser.tel,
                tokenEmail: resultUser.email
            }, jwtToken.secret);
            console.log('token', token);
            // 로그인한 사용자에게 token 제공. User 인증이 필요한 API 요청 시(글쓰기, 마이페이지 등) Request header에 토큰을 넣어 보낸다
            return { token };
        }
        // console.log('userData: ', userData);
        // //데이터 없음
        // if (userData.userId === undefined || userData.userPw === undefined) {
        //     throw new Error('No UserData Input');
        // }
        // //유저 조회 
        // let resultUser = await userService.getUser(userData.userId);

        // //일치하는 유저 없음
        // if (!resultUser) {
        //     throw new Error('user id does not exist');
        // }

        // //비밀번호 틀림
        // const IsPasswordValid = compareSync(userData.userPw, resultUser.userPw);
        // if (!IsPasswordValid) {
        //     throw new Error('inValid password');
        // }

        // resultUser = resultUser.toJSON() as User;

        // if (resultUser) {

        //     // Token 생성. 
        //     const token = jwt.sign({
        //         tokenIndex: resultUser.userIndex,
        //         tokenId: resultUser.userId,
        //         tokenName: resultUser.userName,
        //         tokenNickName: resultUser.userNickName,
        //         tokenAvartar: resultUser.avartar,
        //         tokenAge: resultUser.age,
        //         tokenGender: resultUser.gender,
        //         tokenTel: resultUser.tel,
        //         tokenEmail: resultUser.email
        //     }, jwtToken.secret);

        //     // 로그인한 사용자에게 token 제공. User 인증이 필요한 API 요청 시(글쓰기, 마이페이지 등) Request header에 토큰을 넣어 보낸다
        //     return { token };
        // }
    }
}

export const authService: AuthService = new AuthService();

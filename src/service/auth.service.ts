
import * as jwt from 'jsonwebtoken';
import { userService } from "../service/user.service";
import { hospitalUserService } from "../service/hospitalUser.service";
import { hashSync, compareSync } from 'bcryptjs';
import User from '../models/User.model';
import HospitalUser from '../models/HospitalUser.model';

interface ICreateUserData { // 사용자 회원가입용
    email: string;
    userPw: string;
    role: string;
    userName: string;
    userNickName: string;
    age?: number;
    gender?: string;
    tel: string;
    avatar?: string;
}

interface ILoginData { // 사용자 로그인용
    email: string;
    userPw: string;
}

interface ICreateHospitalUserData { // 병원 회원가입용
    hpid: string;
    email: string;
    hospitalUserPw: string;
    tel: string;
}

interface ILoginHospitalUserData { // 병원 로그인용
    email: string;
    hospitalUserPw: string;
}

export class AuthService {
    constructor() { }

    /**
     * service: 회원가입
     * @param hospitalUserData 
     */
    async hospitalSignUp(hospitalUserData: ICreateHospitalUserData): Promise<any> {
        //아이디 중복 검사
        const result = await hospitalUserService.getHospitalUser(hospitalUserData.email);
        if (result) return { error: true, status: 409, message: 'Duplicated Id' };

        const createAccount = await hospitalUserService.createHospitalUser(hospitalUserData);
        return createAccount;
    }

    /**
    * service: 로그인
    * @param userData 
    */
    async hospitalSignIn(req): Promise<any> {
        let hospitalUserData: ILoginHospitalUserData = req.body;
        //데이터 없음
        if (hospitalUserData.email === undefined || hospitalUserData.hospitalUserPw === undefined) {
            throw new Error('No UserData Input');
        }
        //유저 조회 
        let resultHospitalUser = await hospitalUserService.getHospitalUser(hospitalUserData.email);

        //일치하는 유저 없음
        if (!resultHospitalUser) {
            throw new Error('user id does not exist');
        }

        //비밀번호 틀림
        const IsPasswordValid = compareSync(hospitalUserData.hospitalUserPw, resultHospitalUser.hospitalUserPw);
        if (!IsPasswordValid) {
            throw new Error('inValid password');
        }

        resultHospitalUser = resultHospitalUser.toJSON() as HospitalUser;
        if (resultHospitalUser) {
            // Token 생성. 
            const token = jwt.sign({
                tokenIndex: resultHospitalUser.hospitalUserIndex,
                tokenHpid: resultHospitalUser.hpid,
                tokenEmail: resultHospitalUser.email,
                tokenTel: resultHospitalUser.tel
            }, req.app.locals.secret);
            delete resultHospitalUser.hospitalUserPw;
            // 로그인한 사용자에게 token 제공. User 인증이 필요한 API 요청 시(글쓰기, 마이페이지 등) Request header에 토큰을 넣어 보낸다
            return {
                ...resultHospitalUser,
                token
            };
        }
    }


    /**
     * service: 회원가입
     * @param userData 
     */
    async userSignUp(userData: ICreateUserData): Promise<any> {
        //아이디 중복 검사
        const result = await userService.getUser(userData.email);
        if (result) return { error: true, status: 409, message: 'Duplicated Id' };

        const createAccount = await userService.createUser(userData);
        return createAccount;
    }

    /**
     * service: 로그인
     * @param userData 
     */
    async userSignIn(req): Promise<any> {
        let userData: ILoginData = req.body;
        //데이터 없음
        if (userData.email === undefined || userData.userPw === undefined) {
            throw new Error('No UserData Input');
        }
        //유저 조회 
        let resultUser = await userService.getUser(userData.email);

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
                tokenEmail: resultUser.email,
                tokenName: resultUser.userName,
                tokenNickName: resultUser.userNickName,
                tokenAvartar: resultUser.avartar,
                tokenAge: resultUser.age,
                tokenGender: resultUser.gender,
                tokenTel: resultUser.tel
            }, req.app.locals.secret);
            delete resultUser.userPw;
            // 로그인한 사용자에게 token 제공. User 인증이 필요한 API 요청 시(글쓰기, 마이페이지 등) Request header에 토큰을 넣어 보낸다
            return {
                ...resultUser,
                token
            };
        }
    }
}

export const authService: AuthService = new AuthService();

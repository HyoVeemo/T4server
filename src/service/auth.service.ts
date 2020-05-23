
import * as jwt from 'jsonwebtoken';
import { userService } from "../service/user.service";
import { hospitalUserService } from "../service/hospitalUser.service";
import { compareSync } from 'bcryptjs';
import User from '../models/User.model';
import HospitalUser from '../models/HospitalUser.model';
import nodemailer from 'nodemailer';
import randomBytes from 'randombytes';

interface ICreateUserData { // 사용자 회원가입용
    email: string;
    userPw: string;
    role: string;
    userName: string;
    userNickName: string;
    age?: number;
    gender?: string;
    tel: string;
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

class AuthService {
    constructor() { }

    async isDuplicated(userData, role) {
        let resultUser;
        let resultUserByNickName;
        let resultUserByHpid;
        if (role === 'user') { // 로컬 사용자 가입일 때
            if (userData.email !== null) { // 이메일 중복 검사
                resultUser = await userService.getUserByEmail(userData.email);
            } else if (userData.userNickName !== null) { // 닉네임 중복 검사
                resultUserByNickName = await userService.getUserByUserNickName(userData.userNickName);
            }

            if (resultUserByNickName)
                return { error: true, message: 'Duplicated NickName' };
        } else if (role === 'hospital') {
            // 병원 관리자 가입일 때
            resultUser = await hospitalUserService.getHospitalUserByEmail(userData.email);
            resultUserByHpid = await hospitalUserService.getHospitalUserByHpid(userData.hpid);
            if (resultUserByHpid)
                return { error: true, message: 'Duplicated hpid' };
        }
        if (resultUser) {
            return { error: true, message: 'Duplicated Email' };
        }

        return { error: false, message: 'No Duplicated' };

    }

    async sendMail(receiverEmail: string, keyForVerify: string, host: string, senderEmail: string, senderPw: string) {
        // 기본 SMTP transport를 사용하는 재사용가능한 transporter 객체를 생성
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: "smtp.gmail.com",
            auth: {
                user: senderEmail,
                pass: senderPw
            }
        });
        // 옵션
        let url = `http://${host}/verifyEmail?key=${encodeURIComponent(keyForVerify)}&email=${receiverEmail}`;
        let mailOpt = {
            from: "leemagnon@gmail.com",
            to: receiverEmail,
            subject: "가입 인증을 진행해주세요.",
            html: `<b>뽀듬 서비스를 이용해 주셔서 감사합니다.</b><br> 
            <b>아래 링크를 클릭하시면 가입 인증이 이루어집니다.</b><br>
            <b>이메일 인증이 완료되면 정상적으로 서비스 이용이 가능합니다.</b><br> 
            <br>
            <a href=${url}>${url}</a>`
        };
        // 메일 전송
        await transporter.sendMail(mailOpt, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Email has been sent.');
            }
        });
        transporter.close();
    }

    async updateEmailVerify(data) {
        const change = {
            emailVerified: true
        };
        const option = {
            where: {
                email: data.email,
                keyForVerify: data.key
            }
        };

        const result = await User.update(change, option);

        if (result[0] === 1) {
            return '인증 완료';
        } else {
            return '인증 실패';
        }
    }

    /**
     * service: 회원가입
     * @param userData 
     * @param host 
     */
    async userSignUp(req) {
        const userData: ICreateUserData = req.body;
        const host = req.get('host');
        const senderEmail = req.app.locals.senderEmail;
        const senderPw = req.app.locals.senderPw;

        // 인증 코드 생성
        const hxKey = randomBytes(256).toString('hex').substr(100, 5);
        const baseKey = randomBytes(256).toString('base64').substr(50, 5);
        let keyForVerify = hxKey + baseKey;
        await userService.createUser({
            ...userData,
            keyForVerify
        });

        await this.sendMail(userData.email, keyForVerify, host, senderEmail, senderPw);
        return userData;
    }

    /**
     * service: 로그인
     * @param userData 
     */
    async userSignIn(req) {
        let userData: ILoginData = req.body;
        //데이터 없음
        if (userData.email === undefined || userData.userPw === undefined) {
            throw new Error('No UserData Input');
        }
        //유저 조회 
        let resultUser = await userService.getUserByEmail(userData.email);

        //일치하는 유저 없음
        if (!resultUser) {
            throw new Error('user id does not exist');
        }

        //비밀번호 틀림
        const IsPasswordValid = compareSync(userData.userPw, resultUser.userPw);
        if (!IsPasswordValid) {
            throw new Error('inValid password');
        }

        if (resultUser.emailVerified !== true) {
            return `${resultUser.email}로 수신된 가입 인증 메일을 확인해주세요`;
        }

        resultUser = resultUser.toJSON() as User;

        if (resultUser) {
            const token = jwt.sign({
                userIndex: resultUser.userIndex,
                email: resultUser.email
            }, req.app.locals.secret);

            delete resultUser.userPw;

            return {
                ...resultUser,
                token
            };
        }
    }

    /**
     * service: 회원가입
     * @param hospitalUserData 
     */
    async hospitalSignUp(hospitalUserData: ICreateHospitalUserData) {
        const createAccount = await hospitalUserService.createHospitalUser(hospitalUserData);
        return createAccount;
    }

    /**
    * service: 로그인
    * @param userData 
    */
    async hospitalSignIn(req) {
        let hospitalUserData: ILoginHospitalUserData = req.body;
        //데이터 없음
        if (hospitalUserData.email === undefined || hospitalUserData.hospitalUserPw === undefined) {
            throw new Error('No UserData Input');
        }
        //유저 조회 
        let resultHospitalUser = await hospitalUserService.getHospitalUserByEmail(hospitalUserData.email);

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
                hpid: resultHospitalUser.hpid,
                email: resultHospitalUser.email
            }, req.app.locals.secret);
            delete resultHospitalUser.hospitalUserPw;
            // 로그인한 사용자에게 token 제공. User 인증이 필요한 API 요청 시(글쓰기, 마이페이지 등) Request header에 토큰을 넣어 보낸다
            return {
                ...resultHospitalUser,
                token
            };
        }
    }
}

export const authService = new AuthService();

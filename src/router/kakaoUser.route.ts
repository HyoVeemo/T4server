import * as express from "express";
import { auth } from '../utils/auth.util';
import { kakaoUserService } from '../service/kakaoUser.service';

class KakaoUserRoute {
    /**
     * express에 정의된 라우터 생성
     */
    public kakaoUserRouter: express.Router = express.Router();
    constructor() {
        this.kakaoUserRouter.post('/kakao/signUp', kakaoUserSignUp);
    }
}

async function kakaoUserSignUp(req: express.Request, res: express.Response) {
    try {
        const token = await kakaoUserService.signUp(req);

        res.status(200).json({
            success: true,
            token,
            message: 'kakaoUserSignUp succeeded'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'kakaoUserSignUp failed'
        });
    }
}

export const kakaoUserRoute = new KakaoUserRoute();
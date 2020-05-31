import * as express from "express";
import { auth } from '../utils/auth.util';
import { verifyUser } from '../middleware/auth.middleware';
import { kakaoUserService } from '../service/kakaoUser.service';

class KakaoUserRoute {
    /**
     * express에 정의된 라우터 생성
     */
    public kakaoUserRouter: express.Router = express.Router();
    constructor() {
        this.kakaoUserRouter.post('/kakao/signIn', kakaoUserSignIn);
        this.kakaoUserRouter.patch('/kakao/user', verifyUser, updateKakaoUser);
    }
}

async function kakaoUserSignIn(req: express.Request, res: express.Response) {
    try {
        const token = await kakaoUserService.signIn(req);

        res.status(200).json({
            success: true,
            token,
            message: 'kakaoUserSignIn succeeded'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'kakaoUserSignIn failed'
        });
    }
}

async function updateKakaoUser(req: express.Request, res: express.Response) {
    try {
        const { userIndex } = auth(req);
        const result = await kakaoUserService.updateKakaoUser(req.body, userIndex);

        res.status(200).json({
            success: true,
            result,
            message: 'addAdditionalUserInfo succeeded'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'addAdditionalUserInfo failed'
        });
    }
}

export const kakaoUserRoute = new KakaoUserRoute();
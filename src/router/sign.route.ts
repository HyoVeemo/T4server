import * as express from "express";
import { authService } from "../service/auth.service";
import { userService } from "../service/user.service";
import { auth } from '../utils/auth.util';
import sendMessage from '../utils/sms.util';
import { verifyUser } from '../middleware/auth.middleware';

interface IUpdateUser {
  userPw?: string;
  userNickName?: string;
  tel?: string;
}

/**
 *  sign 라우트 클래스 생성 (계정 관련)
 */
class SignRoute {
  /**
   * express에 정의된 라우터 생성
   */
  public signRouter: express.Router = express.Router();
  constructor() {
    //정의된 라우터 REST API 정의
    this.signRouter.post('/checkDuplicated', checkDuplicated);
    this.signRouter.post('/sendSMS', sendSMS);
    this.signRouter.post('/verifyPhoneNumber', verifyPhoneNumber);
    this.signRouter.get('/verifyEmail', verifyEmail);
    this.signRouter.post("/user/signUp", userSignUp);
    this.signRouter.post("/user/signIn", userSignIn);
    this.signRouter.patch("/user", updateUser);
    this.signRouter.post("/user/closeAccount", verifyUser, closeAccount); // 회원 탈퇴
    this.signRouter.post("/hospital/signUp", hospitalSignUp);
    this.signRouter.post("/hospital/signIn", hospitalSignIn);
  }
}

let tempAuthObj = {};

async function sendSMS(req: express.Request, res: express.Response) {
  try {
    const authenticationNumber = await sendMessage(req.body.tel);
    tempAuthObj[req.body.tel] = authenticationNumber;
    res.status(200).json({
      success: true,
      message: 'sendSMS succeeded'
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: 'sendSMS failed'
    });
  }
}

async function verifyPhoneNumber(req: express.Request, res: express.Response) {
  try {
    const { tel, userInputNumber } = req.body;

    if (tel !== undefined && userInputNumber !== undefined) {
      if (tempAuthObj[tel] === userInputNumber) {
        delete tempAuthObj[req.body.tel];
        res.status(200).json({
          success: true,
          message: 'verifyPhoneNumber Succeeded'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'sendSMS failed'
        });
      }
    } else {
      if (tel === undefined || tel === '') {
        res.status(400).json('변경할 휴대폰 번호를 입력해주세요');
      } else if (userInputNumber === undefined) {
        res.status(400).json('인증번호를 입력해주세요');
      } else {
        res.status(400).json('변경할 휴대폰 번호를 입력해주세요');
      }
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: 'sendSMS failed'
    });
  }

}

async function verifyEmail(req: express.Request, res: express.Response) {
  try {
    const result = await authService.updateEmailVerify(req.query);
    res.send({
      success: true,
      result,
      message: 'verifyEmail: 200'
    });
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      message: 'verifyEmail failed'
    });
  }
}

async function checkDuplicated(req: express.Request, res: express.Response) {

  const role: "user" | "hospital" = req.body.role;
  const userData = {
    email: req.body.email || null,
    userNickName: req.body.userNickName || null,
    hpid: req.body.hpid || null
  }
  try {
    const result = await authService.isDuplicated(userData, role);

    res.status(200).json({
      success: true,
      result,
      message: 'checkDuplicated Succeeded'
    });
  } catch (err) {
    res.json({
      success: false,
      message: 'checkDuplicated failed'
    });
  }
}

async function userSignUp(req: express.Request, res: express.Response) {
  try {
    const result = await authService.userSignUp(req);
    res.send({
      success: true,
      result,
      message: 'getUser: 200'
    });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      statusCode: 500,
      message: 'createUser: 500'
    });
  }
}

async function userSignIn(req, res) {
  try {
    const result = await authService.userSignIn(req);

    res.send({
      success: true,
      result,
      message: 'getUser: 200'
    });
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      statusCode: 500,
      message: 'getUser: 500'
    })
  }
}

async function updateUser(req: express.Request, res: express.Response) {
  const { userIndex } = auth(req);
  const updateData: IUpdateUser = {
    userPw: req.body.userPw,
    userNickName: req.body.userNickName,
    tel: req.body.tel
  };
  try {
    const result = await userService.updateUser(userIndex, updateData);
    res.send({
      success: true,
      result,
      message: 'updateUserInfo: 200'
    });
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      message: 'updateUserInfo: 500'
    });
  }
}

async function closeAccount(req: express.Request, res: express.Response) {
  try {
    const { userIndex } = auth(req);
    const { userInputPw } = req.body;
    const result = await userService.deleteUser(userIndex, userInputPw);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.send({
      success: true,
      message: 'closeAccount: 500'
    });
  }
}

async function hospitalSignUp(req, res) {
  try {
    const result = await authService.hospitalSignUp(req.body);
    res.send({
      success: true,
      result,
      message: 'getHospitalUser: 200'
    });
  } catch (err) {
    res.send({
      success: false,
      statusCode: 500,
      result: err,
      message: 'createHospitalUser: 500'
    });
  }
}

async function hospitalSignIn(req, res) {
  try {
    const result = await authService.hospitalSignIn(req);

    res.send({
      success: true,
      result: result,
      message: 'getHospitalUser: 200'
    });
  } catch (err) {
    res.send({
      success: false,
      statusCode: 500,
      message: 'getHospitalUser: 500'
    })
  }
}

export const signRoute = new SignRoute();

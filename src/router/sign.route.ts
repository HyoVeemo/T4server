import * as express from "express";
import { authService } from "../service/auth.service";
import { userService } from "../service/user.service";
import { auth } from '../utils/auth.util';

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
    this.signRouter.get('/verifyEmail', verifyEmail);
    this.signRouter.post("/user/signUp", userSignUp);
    this.signRouter.post("/user/signIn", userSignIn);
    this.signRouter.patch("/user", updateUserInfo); // 회원 정보 수정
    this.signRouter.post("/hospital/signUp", hospitalSignUp)
    this.signRouter.post("/hospital/signIn", hospitalSignIn);
  }
}

async function checkDuplicated(req: express.Request, res: express.Response) {
  /**
   * hpid -> 중복된 병원인지 체크, who -> user? or hospital?
   */
  const email: string = req.body.email || null; // null -> WHERE parameter "변수명" has invalid "undefined" value 방지하기 위함.
  const userNickName: string = req.body.userNickName || null
  const hpid: string = req.body.hpid || null;
  const who: "user" | "hospital" = req.body.who;
  const wannaCheck = {
    email,
    userNickName,
    hpid
  };
  try {
    const result = await authService.isDuplicated(wannaCheck, who);

    res.status(200).json({
      success: true,
      result,
      message: 'checkDuplicated Succeeded'
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: 'checkDuplicated failed'
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

/**
 * route: 회원가입
 */
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

/**
 * route: 로그인
 */
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

async function updateUserInfo(req: express.Request, res: express.Response) {
  const { tokenIndex: userIndex } = auth(req);
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

/**
 * route: 회원가입
 */
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

/**
 * route: 로그인
 * @param req 
 * @param res 
 * @returns {Promise<void>}
 */
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

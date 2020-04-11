import * as express from "express";
import { authService } from "../service/auth.service"

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
    // .MATHOD("{path}", function )
    this.signRouter.post("/user/signUp", userSignUp);
    this.signRouter.post("/user/signIn", userSignIn);
    this.signRouter.post("/hospital/signUp", hospitalSignUp)
    this.signRouter.post("/hospital/signIn", hospitalSignIn);
  }
}

/**
 * route: 회원가입
 * @param req 
 * @param res 
 * @returns {Promise<any>}
 */
async function hospitalSignUp(req, res): Promise<any> {
  try {
    const result = await authService.hospitalSignUp(req.body);
    res.send({
      success: true,
      result: result,
      message: 'getHospitalUser: 200'
    });
  } catch (err) {
    console.log(err);
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
 * @returns {Promise<any>}
 */
async function hospitalSignIn(req, res): Promise<any> {
  try {
    const result = await authService.hospitalSignIn(req);

    res.send({
      success: true,
      result: result,
      message: 'getHospitalUser: 200'
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      statusCode: 500,
      message: 'getHospitalUser: 500'
    })
  }
}

/**
 * route: 회원가입
 * @param req 
 * @param res 
 * @returns {Promise<any>}
 */
async function userSignUp(req, res): Promise<any> {
  try {
    const result = await authService.userSignUp(req.body);
    res.send({
      success: true,
      result: result,
      message: 'getUser: 200'
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      statusCode: 500,
      result: err,
      message: 'createUser: 500'
    });
  }
}

/**
 * route: 로그인
 * @param req 
 * @param res 
 * @returns {Promise<any>}
 */
async function userSignIn(req, res): Promise<any> {
  try {
    const result = await authService.userSignIn(req);

    res.send({
      success: true,
      result: result,
      message: 'getUser: 200'
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      statusCode: 500,
      message: 'getUser: 500'
    })
  }
}

export const signRoute: SignRoute = new SignRoute();

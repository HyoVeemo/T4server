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
    this.signRouter.post("/signUp", signUp)
    this.signRouter.post("/signIn", signIn);
  }
}

/**
 * route: 회원가입
 * @param req 
 * @param res 
 * @returns {Promise<any>}
 */
async function signUp(req, res): Promise<any> {
  try {
    const result = await authService.signUp(req.body);
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
async function signIn(req, res): Promise<any> {
  try {
    const result = await authService.signIn(req);

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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_service_1 = require("../service/auth.service");
const user_service_1 = require("../service/user.service");
const auth_util_1 = require("../utils/auth.util");
/**
 *  sign 라우트 클래스 생성 (계정 관련)
 */
class SignRoute {
    constructor() {
        /**
         * express에 정의된 라우터 생성
         */
        this.signRouter = express.Router();
        //정의된 라우터 REST API 정의
        this.signRouter.get('/verifyEmail', verifyEmail);
        this.signRouter.post("/user/signUp", userSignUp);
        this.signRouter.post("/user/signIn", userSignIn);
        this.signRouter.patch("/user", updateUserInfo); // 회원 정보 수정
        this.signRouter.post("/hospital/signUp", hospitalSignUp);
        this.signRouter.post("/hospital/signIn", hospitalSignIn);
    }
}
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.updateEmailVerify(req.query);
            res.send({
                success: true,
                result,
                message: 'verifyEmail: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'verifyEmail: 500'
            });
        }
    });
}
/**
 * route: 회원가입
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
function userSignUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.userSignUp(req);
            res.send({
                success: true,
                result,
                message: 'getUser: 200'
            });
        }
        catch (error) {
            console.error(error);
            res.send({
                success: false,
                statusCode: 500,
                message: 'createUser: 500'
            });
        }
    });
}
/**
 * route: 로그인
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
function userSignIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.userSignIn(req);
            res.send({
                success: true,
                result,
                message: 'getUser: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'getUser: 500'
            });
        }
    });
}
function updateUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        const updateData = {
            userPw: req.body.userPw,
            userNickName: req.body.userNickName,
            tel: req.body.tel
        };
        try {
            const result = yield user_service_1.userService.updateUser(userIndex, updateData);
            res.send({
                success: true,
                result,
                message: 'updateUserInfo: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'updateUserInfo: 500'
            });
        }
    });
}
/**
 * route: 회원가입
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
function hospitalSignUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.hospitalSignUp(req.body);
            res.send({
                success: true,
                result: result,
                message: 'getHospitalUser: 200'
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                result: err,
                message: 'createHospitalUser: 500'
            });
        }
    });
}
/**
 * route: 로그인
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
function hospitalSignIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.hospitalSignIn(req);
            res.send({
                success: true,
                result: result,
                message: 'getHospitalUser: 200'
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'getHospitalUser: 500'
            });
        }
    });
}
exports.signRoute = new SignRoute();
//# sourceMappingURL=sign.route.js.map
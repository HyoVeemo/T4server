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
        // .MATHOD("{path}", function )
        this.signRouter.post("/signUp", signUp);
        this.signRouter.get("/signIn", signIn);
    }
}
/**
 * route: 회원가입
 * @param req
 * @param res
 * @returns {Promise<any>}
 */
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.signUp(req.body);
            res.send({
                success: true,
                result: result,
                message: 'getUser: 200'
            });
        }
        catch (err) {
            console.log(err);
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
 * @returns {Promise<any>}
 */
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.authService.signIn(req.body);
            res.send({
                success: true,
                result: result,
                message: 'getUser: 200'
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'getUser: 500'
            });
        }
    });
}
exports.signRoute = new SignRoute();
//# sourceMappingURL=sign.route.js.map
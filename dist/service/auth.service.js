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
const jwt = __importStar(require("jsonwebtoken"));
const user_service_1 = require("../service/user.service");
const bcryptjs_1 = require("bcryptjs");
const jwt_util_1 = require("../utils/jwt.util");
class AuthService {
    constructor() { }
    /**
     * service: 회원가입
     * @param userData
     */
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            //아이디 중복 검사
            const result = yield user_service_1.userService.getUser(userData.userId);
            if (result)
                return { error: true, status: 409, message: 'Duplicated Id' };
            const createAccount = yield user_service_1.userService.createUser(userData);
            return createAccount;
        });
    }
    /**
     * service: 로그인
     * @param userData
     */
    signIn(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            //데이터 없음
            if (userData.userId === undefined || userData.userPw === undefined) {
                throw new Error('No UserData Input');
            }
            //유저 조회 
            let resultUser = yield user_service_1.userService.getUser(userData.userId);
            console.log('resultUser: ', resultUser);
            //일치하는 유저 없음
            if (!resultUser) {
                throw new Error('user id does not exist');
            }
            //비밀번호 틀림
            const IsPasswordValid = bcryptjs_1.compareSync(userData.userPw, resultUser.userPw);
            if (!IsPasswordValid) {
                throw new Error('inValid password');
            }
            resultUser = resultUser.toJSON();
            if (resultUser) {
                // Token 생성. 
                const token = jwt.sign({
                    tokenIndex: resultUser.userIndex,
                    tokenId: resultUser.userId,
                    tokenName: resultUser.userName,
                    tokenNickName: resultUser.userNickName,
                    tokenAvartar: resultUser.avartar,
                    tokenAge: resultUser.age,
                    tokenGender: resultUser.gender,
                    tokenTel: resultUser.tel,
                    tokenEmail: resultUser.email
                }, jwt_util_1.jwtToken.secret);
                delete resultUser.userPw;
                // 로그인한 사용자에게 token 제공. User 인증이 필요한 API 요청 시(글쓰기, 마이페이지 등) Request header에 토큰을 넣어 보낸다
                return Object.assign(Object.assign({}, resultUser), { token });
            }
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map
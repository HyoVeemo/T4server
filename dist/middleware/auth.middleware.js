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
const jwt_util_1 = require("../utils/jwt.util");
/**
 * middleWare: header에서 token 을 받아 검증
 * @param req
 * @param res
 * @param next
 */
function verify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'verify: 403'
            });
        }
        try {
            yield verifyUser(token);
            return next();
        }
        catch (err) {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'verify:403'
            });
        }
    });
}
exports.verify = verify;
;
function verifyUser(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield jwt.verify(token, jwt_util_1.jwtToken.secret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                return resolve(decoded); // JWT의 payload가 decoded에 저장됨.
            });
        }));
    });
}
//# sourceMappingURL=auth.middleware.js.map
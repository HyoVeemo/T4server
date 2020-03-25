"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const jwt_util_1 = require("./jwt.util");
function auth(request) {
    const token = request.get('x-access-token');
    const secret = jwt_util_1.jwtToken.secret;
    let auth = jwt.verify(token, secret); // decoded
    return auth;
}
exports.auth = auth;
//# sourceMappingURL=auth.util.js.map
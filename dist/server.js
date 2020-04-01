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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const hospitalApi_util_1 = require("./utils/hospitalApi.util");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: 'ap-northeast-2' });
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = new aws_sdk_1.default.SharedIniFileCredentials();
            // ~/.aws/credentials 에 저장된 인증 정보 가져옴
            aws_sdk_1.default.config.credentials = credentials;
            const ssm = yield new aws_sdk_1.default.SSM();
            // Request
            // 정보를 얻고싶은 parameter 이름
            const params = {
                Name: 'config',
                WithDecryption: false
            };
            const data = yield ssm.getParameter(params).promise();
            const configInfo = JSON.parse(data.Parameter.Value);
            //console.log({ configInfo });
            const port = Number(configInfo.PORT);
            const app = new app_1.Server(configInfo).app;
            yield app.set("port", port);
            app
                .listen(app.get("port"), () => __awaiter(this, void 0, void 0, function* () {
                console.log("Server is running on", port);
            }))
                .on("error", err => {
                console.error(err);
            });
            hospitalApi_util_1.hospitalAPI();
        }
        catch (err) {
            console.error(err);
        }
    });
})();
//# sourceMappingURL=server.js.map
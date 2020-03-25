"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
/**
 * DB 연결 설정
 */
class Db {
    constructor({ DB_MIN, DB_PASSWORD, DB_HOST }) {
        this.sequelize = new sequelize_typescript_1.Sequelize({
            /**
             * host: aws ec2 endpoint
            */
            host: DB_HOST,
            database: DB_MIN,
            dialect: "mysql",
            username: "seo",
            password: DB_PASSWORD,
            storage: ":memory:",
            models: [__dirname + "/models"]
        });
    }
}
exports.default = Db;
//# sourceMappingURL=db.js.map
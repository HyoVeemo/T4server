"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class IndexRoute {
    constructor() {
        this.IndexRouter = express.Router();
        this.IndexRouter.get("/", auth_middleware_1.verify, (req, res, next) => {
            res.send({
                message: "index Page"
            });
        });
    }
}
exports.indexRoute = new IndexRoute();
//# sourceMappingURL=index.route.js.map
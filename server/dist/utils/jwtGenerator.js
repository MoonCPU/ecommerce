"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function jwtGenerator(user_id, user_name, user_email) {
    const payload = {
        user: {
            user_id,
            user_name,
            user_email
        }
    };
    return jsonwebtoken_1.default.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}
exports.default = jwtGenerator;
//# sourceMappingURL=jwtGenerator.js.map
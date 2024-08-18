"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jwtGenerator;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function jwtGenerator(payload) {
    return jsonwebtoken_1.default.sign({ user: payload }, process.env.JWT_SECRET, { expiresIn: "1h" });
}
//# sourceMappingURL=jwtGenerator.js.map
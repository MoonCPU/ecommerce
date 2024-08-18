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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../db");
const jwtGenerator_1 = __importDefault(require("../../utils/jwtGenerator"));
const validInfo_1 = __importDefault(require("../../middleware/validInfo"));
const router = express_1.default.Router();
// Registering a new user
router.post('/register', validInfo_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1 - destructure the req.body (name, email, password)
        const { name, email, password } = req.body;
        // 2 - check if user exists
        const user = yield db_1.pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (user.rows.length !== 0) {
            return res.status(401).send('User already exists');
        }
        // 3 - bcrypt the user password
        const saltRound = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRound);
        const bcryptPassword = yield bcrypt_1.default.hash(password, salt);
        // 4 - enter the new user inside the database
        const newUser = yield db_1.pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [name, email, bcryptPassword]);
        // 5 - generating jwt token
        const token = (0, jwtGenerator_1.default)({
            user_id: newUser.rows[0].user_id,
            user_name: newUser.rows[0].user_name,
            user_email: newUser.rows[0].user_email
        });
        res.json({ token });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}));
// Route for user login
router.post('/login', validInfo_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1 - destructure the req.body
        const { email, password } = req.body;
        // 2 - check if user doesn't exist
        const user = yield db_1.pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).send('User not found.');
        }
        // 3 - if user exists, check if the submitted password is the same as the password in the database
        const validPassword = yield bcrypt_1.default.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).send('Password is incorrect.');
        }
        // 4 - if passwords match, give them the jwt token
        const token = (0, jwtGenerator_1.default)({
            user_id: user.rows[0].user_id,
            user_name: user.rows[0].user_name,
            user_email: user.rows[0].user_email
        });
        res.json({ token });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Login Error');
    }
}));
exports.default = router;
//# sourceMappingURL=jwtAuth.js.map
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
const router = express_1.default.Router();
const db_1 = require("../db");
// Route to add a new address
router.post('/add_address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, cep, state, city, neighborhood, street, number, complement } = req.body;
        // Check if the user exists before adding the address
        const user = yield db_1.pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        // Insert the new address into the address table
        const newAddress = yield db_1.pool.query('INSERT INTO addresses (user_id, cep, state, city, neighborhood, street, number, complement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, cep, state, city, neighborhood, street, number, complement]);
        res.json(newAddress.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.get('/get_addresses/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        // Check if the user exists before fetching addresses
        const user = yield db_1.pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        // Fetch addresses by user_id
        const addresses = yield db_1.pool.query('SELECT * FROM address WHERE user_id = $1', [user_id]);
        res.json(addresses.rows);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
exports.default = router;
//# sourceMappingURL=address.js.map
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
const db_1 = require("../../db");
const router = express_1.default.Router();
router.get('/get_all_products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allProducts = yield db_1.pool.query('SELECT * FROM products');
        res.json(allProducts.rows);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.post('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_name, product_price } = req.body;
    try {
        const newProduct = yield db_1.pool.query('INSERT INTO products (product_name, product_price) VALUES ($1, $2) RETURNING *', [product_name, product_price]);
        res.json(newProduct.rows[0]);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error!');
    }
}));
exports.default = router;
//# sourceMappingURL=products.js.map
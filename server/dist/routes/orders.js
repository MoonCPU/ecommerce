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
router.post('/finish_purchase', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, product_id, quantity, product_size, total_price, address_id, purchase_date } = req.body;
        // Perform any necessary validation on the data
        // Insert the new order into the orders table
        const newOrder = yield db_1.pool.query('INSERT INTO orders (user_id, product_id, quantity, product_size, total_price, address_id, purchase_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_id, product_id, quantity, product_size, total_price, address_id, purchase_date]);
        res.json(newOrder.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.get('/get_orders/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        // Use JOIN operations to get information from multiple tables
        const ordersWithInfo = yield db_1.pool.query(`
            SELECT
                orders.order_id,
                orders.quantity,
                orders.product_size,
                orders.total_price,
                orders.purchase_date,
                addresses.cep,
                addresses.street,
                addresses.neighborhood,
                addresses.city,
                addresses.state,
                addresses.number,
                addresses.complement,
                users.user_name,
                products.product_name
            FROM orders 
            JOIN addresses ON orders.address_id = addresses.address_id
            JOIN users ON orders.user_id = users.user_id
            JOIN products ON orders.product_id = products.product_id
            WHERE orders.user_id = $1
        `, [user_id]);
        res.json(ordersWithInfo.rows);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.delete('/delete_order/:order_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.params;
        // Check if the order with the given order_id exists
        const orderItem = yield db_1.pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
        if (orderItem.rows.length === 0) {
            return res.status(404).send('Order item not found');
        }
        // Delete the order based on the order_id
        yield db_1.pool.query('DELETE FROM orders WHERE order_id = $1', [order_id]);
        res.json({ message: 'Order item deleted' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
exports.default = router;
//# sourceMappingURL=orders.js.map
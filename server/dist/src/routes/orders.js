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
const db_1 = require("../../db");
function calculateTotal(items) {
    return items.reduce((total, item) => total + item.quantity * item.total_price, 0);
}
router.post('/checkout/:cart_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cart_id } = req.params;
        // Retrieve cart items
        const cartItemsResult = yield db_1.pool.query('SELECT * FROM shopping_cart WHERE cart_id = $1', [cart_id]);
        const cartItems = cartItemsResult.rows;
        // Calculate total amount
        const totalAmount = calculateTotal(cartItems);
        // Create a new order
        const newOrderResult = yield db_1.pool.query('INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING order_id', [cartItems[0].user_id, totalAmount]);
        const newOrderId = newOrderResult.rows[0].order_id;
        // Create order items
        const orderItems = cartItems.map(item => ({
            order_id: newOrderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.total_price / item.quantity
        }));
        yield db_1.pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES $1', [orderItems]);
        // Delete the cart
        yield db_1.pool.query('DELETE FROM shopping_cart WHERE cart_id = $1', [cart_id]);
        res.json({ message: 'Checkout successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Checkout failed');
    }
}));
exports.default = router;
//# sourceMappingURL=orders.js.map
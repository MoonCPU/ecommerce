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
router.post('/add_to_cart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, product_id, quantity, size } = req.body;
        // check if the user and product exist before adding to the cart
        const user = yield db_1.pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        const product = yield db_1.pool.query('SELECT * FROM products WHERE product_id = $1', [product_id]);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        if (product.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        // get the product price
        const productPrice = product.rows[0].product_price;
        // check if the item with the same product ID and size already exists in the cart
        const existingCartItem = yield db_1.pool.query('SELECT * FROM shopping_cart WHERE user_id = $1 AND product_id = $2 AND product_size = $3', [user_id, product_id, size]);
        if (existingCartItem.rows.length > 0) {
            // If the item already exists, update its quantity and total_price
            const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
            const updatedTotalPrice = updatedQuantity * productPrice;
            yield db_1.pool.query('UPDATE shopping_cart SET quantity = $1, total_price = $2 WHERE cart_id = $3', [updatedQuantity, updatedTotalPrice, existingCartItem.rows[0].cart_id]);
            return res.json({ message: 'Item quantity updated in the cart' });
        }
        else {
            // If the item doesn't exist, insert a new item into the cart with total_price
            const total_price = quantity * productPrice;
            const newCartItem = yield db_1.pool.query('INSERT INTO shopping_cart (user_id, product_id, quantity, product_size, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, product_id, quantity, size, total_price]);
            return res.json(newCartItem.rows[0]);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.patch('/edit_cart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, cart_id, quantity, total_price } = req.body;
        // Check if the user and cart item exist before updating the cart
        const user = yield db_1.pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        const cartItem = yield db_1.pool.query('SELECT * FROM shopping_cart WHERE cart_id = $1', [cart_id]);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        if (cartItem.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        // Update the quantity and total_price of the cart item
        const updatedCartItem = yield db_1.pool.query('UPDATE shopping_cart SET quantity = $1, total_price = $2 WHERE user_id = $3 AND cart_id = $4 RETURNING *', [quantity, total_price, user_id, cart_id]);
        res.json(updatedCartItem.rows[0]); // Return the updated cart item
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.get('/get_cart/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const cartData = yield db_1.pool.query('SELECT shopping_cart.cart_id, shopping_cart.product_id, products.product_name, products.product_price, shopping_cart.quantity, shopping_cart.product_size, ' +
            '(products.product_price * shopping_cart.quantity) AS total_price, users.user_name ' +
            'FROM shopping_cart ' +
            'INNER JOIN products ON shopping_cart.product_id = products.product_id ' +
            'INNER JOIN users ON shopping_cart.user_id = users.user_id ' +
            'WHERE shopping_cart.user_id = $1', [user_id]);
        res.json(cartData.rows);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.delete('/delete_cart/:cart_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cart_id } = req.params;
        const cartItem = yield db_1.pool.query('SELECT * FROM shopping_cart WHERE cart_id = $1', [cart_id]);
        if (cartItem.rows.length === 0) {
            return res.status(404).send('Cart item not found');
        }
        yield db_1.pool.query('DELETE FROM shopping_cart WHERE cart_id = $1', [cart_id]);
        res.json({ message: 'Cart item deleted' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.post('/add_cart_address/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const { cep, street, neighborhood, city, state, number, complement, day } = req.body;
        // Update the user's shopping cart with the address details
        yield db_1.pool.query('UPDATE shopping_cart SET cep = $1, street = $2, neighborhood = $3, city = $4, state = $5, number = $6, complement = $7, day = $8 WHERE user_id = $9', [cep, street, neighborhood, city, state, number, complement, day, user_id]);
        res.json({ message: 'Address added to the user\'s cart successfully' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=cart.js.map
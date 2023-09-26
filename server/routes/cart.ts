import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { pool } from '../db';

router.post('/add_to_cart', async (req: Request, res: Response) => {
    try {
        const { user_id, product_id, quantity, size } = req.body;

        // Check if the user and product exist before adding to the cart
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        const product = await pool.query('SELECT * FROM products WHERE product_id = $1', [product_id]);

        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        if (product.rows.length === 0) {
            return res.status(404).send('Product not found');
        }

        // Check if the item with the same product ID and size already exists in the cart
        const existingCartItem = await pool.query(
            'SELECT * FROM shopping_cart WHERE user_id = $1 AND product_id = $2 AND product_size = $3',
            [user_id, product_id, size]
        );

        if (existingCartItem.rows.length > 0) {
            // If the item already exists, update its quantity
            const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
            await pool.query(
                'UPDATE shopping_cart SET quantity = $1 WHERE cart_id = $2',
                [updatedQuantity, existingCartItem.rows[0].cart_id]
            );

            return res.json({ message: 'Item quantity updated in the cart' });
        } else {
            // If the item doesn't exist, insert a new item into the cart
            const newCartItem = await pool.query(
                'INSERT INTO shopping_cart (user_id, product_id, quantity, product_size) VALUES ($1, $2, $3, $4) RETURNING *',
                [user_id, product_id, quantity, size]
            );

            return res.json(newCartItem.rows[0]);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.patch('/edit_cart', async (req: Request, res: Response) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        // Check if the user and product exist before updating the cart
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        const product = await pool.query('SELECT * FROM products WHERE product_id = $1', [product_id]);

        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        if (product.rows.length === 0) {
            return res.status(404).send('Product not found');
        }

        // Update the quantity of the cart item
        const updatedCartItem = await pool.query(
            'UPDATE shopping_cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
            [quantity, user_id, product_id]
        );

        res.json(updatedCartItem.rows[0]); // Return the updated cart item
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/get_cart/:user_id', async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        const cartData = await pool.query(
            'SELECT shopping_cart.cart_id, shopping_cart.product_id, products.product_name, products.product_price, shopping_cart.quantity, shopping_cart.product_size, ' +
            '(products.product_price * shopping_cart.quantity) AS total_price, users.user_name ' +
            'FROM shopping_cart ' +
            'INNER JOIN products ON shopping_cart.product_id = products.product_id ' +
            'INNER JOIN users ON shopping_cart.user_id = users.user_id ' +
            'WHERE shopping_cart.user_id = $1',
            [user_id]
        );

        res.json(cartData.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

export default router;
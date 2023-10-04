import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { pool } from '../db';

router.post('/finish_purchase', async (req: Request, res: Response) => {
    try {
        const { user_id, product_id, quantity, product_size, total_price, address_id, purchase_date } = req.body;

        // Perform any necessary validation on the data

        // Insert the new order into the orders table
        const newOrder = await pool.query(
            'INSERT INTO orders (user_id, product_id, quantity, product_size, total_price, address_id, purchase_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, product_id, quantity, product_size, total_price, address_id, purchase_date]
        );

        res.json(newOrder.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/get_orders/:user_id', async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        // Use JOIN operations to get information from multiple tables
        const ordersWithInfo = await pool.query(`
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
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/delete_order/:order_id', async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;

        // Check if the order with the given order_id exists
        const orderItem = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);

        if (orderItem.rows.length === 0) {
            return res.status(404).send('Order item not found');
        }

        // Delete the order based on the order_id
        await pool.query('DELETE FROM orders WHERE order_id = $1', [order_id]);

        res.json({ message: 'Order item deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

export default router;
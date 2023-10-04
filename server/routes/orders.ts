import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { pool } from '../db';

router.post('/finish_purchase', async (req: Request, res: Response) => {
    try {
        const { user_id, product_id, quantity, product_size, total_price, address_id } = req.body;

        // Perform any necessary validation on the data

        // Insert the new order into the orders table
        const newOrder = await pool.query(
            'INSERT INTO orders (user_id, product_id, quantity, product_size, total_price, address_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_id, product_id, quantity, product_size, total_price, address_id]
        );

        res.json(newOrder.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

export default router;
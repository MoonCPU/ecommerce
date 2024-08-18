import express, { Router, Request, Response } from "express";
import { pool } from '../db';

const router: Router = express.Router();

router.get('/get_all_products', async (req: Request, res: Response) => {
    try {
        const allProducts = await pool.query('SELECT * FROM products');
        res.json(allProducts.rows);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/new', async (req: Request, res: Response) => {
    const { product_name, product_price } = req.body;

    try {
        const newProduct = await pool.query(
            'INSERT INTO products (product_name, product_price) VALUES ($1, $2) RETURNING *',
            [product_name, product_price]
        );
        res.json(newProduct.rows[0]);
    } catch (err: any) {
        console.log(err.message);
        res.status(500).send('Server error!');
    }
});

export default router;
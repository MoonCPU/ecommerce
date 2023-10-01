import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { pool } from '../db';

// Route to add a new address
router.post('/add_address', async (req: Request, res: Response) => {
    try {
        const { user_id, cep, state, city, neighborhood, street, number, complement } = req.body;

        // Check if the user exists before adding the address
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        // Insert the new address into the address table
        const newAddress = await pool.query(
            'INSERT INTO address (user_id, cep, state, city, neighborhood, street, number, complement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [user_id, cep, state, city, neighborhood, street, number, complement]
        );

        res.json(newAddress.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/get_addresses/:user_id', async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        // Check if the user exists before fetching addresses
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        // Fetch addresses by user_id
        const addresses = await pool.query(
            'SELECT * FROM address WHERE user_id = $1',
            [user_id]
        );

        res.json(addresses.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


export default router;
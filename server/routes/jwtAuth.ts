import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from '../db';
const jwtGenerator = require('../utils/jwtGenerator')
const validInfo = require("../middleware/validInfo");
const router: Router = express.Router();

//registering a new user
router.post('/register', validInfo, async (req: Request, res: Response) => {
    try{
        // 1 - destructure the req.body (name, email, password)
        const {name, email, password} = req.body;        

        // 2 - check if user exists
        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
            email
        ]);

        if (user.rows.length !== 0){
            return res.status(401).send('User already exists');
        } 

        // 3 - bcrypt the user password 
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4 - enter the new user inside the database 
        const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [name, email, bcryptPassword])

        // 5 - generating jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({token});

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

//route for user login 
router.post('/login', validInfo, async (req, res) => {
    try{

        // 1 - destructure the req.body
        const {email, password} = req.body;

        // 2 - check if user doesn't exists 
        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
            email
        ]);

        if (user.rows.length === 0){
            return res.status(401).send('User not found.')
        }

        // 3 - if user exists, check if submitted password is the same as the password in the database
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            res.status(401).send('Password is incorrect.')
        } 

        //4 - if passwords match, give them the jwt token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token});

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send('Login Error')
    }
})


export default router;
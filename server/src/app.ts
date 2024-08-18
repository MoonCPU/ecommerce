import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwtAuthRouter from './routes/jwtAuth'; 
import productsRouter from './routes/products.js'; 
import cartRouter from './routes/cart.js'; 
import addressRouter from './routes/address.js'
import ordersRouter from './routes/orders.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.REACT_URL,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
}));

app.use("/auth", jwtAuthRouter); 
app.use('/products', productsRouter); 
app.use('/cart', cartRouter); 
app.use('/address', addressRouter); 
app.use('/orders', ordersRouter); 

app.listen(5000, () => {
    console.log(`The server is running on localhost port 5000`);
});
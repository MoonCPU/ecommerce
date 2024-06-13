import express from 'express';
import cors from 'cors';
import jwtAuthRouter from './routes/jwtAuth'; 
import productsRouter from './routes/products'; 
import cartRouter from './routes/cart'; 
import addressRouter from './routes/address'; 
import ordersRouter from './routes/orders'; 
require("dotenv").config();

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
    console.log(`the server is running on localhost port 5000`);
});


// psql --host=footshop.cj688cqw26vd.sa-east-1.rds.amazonaws.com --port=5432 --username=postgres --dbname=footshopDB

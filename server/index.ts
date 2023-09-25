import express, { Request, Response } from 'express';
import cors from 'cors';
import jwtAuthRouter from './routes/jwtAuth'; 
import productsRouter from './routes/products'; 
import cartRouter from './routes/cart'; 

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", jwtAuthRouter); 
app.use('/products', productsRouter); 
app.use('/cart', cartRouter); 

app.listen(5000, () => {
    console.log('the server is running on localhost port 5000');
});

import express, { Request, Response } from 'express';
import cors from 'cors';
import jwtAuthRouter from './routes/jwtAuth'; // Import jwtAuth router
import productsRouter from './routes/products'; // Import products router

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", jwtAuthRouter); // Use jwtAuth router
app.use('/products', productsRouter); // Use products router

app.listen(5000, () => {
    console.log('the server is running on localhost port 5000');
});

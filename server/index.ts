import express, {Request, Response} from 'express';
import cors from 'cors';
import jwtAuthRouter from './routes/jwtAuth'; 
import productsRouter from './routes/products'; 
import cartRouter from './routes/cart'; 
import addressRouter from './routes/address'; 
import ordersRouter from './routes/orders'; 

const PORT = process.env.PORT || 5000;

const app = express();

app.options('*', cors());

app.use(express.json());

app.use(cors({
    origin: 'https://ecommerce-kappa-umber.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use("/auth", jwtAuthRouter); 
app.use('/products', productsRouter); 
app.use('/cart', cartRouter); 
app.use('/address', addressRouter); 
app.use('/orders', ordersRouter); 

app.listen(PORT, () => {
    console.log(`the server is running on localhost port ${PORT}`);
});

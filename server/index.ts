import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors())

app.use("/authentification", require("./routes/jwtAuth"));

app.listen(5000, () => {
    console.log('the server is running on localhost port 5000')
})



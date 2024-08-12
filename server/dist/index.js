"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jwtAuth_1 = __importDefault(require("./routes/jwtAuth"));
const products_1 = __importDefault(require("./routes/products"));
const cart_1 = __importDefault(require("./routes/cart"));
const address_1 = __importDefault(require("./routes/address"));
const orders_1 = __importDefault(require("./routes/orders"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.REACT_URL,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
}));
app.use("/auth", jwtAuth_1.default);
app.use('/products', products_1.default);
app.use('/cart', cart_1.default);
app.use('/address', address_1.default);
app.use('/orders', orders_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world');
});
app.listen(5000, () => {
    console.log(`the server is running on localhost port 5000`);
});
//# sourceMappingURL=index.js.map
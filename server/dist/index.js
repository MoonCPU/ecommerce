"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwtAuth_js_1 = __importDefault(require("./routes/jwtAuth.js"));
const products_js_1 = __importDefault(require("./routes/products.js"));
const cart_js_1 = __importDefault(require("./routes/cart.js"));
const address_js_1 = __importDefault(require("./routes/address.js"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.REACT_URL,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
}));
app.use("/auth", jwtAuth_js_1.default);
app.use('/products', products_js_1.default);
app.use('/cart', cart_js_1.default);
app.use('/address', address_js_1.default);
app.use('/orders', orders_js_1.default);
app.listen(5000, () => {
    console.log(`The server is running on localhost port 5000`);
});
//# sourceMappingURL=index.js.map
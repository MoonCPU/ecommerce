import { Routes, Route, useLocation } from "react-router-dom";
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from "../pages/Register";
import Cart from "../pages/Cart";

const PageRoutes = () => {
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="cart" element={<Cart />} />
        </Routes>
    )
}

export default PageRoutes;
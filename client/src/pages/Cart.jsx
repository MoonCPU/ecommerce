import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthProvider';

import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';

function Cart() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCartData(user.user_id);
        }
    }, [user]);

    const fetchCartData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/cart/get_cart/${userId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // calculate total price of product
    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            const updatedCartItem = cartItems.find(item => item.product_id === productId);
            const newTotalPrice = updatedCartItem.product_price * newQuantity;
    
            await axios.patch('http://localhost:5000/cart/edit_cart', {
                user_id: user.user_id,
                product_id: productId,
                quantity: newQuantity,
                total_price: newTotalPrice
            });
    
            // Update the cart items individually without changing their order
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity: newQuantity, total_price: newTotalPrice }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl sm:max-w-3xl mx-auto">
            {cartItems.length > 0 ? (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.product_id} className='m-4 mb-6 text-left grid grid-cols-3 gap-3 sm:gap-8 sm:text-2xl sm:max-w-md sm:mx-auto drop-shadow-[0_5px_3px_rgb(0,0,0,0.4)] sm:px-5'>
                            <div className='p-3 box-border border-r-2 border-black'><img src={`/shoes/${item.product_id}.png`} alt={item.product_name} /></div>
                            <div className='flex flex-col gap-2 box-border pl-2'>
                                <div className='text-lg sm:text-2xl font-semibold'>
                                    {item.product_name}
                                </div>
                                <div className='font-bold text-orange-600'>
                                    {`R$${item.total_price}`}
                                </div>
                                <div>
                                    <select name="size" id="size" required className='border-2 border-black'>
                                        <option value="s">S</option>
                                        <option value="m">M</option>
                                        <option value="l">L</option>
                                        <option value="xl">XL</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-row justify-center items-center gap-3 text-xl'>
                                <GrFormPrevious size={32} className='cursor-pointer' onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)} />
                                <div>{item.quantity}</div>
                                <GrFormNext size={32} className='cursor-pointer' onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center text-2xl my-[15%]'>
                    <h1>Your cart is empty.</h1>
                </div>

            )}
        </div>
    );
}

export default Cart;

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
    const handleQuantityChange = async (cartId, newQuantity) => {
        try {
            const updatedCartItem = cartItems.find(item => item.cart_id === cartId);
            const newTotalPrice = updatedCartItem.product_price * newQuantity;
    
            await axios.patch('http://localhost:5000/cart/edit_cart', {
                user_id: user.user_id,
                cart_id: cartId, 
                quantity: newQuantity,
            });
    
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item.cart_id === cartId 
                        ? { ...item, quantity: newQuantity, total_price: newTotalPrice }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {cartItems.length > 0 ? (
                <div className='flex flex-col max-w-2xl mx-auto gap-y-4'>
                    {cartItems.map((item) => (
                        <div key={item.cart_id} className='flex flex-row justify-around shadow-md'>
                            <div className='max-w-[150px]'>
                                <div className='text-xl font-bold ml-2'>
                                    {item.product_name}    
                                </div>
                                <img className='box-border p-3' src={`/shoes/${item.product_id}.png`} alt={item.product_name} />
                            </div>

                            <div className='flex flex-col items-center justify-center gap-y-4'>
                                <div className='flex-2 flex flex-row gap-4 items-center justify-center'>
                                    <GrFormPrevious size={40} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)} /> 
                                    <div className='text-2xl'>{item.quantity}</div>
                                    <GrFormNext size={40} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)} /> 
                                </div>      
                                <div className='text-xl font-semibold box-border border-2 border-black px-4'>
                                    {item.product_size}                                         
                                </div>
                            </div>

                            <div className='flex items-center justify-between text-lg gap-4'>
                                <div>
                                    {item.quantity} X {item.product_price}
                                </div>
                                <div className="h-[100px] my-auto min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-600 to-transparent opacity-20 dark:opacity-100"></div>
                                <div className='text-2xl font-bold text-orange-600'>
                                    {`R$${item.total_price}`}      
                                </div>
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

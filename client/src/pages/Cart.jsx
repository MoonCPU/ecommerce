import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthProvider';

import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Cart() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    const notifyDelete = () => {
        toast.error('Item deleted', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    useEffect(() => {
        if (user) {
            fetchCartData(user.user_id);
        } else {
            setCartItems([]);
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
            if (newQuantity <= 0) {
                await axios.delete(`http://localhost:5000/cart/delete_cart/${cartId}`);
                notifyDelete();
                setCartItems(prevCartItems =>
                    prevCartItems.filter(item => item.cart_id !== cartId)
                );
    
                return;
            }
    
            const updatedCartItem = cartItems.find(item => item.cart_id === cartId);
            const newTotalPrice = updatedCartItem.product_price * newQuantity;
    
            await axios.patch('http://localhost:5000/cart/edit_cart', {
                user_id: user.user_id,
                cart_id: cartId,
                quantity: newQuantity,
                total_price: newTotalPrice, 
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
            <div id='desktop'>
                {cartItems.length > 0 ? (
                    <div className='hidden sm:flex flex-col sm:max-w-xl md:max-w-2xl mx-auto gap-y-4'>
                        {cartItems.map((item) => (
                            <div key={item.cart_id} className='flex flex-row justify-around shadow-md'>
                                <div id='cart-name' className='max-w-[150px] flex-1'>
                                    <div className='text-xl font-bold ml-2'>
                                        {item.product_name}    
                                    </div>
                                    <img className='box-border p-3' src={`/shoes/${item.product_id}.png`} alt={item.product_name} />
                                </div>

                                <div id='cart-quantity' className='flex flex-1 flex-col items-center justify-center gap-y-4'>
                                    <div className='flex-2 flex flex-row gap-4 items-center justify-center'>
                                        <GrFormPrevious size={32} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)} /> 
                                        <div className='text-2xl'>{item.quantity}</div>
                                        <GrFormNext size={32} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)} /> 
                                    </div>      
                                    <div className='text-xl font-semibold box-border border-2 border-black px-4'>
                                        {item.product_size}                                         
                                    </div>
                                </div>

                                <div id='cart-price' className='flex flex-1 items-center justify-center text-lg gap-4 box-border px-4'>
                                    <div>
                                        {item.quantity} X {`R$${item.product_price}`} 
                                    </div>
                                    <div className="h-[100px] my-auto min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-600 to-transparent opacity-20 dark:opacity-100"></div>
                                    <div className='text-xl font-bold text-orange-600'>
                                        {`R$${item.total_price}`}      
                                    </div>
                                </div> 
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='hidden sm:flex text-center justify-center items-center text-2xl my-[15%]'>
                        <h1>Your cart is empty.</h1>
                    </div>
                )}
            </div>    

            <div id='mobile'>
                {cartItems.length > 0 ? (
                        <div className='flex flex-col max-w-[340px] mx-auto gap-y-4 sm:hidden '>
                            {cartItems.map((item) => (
                                <div key={item.cart_id} className='flex flex-col justify-around shadow-md'>
                                    <div className='flex flex-row justify-evenly'>
                                        <div className='max-w-[120px]'>
                                            <img className='box-border p-2' src={`/shoes/${item.product_id}.png`} alt={item.product_name} />                                            
                                        </div>
                                        <div className='flex flex-col justify-around items-center'>
                                            <div className='text-xl font-bold'>
                                                {item.product_name}    
                                            </div>
                                            <div className='flex-2 flex flex-row gap-4 items-center justify-center'>
                                                <GrFormPrevious size={24} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)} /> 
                                                <div className='text-xl'>{item.quantity}</div>
                                                <GrFormNext size={24} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)} /> 
                                            </div>    
                                            <div className='text-lg font-semibold box-border border-2 border-black px-4'>
                                                {item.product_size}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div id='cart-price' className='flex flex-1 items-center justify-center text-lg gap-4 box-border px-4'>
                                            <div>
                                                {item.quantity} X {`R$${item.product_price}`} 
                                            </div>
                                            <div className="h-[40px] my-auto min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-600 to-transparent opacity-20 dark:opacity-100"></div>
                                            <div className='text-xl font-bold text-orange-600'>
                                                {`R$${item.total_price}`}      
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='sm:hidden text-center justify-center items-center text-2xl my-[15%]'>
                            <h1>Your cart is empty.</h1>
                        </div>
                    )
                }
            </div>  
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />      
        </div>

    );
}

export default Cart;

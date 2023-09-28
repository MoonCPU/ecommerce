import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthProvider';
import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from 'react-router-dom';

function Cart() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartAddress, setCartAddress] = useState([]);
    const navigate = useNavigate()

    const notifyDelete = () => {
        toast.error('Item deleted', {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    useEffect(() => {
        if (user) {
            fetchCartData(user.user_id);
            fetchUserAddress(user.user_id);
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

    const fetchUserAddress = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/address/get_addresses/${userId}`);
            setCartAddress(response.data);
        } catch (error){
            console.log(error.message);
        }
    }

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
    
            //if quantity and total_price changes, map through every shopping_cart item and check if their id is the same one as the one whose quantity and price changed
            //then, update their values and return everything else as before.
            //prevCartItems because they are the current state of cartItems, before they are updated. We have to go through all of the current states to update them.
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

    const handleFinishPurchase = () => {
        navigate("/");
    }

    return (
        <div>
            <div id='desktop'>
                {cartItems.length > 0 ? (
                    <div className='flex flex-row'>
                        <div id='cart-item' className='hidden sm:flex flex-col sm:max-w-xl md:max-w-2xl mx-auto gap-y-4'>
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
                            <div onClick={handleFinishPurchase} className='flex items-center justify-center'>
                                <button className='mt-4 rounded-md bg-orange-500 transition duration-400 hover:bg-orange-600 text-white w-full p-2 font-semibold'>
                                    Finish Purchase
                                </button>
                            </div>
                        </div>  
                        <div id='cart-address'>
                            {cartAddress.length > 0 ? (
                                <div>
                                    {cartAddress.map((item) => (
                                        <div key={item.address_id}>
                                            <h1>{item.street}</h1>
                                        </div>
                                    ))}
                                </div>
                            ): (
                                <div>
                                    <h1>You don&apos;t have any address</h1>
                                    <form>
                                        <label>
                                            <input type="radio" name="address" />
                                            <h1>Address 1</h1>
                                        </label>
                                    </form>                                   
                                </div>
                            )} 
                        </div>                  
                    </div>

                ) : (
                    <div className='hidden sm:flex text-center justify-center items-center text-2xl my-[15%]'>
                        <h1>Your cart is empty.</h1>
                    </div>
                )}
            </div>    

            <div id='mobile'>
                {cartItems.length > 0 ? (
                        <div className='flex flex-col max-w-xs mx-auto gap-y-4 sm:hidden'>
                            {cartItems.map((item) => (
                                <div key={item.cart_id} className='flex flex-col justify-around shadow-md mx-2'>
                                    <div className='flex flex-row justify-evenly'>
                                        <div className='max-w-[100px]'>
                                            <img className='box-border p-2' src={`/shoes/${item.product_id}.png`} alt={item.product_name} />                                            
                                        </div>
                                        <div className='flex flex-col justify-around items-center'>
                                            <div className='text-lg font-bold'>
                                                {item.product_name}    
                                            </div>
                                            <div className='flex-2 flex flex-row gap-4 items-center justify-center'>
                                                <GrFormPrevious size={24} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)} /> 
                                                <div className='text-lg'>{item.quantity}</div>
                                                <GrFormNext size={24} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)} /> 
                                            </div>    
                                            <div className='text-lg font-semibold box-border border-2 border-black px-3'>
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
                                            <div className='text-lg font-bold text-orange-600'>
                                                {`R$${item.total_price}`}      
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            ))}
                            <div onClick={handleFinishPurchase} className='flex items-center justify-center mx-4'>
                                <button className='mt-4 rounded-md bg-orange-500 transition duration-400 hover:bg-orange-600 text-white w-full p-2 font-semibold'>
                                    Finish Purchase
                                </button>
                            </div>
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

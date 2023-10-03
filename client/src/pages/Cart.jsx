import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthProvider';
import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import _ from 'lodash';

function Cart() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');

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

    const notifyFailedCep = () => {
        toast.error('CEP is not valid!', {
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

    const notifySuccess = () => {
        toast.success('Finished!', {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
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

    const handleFinishPurchase = async () => {
        try {
            const addressData = {
                cep,
                street,
                neighborhood,
                city,
                state,
                number,
                complement,
            };
    
            const response = await axios.post(`http://localhost:5000/cart/add_cart_address/${user.user_id}`, addressData);
            notifySuccess();
    
            console.log(response.data.message); 
            setCartItems([]);
            setCep('');
            setStreet('');
            setNeighborhood('');
            setCity('');
            setState('');
            setNumber('');
            setComplement('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCep = async (cep) => {
        try{
            const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
            setCep(response.data.cep);
            setStreet(response.data.street);
            setNeighborhood(response.data.neighborhood);
            setCity(response.data.city);
            setState(response.data.state);
        } catch (error) {
            console.log('Not valid CEP.');
            notifyFailedCep();
        }
    }

    const debouncedHandleCep = _.debounce((cep) => {
        handleCep(cep);
    }, 1000);

    return (
        <div>
            <div id='desktop'>
                {cartItems.length > 0 ? (
                    <div className='flex flex-row justify-center mx-2'>
                        <div id='cart-item' className='hidden sm:flex flex-col sm:max-w-xl md:max-w-2xl gap-y-4 box-border'>
                            {cartItems.map((item) => (
                                <div key={item.cart_id} className='flex flex-row justify-around shadow-md border-2 border-gray-200 p-1'>
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
                                        <div className="h-[100px] my-auto min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-600 to-transparent opacity-20"></div>
                                        <div className='text-xl font-bold text-orange-600'>
                                            {`R$${item.total_price}`}      
                                        </div>
                                    </div> 
                                </div>
                            ))}
                        </div>  

                        <div id='cart-address' className='hidden md:flex md:flex-row'>
                            <div className="mx-6 flex h-full my-auto min-h-[1em] w-px self-stretch bg-black"></div>
                            <form 
                            onSubmit={(e) => {
                                e.preventDefault(); 
                                handleFinishPurchase();
                            }}
                            className='flex flex-col shadow-lg dark:shadow-black/30 box-border p-5 gap-y-2 text-lg max-w-xs'>
                                <h1 className='text-2xl font-medium text-orange-500'>Address</h1>
                                <section className='flex gap-3'>
                                    <label>CEP:</label>
                                    <input
                                        type="text"  
                                        name='cep'
                                        onChange={(e) => debouncedHandleCep(e.target.value)} 
                                        required
                                        placeholder='00000-000'
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-[50%]'
                                    />
                                </section>
                                <section className='flex flex-col gap-y-1'>
                                    <label>Street:</label>
                                    <input 
                                    type="text" 
                                    name='street' 
                                    required 
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2' />
                                </section>      
                                <section className='flex flex-row gap-y-2 gap-x-2'>
                                    <div className='flex-1'>
                                        <label>Number:</label>
                                        <input 
                                        type="text" 
                                        name='number' 
                                        required 
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>
                                    <div className='flex-[2]'>
                                        <label>Complement:</label>
                                        <input 
                                        type="text" 
                                        name='complement' 
                                        value={complement}
                                        placeholder='(optional)'
                                        onChange={(e) => setComplement(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>                                     
                                </section>        
                                <section className='flex flex-col gap-y-1'>
                                    <label>Neighborhood:</label>
                                    <input 
                                    type="text" 
                                    name='neighborhood' 
                                    required 
                                    value={neighborhood}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2' />
                                </section>                    
                                <section className='flex flex-row gap-y-2 gap-x-2'>
                                    <div className='flex-[2]'>
                                        <label>City:</label>
                                        <input 
                                        type="text" 
                                        name='city' 
                                        required 
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>
                                    <div className='flex-1'>
                                        <label>State:</label>
                                        <input 
                                        type="text" 
                                        name='state' 
                                        required 
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>                                     
                                </section> 
                                <button 
                                type='submit'
                                className='flex items-center justify-center mt-4 rounded-md bg-orange-500 transition duration-400 hover:bg-orange-600 text-white w-full p-2 font-semibold'>
                                    Finish Purchase
                                </button>
                            </form>
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
                        <div className='flex flex-col max-w-sm mx-auto gap-y-5 sm:hidden'>
                            {cartItems.map((item) => (
                                <div key={item.cart_id} className='flex flex-col justify-around shadow-md mx-3 border-2 border-gray-200'>
                                    <div className='flex flex-row justify-evenly'>
                                        <div className='max-w-[100px]'>
                                            <img className='box-border p-2' src={`/shoes/${item.product_id}.png`} alt={item.product_name} />                                            
                                        </div>
                                        <div className='flex flex-col justify-around items-center'>
                                            <div className='text-lg font-bold'>
                                                {item.product_name}    
                                            </div>
                                            <div className='flex-2 flex flex-row gap-4 items-center justify-center p-1'>
                                                <GrFormPrevious size={24} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)} /> 
                                                <div className='text-lg'>{item.quantity}</div>
                                                <GrFormNext size={24} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)} /> 
                                            </div>    
                                            <div className='text-md font-semibold box-border border-2 border-black px-3'>
                                                {item.product_size}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div id='cart-price' className='flex flex-1 items-center justify-center text-md gap-4 box-border px-4'>
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
                            <div className='flex items-center justify-center mx-4'>
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

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
        toast.error('Item deletado!', {
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
        toast.error('CEP não é válido!', {
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

    const notifySuccessCep = () => {
        toast.success('CEP encontrado!', {
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
        toast.success('Finalizado!', {
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
            const response = await axios.get(`https://moon-ecommerce.onrender.com/cart/get_cart/${userId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // calculate total price of product
    const handleQuantityChange = async (cartId, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                await axios.delete(`https://moon-ecommerce.onrender.com/cart/delete_cart/${cartId}`);
                notifyDelete();
                setCartItems(prevCartItems =>
                    prevCartItems.filter(item => item.cart_id !== cartId)
                );
    
                return;
            }
    
            const updatedCartItem = cartItems.find(item => item.cart_id === cartId);
            const newTotalPrice = updatedCartItem.product_price * newQuantity;
    
            await axios.patch('https://moon-ecommerce.onrender.com/cart/edit_cart', {
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
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

        try {
            const addressData = {
                user_id: user.user_id,
                cep,
                street,
                neighborhood,
                city,
                state,
                number,
                complement
            };

            const responseAddress = await axios.post('https://moon-ecommerce.onrender.com/address/add_address', addressData);
            console.log(responseAddress.data.message); 

            for (const cartItem of cartItems) {
                const orderData = {
                    user_id: user.user_id,
                    product_id: cartItem.product_id,
                    quantity: cartItem.quantity,
                    product_size: cartItem.product_size,
                    total_price: cartItem.total_price,
                    address_id: responseAddress.data.address_id,
                    purchase_date: formattedDate
                };
    
                const responsePurchase = await axios.post('https://moon-ecommerce.onrender.com/orders/finish_purchase', orderData);
                console.log(responsePurchase.data.message);
    
                const token = await localStorage.getItem('token');
                console.log(token);

                // Delete the cart item after a successful purchase
                await axios.delete(`https://moon-ecommerce.onrender.com/cart/delete_cart/${cartItem.cart_id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log(`Cart item ${cartItem.cart_id} deleted`);
            }

            notifySuccess();
            
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
            notifySuccessCep();
        } catch (error) {
            console.log('Not valid CEP.');
            notifyFailedCep();
        }
    }

    const debouncedHandleCep = _.debounce((cep) => {
        handleCep(cep);
    }, 1200);

    return (
        <div>
            <div id='desktop' className='flex items-center justify-center'>
                {cartItems.length > 0 ? (
                    <div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-6'>
                        <div id='cart'>
                            {cartItems.map((item) => (
                                <div key={item.cart_id} className='border-2 border-black flex flex-col sm:flex-row p-2 box-border sm:gap-x-4 mb-3 max-w-xl'>
                                    <div className='flex flex-col sm:flex-row'>
                                        <div id='cart-image' className='flex flex-[1.5] flex-col sm:items-start items-center justify-center'>
                                            <div id='cart-name' className="text-xl text-center font-bold">
                                                {item.product_name}
                                            </div>                            
                                            <div className="max-w-[100px] lg:max-w-[120px] box-border p-2">
                                                <img src={`/shoes/${item.product_id}.png`} alt={item.product_name} className=""/>                                
                                            </div>                                              
                                        </div>

                                        <div id='cart-quantity' className='flex flex-1 flex-col justify-center items-center'>
                                            <div className='flex flex-row gap-4'>
                                                <GrFormPrevious size={32} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)} /> 
                                                <div className='text-2xl'>{item.quantity}</div>
                                                <GrFormNext size={32} className='cursor-pointer' onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)} /> 
                                            </div>      
                                            <div className='text-xl font-semibold border-2 border-black box-border px-3 m-2'>
                                                {item.product_size}                                         
                                            </div>
                                        </div>      

                                        <div id='cart-price' className='flex flex-[2] flex-row gap-2 items-center justify-center ml-2 px-2 sm:w-[210px]'>
                                            <div className='text-center whitespace-nowrap'>
                                                {item.quantity} X {`R$${item.product_price}`} 
                                            </div>
                                            <div className="flex h-full sm:h-[25%] my-auto min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-600 to-transparent opacity-40"></div>
                                            <div className='text-lg font-bold text-orange-600'>
                                                {`R$${parseFloat(item.total_price).toFixed(2)}`} 
                                            </div>
                                        </div>                                         
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div id='address' className='flex flex-row box-border'>
                            <form 
                            onSubmit={(e) => {
                                e.preventDefault(); 
                                handleFinishPurchase();
                            }}
                            className='flex flex-col shadow-lg dark:shadow-black/30 box-border p-4 sm:p-5 gap-y-2 max-w-xs text-sm sm:text-lg mx-2'>
                                <h1 className='text-xl sm:text-2xl font-medium text-orange-500'>Endereço</h1>
                                <section className='flex gap-3'>
                                    <label>CEP:</label>
                                    <input
                                        type="text"  
                                        name='cep'
                                        onChange={(e) => debouncedHandleCep(e.target.value)} 
                                        required
                                        placeholder='ex: 01123000'
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-[50%]'
                                    />
                                </section>
                                <section className='flex flex-col gap-y-1'>
                                    <label>Rua:</label>
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
                                        <label>Número:</label>
                                        <input 
                                        type="text" 
                                        name='number' 
                                        required 
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>
                                    <div className='flex-[2]'>
                                        <label>Complemento:</label>
                                        <input 
                                        type="text" 
                                        name='complement' 
                                        value={complement}
                                        placeholder='(opcional)'
                                        onChange={(e) => setComplement(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>                                     
                                </section>        
                                <section className='flex flex-col gap-y-1'>
                                    <label>Bairro:</label>
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
                                        <label>Cidade:</label>
                                        <input 
                                        type="text" 
                                        name='city' 
                                        required 
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2 w-full' />                                            
                                    </div>
                                    <div className='flex-1'>
                                        <label>Estado:</label>
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
                                    Finalizar Compra
                                </button>
                            </form>
                        </div>                                 
                    </div>
                ) : (
                    <div className='hidden sm:flex text-center justify-center items-center text-2xl my-[15%]'>
                        <h1>Seu carrinho está vazio.</h1>
                    </div>
                )}
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
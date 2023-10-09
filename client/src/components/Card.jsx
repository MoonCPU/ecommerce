import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";

import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Card() {
    const [ProductCards, setCard] = useState([]);
    const { user } = useAuth();

    const notifySuccess = () => {
        toast.success('Adicionado ao carrinho!', {
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

    const notifyFailure = () => {
        toast.error('Oops! Algo deu errado.', {
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

    const notifyNotLoggedIn = () => {
        toast.warn('O usuário não está logado!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    useEffect(() => {
        fetchCartData()
    }, []);

    const fetchCartData = async () => {
        try {
            const response = await axios.get('https://moon-ecommerce.onrender.com/products/get_all_products/');
            // Initialize quantity and productPrice for each product
            const productsWithQuantity = response.data.map(product => ({
                ...product,
                quantity: 1,
                productPrice: product.product_price // Initialize productPrice
            }));
            setCard(productsWithQuantity);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDecreaseQuantity = (productId) => {
        // Find the product by ID and update its quantity
        setCard(prevState => {
            return prevState.map(product => {
                if (product.product_id === productId && product.quantity > 1) {
                    return {
                        ...product,
                        quantity: product.quantity - 1
                    };
                }
                return product;
            });
        });
    }

    const handleIncreaseQuantity = (productId) => {
        // Find the product by ID and update its quantity
        setCard(prevState => {
            return prevState.map(product => {
                if (product.product_id === productId) {
                    return {
                        ...product,
                        quantity: product.quantity + 1
                    };
                }
                return product;
            });
        });
    }

    const handleSubmitForm = async (e, productId, currentQuantity, productPrice) => {
        e.preventDefault();
    
        if (user) {
            const user_id = user.user_id;
            const size = e.target.size.value;

            // Calculate the total price
            const total_price = productPrice * currentQuantity;

            try {
                await axios.post('https://moon-ecommerce.onrender.com/cart/add_to_cart/', {
                    user_id: user_id,
                    product_id: productId,
                    quantity: currentQuantity,
                    size: size,
                    total_price: total_price, // Include total_price in the request
                });
                notifySuccess();
            } catch (error) {
                console.log(error.message);
                notifyFailure();
            }            
        } else {
            notifyNotLoggedIn();
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {ProductCards.length > 0 ? (
                <div className="flex flex-wrap flex-row gap-6 items-center justify-center mb-4">
                    {ProductCards.map((card) => (
                        <div key={card.product_id} className="flex flex-col border-2 border-black">
                            <div className="text-xl text-center font-bold">
                                {card.product_name}
                            </div>                            
                            <div className="max-w-[200px] box-border p-2">
                                <img src={`/shoes/${card.product_id}.png`} alt={card.product_name} className=""/>                                
                            </div>
                            <div className="pt-1 text-lg text-center border-t-2 border-black">
                                {`R$${card.product_price}`}
                            </div>
                            <form onSubmit={(e) => handleSubmitForm(e, card.product_id, card.quantity, card.productPrice)} className="flex flex-col">
                                <div className="flex flex-row box-border mt-1 mb-2">
                                    <select name="size" id="size" required className='cursor-pointer mx-auto text-xl font-semibold border-2 border-black'>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                    </select>
                                    <div className='flex flex-row justify-center item gap-4 mx-auto'>
                                        <GrFormPrevious size={32} className='cursor-pointer' onClick={() => handleDecreaseQuantity(card.product_id)}  />
                                        <div className="text-xl">{card.quantity}</div>
                                        <GrFormNext size={32} className='cursor-pointer' onClick={() => handleIncreaseQuantity(card.product_id)}  />
                                    </div>                                    
                                </div>
                                <button className="bg-green-500 hover:bg-green-700 text-white text-xl font-bold transition duration-400">Adicionar</button>                                    
                            </form>
                        </div>
                    ))}
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
            ) : (
                <div className='text-center text-2xl my-[15%]'>
                    <h1>Wow, aqui está tão vazio...</h1>
                </div>
            )}
        </div>
    )
}

export default Card;
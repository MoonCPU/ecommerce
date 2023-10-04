import { useAuth } from '../components/AuthProvider';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Account() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCartData(user.user_id);
        } else {
            setOrders([]);
        }
    }, [user]);

    const fetchCartData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/orders/get_orders/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div className="max-w-4xl mx-auto flex flex-col gap-y-6">
            <main>
                <div>
                    {user && user.user_name}
                </div>
            </main>

            <div>
                <h1 className='text-xl sm:text-3xl font-bold mb-2'>Your orders</h1>
                <section id='orders' className='flex flex-col border-2 border-black p-4'>
                    <div>
                        {orders.length > 0 ? (
                            <div className='flex flex-col gap-y-4'>
                                {/* Map through cartItems to display each item */}
                                {orders.map(item => (
                                    <div key={item.order_id} className='flex flex-col gap-y-4 border-2 box-border px-2'>
                                        <div id='order-address' className='flex flex-row gap-x-2 text-lg'>
                                            <h1 className='text-xl font-semibold'>ENDEREÇO: </h1>
                                            <div className='flex flex-row gap-x-1'>
                                                <h1>
                                                    {item.street},    
                                                </h1>
                                                <h1>
                                                    {item.number},
                                                </h1>
                                                {item.complement && <h1>{item.complement},</h1>}
                                                <h1>
                                                    {item.neighborhood},
                                                </h1>
                                                <h1>
                                                    {item.city},
                                                </h1>
                                                <h1>
                                                    {item.state}
                                                </h1>
                                            </div>   
                                        </div>
                                        <div id='order-details' className='flex flex-row text-center justify-around text-lg pb-2'>
                                            <div className='flex flex-col w-[200px] gap-y-1'>
                                                <h1 className='text-xl font-semibold'>ID DO PEDIDO</h1>
                                                {item.order_id}
                                            </div>    
                                            <div className='flex flex-col w-[200px] gap-y-1'>
                                                <h1 className='text-xl font-semibold'>PRODUTO</h1>
                                                <div className='flex flex-col items-center justify-center'>
                                                    {item.product_name}
                                                    <div className='flex flex-row gap-x-2'>
                                                        Tam: <div className='font-semibold'>{item.product_size}</div>        
                                                    </div>
                                                    <div className='flex flex-row gap-x-2'>
                                                        Quant: <div className='font-semibold'>{item.quantity}</div>        
                                                    </div>
                                                </div>
                                            </div>   
                                            <div className='flex flex-col w-[200px] gap-y-1'>
                                                <h1 className='text-xl font-semibold'>DATA</h1>
                                                {item.purchase_date}
                                            </div>                                            
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <h1>Your history is empty.</h1>
                            </div>
                        )}
                    </div>
                </section>                
            </div>

        </div>
    );
}

export default Account;

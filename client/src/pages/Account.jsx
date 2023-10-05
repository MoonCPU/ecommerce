import { useAuth } from '../components/AuthProvider';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Account() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});

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

    const toggleDropdown = (orderId) => {
        setExpandedItems((prevExpanded) => ({
            ...prevExpanded,
            [orderId]: !prevExpanded[orderId],
        }));
    };

    return (

        <div className="max-w-4xl mx-auto flex flex-col gap-y-8">
            <main className='flex items-center justify-center'>
                <div className='text-2xl sm:text-3xl font-bold'>
                    {user ? (
                        <div className='flex flex-col'>
                            <h1>
                                Bem-vindo, {user.user_name}  
                            </h1>
                            <h1 className='text-xl sm:text-2xl font-normal text-center'>
                                {user.user_email}
                            </h1>
                        </div>
                    ): (
                        <div>
                            Faça Login
                        </div>
                    )}
                </div>
            </main>

            <div>
                <h1 className='text-2xl sm:text-3xl font-bold m-3'>Seus pedidos</h1>
                <section id='orders' className='flex flex-col border-2 border-black p-4 m-3'>
                    <div>
                        {orders.length > 0 ? (
                            <div className='flex flex-col gap-y-4'>
                                {orders.map(item => (
                                    <div key={item.order_id} className='flex flex-col border-2 box-border border-black'>
                                        <div 
                                        id='order-address' 
                                        className='flex flex-row gap-x-2 text-md sm:text-lg cursor-pointer border-b-2 border-black items-center justify-start px-1'
                                        onClick={() => toggleDropdown(item.order_id)}>
                                            <h1 className='text-xl font-semibold'>ID: </h1>
                                            <h1>{item.order_id}</h1>
                                        </div>

                                        {expandedItems[item.order_id] && (
                                            <div id='order-details' className='flex flex-col sm:flex-row text-center justify-around text-md sm:text-lg p-2'>    
                                                <div className='flex flex-col gap-y-1'>
                                                    <h1 className='text-xl font-semibold border-b-2'>PRODUTO</h1>
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

                                                <div 
                                                id='order-address' 
                                                className='flex flex-col gap-x-2 text-md sm:text-lg cursor-pointer'
                                                onClick={() => toggleDropdown(item.order_id)}>
                                                    <h1 className='text-xl font-semibold border-b-2'>ENDEREÇO: </h1>
                                                    <div className='flex flex-col sm:flex-row gap-x-1 items-center justify-center'>
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

                                                <div className='flex flex-col gap-y-1'>
                                                    <h1 className='text-xl font-semibold border-b-2'>DATA</h1>
                                                    {item.purchase_date}
                                                </div>                                            
                                        </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <h1>Você não fez nenhuma compra.</h1>
                            </div>
                        )}
                    </div>
                </section>                
            </div>

        </div>
    );
}

export default Account;

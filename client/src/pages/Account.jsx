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

        <div className="max-w-4xl mx-auto flex flex-col">
            <main>
                <div>
                    {user && user.user_name}
                </div>
            </main>
            <section>
                <h1>Your orders</h1>
                <div>
                    {orders.length > 0 ? (
                        <div>
                            {/* Map through cartItems to display each item */}
                            {orders.map(item => (
                                <div key={item.order_id}>
                                    {item.street}
                                    {/* Add other details as needed */}
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
    );
}

export default Account;

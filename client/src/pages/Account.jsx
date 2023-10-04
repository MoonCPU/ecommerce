import { useAuth } from '../components/AuthProvider';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Account() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

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
                    {cartItems.length > 0 ? (
                        <div>
                            {/* Map through cartItems to display each item */}
                            {cartItems.map(item => (
                                <div key={item.cart_id}>
                                    {item.product_name}
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

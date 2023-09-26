import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Import jwtDecode
import { useAuth } from '../components/AuthProvider';

function Login() {
    const [user, setUser] = useState(null);
    const { handleLogout } = useAuth();
    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token){
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.user);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const response = await axios.post('http://localhost:5000/auth/login', {email, password});
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.user);
            console.log(decodedToken);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleLogoutClick = () => {
        handleLogout();
    }

    return (
        <div className="border-2 border-black">
            {user ? (
                <div>
                    <h1>Hello, {user.user_id}</h1>    
                    <button onClick={handleLogoutClick}>Log out</button>
                </div>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>email</label>
                        <input type="text" name='email' placeholder='email'/>                
                    </div>
                    <div>
                        <label>password</label>
                        <input type="password" name='password' placeholder='****' />                
                    </div>
                    <button type="submit">Login</button>
                </form>
            )}
        </div>
    );
}

export default Login;

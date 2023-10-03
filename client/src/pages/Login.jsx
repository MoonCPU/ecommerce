import  { useEffect, useContext } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; 
import { Link, useNavigate  } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate()

    const notifyLoginSuccess = () => {
        toast.success('Logged in!', {
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

    const notifyLoginFail = () => {
        toast.error('Login failed!', {
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
        const token = localStorage.getItem('token');

        if (token){
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.user);
        }
    }, [setUser])

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
            notifyLoginSuccess();
            setTimeout(() => {
                return navigate("/account");
            }, 1500);
        } catch (error) {         
            console.log(error.message);
            notifyLoginFail();
        }
    }

    return (
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-center">
            <form onSubmit={handleSubmit} className='mx-2 md:m-0 w-full p-5 sm:p-10 flex flex-col border-black shadow-lg dark:shadow-black/30'>
                <h1 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Sign in to your account
                </h1>
                <div className="mt-4"> 
                    <div className='my-2'>
                        <label className='block mb-2 text-sm sm:text-lg font-medium text-gray-900'>Email:</label>
                        <input type="email" name='email' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@email.com" /> 
                    </div>
                    <div className='my-2'>
                        <label className='block mb-2 text-sm sm:text-lg font-medium text-gray-900'>Password:</label>
                        <input type="password" name='password' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="****" /> 
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <button type="submit" className="mt-4 rounded-md bg-blue-500 transition duration-500 hover:bg-blue-600 text-white w-full p-2 font-semibold">Login</button>
                </div>
                <div className='mt-2 text-sm sm:text-base'>
                    <h2>Register new account <Link to="/register" className='font-medium text-gray-900 underline transition duration-400 hover:text-green-700'>here</Link>
                    </h2>
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
            </form>
        </div>
    );
}

export default Login;

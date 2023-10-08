import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const navigate = useNavigate()

    const notifySuccess = () => {
        toast.success('New user registered!', {
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

    const notifyFail = () => {
        toast.error('Register failed!', {
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

    const handleSubmit = async (e) => {
            e.preventDefault();
            
            const name = e.target.name.value;
            const email = e.target.email.value;
            const password = e.target.password.value;      

        try {
            const response = await axios.post('https://moon-ecommerce.onrender.com/auth/register', {name, email, password});
            console.log(response.data);
            notifySuccess();
            setTimeout(() => {
                return navigate("/login");
            }, 1500);
        } catch (error) {
            console.log(error.message);
            notifyFail();
        }
    }

    return (
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-center">
            <form onSubmit={handleSubmit} className='mx-2 md:m-0 w-full p-5 sm:p-10 flex flex-col border-black shadow-lg dark:shadow-black/30'>
                <h1 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Registre sua conta
                </h1>
                <div className="mt-4"> 
                    <div className='my-2'>
                        <label className='block mb-2 text-sm sm:text-lg font-medium text-gray-900'>Nome:</label>
                        <input type="text" name='name' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name" /> 
                    </div>
                    <div className='my-2'>
                        <label className='block mb-2 text-sm sm:text-lg font-medium text-gray-900'>Email:</label>
                        <input type="email" name='email' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@email.com" /> 
                    </div>
                    <div className='my-2'>
                        <label className='block mb-2 text-sm sm:text-lg font-medium text-gray-900'>Senha:</label>
                        <input type="password" name='password' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="****" /> 
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <button type="submit" className="mt-4 rounded-md bg-blue-500 transition duration-500 hover:bg-blue-600 text-white w-full p-2 font-semibold">Register</button>
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
    )
}

export default Register
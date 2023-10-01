import { Link } from 'react-router-dom';
import {AiOutlineMenu, AiOutlineClose} from 'react-icons/ai';
import { BsFillCartFill } from 'react-icons/bs';
import { BiSolidUser, BiLogOut } from 'react-icons/bi';
import { useState } from 'react';
import { useAuth } from './AuthProvider';

function Navbar() {
    const [nav, setNav] = useState(true);
    const { user, handleLogout } = useAuth();

    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className='max-w-full flex flex-row items-center justify-around box-border px-6 sm:justify-around mx-auto p-6 mb-14 shadow-md'>
            {/* desktop menu*/}
            <div className="text-5xl sm:text-6xl flex flex-row items-center justify-center">
                <Link to="/">
                    <img src="/logo.png" alt="logo" className="h-10 sm:h-20" />
                </Link>
            </div>
            <ul className="hidden sm:flex flex-row items-center gap-4 font-bold">
                <li className="px-2 text-2xl"><button><Link to="/">Home</Link></button></li>
                <li className="px-2 text-2xl"><Link to="/about">About</Link></li>
                <li className="px-2 text-2xl"><Link to="/account">Account</Link></li>
                <li className="px-2 text-2xl flex flex-row gap-4">
                {user ? ( 
                        <div className='flex flex-row gap-4'>
                            <BiLogOut className="cursor-pointer" onClick={handleLogout} size={26} /> 
                            <Link to="/cart">
                                <BsFillCartFill size={24}/>
                            </Link>            
                        </div>
                    ) : (
                        <div className='flex flex-row gap-4'>
                        <Link to="/login">
                            <BiSolidUser size={26}/>
                        </Link>
                        <Link to="/cart">
                            <BsFillCartFill size={24}/>
                        </Link>                            
                        </div>
                )}
                </li>
            </ul>

            {/* mobile menu icons */}
            <div className='flex flex-row items-center justify-center sm:hidden'>
                <div className='flex flex-row justify-center items-center gap-4 mx-6'>
                    {user ? ( 
                        <>
                            <BiLogOut className="cursor-pointer" onClick={handleLogout} size={25} />
                            <Link to="/cart">
                                <BsFillCartFill size={24} />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <BiSolidUser size={25} />
                            </Link>
                            <Link to="/cart">
                                <BsFillCartFill size={24} />
                            </Link>
                        </>
                    )}
                </div>
                <div onClick={handleNav} className="flex">
                    {!nav ? (
                        <AiOutlineClose className="cursor-pointer" size={30} />
                    ) : (
                        <AiOutlineMenu className="cursor-pointer" size={30} />
                    )}
                </div>
            </div>

            {/* mobile menu */}
            <div
            className={!nav ? 'fixed flex flex-col left-0 top-0 w-[75%] h-screen border-r border-r-gray-900 ease-in-out duration-500 sm:hidden z-[100] bg-[#FDFDFD]': 'fixed flex flex-col h-screen left-[-100%] ease-in-out duration-500'}>
                <ul className="uppercase mt-5 ml-5">
                    <Link to="/">
                        <img src="/logo.png" alt="logo" className="h-14 sm:h-20" />
                    </Link>
                    <li className="p-2 text-2xl border-b border-gray-300 mt-10" onClick={handleNav}><Link to="/">Home</Link></li>
                    <li className="p-2 text-2xl border-b border-gray-300" onClick={handleNav}><Link to="/about">About</Link></li>                    <li className="p-2 text-2xl border-b border-gray-300" onClick={handleNav}><Link to="/account">Account</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar
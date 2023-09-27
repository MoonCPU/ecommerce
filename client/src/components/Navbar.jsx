import { Link } from 'react-router-dom';
import {AiOutlineMenu, AiOutlineClose} from 'react-icons/ai';
import { BsFillCartFill } from 'react-icons/bs';
import { BiSolidUser } from 'react-icons/bi';
import { useState } from 'react';

function Navbar() {
    const [nav, setNav] = useState(true);

    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className='max-w-2xl flex flex-row items-center justify-between sm:justify-around mx-auto p-5'>
            {/* desktop menu*/}
            <div className="text-5xl sm:text-6xl flex flex-row items-center justify-center">
                <Link to="/">
                    <img src="/logo.png" alt="logo" className="h-14 sm:h-20" />
                </Link>
            </div>
            <ul className="hidden sm:flex flex-row items-center gap-4 font-bold">
                <li className="px-2 text-2xl"><button><Link to="/">Home</Link></button></li>
                <li className="px-2 text-2xl"><Link to="/about">About</Link></li>
                <li className="px-2 text-2xl flex flex-row gap-4">
                    <Link to="/login">
                        <BiSolidUser />
                    </Link>
                    <Link to="/cart">
                        <BsFillCartFill />
                    </Link>
                </li>
            </ul>

            <div className='flex flex-row sm:hidden'>
                {/* mobile menu icons */}
                <div className='flex flex-row justify-center items-center gap-3 mx-5'>
                        <Link to="/login">
                            <BiSolidUser size={25} />
                        </Link>
                        <Link to="/cart">
                            <BsFillCartFill size={24} />
                        </Link>                 
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
                    <li className="p-2 text-2xl border-b border-gray-300" onClick={handleNav}><Link to="/about">About</Link></li>
                </ul>
            </div>

        </div>
    )
}

export default Navbar
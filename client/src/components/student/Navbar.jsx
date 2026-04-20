import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const { navigate, isEducator, backednUrl: backendUrl, getToken, setUserData } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        setUserData(data.user)
        toast.success(data.message)
        navigate('/educator')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 border-b border-gray-700/50 bg-[#0a0a12]/80 backdrop-blur-md sticky top-0 z-50`}>
      <Link to='/'>
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer invert' />
      </Link>
      <div className='hidden md:flex items-center gap-5 text-gray-300'>
        <div className='flex items-center gap-5'>
          {user &&
            <>
              <button onClick={becomeEducator} className='hover:text-white transition'>
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              | <Link to='/my-enrollments' className='hover:text-white transition'>My Enrollments</Link>
            </>
          }
        </div>
        {user ? <UserButton /> :
          <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-500 transition shadow-lg shadow-blue-600/20'>Create Account</button>}
      </div>

      {/* For mobile screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-400'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {user &&
            <>
              <button onClick={becomeEducator} className='hover:text-white transition'>
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              | <Link to='/my-enrollments' className='hover:text-white transition'>My Enrollments</Link>
            </>
          }
        </div>
        {user ? <UserButton /> : <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="user_icon" className='w-5 invert opacity-70' /></button>}
      </div>
    </div>
  )
}

export default Navbar

import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import {UserButton,useUser} from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const educatorData=dummyEducatorData
  const {user}=useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8
    border-b border-gray-700/50 py-3 bg-[#0d0d18]/90 backdrop-blur-md sticky top-0 z-50'>
      <Link to='/'>
      <img src={assets.logo} alt="logo" className='w-28 lg:w-32 invert' />
      </Link>
      <div className='flex items-center gap-5 text-gray-300 relative'>
        <p className='max-sm:hidden'>Hi! {user?user.fullName:'Developers'}</p>
        {user?<UserButton/>: <img src={assets.profile_img} className='max-w-8 rounded-full border border-gray-700' /> }
      </div>
    </div>
  )
}

export default Navbar
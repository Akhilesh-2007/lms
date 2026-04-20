import React, { useContext } from 'react'
import {AppContext} from '../../context/AppContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  
  const {isEducator}=useContext(AppContext)

  const menuItems = [
  { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
  { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
  { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
  { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-700/50
    py-2 flex flex-col bg-[#0d0d18]'>
      {menuItems.map((item)=>(
        <NavLink to={item.path}
        key={item.name}
        end={item.path==='/educator'}
        className={({isActive})=>`flex items-center md:flex-row flex-col 
          md:justify-start justify-center 
          py-3.5 md:px-10 gap-3 transition-all ${isActive?'bg-blue-600/15 border-r-[6px] border-blue-500 text-white font-medium'
          :'hover:bg-gray-800/50 border-r-[6px] border-transparent text-gray-400 hover:text-gray-200'}`}>
          <img src={item.icon} alt="" className={`w-6 h-6 transition-all invert brightness-125 opacity-80`} />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
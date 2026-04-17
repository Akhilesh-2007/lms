import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20
    px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
        <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
          Choose your path. <span className='text-blue-600'>We will train you for it</span>
          <img src={assets.sketch} alt="Sketch" className='md:block hidden absolute -bottom-7 right-0'/></h1>
          <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
              Trainly brings together expert mentors, practical learning experiences, and a flexible platform
              designed to match your goals. Learn through real-world projects, guided paths, and a supportive
              community that helps you grow personally and professionally.
            </p>
          <p className="md:hidden text-gray-500 max-w-sm mx-auto">
            Trainly connects you with expert mentors and practical learning paths to help you grow and achieve
            your career goals.
            </p>
          <SearchBar/> 
    </div>
  )
}

export default Hero
import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
const CallToAction = () => {
  const navigate = useNavigate()
  return (
    <div className='text-center flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
        <h1 className='text-2xl md:text-4xl text-white font-bold max-w-2xl'>Learn 
          anything, anytime, anywhere</h1>
        <p className='text-gray-300 text-sm md:text-base max-w-xl'>Incidiunt sint fugiat pariatur cupidatat consectetur sitcillum anim
          id venaim aliqua prodent excepteur commodo do
          ea.</p>
        <div className='flex items-center font-medium gap-6 mt-6'>
          <button onClick={() => navigate('/course-list')} className='px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20'>Get started</button>
          <button onClick={() => navigate('/about-us')} className='flex items-center gap-2 text-gray-200 hover:text-blue-400 transition group'>learn more <img src={assets.arrow_icon} alt="arrow_icon" className='invert opacity-70 group-hover:opacity-100 transition-all'/></button>
        </div>
    </div>
  )
}

export default CallToAction
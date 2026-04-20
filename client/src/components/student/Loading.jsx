import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {

  const {path}=useParams()
  const navigate=useNavigate();

  useEffect(()=>{
    // Only redirect when used as a route component with a path param.
    // When used as a plain loading spinner (no path), just show the animation.
    if(path){
      const timer=setTimeout(()=>{
        navigate(`/${path}`)
      },5000)
      return ()=>clearTimeout(timer)
    }
  },[])

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0a0a12]'>
      <div className='w-16 sm:w-20 aspect-square border-4
          border-gray-800 border-t-4 border-t-blue-500 rounded-full
          animate-spin'></div>
    </div>
  )
}

export default Loading
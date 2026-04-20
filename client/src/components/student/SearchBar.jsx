import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {

  const navigate=useNavigate()
  const [input,setInput]=useState(data?data:'')

  const onSearchHandler=(e)=>{
    e.preventDefault()
    navigate('/course-list/'+input)  
  }

  return (
      <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-[#11111e]/90
      border border-gray-700/50 rounded backdrop-blur-sm shadow-lg shadow-black/20'>
        <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 
        px-3 invert opacity-80'/>
        <input onChange={(e)=>setInput(e.target.value)} value={input}
        type="text" placeholder="Search for courses, skills, or mentors..." className="w-full 
        h-full outline-none text-gray-200 bg-transparent placeholder-gray-500 font-medium"/>     
        <button type='submit' className='bg-blue-600 rounded text-white md:px-10
        px-7 md:py-3 py-2 mx-1 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/20'>Search</button>
      </form>
  )
}

export default SearchBar
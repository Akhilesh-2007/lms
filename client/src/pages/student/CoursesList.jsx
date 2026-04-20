import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { useState } from 'react';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
const CoursesList = () => {

  const {navigate,allCourses} = useContext(AppContext);
  const {input}=useParams()
  const[filteredCourse,setFilteredCourse]=useState([])

  useEffect(() => {
    if(allCourses && allCourses.length > 0){
      const tempCourses=allCourses.slice();

      input?
      setFilteredCourse(
        tempCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      )
      :setFilteredCourse(tempCourses);
    }  }, [input, allCourses]);

  return (
    <>
    <div className='relative md:px-36 px-8 pt-20 text-left'>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between
      w-full'>
        <div className=''>
          <h1 className='text-4xl font-bold text-white'>Course List</h1>
        <p className='text-gray-400 mt-1'>
          <span className='text-blue-400 cursor-pointer hover:text-blue-300 transition'
          onClick={() => navigate('/')}>Home</span>
          <span className='mx-2'>/</span><span className='text-gray-200'>Course List</span></p>
        </div>
        <SearchBar data={input} />
      </div>
      { input && <div className='inline-flex items-center gap-4 px-4 py-2 border border-blue-500/30 bg-blue-600/10 mt-8
      -mb-8 text-blue-400 rounded-full font-medium'>
        <p>{input}</p>
        <img src={assets.cross_icon}alt="" className='cursor-pointer invert' onClick={()=>
          navigate('/course-list')}/>
        </div>
      }
      <div className='grid grid-col-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4
      my-16 gap-3 px-2 md:p-0'>
        {filteredCourse.map((course,index)=> <CourseCard key={index} course={course} />)}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default CoursesList
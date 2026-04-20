import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {

  const {currency,calculateRating}=useContext(AppContext)
  return (
    <Link to={'/course/'+course._id} onClick={()=> window.scrollTo(0,0)}
    className='border border-gray-700/50 pb-6 overflow-hidden rounded-lg bg-gray-800/40 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300'>
        <img
          src={course.courseThumbnail}
          alt="Course thumbnail"
          className="w-full h-44 object-cover"
        />
        <div className='p-3 text-left'>
            <h3 className='text-base font-semibold text-white'>{course.courseTitle}</h3>
            <p className='text-gray-300 text-sm mt-1'>{course.educator.name}</p>
            <div className='flex items-center space-x-2 mt-2'>
              <p className='text-gray-300 font-medium'>{calculateRating(course)}</p>
              <div className='flex'>
                {[...Array(5)].map((_,i)=>(<img key={i} src={i<Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt="star" className='w-3.5 h-3.5'/>
                ))}
              </div>
              <p className='text-gray-500 text-xs'>{course.courseRatings.length} reviews</p>
            </div>
            <p className='text-lg font-bold text-white mt-3'>{currency}{(course.coursePrice-course.discount*course.
            coursePrice/100).toFixed(2)}</p>
        </div>
    </Link>
  )
}

export default CourseCard
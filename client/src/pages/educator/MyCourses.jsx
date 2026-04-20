import React, { useContext, useState,useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCourses = () => {

  const {currency,backednUrl:backendUrl,isEducator,getToken}=useContext(AppContext)
  const [courses,setCourses]=useState(null)
  const fetchEducatorCourses=async()=>{
    try {
      const token=await getToken();
      const {data}=await axios.get(`${backendUrl}/api/educator/courses`,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      data.success && setCourses(data.courses);
    } catch (error) {
      console.error('Error fetching educator courses:', error)
    }
  }

  useEffect(()=>{
    if(!isEducator){
      return;
    }
      fetchEducatorCourses()
  },[isEducator])

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8
    md:pb-0 p-4 pt-8 pb-0 bg-[#0a0a12]'>
        <div className='w-full'>
          <h2 className='pb-4 text-xl font-bold text-white'>My Courses</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-[#11111e] border border-gray-700/50">
            <table className="md:table-auto table-fixed w-full overflow-hidden text-gray-300">
              <thead className="text-white border-b border-gray-700/50 text-sm text-left bg-gray-800/40">
                <tr>
                  <th className="px-4 py-3 font-bold truncate">All Courses</th>
                  <th className="px-4 py-3 font-bold truncate">Earnings</th>
                  <th className="px-4 py-3 font-bold truncate">Students</th>
                  <th className="px-4 py-3 font-bold truncate">Published On</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <img
                        src={course.courseThumbnail}
                        alt="Course Image"
                        className="w-16 rounded border border-gray-700/50"/>
                      <span className="truncate hidden md:block text-gray-200">
                        {course.courseTitle}
                      </span></td>
                    <td className="px-4 py-3">
                      {currency}{Math.floor(
                        course.enrolledStudents.length *
                        (course.coursePrice - (course.discount * course.coursePrice) / 100)
                      )}</td>
                    <td className="px-4 py-3">
                      {course.enrolledStudents.length}</td>
                    <td className="px-4 py-3">
                      {new Date(course.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
    </div>
  ):<Loading/>
}

export default MyCourses
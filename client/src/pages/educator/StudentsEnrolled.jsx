import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'
import axios from 'axios'

const StudentsEnrolled = () => {

  const {backednUrl:backendUrl,isEducator,getToken}=useContext(AppContext)
  const [enrolledStudents,setEnrolledStudents]=useState(null)
  const fetchEnrolledStudents=async()=>{
    try {
      const token=await getToken();
      const {data}=await axios.get(`${backendUrl}/api/educator/enrolled-students`,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }else{
        toast.error('Failed to fetch enrolled students')
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    }
  }

  useEffect(()=>{
    if(!isEducator){
      return;
    }
    fetchEnrolledStudents()
  },[isEducator])

  return enrolledStudents?(
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-[#0a0a12]">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-[#11111e] border border-gray-700/50">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4 text-gray-300">
          <thead className="text-white border-b border-gray-700/50 text-sm text-left bg-gray-800/40">
            <tr>
              <th className="px-4 py-3 font-bold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-bold">Student Name</th>
              <th className="px-4 py-3 font-bold">Course Title</th>
              <th className="px-4 py-3 font-bold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition">
                <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-500">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3 text-gray-200">
                  <img
                    src={item.student?.imageUrl || "https://via.placeholder.com/150"}
                    alt=""
                    className="w-9 h-9 rounded-full border border-gray-700/50"/>
                  <span className="truncate">{item.student?.name || "Student"}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ):<Loading/>
}

export default StudentsEnrolled
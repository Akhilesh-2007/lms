import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {
  
  const {backednUrl:backendUrl,isEducator,getToken,currency}=useContext(AppContext)
  const [dashboardData,setDashboardData]=useState(null)

  const fetchDashboardData=async()=>{
    try {
      const token=await getToken();
      const {data}=await axios.get(`${backendUrl}/api/educator/dashboard`,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      if(data.success){
        setDashboardData(data.dashboardData)
      }else{
        toast.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    }
  }

  useEffect(()=>{
    if(!isEducator){
      return;
    }
    fetchDashboardData()
  },[isEducator])

  return dashboardData ?(
    <div className='min-h-screen flex flex-col items-start justify-between gap-8
    md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          <div className="flex items-center gap-4 shadow-card border border-blue-500/20 p-5 w-64 rounded-md bg-[#11111e] hover:border-blue-500/40 transition-all duration-300">
            <img src={assets.patients_icon} alt="patients_icon" className='invert brightness-125' />
            <div>
              <p className="text-3xl font-bold text-white">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-sm text-gray-400 font-medium">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shadow-card border border-blue-500/20 p-5 w-64 rounded-md bg-[#11111e] hover:border-blue-500/40 transition-all duration-300">
            <img src={assets.appointments_icon} alt="appointments_icon" className='invert brightness-125' />
            <div>
              <p className="text-3xl font-bold text-white">
                {dashboardData.totalCourses}
              </p>
              <p className="text-sm text-gray-400 font-medium">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shadow-card border border-blue-500/20 p-5 w-64 rounded-md bg-[#11111e] hover:border-blue-500/40 transition-all duration-300">
            <img src={assets.earning_icon} alt="earning_icon" className='invert brightness-125' />
            <div>
              <p className="text-3xl font-bold text-white">{currency}
                {dashboardData.totalEarnings}
              </p>
              <p className="text-sm text-gray-400 font-medium">Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-xl font-bold text-white">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-[#11111e] border border-gray-700/50">
            <table className="table-fixed md:table-auto w-full overflow-hidden text-gray-300">
              <thead className="text-gray-100 border-b border-gray-700/50 text-sm text-left bg-gray-800/40">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-400">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition">
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-500">
                    {index + 1}</td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3 text-gray-200">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border border-gray-700"/>
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                  ))}
              </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  ):<Loading/>
}

export default Dashboard
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {Line} from 'rc-progress'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyEnrollments = () => {

  const {enrolledCourses,calculateCourseDuration,navigate,userData,fetchUserEnrolledCourses,backednUrl:backendUrl,getToken,calculateNoOfLecture}=useContext(AppContext)

  const getCourseProgress=async()=>{
    try {
      const token=await getToken();
      const tempProgressArray=await Promise.all(
        enrolledCourses.map(async(course)=>{
          const {data}=await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId:course._id}
            ,{headers:{
              Authorization:`Bearer ${token}`
            }})
            let totalLectures=calculateNoOfLecture(course);
            const lectureCompleted=data.progressData?data.progressData.lectureCompleted.length:0;
            return {lectureCompleted,totalLectures}
        })
      )
      setprogressArray(tempProgressArray);
    } catch (error) {
      toast.error('Failed to fetch course progress')
    }
  }


  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses();
    }
  },[userData])

  useEffect(()=>{
    if(enrolledCourses.length>0){
      getCourseProgress();
    }
  },[enrolledCourses])

  const getFirstLectureUrl = (course) => {
    const courseContent = Array.isArray(course?.courseContent) ? course.courseContent : []
    for (const chapter of courseContent) {
      const chapterContent = Array.isArray(chapter?.chapterContent) ? chapter.chapterContent : []
      for (const lecture of chapterContent) {
        if (typeof lecture?.lectureUrl === 'string' && lecture.lectureUrl.trim()) return lecture.lectureUrl
        if (typeof lecture?.lectureurl === 'string' && lecture.lectureurl.trim()) return lecture.lectureurl
      }
    }
    return ''
  }

  const getYoutubeThumbnail = (url) => {
    if (typeof url !== 'string' || !url.trim()) return ''
    const cleanUrl = url.trim()
    let videoId = ''

    if (cleanUrl.includes('youtu.be/')) {
      videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (cleanUrl.includes('youtube.com/watch')) {
      videoId = cleanUrl.split('v=')[1]?.split('&')[0] || ''
    } else if (cleanUrl.includes('youtube.com/embed/')) {
      videoId = cleanUrl.split('embed/')[1]?.split('?')[0] || ''
    }

    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
  }

  const isInvalidThumbnail = (thumbnail) => {
    if (typeof thumbnail !== 'string' || !thumbnail.trim()) return true
    const lower = thumbnail.trim().toLowerCase()
    const iconMarkers = ['arrow_icon', 'down_arrow_icon', 'play_icon', 'dropdown_icon', 'cross_icon']
    if (iconMarkers.some((marker) => lower.includes(marker))) return true
    if ((lower.includes('.svg') || lower.includes('image/svg')) && !lower.includes('cloudinary')) return true
    return false
  }

  const resolveCourseThumbnail = (course) => {
    if (!isInvalidThumbnail(course?.courseThumbnail)) {
      return course.courseThumbnail.trim()
    }
    const firstLectureUrl = getFirstLectureUrl(course)
    return getYoutubeThumbnail(firstLectureUrl) || assets.course_1_thumbnail
  }

  const[progressArray,setprogressArray]=useState([
    
  ])

  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>
      <table className='md:table-auto table-fixed w-full overflow-hidden border
      mt-10'>
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm
        text-left max-sm:hidden'>
          <tr>
            <th className='px-4 py-3 font-semibold truncate'>Course</th>
            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
            <th className='px-4 py-3 font-semibold truncate'>Status</th>
          </tr>
        </thead>
        <tbody className='text-gray-700'>
          {
            enrolledCourses.map((course,index)=>{
              const thumbnailSrc = resolveCourseThumbnail(course)

              return (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img
                    src={thumbnailSrc}
                    alt={course.courseTitle || 'Course thumbnail'}
                    className='w-14 h-10 sm:w-24 sm:h-14 md:w-28 md:h-16 object-cover rounded'
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = assets.course_1_thumbnail
                    }}
                  />
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                    <Line strokeWidth={2} percent={progressArray[index]?
                      (progressArray[index].lectureCompleted*100)/progressArray[index].totalLectures:0
                    } className='bg-gray-300 rounded-full'/>
                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                 {progressArray[index] && `${progressArray[index].
                 lectureCompleted}/${progressArray[index].
                 totalLectures}`} <span>Lectures</span>
                </td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600
                  max-sm:text-xs text-white' onClick={()=>navigate('/player/'+course
                    ._id
                  )}>
                    {progressArray[index] && progressArray[index].lectureCompleted/
                    progressArray[index].totalLectures==1 ? 'Completed':'On Going'}
                    </button>
                </td>
              </tr>
            )})
          }
        </tbody>
      </table>
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrollments

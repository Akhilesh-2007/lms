import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const Player = () => {

  const {enrolledCourses,calculateChapterTime,backednUrl,getToken,userData,fetchUserEnrolledCourses}=useContext(AppContext)
  const {courseId}=useParams()
  const [courseData,setCourseData]=useState(null)
  const [openSection,setOpenSection]=useState({})
  const [playerData,setPlayerData]=useState(null)
  const [progressData,setProgressData]=useState({ lectureCompleted: [] })
  const [initialRating,setInitialRating]=useState(0)

  const getLectureUrl = (lecture) => lecture?.lectureUrl || lecture?.lectureurl || ''

  const getFirstLectureUrl = (course) => {
    const courseContent = Array.isArray(course?.courseContent) ? course.courseContent : []
    for (const chapter of courseContent) {
      const chapterContent = Array.isArray(chapter?.chapterContent) ? chapter.chapterContent : []
      for (const lecture of chapterContent) {
        const url = getLectureUrl(lecture)
        if (typeof url === 'string' && url.trim()) return url
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

  const getCourseData=()=>{
    enrolledCourses.forEach((course)=>{
      if(course._id===courseId){
        setCourseData(course)
        course.courseRatings.forEach((item)=>{
          if(item.userid===userData?._id){
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const toggleSection=(index)=>{
  setOpenSection((prev)=>(
    {...prev,
      [index]:!prev[index],
    }
    ));
  };

  useEffect(()=>{
    if(enrolledCourses.length>0){
    getCourseData()
    }
  },[enrolledCourses])
 
  const markLectureComplete=async(lectureId)=>{
    try {
      const token=await getToken()
      const {data}=await axios.post(`${backednUrl}/api/user/update-course-progress`,{
        courseId,
        lectureId,
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data.success){
        toast.success('Lecture marked as complete')
        getCourseProgress()
      }
      else{
        toast.error('Failed to mark lecture as complete')
      }
    } catch (error) {
      console.error('Error marking lecture as complete:', error)
    }
  }

  const getCourseProgress=async()=>{
    try {
      const token=await getToken();
      const {data}=await axios.post(`${backednUrl}/api/user/get-course-progress`,{courseId}
        ,{headers:{
          Authorization:`Bearer ${token}`
        }})
        if(data.success){
          setProgressData(data.progressData || { lectureCompleted: [] })
        }else{
          toast.error('Failed to fetch course progress')
        }
    } catch (error) {
      console.error('Error fetching course progress:', error)
    }
  }

    const handleRate=async(rating)=>{
      try {
        const token=await getToken();
        const {data}=await axios.post(`${backednUrl}/api/user/add-rating`,{
          courseId,
          rating
        },{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        if(data.success){
          toast.success('Rating submitted successfully')
          fetchUserEnrolledCourses();
        }else{
          toast.error('Failed to submit rating')
        }
      } catch (error) {
        toast.error('An error occurred while submitting the rating')
      }
    }

  useEffect(()=>{
    if(courseId){
      getCourseProgress();
    }
  },[courseId])

  return courseData?(
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10
    md:px-36'>
        {/*left column*/}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          <div className='pt-5'>
              {courseData && Array.isArray(courseData.courseContent) && courseData.courseContent.map((chapter,index)=>(
                <div
                    key={index}
                    className="mb-3 border border-gray-300 bg-white rounded-lg
                    hover:shadow-sm transition">
                    <div
                      className="flex items-center justify-between px-4 py-3
                      cursor-pointer select-none" onClick={()=> toggleSection(index)}>
                      <div className="flex items-center gap-3">
                        <img
                          src={assets.down_arrow_icon}
                          alt="arrow_icon"
                          className={`transform transition-transform ${openSection
                            [index] ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                        <p className="font-medium md:text-base text-sm text-gray-800">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                      </p>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300
                    ${
                      openSection[index] ? 'max-h-96' : 'max-h-0'
                    }`}>
                      <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
                      border-t border-gray-300'>
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className='flex items-start gap-2 py-1'>
                            <img src={progressData?.lectureCompleted?.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}alt='play icon'  className='w-4 h-4 mt-1 ml-2' />
                            <div className='flex item-center justify-between w-full
                            text-gray-800 text-xs md:text-default'>
                              <p>{lecture.lectureTitle}</p>
                              <div className='flex gap-2'>
                                {getLectureUrl(lecture) && <p 
                                onClick={()=>setPlayerData({
                                  ...lecture,chapter:index+1,lecture:i+1,lectureUrl:getLectureUrl(lecture)
                                })}
                                className='text-blue-500 cursor-pointer'>Watch</p>}
                                <p>{humanizeDuration(lecture.lectureDuration*60*1000,{units:['h','m']})}</p>
                              </div>
                            </div>    
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              ))}
            </div>
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate}/>
          </div>
        </div>
        {/*right column*/}
        <div className='md:mt-10'>
          {playerData?(
            <div>
              <YouTube
                      videoId={playerData.lectureUrl.split('/').pop()}
                      iframeClassName="w-full aspect-video"
              />
              <div className='flex justify-between items-center mt-1'>
                <p>{playerData.chapter}.{playerData.lecture}.{playerData.lectureTitle}</p>
                <button onClick={()=>markLectureComplete(playerData.lectureId)} className='text-blue-600'>{progressData?.lectureCompleted?.includes(playerData.lectureId)?'Completed':'Mark Complete'}</button>
              </div>
            </div>
          )
          :
          <img
            src={resolveCourseThumbnail(courseData)}
            alt={courseData?.courseTitle || 'Course thumbnail'}
            className='w-full aspect-video object-cover rounded'
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = assets.course_1_thumbnail
            }}
          />
          }
        </div>
    </div>
    <Footer/>
    </>
  ):<Loading/>
}

export default Player

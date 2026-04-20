import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { useContext } from 'react'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'

const CourseDetails = () => {

  const {id}=useParams()
  
  const [courseData,setCourseData]=useState(null)
  const [openSection,setOpenSection]=useState({})
  const [isAlreadyEnrolled,setIsAlreadyEnrolled]=useState(false)
  const [playerData,setPlayerData]=useState(null)
  
  const {allCourses,calculateRating,calculateNoOfLecture,calculateChapterTime
    ,calculateCourseDuration,currency,backednUrl:backendUrl,userData,getToken}=useContext(AppContext)

  const fetchCourseData=async()=>{
    try {
      const {data}=await axios.get(backendUrl+'/api/course/'+id);
      if(data.success){
        setCourseData(data.courseData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const enrollCourse=async()=>{
    try {
      if(!userData){
        return toast.warn('Login to Enroll')
      }
      if(isAlreadyEnrolled){
        return toast.warn('Already Enrolled')
      }
      const token=await getToken()
      const {data}=await axios.post(backendUrl+'/api/user/purchase',{
        courseId:courseData._id,
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data.success){
        const {session_url}=data
        window.location.replace(session_url)
      }else{
        toast.error(data.message)
      } 
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])
  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses?.includes(courseData._id))
    }
  }, [userData,courseData])


const toggleSection=(index)=>{
  setOpenSection((prev)=>(
    {...prev,
      [index]:!prev[index],
    }
    ));
}

  return courseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start
    justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

      <div className='absolute top-0 left-0 w-full h-section-height -z-1 
      bg-gradient-to-b from-blue-950/40 to-transparent'></div>

      {/*left column*/ }
      <div className='max-w-xl z-10 text-gray-300'>
        <h1 className='md:text-course-details-heading-large
        text-course-details-heading-small font-bold text-white'>{courseData.
        courseTitle}</h1>
        <p className='pt-4 md:text-base text-sm' 
        dangerouslySetInnerHTML={{__html:courseData.courseDescription.slice(0,200)}}></p>

        {/*review and ratings*/}
          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
              <p className='text-gray-200 font-medium'>{calculateRating(courseData)}</p>
              <div className='flex'>
               {[...Array(5)].map((_,i)=>(<img key={i} src={i<Math.floor(calculateRating(courseData)) ? assets.star 
                : assets.star_blank} alt="star" className='w-3.5 h-3.5'/>))}
            </div>
            <p className='text-blue-400 font-medium'>({courseData.courseRatings.length} {courseData.
              courseRatings.length>1?'ratings':'rating'})</p>

            <p className='text-gray-400'>{courseData.enrolledStudents.length}{courseData.enrolledStudents.length
              >1 ? 'students':'student'}</p>
          </div>
          <p className='text-sm text-gray-400'>Course by <span className='text-blue-400 underline font-medium cursor-pointer'>Trainly</span></p>
          <div className='pt-8'>
              <h2 className='text-xl font-semibold text-gray-200'>Course Structure</h2>
              <div className='pt-5'>
                {courseData.courseContent.map((chapter,index)=>(
                  <div
                      key={index}
                      className="mb-3 border border-gray-700/50 bg-gray-800/30 rounded-lg
                      hover:border-gray-600 transition">
                      <div
                        className="flex items-center justify-between px-4 py-3
                        cursor-pointer select-none" onClick={()=> toggleSection(index)}>
                        <div className="flex items-center gap-3">
                          <img
                            src={assets.down_arrow_icon}
                            alt="arrow_icon"
                            className={`transform transition-transform invert opacity-60 ${openSection
                              [index] ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                          <p className="font-semibold md:text-base text-sm text-gray-100">
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
                        <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-400
                        border-t border-gray-700/50'>
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex items-start gap-2 py-1'>
                              <img src={assets.play_icon}alt='play icon'  className='w-4 h-4 mt-1 ml-2 opacity-60' />
                              <div className='flex item-center justify-between w-full
                              text-xs md:text-default'>
                                <p className='text-gray-200 font-medium'>{lecture.lectureTitle}</p>
                                <div className='flex gap-2'>
                                  {lecture.isPreviewFree && <p 
                                  onClick={()=>setPlayerData({
                                    videoId: lecture.lectureUrl.includes('youtu.be/') ? lecture.lectureUrl.split('youtu.be/')[1].split('?')[0] : lecture.lectureUrl.includes('v=') ? lecture.lectureUrl.split('v=')[1].split('&')[0] : lecture.lectureUrl.split('/').pop()
                                  })}
                                  className='text-blue-400 cursor-pointer hover:text-blue-300'>Preview</p>}
                                  <p className='text-gray-500'>{humanizeDuration(lecture.lectureDuration*60*1000,{units:['h','m']})}</p>
                                </div>
                              </div>    
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                ))}
              </div>
          </div>
        <div className='py-20 text-sm md:text-default'>
          <h3 className='text-xl font-semibold text-gray-200'>Course Description</h3>
          <p className='pt-3 rich-text' 
        dangerouslySetInnerHTML=
        {{__html:courseData.courseDescription}}></p>
        </div>

      </div>
      {/*right column*/ }
      <div
        className="
        max-w-course-card z-10 bg-gray-800/60 rounded-lg overflow-hidden
        shadow-lg border border-gray-700/50 min-w-[300px] sm:min-w-[420px] backdrop-blur-sm">
            {
                playerData ? (
                  <div className="w-full h-56 overflow-hidden bg-black">
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{ playerVars: { autoplay: 1 } }}
                      iframeClassName="w-full h-full"
                    />
                  </div>
                ) : (
                  <img
                    src={courseData.courseThumbnail}
                    alt="course thumbnail"
                    className="w-full h-56 object-cover"
                  />
                )
              }
        <div className='p-5'>
          <div className='flex items-center gap-2'>
            <img  className='w-3.5' src={assets.time_left_clock_icon}
            alt="time left click icon"/>
            <p className='text-red-400'><span className='font-medium'>5 days</span> left at this price!</p>
          </div>

          <div className='flex gap-3 items-center pt-2'>
            <p className='md:text-4xl text-2xl font-bold text-white'>{currency}{(courseData.coursePrice - courseData.discount*
              courseData.coursePrice/100).toFixed(2)}</p>
            <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
            <p className='md:text-lg text-gray-400 font-medium'>{courseData.discount}% off</p>
          </div>
        <div className='flex items-center text-sm md:text-default gap-4 pt-2
          md:pt-4 text-gray-400'>
          <div className='flex items-center gap-1'>
              <img src={assets.star} alt="star icon"/>
              <p>{calculateRating(courseData)}</p>
            </div>
            <div className='h-4 w-px bg-gray-600'></div>
              <div className='flex items-center gap-1'>
              <img src={assets.time_clock_icon} alt="time icon"/>
              <p>{calculateCourseDuration(courseData)}</p>
            </div>
            <div className='h-4 w-px bg-gray-600'></div>
            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="lesson_icon"/>
              <p>{calculateNoOfLecture(courseData)} lessons</p>
            </div>
          </div>
          <button onClick={enrollCourse} className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600
          text-white font-medium hover:bg-blue-500 transition'>{isAlreadyEnrolled?'Already Enrolled':'Enroll Now'}</button>
          <div className='pt-6'>
            <p className='md:text-xl text-lg font-medium text-gray-200'>Whats in the course?</p>
            <ul className='ml-4 pt-2 text-sm md:text-default list-disc
            text-gray-400'>
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certificate of completion.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  ):<Loading />
}

export default CourseDetails
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const backednUrl=import.meta.env.VITE_BACKEND_URL;
  const currency=import.meta.env.VITE_CURRENCY;
  const navigate=useNavigate()

  const {getToken}=useAuth()
  const {user}=useUser()

  const [allCourses,setAllCourses]=useState([]);
  const [isEducator,setIsEducator]=useState(false);
  const [enrolledCourses,setEnrolledCourses]=useState([]);
  const [userData,setUserData]=useState([]);
  const [recommendations,setRecommendations]=useState([]);

  const fetchAllCourses=async()=>{
    try {
      const {data}=await axios.get(backednUrl+'/api/course/all')
      if(data.success){
        setAllCourses(data.courses)
      }else{
          toast.error('Failed to fetch courses')
      }
    } catch (error) {
          toast.error('Failed to fetch all courses',error)
    }
  }
//fetch userdata
const fetchUserData=async()=>{

  if(user.publicMetadata.role==='educator'){
    setIsEducator(true)
  }

  try {
    const token=await getToken()
    const {data}=await axios.get(backednUrl+'/api/user/data',{
      headers:{Authorization:`Bearer ${token}`}
    })
    if(data.success){
      setUserData(data.user)
      }else{
        toast.error('Failed to fetch user data')
      }
    }
  catch (error) {
    console.error('Failed to fetch user data',error)
  }
}





  const fetchRecommendations=async()=>{
    try {
      const token=await getToken()
      const response=await fetch(`${backednUrl}/api/user/recommendations`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      const data=await response.json()
      if(data.success){
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Failed to fetch recommendations',error)
    }
  }

  //function to calucate avg rating of score
  const calculateRating=(course)=>{
    if(course.courseRatings.length===0) {return 0;}
    let totalRating=0
    course.courseRatings.forEach(rating=>{
      totalRating+=rating.rating
    })
    return Math.floor(totalRating/course.courseRatings.length);
  }

  //function to caluclate course chapter time
  const calculateChapterTime=(chapter)=>{
    let time=0;
    if (!Array.isArray(chapter?.chapterContent)) return humanizeDuration(0,{units:['h','m']})
    chapter.chapterContent.forEach((lecture)=>{
      const duration = Number(lecture?.lectureDuration ?? lecture?.duration ?? 0)
      time += Number.isFinite(duration) ? duration : 0
    })
    return humanizeDuration(time*60*1000,{units:['h','m']});
  }
 
  //function to caluclate course duration
  const calculateCourseDuration=(course)=>{
    let time=0;
    if (!Array.isArray(course?.courseContent)) return humanizeDuration(0,{units:['h','m']})
    course.courseContent.forEach((chapter)=> {
      if (!Array.isArray(chapter?.chapterContent)) return
      chapter.chapterContent.forEach((lecture)=>{
        const duration = Number(lecture?.lectureDuration ?? lecture?.duration ?? 0)
        time += Number.isFinite(duration) ? duration : 0
      })
    })
    return humanizeDuration(time*60*1000,{units:['h','m']});
  }


  //function to calculate to no of lectures in the course
  const calculateNoOfLecture=(course)=>{
    let totalLectures=0;
    course.courseContent.forEach(chapter=>{
      if(Array.isArray(chapter.chapterContent)){
        totalLectures+=chapter.chapterContent.length;
      }
    });
    return totalLectures;
  }

  //Fetch user enrolled courses
  const fetchUserEnrolledCourses=async()=>{
    try {
        const token=await getToken()
    const {data}=await axios.get(backednUrl+'/api/user/enrolled-courses',{
      headers:{Authorization:`Bearer ${token}`}
    })
    if(data.success){
      setEnrolledCourses(data.enrolledCourses.reverse())
    }else{
      toast.error('Failed to fetch enrolled courses')
    } 
    } catch (error) {
      toast.error('Failed to fetch enrolled courses',error)
    }
  }

  useEffect(()=>{
    fetchAllCourses()
    fetchRecommendations()
  },[])


  useEffect(()=>{
    if(user){
      fetchUserData()
      fetchUserEnrolledCourses()
    }
  },[user])

  const value = { currency, allCourses, navigate,calculateRating,calculateChapterTime
    ,calculateCourseDuration,calculateNoOfLecture,isEducator,setIsEducator, fetchAllCourses
  ,enrolledCourses,fetchUserEnrolledCourses,recommendations,fetchRecommendations,backednUrl,userData,setUserData,getToken};

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

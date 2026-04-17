import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from '@clerk/clerk-react'
export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const currency=import.meta.env.VITE_CURRENCY;
  const navigate=useNavigate()

  const {getToken}=useAuth()
  const {user}=useUser()

  const [allCourses,setAllCourses]=useState([]);
  const [isEducator,setIsEducator]=useState(true);
  const [enrolledCourses,setEnrolledCourses]=useState([]);
  const [recommendations,setRecommendations]=useState([]);

  const fetchAllCourses=async()=>{
    setAllCourses(dummyCourses)
  }

  const fetchRecommendations=async()=>{
    try {
      const token=await getToken()
      const response=await fetch('http://localhost:5000/api/user/recommendations',{
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
    return totalRating/course.courseRatings.length;
  }

  //function to caluclate course chapter time
  const calculateChapterTime=(chapter)=>{
    let time=0;
    chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
    return humanizeDuration(time*60*1000,{units:['h','m']});
  }
 
  //function to caluclate course duration
  const calculateCourseDuration=(course)=>{
    let time=0;
    course.courseContent.map((chapter)=> chapter.chapterContent.map(
      (lecture)=>time+=lecture.lectureDuration))
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
    setEnrolledCourses(dummyCourses)
  }

  useEffect(()=>{
    fetchAllCourses()
    fetchUserEnrolledCourses()
    fetchRecommendations()
  },[])

  const logToken=async()=>{
    console.log(await getToken());
  }

  useEffect(()=>{
    if(user){
      logToken()
    }
  },[user])

  const value = { currency, allCourses, navigate,calculateRating,calculateChapterTime
    ,calculateCourseDuration,calculateNoOfLecture,isEducator,setIsEducator, fetchAllCourses
  ,enrolledCourses,fetchUserEnrolledCourses,recommendations,fetchRecommendations};

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
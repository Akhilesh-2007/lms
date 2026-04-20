import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CourseSection from '../../components/student/CourseSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import { AppContext } from '../../context/AppContext'
import CourseCard from '../../components/student/CourseCard'

const Home = () => {
  const { recommendations } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center space-y-7'>
        <Hero />
        {recommendations.length > 0 && (
          <div className="w-full px-8 md:px-40 py-12 bg-gradient-to-b from-blue-950/20 to-transparent">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Recommended for You
              </h2>
              <p className="text-sm md:text-base text-gray-300 mt-3 font-medium">
                Based on your learning preferences and enrolled courses
              </p>
            </div>
            <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>
        )}
        <Companies/>
        <CourseSection/>
        <TestimonialsSection/>
        <CallToAction/>
        <Footer/>
    </div>
  )
}

export default Home
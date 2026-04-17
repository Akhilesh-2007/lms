import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CourseSection = () => {
  const { allCourses } = useContext(AppContext)

  return (
    <div className="py-16 px-8 md:px-40">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-Medium text-gray-900">
          Learn from the best
        </h2>

        <p className="text-sm md:text-base text-gray-500 mt-4 leading-relaxed">
          Learn from our best courses across coding, design, business, and wellness —
          created to deliver practical outcomes.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-4
        gap-6 mt-12">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-block
          text-gray-700 border border-gray-300
          px-8 py-3 rounded-md text-sm font-medium
          hover:bg-gray-50 transition"
        >
          Show all courses
        </Link>
      </div>

    </div>
  )
}

export default CourseSection
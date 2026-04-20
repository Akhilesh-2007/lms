import React from 'react'
import Footer from '../../components/student/Footer'

const AboutUs = () => {
  return (
    <>
      <div className='md:px-36 px-8 pt-10 pb-20 min-h-screen bg-[#0a0a12]'>
        <h1 className='text-3xl font-bold text-white'>About Us</h1>

        <div className='mt-8 space-y-6 text-gray-300 leading-relaxed max-w-3xl'>
          <p>
            Welcome to <span className='text-blue-400 font-bold'>Trainly</span> — your 
            path to mastery. We are a team of passionate educators and technologists who believe 
            that quality education should be accessible to everyone, everywhere.
          </p>

          <div>
            <h2 className='text-xl font-bold text-white mb-3'>Our Mission</h2>
            <p>
              To empower learners around the world by providing expert-led, practical courses 
              that help them develop real-world skills. Whether you're starting your career or 
              leveling up, Trainly is built to meet you where you are.
            </p>
          </div>

          <div>
            <h2 className='text-xl font-bold text-white mb-3'>What We Offer</h2>
            <ul className='list-disc ml-6 space-y-2'>
              <li>Expert-led courses in coding, design, business, and more</li>
              <li>Lifetime access with free updates</li>
              <li>Hands-on projects and practical learning paths</li>
              <li>A supportive community of learners and mentors</li>
              <li>Certificates of completion to showcase your skills</li>
            </ul>
          </div>

          <div>
            <h2 className='text-xl font-bold text-white mb-3'>Our Story</h2>
            <p>
              Trainly was born from a simple idea: learning should be engaging, affordable, 
              and outcome-driven. Founded in 2026, we've grown to serve thousands of students 
              across the globe with courses taught by industry professionals who care about 
              your success.
            </p>
          </div>

          <div>
            <h2 className='text-xl font-bold text-white mb-3'>Why Choose Trainly?</h2>
            <div className='grid md:grid-cols-3 gap-6 mt-4'>
              <div className='border border-gray-700/50 rounded-lg p-5 bg-[#11111e] hover:border-blue-500/40 transition shadow-lg shadow-black/20'>
                <h3 className='font-bold text-white mb-2'>🎯 Learn by Doing</h3>
                <p className='text-sm text-gray-400'>Real-world projects and hands-on exercises in every course.</p>
              </div>
              <div className='border border-gray-700/50 rounded-lg p-5 bg-[#11111e] hover:border-blue-500/40 transition shadow-lg shadow-black/20'>
                <h3 className='font-bold text-white mb-2'>⏰ Learn at Your Pace</h3>
                <p className='text-sm text-gray-400'>Lifetime access means no deadlines and no pressure.</p>
              </div>
              <div className='border border-gray-700/50 rounded-lg p-5 bg-[#11111e] hover:border-blue-500/40 transition shadow-lg shadow-black/20'>
                <h3 className='font-bold text-white mb-2'>🏆 Get Certified</h3>
                <p className='text-sm text-gray-400'>Earn certificates to boost your resume and portfolio.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs

import React, { useState } from 'react'
import { dummyTestimonial, assets } from '../../assets/assets'

const TestimonialsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="text-center py-16 px-6">
      <h2 className="text-3xl md:text-4xl font-medium text-white">
        Testimonials
      </h2>

      <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Discover real stories from learners who transformed their skills and achieved
        success with the help of our platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-800/40 p-6 rounded-lg border border-gray-700/50 text-left transition-all duration-300 hover:border-gray-600"
          >
            <div className="flex items-center gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h3 className="text-lg font-medium text-gray-100">
                  {testimonial.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-4"
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                {testimonial.feedback}
              </p>

              {/* Expandable extended feedback */}
              <div className={`overflow-hidden transition-all duration-300 ${
                expandedIndex === index ? 'max-h-96 mt-4' : 'max-h-0'
              }`}>
                <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-700/50 pt-4 italic">
                  {testimonial.extendedFeedback}
                </p>
              </div>
            </div>
            <button 
              onClick={() => toggleReadMore(index)}
              className='text-blue-400 font-medium px-0 mt-4 text-sm hover:text-blue-300 transition cursor-pointer flex items-center gap-1'>
              {expandedIndex === index ? 'Show less' : 'Read more'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
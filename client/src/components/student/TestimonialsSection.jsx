import React from 'react'
import { dummyTestimonial, assets } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className="text-center py-16 px-6">
      <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
        Testimonials
      </h2>

      <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
        Discover real stories from learners who transformed their skills and achieved
        success with the help of our platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-[0px_4px_15px_0px] shadow-black/5 text-left"
          >
            <div className="flex items-center gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h3 className="text-lg font-medium text-gray-800">
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
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {testimonial.feedback}
              </p>
            </div>
            <a href="#" className='text-blue-500 underline px-5'>Read more</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
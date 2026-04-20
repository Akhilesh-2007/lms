import React, { useState } from 'react'
import Footer from '../../components/student/Footer'
import { toast } from 'react-toastify'

const ContactUs = () => {

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Thank you for reaching out! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <div className='md:px-36 px-8 pt-10 pb-20 min-h-screen bg-[#0a0a12]'>
        <h1 className='text-3xl font-bold text-white'>Contact Us</h1>
        <p className='text-gray-300 mt-4 max-w-xl leading-relaxed'>Have a question or feedback? We'd love to hear from you.</p>

        <div className='mt-8 grid md:grid-cols-2 gap-12 max-w-5xl'>
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-bold text-gray-200 mb-2'>Name *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full border border-gray-700 rounded-md px-4 py-2.5 text-sm bg-gray-800/60 text-gray-200
                outline-none focus:border-blue-500 transition placeholder-gray-500'
                placeholder='Your full name'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-200 mb-2'>Email *</label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='w-full border border-gray-700 rounded-md px-4 py-2.5 text-sm bg-gray-800/60 text-gray-200
                outline-none focus:border-blue-500 transition placeholder-gray-500'
                placeholder='your@email.com'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-200 mb-2'>Subject</label>
              <input
                type='text'
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className='w-full border border-gray-700 rounded-md px-4 py-2.5 text-sm bg-gray-800/60 text-gray-200
                outline-none focus:border-blue-500 transition placeholder-gray-500'
                placeholder='What is this about?'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-200 mb-2'>Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className='w-full border border-gray-700 rounded-md px-4 py-2.5 text-sm bg-gray-800/60 text-gray-200
                outline-none focus:border-blue-500 transition resize-none placeholder-gray-500'
                placeholder='Tell us what you need help with...'
              />
            </div>

            <button type='submit' className='bg-blue-600 text-white px-10 py-3 rounded-md
            font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20'>
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-xl font-semibold text-gray-200 mb-4'>Get in Touch</h2>
              <div className='space-y-4 text-gray-400'>
                <div className='flex items-start gap-3'>
                  <span className='text-xl'>📧</span>
                  <div>
                    <p className='font-medium text-gray-200'>Email</p>
                    <p className='text-sm'>support@trainly.com</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-xl'>📍</span>
                  <div>
                    <p className='font-medium text-gray-200'>Location</p>
                    <p className='text-sm'>Hyderabad, India</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <span className='text-xl'>⏰</span>
                  <div>
                    <p className='font-medium text-gray-200'>Business Hours</p>
                    <p className='text-sm'>Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='border border-gray-700/50 rounded-lg p-5 bg-blue-950/30'>
              <h3 className='font-semibold text-gray-200 mb-2'>💡 Quick Help</h3>
              <p className='text-sm text-gray-400'>
                For course-related issues, try our AI chatbot at the bottom-right corner 
                of any page for instant answers!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ContactUs

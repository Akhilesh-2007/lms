import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address')
      return
    }
    toast.success('Thank you for subscribing! 🎉')
    setEmail('')
  }

  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32
      py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={assets.logo} alt="logo" className="h-10 w-auto object-contain invert"/>
          <p className='mt-6 text-center md:text-left text-sm text-white/70 leading-relaxed'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text.
          </p>
          <div className='flex items-center gap-4 mt-6'>
            <a href="#" className='group transition-all opacity-60 hover:opacity-100'>
              <img src={assets.facebook_icon} alt="facebook_icon" className='invert brightness-125 w-6' />
            </a>
            <a href="#" className='group transition-all opacity-60 hover:opacity-100'>
              <img src={assets.instagram_icon} alt="instagram_icon" className='invert brightness-125 w-6' />
            </a>
            <a href="#" className='group transition-all opacity-60 hover:opacity-100'>
              <img src={assets.twitter_icon} alt="twitter_icon" className='invert brightness-125 w-6' />
            </a>
          </div>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80
          md:space-y-2'>
            <li><Link to="/" className='hover:text-white transition'>Home</Link></li>
            <li><Link to="/about-us" className='hover:text-white transition'>About Us</Link></li>
            <li><Link to="/contact-us" className='hover:text-white transition'>Contact Us</Link></li>
            <li><Link to="/privacy-policy" className='hover:text-white transition'>Privacy Policy</Link></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-white/80 text-sm'>The latest news, articles, and resources,
          sent to your inbox weekly</p>
          <form onSubmit={handleSubscribe} className='flex items-center gap-2 pt-4'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-white
              placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm
              focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="w-24 h-9 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2026 © Trainly. All Rights Reserved.</p>
    </footer>
  )
}

export default Footer
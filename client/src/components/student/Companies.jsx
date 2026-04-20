import React from 'react'
import { assets } from '../../assets/assets'
const Companies = () => {
  return (
    <div className='pt-16 px-8 md:px-0'>
        <p className='text-sm md:text-base text-gray-500 font-medium'>Trusted by learners from leading companies</p>
        <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16
        md:mt-10 mt-5'>
          <img src={assets.microsoft_logo} alt="Microsoft" className="w-20 md:w-28 brightness-0 invert opacity-60 hover:opacity-100 transition duration-300"/>
          <img src={assets.walmart_logo} alt="Walmart" className="w-20 md:w-28 brightness-0 invert opacity-60 hover:opacity-100 transition duration-300"/>
          <img src={assets.accenture_logo} alt="Accenture" className="w-20 md:w-28 brightness-0 invert opacity-60 hover:opacity-100 transition duration-300"/>
          <img src={assets.adobe_logo} alt="Adobe" className="w-20 md:w-28 brightness-0 invert opacity-60 hover:opacity-100 transition duration-300"/>
          <img src={assets.paypal_logo} alt="PayPal" className="w-20 md:w-28 brightness-0 invert opacity-60 hover:opacity-100 transition duration-300"/>
        </div>
    </div>
  )
}

export default Companies
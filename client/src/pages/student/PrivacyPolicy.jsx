import React from 'react'
import Footer from '../../components/student/Footer'

const PrivacyPolicy = () => {
  return (
    <>
      <div className='md:px-36 px-8 pt-10 pb-20 min-h-screen bg-[#0a0a12]'>
        <h1 className='text-3xl font-bold text-white'>Privacy Policy</h1>
        <p className='text-gray-400 mt-2 font-medium'>Last updated: April 2026</p>

        <div className='mt-8 space-y-8 text-gray-300 leading-relaxed max-w-3xl'>
          <section>
            <h2 className='text-xl font-bold text-white mb-3'>1. Information We Collect</h2>
            <p>When you use Trainly, we may collect the following information:</p>
            <ul className='list-disc ml-6 mt-2 space-y-1'>
              <li><strong className='text-gray-300'>Personal Information:</strong> Name, email address, and profile picture provided during account registration.</li>
              <li><strong className='text-gray-300'>Payment Information:</strong> Billing details processed securely through Stripe. We do not store your card details.</li>
              <li><strong className='text-gray-300'>Usage Data:</strong> Course progress, ratings, and interaction history to improve your experience.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-3'>2. How We Use Your Information</h2>
            <ul className='list-disc ml-6 space-y-1'>
              <li>To provide and maintain our learning platform</li>
              <li>To process course enrollments and payments</li>
              <li>To track your course progress and provide personalized recommendations</li>
              <li>To communicate updates, new courses, and promotional offers</li>
              <li>To improve our services based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-3'>3. Data Security</h2>
            <p>
              We take the security of your data seriously. All data transmitted to and from Trainly 
              is encrypted using industry-standard SSL/TLS protocols, and our payment processing 
              is handled by Stripe, a PCI-DSS compliant payment provider.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-3'>4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className='list-disc ml-6 mt-2 space-y-1'>
              <li><strong className='text-gray-300'>Clerk:</strong> For secure user authentication and account management</li>
              <li><strong className='text-gray-300'>Stripe:</strong> For payment processing</li>
              <li><strong className='text-gray-300'>Cloudinary:</strong> For media storage and delivery</li>
              <li><strong className='text-gray-300'>YouTube:</strong> For hosting and streaming course videos</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-3'>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className='list-disc ml-6 mt-2 space-y-1'>
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-3'>6. Cookies</h2>
            <p>
              Trainly uses essential cookies to maintain your session and preferences. 
              We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-3'>7. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href='/contact-us' className='text-blue-400 underline'>our Contact page</a> or 
              email us at <span className='text-blue-400'>support@trainly.com</span>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PrivacyPolicy

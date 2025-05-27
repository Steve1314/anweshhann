// src/components/NotFoundRobot.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import image404 from '../../assets/image404.png'

export default function NotFoundRobot() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center max-w-4xl w-full space-y-8 md:space-y-0 md:space-x-12">
        
        {/* Illustration */}
        <img
          src={image404}
          alt="404 Robot"
          className="w-64 md:w-96 flex-shrink-0"
        />

        {/* Text block */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
          <p className="text-xl text-gray-600">Oops… page not found</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full px-6 py-2 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

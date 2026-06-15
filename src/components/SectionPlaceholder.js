'use client'

import SnakeGame from '@/components/SnakeGame'

export default function SectionPlaceholder({ message, showSnake }) {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-lg mx-auto text-center">
          <svg className="w-16 h-16 mx-auto text-[#FF5E1A] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {message ? (
            <p className="text-lg font-semibold text-[#0B1F4B] mb-2">{message}</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-[#0B1F4B] mb-2">New products coming soon!</p>
              <p className="text-sm text-gray-500 mb-6">Our product catalog is being updated right now. While you wait, enjoy a game of Snake!</p>
            </>
          )}
        </div>
        {showSnake && (
          <div className="flex justify-center mt-6">
            <SnakeGame />
          </div>
        )}
      </div>
    </section>
  )
}

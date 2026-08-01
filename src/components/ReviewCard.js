'use client'

export function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(function (star) {
        return (
          <svg
            key={star}
            className={'w-4 h-4 ' + (star <= rating ? 'text-[#FF5E1A]' : 'text-gray-200')}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      })}
    </div>
  )
}

export default function ReviewCard({ name, role, avatar, rating, text, sourceUrl, relativeTime, className }) {
  var initial = (name || '?').charAt(0)
  return (
    <div
      className={
        'flex flex-col bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_32px_rgba(255,94,26,0.1)] transition-shadow duration-300 ' +
        (className || '')
      }
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FF5E1A] to-[#e04a0e] text-white font-bold text-sm shrink-0">
          {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initial}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-[#1b1b1d] truncate">{name}</h4>
          <p className="text-xs text-gray-400 truncate">
            {role}
            {relativeTime ? ' · ' + relativeTime : ''}
          </p>
        </div>
      </div>
      <StarRating rating={rating} />
      <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-3">{text}</p>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-3 text-xs text-[#FF5E1A] hover:underline"
        >
          Read review on Google
        </a>
      )}
    </div>
  )
}

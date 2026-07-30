import React from 'react'
import { Link } from 'react-router-dom'

const FeatureCard = ({ icon, title, description, link, color = 'forest' }) => {
  const content = (
    <div className={`card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full`}>
      <div className={`text-5xl mb-4`}>{icon}</div>
      <h3 className="mb-1 text-lg font-bold text-forest-800">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      {link && (
        <div className={`mt-4 text-${color}-600 font-medium text-sm flex items-center gap-1`}>
          Try Now <span>→</span>
        </div>
      )}
    </div>
  )

  if (link) {
    return <Link to={link} className="block h-full">{content}</Link>
  }
  return content
}

export default FeatureCard
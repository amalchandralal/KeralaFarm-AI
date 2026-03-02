import React from 'react'
import { Link } from 'react-router-dom'

interface FeatureCardProps {
  icon: string
  title: string
  titleMal?: string
  description: string
  link?: string
  color?: string
}

const FeatureCard = ({ icon, title, titleMal, description, link, color = 'forest' }: FeatureCardProps) => {
  const content = (
    <div className={`card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full`}>
      <div className={`text-5xl mb-4`}>{icon}</div>
      <h3 className="text-lg font-bold text-forest-800 mb-1">{title}</h3>
      {titleMal && (
        <p className="text-sm text-forest-600 mb-2" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
          {titleMal}
        </p>
      )}
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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

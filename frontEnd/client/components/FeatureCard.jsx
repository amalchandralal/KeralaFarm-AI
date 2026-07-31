import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, link }) => {
  const content = (
    <div className="flex flex-col h-full p-6 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:-translate-y-[2px]">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-emerald-50 text-emerald-600">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
      <p className="flex-grow text-sm leading-relaxed text-gray-500">{description}</p>
      {link && (
        <div className="flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
          Try Now <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      )}
    </div>
  );

  if (link) {
    return <Link to={link} className="block h-full group">{content}</Link>;
  }
  return <div className="h-full group">{content}</div>;
};

export default FeatureCard;
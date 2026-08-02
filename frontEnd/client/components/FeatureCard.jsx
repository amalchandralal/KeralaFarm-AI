import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ id, icon: Icon, title, description, link }) => {
  const content = (
    <div id={id} className="flex flex-col h-full p-6 transition-all duration-200 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:shadow-md dark:hover:border-slate-700 hover:-translate-y-[2px] scroll-mt-24">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
      <p className="flex-grow text-sm leading-relaxed text-gray-500 dark:text-slate-400">{description}</p>
      {link && (
        <div className="flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
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
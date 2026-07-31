import React from 'react';
import DiseaseScanner from '../components/DiseaseScanner';
import { Info } from 'lucide-react';

const ScanPage = () => {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Disease Scanner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Upload a photo of your crop to instantly detect diseases using AI.
          </p>
        </div>

        {/* Tips Banner */}
        <div className="flex items-start gap-3 p-4 mb-8 border border-gray-200 bg-white rounded-lg shadow-sm">
          <Info className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Scanning Tips</h3>
            <ul className="mt-1 space-y-1 text-sm text-gray-500 list-disc list-inside">
              <li>Ensure good lighting without harsh shadows</li>
              <li>Focus clearly on the affected area of the leaf or stem</li>
              <li>Keep the diseased part centered in the frame</li>
            </ul>
          </div>
        </div>

        {/* Scanner Component */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
          <DiseaseScanner />
        </div>

      </div>
    </div>
  );
};

export default ScanPage;
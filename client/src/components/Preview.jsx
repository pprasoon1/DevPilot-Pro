import React from 'react';

function Preview({ iframeRef }) {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center">
          <div className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-600 inline-block max-w-full truncate">
            <span className="truncate">Preview</span>
          </div>
        </div>
        <div className="w-16"></div> {/* Spacer to balance the layout */}
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}

export default Preview;
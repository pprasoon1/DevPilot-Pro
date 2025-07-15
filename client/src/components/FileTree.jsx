import React, { useState, useEffect } from 'react';

function FileTree({ path, webcontainerInstance, onFileSelect, currentFile }) {
  const [items, setItems] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});

  useEffect(() => {
    async function loadFiles() {
      try {
        const files = await webcontainerInstance.fs.readdir(path);
        // Sort files: directories first, then alphabetically
        const sortedFiles = files.sort((a, b) => {
          const aIsDir = a.isDirectory();
          const bIsDir = b.isDirectory();
          if (aIsDir && !bIsDir) return -1;
          if (!aIsDir && bIsDir) return 1;
          return a.name.localeCompare(b.name);
        });
        setItems(sortedFiles);
      } catch (error) {
        console.error('Error loading files:', error);
      }
    }
    
    if (webcontainerInstance) {
      loadFiles();
    }
  }, [path, webcontainerInstance]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const getFileIcon = (name) => {
    if (name.endsWith('.js') || name.endsWith('.jsx')) {
      return (
        <svg className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    } else if (name.endsWith('.html')) {
      return (
        <svg className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    } else if (name.endsWith('.css')) {
      return (
        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (name.endsWith('.json')) {
      return (
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      );
    } else {
      return (
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  return (
    <ul className="text-sm">
      {items.map((item) => {
        const itemPath = `${path === '/' ? '' : path}/${item.name}`;
        const fullPath = itemPath.startsWith('/') ? itemPath : `/${itemPath}`;
        
        if (item.isDirectory()) {
          const isExpanded = expandedFolders[fullPath];
          return (
            <li key={fullPath} className="mb-1">
              <div 
                className="flex items-center py-1 px-2 rounded hover:bg-gray-700 cursor-pointer"
                onClick={() => toggleFolder(fullPath)}
              >
                <svg 
                  className={`h-4 w-4 mr-1 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="h-4 w-4 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="truncate">{item.name}</span>
              </div>
              {isExpanded && (
                <div className="ml-4 pl-2 border-l border-gray-700 mt-1">
                  <FileTree
                    path={fullPath}
                    webcontainerInstance={webcontainerInstance}
                    onFileSelect={onFileSelect}
                    currentFile={currentFile}
                  />
                </div>
              )}
            </li>
          );
        } else {
          const isActive = fullPath === currentFile;
          return (
            <li key={fullPath} className="mb-1">
              <div 
                className={`flex items-center py-1 px-2 rounded cursor-pointer ${
                  isActive ? 'bg-gray-700 text-pink-400' : 'hover:bg-gray-700'
                }`}
                onClick={() => onFileSelect(fullPath)}
              >
                <span className="mr-1.5">{getFileIcon(item.name)}</span>
                <span className="truncate">{item.name}</span>
              </div>
            </li>
          );
        }
      })}
    </ul>
  );
}

export default FileTree;
import React, { useState, useEffect } from 'react';

function FileTree({ path, webcontainerInstance, onFileSelect }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function loadFiles() {
      try {
        // Read directory entries from WebContainer's file system
        const entries = await webcontainerInstance.fs.readdir(path, { withFileTypes: true });
        
        // Filter out directories named "node_modules"
        const filteredEntries = entries.filter(
          (entry) => !(entry.isDirectory() && entry.name === 'node_modules')
        );
        
        // Set the filtered entries to state
        setFiles(filteredEntries);
      } catch (error) {
        console.error('Error reading directory:', error);
      }
    }

    // Load files if the webcontainerInstance is available
    if (webcontainerInstance) {
      loadFiles();
    }
  }, [path, webcontainerInstance]);

  return (
    <ul>
      {files.map((entry) => (
        <li key={entry.name}>
          {entry.isDirectory() ? (
            <>
              {entry.name}/
              {/* Recursively render subdirectories */}
              <FileTree
                path={`${path}${entry.name}/`}
                webcontainerInstance={webcontainerInstance}
                onFileSelect={onFileSelect}
              />
            </>
          ) : (
            <span
              className="file"
              onClick={() => onFileSelect(`${path}${entry.name}`)}
            >
              {entry.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default FileTree;
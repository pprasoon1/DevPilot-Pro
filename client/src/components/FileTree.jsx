import React, { useState, useEffect } from 'react';

function FileTree({ path, webcontainerInstance, onFileSelect }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function loadFiles() {
      try {
        const entries = await webcontainerInstance.fs.readdir(path, { withFileTypes: true });
        setFiles(entries);
      } catch (error) {
        console.error('Error reading directory:', error);
      }
    }
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
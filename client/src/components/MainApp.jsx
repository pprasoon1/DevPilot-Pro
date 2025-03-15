import React, { useState, useEffect, useRef } from 'react';
import FileTree from './FileTree';
import Editor from './Editor';
import Preview from './Preview';
import Terminal from './Terminal';

function MainApp({ webcontainerInstance, serverUrl, onLogout }) {
  const [currentFile, setCurrentFile] = useState('/index.js');
  const [fileContent, setFileContent] = useState('');
  const terminalRef = useRef(null);
  const iframeRef = useRef(null);

  // Load initial file content when webcontainerInstance is available
  useEffect(() => {
    async function loadInitialFile() {
      if (webcontainerInstance) {
        const initialContent = await webcontainerInstance.fs.readFile('/index.js', 'utf8');
        setFileContent(initialContent);
      }
    }
    loadInitialFile();
  }, [webcontainerInstance]);

  // Update iframe src when serverUrl changes
  useEffect(() => {
    if (iframeRef.current && serverUrl) {
      iframeRef.current.src = serverUrl;
    }
  }, [serverUrl]);

  // Handle file selection from the file tree
  const handleFileSelect = async (filePath) => {
    if (webcontainerInstance) {
      const content = await webcontainerInstance.fs.readFile(filePath, 'utf8');
      setCurrentFile(filePath);
      setFileContent(content);
    }
  };

  // Handle content changes in the editor
  const handleContentChange = async (newContent) => {
    if (webcontainerInstance && currentFile) {
      setFileContent(newContent);
      await webcontainerInstance.fs.writeFile(currentFile, newContent);
    }
  };

  return (
    <div>
      <header>
        <h1>Hello, <span className="wc">WebContainers API</span>!</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      <div className="app-container">
        <div className="file-tree">
          {webcontainerInstance && (
            <FileTree
              path="/"
              webcontainerInstance={webcontainerInstance}
              onFileSelect={handleFileSelect}
            />
          )}
        </div>
        <div className="main-content">
          <div className="container">
            <Editor content={fileContent} onContentChange={handleContentChange} />
            <Preview iframeRef={iframeRef} />
          </div>
          <Terminal terminalRef={terminalRef} webcontainerInstance={webcontainerInstance} />
        </div>
      </div>
    </div>
  );
}

export default MainApp;
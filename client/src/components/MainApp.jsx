import React, { useState, useEffect, useRef } from 'react';
import FileTree from './FileTree';
import Editor from './Editor';
import Preview from './Preview';
import Terminal from './Terminal';

const BACKEND_URL =import.meta.env.MODE === 'development' ? 'http://localhost:5000' :"/"; // External backend URL

function MainApp({ webcontainerInstance, serverUrl, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentFile, setCurrentFile] = useState('/index.js');
  const [fileContent, setFileContent] = useState('');
  const terminalRef = useRef(null);
  const iframeRef = useRef(null);

  // **Fetch user's projects when the component mounts**
  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/api/projects`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0]); // Select the first project by default
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchProjects();
  }, []);

  // **Load selected project's files into WebContainer**
  useEffect(() => {
    async function loadProject() {
      if (selectedProject && webcontainerInstance) {
        try {
          await webcontainerInstance.mount(selectedProject.files);
          const initialContent =
            (await webcontainerInstance.fs.readFile('/index.js', 'utf8')) || '';
          setCurrentFile('/index.js');
          setFileContent(initialContent);
        } catch (error) {
          console.error('Error loading project files:', error);
        }
      }
    }
    loadProject();
  }, [selectedProject, webcontainerInstance]);

  // **Update iframe src when serverUrl changes**
  useEffect(() => {
    if (iframeRef.current && serverUrl) {
      iframeRef.current.src = serverUrl;
    }
  }, [serverUrl]);

  // **Handle file selection from the file tree**
  const handleFileSelect = async (filePath) => {
    if (webcontainerInstance) {
      try {
        const content = await webcontainerInstance.fs.readFile(filePath, 'utf8');
        setCurrentFile(filePath);
        setFileContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  // **Handle content changes in the editor and sync with backend**
  const handleContentChange = async (newContent) => {
    if (webcontainerInstance && currentFile && selectedProject) {
      setFileContent(newContent);
      await webcontainerInstance.fs.writeFile(currentFile, newContent);

      // Immediately update the backend with the changed file
      const updatedFiles = {
        ...selectedProject.files,
        [currentFile]: newContent,
      };
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/api/projects/${selectedProject._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: selectedProject.name, files: updatedFiles }),
        });
        if (!res.ok) throw new Error('Failed to save file');
        console.log('File saved successfully to backend');
        // Update local state with the new files
        setSelectedProject({ ...selectedProject, files: updatedFiles });
      } catch (error) {
        console.error('Error saving file to backend:', error);
      }
    }
  };

  // **Create a new project**
  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const newProjectName = `Project ${projects.length + 1}`;
      const defaultFiles = {
        '/index.js': 'console.log("Hello, World!");',
      };
      const res = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newProjectName, files: defaultFiles }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      const newProject = await res.json();
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // **Save the current project (manual save for all files)**
  const handleSaveProject = async () => {
    if (!selectedProject || !webcontainerInstance) return;
    try {
      const files = await webcontainerInstance.fs.readdir('/', { recursive: true });
      const fileTree = {};
      for (const file of files) {
        if (file.isFile()) {
          fileTree[file.path] = await webcontainerInstance.fs.readFile(file.path, 'utf8');
        }
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/projects/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: selectedProject.name, files: fileTree }),
      });
      if (!res.ok) throw new Error('Failed to save project');
      const updatedProject = await res.json();
      setSelectedProject(updatedProject);
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  // **Handle project selection**
  const handleSelectProject = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
  };

  return (
    <div>
      <header>
        <h1>
          Hello, <span className="wc">WebContainers API</span>!
        </h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      {/* **Project Management Section** */}
      <div className="project-management">
        <h2>Your Projects</h2>
        <select
          value={selectedProject?._id || ''}
          onChange={(e) => handleSelectProject(e.target.value)}
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateProject}>Create New Project</button>
        <button onClick={handleSaveProject} disabled={!selectedProject}>
          Save Current Project
        </button>
      </div>

      {/* **Main Application Layout** */}
      <div className="app-container">
        <div className="file-tree">
          {webcontainerInstance && selectedProject && (
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
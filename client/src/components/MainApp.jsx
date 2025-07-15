import React, { useState, useEffect, useRef } from 'react';
import FileTree from './FileTree';
import Editor from './Editor';
import Preview from './Preview';
import Terminal from './Terminal';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000'; // Adjust this to match your backend URL

function MainApp({ webcontainerInstance, serverUrl, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentFile, setCurrentFile] = useState('/index.js');
  const [fileContent, setFileContent] = useState('');
  const [eduProjects, setEduProjects] = useState([]);
  const [selectedEduProject, setSelectedEduProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'

  const terminalRef = useRef(null);
  const iframeRef = useRef(null);

  // Fetch user's projects when the component mounts
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

  // Fetch educational projects
  useEffect(() => {
    async function fetchEduProjects() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/eduProjects`);
        if (!res.ok) throw new Error('Failed to fetch educational projects');
        const data = await res.json();
        setEduProjects(data);
      } catch (error) {
        console.error('Error fetching educational projects:', error);
      }
    }
    fetchEduProjects();
  }, []);

  // Load selected project's files into WebContainer
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

  // Update iframe src when serverUrl changes
  useEffect(() => {
    if (iframeRef.current && serverUrl) {
      iframeRef.current.src = serverUrl;
    }
  }, [serverUrl]);

  // Handle file selection from the file tree
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

  // Handle content changes in the editor and sync with backend
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
        setSelectedProject({ ...selectedProject, files: updatedFiles });
      } catch (error) {
        console.error('Error saving file to backend:', error);
      }
    }
  };

  // Create a new project
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

  // Save the current project (manual save for all files)
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

  // Handle project selection
  const handleSelectProject = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
  };

  // Start an educational project
  const handleStartEduProject = async (eduProjectId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/projects/startEdu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ eduProjectId }),
      });
      if (!res.ok) throw new Error('Failed to start educational project');
      const newProject = await res.json();
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setSelectedEduProject(eduProjects.find((ep) => ep._id === eduProjectId));
      setCurrentStep(0);
    } catch (error) {
      console.error('Error starting educational project:', error);
    }
  };

  // Handle next step with AI evaluation
  const handleNextStep = async () => {
    if (!selectedEduProject || !selectedProject) return;

    const step = selectedEduProject.steps[currentStep];
    const fileTree = await readFileTree();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          stepDescription: step.description,
          fileTree,
        }),
      });
      if (!res.ok) throw new Error('Failed to evaluate code');
      const { feedback } = await res.json();
      setFeedback(feedback);
    } catch (error) {
      console.error('Error evaluating code:', error);
      setFeedback('Error evaluating your code. Please try again.');
    }

    // Proceed to next step
    const nextStep = currentStep + 1;
    if (nextStep < selectedEduProject.steps.length) {
      setCurrentStep(nextStep);
    } else {
      setFeedback('Congratulations! You have completed all steps.');
    }
  };

  // Read the current file tree from WebContainer
  const readFileTree = async () => {
    if (!webcontainerInstance) return {};
    
    const fileTree = {};
    try {
      // Get all files recursively
      const files = await webcontainerInstance.fs.readdir('/', { recursive: true });
      
      for (const file of files) {
        try {
          // Check if this is a file (not a directory)
          if (!file.name.endsWith('/')) {
            const filePath = file.path;
            // Read the file content
            const content = await webcontainerInstance.fs.readFile(filePath, 'utf8');
            fileTree[filePath] = content;
          }
        } catch (error) {
          console.warn(`Error processing file ${file.path}:`, error);
        }
      }
    } catch (error) {
      console.error('Error reading file tree:', error);
    }
    
    return fileTree;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <svg className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              DevPilot-Pro
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleSaveProject} 
            disabled={!selectedProject}
            className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
          
          <div className="relative group">
            <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
              <span className="text-sm font-medium">JS</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-700">
              <button 
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
              <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                Settings
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-gray-800 border-r border-gray-700 w-64 flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          {/* Project Selection */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-400 uppercase">Projects</h2>
              <button 
                onClick={handleCreateProject}
                className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400"
                title="Create New Project"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <select
              value={selectedProject?._id || ''}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="" disabled>Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Educational Projects */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">Learn</h2>
            <select
              onChange={(e) => e.target.value && handleStartEduProject(e.target.value)}
              value={selectedEduProject?._id || ''}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Start a tutorial</option>
              {eduProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          
          {/* File Explorer */}
          <div className="flex-1 overflow-y-auto p-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">Files</h2>
            {webcontainerInstance && selectedProject && (
              <FileTree
                path="/"
                webcontainerInstance={webcontainerInstance}
                onFileSelect={handleFileSelect}
                currentFile={currentFile}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tutorial Steps Panel (if educational project is selected) */}
          {selectedEduProject && selectedProject && selectedProject.isEducational && (
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">
                  Step {currentStep + 1}/{selectedEduProject.steps.length}: 
                  <span className="ml-2 text-gray-300">{selectedEduProject.steps[currentStep].title || 'Current Step'}</span>
                </h3>
                <button 
                  onClick={handleNextStep}
                  className="px-3 py-1.5 rounded-md bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors"
                >
                  Next Step
                </button>
              </div>
              <p className="text-gray-300 mb-2">{selectedEduProject.steps[currentStep].description}</p>
              <div className="bg-gray-900 p-3 rounded-md text-sm text-gray-300">
                <p>{selectedEduProject.steps[currentStep].documentation}</p>
              </div>
            </div>
          )}
          
          {/* Feedback Panel */}
          {feedback && (
            <div className="bg-indigo-900/50 border-b border-indigo-700 p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-indigo-300 mb-1">AI Feedback</h3>
                    <p className="text-gray-300 text-sm">{feedback}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFeedback('')}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Editor/Preview Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 flex">
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'editor' 
                  ? 'border-pink-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'preview' 
                  ? 'border-pink-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <div className="ml-auto flex items-center">
              <span className="text-xs text-gray-500">{currentFile}</span>
            </div>
          </div>
          
          {/* Editor/Preview Content */}
          <div className="flex-1 overflow-hidden">
            <div className={`h-full ${activeTab === 'editor' ? 'block' : 'hidden'}`}>
              <Editor content={fileContent} onContentChange={handleContentChange} />
            </div>
            <div className={`h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
              <Preview iframeRef={iframeRef} />
            </div>
          </div>
          
          {/* Terminal */}
          <div className="h-1/3 border-t border-gray-700 bg-gray-900 overflow-hidden">
            <div className="bg-gray-800 px-4 py-1 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-300">Terminal</h3>
              <button className="text-gray-500 hover:text-gray-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
            <Terminal terminalRef={terminalRef} webcontainerInstance={webcontainerInstance} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainApp;
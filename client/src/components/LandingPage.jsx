import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowButton } from "devjunkie-buttons";
function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8">
      {/* Modern navbar with subtle accent */}
      <nav className="w-full max-w-7xl backdrop-blur-lg bg-black/80 rounded-xl p-4 mb-8 shadow-lg border border-purple-900/30 fixed top-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-white">DevPilot-Pro</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-300 hover:text-purple-400 transition">Testimonials</a>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white transition border border-gray-800">
              Login
            </Link>
       
            <Link to="/register" >
            <ArrowButton>Get Started</ArrowButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section with striking contrast */}
      <div className="w-full max-w-7xl mt-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Escape Tutorial Hell with <span className="text-purple-600">AI-Powered</span> Learning
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            DevPilot-Pro is an EdTech platform that helps students learn coding by building real projects with the guidance of agentic AI. Break free from endless tutorials and start creating.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="px-8 py-4 rounded-xl bg-purple-900 text-white font-bold text-center hover:bg-purple-800 transition shadow-lg">
              Start Your Journey
            </Link>
            <a href="#how-it-works" className="px-8 py-4 rounded-xl bg-black text-white text-center border border-purple-900/50 hover:bg-gray-900 transition">
              Learn More
            </a>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-900 to-red-900 rounded-2xl blur opacity-50"></div>
            <div className="relative bg-black p-6 rounded-2xl border border-purple-900/30">
              <pre className="text-purple-400 font-mono text-sm">
                <code>
{`// DevPilot-Pro Project
function HelloWorld() {
  console.log("Start your coding journey!");
  
  // AI assistant helps you learn
  // by building real projects
  return (
    <div className="success">
      Tutorial Hell: Escaped!
    </div>
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features section with clean design */}
      <div id="features" className="w-full max-w-7xl mt-32">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">Why Choose DevPilot-Pro?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-900 p-6 rounded-xl border border-purple-900/30 hover:transform hover:scale-105 transition duration-300">
            <div className="bg-gradient-to-br from-purple-900 to-red-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Learn by Building</h3>
            <p className="text-gray-400">
              No more passive learning. Build real projects from day one with guidance that adapts to your skill level.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-gray-900 p-6 rounded-xl border border-purple-900/30 hover:transform hover:scale-105 transition duration-300">
            <div className="bg-gradient-to-br from-purple-900 to-red-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Assistance</h3>
            <p className="text-gray-400">
              Our intelligent AI guides you through challenges, provides feedback, and helps you overcome obstacles.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-gray-900 p-6 rounded-xl border border-purple-900/30 hover:transform hover:scale-105 transition duration-300">
            <div className="bg-gradient-to-br from-purple-900 to-red-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Project Portfolio</h3>
            <p className="text-gray-400">
              Build a portfolio of real projects that demonstrate your skills to potential employers.
            </p>
          </div>
        </div>
      </div>

      {/* How it works section with sleek timeline */}
      <div id="how-it-works" className="w-full max-w-7xl mt-32">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">How It Works</h2>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-900 to-red-900 hidden md:block"></div>
          
          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 text-right">
                <h3 className="text-2xl font-bold text-white mb-4">Choose a Project</h3>
                <p className="text-gray-400">
                  Browse our library of projects across different difficulty levels and technologies. From web apps to games, find something that excites you.
                </p>
              </div>
              <div className="md:w-12 relative flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-900 to-red-900 flex items-center justify-center text-white font-bold text-xl z-10">1</div>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <div className="bg-gray-900 p-4 rounded-xl border border-purple-900/30">
                  <img src="https://via.placeholder.com/400x200" alt="Choose a project" className="rounded-lg w-full" />
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 text-right md:order-1">
                <div className="bg-gray-900 p-4 rounded-xl border border-purple-900/30">
                  <img src="https://via.placeholder.com/400x200" alt="Build with AI guidance" className="rounded-lg w-full" />
                </div>
              </div>
              <div className="md:w-12 relative flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-900 to-red-900 flex items-center justify-center text-white font-bold text-xl z-10">2</div>
              </div>
              <div className="md:w-1/2 md:pl-12 md:order-3">
                <h3 className="text-2xl font-bold text-white mb-4">Build with AI Guidance</h3>
                <p className="text-gray-400">
                  Our AI assistant breaks down the project into manageable steps, provides hints when you're stuck, and evaluates your code to help you improve.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 text-right">
                <h3 className="text-2xl font-bold text-white mb-4">Showcase Your Work</h3>
                <p className="text-gray-400">
                  Complete projects, earn certificates, and build a portfolio that demonstrates your real-world coding skills to potential employers.
                </p>
              </div>
              <div className="md:w-12 relative flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-900 to-red-900 flex items-center justify-center text-white font-bold text-xl z-10">3</div>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <div className="bg-gray-900 p-4 rounded-xl border border-purple-900/30">
                  <img src="https://via.placeholder.com/400x200" alt="Showcase your work" className="rounded-lg w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials with elegant cards */}
      <div id="testimonials" className="w-full max-w-7xl mt-32">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">What Our Students Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-purple-900/30 relative">
            <div className="absolute -top-5 -left-5 w-10 h-10 bg-gradient-to-br from-purple-900 to-red-900 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-gray-300 italic mb-6">
              "After months of watching tutorials without making real progress, DevPilot-Pro changed everything. Building actual projects with AI guidance helped me land my first developer job!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-red-900 mr-4"></div>
              <div>
                <h4 className="text-white font-bold">Sarah Johnson</h4>
                <p className="text-gray-400 text-sm">Frontend Developer @ Tech Co</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-purple-900/30 relative">
            <div className="absolute -top-5 -left-5 w-10 h-10 bg-gradient-to-br from-purple-900 to-red-900 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-gray-300 italic mb-6">
              "The AI feedback on my code was like having a personal mentor. I learned more in 3 months with DevPilot-Pro than in a year of self-study with tutorials."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-red-900 mr-4"></div>
              <div>
                <h4 className="text-white font-bold">Michael Chen</h4>
                <p className="text-gray-400 text-sm">Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with striking design */}
      <div className="w-full max-w-7xl mt-32 mb-16">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-900 to-red-900 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-black p-12 rounded-2xl border border-purple-900/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Escape Tutorial Hell?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their learning journey with DevPilot-Pro's project-based, AI-guided approach.
            </p>
            <Link to="/register" className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-900 to-red-900 text-white font-bold text-lg inline-block hover:from-purple-800 hover:to-red-800 transition shadow-lg">
              Start Building Today
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl text-center text-gray-500 text-sm">
        <div className="border-t border-gray-800 pt-8 pb-16">
          <p>© 2023 DevPilot-Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
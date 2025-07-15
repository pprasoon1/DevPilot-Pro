import React, { useEffect, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

function Terminal({ terminalRef, webcontainerInstance }) {
  const [status, setStatus] = useState('initializing');

  useEffect(() => {
    if (!terminalRef.current || !webcontainerInstance) {
      setStatus('error');
      return;
    }

    // Clear any existing content
    terminalRef.current.innerHTML = '';

    // Create terminal with minimal options
    const terminal = new XTerm({
      fontFamily: 'monospace',
      fontSize: 14,
      cursorBlink: true,
      rows: 20,
      cols: 80,
      theme: {
        background: '#1a1a1a',
        foreground: '#f8f8f8'
      }
    });

    // Create fit addon
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // Open terminal
    terminal.open(terminalRef.current);
    
    // Initial message
    terminal.write('Terminal initialized.\r\n');
    terminal.write('Note: Shell functionality may be limited in this environment.\r\n\n');
    
    // Create a simple command handler
    let commandBuffer = '';
    
    terminal.onData(data => {
      // Handle backspace
      if (data === '\x7f') {
        if (commandBuffer.length > 0) {
          commandBuffer = commandBuffer.slice(0, -1);
          terminal.write('\b \b');
        }
        return;
      }
      
      // Handle enter key
      if (data === '\r') {
        terminal.write('\r\n');
        
        // Process command
        if (commandBuffer.trim()) {
          processCommand(commandBuffer.trim());
        }
        
        // Reset command buffer and show prompt
        commandBuffer = '';
        terminal.write('$ ');
        return;
      }
      
      // Echo printable characters
      if (data >= ' ' && data <= '~') {
        commandBuffer += data;
        terminal.write(data);
      }
    });
    
    // Simple command processor
    const processCommand = (cmd) => {
      if (cmd === 'clear') {
        terminal.clear();
      } else if (cmd === 'help') {
        terminal.write('Available commands:\r\n');
        terminal.write('  help    - Show this help\r\n');
        terminal.write('  clear   - Clear the terminal\r\n');
        terminal.write('  ls      - List files (simulated)\r\n');
        terminal.write('  echo    - Echo text\r\n');
      } else if (cmd.startsWith('echo ')) {
        terminal.write(cmd.substring(5) + '\r\n');
      } else if (cmd === 'ls') {
        terminal.write('index.js\r\n');
        terminal.write('package.json\r\n');
        terminal.write('node_modules/\r\n');
      } else if (cmd) {
        terminal.write(`Command not found: ${cmd}\r\n`);
      }
    };
    
    // Show initial prompt
    terminal.write('$ ');
    
    // Try to fit terminal
    try {
      fitAddon.fit();
    } catch (e) {
      console.warn('Initial fit failed:', e);
    }

    // Handle resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        try {
          if (terminalRef.current && 
              terminalRef.current.offsetHeight > 0 && 
              terminalRef.current.offsetWidth > 0) {
            fitAddon.fit();
          }
        } catch (e) {
          console.warn('Resize fit failed:', e);
        }
      }, 100);
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(terminalRef.current);
    
    // Also handle window resize
    window.addEventListener('resize', handleResize);
    
    // Focus terminal when clicked
    terminalRef.current.addEventListener('click', () => {
      terminal.focus();
    });
    
    // Focus terminal initially
    setTimeout(() => {
      terminal.focus();
    }, 100);
    
    setStatus('ready');

    // Cleanup function
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      
      try {
        terminal.dispose();
      } catch (e) {
        console.warn('Terminal disposal error:', e);
      }
    };
  }, [terminalRef, webcontainerInstance]);

  return (
    <div className="relative h-full w-full">
      <div 
        ref={terminalRef} 
        className="h-full w-full overflow-hidden" 
        style={{ 
          minHeight: '150px',
          maxHeight: '400px',
          position: 'relative'
        }}
      />
      
      {status === 'initializing' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="text-white text-sm">Initializing terminal...</div>
        </div>
      )}
    </div>
  );
}

export default Terminal;
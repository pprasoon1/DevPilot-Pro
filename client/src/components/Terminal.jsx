import React, { useEffect } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

function Terminal({ terminalRef, webcontainerInstance }) {
  useEffect(() => {
    if (!webcontainerInstance || !terminalRef.current) return;

    const xterm = new XTerm({ convertEol: true });
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    async function startShell() {
      const shellProcess = await webcontainerInstance.spawn('jsh', {
        terminal: { cols: xterm.cols, rows: xterm.rows },
      });
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            xterm.write(data);
          },
        })
      );
      const input = shellProcess.input.getWriter();
      xterm.onData((data) => input.write(data));

      window.addEventListener('resize', () => {
        fitAddon.fit();
        shellProcess.resize({ cols: xterm.cols, rows: xterm.rows });
      });

      return () => {
        window.removeEventListener('resize', () => {});
        shellProcess.kill();
      };
    }
    startShell();

    return () => xterm.dispose();
  }, [webcontainerInstance]);

  return <div className="terminal" ref={terminalRef}></div>;
}

export default Terminal;
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

function Editor({ content, onContentChange }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Set up Monaco editor
    monacoRef.current = monaco.editor.create(editorRef.current, {
      value: content,
      language: getLanguageFromContent(content),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: {
        enabled: true,
        scale: 0.75,
        renderCharacters: false
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      tabSize: 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderIndentGuides: true,
      renderLineHighlight: 'all',
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        useShadows: false
      }
    });

    // Handle content changes
    monacoRef.current.onDidChangeModelContent(() => {
      const newValue = monacoRef.current.getValue();
      onContentChange(newValue);
    });

    // Clean up on unmount
    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, []);

  // Update editor content when content prop changes
  useEffect(() => {
    if (monacoRef.current && content !== monacoRef.current.getValue()) {
      monacoRef.current.setValue(content);
      
      // Update language model based on file content
      const model = monacoRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, getLanguageFromContent(content));
      }
    }
  }, [content]);

  // Determine language based on file content or extension
  const getLanguageFromContent = (content) => {
    // This is a simple implementation - you might want to enhance this
    if (content.includes('<html') || content.includes('<!DOCTYPE html')) {
      return 'html';
    } else if (content.includes('import React') || content.includes('from "react"') || content.includes('from \'react\'')) {
      return 'javascript';
    } else if (content.includes('function') && content.includes('return') && (content.includes('{') || content.includes('('))) {
      return 'javascript';
    } else if (content.includes('class') && content.includes('extends')) {
      return 'javascript';
    } else if (content.includes('@import') || content.includes('margin:') || content.includes('padding:')) {
      return 'css';
    } else {
      return 'plaintext';
    }
  };

  return <div ref={editorRef} className="h-full w-full" />;
}

export default Editor;
import React from 'react';

function Editor({ content, onContentChange }) {
  return (
    <div className="editor">
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </div>
  );
}

export default Editor;
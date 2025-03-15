import React from 'react';

function Preview({ iframeRef }) {
  return (
    <div className="preview">
      <iframe ref={iframeRef} src="/loading.html" title="Preview" />
    </div>
  );
}

export default Preview;
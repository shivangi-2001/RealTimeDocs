// src/TextEditor.js
import React, { useRef, useState } from 'react';

const TextEditor = () => {
  const contentRef = useRef(null);
  const [filename, setFilename] = useState('untitled');

  const formatDoc = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
  };

  const addLink = () => {
    const url = prompt('Insert URL');
    if (url) formatDoc('createLink', url);
  };

  const fileHandle = (value) => {
    if (value === 'new') {
      contentRef.current.innerHTML = '';
      setFilename('untitled');
    } else if (value === 'txt') {
      const blob = new Blob([contentRef.current.innerText]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.txt`;
      link.click();
    } else if (value === 'pdf') {
    //   html2pdf().from(contentRef.current).save(filename);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4">
      <div className="bg-gray-200 p-4 rounded-md">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="border-2 border-gray-300 rounded-md p-2 max-w-xs"
          />
          <select onChange={(e) => fileHandle(e.target.value)}>
            <option value="" hidden disabled>
              File
            </option>
            <option value="new">New file</option>
            <option value="txt">Save as txt</option>
            <option value="pdf">Save as pdf</option>
          </select>
          <select onChange={(e) => formatDoc('formatBlock', e.target.value)}>
            <option value="" hidden disabled>
              Format
            </option>
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map((heading) => (
              <option key={heading} value={heading}>
                {heading.charAt(0).toUpperCase() + heading.slice(1)}
              </option>
            ))}
          </select>
          <select onChange={(e) => formatDoc('fontSize', e.target.value)}>
            <option value="" hidden disabled>
              Font size
            </option>
            {['1', '2', '3', '4', '5', '6', '7', '88'].map((size) => (
              <option key={size} value={size}>
                {['Extra small', 'Small', 'Regular', 'Medium', 'Large', 'Extra Large', 'Big', 'Big-1'][size - 1]}
              </option>
            ))}
          </select>
          {['Color', 'Background'].map((label) => (
            <div key={label} className="flex items-center">
              <span className="mr-2">{label}</span>
              <input
                type="color"
                onChange={(e) => formatDoc(label === 'Color' ? 'foreColor' : 'hiliteColor', e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['undo', 'redo', 'bold', 'underline', 'italic', 'strikethrough', 'align-middle', 'align-left', 'align-right', 'align-justify', 'list-ul', 'list-ol', 'unlink'].map((cmd) => (
            <button key={cmd} onClick={() => formatDoc(cmd)} className="border-2 border-gray-300 rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-300">
              <i className={`bx bx-${cmd}`} />
            </button>
          ))}
          <button onClick={addLink} className="border-2 border-gray-300 rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-300">
            <i className="bx bx-link" />
          </button>
        </div>
      </div>
      <div
        ref={contentRef}
        contentEditable="true"
        suppressContentEditableWarning={true}
        className="border border-gray-300 rounded-md p-4 mt-4 h-60 overflow-auto"
      >
        Lorem, ipsum.
      </div>
    </div>
  );
};

export default TextEditor;

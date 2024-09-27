import React, { useEffect, useRef, useState } from 'react';

const RichTextEditor = () => {
  const writingAreaRef = useRef(null);
  const fontNameRef = useRef(null);
  const fontSizeRef = useRef(null);
  const [fontList] = useState([
    'Arial', 'Verdana', 'Times New Roman', 'Garamond', 'Georgia', 'Courier New', 'cursive',
  ]);

  useEffect(() => {
    const optionsButtons = document.querySelectorAll('.option-button');
    const advancedOptionButton = document.querySelectorAll('.adv-option-button');
    const alignButtons = document.querySelectorAll('.align');
    const spacingButtons = document.querySelectorAll('.spacing');
    const formatButtons = document.querySelectorAll('.format');
    const scriptButtons = document.querySelectorAll('.script');

    // Initialize font options
    fontList.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.innerHTML = value;
      fontNameRef.current.appendChild(option);
    });

    // Populate font size options
    for (let i = 1; i <= 7; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.innerHTML = i;
      fontSizeRef.current.appendChild(option);
    }
    fontSizeRef.current.value = 3;

    // Highlighter logic
    const highlighter = (className, needsRemoval) => {
      className.forEach((button) => {
        button.addEventListener('click', () => {
          if (needsRemoval) {
            let alreadyActive = button.classList.contains('active');
            highlighterRemover(className);
            if (!alreadyActive) {
              button.classList.add('active');
            }
          } else {
            button.classList.toggle('active');
          }
        });
      });
    };

    const highlighterRemover = (className) => {
      className.forEach((button) => {
        button.classList.remove('active');
      });
    };

    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);

    // Event listeners for basic operations
    optionsButtons.forEach((button) => {
      button.addEventListener('click', () => {
        document.execCommand(button.id, false, null);
      });
    });

    // Event listeners for advanced operations
    advancedOptionButton.forEach((button) => {
      button.addEventListener('change', () => {
        document.execCommand(button.id, false, button.value);
      });
    });

    // Link button logic
    document.getElementById('createLink').addEventListener('click', () => {
      let userLink = prompt('Enter a URL');
      userLink = userLink.includes('http') ? userLink : `http://${userLink}`;
      document.execCommand('createLink', false, userLink);
    });
  }, [fontList]);

  return (
    <div className="bg-white w-11/12 mx-auto p-10 rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Text Format */}
        <button id="bold" className="option-button format p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-bold"></i>
        </button>
        <button id="italic" className="option-button format p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-italic"></i>
        </button>
        <button id="underline" className="option-button format p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-underline"></i>
        </button>
        <button id="strikethrough" className="option-button format p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-strikethrough"></i>
        </button>
        <button id="superscript" className="option-button script p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-superscript"></i>
        </button>
        <button id="subscript" className="option-button script p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-subscript"></i>
        </button>

        {/* List */}
        <button id="insertOrderedList" className="option-button p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-list-ol"></i>
        </button>
        <button id="insertUnorderedList" className="option-button p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-list"></i>
        </button>

        {/* Undo/Redo */}
        <button id="undo" className="option-button p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-rotate-left"></i>
        </button>
        <button id="redo" className="option-button p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-rotate-right"></i>
        </button>

        {/* Link */}
        <button id="createLink" className="adv-option-button p-2 rounded bg-white border shadow-sm">
          <i className="fa fa-link"></i>
        </button>
        <button id="unlink" className="option-button p-2 rounded bg-white border shadow-sm">
          <i className="fa fa-unlink"></i>
        </button>

        {/* Alignment */}
        <button id="justifyLeft" className="option-button align p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-align-left"></i>
        </button>
        <button id="justifyCenter" className="option-button align p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-align-center"></i>
        </button>
        <button id="justifyRight" className="option-button align p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-align-right"></i>
        </button>
        <button id="justifyFull" className="option-button align p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-align-justify"></i>
        </button>
        <button id="indent" className="option-button spacing p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-indent"></i>
        </button>
        <button id="outdent" className="option-button spacing p-2 rounded bg-white border shadow-sm">
          <i className="fa-solid fa-outdent"></i>
        </button>

        {/* Headings */}
        <select id="formatBlock" ref={fontNameRef} className="adv-option-button p-2 border rounded shadow-sm">
          {/* Options will be populated by JavaScript */}
        </select>
        <select id="fontSize" ref={fontSizeRef} className="adv-option-button p-2 border rounded shadow-sm">
          {/* Options will be populated by JavaScript */}
        </select>

        {/* Color */}
        <div className="flex items-center gap-2">
          <input type="color" id="foreColor" className="adv-option-button w-10 h-8 border rounded" />
          <label htmlFor="foreColor">Font Color</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="color" id="backColor" className="adv-option-button w-10 h-8 border rounded" />
          <label htmlFor="backColor">Highlight Color</label>
        </div>
      </div>
      <div
        ref={writingAreaRef}
        id="text-input"
        contentEditable="true"
        className="border p-4 h-96"
      ></div>
    </div>
  );
};

export default RichTextEditor;

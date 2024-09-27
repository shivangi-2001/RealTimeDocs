import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const sizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

function FontSize({ formatDoc }) {
  const [fontSize, setFontSize] = useState(16);

  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 1, sizes[sizes.length - 1]));
    applyFontSize(fontSize + 1); // Apply new size immediately
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 1, sizes[0]));
    applyFontSize(fontSize - 1); 
  };

  const applyFontSize = (size) => {
    const selection = document.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      console.log(selection.isCollapsed)
      const range = selection.getRangeAt(0);
      console.log(range)
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;

      selection.removeAllRanges();

      try {
        range.surroundContents(span); 
      } catch (error) {
        console.error("Error applying font size:", error);
        const content = range.extractContents();
        span.appendChild(content);
        range.insertNode(span);
      }

      selection.addRange(range);
    }
  };

  return (
    <div className="flex items-center text-center gap-0.5 w-15">
      <div
        className="p-1 hover:bg-sea-100 rounded-full cursor-pointer hover:shadow"
        onClick={decreaseFontSize}
      >
        <MinusIcon className="w-4 h-4" />
      </div>

      <select 
        className="appearance-none px-1 text-center" 
        value={fontSize} 
        onChange={(e) => {
          const newSize = parseInt(e.target.value);
          setFontSize(newSize);
          applyFontSize(newSize);
        }}
      >
        {sizes.map((s, index) => ( 
          <option key={index} value={s} className="text-center">{s}</option>
        ))}
      </select>

      <div
        className="p-1 hover:bg-sea-100 rounded-full cursor-pointer hover:shadow"
        onClick={increaseFontSize}
      >
        <PlusIcon className="w-4 h-4" />
      </div>
    </div>
  );
}

export default FontSize;

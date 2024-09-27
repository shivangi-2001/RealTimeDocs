import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveState, setSingleActiveState } from "../../feature/pageState";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  BoldIcon,
  ItalicIcon,
  PencilSquareIcon,
  PrinterIcon,
  UnderlineIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import FontFamily from "./FontFamily";
import FontSize from "./fontSize";

const Toolbar = ({ editorRef }) => {
  const dispatch = useDispatch();
  const { activeState, singleActiveState } = useSelector(
    (state) => state.pageState
  );

  const handleActiveState = (key) => {
    dispatch(setActiveState(key));
  };

  const handleSingleActiveState = (key) => {};

  const getButtonClasses = (isActive) => {
    return isActive
      ? "p-1 bg-sky-100 rounded-sm"
      : "p-1 hover:bg-gray-200 rounded-sm";
  };

  const formatDoc = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <React.Fragment>
      <div className="flex gap-3 flex-1 px-5 py-1.5 items-center rounded-full bg-sea-200">
        <button className="border p-1 border-black/100 rounded-md hover:bg-sky-100 bg-sea-100">
          <PrinterIcon width={18} />
        </button>
        <button
          className="border p-1 border-black/100 rounded-md hover:bg-sky-100 bg-sea-100"
          onClick={() => {
            formatDoc("undo");
          }}
        >
          <ArrowUturnLeftIcon width={18} />
        </button>
        <button
          className="border p-1 border-black/100 rounded-md hover:bg-sky-100 bg-sea-100"
          onClick={() => {
            formatDoc("redo");
          }}
        >
          <ArrowUturnRightIcon width={18} />
        </button>

        <div className="border-l border-1 border-black h-5"></div>

        <button
          className={`border p-1 border-black/100 rounded-md ${activeState.bold ? "bg-blue-500 text-white":"hover:bg-sky-100 bg-sea-100"}`}
          onClick={() => {
            formatDoc("bold");
            handleActiveState("bold");
          }}
        >
          <BoldIcon width={18} />
        </button>
        <button
          className={`border p-1 border-black/100 rounded-md ${activeState.italic ? "bg-blue-500 text-white":"hover:bg-sky-100 bg-sea-100"}`}
          onClick={() => {
            formatDoc("italic");
            handleActiveState("italic");
          }}
        >
          <ItalicIcon width={18} />
        </button>
        <button
          className={`border p-1 border-black/100 rounded-md ${activeState.underline ? "bg-blue-500 text-white":"hover:bg-sky-100 bg-sea-100"}`}
          onClick={() => {
            formatDoc("underline");
            handleActiveState("underline");
          }}
        >
          <UnderlineIcon width={18} />
        </button>

        <div className="border-l border-1 border-black h-5"></div>
        
        <FontFamily formatDoc={formatDoc}/>

        <div className="border-l border-1 border-black h-5"></div>
        
        <FontSize formatDoc={formatDoc}/>

        <div className="border-l border-1 border-black h-5"></div>

        <button
          className={`border p-1 border-black/100 rounded-md ${singleActiveState.left ? "bg-blue-500 text-white":"hover:bg-sky-100 bg-sea-100"}`}
          onClick={() => {
            formatDoc("justifyLeft");
            dispatch(setSingleActiveState("left"));
          }}
        >
          <Bars3BottomLeftIcon width={18} />
        </button>
        <button
          className={`border p-1 border-black/100 rounded-md ${singleActiveState.center ? "bg-blue-500 text-white":"hover:bg-sky-100 bg-sea-100"}`}
          onClick={() => {
            formatDoc("justifyCenter");
            dispatch(setSingleActiveState("center"));
          }}
        >
          <Bars3Icon width={18} />
        </button>
        <button
          className={`border p-1 border-black/100 rounded-md ${singleActiveState.right ? "bg-blue-500 text-white":"hover:bg-sky-100 bg-sea-100"}`}
          onClick={() => {
            formatDoc("justifyRight");
            dispatch(setSingleActiveState("right"));
          }}
        >
          <Bars3BottomRightIcon width={18} />
        </button>


        <div className="border-l border-1 border-black h-5"></div>

        <input
          type="color"
          defaultValue={"#000000"}
          onChange={(e) => formatDoc("foreColor", e.target.value)}
        />
      </div>
    </React.Fragment>
  );
};

export default Toolbar;

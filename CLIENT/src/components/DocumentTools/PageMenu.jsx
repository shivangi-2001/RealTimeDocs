import React, { useState, useRef, useEffect } from "react";
import { menu } from "../../utilities/sheet";
import {
  useGetDocMutation,
  useRenameTitleMutation,
} from "../../services/docApi";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import ProfileIcon from "../ProfileIcon";

const PageMenu = ({ id }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRefs = useRef([]);
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  const handleMouseEnter = (index) => {
    setActiveMenu(index);
  };

  const handleMouseLeave = (index) => {
    const submenu = menuRefs.current[index]?.querySelector(".submenu");
    const withinSubmenu = submenu && submenu.contains(document.activeElement);

    if (!withinSubmenu) {
      setActiveMenu(null);
    }
  };

  const [editTitle, setEditTitle] = useState(false);
  const [new_title, setNew_title] = useState("");
  const [getDoc] = useGetDocMutation();

  const DocById = async () => {
    try {
      const doc = await getDoc(id).unwrap();
      if (doc !== null) setNew_title(doc.title || "Untitled Document");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    DocById();
  }, [id]);

  const [Rename] = useRenameTitleMutation();
  const rename_title_document = async () => {
    try {
      const titleToSubmit =
        new_title.trim() === "" ? "Untitled Document" : new_title;
      const doc = await Rename({ id, title: titleToSubmit }).unwrap();
      setNew_title(doc.title);
      setEditTitle(false);
    } catch (error) {
      console.error(error);
    }
  };

  const inputEnter = (e) => {
    if (e.key === "Enter") {
      rename_title_document();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editTitle &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setEditTitle(false);
        rename_title_document();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editTitle, rename_title_document]);

  // Dynamically adjust input width based on span width
  useEffect(() => {
    if (editTitle && inputRef.current && spanRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
    }
  }, [new_title, editTitle]);

  return (
    <React.Fragment>
      <div className="flex flex-1 justify-between items-center">
        <div className="flex">
          <img src="/docs.png" alt="" className="h-10" />
          <div className="grid grid-flow-row align-middle h-9">
            {editTitle ? (
              <div>
                <input
                  type="text"
                  name="rename_title"
                  value={new_title}
                  ref={inputRef}
                  onChange={(e) => setNew_title(e.target.value)}
                  onKeyDown={inputEnter}
                  className="text-sm caret-blue-500 border border-sky-500 focus:outline-none font-semibold bg-white-50 rounded-sm"
                  style={{ width: "auto" }} // This will be dynamically set
                />
                {/* Hidden span for dynamic width */}
                <span
                  ref={spanRef}
                  className="invisible absolute text-sm font-semibold px-2"
                >
                  {new_title}
                </span>
              </div>
            ) : (
              <h3
                className="text-sm font-semibold text-gray-600"
                onDoubleClick={() => {
                  setEditTitle(true);
                }}
              >
                {new_title}
              </h3>
            )}
            <div className="hidden text-xs sm:flex gap-1 font-medium">
              {menu.map((m, index) => (
                <div
                  key={index}
                  ref={(el) => (menuRefs.current[index] = el)}
                  className="relative px-1 py-0.5 hover:cursor-pointer hover:bg-gray-100"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleMouseEnter(index)}
                >
                  <p>{m.name}</p>
                  {m.submenu && activeMenu === index && (
                    <div
                      className="absolute left-0 top-3 mt-2 min-w-48 bg-white shadow-lg divide-y divide-gray-100 rounded-md border border-gray-200 z-10 submenu"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                    >
                      {m.submenu.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          className="px-2 py-1 hover:bg-gray-100 rounded-md flex group w-full items-center divide-x-2 text-md text-gray-700"
                        >
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sharing icons and profile */}
        <div className="flex flex-row items-center gap-3">
          <a href="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </a>
          <a href="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </a>
          <div className="p-1.5 bg-sea-200 rounded-full hover:shadow">
            <UserPlusIcon className="h-5"></UserPlusIcon>
          </div>
          <div>
            <ProfileIcon></ProfileIcon>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PageMenu;

import React, { useRef, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { useGetDocMutation } from "../../services/docApi"
import { useSelector } from 'react-redux';

const TextArea = ({editorRef, id}) => {
  const {activeState} = useSelector(state => state.pageState)
  const [getTitle, setTitle] = useState('')
  const [content, setContent] = useState('');

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      withCredentials: true,
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;

    if (editor) {
      const handleInput = (e) => {
        const newContent = editor.innerHTML;
        console.log(editor.innerHTML)
        if (newContent !== content) { 
          setContent(newContent);
        }
      };

      editor.addEventListener('input', handleInput);

      return () => {
        editor.removeEventListener('input', handleInput);
      };
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("documentMessage", id, getTitle, content );
    }
  }, [content]);

  const [getDoc] = useGetDocMutation();
  const DocById = async () => {
    try {
      const doc = await getDoc(id).unwrap();
      if (doc !== null) {
        console.log("existing doc: ", doc.content);
        setTitle(doc.title);

        if (doc.content === "" || doc.content === null) {
          setContent("<div><br></div>");
          if (editorRef.current) {
            editorRef.current.innerHTML = "<div><br></div>"; 
          }
        } else {
          setContent(doc.content);
          if (editorRef.current) {
            editorRef.current.innerHTML = doc.content;
          }
        }
      }
    }  catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    DocById();
  }, [id]);

  useEffect(() => {
    const editor = editorRef.current;
    console.log(editor.innerHTML , content)
    if (editor && editor.innerHTML !== content) { 
      
      editor.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="mx-auto container">
      <div
        ref={editorRef}
        contentEditable="true"
        suppressContentEditableWarning={true}
        defaultValue={content}
        className='textEditor p-2 border border-gray-300'
      />
    </div>
  );
};

export default TextArea;

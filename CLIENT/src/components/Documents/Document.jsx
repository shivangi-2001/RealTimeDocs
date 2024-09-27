  import React, {useEffect, useRef} from "react";
  import PageMenu from "../DocumentTools/PageMenu";
  import TextArea from "./TextArea";
  import { useParams } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { setDocs } from "../../feature/docState";
  import { useGetDocMutation } from "../../services/docApi";
  import Toolbar from "../DocumentTools/Toolbar";
  import DocsNotFound from "./DocsNotFount";

  const Document = () => {
    const editorRef = useRef(null);
    const {id} = useParams()
    const { docs } = useSelector(state => state.docState)
    const dispatch = useDispatch()
    
    const [getDoc] = useGetDocMutation()

    const DocById = async () => {
      try {
        const doc = await getDoc(id).unwrap();
        if(doc !== null){
          dispatch(setDocs(doc))
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      DocById();
    }, [id]); 


    return (
      <React.Fragment>
        {docs?.id === -1 ? <DocsNotFound/>: <>
          <div
          className="flex flex-col p-2.5 mb-8 shadow-lg gap-1 bg-sea-50"
        >
          <PageMenu id={id} />
          <Toolbar editorRef={editorRef} />
        </div>

        <div className="overflow-x-scroll textEditor1">
          <TextArea editorRef={editorRef} id={id}></TextArea>
        </div></>}
      </React.Fragment>
    );
  };

  export default Document;

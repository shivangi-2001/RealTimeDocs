import { Link, useNavigate } from "react-router-dom";
import { sheet } from "../utilities/sheet";
import { useDispatch, useSelector } from "react-redux";
import { setPageCounter } from "../feature/pageState";
import { useInitDocMutation } from "../services/docApi";
import React from "react";
import SavedDocs from "./SavedDocs";
import Navbar from "./Navbar";

const Index = () => {
  document.title = "Document";
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { pageTitle } = useSelector((state) => state.pageState);
  const [initDoc, { isError: newDocError }] = useInitDocMutation();

  const NewDocument = async () => {
    try {
      const new_doc = await initDoc({ title: pageTitle }).unwrap();
      console.log("Document created:", new_doc);
      dispatch(setPageCounter())
      navigate(`/${new_doc.id}`)
      
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <React.Fragment>
      <Navbar/>
      <div className="p-6 min-w-96 bg-sea-200" >
        <div className="container mx-auto">
          {newDocError && (
            <p className="text-red-500">Something Went Wrong !</p>
          )}
          <h4 className="text-sm">Start a new document</h4>
          <div className="flex gap-4 py-5">
            <div
              onClick={NewDocument}
              className="cursor-pointer"
            >
              <img
                src="/thumbnail-Add.jpg"
                alt=""
                className="min-w-24 w-28 h-32 border rounded-sm border-gray-400 hover:border-blue-500"
              />
              <p className="text-xxs-xs py-1 font-semibold ml-0.5">
                Blank document
              </p>
            </div>
            {sheet.map((s, index) => (
              <div key={index}>
                <img
                  src={s.thumbnail}
                  alt=""
                  className="min-w-22 h-32 border rounded-sm border-gray-400 hover:border-blue-500"
                />
                <p className="text-xxs-xs py-1 font-semibold capitalize ml-0.5">
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto my-8">
        <h3 className="text-sm font-semibold">Recent Files</h3>
        <SavedDocs />
      </div>
    </React.Fragment>
  );
};

export default Index;

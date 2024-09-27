import { Fragment, useState, useEffect } from "react";
import { useAllDocMutation, useDeleteDocMutation } from "../services/docApi";
import { Link } from "react-router-dom";
import { Menu, Transition, MenuItem, MenuButton } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString() + " - " + date.toLocaleTimeString()
}

const SavedDocs = () => {
  const [savedDoc, setSavedDoc] = useState(null);

  const [AllDoc, { isError: getAllDocError }] = useAllDocMutation();

  const getAllDoc = async () => {
    const savedDoc = await AllDoc().unwrap();
    setSavedDoc(savedDoc);
  };

  useEffect(() => {
    getAllDoc();
  }, []);

  const [DeleteDoc] = useDeleteDocMutation();
  const DeleteDocument = async (id) => {
    try {
      await DeleteDoc(id).unwrap();
      getAllDoc(); // Refresh the document list after deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative my-6">
      {getAllDocError && (
        <p className="text-red-600 text-sm">Error: Failed to fetch documents</p>
      )}
      {savedDoc &&
        savedDoc.map((doc, index) => (
          <Fragment key={index}>
            <div className="relative grid grid-cols-12 items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer">
              {/* Image */}
              <div className="col-span-1">
                <img src="/docs.png" alt="" className="h-6" />
              </div>

              {/* Document Title */}
              <Link to={`/${doc.id}`} className="col-span-6 text-xs font-semibold text-left">
                {doc.title}
              </Link>

              {/* Document Date */}
              <span className="col-span-4 text-gray-500 text-xs">
                {doc.updatedAt ? formatDateTime(doc.updatedAt): formatDateTime(doc.createdAt)}
              </span>

              {/* Dropdown Menu */}
              <div className="col-span-1 text-right">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="inline-flex justify-center rounded-full p-1.5 hover:shadow-md focus:outline-none hover:bg-sea-100 ">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-28 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <li
                            onClick={() => DeleteDocument(doc.id)}  // Delete document by its ID
                            className={`${
                              active ? "bg-gray-100" : ""
                            } block px-4 py-1.5 text-sm text-black hover:bg-sea-200`}
                          >
                            Delete
                          </li>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <li
                            className={`${
                              active ? "bg-gray-100" : ""
                            } block px-4 py-1.5 text-sm text-black hover:bg-sea-200`}
                          >
                            Open
                          </li>
                        )}
                      </MenuItem>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
            <hr className="border-t border-gray-300" />
          </Fragment>
        ))}
    </div>
  );
};

export default SavedDocs;

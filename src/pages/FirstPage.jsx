import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWizardCount } from "../redux/slices/wizardCountSlice";
import { setTemplateId, setTemplateTitle } from "../redux/slices/dataSlice";
import DataService from "../service/DataService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClone,
  faEdit,
  faEye,
  faShareSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../page components/ConfirmationModal";
import toast from "react-hot-toast";
import { icon } from "@fortawesome/fontawesome-svg-core";

const FirstPage = () => {
  const dispatch = useDispatch();
  const [isExisting, setIsExisting] = useState(true);
  const [inputValue, setInputValue] = useState(1);
  const [name, setName] = useState("");
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [templateIdToRemove, setTemplateIdToRemove] = useState(null);

  useEffect(() => {
    DataService.getData()
      .then((response) => {
        setTemplates(response.data || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCreateClick = () => {
    setIsExisting(false);
  };

  const handleTemplateClick = () => {
    setIsExisting(true);
  };

  const handleDeleteClick = (id) => {
    setTemplateIdToRemove(id);
    setIsOpen(true);
  };

  const handleDuplicate = (id) => {
    DataService.duplicateData(id).then((response) =>
      console.log(response.data)
    );
    toast.success("Template Copied Successfully!");
  };

  const handleCreateWizard = () => {
    dispatch(setTemplateId());
    dispatch(setWizardCount(inputValue));
    dispatch(setTemplateTitle(name));
    navigate("/create");
  };

  const handleDeleteTemplate = () => {
    const updatedTemplates = templates.filter(
      (template) => template.id !== templateIdToRemove
    );
    setTemplates(updatedTemplates);
    DataService.deleteData(templateIdToRemove)
      .then((response) => console.log("Deleted", response))
      .catch((err) => console.log(err));

    setTemplateIdToRemove(null);
    setIsOpen(false);
    toast.success("Template Deleted Successfully!");
  };

  const handleClick = (id) => {
    dispatch(setTemplateId(id));
  };

  const renderTemplateList = () => {
    return (
      <div className="mb-10">
        <div
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2
            lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 justify-center"
        >
          {templates.map((template) => (
            <div key={template.id} className="relative group">
              <div className="flex bg-white rounded-lg shadow-lg text-black font-semibold justify-center items-center h-80 w-40 group-hover:opacity-50 transition-opacity">
                <div className=" flex items-center justify-center w-36">
                  {template.templateTitle}
                </div>
              </div>
              <div className="absolute bg-black/50 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity rounded-md">
                <button
                  onClick={() =>
                    navigate(`/preview/${template.templateId}/1`, {
                      state: { isPreview: true },
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon={faEye}
                    className="text-white text-2xl"
                  />
                </button>
                <button
                  className="h-10 w-10 rounded-md text-white bg-red-600 text-lg mr-2.5 hover:text-red-600 hover:bg-white
                  absolute bottom-2 right-12"
                  onClick={() => handleDeleteClick(template.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <Link
                  to={`/edit/${template.templateId}`}
                  onClick={() => handleClick(template.templateId)}
                >
                  <button
                    className="h-10 w-10 rounded-md text-white bg-blue-700 text-lg hover:text-blue-700 hover:bg-white
                  absolute bottom-2 left-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </Link>
                <button
                  className="h-10 w-10 rounded-md text-white bg-blue-700 text-lg hover:text-blue-700 hover:bg-white
                  absolute bottom-2 right-2"
                  onClick={() => handleDuplicate(template.templateId)}
                >
                  <FontAwesomeIcon icon={faClone} />
                </button>
                <Link to={`/form/${template.templateId}/1`}>
                  <button
                    className="h-10 w-10 rounded-md text-white bg-blue-700 text-lg hover:text-blue-700 hover:bg-white
                  absolute top-2 right-2"
                  >
                    <FontAwesomeIcon icon={faShareSquare} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-gray-400 min-h-screen items-center align-middle">
      <div
        className={`mt-6 p-4 rounded-sm bg-white cursor-pointer ${
          isExisting ? "scale-75" : ""
        }`}
      >
        <div
          onClick={handleCreateClick}
          className="text-black text-xl font-bold"
        >
          Create a new wizard
        </div>
      </div>
      <div
        className={`mt-6 p-4 rounded-sm bg-white cursor-pointer ${
          isExisting ? "" : "scale-75"
        }`}
      >
        <div
          onClick={handleTemplateClick}
          className="text-black text-xl font-bold"
        >
          My Templates (or) Wizards
        </div>
      </div>
      <div className="mt-6">
        {isExisting ? (
          renderTemplateList()
        ) : (
          <div className="flex flex-col items-center bg-white w-full px-2 lg:w-96 h-44 rounded-md shadow-lg">
            <div className="text-black text-lg font-semibold mb-6 mt-2">
              Create Wizard Page
            </div>
            <label className="relative">
              <input
                type="text"
                name="Template Title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-80 text-md border-2 rounded-lg
                border-black border-opacity-50 outline-none focus:border-blue-600 text-black
                transition duration-200"
              />
              <span
                className={`text-lg text-black text-opacity-80 absolute left-1 top-3 ${
                  name
                    ? "left-1 scale-90 -translate-y-7 transition duration-300"
                    : "top-1.5"
                }
                px-2 transition duration-200 hover:cursor-text bg-white rounded`}
              >
                Template Title
              </span>
            </label>
            <input
              type="number"
              placeholder="Enter the number of wizards..."
              min="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-12 w-80 text-md border-2 rounded-lg
                border-black border-opacity-50 outline-none focus:border-white text-black
                transition duration-200 mt-3"
            />
            <button
              className="font-semibold py-2 px-4 w-44 h-12 bg-white text-black focus:scale-105 shadow-md
               hover:bg-black hover:text-white mt-2 rounded-md"
              onClick={handleCreateWizard}
            >
              Generate
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        onConfirm={() => handleDeleteTemplate()}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};

export default FirstPage;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setWizardCount } from "../redux/slices/wizardCountSlice";
// import { setTemplateId, setTemplateTitle } from "../redux/slices/dataSlice";
// import DataService from "../service/DataService";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faClone,
//   faEdit,
//   faEye,
//   faTrashAlt,
// } from "@fortawesome/free-solid-svg-icons";

// const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
//   const modalClasses = isOpen ? "fixed inset-0 z-10 overflow-y-auto" : "hidden";

//   return (
//     <div className={`modal flex ${modalClasses}`}>
//       <div className="modal-overlay fixed inset-0"></div>
//       <div className="modal-container mx-auto mt-10 p-4">
//         <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
//           <p className="text-lg font-semibold mb-4">
//             Are you sure you want to delete this template?
//           </p>
//           <div className="flex justify-end">
//             <button
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
//               onClick={onCancel}
//             >
//               No
//             </button>
//             <button
//               className="bg-red-500 text-white px-4 py-2 rounded"
//               onClick={onConfirm}
//             >
//               Yes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FirstPage = () => {
//   const dispatch = useDispatch();
//   const [isExisting, setIsExisting] = useState(true);
//   const [inputValue, setInputValue] = useState(1);
//   const [name, setName] = useState("");
//   const [templates, setTemplates] = useState([]);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [templateIdToDelete, setTemplateIdToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     DataService.getData()
//       .then((response) => {
//         setTemplates(response.data || []);
//         console.log(response.data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleCreateClick = () => {
//     setIsExisting(false);
//   };

//   const handleTemplateClick = () => {
//     setIsExisting(true);
//   };

//   const handleDuplicate = (id) => {
//     DataService.duplicateData(id).then((response) =>
//       console.log(response.data)
//     );
//   };

//   const handleCreateWizard = () => {
//     dispatch(setTemplateId());
//     dispatch(setWizardCount(inputValue));
//     dispatch(setTemplateTitle(name));
//     navigate("/create");
//   };

//   const handleDeleteClick = (templateId) => {
//     setTemplateIdToDelete(templateId);
//     setIsConfirmationModalOpen(true);
//   };

//   const handleCancelDelete = () => {
//     setIsConfirmationModalOpen(false);
//     setTemplateIdToDelete(null);
//   };

//   const handleConfirmDelete = () => {
//     // Perform the delete operation
//     const updatedTemplates = templates.filter(
//       (template) => template.id !== templateIdToDelete
//     );
//     setTemplates(updatedTemplates);
//     DataService.deleteData(templateIdToDelete)
//       .then((response) => console.log("Deleted", response))
//       .catch((err) => console.log(err));

//     // Close the confirmation modal
//     setIsConfirmationModalOpen(false);
//     setTemplateIdToDelete(null);
//   };

//   const handleClick = (id) => {
//     dispatch(setTemplateId(id));
//     console.log(id);
//     console.log(templates);
//   };

//   const renderTemplateList = () => {
//     return (
//       <div className="mb-10">
//         <div
//           className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2
//             lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 justify-center"
//         >
//           {templates.map((template) => (
//             <div key={template.id} className="relative group">
//               {console.log(template)}
//               <div className="flex bg-blue-500 rounded-lg shadow-lg text-white justify-center items-center h-80 w-40 group-hover:opacity-50 transition-opacity">
//                 {template.templateTitle}
//               </div>
//               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity">
//                 <button
//                   onClick={() =>
//                     navigate(`/preview/${template.templateId}/1`, {
//                       state: { isPreview: true },
//                     })
//                   }
//                 >
//                   <FontAwesomeIcon
//                     icon={faEye}
//                     className="text-white text-2xl"
//                   />
//                 </button>
//                 <button
//                   className="h-10 w-10 rounded-md text-white bg-red-600 text-lg mr-2.5 hover:text-red-600 hover:bg-white
//                   absolute bottom-2 left-2"
//                   onClick={() => handleDeleteClick(template.id)}
//                 >
//                   <FontAwesomeIcon icon={faTrashAlt} />
//                 </button>
//                 <Link
//                   to={`/edit/${template.templateId}`}
//                   onClick={() => handleClick(template.templateId)}
//                 >
//                   <button
//                     className="h-10 w-10 rounded-md text-white bg-blue-700 text-lg hover:text-blue-700 hover:bg-white
//                   absolute bottom-2 right-2"
//                   >
//                     <FontAwesomeIcon icon={faEdit} />
//                   </button>
//                 </Link>
//                 {/* <button
//                   className="h-10 w-10 rounded-md text-white bg-blue-700 text-lg hover:text-blue-700 hover:bg-white
//                   absolute bottom-2 right-2"
//                   onClick={() => handleDuplicate(template.templateId)}
//                 >
//                   <FontAwesomeIcon icon={faClone} />
//                 </button> */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="flex flex-col items-center align-middle">
//         <div
//           className={`mt-6 p-4 border-2 bg-gradient-to-r from-blue-600 to-amber-400 cursor-pointer ${
//             isExisting ? "scale-75" : ""
//           }`}
//         >
//           <div onClick={handleCreateClick} className="text-white text-xl">
//             Create a new wizard
//           </div>
//         </div>
//         <div
//           className={`mt-6 p-4 border-2 bg-gradient-to-r from-blue-600 to-amber-400 cursor-pointer ${
//             isExisting ? "" : "scale-75"
//           }`}
//         >
//           <div onClick={handleTemplateClick} className="text-white text-xl">
//             My Templates (or) Wizards
//           </div>
//         </div>
//         <div className="mt-6">
//           {isExisting ? (
//             renderTemplateList()
//           ) : (
//             <div className="flex flex-col items-center bg-blue-600 w-full px-2 lg:w-96 h-44 rounded-md shadow-lg">
//               <div className="text-white text-lg font-semibold mb-6 mt-2">
//                 Create Wizard Page
//               </div>
//               <label className="relative">
//                 <input
//                   type="text"
//                   name="Template Title"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="h-10 w-80 text-md bg-blue-600 border-2 rounded-lg
//                 border-white border-opacity-50 outline-none focus:border-white text-white
//                 transition duration-200"
//                 />
//                 <span
//                   className={`text-lg text-white text-opacity-80 absolute left-0 ${
//                     name ? "bottom-7 scale-90" : "top-1.5"
//                   }
//                 ml-2 px-2 transition duration-200 input-text hover:cursor-text bg-blue-600 rounded`}
//                 >
//                   Template Title
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 placeholder="Enter the number of wizards..."
//                 min="1"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 className="h-12 w-80 text-md bg-blue-600 border-2 rounded-lg
//                 border-white border-opacity-50 outline-none focus:border-white text-white
//                 transition duration-200 mt-3"
//               />
//               <button
//                 className="font-semibold py-2 px-4 w-44 h-12 bg-blue-700 text-gray-200 focus:scale-105 shadow-md
//                hover:bg-gray-200 hover:text-blue-600 mt-2 rounded-md"
//                 onClick={handleCreateWizard}
//               >
//                 Generate
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={isConfirmationModalOpen}
//         onCancel={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//       />
//     </div>
//   );
// };

// export default FirstPage;

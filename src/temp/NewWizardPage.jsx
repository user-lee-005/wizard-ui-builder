// Main code
import React from "react";
import TextBox from "../components/TextBox";
import RadioButton from "../components/RadioButton";
import { useDispatch, useSelector } from "react-redux";
import { addFields, addPage, removeFields } from "../redux/slices/dataSlice";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import Checkbox from "../components/Checkboxes";
import Header from "../page components/Header";
import Dropdown from "../components/Dropdown";
import Textarea from "../components/Textarea";

const NewWizardPage = () => {
  const wizardCount = useSelector((state) => state.wizardCount.wizardCount);

  const navigate = useNavigate();

  const { wizardId } = useParams();
  const pageId = parseInt(wizardId, 10);

  console.log("Wizard ID from URL:", wizardId);

  const dispatch = useDispatch();

  const Pages = useSelector((state) => state.formData.pages);

  const foundPage = Pages.find((page) => page.pageId === pageId);

  console.log(foundPage);

  const sortedFields = [...foundPage.fields].sort((a, b) => a.order - b.order);

  const handleBack = () => {
    navigate("/create");
  };

  const handlePreview = () => {
    navigate("/edit/pages/1");
  };

  const handlePrev = () => {
    navigate(`/create/pages/${pageId - 1}`);
  };

  const handleNext = () => {
    const nextPageId = pageId + 1;
    dispatch(addPage({ pageId: nextPageId }));
    navigate(`/create/pages/${nextPageId}`);
  };

  const addDynamicField = (type) => {
    const qId = nanoid();
    const order = sortedFields.length + 1;

    const newField = {
      qId: qId,
      pageIdToAddFields: pageId,
      questionType: type,
      question: "",
      order,
    };

    dispatch(addFields(newField));
  };

  const removeDynamicField = (fieldId) => {
    dispatch(
      removeFields({ pageIdToRemove: pageId, fieldIdToRemove: fieldId })
    );
  };

  // const renderPreviewPage = () => {
  //   return (
  //     <div className="flex flex-grow flex-col p-6 bg-teal-600 text-white items-center min-h-screen">
  //       <div className="flex">
  //         <div className="text-2xl font-semibold mr-28 mb-6">
  //           Template Title
  //         </div>
  // <div
  //   className="text-md font-semibold rounded-md bg-white text-teal-600 w-36 h-8 flex items-center justify-center absolute right-40
  //       hover:cursor-pointer hover:scale-105 hover:shadow-xl"
  //   onClick={() => setIsPreview(false)}
  // >
  //   Edit template <FontAwesomeIcon icon={faPencil} />
  // </div>
  //       </div>
  //       <form onSubmit={(e) => e.preventDefault()}>
  //         <div className="flex flex-col max-w-5xl w-screen space-y-4 flex-grow">
  //           {sortedFields.map((field) => (
  //             <div key={field.qId}>{renderDynamicField(field)}</div>
  //           ))}
  //         </div>
  //       </form>
  //     </div>
  //   );
  // };

  const renderDynamicField = (field) => {
    switch (field.questionType) {
      case "text":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "text")}
            pageId={pageId}
            qId={field.qId}
          />
        );
      case "radio":
        return (
          <RadioButton
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "radio")}
            qId={field.qId}
            pageId={pageId}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "checkbox")}
            qId={field.qId}
            pageId={pageId}
          />
        );
      case "dropdown":
        return (
          <Dropdown
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "dropdown")}
            qId={field.qId}
            pageId={pageId}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "text")}
            pageId={pageId}
            qId={field.qId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="flex">
        <div className="p-6 w-56 flex flex-col items-stretch content-around gap-y-4 bg-teal-400 space-y-6 min-h-screen">
          <div className="text-white font-semibold text-lg">
            Select Components
          </div>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("text")}
          >
            Add Text
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("radio")}
          >
            Add Radio Button
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("checkbox")}
          >
            Add Checkbox
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("dropdown")}
          >
            Add Dropdown
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("textarea")}
          >
            Add Textarea
          </button>
        </div>
        <div className="flex flex-grow flex-col p-6 bg-teal-600 text-white items-center">
          <div className="text-2xl font-semibold mr-28 mb-6">
            Template Title
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className=" flex flex-col max-w-5xl w-screen space-y-4 flex-grow">
              {sortedFields.map((field) => renderDynamicField(field))}
            </div>
          </form>
          <div className="grid grid-cols-2 gap-4 place-content-around h-48 w-full">
            {pageId === 1 ? (
              <button
                className="btn-green rounded-md hover:shadow-md w-24 h-8 col-start-1"
                onClick={() => handleBack()}
              >
                Back
              </button>
            ) : (
              <button
                className="btn-green rounded-md hover:shadow-md w-24 h-8 col-start-1"
                onClick={() => handlePrev()}
              >
                Prev
              </button>
            )}
            {pageId === wizardCount ? (
              <button
                className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
                onClick={(e) => handlePreview(e)}
              >
                Preview
              </button>
            ) : (
              <button
                className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
                onClick={() => handleNext()}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWizardPage;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// // Main code
// import React from "react";
// import TextBox from "../components/TextBox";
// import RadioButton from "../components/RadioButton";
// import { useDispatch, useSelector } from "react-redux";
// import { addFields, addPage, removeFields } from "../redux/slices/dataSlice";
// import { useNavigate, useParams } from "react-router-dom";
// import { nanoid } from "@reduxjs/toolkit";
// import Checkbox from "../components/Checkboxes";
// import Header from "../page components/Header";
// import EmailBox from "../components/EmailBox";
// import PasswordBox from "../components/PasswrodBox";
// import Dropdown from "../components/Dropdown";
// import Phone from "../components/Phone";

// const NewWizardPage = () => {
//   const wizardCount = useSelector((state) => state.wizardCount.wizardCount);

//   const navigate = useNavigate();

//   const { wizardId } = useParams();
//   const pageId = parseInt(wizardId, 10);

//   console.log("Wizard ID from URL:", wizardId);

//   const dispatch = useDispatch();

//   const Pages = useSelector((state) => state.formData.pages);

//   const foundPage = Pages.find((page) => page.pageId === pageId);

//   console.log(foundPage);

//   const sortedFields = [...foundPage.fields].sort((a, b) => a.order - b.order);

//   const handleBack = () => {
//     navigate("/create");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate("/");
//   };

//   const handlePrev = () => {
//     navigate(`/create/pages/${pageId - 1}`);
//   };

//   const handleNext = () => {
//     const nextPageId = pageId + 1;
//     dispatch(addPage({ pageId: nextPageId }));
//     navigate(`/create/pages/${nextPageId}`);
//   };

//   const addDynamicField = (type) => {
//     const qId = nanoid();
//     const order = sortedFields.length + 1;

//     const newField = {
//       qId: qId,
//       pageIdToAddFields: pageId,
//       questionType: type,
//       question: "",
//       order,
//     };

//     dispatch(addFields(newField));
//   };

//   const removeDynamicField = (fieldId) => {
//     dispatch(
//       removeFields({ pageIdToRemove: pageId, fieldIdToRemove: fieldId })
//     );
//   };

//   return (
//     <div>
//       <div>
//         <Header />
//       </div>
//       <div className="flex">
//         <div className="p-6 w-56 flex flex-col items-stretch content-around gap-y-4 bg-teal-400 space-y-6 min-h-screen">
//           <div className="text-white font-semibold text-lg">
//             Select Components
//           </div>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("text")}
//           >
//             Add Text
//           </button>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("radio")}
//           >
//             Add Radio Button
//           </button>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("checkbox")}
//           >
//             Add Checkbox
//           </button>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("email")}
//           >
//             Add Email
//           </button>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("password")}
//           >
//             Add Password
//           </button>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("dropdown")}
//           >
//             Add Dropdown
//           </button>
//           <button
//             className="bg-green-600 btn mt-2"
//             onClick={() => addDynamicField("phone")}
//           >
//             Add Phone
//           </button>
//         </div>
//         <div className="flex flex-grow flex-col p-6 bg-teal-600 text-white items-center">
//           <div className="text-2xl font-semibold mr-28 mb-6">
//             Template Title
//           </div>
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div className=" flex flex-col max-w-5xl w-screen space-y-4 flex-grow">
//               {sortedFields.map((field) => {
//                 if (field.questionType === "text") {
//                   return (
//                     <TextBox
//                       key={field.qId}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "text")}
//                       pageId={pageId}
//                       qId={field.qId}
//                     />
//                   );
//                 } else if (field.questionType === "radio") {
//                   return (
//                     <RadioButton
//                       key={field.qId}
//                       options={field.options}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "radio")}
//                       qId={field.qId}
//                       pageId={pageId}
//                     />
//                   );
//                 } else if (field.questionType === "checkbox") {
//                   return (
//                     <Checkbox
//                       key={field.qId}
//                       options={field.options}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "checkbox")}
//                       qId={field.qId}
//                       pageId={pageId}
//                     />
//                   );
//                 } else if (field.questionType === "email") {
//                   return (
//                     <EmailBox
//                       key={field.qId}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "email")}
//                       pageId={pageId}
//                       qId={field.qId}
//                     />
//                   );
//                 } else if (field.questionType === "password") {
//                   return (
//                     <PasswordBox
//                       key={field.qId}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "password")}
//                       pageId={pageId}
//                       qId={field.qId}
//                     />
//                   );
//                 } else if (field.questionType === "dropdown") {
//                   return (
//                     <Dropdown
//                       key={field.qId}
//                       options={field.options}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "dropdown")}
//                       qId={field.qId}
//                       pageId={pageId}
//                     />
//                   );
//                 } else if (field.questionType === "phone") {
//                   return (
//                     <Phone
//                       key={field.qId}
//                       value={field.question}
//                       onRemove={() => removeDynamicField(field.qId, "phone")}
//                       pageId={pageId}
//                       qId={field.qId}
//                     />
//                   );
//                 }
//                 return null;
//               })}
//             </div>
//           </form>
//           <div className="grid grid-cols-2 gap-4 place-content-around h-48 w-full">
//             {pageId === 1 ? (
//               <button
//                 className="btn-green rounded-md hover:shadow-md w-24 h-8 col-start-1"
//                 onClick={() => handleBack()}
//               >
//                 Back
//               </button>
//             ) : (
//               <button
//                 className="btn-green rounded-md hover:shadow-md w-24 h-8 col-start-1"
//                 onClick={() => handlePrev()}
//               >
//                 Prev
//               </button>
//             )}
//             {pageId === wizardCount ? (
//               <button
//                 className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
//                 onClick={(e) => handleSubmit(e)}
//               >
//                 Submit
//               </button>
//             ) : (
//               <button
//                 className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
//                 onClick={() => handleNext()}
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewWizardPage;

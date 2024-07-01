// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Main code
import React from "react";
import TextBox from "../components/TextBox";
import RadioButton from "../components/RadioButton";
import { useDispatch, useSelector } from "react-redux";
import { addTextBox, removeTextBox } from "./textBoxSlice";
import {
  addRadioButton as addRadioButtonAction,
  removeRadioButton,
} from "../temp/radioButtonSlice";
import { addPage, removeFields } from "../redux/slices/dataSlice";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { addFields } from "../redux/slices/dataSlice";
import { addCheckbox, removeCheckbox } from "../temp/checkboxSlice";
import Checkbox from "../components/Checkboxes";
import Header from "../page components/Header";
import EmailBox from "../components/EmailBox";
import PasswordBox from "../components/PasswrodBox";
import { addEmail, removeEmail } from "../temp/emailSlice";
import { addPassword, removePassword } from "../temp/passwrodSlice";

const NewWizardPage = () => {
  const textBoxes = useSelector((state) => state.textBox.textBoxes);
  const radioButtons = useSelector((state) => state.radioButton.radioButtons);
  const checkboxes = useSelector((state) => state.checkbox.checkboxes);
  const emailBoxes = useSelector((state) => state.email.emails);
  const passwordBoxes = useSelector((state) => state.password.passwords);
  const wizardCount = useSelector((state) => state.wizardCount.wizardCount);

  const navigate = useNavigate();

  const { wizardId } = useParams();
  const pageId = parseInt(wizardId, 10);

  console.log("Wizard ID from URL:", wizardId);

  const dispatch = useDispatch();

  const Pages = useSelector((state) => state.formData.pages);

  const foundPage = Pages.find((page) => page.pageId === pageId);

  console.log(foundPage);

  const dynamicFields = [
    ...textBoxes,
    ...radioButtons,
    ...checkboxes,
    ...emailBoxes,
    ...passwordBoxes,
  ]
    .filter((field) => field.pageId === pageId)
    .sort((a, b) => a.order - b.order);

  const handleBack = () => {
    navigate("/create");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
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
    const order = dynamicFields.length + 1;
    switch (type) {
      case "text":
        dispatch(addTextBox({ id: qId, questionType: "text", pageId, order }));
        break;
      case "radio":
        dispatch(
          addRadioButtonAction({
            id: qId,
            questionType: "radio",
            pageId,
            order,
          })
        );
        break;
      case "checkbox":
        dispatch(
          addCheckbox({ id: qId, questionType: "checkbox", pageId, order })
        );
        break;
      case "email":
        dispatch(addEmail({ id: qId, questionType: "email", pageId, order }));
        break;
      case "password":
        dispatch(
          addPassword({ id: qId, questionType: "password", pageId, order })
        );
        break;
      default:
        break;
    }

    const newField = {
      qId: qId,
      pageIdToAddFields: pageId,
      questionType: type,
      question: "",
      order,
    };

    dispatch(addFields(newField));
  };

  const removeDynamicField = (fieldId, fieldType) => {
    switch (fieldType) {
      case "text":
        dispatch(removeTextBox(fieldId));
        break;
      case "radio":
        dispatch(removeRadioButton(fieldId));
        break;
      case "checkbox":
        dispatch(removeCheckbox(fieldId));
        break;
      case "email":
        dispatch(removeEmail(fieldId));
        break;
      case "password":
        dispatch(removePassword(fieldId));
        break;
      default:
        break;
    }

    dispatch(
      removeFields({ pageIdToRemove: pageId, fieldIdToRemove: fieldId })
    );
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="flex">
        <div className="p-6 w-56 flex flex-col items-stretch content-around gap-y-4 bg-teal-400 space-y-6">
          {/* <div className="text-white font-semibold text-lg">Select Components</div> */}
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
            onClick={() => addDynamicField("email")}
          >
            Add Email
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("password")}
          >
            Add Password
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("checkbox")}
          >
            Add Dropdown
          </button>
          <button
            className="bg-green-600 btn mt-2"
            onClick={() => addDynamicField("checkbox")}
          >
            Add Phone
          </button>
        </div>
        <div className="flex flex-grow flex-col p-6 bg-teal-600 text-white items-center">
          <div className="text-2xl font-semibold mr-28 mb-6">
            Template Title
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className=" flex flex-col max-w-5xl w-screen space-y-4 flex-grow">
              {dynamicFields.map((field) => {
                if (field.questionType === "text") {
                  return (
                    <TextBox
                      key={field.id}
                      value={field.value}
                      onRemove={() => removeDynamicField(field.id, "text")}
                      pageId={pageId}
                      qId={field.id}
                    />
                  );
                } else if (field.questionType === "radio") {
                  return (
                    <RadioButton
                      key={field.id}
                      value={field.value}
                      onRemove={() => removeDynamicField(field.id, "radio")}
                      qId={field.id}
                      pageId={pageId}
                    />
                  );
                } else if (field.questionType === "checkbox") {
                  return (
                    <Checkbox
                      key={field.id}
                      value={field.value}
                      onRemove={() => removeDynamicField(field.id, "checkbox")}
                      qId={field.id}
                      pageId={pageId}
                    />
                  );
                } else if (field.questionType === "email") {
                  return (
                    <EmailBox
                      key={field.id}
                      value={field.value}
                      onRemove={() => removeDynamicField(field.id, "email")}
                      pageId={pageId}
                      qId={field.id}
                    />
                  );
                } else if (field.questionType === "password") {
                  return (
                    <PasswordBox
                      key={field.id}
                      value={field.value}
                      onRemove={() => removeDynamicField(field.id, "password")}
                      pageId={pageId}
                      qId={field.id}
                    />
                  );
                }
                return null;
              })}
              {/* <div className="grid">
                <button
                  type="submit"
                  className="btn-green rounded-md w-44 h-10 hover:shadow-md col-start-2"
                >
                  Submit
                </button>
              </div> */}
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
            {/* <button
              className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
              onClick={() => handleNext()}
            >
              Next
            </button> */}
            {pageId === wizardCount ? (
              <button
                className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
                onClick={() => handleSubmit()}
              >
                Submit
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

// _-----------------------------------------------------------------------------------------------------------------------------------------------

// <div className="flex flex-col h-screen">
//   <div className="w-screen flex flex-col items-center">
//     <h1 className="text-center font-bold text-5xl pt-3 text-white bg-blue-500 w-full h-20">
//       New Wizard Page
//     </h1>
//   </div>
//   <div className="flex h-screen bg-blue-500">
//     <div className="w-1/4">
//       <button
//         onClick={() => addDynamicField("text")}
//         className="btn btn-green mb-4 mt-4 shadow-xl"
//       >
//         Add Text
//       </button>
//       <button
//         onClick={() => addDynamicField("radio")}
//         className="btn btn-green mb-4 mt-4 shadow-xl"
//       >
//         Add Radio Button
//       </button>
//       <button
//         onClick={() => addDynamicField("checkbox")}
//         className="btn btn-green mb-4 mt-4 shadow-xl"
//       >
//         Add Checkbox
//       </button>
//     </div>
//     <div className="flex flex-col p-6 w-screen h-screen bg-cyan-500">
//       <div>Dynamic Forms</div>
//       <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
//         {dynamicFields.map((field) => {
//           if (field.questionType === "text") {
//             return (
//               <TextBox
//                 key={field.id}
//                 value={field.value}
//                 onRemove={() => removeDynamicField(field.id, "text")}
//                 pageId={pageId}
//                 qId={field.id}
//               />
//             );
//           } else if (field.questionType === "radio") {
//             return (
//               <RadioButton
//                 key={field.id}
//                 value={field.value}
//                 onRemove={() => removeDynamicField(field.id, "radio")}
//                 qId={field.id}
//                 pageId={pageId}
//               />
//             );
//           } else if (field.questionType === "checkbox") {
//             return (
//               <Checkbox
//                 key={field.id}
//                 value={field.value}
//                 onRemove={() => removeDynamicField(field.id, "checkbox")}
//                 qId={field.id}
//                 pageId={pageId}
//               />
//             );
//           }
//           return null;
//         })}
//         <button type="submit" className="btn btn-green rounded-md">
//           Submit
//         </button>
//       </form>
//       <div className="grid grid-cols-2">
//         <button
//           className="btn btn-green justify-items-start"
//           onClick={() => handlePrev()}
//         >
//           Prev
//         </button>
//         <button
//           className="btn btn-green justify-items-end"
//           onClick={() => handleNext()}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFields } from "../redux/slices/dataSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const RadioButton = (props) => {
  const dispatch = useDispatch();
  const [buttons, setButtons] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [selectedOption, setSelectedOption] = useState([]);
  const pageId = props.pageId;
  const qId = props.qId;
  const [validationError, setValidationError] = useState("");
  const [isRequiredToggled, setIsRequiredToggled] = useState(false);

  const handleButtonChange = (index, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index] = { ...updatedButtons[index], value: value };
    setButtons(updatedButtons);
  };

  const addButton = () => {
    setButtons((prevButtons) => [
      ...prevButtons,
      { id: Date.now(), value: "" },
    ]);
  };

  const handleRemoveButton = (buttonId) => {
    setButtons((prevButtons) =>
      prevButtons.filter((button) => button.id !== buttonId)
    );
  };

  const handleSave = () => {
    if (!questionInput.trim()) {
      setValidationError("Question cannot be empty");
      localStorage.setItem(
        "errors",
        localStorage.setItem("errors", localStorage.getItem("errors") + 1)
      );
      return;
    }

    if (
      buttons.length === 0 ||
      buttons.every((button) => !button.value.trim())
    ) {
      setValidationError(
        "At least one button with a non-empty value is required"
      );
      localStorage.setItem(
        "errors",
        localStorage.setItem("errors", localStorage.getItem("errors") + 1)
      );
      return;
    }

    let newObj = {
      qId: qId,
      pageIdToAddFields: pageId,
      questionType: "radio",
      question: questionInput,
      options: buttons.map((button) => button),
      isRequired: isRequiredToggled,
    };

    dispatch(addFields(newObj));

    setValidationError("");
    localStorage.setItem("errors", localStorage.getItem("errors") - 1);
  };

  const handleSaveAnswers = () => {
    try {
      const ansObj = {
        userId: "1",
        responses: [
          {
            qId: props.qId,
            question: questionInput,
            answer: selectedOption,
          },
        ],
      };
      props.onDataUpdate(ansObj);
    } catch (error) {
      console.log("Warning:", error);
    }
  };

  const handleInputRequired = () => {
    setIsRequiredToggled(!isRequiredToggled);
  };

  useEffect(() => {
    if (props.value) {
      setQuestionInput(props.value);
    }

    if (props.options) {
      setButtons(props.options ? props.options : []);
    }

    if (props.isRequired) {
      setIsRequiredToggled(props.isRequired);
    }
  }, [props.value, props.options, props.isRequired]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (props.isRequired) {
        if (
          selectedOption !== undefined &&
          selectedOption !== "" &&
          selectedOption !== null
        ) {
          handleSaveAnswers();
        }
      } else {
        handleSaveAnswers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedOption, props.isRequired]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [questionInput, isRequiredToggled]);

  return props.isPreview ? (
    <div className="flex flex-col xl:col-span-2 md:col-span-2 sm:col-span-1">
      <label>
        <div
          className="w-80 text-md bg-slate-200 border-2 rounded-lg
                border-gray-900 outline-none focus:border-blue-600 text-gray-900
                transition duration-200 relative border-opacity-50"
        >
          <div className="flex justify-center absolute left-2 -top-3 px-2 rounded-md bg-slate-200">
            {props.isRequired ? `${props.value}*` : props.value}
          </div>
          {props.options.map((option, index) => (
            <div className="pl-2 pt-2 my-2" key={index}>
              <input
                type="radio"
                className="mr-2"
                name={props.value}
                value={option.value}
                checked={selectedOption === option.value}
                onChange={() => setSelectedOption(option.value)}
                onBlur={handleSaveAnswers}
              />
              <span>{option.value}</span>
            </div>
          ))}
        </div>
      </label>
    </div>
  ) : (
    <div className="flex flex-col">
      <input
        type="text"
        name="question"
        value={questionInput}
        onChange={(e) => setQuestionInput(e.target.value)}
        onBlur={() => handleSave()}
        placeholder="Enter the question"
        className={`text-input border-b-2 border-gray-300 p-2 mb-2 ${
          validationError ? "border-red-500" : ""
        }`}
      />
      {validationError && (
        <div className="text-red-500 text-sm mb-2">{validationError}</div>
      )}
      {buttons.map((button, index) => (
        <div key={button.id} className="mt-2 mb-2 flex items-center space-x-3">
          <input
            type="radio"
            name={`options_${button.id}_group`}
            placeholder="Enter option"
            className="border border-gray-300 p-2"
          />
          <input
            type="text"
            value={button.value}
            onChange={(e) => handleButtonChange(index, e.target.value)}
            onBlur={() => handleSave()}
            className="text-input h-7"
          />
          <button onClick={() => handleRemoveButton(button.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
      <div className="space-x-4 space-y-2">
        <div className="flex">
          <button
            onClick={props.onRemove}
            className="mb-2 rounded-md bg-red-500 text-white h-10 w-20"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            className="btn-blue h-10 w-24 ml-4 rounded-md"
            onClick={addButton}
          >
            Button <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handleInputRequired()}
            className={`${
              isRequiredToggled
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 hover:bg-gray-400"
            } p-0.5 rounded-full focus:outline-none w-16 h-6`}
          >
            <span
              className={`${
                isRequiredToggled ? "translate-x-5" : "-translate-x-5"
              } inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform`}
            />
          </button>
          <span className="ml-2 font-semibold">Required</span>
        </div>
      </div>
    </div>
  );
};

export default RadioButton;

// Checkbox.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFields } from "../redux/slices/dataSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const Checkbox = (props) => {
  const dispatch = useDispatch();
  const [checkboxes, setCheckboxes] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const pageId = props.pageId;
  const qId = props.qId;
  const [validationError, setValidationError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isRequiredToggled, setIsRequiredToggled] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [link, setLink] = useState("");

  const checked = isChecked ? "Yes" : "No";

  const handleCheckboxChange = (index, value) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index] = { ...updatedCheckboxes[index], value: value };
    setCheckboxes(updatedCheckboxes);
  };

  const addCheckbox = () => {
    setCheckboxes((prevCheckboxes) => [
      ...prevCheckboxes,
      { id: Date.now(), value: "" },
    ]);
  };

  const handleRemoveCheckbox = (checkboxId) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.filter((checkbox) => checkbox.id !== checkboxId)
    );
  };

  const handleOptionChange = (value) => {
    if (props.cType === "multipleCheckboxes") {
      const optionIndex = selectedOptions.indexOf(value);
      if (optionIndex !== -1) {
        setSelectedOptions([
          ...selectedOptions.slice(0, optionIndex),
          ...selectedOptions.slice(optionIndex + 1),
        ]);
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    } else if (props.cType === "singleCheckbox") {
      setIsChecked(!isChecked);
    }
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleLinkNameChange = (e) => {
    setLinkName(e.target.value);
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
      props.cType === "multipleCheckboxes" &&
      (checkboxes.length === 0 ||
        checkboxes.every((button) => !button.value.trim()))
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
      questionType: props.cType,
      question: questionInput,
      options: checkboxes.map((checkbox) => checkbox),
      isRequired: isRequiredToggled,
      customLink: { link: link, linkName: linkName },
    };

    dispatch(addFields(newObj));

    setValidationError("");
    localStorage.setItem("errors", localStorage.getItem("errors") - 1);
  };

  const handleInputRequired = () => {
    setIsRequiredToggled(!isRequiredToggled);
  };

  const handleSaveAnswers = () => {
    try {
      if (props.cType === "multipleCheckboxes") {
        const ansObj = {
          userId: "1",
          responses: [
            {
              qId: props.qId,
              question: questionInput,
              answer: [...selectedOptions],
            },
          ],
        };
        props.onDataUpdate(ansObj);
      } else if (props.cType === "singleCheckbox") {
        const ansObj = {
          userId: "1",
          responses: [
            {
              qId: props.qId,
              question: questionInput,
              answer: checked,
            },
          ],
        };
        props.onDataUpdate(ansObj);
      } else {
        console.log("Unexpected props.cType value:", props.cType);
      }
    } catch (error) {
      console.log("Warning:", error);
    }
  };

  useEffect(() => {
    if (props.value) {
      setQuestionInput(props.value);
    }

    if (props.options) {
      setCheckboxes(props.options ? props.options : []);
    }

    if (props.isRequired) {
      setIsRequiredToggled(props.isRequired);
    }

    if (props.customLink) {
      setLink(props.customLink.link ? props.customLink.link : "");
      setLinkName(props.customLink.linkName ? props.customLink.linkName : "");
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (props.isRequired) {
        if (
          props.cType === "multipleCheckboxes"
            ? selectedOptions !== null &&
              selectedOptions?.length !== 0 &&
              selectedOptions !== ""
            : checked !== ""
        ) {
          console.log("This is running");
          handleSaveAnswers();
        }
      } else {
        handleSaveAnswers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedOptions, checked]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [questionInput, link, linkName, isRequiredToggled]);

  return props.isPreview ? (
    props.cType === "singleCheckbox" ? (
      <div className="flex flex-col xl:col-span-6 lg:col-span-4 md:col-span-2">
        <label>
          <div
            className="text-md bg-slate-200 border-2 rounded-lg
            border-gray-900 outline-none focus:border-blue-600 text-gray-900
            transition duration-200 relative border-opacity-50 p-2"
          >
            {props.isRequired ? `${props.value}*` : props.value}
            <input
              type="checkbox"
              name="single-checkbox"
              className="ml-6 mb-1"
              checked={isChecked}
              value={checked}
              onChange={() => handleOptionChange()}
            />
          </div>
          <div className="mt-1 text-blue-500 px-3">
            <a href={link} target="_blank" rel="noreferrer">
              {linkName}
            </a>
          </div>
        </label>
      </div>
    ) : props.cType === "multipleCheckboxes" ? (
      <div className="flex flex-col xl:col-span-2 md:col-span-2 sm:col-span-1">
        <label>
          <div
            className="text-md bg-slate-200 border-2 rounded-lg
                border-gray-900 outline-none focus:border-blue-600 text-gray-900
                transition duration-200 relative border-opacity-50"
          >
            <div className="flex justify-center absolute left-2 -top-3 px-2 rounded-md bg-slate-200">
              {props.isRequired ? `${props.value}*` : props.value}
            </div>
            {props.options.map((option, index) => (
              <div className="pl-2 pt-2 my-2 w-80" key={index}>
                <input
                  type="checkbox"
                  className="mr-2"
                  name={props.value}
                  value={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleOptionChange(option.value)}
                />
                <span>{option.value}</span>
              </div>
            ))}
          </div>
        </label>
      </div>
    ) : (
      alert("Please select valid option")
    )
  ) : (
    <div className="flex flex-col">
      {props.cType === "singleCheckbox" ? (
        <div className="flex flex-col">
          <input
            type="text"
            name="question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Enter the question"
            className={`text-input border-b-2 border-gray-300 p-2 mb-2 `}
          />
          <input type="checkbox" name="single-checkbox" className="ml-2" />
          <button
            onClick={props.onRemove}
            className="mt-2 rounded-md bg-red-500 text-white h-10 w-20"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <div className="mt-2">
            Custom Links ( like terms and conditions )
            <span className="ml-2 space-x-4">
              <input
                type="text"
                value={linkName}
                onChange={(e) => handleLinkNameChange(e)}
                placeholder="Name of the link"
              />
              <input
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(e)}
                placeholder="Link"
              />
            </span>
          </div>
          <div className="flex items-center mt-2 ml-4">
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
      ) : props.cType === "multipleCheckboxes" ? (
        <div>
          <input
            type="text"
            name="question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Enter the question"
            className={`text-input w-full border-b-2 border-gray-300 p-2 mb-2 ${
              validationError ? "border-red-500" : ""
            }`}
          />
          {validationError && (
            <div className="text-red-500 text-sm mb-2">{validationError}</div>
          )}
          {checkboxes.map((button, index) => (
            <div
              key={button.id}
              className="mt-2 mb-2 flex items-center space-x-3"
            >
              <input
                type="checkbox"
                name={`options_${button.id}`}
                placeholder="Enter option"
                className="border border-gray-300 p-2"
              />
              <input
                type="text"
                value={button.value}
                onChange={(e) => handleCheckboxChange(index, e.target.value)}
                onBlur={() => handleSave()}
                className="text-input h-7"
              />
              <button onClick={() => handleRemoveCheckbox(button.id)}>
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
                className="btn-blue h-10 w-28 ml-4 rounded-md"
                onClick={addCheckbox}
              >
                Checkbox <FontAwesomeIcon icon={faPlus} />
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
      ) : (
        alert("Select the appropriate type")
      )}
    </div>
  );
};

export default Checkbox;

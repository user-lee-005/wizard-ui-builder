// Textarea.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFields } from "../redux/slices/dataSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Textarea = (props) => {
  const dispatch = useDispatch();
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isRequiredToggled, setIsRequiredToggled] = useState(false);
  const [maxLength, setMaxLength] = useState(
    props.characterLimit ? props.characterLimit : 200
  );

  const isMaxLengthExceeded = (input, maxLength) => {
    return [...input].length > maxLength;
  };

  const handleSave = () => {
    if (!questionInput.trim()) {
      setValidationError("Question cannot be empty");
      localStorage.setItem("errors", localStorage.getItem("errors") + 1);
      return;
    }
    let newObj = {
      qId: props.qId,
      pageIdToAddFields: props.pageId,
      questionType: "textarea",
      question: questionInput,
      isRequired: isRequiredToggled,
      characterLimit: maxLength,
    };

    dispatch(addFields(newObj));
    setValidationError("");
    localStorage.setItem("errors", localStorage.getItem("errors") - 1);
  };

  const handleInputRequired = () => {
    setIsRequiredToggled(!isRequiredToggled);
  };

  useEffect(() => {
    setQuestionInput(props.value ? props.value : questionInput);
    setIsRequiredToggled(props.isRequired || false);
  }, []);

  const handleSaveAnswers = () => {
    try {
      if (props.isRequired) {
        if (!isMaxLengthExceeded(answerInput, maxLength)) {
          const ansObj = {
            userId: "1",
            responses: [
              {
                qId: props.qId,
                question: questionInput,
                answer: answerInput,
              },
            ],
          };
          props.onDataUpdate(ansObj);
        } else {
          alert("Words exceeding the limit!");
        }
      } else {
        const ansObj = {
          userId: "1",
          responses: [
            {
              qId: props.qId,
              question: questionInput,
              answer: answerInput,
            },
          ],
        };
        props.onDataUpdate(ansObj);
      }
    } catch (error) {
      console.log("Warning:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (props.isRequired) {
        if (
          answerInput !== undefined &&
          answerInput !== "" &&
          answerInput !== null
        ) {
          handleSaveAnswers();
        }
      } else {
        handleSaveAnswers();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [answerInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [questionInput, isRequiredToggled]);

  return props.isPreview ? (
    <div className="flex flex-col xl:col-span-6 lg:col-span-4 md:col-span-3 sm:col-span-1">
      {/* Preview mode */}
      <label className="relative">
        <span
          className={`text-lg text-gray-900 absolute left-2 -top-4
          ml-2 px-2 transition duration-200 input-text bg-slate-200 rounded`}
        >
          {props.isRequired ? `${props.value}*` : props.value}
        </span>
        <textarea
          rows="5"
          type="text"
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          // onBlur={handleSaveAnswers}
          className={`${
            "w-full" || "w-96"
          } text-md bg-slate-200 border-2 rounded-lg
        border-gray-900 outline-none focus:border-white text-gray-900
          transition duration-200`}
        />
      </label>
    </div>
  ) : (
    <div className="flex flex-col">
      <input
        type="textarea"
        name="question"
        value={questionInput}
        // onChange={(e) => handleChange(e)}
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
      <textarea
        type="text"
        className="text-input border border-gray-300 p-2 mb-2"
        placeholder="Enter text"
        name="question-type"
      />
      <label>Max. Characters</label>
      <input
        type="number"
        value={maxLength}
        className="mb-2 form-input"
        onChange={(e) => setMaxLength(e.target.value)}
      />
      <div className="flex">
        <button
          onClick={props.onRemove}
          className="mb-3 rounded-md bg-red-500 text-white h-10 w-20"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="flex items-center ml-4">
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
  );
};

export default Textarea;

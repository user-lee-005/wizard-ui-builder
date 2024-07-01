import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFields } from "../redux/slices/dataSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import {
  faChevronDown,
  faChevronUp,
  faEnvelope,
  faLock,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const TextBox = (props) => {
  const dispatch = useDispatch();
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isRequiredToggled, setIsRequiredToggled] = useState(false);
  const [isValidationToggle, setIsValidationToggle] = useState(false);
  const [questionType, setQuestionType] = useState(
    props.questionType ? props.questionType : "text"
  );
  const [isEmailToggled, setIsEmailToggled] = useState(false);
  const [isPasswordToggled, setIsPasswordToggled] = useState(false);
  const [isPhoneToggled, setIsPhoneToggled] = useState(false);
  const [maxLength, setMaxLength] = useState(
    props.characterLimit ? props.characterLimit : 50
  );

  useEffect(() => {
    setQuestionInput(props.value || "");
    setIsRequiredToggled(props.isRequired || false);
    setQuestionType(props.questionType ? props.questionType : "text");
  }, [props.value, props.isRequired, props.questionType]);

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const isMaxLengthExceeded = (input, maxLength) => {
    return [...input].length > maxLength;
  };

  const handleSave = () => {
    if (!questionInput.trim()) {
      setValidationError("Question cannot be empty");
      localStorage.setItem("errors", localStorage.getItem("errors") + 1);
      return;
    }

    console.log("llllllllllllllllllllllllllllllllll", questionType);
    console.log("2222222222222222222222222222222222", props.questionType);

    let newObj = {
      qId: props.qId,
      pageIdToAddFields: props.pageId,
      questionType: questionType,
      question: questionInput,
      isRequired: isRequiredToggled,
      characterLimit: maxLength,
    };

    dispatch(addFields(newObj));

    setValidationError("");
    localStorage.setItem("errors", localStorage.getItem("errors") - 1);
  };

  const handleSaveAnswers = () => {
    try {
      switch (questionType) {
        case "email":
          if (isValidEmail(answerInput)) {
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
            toast.error("Please Enter a valid email");
          }
          break;
        case "password":
          if (
            isValidPassword(answerInput) &&
            isMaxLengthExceeded(answerInput, maxLength)
          ) {
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
            toast.error("Enter a valid passorod");
          }
          break;
        case "tel":
          if (isValidPhoneNumber(answerInput)) {
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
            toast.error("Please Enter a valid phone number");
          }
          break;
        case "text":
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
            toast.error("Max Character exceeded!");
          }
          break;
        default:
          return null;
      }
    } catch (error) {
      console.log("Warning:", error);
    }
  };

  const handleInputRequired = () => {
    setIsRequiredToggled(!isRequiredToggled);
  };

  const handleEmailToggle = () => {
    setIsEmailToggled(!isEmailToggled);
    setIsPasswordToggled(false);
    setIsPhoneToggled(false);
  };

  const handlePasswordToggle = () => {
    setIsPasswordToggled(!isPasswordToggled);
    setIsEmailToggled(false);
    setIsPhoneToggled(false);
  };

  const handlePhoneToggle = () => {
    setIsPhoneToggled(!isPhoneToggled);
    setIsEmailToggled(false);
    setIsPasswordToggled(false);
  };

  const handleSetQuestionType = () => {
    if (isEmailToggled) {
      setQuestionType("email");
    } else if (isPasswordToggled) {
      setQuestionType("password");
    } else if (isPhoneToggled) {
      setQuestionType("tel");
    } else {
      setQuestionType("text");
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleSetQuestionType();
    }, 500);

    return () => clearTimeout(timeOut);
  }, [isEmailToggled, isPasswordToggled, isPhoneToggled]);

  useEffect(() => {
    if (props.isPreview) {
      const timeoutId = setTimeout(() => {
        if (props.isRequired) {
          if (
            answerInput !== undefined &&
            answerInput !== "" &&
            answerInput !== null
          ) {
            handleSaveAnswers();
          } else {
            console.log("Answer is required but not provided");
          }
        } else {
          handleSaveAnswers();
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [answerInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [
    questionInput,
    isRequiredToggled,
    isEmailToggled,
    isPasswordToggled,
    isPhoneToggled,
  ]);

  return props.isPreview ? (
    <div className="flex flex-col xl:col-span-6 lg:col-span-4 md:col-span-3 sm:col-span-1">
      <label className="relative">
        <input
          type={props.questionType}
          name="question-text"
          className="h-10 w-full text-md bg-slate-200 border-2 rounded-lg
                border-gray-900 border-opacity-50 outline-none focus:border-blue-600 text-gray-900
                transition duration-200"
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
        />
        <span
          className={`text-md text-gray-900 absolute left-2 bottom-7
                ml-2 px-2 transition duration-200 input-text bg-slate-200 rounded-md`}
        >
          {props.isRequired ? `${props.value}*` : props.value}
        </span>
      </label>
    </div>
  ) : (
    <div className="flex flex-col">
      <input
        type="text"
        name="question"
        value={questionInput}
        onChange={(e) => setQuestionInput(e.target.value)}
        placeholder="Enter the question"
        className={`text-input border-b-2 border-gray-300 p-2 mb-2 ${
          validationError ? "border-red-500" : ""
        }`}
      />
      {validationError && (
        <div className="text-red-500 text-sm mb-2">{validationError}</div>
      )}
      <input
        type="text"
        className="text-input border-b-2 border-gray-300 p-2 mb-2"
        placeholder="Enter text"
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
      <div
        className="flex justify-center font-bold hover:cursor-pointer"
        onClick={() => setIsValidationToggle(!isValidationToggle)}
      >
        Other validations &nbsp;
        <FontAwesomeIcon
          icon={isValidationToggle ? faChevronUp : faChevronDown}
          className="mt-1 hover:cursor-pointer"
        />
      </div>
      {isValidationToggle && (
        <div className="flex justify-center mt-2">
          <div className="flex-col">
            <div className="mb-2 font-semibold">
              Validations you would like to add
            </div>
            <div className="space-x-2">
              <span className="ml-2">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <button
                onClick={() => handleEmailToggle()}
                className={`${
                  isEmailToggled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400"
                } p-0.5 rounded-full focus:outline-none w-16 h-6`}
              >
                <span
                  className={`${
                    isEmailToggled ? "translate-x-5" : "-translate-x-5"
                  } inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform`}
                />
              </button>
              <span className="ml-2">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <button
                onClick={() => handlePasswordToggle()}
                className={`${
                  isPasswordToggled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400"
                } p-0.5 rounded-full focus:outline-none w-16 h-6`}
              >
                <span
                  className={`${
                    isPasswordToggled ? "translate-x-5" : "-translate-x-5"
                  } inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform`}
                />
              </button>
              <span className="ml-2">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <button
                onClick={() => handlePhoneToggle()}
                className={`${
                  isPhoneToggled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400"
                } p-0.5 rounded-full focus:outline-none w-16 h-6`}
              >
                <span
                  className={`${
                    isPhoneToggled ? "translate-x-5" : "-translate-x-5"
                  } inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform`}
                />
              </button>
            </div>
            {!isEmailToggled && (
              <div className="inline-flex">
                <label className="flex items-center mt-2 text-md">
                  Max. Characters
                  <input
                    type="number"
                    className="form-input inline-block border-b-2 h-8 w-28 border-gray-300 p-2 ml-2"
                    value={maxLength}
                    onChange={(e) => setMaxLength(e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextBox;

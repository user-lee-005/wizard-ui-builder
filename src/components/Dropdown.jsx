import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFields } from "../redux/slices/dataSlice";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import DataService from "../service/DataService";

const Dropdown = (props) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(
    props.dType === "multipleDropdown" ? [] : ""
  );
  const [isRequiredToggled, setIsRequiredToggled] = useState(false);

  const animatedComponents = makeAnimated();

  // const [getOptions, setGetOptions] = useState("");

  const pageId = props.pageId;
  const qId = props.qId;

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], value: value };
    setOptions(updatedOptions);
  };

  const handleSelectChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  const handleAddOption = () => {
    const newOption = { id: Date.now(), value: "" };
    setOptions((prevOptions) => [...prevOptions, newOption]);
  };

  const handleRemoveOption = (optionId) => {
    setOptions((prevOptions) =>
      prevOptions.filter((option) => option.id !== optionId)
    );
  };

  const handleInputRequired = () => {
    setIsRequiredToggled(!isRequiredToggled);
  };

  const handleSave = () => {
    if (!questionInput.trim()) {
      setValidationError("Question cannot be empty");
      return;
    }

    if (options.length === 0 || options.every((opt) => !opt.value.trim())) {
      setValidationError(
        "At least one option with a non-empty value is required"
      );
      return;
    }

    let newObj = {
      qId: qId,
      pageIdToAddFields: pageId,
      questionType: props.dType,
      question: questionInput,
      options: options.map((option) => ({
        id: option.id,
        value: option.value,
      })),
      isRequired: isRequiredToggled,
    };

    dispatch(addFields(newObj));
    setValidationError("");
  };

  const handleGetOptionsFromApi = async (apiLink) => {
    DataService.getOptionsFromApi(apiLink)
      .then((response) => {
        console.log("response.data:", response.options);
        setOptions((prevData) => [...prevData, ...response.options]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setQuestionInput(props.value || "");
    setOptions(props.options || []);
    setIsRequiredToggled(props.isRequired || false);
  }, [props.value, props.options, props.isRequired]);

  const handleSaveAnswers = () => {
    try {
      if (props.cType === "multipleDropdown") {
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
      } else {
        const ansObj = {
          userId: "1",
          responses: [
            {
              qId: props.qId,
              question: questionInput,
              answer: selectedOptions,
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
      if (
        selectedOptions !== undefined &&
        selectedOptions.length !== 0 &&
        selectedOptions !== null
      ) {
        handleSaveAnswers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedOptions]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [questionInput, isRequiredToggled]);

  return props.isPreview ? (
    <div className="flex flex-col mt-4 xl:col-span-2 md:col-span-2 sm:col-span-1">
      {props.dType === "singleDropdown" ? (
        <label className="relative inline-block">
          <span
            className={`text-lg text-gray-900 absolute left-0 -top-4 w-fit
          transition duration-200 input-text rounded-md bg-slate-200`}
          >
            {props.isRequired ? `${props.value}*` : props.value}
          </span>
          {/* <select
            name="dropdown"
            className="border-opacity-50 border-gray-800 w-full bg-white mt-4 rounded-sm"
            value={selectedOptions}
            onChange={(e) => setSelectedOptions(e.target.value)}
          >
            <option value="">Select...</option>
            {props.options.map((option) => {
              return (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              );
            })}
          </select> */}
          <Select
            className="border-opacity-50 border-gray-800 w-full bg-white mt-4 rounded-sm"
            options={options.map((opt) => ({
              value: opt.value,
              label: opt.value,
            }))}
          />
        </label>
      ) : props.dType === "multipleDropdown" ? (
        <div className="flex flex-col mt-4 xl:col-span-2 md:col-span-2 sm:col-span-1 relative">
          <label className="absolute left-0 -top-7 text-lg text-gray-900">
            {props.isRequired ? `${props.value}*` : props.value}
          </label>
          <Select
            isMulti
            options={options.map((opt) => ({
              value: opt.value,
              label: opt.value,
            }))}
            onChange={(selectedValues) =>
              handleSelectChange(selectedValues.map((value) => value.value))
            }
            components={animatedComponents}
          />
        </div>
      ) : (
        <span>Unsupported dropdown type</span>
      )}
    </div>
  ) : (
    <div>
      <input
        type="text"
        value={questionInput}
        onChange={(e) => setQuestionInput(e.target.value)}
        placeholder="Enter the question"
        className="text-input border-b-2 border-gray-300 p-2 mb-2 w-full"
        onBlur={handleSave}
      />
      {validationError && <div className="text-red-500">{validationError}</div>}
      {options.map((option, index) => (
        <div key={option.id} className="mt-2 mb-2 flex items-center space-x-3">
          <input
            type="text"
            value={option.value}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder="Enter option"
            className="text-input h-7"
            onBlur={handleSave}
          />
          <button onClick={() => handleRemoveOption(option.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
      {/* <div className="space-x-4">
        <label>Get options from an api</label>
        <input
          type="text"
          className="h-8"
          value={getOptions}
          onChange={(e) => setGetOptions(e.target.value)}
          onBlur={() => handleGetOptionsFromApi(getOptions)}
        />
      </div> */}
      <div className="space-x-4 space-y-2">
        <button
          onClick={props.onRemove}
          className="mb-2 bg-red-500 text-white h-8 w-16"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          onClick={handleAddOption}
          className="bg-blue-500 text-white h-8 w-24"
        >
          Option <FontAwesomeIcon icon={faPlus} />
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

export default Dropdown;

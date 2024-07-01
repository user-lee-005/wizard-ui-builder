import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setNavConfigs, removeConfig } from "../redux/slices/dataSlice";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import MultiSelect from "react-select-multi-choose";

const NavigationConfigPage = (props) => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);
  const [condition, setCondition] = useState([]);
  const [valueInCondition, setValueInCondition] = useState([]);
  const [nextStep, setNextStep] = useState("");

  const animatedComponents = makeAnimated();

  const fieldOptions = props.fields.map((field) => ({
    label: field.question,
    value: field.qId,
  }));

  const conditionOptions = [
    { value: "equalTo", label: "Equal to..." },
    { value: "notEqualTo", label: "Not equal to..." },
    { value: "greaterThanOrEqualTo", label: "Greater than or equal to..." },
    { value: "greaterThan", label: "Greater than..." },
    { value: "lessThanOrEqualTo", label: "Less than or Equal To..." },
    { value: "lessThan", label: "Less than..." },
    { value: "contains", label: "Contains..." },
  ];

  const handleFieldChange = (selectedOptions) => {
    setFields(selectedOptions);
  };

  const navConfig = {
    pageId: props.pageId,
    fields: fields,
    conditions: fields.map((field, index) => ({
      fieldId: field.value,
      condition: condition[index] ? condition[index].value : "",
      valueInCondition: valueInCondition[index] ? valueInCondition[index] : "",
    })),
    nextStep: nextStep,
  };

  console.log("Conditions:", condition);

  const handleAddConfig = () => {
    dispatch(setNavConfigs(navConfig));
  };

  const handleRemoveConfig = (indexToRemove) => {
    dispatch(removeConfig(indexToRemove));
  };

  const renderExistingConfig = () => {
    if (props.exisitingNavConfig.length !== 0) {
      return (
        <table className="bg-blue-300/80 mt-4 p-2 w-full">
          <thead className="bg-blue-400">
            <th className="border-x border-black">Page ID</th>
            <th className="border-x border-black">Field</th>
            <th className="border-r border-black">Condition</th>
            <th className="border-r border-black">Value</th>
            <th className="border-r border-black">Next Step</th>
            <th className="border-r border-black">Actions</th>
          </thead>
          {props.exisitingNavConfig.map((config, index) => (
            <tbody key={index}>
              <tr className="border-b border-black">
                <td className="border-x border-black text-center">
                  {config.pageId}
                </td>
                <td className="border-x border-black text-center">
                  {config.fields.map((field, index) => (
                    <div key={index}>{field.label}</div>
                  ))}
                </td>
                <td className="border-r border-black text-center">
                  {config.conditions.map((condition, index) => (
                    <div key={index}>{condition.condition}</div>
                  ))}
                </td>
                <td className="border-r border-black text-center">
                  {config.conditions.map((condition, index) => (
                    <div key={index}>{condition.valueInCondition}</div>
                  ))}
                </td>
                <td className="border-r border-black text-center">
                  {config.nextStep}
                </td>
                <td className="border-r border-black text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveConfig(index)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="text-red-500"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div>
        <table className="w-full border-collapse">
          <thead className="bg-blue-300 text-center py-4">
            <tr>
              <th colSpan="2">Enter the required details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 bg-blue-200/50">
              <td className="p-2">Page ID</td>
              <td className="p-2">
                <input
                  type="text"
                  id="config"
                  name="fieldId"
                  value={props.pageId}
                  className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-300 hover:cursor-default"
                  readOnly
                />
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-blue-200/50">
              <td className="p-2">Field</td>
              <td className="p-2">
                <Select
                  value={fields}
                  components={animatedComponents}
                  onChange={handleFieldChange}
                  options={fieldOptions}
                  isMulti
                />
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-blue-200/50">
              <td className="p-2">Select the condition</td>
              <td className="p-2">
                <Select
                  value={condition}
                  components={animatedComponents}
                  onChange={(selectedOptions) => {
                    console.log(selectedOptions);
                    setCondition(selectedOptions);
                  }}
                  options={conditionOptions}
                  isMulti={true}
                />
              </td>
            </tr>
            {fields.map((field, index) => (
              <tr
                className="border-b border-gray-200 bg-blue-200/50"
                key={index}
              >
                <td className="p-2">Enter the value for {field.label}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={valueInCondition}
                    onChange={(e) =>
                      setValueInCondition((prevData) => [
                        ...prevData,
                        e.target.value,
                      ])
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-blue-200/50">
              <td className="p-2">Step to go</td>
              <td className="p-2">
                <select
                  name="stepToGo"
                  id="stepToGo"
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Next Step</option>
                  {Array.from({ length: props.steps }, (_, i) => i + 1).map(
                    (step) => (
                      <option value={step}>{step}</option>
                    )
                  )}
                  <option value="submit">Submit</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        {renderExistingConfig()}
        <div className="flex space-x-36 mt-4">
          <button
            className="bg-green-400 w-44 h-10 rounded-md shadow-sm text-white font-semibold hover:bg-green-600"
            onClick={() => handleAddConfig()}
          >
            Add Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationConfigPage;

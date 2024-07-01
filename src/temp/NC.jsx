import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setNavConfigs, removeConfig } from "../redux/slices/dataSlice";

const NavigationConfigPage = (props) => {
  const dispatch = useDispatch();
  const [field, setField] = useState("");
  const [condition, setCondition] = useState("");
  const [valueInCondition, setValueInCondition] = useState("");
  const [nextStep, setNextStep] = useState("");

  const navConfig = {
    pageId: props.pageId,
    field: field,
    condition: condition,
    valueInCondition: valueInCondition,
    nextStep: nextStep,
  };

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
                  {config.field}
                </td>
                <td className="border-r border-black text-center">
                  {config.condition}
                </td>
                <td className="border-r border-black text-center">
                  {config.valueInCondition}
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
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Select the fields</option>
                  {props.fields.map((field, index) => (
                    <option key={index} value={field.question}>
                      {field.question}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-blue-200/50">
              <td className="p-2">Select the condition</td>
              <td className="p-2">
                <select
                  name="condition"
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Select a condition</option>
                  <option value="equalTo">Equal to...</option>
                  <option value="notEqualTo">Not equal to...</option>
                  <option value="greaterThanOrEqualTo">
                    Greater than or equal to...
                  </option>
                  <option value="greaterThan">Greater than...</option>
                  <option value="lessThanOrEqualTo">
                    Less than or Equal To...
                  </option>
                  <option value="lessThan">Less than...</option>
                  <option value="contains">Contains...</option>
                </select>
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-blue-200/50">
              <td className="p-2">
                Enter the value that should match the condition
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={valueInCondition}
                  onChange={(e) => setValueInCondition(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
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

// export default NavigationConfigPage;

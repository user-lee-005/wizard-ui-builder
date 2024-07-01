import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

const WizardsButton = ({ num, onRemove, templateId }) => {
  const navigate = useNavigate();
  const removeWizard = () => {
    onRemove(num);
  };

  const handleClick = (templateId) => {
    navigate(
      templateId ? `/edit/${templateId}/${num}` : `/create/pages/${num}`
    );
  };

  return (
    <div className="flex flex-col w-40 mt-10 bg-emerald-400 rounded-lg shadow-lg overflow-hidden hover:scale-105 ">
      <div
        className="flex h-60 w-full aspect-w-1 aspect-h-1 
        overflow-hidden hover:cursor-pointer
        bg-slate-300 text-black items-center justify-center"
        onClick={() => (templateId ? handleClick(templateId) : handleClick())}
      >
        Page {num}
      </div>
      <button
        className="bg-red-500 text-white rounded-b-lg py-2 px-4"
        onClick={removeWizard}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
};

export default WizardsButton;

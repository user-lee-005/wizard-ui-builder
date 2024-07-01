import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  const modalClasses = isOpen ? "fixed inset-0 z-50 overflow-y-auto" : "hidden";

  return (
    <div className={`modal flex ${modalClasses}`}>
      <div className="modal-overlay fixed inset-0 bg-black opacity-50 z-40"></div>
      <div className="modal-container mx-auto mt-10 p-4 z-50">
        <div className="modal-content flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg mb-4">
            No changes can be made. Are you sure you want to proceed?
          </p>
          <div>
            <button
              className="bg-red-600 mr-2 text-xl hover:bg-gray-300 hover:text-red-600 text-white w-44 h-12 rounded-md"
              onClick={onCancel}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <button
              className="bg-green-600 hover:bg-gray-300 text-xl hover:text-green-600 text-white w-44 h-12 rounded-md"
              onClick={onConfirm}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

import { faHome, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Header = ({ isPreview }) => {
  const { wizardId } = useParams();
  const { templateId } = useParams();
  const wizardCount = useSelector((state) => state.wizardCount.wizardCount);
  const pages = useSelector((state) => state.formData.pages);
  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-blue-600 flex justify-between h-16 items-center rounded-sm p-6">
      <div className="text-2xl font-semibold text-white">
        Page {wizardId} of {isPreview ? pages.length : wizardCount}
      </div>
      {isPreview ? (
        <></>
      ) : (
        <div className="text-2xl hidden md:block font-bold text-white">
          Create Steps
        </div>
      )}
      <div className="flex space-x-4">
        <div
          className="text-xl text-white cursor-pointer hover:scale-125"
          onClick={() => handleHomeButton()}
        >
          <FontAwesomeIcon icon={faHome} />
        </div>
        <div
          className="text-xl text-white cursor-pointer hover:scale-125"
          onClick={() =>
            isPreview ? navigate(`/edit/${templateId}`) : navigate("/create")
          }
        >
          <FontAwesomeIcon icon={faLayerGroup} />
        </div>
      </div>
    </div>
  );
};

export default Header;

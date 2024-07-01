import React, { useEffect, useState } from "react";
import Header from "../page components/Header";
import TextBox from "../components/TextBox";
import RadioButton from "../components/RadioButton";
import Checkbox from "../components/Checkboxes";
import Textarea from "../components/Textarea";
import Dropdown from "../components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  addFields,
  addPage,
  removeFields,
  setFormData,
  setTemplateTitle,
} from "../redux/slices/dataSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DataService from "../service/DataService";
import { nanoid } from "@reduxjs/toolkit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faChevronCircleUp,
  faPencil,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import NavigationConfigPage from "./NavigationConfigPage";

const RenderingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [showNavConfig, setShowNavConfig] = useState(false);

  const { templateId } = useParams();

  const { wizardId } = useParams();
  const pageId = parseInt(wizardId, 10);

  const wizardCount = useSelector((state) => state.wizardCount.wizardCount);

  const [isPreview, setIsPreview] = useState(state ? state.isPreview : false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCheckboxOpen, setIsCheckboxOpen] = useState(false);

  const formData = useSelector((state) => state.formData);
  const pages = useSelector((state) => state.formData.pages);

  const pagesLength = formData.pages.length || wizardCount;

  const foundPage = pages.find((page) => page.pageId === pageId);

  const exisitingNavConfig = useSelector((state) => state.formData.navConfigs);

  const sortedFields = foundPage
    ? [...foundPage.fields].sort((a, b) => a.order - b.order)
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DataService.getDataById(templateId);
        dispatch(
          setFormData({
            templateId: response.data.templateId,
            templateTitle: response.data.templateTitle,
            pages: response.data.pages,
            navConfigs: response.data.navConfigs,
          })
        );
        setIsEdit(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [templateId]);

  const handleCreate = () => {
    DataService.saveData(formData)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    navigate("/");
    window.location.reload(true);
  };

  const handlePreview = () => {
    setIsPreview(true);
    navigate(isEdit ? `/edit/${templateId}/1` : "/create/pages/1");
  };

  const handleBack = () => {
    navigate(isEdit ? `/edit/${templateId}` : `/create`);
  };

  const handleNext = () => {
    const nextPageId = pageId + 1;
    dispatch(addPage({ pageId: nextPageId }));
    navigate(
      isEdit
        ? `/edit/${templateId}/${nextPageId}`
        : `/create/pages/${nextPageId}`
    );
  };

  const handlePrev = () => {
    navigate(
      isEdit
        ? `/edit/${templateId}/${pageId - 1}`
        : `/create/pages/${pageId - 1}`
    );
  };

  const addDynamicField = (type) => {
    const qId = nanoid();
    const order = sortedFields.length + 1;

    const newField = {
      qId: qId,
      pageIdToAddFields: pageId,
      questionType: type,
      question: "",
      isRequired: false,
      customLink: { link: "", linkName: "" },
      order,
    };
    dispatch(addFields(newField));
    if (isEdit) {
      DataService.saveData(formData).then((response) =>
        console.log("Saved Data:", response.data)
      );
    }
  };

  const removeDynamicField = (fieldId) => {
    dispatch(
      removeFields({
        pageIdToRemove: pageId,
        fieldIdToRemove: fieldId,
      })
    );
    if (isEdit) {
      DataService.saveData(formData).then((response) =>
        console.log("Saved Data:", response.data)
      );
    }
  };

  const renderDynamicField = (field) => {
    switch (field.questionType) {
      case "text":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "text")}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            isPreview={isPreview}
            isRequired={field.isRequired}
          />
        );
      case "email":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "email")}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            isPreview={isPreview}
            isRequired={field.isRequired}
          />
        );
      case "password":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "password")}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            isPreview={isPreview}
            isRequired={field.isRequired}
          />
        );
      case "tel":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "tel")}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            isPreview={isPreview}
            isRequired={field.isRequired}
          />
        );
      case "radio":
        return (
          <RadioButton
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "radio")}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
          />
        );
      case "singleCheckbox":
        return (
          <Checkbox
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "checkbox")}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            customLink={field.customLink}
            cType={"singleCheckbox"}
          />
        );
      case "multipleCheckboxes":
        return (
          <Checkbox
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "checkbox")}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            cType={"multipleCheckboxes"}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.qId}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "text")}
            pageId={pageId}
            isRequired={field.isRequired}
            qId={field.qId}
            isPreview={isPreview}
          />
        );
      case "singleDropdown":
        return (
          <Dropdown
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "dropdown")}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            dType={"singleDropdown"}
          />
        );
      case "multipleDropdown":
        return (
          <Dropdown
            key={field.qId}
            options={field.options}
            value={field.question}
            onRemove={() => removeDynamicField(field.qId, "dropdown")}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            dType={"multipleDropdown"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <Header isPreview={isPreview} />
      </div>
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        {isPreview ? (
          <div
            className="text-md font-semibold rounded-md bg-white text-blue-600 w-36 h-8 flex items-center 
            justify-center mb-6 absolute top-20 right-5 hover:cursor-pointer hover:scale-105 hover:shadow-xl"
            onClick={() => setIsPreview(false)}
          >
            Edit template &nbsp; <FontAwesomeIcon icon={faPencil} />
          </div>
        ) : (
          <div className="pt-6 max-w-full min-w-screen space-y-6 lg:min-h-screen">
            <div className="flex lg:flex-col space-x-3 content-around gap-y-4 bg-blue-300/80 pb-10 pt-6 px-10 z-10 items-center backdrop-blur-[150px] overflow-y-auto">
              <div className="text-gray-800 font-semibold text-lg hidden lg:block">
                Select Components
              </div>
              <button
                className="bg-blue-600 btn mt-2"
                onClick={() => addDynamicField("text")}
              >
                Add Text
              </button>
              <button
                className="bg-blue-600 btn mt-2"
                onClick={() => addDynamicField("radio")}
              >
                Add Radio Button
              </button>
              <div className="flex flex-col items-center">
                <button
                  className="bg-blue-600 btn mt-2"
                  onClick={() => setIsCheckboxOpen(!isCheckboxOpen)}
                >
                  Add Checkbox
                </button>
                {isCheckboxOpen && (
                  <div className="flex flex-col items-center bg-slate-400/60 px-2 pb-3">
                    <button
                      className="bg-teal-600 rounded-md w-44 h-8 text-gray-200 font-semibold mt-2"
                      onClick={() => addDynamicField("singleCheckbox")}
                    >
                      Single Checkbox
                    </button>
                    <button
                      className="bg-teal-600 rounded-md w-44 h-8 text-gray-200 font-semibold mt-2"
                      onClick={() => addDynamicField("multipleCheckboxes")}
                    >
                      Multiple Checkboxes
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <button
                  className="bg-blue-600 btn mt-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Add Dropdown
                </button>
                {isDropdownOpen && (
                  <div className="flex flex-col items-center bg-slate-400/60 px-2 pb-3">
                    <button
                      className="bg-teal-600 rounded-md w-44 h-8 text-gray-200 font-semibold mt-2"
                      onClick={() => addDynamicField("singleDropdown")}
                    >
                      Single Select
                    </button>
                    <button
                      className="bg-teal-600 rounded-md w-44 h-8 text-gray-200 font-semibold mt-2"
                      onClick={() => addDynamicField("multipleDropdown")}
                    >
                      Multi Select
                    </button>
                  </div>
                )}
              </div>
              <button
                className="bg-blue-600 btn mt-2"
                onClick={() => addDynamicField("textarea")}
              >
                Add Textarea
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-grow flex-col p-6 text-gray-800 items-center min-h-screen w-screen">
          <div className="text-2xl font-semibold mb-6 mt-8 flex items-center">
            {isPreview ? (
              <>{formData.templateTitle}</>
            ) : isEditTitle ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => dispatch(setTemplateTitle(title))}
                  className="border-none bg-gray-200 h-8"
                />
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className={`ml-4 text-emerald-600 hover:cursor-pointer`}
                  onClick={() => setIsEditTitle(!isEditTitle)}
                />
              </>
            ) : (
              <>
                {formData.templateTitle}
                <FontAwesomeIcon
                  icon={faPencil}
                  className={`ml-4 hover:cursor-pointer`}
                  onClick={() => setIsEditTitle(!isEditTitle)}
                />
              </>
            )}
          </div>
          {isPreview ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="bg-slate-300/60 min-w-full">
                <div className=" grid gap-2 mt-6 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 sm:max-w-screen lg:max-w-full space-y-4 flex-grow p-10">
                  {sortedFields.map((field) => renderDynamicField(field))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="min-w-full">
              <div className="flex flex-col sm:max-w-screen space-y-4 flex-grow">
                {sortedFields.map((field) => (
                  <div
                    key={field.qId}
                    className="bg-blue-300/80 p-4 rounded-md shadow-md"
                  >
                    {renderDynamicField(field)}
                  </div>
                ))}
              </div>
            </form>
          )}
          <div className="grid grid-cols-2 gap-4 place-content-around h-48 w-full">
            {pageId === 1 ? (
              isPreview ? (
                <div></div>
              ) : (
                <button
                  className="btn-blue rounded-md hover:shadow-md w-24 h-8 col-start-1"
                  onClick={() => handleBack()}
                >
                  Back
                </button>
              )
            ) : (
              <button
                className="btn-blue rounded-md hover:shadow-md w-24 h-8 col-start-1"
                onClick={() => handlePrev()}
              >
                Prev
              </button>
            )}
            {pageId === pagesLength ? (
              <button
                className="btn-blue rounded-md hover:shadow-md w-24 h-8 col-end-7"
                onClick={() => (isPreview ? handleCreate() : handlePreview())}
              >
                {isPreview ? (isEdit ? "Finish" : "Create") : "Preview"}
              </button>
            ) : (
              <button
                className="btn-blue rounded-md hover:shadow-md w-24 h-8 col-end-7"
                onClick={() => handleNext()}
              >
                Next
              </button>
            )}
          </div>
          <div>
            <button
              className="bg-blue-500 p-2 font-semibold text-lg text-white rounded-md hover:bg-blue-700"
              onClick={() => setShowNavConfig(!showNavConfig)}
            >
              Any Navigation Configuration
              <FontAwesomeIcon
                icon={showNavConfig ? faChevronCircleUp : faChevronCircleDown}
                className="ml-2"
              />
            </button>
          </div>
          <div className="mt-4 mb-10">
            {showNavConfig && (
              <NavigationConfigPage
                pageId={pageId}
                fields={sortedFields}
                steps={pagesLength}
                exisitingNavConfig={exisitingNavConfig}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderingPage;

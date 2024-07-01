import React from "react";
import Header from "../page components/Header";
import { useSelector } from "react-redux";
import TextBox from "../components/TextBox";
import RadioButton from "../components/RadioButton";
import Checkbox from "../components/Checkboxes";
import Textarea from "../components/Textarea";
import Dropdown from "../components/Dropdown";
import { useNavigate, useParams } from "react-router-dom";
import DataService from "../service/DataService";
import { render } from "@testing-library/react";

const PreviewPage = () => {
  const navigate = useNavigate();
  const isPreview = true;
  const { pageId } = useParams();
  const id = parseInt(pageId, 10);
  const formData = useSelector((state) => state.formData);
  const pages = useSelector((state) => {
    console.log("Redux State Pages:", state.formData.pages);
    return state.formData.pages;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    DataService.saveData(formData);
    navigate("/");
  };

  const handleNext = () => {
    navigate(`/edit/pages/${id + 1}`);
  };

  const handlePrev = () => {
    navigate(`/edit/pages/${id - 1}`);
  };

  const renderPreviewPage = (field) => {
    switch (field.questionType) {
      case "text":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            pageId={id}
            qId={field.qId}
            isPreview={isPreview}
          />
        );
      case "radio":
        return (
          <RadioButton
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            isPreview={isPreview}
            pageId={id}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            isPreview={isPreview}
            pageId={id}
          />
        );
      case "dropdown":
        return (
          <Dropdown
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            isPreview={isPreview}
            pageId={id}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.qId}
            value={field.question}
            pageId={id}
            isPreview={isPreview}
            qId={field.qId}
          />
        );
      default:
        return null;
    }
  };

  console.log("Page ID from URL:", pageId);

  if (!pages || pages.length === 0) {
    console.log("No pages found in Redux state.");
    return null;
  }

  const foundPage = pages.find((page) => page.pageId === id);

  console.log("Found Page:", foundPage);

  if (!foundPage) {
    console.log(`No page found with ID ${id}.`);
    return null;
  }

  return (
    <div>
      <div>
        <Header isPreview={isPreview} />
      </div>
      <div onClick={() => navigate(`/create/pages/${id}`)}>Edit template</div>
      <div>
        {/* {pages.map((page) => (
          <div key={page.pageId}>
            <div>Step {page.pageId}</div>
            <div>{page.fields.map((field) => renderPreviewPage(field))}</div>
          </div>
        ))} */}
        {foundPage.map((field) => renderPreviewPage(field))}
      </div>
      <div className="grid grid-cols-2 gap-4 place-content-around h-48 w-full">
        {id === 1 ? (
          <div></div>
        ) : (
          <button
            className="btn-green rounded-md hover:shadow-md w-24 h-8 col-start-1"
            onClick={(e) => handlePrev(e)}
          >
            Prev
          </button>
        )}
        {id === pages.length ? (
          <button
            className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
            onClick={(e) => handleCreate(e)}
          >
            Create
          </button>
        ) : (
          <button
            className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
            onClick={() => handleNext()}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;

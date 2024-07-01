import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DataService from "../service/DataService";
import { setFormData } from "../redux/slices/dataSlice";
import { produce } from "immer";
import { setAnswers } from "../redux/slices/responseSlice";

import TextBox from "../components/TextBox";
import Textarea from "../components/Textarea";
import Checkbox from "../components/Checkboxes";
import RadioButton from "../components/RadioButton";
import Dropdown from "../components/Dropdown";
import ConfirmationModal from "../page components/ConfirmationModal";
import toast from "react-hot-toast";

const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isPreview = true;
  const { wizardId } = useParams();
  const pageId = parseInt(wizardId, 10);
  const { templateId } = useParams();
  const templateTitle = useSelector((state) => state.formData.templateTitle);
  console.log("templateTitle:", templateTitle);
  const pages = useSelector((state) => state.formData.pages);
  const foundPage = pages.find((page) => page.pageId === pageId);

  const navigationConfig = useSelector((state) => state.formData.navConfigs);

  const sortedFields = foundPage
    ? [...foundPage.fields].sort((a, b) => a.order - b.order)
    : [];
  const [savedData, setSavedData] = useState([]);
  const response = useSelector((state) => state.responses);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DataService.getDataById(templateId);
        console.log("Res:", response.data);
        dispatch(
          setFormData({
            templateId: response.data.templateId,
            templateTitle: response.data.templateTitle,
            pages: response.data.pages,
            navConfigs: response.data.navConfigs,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [templateId]);

  const handleSetSavedData = (dataFromComponent) => {
    setSavedData((prevData) => {
      const { userId, responses } = dataFromComponent;
      const qId = responses[0].qId;
      const question = responses[0].question;
      const answer = responses[0]?.answer;

      return produce(prevData, (draft) => {
        const existingUserIndex = draft.findIndex(
          (user) => user.userId === userId
        );

        if (existingUserIndex !== -1) {
          const existingTemplateIndex = draft[
            existingUserIndex
          ].userResponses.findIndex(
            (template) => template.templateId === templateId
          );

          if (existingTemplateIndex !== -1) {
            const page = draft[existingUserIndex].userResponses[
              existingTemplateIndex
            ].pages.find((page) => page.pageId === pageId);

            if (page) {
              const existingResponseIndex = page.responses.findIndex(
                (response) => response.qId === qId
              );

              if (existingResponseIndex !== -1) {
                page.responses[existingResponseIndex] = {
                  qId,
                  question,
                  answer,
                };
              } else {
                page.responses.push({
                  qId,
                  question,
                  answer,
                });
              }
            } else {
              draft[existingUserIndex].userResponses[
                existingTemplateIndex
              ].pages.push({
                pageId: pageId,
                responses: [...responses],
              });
            }
          } else {
            draft[existingUserIndex].userResponses.push({
              templateId: templateId,
              templateTitle: templateTitle,
              pages: [
                {
                  pageId: pageId,
                  responses: [...responses],
                },
              ],
            });
          }
        } else {
          draft.push({
            userName: userName,
            userId: userId,
            userResponses: [
              {
                templateId: templateId,
                templateTitle: templateTitle,
                pages: [
                  {
                    pageId: pageId,
                    responses: [...responses],
                  },
                ],
              },
            ],
          });
        }
      });
    });
  };

  const handleSave = () => {
    if (areRequiredFieldsFilled()) {
      dispatch(setAnswers(...savedData));
      setIsSubmit(true);
      setIsOpen(true);
    } else {
      toast.error("Please fill the required fields");
    }
  };

  const handleSubmit = () => {
    DataService.saveResponse(response)
      .then((res) => console.log("Response Submitted:", res.data))
      .catch((err) => console.log(err));
    navigate("/");
    window.location.reload(true);
  };

  // const handleNext = () => {
  //   navigate(`/form/${templateId}/${pageId + 1}`);
  //   setIsOpen(false);
  // };

  const handleNext = () => {
    // const userConditions = navigationConfig.filter((config) =>
    //   savedData.some((userData) =>
    //     userData.userResponses.some((userResponse) =>
    //       userResponse.pages.some(
    //         (page) =>
    //           page.pageId === pageId &&
    //           page.responses.some(
    //             (response) =>
    //               response.question === config.field &&
    //               checkCondition(
    //                 response.answer,
    //                 config.condition,
    //                 config.valueInCondition
    //               )
    //           )
    //       )
    //     )
    //   )
    // );

    // console.log("userConditions", userConditions);

    const userConditions = navigationConfig.filter((config) => {
      console.log("Checking condition for config:", config);

      const isConditionMet = savedData.some((userData) => {
        console.log("Checking user data:", userData);

        const isUserResponseMet = userData.userResponses.some(
          (userResponse) => {
            console.log("Checking user response:", userResponse);

            const isPageMet = userResponse.pages.some((page) => {
              console.log("Checking page:", page);

              const isResponseMet = page.responses.some((response) => {
                console.log("Checking response:", response.question);

                const isConditionSatisfied =
                  response.question === config.field &&
                  checkCondition(
                    response.answer,
                    config.condition,
                    config.valueInCondition
                  );

                console.log("config.nextStep:", config.nextStep);
                console.log("response.answer:", response.answer);
                console.log("config.condition:", config.condition);
                console.log("config.value:", config.valueInCondition);

                console.log(
                  "checkCondition:",
                  checkCondition(
                    response.answer,
                    config.condition,
                    config.valueInCondition
                  )
                );

                console.log("Is condition satisfied?", isConditionSatisfied);

                return isConditionSatisfied;
              });

              console.log("Is page met?", isResponseMet);

              return page.pageId === pageId && isResponseMet;
            });

            console.log("Is user response met?", isPageMet);

            return isPageMet;
          }
        );

        console.log("Is condition met for user data?", isUserResponseMet);

        return isUserResponseMet;
      });

      console.log("Is condition met for config?", isConditionMet);

      return isConditionMet;
    });

    console.log("userConditions", userConditions);

    if (userConditions.length > 0) {
      const nextStep = userConditions[0].nextStep;
      if (nextStep === "submit") {
        handleSubmit();
      } else {
        navigate(`/form/${templateId}/${nextStep}`);
      }
    } else {
      navigate(`/form/${templateId}/${pageId + 1}`);
    }

    setIsOpen(false);
  };

  const handleNextClick = () => {
    console.log(areRequiredFieldsFilled());
    if (areRequiredFieldsFilled()) {
      setIsSubmit(false);
      setIsOpen(true);
    } else {
      alert("Please fill out all required fields.");
    }
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  // const checkCondition = (answer, condition, value) => {
  //   switch (condition) {
  //     // case "equals":
  //     //   return answer === value;
  //     // case "notEqualTo":
  //     //   return answer !== value;
  //     case "equalTo":
  //       return answer.toLowerCase() === value.toLowerCase();
  //     case "notEqualTo":
  //       return answer.toLowerCase() !== value.toLowerCase();
  //     case "contains":
  //       if (value.toLowerCase() !== "any") {
  //         return answer.includes(value);
  //       } else {
  //         return true;
  //       }
  const checkCondition = (answer, condition, value) => {
    const lowercasedAnswer = Array.isArray(answer)
      ? answer.map((item) => (item ? item.toLowerCase() : null))
      : answer
      ? answer.toLowerCase()
      : null;

    switch (condition) {
      case "equalTo":
        return Array.isArray(value)
          ? value.some((item) => lowercasedAnswer.includes(item.toLowerCase()))
          : lowercasedAnswer === value.toLowerCase();
      case "notEqualTo":
        return Array.isArray(value)
          ? !value.some((item) => lowercasedAnswer.includes(item.toLowerCase()))
          : lowercasedAnswer !== value.toLowerCase();
      case "contains":
        if (value.toLowerCase() !== "any") {
          if (Array.isArray(answer)) {
            return (
              value.toLowerCase() === "any" ||
              value.every((item) =>
                lowercasedAnswer.includes(item.toLowerCase())
              )
            );
          } else {
            return (
              value.toLowerCase() === "any" ||
              lowercasedAnswer.includes(value.toLowerCase())
            );
          }
        } else {
          return true;
        }
      case "greaterThanOrEqualTo":
        return Number(answer) >= Number(value);
      case "greaterThan":
        return Number(answer) > Number(value);
      case "lessThanOrEqualTo":
        return Number(answer) <= Number(value);
      case "lessThan":
        return Number(answer) < Number(value);
      default:
        return false;
    }
  };

  const areRequiredFieldsFilled = () => {
    const unfilledRequiredFields = sortedFields.filter(
      (field) => field.isRequired && !hasAnswer(field.qId)
    );
    console.log("unfilledRequiredFields", unfilledRequiredFields);
    return unfilledRequiredFields.length === 0;
  };

  const hasAnswer = (qId) => {
    const hasAnswer = savedData.some((data) =>
      data.userResponses.some((template) =>
        template.pages.some((page) =>
          page.responses.some(
            (response) => response.qId === qId && response.answer !== ""
          )
        )
      )
    );
    console.log(hasAnswer);
    return hasAnswer;
  };

  const renderDynamicField = (field) => {
    switch (field.questionType) {
      case "text":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            pageId={pageId}
            qId={field.qId}
            isPreview={isPreview}
            onDataUpdate={handleSetSavedData}
            isRequired={field.isRequired}
            questionType={field.questionType}
            characterLimit={field.characterLimit}
          />
        );
      case "email":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            onDataUpdate={handleSetSavedData}
            isPreview={isPreview}
            isRequired={field.isRequired}
          />
        );
      case "password":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            isPreview={isPreview}
            onDataUpdate={handleSetSavedData}
            isRequired={field.isRequired}
            characterLimit={field.characterLimit}
          />
        );
      case "tel":
        return (
          <TextBox
            key={field.qId}
            value={field.question}
            pageId={pageId}
            qId={field.qId}
            questionType={field.questionType}
            isPreview={isPreview}
            onDataUpdate={handleSetSavedData}
            isRequired={field.isRequired}
            characterLimit={field.characterLimit}
          />
        );
      case "radio":
        return (
          <RadioButton
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            onDataUpdate={handleSetSavedData}
          />
        );
      case "singleCheckbox":
        return (
          <Checkbox
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            cType={"singleCheckbox"}
            onDataUpdate={handleSetSavedData}
            customLink={field.customLink}
          />
        );
      case "multipleCheckboxes":
        return (
          <Checkbox
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            pageId={pageId}
            isRequired={field.isRequired}
            isPreview={isPreview}
            cType={"multipleCheckboxes"}
            onDataUpdate={handleSetSavedData}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.qId}
            value={field.question}
            pageId={pageId}
            qId={field.qId}
            isPreview={isPreview}
            onDataUpdate={handleSetSavedData}
            isRequired={field.isRequired}
            characterLimit={field.characterLimit}
          />
        );
      case "singleDropdown":
        return (
          <Dropdown
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            pageId={pageId}
            isPreview={isPreview}
            dType={"singleDropdown"}
            isRequired={field.isRequired}
            onDataUpdate={handleSetSavedData}
          />
        );
      case "multipleDropdown":
        return (
          <Dropdown
            key={field.qId}
            options={field.options}
            value={field.question}
            qId={field.qId}
            pageId={pageId}
            isPreview={isPreview}
            dType={"multipleDropdown"}
            isRequired={field.isRequired}
            onDataUpdate={handleSetSavedData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center z-10">
      <div className="flex justify-center p-4 font-bold text-3xl bg-blue-500 min-w-screen">
        {templateTitle}
      </div>
      <div className="flex items-center justify-center mt-10">
        <label className="flex flex-col mt-4 w-96 relative">
          <span
            className={`text-md text-gray-900 absolute px-2 left-2 bottom-3 bg-white transform ${
              userName
                ? "-translate-y-6 scale-95 transition duration-200 z-30"
                : ""
            } hover:cursor-text z-10`}
          >
            Enter your username
          </span>
          <input
            type="text"
            value={userName}
            onChange={(e) => handleUserNameChange(e)}
            className="h-12 bg-transparent text-input text-md rounded-md z-20"
          />
        </label>
      </div>
      <div className="flex flex-col items-center m-10">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-slate-300/60 w-fit">
            <div className=" grid gap-2 mt-6 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 sm:max-w-screen lg:max-w-full space-y-4 flex-grow p-10">
              {sortedFields.map((field) => renderDynamicField(field))}
              <ConfirmationModal
                isOpen={isOpen}
                onCancel={() => setIsOpen(false)}
                onConfirm={() => (isSubmit ? handleSubmit() : handleNext())}
              />
            </div>
          </div>
        </form>
        <div className="grid grid-cols-2 gap-4 place-content-around h-48 w-full">
          {pageId === pages.length ? (
            <button
              className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
              onClick={() => handleSave()}
            >
              Submit
            </button>
          ) : (
            <button
              className="btn-green rounded-md hover:shadow-md w-24 h-8 col-end-7"
              onClick={() => handleNextClick()}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;

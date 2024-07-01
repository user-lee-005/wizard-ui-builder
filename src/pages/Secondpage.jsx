import React, { useState, useEffect } from "react";
import WizardsButton from "../page components/WizardsButton";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { setWizardCount } from "../redux/slices/wizardCountSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { addPage, removePage } from "../redux/slices/dataSlice";
import { useNavigate, useParams } from "react-router-dom";
import DataService from "../service/DataService";

const Secondpage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const wizardCount = useSelector((state) => state.wizardCount.wizardCount);
  const [buttonArray, setButtonArray] = useState([]);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await DataService.getDataById(templateId);
      if (response.status === 200 && response.data.id) {
        const pageIds = response.data.pages.map((page) => page.pageId);
        setButtonArray([...buttonArray, ...pageIds]);
        dispatch(setWizardCount(pageIds.length));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [templateId]);

  useEffect(() => {
    setButtonArray(Array.from({ length: wizardCount }, (_, i) => i + 1));
  }, [wizardCount]);

  useEffect(() => {
    buttonArray.forEach((num) => dispatch(addPage({ pageId: num })));
  }, [buttonArray, dispatch]);

  const addWizard = () => {
    const updatedWizards = [...buttonArray, buttonArray.length + 1];
    setButtonArray(updatedWizards);
    dispatch(setWizardCount(updatedWizards.length));
    dispatch(addPage({ pageId: updatedWizards.length }));
  };

  const removeWizard = async (wizardNumber) => {
    if (templateId) {
      try {
        await DataService.deletePage(templateId, wizardNumber);
        const updatedWizards = buttonArray.filter((n) => n !== wizardNumber);
        setButtonArray(updatedWizards);
        dispatch(setWizardCount(updatedWizards.length));
        dispatch(removePage(wizardNumber));
      } catch (error) {
        console.error("Error Deleting Pages:", error);
      }
    } else {
      const updatedWizards = buttonArray.filter((n) => n !== wizardNumber);
      setButtonArray(updatedWizards);
      dispatch(setWizardCount(updatedWizards.length));
      dispatch(removePage(wizardNumber));
    }
  };

  return (
    <div className="flex flex-col bg-gray-400 min-h-screen items-center w-full">
      <div className="lg:self-end xl:self-end mr-60 mt-10 text-2xl text-white cursor-pointer">
        <FontAwesomeIcon
          icon={faHome}
          className="hover:shadow-xl hover:scale-110"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {buttonArray.map((num, index) => (
          <WizardsButton
            key={index}
            num={num}
            onRemove={removeWizard}
            templateId={templateId}
          />
        ))}
      </div>
      <button
        className="rounded-md shadow-md bg-blue-950 w-20 h-20 mt-8 mb-10 text-4xl text-white hover:text-blue-500 hover:bg-white"
        onClick={addWizard}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
    </div>
  );
};

export default Secondpage;

//------------------------------------------------------------------------------------------------------------------------

// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setWizardCount } from "../redux/slices/wizardCount";
// import WizardsButton from "../page components/WizardsButton";
// import "../index.css";

// const Secondpage = () => {
//   // Get the wizardCount from the Redux store
//   const wizardCount = useSelector((state) => state.wizardCount);

//   const dispatch = useDispatch();

//   const addWizard = () => {
//     // Update the wizardCount in the Redux store
//     dispatch(setWizardCount(wizardCount + 1));
//     console.log(wizardCount);
//   };

//   const removeWizard = (wizardNumber) => {
//     // Update the wizardCount in the Redux store
//     dispatch(setWizardCount(wizardCount - 1));
//   };

//   const buttonArray = Array.from({ length: wizardCount }, (_, i) => i + 1);

//   return (
//     <div className="flex flex-col align-middle mt-6 w-max">
//       <div>
//         {buttonArray.map((num, index) => (
//           <WizardsButton key={index} num={num} onRemove={removeWizard} />
//         ))}
//       </div>

//       <button className="btn btn-blue mt-4" onClick={addWizard}>
//         Add Wizard
//       </button>
//     </div>
//   );
// };

// export default Secondpage;

// // import React from "react";

// // const TextBox = ({ name }) => {
// //   return (
// //     <div>
// //       <input type="text" name={name} placeholder="name" />
// //     </div>
// //   );
// // };

// // export default TextBox;
// // TextBox.js

import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

const TextBox = ({ onRemove, onChange, value }) => (
  <div className="flex flex-col">
    <input type="text" value="" className="bg-blue-200"/>
    <input type="text" value={value} onChange={onChange} className="bg-blue-400"/>
    <button onClick={onRemove}>Remove</button>
  </div>
);

const DynamicTextBoxes = () => {
  const [textBoxes, setTextBoxes] = useState([]);
  //   const navigate = useNavigate();

  const addTextBox = () => {
    const newTextBoxes = [...textBoxes, { id: Date.now(), value: "" }];
    setTextBoxes(newTextBoxes);
  };

  const removeTextBox = (id) => {
    const updatedTextBoxes = textBoxes.filter((textBox) => textBox.id !== id);
    setTextBoxes(updatedTextBoxes);
  };

  const updateTextBox = (id, value) => {
    const updatedTextBoxes = textBoxes.map((textBox) =>
      textBox.id === id ? { ...textBox, value } : textBox
    );
    setTextBoxes(updatedTextBoxes);
  };

  return (
    <div>
      <div onClick={addTextBox} className="btn btn-blue mb-4">
        Add Text Box
      </div>
      {textBoxes.map((textBox) => (
        <TextBox
          key={textBox.id}
          value={textBox.value}
          onChange={(e) => updateTextBox(textBox.id, e.target.value)}
          onRemove={() => removeTextBox(textBox.id)}
        />
      ))}
      {/* <button onClick={moveNext}>Next</button> */}
    </div>
  );
};

export default DynamicTextBoxes;

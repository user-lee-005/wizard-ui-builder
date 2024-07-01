// import { createSlice } from "@reduxjs/toolkit";

// const textBoxSlice = createSlice({
//   name: "Textbox",
//   initialState: {
//     textBoxValues: [], // Initialize with an empty array
//   },
//   reducers: {
//     addTextBox: (state, action) => {
//       state.textBoxValues.push(action.payload);
//     },
//     removeTextBox: (state, action) => {
//       const deleteIndex = action.payload;
//       return state.textBoxValues.filter((_, index) => index !== deleteIndex)
//     },
//   },
// });

// export const { addTextBox, removeTextBox } = textBoxSlice.actions;
// export default textBoxSlice.reducer;

// textBoxSlice.js
import { createSlice } from "@reduxjs/toolkit";

const textBoxSlice = createSlice({
  name: "Textbox",
  initialState: {
    textBoxes: []
  },
  reducers: {
    addTextBox: (state, action) => {
      state.textBoxes.push(action.payload);
    },
    removeTextBox: (state, action) => {
      const deleteIndex = state.textBoxes.findIndex(
        (textBox) => textBox.id === action.payload
      );

      if (deleteIndex !== -1) {
        state.textBoxes.splice(deleteIndex, 1);
      }
    },
    updateTextBoxes(state, action){
      state.textBoxes = action.payload
    }
  },
});

export const { addTextBox, removeTextBox, updateTextBoxes } = textBoxSlice.actions;
export default textBoxSlice.reducer;

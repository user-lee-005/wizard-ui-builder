// radioButtonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const radioButtonSlice = createSlice({
  name: "RadioButton",
  initialState: {
    radioButtons: [],
  },
  reducers: {
    addRadioButton: (state, action) => {
      state.radioButtons.push(action.payload);
    },
    removeRadioButton: (state, action) => {
      const deleteIndex = state.radioButtons.findIndex(
        (radioButton) => radioButton.id === action.payload
      );

      if (deleteIndex !== -1) {
        state.radioButtons.splice(deleteIndex, 1);
      }
    },
  updateRadioButton: (state, action) => {
      const { id, options } = action.payload;
      const radioButton = state.radioButtons.find((button) => button.id === id);

      if (radioButton) {
        radioButton.options = options;
      }
      state.radioButtons.forEach((x) => {
        if (x.id === radioButton.id) {
          x = radioButton;
        }
      });
      console.log(JSON.stringify(state.radioButtons));
    },
  },
});

export const {
  addRadioButton,
  removeRadioButton,
  addButton,
  removeButton,
  updateRadioButton,
} = radioButtonSlice.actions;
export default radioButtonSlice.reducer;

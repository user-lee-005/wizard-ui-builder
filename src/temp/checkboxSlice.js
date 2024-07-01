// checkboxSlice.js
import { createSlice } from "@reduxjs/toolkit";

const checkboxSlice = createSlice({
  name: "Checkbox",
  initialState: {
    checkboxes: [],
    buttons: [],
  },
  reducers: {
    addCheckbox: (state, action) => {
      state.checkboxes.push(action.payload);
    },
    removeCheckbox: (state, action) => {
      const deleteIndex = state.checkboxes.findIndex(
        (checkbox) => checkbox.id === action.payload
      );

      if (deleteIndex !== -1) {
        state.checkboxes.splice(deleteIndex, 1);
      }
    },
    updateCheckbox: (state, action) => {
      const { id, options } = action.payload;
      const checkbox = state.checkboxes.find((button) => button.id === id);

      if (checkbox) {
        checkbox.options = options;
      }
      state.checkboxes.forEach((x) => {
        if (x.id === checkbox.id) {
          x = checkbox;
        }
      });
      console.log(JSON.stringify(state.checkboxes));
    },
    addButton: (state, action) => {
      state.buttons.push(action.payload);
    },
    removeButton: (state, action) => {
      const buttonIndex = state.buttons.findIndex(
        (button) => button.id === action.payload
      );

      if (buttonIndex !== -1) {
        state.buttons.splice(buttonIndex, 1);
      }
    },
  },
});

export const {
  addCheckbox,
  removeCheckbox,
  addButton,
  removeButton,
  updateCheckbox,
} = checkboxSlice.actions;
export default checkboxSlice.reducer;

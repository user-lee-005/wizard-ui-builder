// emailSlice.js
import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emails: [],
  },
  reducers: {
    addEmail: (state, action) => {
      state.emails.push(action.payload);
    },
    removeEmail: (state, action) => {
      const deleteIndex = state.emails.findIndex(
        (email) => email.id === action.payload
      );

      if (deleteIndex !== -1) {
        state.emails.splice(deleteIndex, 1);
      }
    },
    updateEmails(state, action) {
      state.emails = action.payload;
    },
  },
});

export const { addEmail, removeEmail, updateEmails } = emailSlice.actions;
export default emailSlice.reducer;

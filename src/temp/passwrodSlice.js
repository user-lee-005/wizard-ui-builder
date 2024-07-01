// passwordSlice.js
import { createSlice } from "@reduxjs/toolkit";

const passwordSlice = createSlice({
  name: "password",
  initialState: {
    passwords: [],
  },
  reducers: {
    addPassword: (state, action) => {
      state.passwords.push(action.payload);
    },
    removePassword: (state, action) => {
      const deleteIndex = state.passwords.findIndex(
        (password) => password.id === action.payload
      );

      if (deleteIndex !== -1) {
        state.passwords.splice(deleteIndex, 1);
      }
    },
    updatePasswords(state, action) {
      state.passwords = action.payload;
    },
  },
});

export const { addPassword, removePassword, updatePasswords } = passwordSlice.actions;
export default passwordSlice.reducer;

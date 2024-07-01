// wizardCountSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wizardCount: 1,
}

const wizardCountSlice = createSlice({
  name: 'wizardCount',
  initialState,
  reducers: {
    setWizardCount: (state, action) => {
      return{
        ...state,
        wizardCount: parseInt(action.payload,10)
      }
    },
  },
});

export const { setWizardCount } = wizardCountSlice.actions;
export default wizardCountSlice.reducer;

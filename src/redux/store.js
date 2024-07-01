// store.js
import { configureStore } from "@reduxjs/toolkit";
import wizardCountReducer from "./slices/wizardCountSlice";
import dataSliceReducer from "./slices/dataSlice";
import responseSliceReducer from "./slices/responseSlice";

const store = configureStore({
  reducer: {
    wizardCount: wizardCountReducer,
    formData: dataSliceReducer,
    responses: responseSliceReducer,
  },
});

export default store;

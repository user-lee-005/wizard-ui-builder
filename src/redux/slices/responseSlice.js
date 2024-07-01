import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // {
  //   userName: "",
  //   userId: "",
  //   userResponses: [
  //     {
  //       templateId: "",
  //       templateTitle: "",
  //       pages: [
  //         {
  //           pageId: 1,
  //           responses: [
  //             {
  //               qId: 0,
  //               question: "",
  //               answer: "",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
};

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    setAnswers: (state, action) => {
      const response = action.payload;
      return {
        ...state,
        ...response,
      };
    },
  },
});

export const { setAnswers } = responseSlice.actions;

export default responseSlice.reducer;

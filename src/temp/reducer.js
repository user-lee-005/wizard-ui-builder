// reducer.js
import { ADD_TEXTBOX, REMOVE_TEXTBOX, UPDATE_TEXTBOX } from './actionType';

const initialState = {
  textBoxValues: [],
  fieldStatus: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TEXTBOX:
      return {
        ...state,
        textBoxValues: [...state.textBoxValues, { id: Date.now(), value: '' }],
      };

    case REMOVE_TEXTBOX:
      return {
        ...state,
        textBoxValues: state.textBoxValues.filter((textBox) => textBox.id !== action.payload),
      };

    case UPDATE_TEXTBOX:
      return {
        ...state,
        textBoxValues: state.textBoxValues.map((textBox) =>
          textBox.id === action.payload.id ? { ...textBox, value: action.payload.value } : textBox
        ),
      };
      
    default:
      return state;
  }
};

export default reducer;

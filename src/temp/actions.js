// actions.js
import { ADD_TEXTBOX, UPDATE_REQUIRED_STATUS, REMOVE_TEXTBOX, UPDATE_TEXTBOX } from './actionType';

export const addTextBox = () => ({
  type: ADD_TEXTBOX,
});

export const removeTextBox = (id) => ({
  type: REMOVE_TEXTBOX,
  payload: id,
});

export const updateTextBox = (id, value) => ({
  type: UPDATE_TEXTBOX,
  payload: { id, value },
});

export const updateRequiredStatus = (fieldName, isRequired) => ({
    type: UPDATE_REQUIRED_STATUS,
    payload: { fieldName, isRequired },
  });

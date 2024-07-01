import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  templateId: "",
  templateTitle: "",
  pages: [
    // {
    //   pageId: 1,
    //   fields: [
    //     {
    //       qId: 0,
    //       questionType: "",
    //       question: "",
    //       options: [],
    //     },
    //   ],
    // },
  ],
  navConfigs: [],
};

const dataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    setTemplateId(state, action) {
      if (action.payload) {
        return { ...state, templateId: action.payload };
      }
      if (!state.templateId) {
        return { ...state, templateId: nanoid() };
      }

      return state;
    },

    setTemplateTitle(state, action) {
      return { ...state, templateTitle: action.payload };
    },

    setFormData(state, action) {
      const { templateId, templateTitle, pages, navConfigs } = action.payload;
      return {
        ...state,
        templateId: templateId,
        templateTitle: templateTitle,
        pages: pages,
        navConfigs: navConfigs,
      };
    },

    setNavConfigs(state, action) {
      return { ...state, navConfigs: [...state.navConfigs, action.payload] };
    },

    removeConfig(state, action) {
      let configIndex = action.payload;

      // Use filter to create a new array without the removed item
      const updatedNavConfigs = state.navConfigs.filter(
        (_, index) => index !== configIndex
      );

      // Create a new state object with the updated navConfigs
      const newState = { ...state, navConfigs: updatedNavConfigs };

      return newState;
    },

    addPage(state, action) {
      const { pageId } = action.payload;

      const pageIndex = state.pages.findIndex((page) => page.pageId === pageId);

      if (pageIndex !== -1) {
        return state;
      }

      const newPages = {
        pageId,
        fields: [],
      };

      return {
        ...state,
        pages: [...state.pages, newPages],
      };
    },

    removePage(state, action) {
      const wizardIdToRemove = action.payload;
      const pageIndexToRemove = state.pages.findIndex(
        (page) => page.pageId === wizardIdToRemove
      );

      if (pageIndexToRemove === -1) {
        return state;
      }

      const updatedPages = state.pages.filter(
        (page) => page.pageId !== wizardIdToRemove
      );

      for (let i = pageIndexToRemove; i < updatedPages.length; i++) {
        updatedPages[i] = { ...updatedPages[i], pageId: i + 1 };
      }

      return {
        ...state,
        pages: [...updatedPages],
      };
    },

    addFields(state, action) {
      const {
        pageIdToAddFields,
        questionType,
        question,
        options,
        qId,
        isRequired,
        customLink,
        characterLimit,
      } = action.payload;

      const updatedPages = state.pages.map((page) => {
        if (page.pageId === pageIdToAddFields) {
          const existingFieldIndex = page.fields.findIndex(
            (field) => field.qId === qId
          );

          if (existingFieldIndex !== -1) {
            return {
              ...page,
              fields: page.fields.map((field) =>
                field.qId === qId
                  ? {
                      ...field,
                      questionType,
                      question,
                      options,
                      isRequired,
                      customLink,
                      characterLimit,
                    }
                  : field
              ),
            };
          } else {
            const newField = {
              qId,
              questionType,
              question,
              options,
              isRequired,
              customLink,
              characterLimit,
            };
            const isEmptyField = (field) => {
              return Object.values(field).every(
                (value) =>
                  value === "" ||
                  value === 0 ||
                  (Array.isArray(value) && value.length === 0)
              );
            };

            if (page.fields.length === 1 && isEmptyField(page.fields[0])) {
              return { ...page, fields: [newField] };
            } else {
              return {
                ...page,
                fields: [...page.fields, newField],
              };
            }
          }
        }
        return page;
      });

      return {
        ...state,
        pages: updatedPages,
      };
    },

    removeFields(state, action) {
      const { pageIdToRemove, fieldIdToRemove } = action.payload;

      const updatedPages = state.pages.map((page) => {
        if (page.pageId === pageIdToRemove) {
          const updatedFields = page.fields.filter(
            (field) => field.qId !== fieldIdToRemove
          );

          return { ...page, fields: updatedFields };
        }

        return page;
      });

      return {
        ...state,
        pages: updatedPages,
      };
    },
  },
});

export const {
  setTemplateId,
  addFields,
  removeFields,
  addPage,
  removePage,
  setTemplateTitle,
  setFormData,
  setNavConfigs,
  removeConfig,
} = dataSlice.actions;
export default dataSlice.reducer;

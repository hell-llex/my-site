import { createSlice } from "@reduxjs/toolkit";
import {
  filterPhoto,
  filterProject,
  language,
  platform,
  theme,
} from "../../types";
import i18next from "i18next";

const initialState: {
  platform: platform;
  lang: language;
  theme: theme;
  fullWithGallery: boolean;
  filterProject: ("vanilla" | "react" | "vue" | "other" | "all")[];
  filterPhoto: ("landscape" | "mobile" | "portrait" | "me" | "all")[];
} = {
  platform: "react",
  lang: "en",
  theme: "dark",
  fullWithGallery: false,
  filterProject: [],
  filterPhoto: [],
};

const baseParamsSlice = createSlice({
  name: "baseParams",
  initialState,
  reducers: {
    updatePlatform(state, action: { payload: platform; type: string }) {
      state.platform = action.payload;
    },
    updateLang(state, action: { payload: language | undefined; type: string }) {
      if (action.payload) {
        console.log("object :>> ", action.payload);
        state.lang = action.payload;
      } else {
        const storedLang = localStorage.lang;
        if (storedLang) {
          state.lang = JSON.parse(storedLang);
        } else {
          state.lang = "en";
        }
      }
      i18next.changeLanguage(state.lang);
      localStorage.setItem("lang", JSON.stringify(state.lang));
    },
    updateTheme(state, action: { payload: theme | undefined; type: string }) {
      if (action.payload) {
        state.theme = action.payload;
      } else {
        const storedTheme = localStorage.theme;
        if (storedTheme) {
          state.theme = JSON.parse(storedTheme);
        } else {
          state.theme = "dark";
        }
      }
      localStorage.setItem("theme", JSON.stringify(state.theme));
    },
    updateFullWidthGallery(state, action: { payload: boolean; type: string }) {
      state.fullWithGallery = action.payload;
    },
    updateFilterProject(
      state,
      action: { payload: filterProject[]; type: string }
    ) {
      state.filterProject = action.payload;
    },
    updateFilterPhoto(state, action: { payload: filterPhoto[]; type: string }) {
      state.filterPhoto = action.payload;
    },
  },
});

export const baseParamsReducer = baseParamsSlice.reducer;
export const {
  updatePlatform,
  updateLang,
  updateTheme,
  updateFullWidthGallery,
  updateFilterProject,
  updateFilterPhoto,
} = baseParamsSlice.actions;

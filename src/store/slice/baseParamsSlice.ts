import { createSlice } from "@reduxjs/toolkit";
import { language, platform, theme } from "../../types";

const initialState: {
  platform: platform;
  lang: language;
  theme: theme;
} = {
  platform: "react",
  lang: "en",
  theme: "dark",
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
  },
});

export const baseParamsReducer = baseParamsSlice.reducer;
export const { updatePlatform, updateLang, updateTheme } =
  baseParamsSlice.actions;

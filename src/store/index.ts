import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { imagesInfoReducer } from "./slice/imagesInfoSlice";
import { socialIconsInfoReducer } from "./slice/socialIconsInfoSlice";
import { baseParamsReducer } from "./slice/baseParamsSlice";

const rootReducer = combineReducers({
  imagesInfo: imagesInfoReducer,
  socialIconsInfo: socialIconsInfoReducer,
  baseParams: baseParamsReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { /* ИМЯ СЛАЙСА */Reducer } from "./slice//*ИМЯ-ФАЙЛА-СЛАЙСА*/";

const rootReducer = combineReducers({
  /* ИМЯ СЛАЙСА */: /* ИМЯ СЛАЙСА */Reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

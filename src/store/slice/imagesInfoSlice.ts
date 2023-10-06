import { createSlice } from "@reduxjs/toolkit";
import _data from "../../data.json";
import { TypedJSON } from "../../types";
const data: TypedJSON = _data;

const initialState = data;

const imagesInfoSlice = createSlice({
  name: "imagesInfo",
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    logImagesInfo(
      state
      // , action: { payload: string; type: string }
    ) {
      console.log("state :>> ", state);
    },
  },
});

export const imagesInfoReducer = imagesInfoSlice.reducer;
export const { logImagesInfo } = imagesInfoSlice.actions;

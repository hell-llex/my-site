import { createSlice } from "@reduxjs/toolkit";
import _data from "../../data.json";
import { ImageInfo, TypedJSON } from "../../types";
const data: TypedJSON = _data;
import loaderImg from "../../../public/loader.svg";

const imgStandby: ImageInfo = {
  name: "image_0", // is the name of the spare image
  pathJpg: "/image_0/image_0.jpg",
  pathWebp: "/image_0/image_0.webp",
  description:
    "We could not find this image, so for now here I will lay tired me....",
  category: ["me"],
  orientation: "square",
  metadata: {
    image: {},
    thumbnail: {},
    exif: {},
    gps: {},
    interoperability: {},
    makernote: {},
  },
};

const initialState: {
  all: Record<string, ImageInfo>;
  portrait: Record<string, ImageInfo>;
  landscape: Record<string, ImageInfo>;
  me: Record<string, ImageInfo>;
  mobile: Record<string, ImageInfo>;
  image_0: ImageInfo;
  loader_img: string;
} = {
  all: {},
  portrait: {},
  landscape: {},
  me: {},
  mobile: {},
  image_0: imgStandby,
  loader_img: loaderImg,
};

Object.keys(data.optimizedImages).forEach((imageName) => {
  const image = data.optimizedImages[imageName];
  image.category.forEach((item) => {
    if (
      item === "landscape" ||
      item === "mobile" ||
      item === "portrait" ||
      item === "me"
    ) {
      initialState[item][imageName] = image;
    }
  });
});

initialState.all = Object.assign(data.optimizedImages);

const maxNumberKey = Number(
  Object.keys(initialState.all)
    .reduce((a, b) =>
      Number(initialState.all[a].name.split("_").pop()) >
      Number(initialState.all[b].name.split("_").pop())
        ? a
        : b
    )
    .split("_")
    .pop()
);

for (let index = 1; index < maxNumberKey + 1; index++) {
  const name = `image_${index}`;
  const imgData = initialState.all[name];
  if (!imgData) {
    initialState.all[name] = imgStandby;
  }
}
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

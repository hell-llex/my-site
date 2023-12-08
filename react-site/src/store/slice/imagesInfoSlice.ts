import { createSlice, current } from "@reduxjs/toolkit";
import _data from "../../assets/img/data.json";
import { ImageInfo, TypedJSON, filterPhoto } from "../../types";
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
const createArrayForPhotoGallery = (objectImages: (ImageInfo | "space")[]) => {
  const allImagesBase: (ImageInfo | "space")[] = objectImages;

  const allImagesNew: (ImageInfo | "space")[][] = [];

  for (let i = 0; i < allImagesBase.length; i++) {
    if (
      allImagesBase[i] != "space" &&
      (allImagesBase[i] as ImageInfo).orientation === "vertical"
    ) {
      allImagesBase.splice(i + 1, 0, "space");
    }
  }

  for (let i = 0; i < allImagesBase.length; i += 3) {
    allImagesNew.push(allImagesBase.slice(i, i + 3));
  }

  return allImagesNew;
};

const initialState: {
  all: Record<string, ImageInfo>;
  portrait: Record<string, ImageInfo>;
  landscape: Record<string, ImageInfo>;
  me: Record<string, ImageInfo>;
  mobile: Record<string, ImageInfo>;
  filteredPhotos: (ImageInfo | "space")[][];
  image_0: ImageInfo;
  loader_img: string;
} = {
  all: data.optimizedImages,
  portrait: {},
  landscape: {},
  me: {},
  mobile: {},
  filteredPhotos: createArrayForPhotoGallery(
    Object.values(data.optimizedImages)
  ),
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

const imagesInfoSlice = createSlice({
  name: "imagesInfo",
  initialState,
  reducers: {
    logImagesInfo(state, action: { payload: string; type: string }) {
      console.log(initialState, action.payload, state);
    },
    filterPhotos(state, action: { payload: filterPhoto[]; type: string }) {
      const filterImagesPhotos = createArrayForPhotoGallery(
        Object.values(current(state).all).filter((elem) =>
          elem.category.some((value) =>
            action.payload.some((filter) => filter.includes(value))
          )
        )
      );

      state.filteredPhotos =
        filterImagesPhotos.length === 0
          ? createArrayForPhotoGallery(Object.values(state.all))
          : filterImagesPhotos;
    },
  },
});

export const imagesInfoReducer = imagesInfoSlice.reducer;
export const { logImagesInfo, filterPhotos } = imagesInfoSlice.actions;

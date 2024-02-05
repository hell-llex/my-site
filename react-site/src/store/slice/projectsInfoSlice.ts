import { createSlice, current } from "@reduxjs/toolkit";
import _data from "../../../public/project/data.json";
import { ImageInfo, TypedJSON, filterProject } from "../../types";
const data: TypedJSON = _data;

const imgStandby: ImageInfo = {
  name: "project_0",
  pathJpg: "/project/jpg/project_0.png",
  pathWebp: "/project/webp/project_0.webp",
  description:
    "We couldn't find this image, so for now here I'll post the beautiful code for this site...",
  category: ["other"],
  orientation: "square",
  metadata: {
    image: {},
    thumbnail: {},
    exif: {},
    gps: {},
    interoperability: {},
    makernote: {},
  },
  pathThumbnail: "/project/webp/project_0.webp",
};

const initialState: {
  all: Record<string, ImageInfo>;
  vanilla: Record<string, ImageInfo>;
  react: Record<string, ImageInfo>;
  vue: Record<string, ImageInfo>;
  other: Record<string, ImageInfo>;
  project_0: ImageInfo;
  filteredProjects: ImageInfo[];
} = {
  all: data.optimizedImages,
  vanilla: {},
  react: {},
  vue: {},
  other: {},
  project_0: imgStandby,
  filteredProjects: Object.values(data.optimizedImages),
};

Object.keys(data.optimizedImages).forEach((imageName) => {
  const image = data.optimizedImages[imageName];
  image.category.forEach((item) => {
    if (
      item === "vanilla" ||
      item === "react" ||
      item === "vue" ||
      item === "other"
    ) {
      initialState[item][imageName] = image;
    }
  });
});

const projectsInfoSlice = createSlice({
  name: "projectsInfo",
  initialState,
  reducers: {
    logProjectsInfo(state, action: { payload: string; type: string }) {
      console.log(initialState, action.payload, state);
    },
    filterProjects(state, action: { payload: filterProject[]; type: string }) {
      console.log("Object.values(state.all) :>> ", current(state).all);

      const filterImagesProject = Object.values(current(state).all).filter(
        (elem) =>
          elem.category.some((value) =>
            action.payload.some((filter) => filter.includes(value))
          )
      );

      state.filteredProjects =
        filterImagesProject.length === 0
          ? Object.values(state.all)
          : filterImagesProject;

      console.log(
        "filterImagesProject :>> ",
        filterImagesProject.length === 0
          ? Object.values(current(state).all)
          : filterImagesProject
      );
    },
  },
});

export const projectsInfoReducer = projectsInfoSlice.reducer;
export const { logProjectsInfo, filterProjects } = projectsInfoSlice.actions;

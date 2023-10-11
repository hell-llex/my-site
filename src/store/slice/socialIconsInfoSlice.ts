import { createSlice } from "@reduxjs/toolkit";
import { SocialLinksInfo } from "../../types";

const sizeIcon = "clamp(20px, 2.6vw, 45px)";

const initialState: SocialLinksInfo = {
  // vk: {
  //   icon: "bxl:vk",
  //   color: "#0077FF", // Синий цвет ВКонтакте[^1^][1]
  //   name: "VK",
  //   size: 30,
  //   link: "https://",
  // },
  instagram: {
    icon: "bxl:instagram",
    color: "#C1558B",
    name: "Instagram",
    size: sizeIcon,
    link: "https://",
  },
  telegram: {
    icon: "bxl:telegram",
    color: "#229ED9",
    name: "Telegram",
    size: sizeIcon,
    link: "https://",
  },
  github: {
    icon: "bxl:github",
    color: "#000000",
    name: "GitHub",
    size: sizeIcon,
    link: "https://",
  },
  linkedin: {
    icon: "bxl:linkedin",
    color: "#0077B5",
    name: "LinkedIn",
    size: sizeIcon,
    link: "https://",
  },
  discord: {
    icon: "bxl:discord-alt",
    color: "#7289DA",
    name: "Discord",
    size: sizeIcon,
    link: "https://",
  },
  gmail: {
    icon: "bxl:gmail",
    color: "#BB001B",
    name: "Gmail",
    size: sizeIcon,
    link: "https://",
  },
  yamusic: {
    icon: "mingcute:music-3-fill",
    color: "#ffcb34",
    name: "Ya Music",
    size: sizeIcon,
    link: "https://",
  },
};

const socialIconsInfoSlice = createSlice({
  name: "socialIconsInfo",
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    logSocialIconsInfo(
      state
      // , action: { payload: string; type: string }
    ) {
      console.log("state :>> ", state);
    },
  },
});

export const socialIconsInfoReducer = socialIconsInfoSlice.reducer;
export const { logSocialIconsInfo } = socialIconsInfoSlice.actions;

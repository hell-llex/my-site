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
    link: "https://www.instagram.com/hell_llex/",
  },
  telegram: {
    icon: "bxl:telegram",
    color: "#229ED9",
    name: "Telegram",
    size: sizeIcon,
    link: "https://t.me/hell_llex",
  },
  github: {
    icon: "bxl:github",
    color: "#000000",
    name: "GitHub",
    size: sizeIcon,
    link: "https://github.com/hell-llex",
  },
  linkedin: {
    icon: "bxl:linkedin",
    color: "#0077B5",
    name: "LinkedIn",
    size: sizeIcon,
    link: "https://www.linkedin.com/in/hell-llex",
  },
  discord: {
    icon: "bxl:discord-alt",
    color: "#7289DA",
    name: "Discord",
    size: sizeIcon,
    link: "https://discordapp.com/users/hell.llex/",
  },
  gmail: {
    icon: "bxl:gmail",
    color: "#BB001B",
    name: "Gmail",
    size: sizeIcon,
    link: "mailto:demeshenko333@gmail.com",
  },
  yamusic: {
    icon: "mingcute:music-3-fill",
    color: "#ffcb34",
    name: "Ya Music",
    size: sizeIcon,
    link: "https://music.yandex.by/users/demeshenko.sasha/playlists/3",
  },
};

const socialIconsInfoSlice = createSlice({
  name: "socialIconsInfo",
  initialState,
  reducers: {
    logSocialIconsInfo(state, action: { payload: string; type: string }) {
      console.log(initialState, action.payload, state);
    },
  },
});

export const socialIconsInfoReducer = socialIconsInfoSlice.reducer;
export const { logSocialIconsInfo } = socialIconsInfoSlice.actions;

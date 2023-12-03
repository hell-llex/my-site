import { useEffect, JSX } from "react";
import {
  // useNavigate,
  useParams,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateLang, updateTheme } from "../store/slice/baseParamsSlice";
import { language, theme } from "../types";

const rightPlatform = {
  vue: "vue",
  react: "react",
};

const SettingWithUrl = ({ children }: { children?: JSX.Element }) => {
  const dispatch = useAppDispatch();
  const newLang = (item: language | undefined) => dispatch(updateLang(item));
  const newTheme = (item: theme | undefined) => dispatch(updateTheme(item));
  const theme = useAppSelector((state) => state.baseParams.theme);
  const { platform, lang } = useParams();

  useEffect(() => {
    newTheme(theme === "dark" ? "light" : "dark");
    if (lang && (lang === "en" || lang === "ru")) {
      newLang(lang);
    }
    // url === "vue" &&

    //   (window.location.href = "https://hell-llex.github.io/My-CV/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (platform && platform in rightPlatform) {
    // rightPlatform.vue === platform
    //   ? setTimeout(() => {
    //       // navigate(`/react/${thisLang}`);
    //       window.location.href = "https://hell-llex.github.io/My-CV/";
    //     }, 3000)
    //   : null;

    return rightPlatform.react === platform ? (
      children
    ) : (
      <p style={{ fontSize: "40px", width: "100%", textAlign: "center" }}>
        This relocate to {platform.toUpperCase()} site{" "}
        {lang ? `in ${lang === "en" ? "English" : "Russian"} language.` : ""}
      </p>
    );
  }
};

export { SettingWithUrl };

import "./DrawerMenuMobile.scss";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  IconButton,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  updateLang,
  updatePlatform,
  updateTheme,
} from "../../store/slice/baseParamsSlice";
import { RouteInfo, language, platform, theme } from "../../types";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import Logo from "../../../public/logo_black.png";
// import Logo from "../../../public/logo.png";

type Anchor = "top" | "right";
const anchorSide = "top";

const DrawerMenuMobile = () => {
  const [stateDrawer, setStateDrawer] = useState({
    top: false,
  });
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const newLang = (item: language | undefined) => dispatch(updateLang(item));
  const newTheme = (item: theme | undefined) => dispatch(updateTheme(item));
  const newPlatform = (item: platform) => dispatch(updatePlatform(item));
  const thisLang = useAppSelector((state) => state.baseParams.lang);
  const thisTheme = useAppSelector((state) => state.baseParams.theme);
  const thisPlatform = useAppSelector((state) => state.baseParams.platform);
  const navigate = useNavigate();
  const location = useLocation();
  const [thisPathGallery, setThisPathGallery] = useState(
    location.pathname.includes("photo") || location.pathname.includes("project")
      ? true
      : false
  );
  useEffect(() => {
    setThisPathGallery(
      location.pathname.includes("photo") ||
        location.pathname.includes("project")
        ? true
        : false
    );
  }, [location]);

  const [linksInfo] = useState<RouteInfo[]>([
    {
      path: "home",
      name: "components.DrawerMenuMobile.title1",
      otherPath: false,
    },
    {
      path: "portfolio",
      name: "components.DrawerMenuMobile.title2",
      otherPath: true,
    },
    {
      path: "contact",
      name: "components.DrawerMenuMobile.title3",
      otherPath: false,
    },
    {
      path: "about-me",
      name: "components.DrawerMenuMobile.title4",
      otherPath: false,
    },
    {
      path: "cv",
      name: "components.DrawerMenuMobile.title5",
      otherPath: false,
    },
  ]);
  const [otherLinksInfo] = useState<RouteInfo[]>([
    {
      path: "portfolio/photo",
      name: "components.DrawerMenuMobile.title21",
      otherPath: false,
    },
    {
      path: "portfolio/project",
      name: "components.DrawerMenuMobile.title22",
      otherPath: false,
    },
  ]);

  const setActive = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "link-container__nav-link_active"
      : "link-container__nav-link";
  };
  const setActiveOther = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "link-container__nav-link-other_active"
      : "link-container__nav-link-other";
  };

  const [settings] = useState({
    language: {
      label: "Language",
      value: ["en", "ru"],
      icon: [
        <LanguageIcon
          key={uuidv4()}
          sx={{ fontSize: "2rem", marginRight: "1rem" }}
        />,
        <LanguageIcon
          key={uuidv4()}
          sx={{ fontSize: "2rem", marginRight: "1rem" }}
        />,
      ],
    },
    theme: {
      label: "Theme",
      value: ["light", "dark"],
      icon: [
        <LightModeIcon
          key={uuidv4()}
          sx={{ fontSize: "2rem", marginRight: "1rem" }}
        />,
        <DarkModeIcon
          key={uuidv4()}
          sx={{ fontSize: "2rem", marginRight: "1rem" }}
        />,
      ],
    },
    platform: {
      label: "Platform",
      value: ["react", "vue"],
      icon: [
        <Icon
          icon="nonicons:react-16"
          key={uuidv4()}
          style={{ marginRight: "1rem" }}
        />,
        <Icon
          icon="nonicons:vue-16"
          key={uuidv4()}
          style={{ marginRight: "1rem" }}
        />,
      ],
    },
  });

  const [settingsValue, setSettingsValue] = useState({
    language: thisLang,
    theme: thisTheme,
    platform: thisPlatform,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    setSettingsValue({
      language: thisLang,
      theme: thisTheme,
      platform: thisPlatform,
    });
  }, [thisLang, thisPlatform, thisTheme]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSettings: language | theme | platform
  ) => {
    if (newSettings !== null) {
      const target = event.currentTarget as HTMLInputElement;
      target.name === "theme" ? newTheme(newSettings as theme) : null;
      if (target.name === "language") {
        newLang(newSettings as language);
        const newPath = location.pathname.replace(thisLang, newSettings);
        navigate(newPath);
      }
      if (target.name === "platform") {
        newPlatform(newSettings as platform);
        const newPath = location.pathname.replace(thisPlatform, newSettings);
        navigate(newPath);
      }

      setSettingsValue({
        language:
          target.name === "language"
            ? (newSettings as language)
            : settingsValue.language,
        theme:
          target.name === "theme"
            ? (newSettings as theme)
            : settingsValue.theme,
        platform:
          target.name === "platform"
            ? (newSettings as platform)
            : settingsValue.platform,
      });
    }
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setStateDrawer({ ...stateDrawer, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box role="presentation">
      <div className="link-container_mobile">
        <div
          className={"link-container__nav-links"}
          style={{
            position: "relative",
            paddingTop: "20vh",
            paddingBottom: "3vh",
          }}
        >
          <span
            style={{
              position: "absolute",
              zIndex: "300",
              boxSizing: "border-box",
              top: "0",
              right: "4.45rem",
              background: "white",
              width: "0.6rem",
              height: "calc(10vh + 3.1rem)",
            }}
          ></span>

          <div className="close-btn_mobile">
            <IconButton
              onClick={toggleDrawer(anchor, false)}
              aria-label="close"
              sx={{
                fontSize: "4.5rem",
                color: "black",
                padding: "0.5rem",
                boxSizing: "border-box",

                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <CloseIcon fontSize="inherit" color="inherit" />
            </IconButton>
          </div>
          {Object.values(linksInfo).map((linkNav) => (
            <div
              className="link-container__container-nav-link"
              key={uuidv4()}
              style={{
                width: "100%",
              }}
            >
              <NavLink
                onClick={toggleDrawer(anchor, false)}
                to={linkNav.path}
                className={setActive}
              >
                {t(linkNav.name)}
              </NavLink>

              {linkNav.otherPath &&
                otherLinksInfo.map((linkOtherNav) => (
                  <NavLink
                    onClick={toggleDrawer(anchor, false)}
                    to={linkOtherNav.path}
                    key={uuidv4()}
                    className={setActiveOther}
                  >
                    {t(linkOtherNav.name)}
                  </NavLink>
                ))}
            </div>
          ))}
          {Object.values(settings).map((item) => (
            <div
              className="link-container__container-item"
              key={uuidv4()}
              style={{
                width: "100%",
              }}
            >
              {item.label === "Language" ? (
                <ToggleButtonGroup
                  value={
                    settingsValue[
                      item.label.toLowerCase() as keyof typeof settings
                    ]
                  }
                  exclusive
                  onChange={handleChange} // включить когда будет функционал
                  // onClick={handleClickSnackbar} // выключить когда будет функционал
                  aria-label={item.label}
                  size="large"
                  sx={{
                    width: "100%",
                    padding: "0 3rem",
                    boxSizing: "border-box",
                    ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                      borderLeft: "2px solid white",
                    },
                  }}
                >
                  {item.value.map((elem) => (
                    <ToggleButton
                      name={item.label.toLowerCase()}
                      value={elem}
                      key={uuidv4()}
                      sx={{
                        color: "gray",
                        border: "0px solid transparent",
                        width: "100%",
                        fontSize: "1.6rem",
                        padding: "0rem",
                        fontWeight: "300",
                        background: "transparent",
                        "&:focus, &:hover": {
                          outline: "none",
                          borderColor: "transparent",
                          background: "transparent",
                        },
                        "&.Mui-selected, &.Mui-selected:focus, &.Mui-selected:hover":
                          {
                            color: "white",
                            fontWeight: "700",
                            fontSize: "1.8rem",
                            background: "transparent",
                          },
                      }}
                    >
                      {elem}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  value={
                    settingsValue[
                      item.label.toLowerCase() as keyof typeof settings
                    ]
                  }
                  exclusive
                  // onChange={handleChange} // включить когда будет функционал
                  onClick={handleClickSnackbar} // выключить когда будет функционал
                  aria-label={item.label}
                  size="large"
                  sx={{
                    width: "100%",
                    padding: "0 3rem",
                    boxSizing: "border-box",
                    ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                      borderLeft: "2px solid white",
                    },
                  }}
                >
                  {item.value.map((elem) => (
                    <ToggleButton
                      name={item.label.toLowerCase()}
                      value={elem}
                      key={uuidv4()}
                      sx={{
                        color: "gray",
                        border: "0px solid transparent",
                        width: "100%",
                        fontSize: "1.6rem",
                        padding: "0rem",
                        fontWeight: "300",
                        background: "transparent",
                        "&:focus, &:hover": {
                          outline: "none",
                          borderColor: "transparent",
                          background: "transparent",
                        },
                        "&.Mui-selected, &.Mui-selected:focus, &.Mui-selected:hover":
                          {
                            color: "white",
                            fontWeight: "700",
                            fontSize: "1.8rem",
                            background: "transparent",
                          },
                      }}
                    >
                      {elem}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            </div>
          ))}
        </div>
      </div>
    </Box>
  );

  return (
    <>
      <React.Fragment>
        <div
          className={`setting-btn_mobile ${thisPathGallery ? "gallery" : ""}`}
        >
          <IconButton
            onClick={toggleDrawer(anchorSide, true)}
            aria-label="setting"
            sx={{
              fontSize: "4.5rem",
              color: "black",
              padding: "0.5rem",
              boxSizing: "border-box",
              zIndex: "200",
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <MenuIcon fontSize="inherit" color="inherit" />
          </IconButton>
        </div>

        <span
          className={`link-container__line-mobile ${
            thisPathGallery ? "gallery" : ""
          }`}
        ></span>

        <IconButton
          onClick={toggleDrawer(anchorSide, false)}
          aria-label="setting"
          sx={{
            color: "black",
            padding: "0.5rem",
            boxSizing: "border-box",
            position: "absolute",
            top: thisPathGallery ? "1vh" : "5vh",
            right: "50vw",

            zIndex: "555",
            borderRadius: thisPathGallery ? "10px" : "15px",
            backgroundColor: "white",
            "&:focus": {
              outline: "none",
            },
            "&:active, &:hover": {
              outline: "none",
              backgroundColor: "white",
            },
          }}
        >
          <a
            href="/"
            className={`link-container__logo-mobile ${
              thisPathGallery ? "gallery" : ""
            }`}
          >
            <img
              src={Logo}
              alt="Logo"
              className="link-container__logo-mobile-img"
            />
          </a>
        </IconButton>

        <Drawer
          anchor={anchorSide}
          open={stateDrawer[anchorSide]}
          onClose={toggleDrawer(anchorSide, false)}
          transitionDuration={{
            appear: 800,
            enter: 600,
            exit: 400,
          }}
          PaperProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            },
          }}
        >
          {list(anchorSide)}
        </Drawer>
      </React.Fragment>
      <Snackbar // удалить когда будет функционал
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        key={"top" + "center"}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%", fontSize: "1.4rem" }}
        >
          {t("components.DrawerMenuMobile.text1")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerMenuMobile;

import "./DrawerMenu.scss";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  updateLang,
  updatePlatform,
  updateTheme,
} from "../../store/slice/baseParamsSlice";
import { language, platform, theme } from "../../types";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
type Anchor = "top" | "right";

const DrawerMenu = () => {
  const [state, setState] = useState({
    top: false,
    right: false,
  });
  const dispatch = useAppDispatch();
  const newLang = (item: language | undefined) => dispatch(updateLang(item));
  const newTheme = (item: theme | undefined) => dispatch(updateTheme(item));
  const newPlatform = (item: platform) => dispatch(updatePlatform(item));
  const thisLang = useAppSelector((state) => state.baseParams.lang);
  const thisTheme = useAppSelector((state) => state.baseParams.theme);
  const thisPlatform = useAppSelector((state) => state.baseParams.platform);
  const navigate = useNavigate();

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

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" ? "auto" : 300 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <Typography
            variant="h2"
            fontWeight={700}
            color={"white"}
            fontSize={"clamp(2rem, 4vw, 3rem)"}
            width="100%"
          >
            Settings
          </Typography>
          <IconButton
            onClick={toggleDrawer(anchor, false)}
            aria-label="setting"
            sx={{
              fontSize: "3rem",
              color: "white",
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <CloseIcon fontSize="inherit" color="inherit" />
          </IconButton>
        </ListItem>
        <Divider color="white" />
        {Object.values(settings).map((item) => (
          <div key={uuidv4()}>
            <Typography
              variant="h3"
              fontWeight={500}
              color={"white"}
              fontSize={"clamp(1rem, 2vw, 2.6rem)"}
              textAlign="center"
              width="100%"
              marginTop="2vh"
            >
              {item.label}
            </Typography>
            <ListItem>
              <ToggleButtonGroup
                value={
                  settingsValue[
                    item.label.toLowerCase() as keyof typeof settings
                  ]
                }
                exclusive
                onChange={handleChange}
                aria-label={item.label}
                size="large"
                sx={{
                  width: "100%",
                  ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                    borderLeft: "2px solid white",
                  },
                }}
              >
                {item.value.map((elem, i) => (
                  <ToggleButton
                    name={item.label.toLowerCase()}
                    value={elem}
                    key={uuidv4()}
                    sx={{
                      color: "white",
                      border: "2px solid black",
                      width: "100%",
                      fontSize: "1.6rem",
                      borderRadius: "10px",
                      padding: "1rem",
                      fontWeight: "300",
                      "&:focus": {
                        outline: "none",
                      },
                      "&.Mui-selected": {
                        color: "white",
                        fontWeight: "700",
                        borderLeft: "2px solid white",
                        borderRight: "2px solid white",
                        borderTop: "2px solid white",
                        borderBottom: "2px solid white",
                        "&:hover": {
                          border: "2px solid white",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "2px solid black",
                      },
                    }}
                  >
                    {item.icon[i]}
                    {elem}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={uuidv4()}>
          <div className="setting-btn">
            <IconButton
              onClick={toggleDrawer(anchor, true)}
              aria-label="setting"
              sx={{
                fontSize: "5rem",
                color: "rgba(255, 255, 255, 0.7)",
                transition: "all 0.3s ease-out",
                "&:hover": {
                  color: "rgba(255, 255, 255, 1)",
                  transition: "all 0.3s ease-out",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <SettingsOutlinedIcon fontSize="inherit" color="inherit" />
            </IconButton>
          </div>

          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            PaperProps={{
              sx: {
                backgroundColor: "rgba(40, 40, 40, 0.9)",
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
};

export default DrawerMenu;

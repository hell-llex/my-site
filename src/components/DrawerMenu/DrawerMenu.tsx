// import { Icon } from "@iconify/react/dist/iconify.js";
import "./DrawerMenu.scss";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
// import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";
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
import { useState } from "react";

type Anchor = "top" | "right";

const DrawerMenu = () => {
  const [state, setState] = useState({
    top: false,
    right: false,
  });

  const [settings] = useState({
    language: {
      label: "Language",
      value: ["en", "ru"],
      icon: [
        <LanguageIcon key="0" sx={{ fontSize: "2rem", marginRight: "1rem" }} />,
        <LanguageIcon key="1" sx={{ fontSize: "2rem", marginRight: "1rem" }} />,
      ],
    },
    theme: {
      label: "Theme",
      value: ["light", "dark"],
      icon: [
        <LightModeIcon
          key="0"
          sx={{ fontSize: "2rem", marginRight: "1rem" }}
        />,
        <DarkModeIcon key="1" sx={{ fontSize: "2rem", marginRight: "1rem" }} />,
      ],
    },
    platform: {
      label: "Platform",
      value: ["react", "vue.js"],
      icon: [
        <Icon
          icon="nonicons:react-16"
          key="0"
          style={{ marginRight: "1rem" }}
        />,
        <Icon icon="nonicons:vue-16" key="1" style={{ marginRight: "1rem" }} />,
      ],
    },
  });

  const [settingsValue, setSettingsValue] = useState({
    language: "en",
    theme: "dark",
    platform: "react",
  });

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSettings: string
  ) => {
    if (newSettings !== null) {
      const target = event.currentTarget as HTMLInputElement;
      const newSettingsObject = { ...settingsValue };
      newSettingsObject[target.name as keyof typeof settingsValue] =
        newSettings;
      setSettingsValue(newSettingsObject);
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
        {Object.values(settings).map((item, index) => (
          <>
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
            <ListItem key={index}>
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
                }}
              >
                {item.value.map((elem, i) => (
                  <ToggleButton
                    name={item.label.toLowerCase()}
                    value={elem}
                    key={index}
                    sx={{
                      color: "black",
                      backgroundColor: "rgba(225,225,225,0.4)",
                      borderColor: "white",
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
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderColor: "black",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,1)",
                          borderColor: "black",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(225,225,225,1)",
                        borderColor: "white",
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
          </>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <div className="setting-btn">
            <IconButton
              onClick={toggleDrawer(anchor, true)}
              aria-label="setting"
              sx={{
                fontSize: "4rem",
                color: "white",
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

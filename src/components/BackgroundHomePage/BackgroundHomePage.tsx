import "./BackgroundHomePage.scss";
import OImage from "../OImage";
import { ImageInfo } from "../../types";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function BackgroundHomePage({
  imgs,
  width = "100%",
}: {
  imgs: ImageInfo[];
  width?: string;
}) {
  const [newWidth, setNewWidth] = useState(width);
  const [settingPage] = useState([
    { path: "../portfolio", nick: "he", name: "Portfolio" },
    { path: "../contact", nick: "ll", name: "Contact" },
    { path: "../about-me", nick: "ll", name: "About me" },
    { path: "../cv", nick: "ex", name: "My CV" },
  ]);

  const navigate = useNavigate();
  useEffect(() => {
    setNewWidth(width);
  }, [width]);

  const ImageButton = styled(ButtonBase)(() => ({
    position: "relative",
    height: "100%",
    "&, &": {
      outline: "none",
      "& .MuiTouchRipple-root": {
        outline: "none",
        zIndex: 3,
      },
      "& .MuiTypography-root.text-nick": {
        position: "absolute",
        height: "100%",
        zIndex: 3,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        color: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "8vw",
        fontWeight: 700,
      },
    },
    "&, &.Mui-focusVisible": {
      outline: "none",
      "& .background__image": {
        position: "relative",
        zIndex: 1,
      },
      "& .MuiTypography-root.text-nick": {
        position: "absolute",
        height: "100%",
        zIndex: 3,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        color: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "8vw",
        fontWeight: 700,
      },
      "& .MuiTypography-root:not(.text-nick)": {
        position: "absolute",
        height: "102%",
        width: "102%",
        zIndex: 2,
        left: "-1%",
        right: "-1%",
        top: "-1%",
        bottom: "-1%",
        margin: 0,
        padding: 0,
        paddingTop: "5%",
        lineHeight: "130%",
        borderRadius: "5px",
        color: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transition:
          "top 0.3s ease-out, height 0.3s ease-out, background-color 0.5s ease-out, backdrop-filter 0.5s ease-out",
      },
    },
    "&:hover, &.Mui-focusVisible": {
      "& .MuiTypography-root:not(.text-nick)": {
        position: "absolute",
        height: "112%",
        width: "102%",
        zIndex: 2,
        left: "-1%",
        right: "-1%",
        top: "-8%",
        bottom: "-1%",
        margin: 0,
        padding: 0,
        backdropFilter: "blur(0px)",
        WebkitBackdropFilter: "blur(0px)",
        color: "rgba(255, 255, 255, 0.7)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        transition:
          "top 0.3s ease-out, height 0.3s ease-out, background-color 0.5s ease-out, backdrop-filter 0.5s ease-out",
      },
    },
  }));

  const Image = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    margin: 0,
    padding: 0,
    height: "100%",
    color: theme.palette.common.white,
  }));

  return (
    <div className="background_page-home" style={{ width: newWidth }}>
      <div className="background__images background__images_row">
        {imgs.map((img, index) => (
          <ImageButton
            key={uuidv4()}
            focusRipple
            onClick={() => {
              setTimeout(() => {
                navigate(settingPage[index].path, { relative: "path" });
              }, 500);
            }}
          >
            <Typography
              className="text-nick"
              component="p"
              variant="subtitle1"
              color="inherit"
              fontSize="2vw"
            >
              {settingPage[index].nick}
            </Typography>
            <Image>
              <Typography
                component="p"
                variant="subtitle1"
                color="inherit"
                fontSize="2vw"
              >
                {settingPage[index].name}
              </Typography>
            </Image>
            <div className="background__image" style={{ width: "13vw" }}>
              <OImage img={img} />
            </div>
          </ImageButton>
        ))}
      </div>
    </div>
  );
}

export default BackgroundHomePage;

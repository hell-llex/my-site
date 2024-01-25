import "./BackgroundPortfolioPage.scss";
import OImage from "../OImage";
import { ImageInfo } from "../../types";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const ImageButton = styled(ButtonBase)(() => ({
  position: "relative",
  height: "100%",
  overflow: "hidden",
  borderRadius: "10px",
  outline: "none",
  "& .MuiTouchRipple-root": {
    outline: "none",
    zIndex: 3,
    borderRadius: "10px",
  },
  "& .MuiTypography-root": {
    overflow: "hidden",
    position: "absolute",
    height: "110%",
    width: "110%",
    zIndex: 3,
    left: "-5%",
    right: "-5%",
    top: "-5%",
    bottom: "-5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "5vw",
    fontWeight: 700,
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    color: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "all 0.5s ease-out",
  },

  "&:hover, &.Mui-focusVisible": {
    borderRadius: "10px",
    "& .MuiTypography-root": {
      position: "absolute",
      height: "110%",
      width: "110%",
      zIndex: 3,
      left: "-5%",
      right: "-5%",
      top: "-5%",
      bottom: "-5%",
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
      color: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      transition: "all 0.5s ease-out",
    },
  },
}));

function BackgroundPortfolioPage({ imgs }: { imgs: ImageInfo[] }) {
  const { t } = useTranslation();
  const [settingPage] = useState([
    {
      path: "../portfolio/photo",
      name: "components.BackgroundPortfolioPage.title1",
    },
    {
      path: "../portfolio/project",
      name: "components.BackgroundPortfolioPage.title2",
    },
  ]);
  const screenSize = useScreenSize();
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  const navigate = useNavigate();

  return (
    <div
      className="background_page-portfolio"
      style={{ width: screenMobile ? "80vw" : "60vw" }}
    >
      <div className="background__images">
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
            <Typography component="p" variant="subtitle1" color="inherit">
              {t(settingPage[index].name)}
            </Typography>
            <div
              className="background__image"
              style={{ width: screenMobile ? "80vw" : "26vw" }}
            >
              <OImage
                img={img}
                thumbnail
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </ImageButton>
        ))}
      </div>
    </div>
  );
}

export default BackgroundPortfolioPage;
// переделать стили по методологии бэм

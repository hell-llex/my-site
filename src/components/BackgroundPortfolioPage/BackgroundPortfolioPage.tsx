import "./BackgroundPortfolioPage.scss";
import OImage from "../OImage";
import { ImageInfo, TotalInfo } from "../../types";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function BackgroundPortfolioPage({
  imgs,
  width = "100%",
}: {
  imgs: (ImageInfo | TotalInfo)[];
  width?: string;
}) {
  const [newWidth, setNewWidth] = useState(width);
  const [settingPage] = useState([
    { path: "/portfolio/photo", name: "Photo" },
    { path: "/portfolio/project", name: "Project" },
  ]);

  const navigate = useNavigate();
  useEffect(() => {
    setNewWidth(width);
  }, [width]);

  const ImageButton = styled(ButtonBase)(() => ({
    position: "relative",
    height: "100%",
    overflow: "hidden",
    borderRadius: "5px",
    "&, &": {
      outline: "none",
      borderRadius: "5px",
      "& .MuiTouchRipple-root": {
        outline: "none",
        zIndex: 3,
        borderRadius: "5px",
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
        fontSize: "6vw",
        fontWeight: 700,
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        color: "rgba(255, 255, 255, 0.4)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transition: "all 0.5s ease-out",
      },
    },
    "&:hover, &.Mui-focusVisible": {
      borderRadius: "5px",
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

  return (
    <div className="background_page-portfolio" style={{ width: newWidth }}>
      <div className="background__images background__images_row">
        {imgs.map((img, index) => (
          <ImageButton
            key={img.toString()}
            focusRipple
            onClick={() => {
              setTimeout(() => {
                navigate(settingPage[index].path);
              }, 500);
            }}
          >
            <Typography component="p" variant="subtitle1" color="inherit">
              {settingPage[index].name}
            </Typography>
            <div className="background__image" style={{ width: "28vw" }}>
              <OImage img={img} />
            </div>
          </ImageButton>
        ))}
      </div>
    </div>
  );
}

export default BackgroundPortfolioPage;
// переделать стили по методологии бэм

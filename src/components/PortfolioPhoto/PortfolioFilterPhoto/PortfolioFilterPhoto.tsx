import "./PortfolioFilterPhoto.scss";
import OImage from "../../OImage";
import { ImageInfo } from "../../../types";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
// import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";

const ImageButton = styled(ButtonBase)(() => ({
  position: "relative",
  height: "100%",
  width: "100%",
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
      fontSize: "2vw",
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

function PortfolioFilterPhoto() {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const [filterItem] = useState<
    { value: string; name: string; img: ImageInfo }[]
  >([
    {
      value: "portrait",
      name: "Portrait",
      img: Object.values(dataImages.portrait)[0],
    },
    {
      value: "landscape",
      name: "Landscape",
      img: Object.values(dataImages.landscape)[0],
    },
    {
      value: "mobile",
      name: "Mobile",
      img: Object.values(dataImages.mobile)[1],
    },
    { value: "me", name: "Me", img: Object.values(dataImages.me)[0] },
  ]);

  return (
    <div className="portfolio-filter">
      <div className="portfolio-filter__images portfolio-filter__images_row">
        {filterItem.map((item) => (
          <ImageButton
            key={item.toString()}
            focusRipple
            onClick={() => {
              setTimeout(() => {
                // navigate(settingPage[index].path, { relative: "path" });
                alert(item.name);
              }, 500);
            }}
          >
            <Typography component="p" variant="subtitle1" color="inherit">
              {item.name}
            </Typography>
            <div className="portfolio-filter__image">
              <OImage
                img={item.img}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </ImageButton>
        ))}
      </div>
    </div>
  );
}

export default PortfolioFilterPhoto;

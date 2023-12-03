import "./PortfolioFilterPhoto.scss";
import OImage from "../../OImage";
import { ImageInfo, filterPhoto } from "../../../types";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { updateFilterPhoto } from "../../../store/slice/baseParamsSlice";
import { filterPhotos } from "../../../store/slice/imagesInfoSlice";
import { v4 as uuidv4 } from "uuid";

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
  "&:hover, &.Mui-focusVisible, &.active": {
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

  const filterPhotoStore = useAppSelector(
    (state) => state.baseParams.filterPhoto
  );
  const dispatch = useAppDispatch();
  const updateStoreFilterPhoto = (item: filterPhoto[]) =>
    dispatch(updateFilterPhoto(item));
  const filtrationPhotos = (item: filterPhoto[]) =>
    dispatch(filterPhotos(item));

  const [filterItem] = useState<
    { value: filterPhoto; name: string; img: ImageInfo }[]
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

  function updateFilter(value: filterPhoto) {
    const newFilter = filterPhotoStore.includes(value)
      ? filterPhotoStore.filter((elem) => elem != value)
      : [...filterPhotoStore, value];
    updateStoreFilterPhoto(newFilter);
    filtrationPhotos(newFilter);
  }

  return (
    <div className="portfolio-filter">
      <div className="portfolio-filter__images portfolio-filter__images_row">
        {filterItem.map((item) => (
          <ImageButton
            key={uuidv4()}
            focusRipple
            value={item.value}
            className={filterPhotoStore.includes(item.value) ? "active" : ""}
            onClick={() => {
              updateFilter(item.value);
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

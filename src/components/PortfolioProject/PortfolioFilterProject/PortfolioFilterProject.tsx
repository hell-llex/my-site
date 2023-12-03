import "./PortfolioFilterProject.scss";
import OImage from "../../OImage";
import { ImageInfo, filterProject } from "../../../types";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { updateFilterProject } from "../../../store/slice/baseParamsSlice";
import { filterProjects } from "../../../store/slice/projectsInfoSlice";
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
function PortfolioFilterProject() {
  const dataImages = useAppSelector((state) => state.imagesInfo);

  const filterProjectStore = useAppSelector(
    (state) => state.baseParams.filterProject
  );
  const dispatch = useAppDispatch();
  const updateStoreFilterProject = (item: filterProject[]) =>
    dispatch(updateFilterProject(item));
  const filtrationProjects = (item: filterProject[]) =>
    dispatch(filterProjects(item));

  const [filterItem] = useState<
    { value: filterProject; name: string; img: ImageInfo }[]
  >([
    {
      value: "vanilla",
      name: "Vanilla",
      img: dataImages.all.image_5,
    },
    { value: "react", name: "React", img: dataImages.all.image_6 },
    { value: "vue", name: "Vue", img: dataImages.all.image_7 },
    { value: "other", name: "Other", img: dataImages.all.image_8 },
  ]);

  function updateFilter(value: filterProject) {
    const newFilter = filterProjectStore.includes(value)
      ? filterProjectStore.filter((elem) => elem != value)
      : [...filterProjectStore, value];
    updateStoreFilterProject(newFilter);
    filtrationProjects(newFilter);
  }

  return (
    <div className="portfolio-filter">
      <div className="portfolio-filter__images portfolio-filter__images_row">
        {filterItem.map((item) => (
          <ImageButton
            key={uuidv4()}
            focusRipple
            value={item.value}
            className={filterProjectStore.includes(item.value) ? "active" : ""}
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

export default PortfolioFilterProject;

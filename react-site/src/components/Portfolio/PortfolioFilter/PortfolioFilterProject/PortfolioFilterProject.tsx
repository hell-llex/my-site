import "../PortfolioFilter.scss";
import OImage from "../../../OImage";
import { ImageInfo, filterProject } from "../../../../types";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { updateFilterProject } from "../../../../store/slice/baseParamsSlice";
import { filterProjects } from "../../../../store/slice/projectsInfoSlice";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

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
  "&.active": {
    borderRadius: "5px",
    outline: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0px 0px 10px 3px rgba(255, 255, 255, 0.3)",
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
      boxSizing: "border-box",
    },
  },
}));

const ImageButtonMobile = styled(ButtonBase)(() => ({
  position: "relative",
  height: "7vh",
  maxHeight: "10rem",
  minHeight: "4rem",
  width: "40%",
  overflow: "hidden",
  borderRadius: "10px",
  "&, &": {
    outline: "none",
    borderRadius: "10px",
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
      fontSize: "1.8rem",
      fontWeight: 700,
      color: "rgba(255, 255, 255, 0.6)",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: "all 0.5s ease-out",
    },
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
      color: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      transition: "all 0.5s ease-out",
    },
  },
  "&.active": {
    borderRadius: "10px",
    outline: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.5)",
    "& .MuiTypography-root": {
      position: "absolute",
      height: "110%",
      width: "110%",
      zIndex: 3,
      left: "-5%",
      right: "-5%",
      top: "-5%",
      bottom: "-5%",
      color: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      transition: "all 0.5s ease-out",
    },
  },
}));

const ImageButtonFilterBtnMobile = styled(ButtonBase)(() => ({
  position: "relative",
  height: "100%",
  width: "100%",
  padding: "1rem",
  overflow: "hidden",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "3vw",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  "&, &": {
    outline: "none",
    borderRadius: "10px",
    "& .MuiTouchRipple-root": {
      outline: "none",
      zIndex: 3,
      borderRadius: "5px",
    },
    "& div": {
      opacity: "0.9",
    },
    "& .filter-item .MuiTypography-root": {
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
      fontWeight: 700,
      color: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.5s ease-out",
    },
  },
  "&:hover, &.Mui-focusVisible, &.active": {
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
      transition: "all 0.5s ease-out",
    },
  },
}));

function PortfolioFilterProject() {
  const { t } = useTranslation();
  const dataImages = useAppSelector((state) => state.imagesInfo);

  const filterProjectStore = useAppSelector(
    (state) => state.baseParams.filterProject
  );
  const dispatch = useAppDispatch();
  const updateStoreFilterProject = (item: filterProject[]) =>
    dispatch(updateFilterProject(item));
  const filtrationProjects = (item: filterProject[]) =>
    dispatch(filterProjects(item));
  const screenSize = useScreenSize();
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );

  const [openFilterPanel, setOpenFilterPanel] = useState(false);

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  const [filterItem] = useState<
    { value: filterProject; name: string; img: ImageInfo }[]
  >([
    {
      value: "vanilla",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterProject.title1",
      img: dataImages.all.image_5,
    },
    {
      value: "react",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterProject.title2",
      img: dataImages.all.image_6,
    },
    {
      value: "vue",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterProject.title3",
      img: dataImages.all.image_7,
    },
    {
      value: "other",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterProject.title4",
      img: dataImages.all.image_8,
    },
  ]);

  function updateFilter(value: filterProject) {
    const newFilter = filterProjectStore.includes(value)
      ? filterProjectStore.filter((elem) => elem != value)
      : [...filterProjectStore, value];
    updateStoreFilterProject(newFilter);
    filtrationProjects(newFilter);
  }

  return (
    <div
      className="portfolio-filter"
      style={{
        height: screenMobile ? "10%" : "",
      }}
    >
      {!screenMobile ? (
        <div className="portfolio-filter__images">
          {filterItem.map((item) => (
            <ImageButton
              key={uuidv4()}
              focusRipple
              value={item.value}
              className={
                filterProjectStore.includes(item.value) ? "active" : ""
              }
              onClick={() => {
                updateFilter(item.value);
              }}
            >
              <Typography component="p" variant="subtitle1" color="inherit">
                {t(item.name)}
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
      ) : (
        <>
          <span
            className={`portfolio-filter__backdrop ${
              openFilterPanel ? "open" : "close"
            }`}
            onClick={() => {
              setOpenFilterPanel(!openFilterPanel);
            }}
          ></span>
          <div
            className={`portfolio-filter__wrapper ${
              openFilterPanel ? "open" : "close"
            }`}
          >
            <div
              className={`portfolio-filter__container-filter ${
                openFilterPanel ? "open" : "close"
              }`}
            >
              <div className="portfolio-filter__filter-items">
                {filterItem.map((item) => (
                  <ImageButtonMobile
                    key={uuidv4()}
                    focusRipple
                    value={item.value}
                    className={
                      filterProjectStore.includes(item.value) ? "active" : ""
                    }
                    onClick={() => {
                      updateFilter(item.value);
                    }}
                  >
                    <Typography
                      component="p"
                      variant="subtitle1"
                      color="inherit"
                    >
                      {t(item.name)}
                    </Typography>
                    <div className="portfolio-filter__image">
                      <OImage
                        img={item.img}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </ImageButtonMobile>
                ))}
              </div>
            </div>
          </div>

          <div className="portfolio-filter__container-btn">
            <div className="portfolio-filter__btn">
              <ImageButtonFilterBtnMobile
                key={uuidv4()}
                focusRipple
                onClick={() => {
                  setOpenFilterPanel(!openFilterPanel);
                }}
              >
                <div
                  className="filter-item"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                  }}
                >
                  <Typography
                    component="p"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      fontSize: "1.3rem",
                      lineHeight: "1.4rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {filterProjectStore.length === 0 ||
                    filterProjectStore.length === 4 ? (
                      <span
                        style={{
                          fontSize: "2.8rem",
                        }}
                      >
                        {t(
                          "components.Portfolio.PortfolioFilter.PortfolioFilterProject.title6"
                        )}
                      </span>
                    ) : (
                      filterProjectStore.map((elem, i) => {
                        const filterName = filterItem.find(
                          (item) => item.value === elem
                        );
                        return (
                          t(filterName!.name as string) + (i % 2 ? "\n" : "\t")
                        );
                      })
                    )}
                  </Typography>
                  <div className="portfolio-filter__btn-images">
                    {filterProjectStore.length === 0
                      ? filterItem.map((elem) => (
                          <span
                            key={uuidv4()}
                            style={{
                              width: "100%",
                              minWidth: "25%",
                              maxWidth: "100%",
                              height: "100%",
                            }}
                          >
                            <OImage
                              img={elem.img}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </span>
                        ))
                      : filterItem
                          .filter((elem) =>
                            filterProjectStore.includes(elem.value)
                          )
                          .map((elem) => (
                            <span
                              key={uuidv4()}
                              style={{
                                width: "100%",
                                minWidth: "25%",
                                maxWidth: "100%",
                                height: "100%",
                              }}
                            >
                              <OImage
                                img={elem.img}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            </span>
                          ))}
                  </div>
                </div>
              </ImageButtonFilterBtnMobile>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PortfolioFilterProject;

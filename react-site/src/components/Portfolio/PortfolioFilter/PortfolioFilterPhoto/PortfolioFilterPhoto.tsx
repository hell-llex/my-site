import "../PortfolioFilter.scss";
import OImage from "../../../OImage";
import { ImageInfo, filterPhoto } from "../../../../types";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { updateFilterPhoto } from "../../../../store/slice/baseParamsSlice";
import { filterPhotos } from "../../../../store/slice/imagesInfoSlice";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../../../hooks/useScreenSize";
import { Button } from "@mui/material";
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
      fontSize: "1.8vw",
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
      fontSize: "1.6rem",
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

function PortfolioFilterPhoto() {
  const { t } = useTranslation();
  const dataImages = useAppSelector((state) => state.imagesInfo);

  const filterPhotoStore = useAppSelector(
    (state) => state.baseParams.filterPhoto
  );
  const dispatch = useAppDispatch();
  const updateStoreFilterPhoto = (item: filterPhoto[]) =>
    dispatch(updateFilterPhoto(item));
  const filtrationPhotos = (item: filterPhoto[]) =>
    dispatch(filterPhotos(item));
  const screenSize = useScreenSize();
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );

  const [openFilterPanel, setOpenFilterPanel] = useState(false);

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  const [filterItem] = useState<
    { value: filterPhoto; name: string; img: ImageInfo }[]
  >([
    {
      value: "portrait",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterPhoto.title1",
      img: Object.values(dataImages.portrait)[0],
    },
    {
      value: "landscape",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterPhoto.title2",
      img: Object.values(dataImages.landscape)[0],
    },
    {
      value: "mobile",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterPhoto.title3",
      img: Object.values(dataImages.mobile)[1],
    },
    {
      value: "me",
      name: "components.Portfolio.PortfolioFilter.PortfolioFilterPhoto.title4",
      img: Object.values(dataImages.me)[0],
    },
  ]);

  function updateFilter(value: filterPhoto) {
    const newFilter = filterPhotoStore.includes(value)
      ? filterPhotoStore.filter((elem) => elem != value)
      : [...filterPhotoStore, value];
    updateStoreFilterPhoto(newFilter);
    filtrationPhotos(newFilter);
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
              className={filterPhotoStore.includes(item.value) ? "active" : ""}
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
                      filterPhotoStore.includes(item.value) ? "active" : ""
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
              <div className="portfolio-filter__view-items">
                <Button
                  disabled
                  className="view-item"
                  sx={{
                    height: "100%",
                    display: "flex",
                    borderRadius: "10px",
                    "&:active": {
                      transform: "scale(0.99)",
                    },
                    "& .MuiTouchRipple-root": {
                      outline: "none",
                      zIndex: 3,
                      color: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <span
                    style={{
                      width: "11rem",
                      height: "11rem",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1%",
                      boxSizing: "border-box",
                      borderRadius: "10px",
                      border: "2px solid rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(3px)",
                      WebkitBackdropFilter: "blur(3px)",
                      background: "rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "47%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "47%",
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "65%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                  </span>
                </Button>
                <Button
                  disabled
                  className="view-item"
                  sx={{
                    height: "100%",
                    display: "flex",
                    borderRadius: "10px",

                    "&:active": {
                      transform: "scale(0.99)",
                    },
                    "& .MuiTouchRipple-root": {
                      outline: "none",
                      zIndex: 3,
                      color: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <span
                    style={{
                      width: "11rem",
                      height: "11rem",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1%",
                      boxSizing: "border-box",
                      borderRadius: "10px",
                      border: "2px solid rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(3px)",
                      WebkitBackdropFilter: "blur(3px)",
                      background: "rgba(0, 0, 0, 0.3)",
                      opacity: "0.5",
                    }}
                  >
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "65%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "65%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "65%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                  </span>
                </Button>
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
                      fontSize: "0.9rem",
                      lineHeight: "1.3rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {filterPhotoStore.length === 0 ||
                    filterPhotoStore.length === 4 ? (
                      <span
                        style={{
                          fontSize: "2.8rem",
                        }}
                      >
                        {t(
                          "components.Portfolio.PortfolioFilter.PortfolioFilterPhoto.title6"
                        )}
                      </span>
                    ) : (
                      filterPhotoStore.map((elem, i) => {
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
                    {filterPhotoStore.length === 0
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
                            filterPhotoStore.includes(elem.value)
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
                <div
                  className="view-item"
                  style={{
                    // width: "25%",
                    height: "100%",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      width: "4rem",
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1%",
                    }}
                  >
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "47%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "47%",
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                    <>
                      <span
                        style={{
                          height: "25%",
                          width: "30%",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                      <span
                        style={{
                          height: "25%",
                          width: "65%",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "3px",
                          display: "block",
                        }}
                      ></span>
                    </>
                  </span>
                  {/* </div> */}
                </div>
              </ImageButtonFilterBtnMobile>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PortfolioFilterPhoto;

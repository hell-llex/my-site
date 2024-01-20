import { SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ImageInfo } from "../../../../types";
import "./PortfolioGalleryProject.scss";

import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import OImage from "../../../OImage";

import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import Loader from "../../../Loader";
import { updateFullWidthGallery } from "../../../../store/slice/baseParamsSlice";
import useScreenSize from "../../../../hooks/useScreenSize";
import CloseIcon from "@mui/icons-material/Close";

const WheelControls: KeenSliderPlugin = (slider) => {
  let touchTimeout: ReturnType<typeof setTimeout>;
  let position: {
    x: number;
    y: number;
  };
  let wheelActive: boolean;

  function dispatch(e: WheelEvent, name: string) {
    position.x -= e.deltaY;
    position.y -= e.deltaY;
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y,
        },
      })
    );
  }

  function wheelStart(e: WheelEvent) {
    position = {
      x: e.pageX,
      y: e.pageY,
    };
    dispatch(e, "ksDragStart");
  }

  function wheel(e: WheelEvent) {
    dispatch(e, "ksDrag");
  }

  function wheelEnd(e: WheelEvent) {
    dispatch(e, "ksDragEnd");
  }

  function eventWheel(e: WheelEvent) {
    e.preventDefault();
    if (!wheelActive) {
      wheelStart(e);
      wheelActive = true;
    }
    wheel(e);
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      wheelActive = false;
      wheelEnd(e);
    }, 50);
  }

  slider.on("created", () => {
    slider.container.addEventListener("wheel", eventWheel, {
      passive: false,
    });
  });
};

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
      boxSizing: "border-box",
      overflow: "hidden",
      position: "absolute",
      height: "110%",
      width: "110%",
      zIndex: 3,
      left: "-5%",
      right: "-5%",
      top: "-5%",
      bottom: "-5%",
      padding: "15%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "clamp(16px, 1.4vw, 34px)",
      textAlign: "center",
      fontWeight: 700,
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      color: "rgba(255, 255, 255, 0.6)",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: "all 0.5s ease-out",
      "& span": {
        fontSize: "clamp(10px, 1.2vw, 28px)",
        textAlign: "start",
      },
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
      textAlign: "start",
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
      color: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      transition: "all 0.5s ease-out",
    },
  },
}));

const MutationPlugin: KeenSliderPlugin = (slider) => {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      slider.update();
    });
  });
  const config = { childList: true };

  slider.on("created", () => {
    observer.observe(slider.container, config);
  });
  slider.on("destroyed", () => {
    observer.disconnect();
  });
};

const ResizePlugin: KeenSliderPlugin = (slider) => {
  const observer = new ResizeObserver(function () {
    slider.update();
  });

  slider.on("created", () => {
    observer.observe(slider.container);
  });
  slider.on("destroyed", () => {
    observer.unobserve(slider.container);
  });
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const PortfolioGalleryProject = () => {
  const dataImages = useAppSelector((state) => state.projectsInfo);
  const filterProjectStore = useAppSelector(
    (state) => state.baseParams.filterProject
  );
  const dispatch = useAppDispatch();
  const setFullWithGallery = (item: boolean) =>
    dispatch(updateFullWidthGallery(item));

  const [imagesProject, setImagesProject] = useState<ImageInfo[]>(
    dataImages.filteredProjects
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    _event: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isPreloaderTimer, setIsPreloaderTimer] = useState(false);
  const screenSize = useScreenSize();
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  const [openModal, setOpenModal] = useState(false);
  const [infoModal, setInfoModal] = useState<ImageInfo>();

  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
    setInfoModal(undefined);
  };

  useEffect(() => {
    setImagesProject(dataImages.filteredProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProjectStore]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsPreloaderTimer(true);
    }, 800);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (isComponentLoaded && isPreloaderTimer) {
      setIsLoading(true);
      setIsPreloaderTimer(false);
      setIsComponentLoaded(false);
    }
  }, [isComponentLoaded, isPreloaderTimer]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      mode: "free-snap",
      rubberband: false,
      vertical: screenMobile ? true : false,
      renderMode: "performance",
      dragSpeed: 0.5,
      slides: {
        perView: 4,
        spacing: 10,
      },
      detailsChanged(s) {
        setProgress(s.track.details.progress * 100);
        if (s.track.details.slides.length <= 6) {
          setFullWithGallery(false);
          setProgress(0);
        }
      },
      created() {
        setIsComponentLoaded(true);
      },
      dragEnded(s) {
        s.track.details.abs >= 1
          ? setFullWithGallery(true)
          : setFullWithGallery(false);
      },
    },
    [WheelControls, MutationPlugin, ResizePlugin]
  );

  return (
    <>
      {!isLoading && <Loader />}
      <>
        <span
          style={{
            color: "white",
            width: "85%",
            height: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "3rem",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            color="inherit"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
            }}
          />
        </span>
        <div
          ref={sliderRef}
          className="keen-slider"
          style={{
            height: "100%",
            width: "100%",
            transition: "all 1s ease-out",
          }}
        >
          {imagesProject.map((img) => (
            <div key={img.name} className="keen-slider__slide">
              <ImageButton
                focusRipple
                onClick={() => {
                  // setTimeout(() => {
                  //   alert(Object.values(img).join(" | "));
                  // }, 500);
                  setInfoModal(img);
                  handleClickOpen();
                }}
                // onClick={handleClickOpen}
              >
                <Typography component="p" variant="body1" color="inherit">
                  {img.name}
                  {/* <span>
                    <br />
                    {"Category: " +
                      img.category
                        .map((elem) => elem[0].toUpperCase() + elem.slice(1))
                        .join(" / ")}
                    <br />
                    <br />
                    {"Description: " + img.description} */}
                  {/* <br />
                    {"Link GitHub"}
                    <br />
                    {"Link Project"} */}
                  {/* </span> */}
                </Typography>
                <div className="background__image">
                  <OImage
                    img={img}
                    style={{
                      height: screenMobile ? "auto" : "100%",
                      width: "100%",
                    }}
                  />
                </div>
              </ImageButton>
            </div>
          ))}
        </div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openModal}
          fullWidth
          maxWidth={"md"}
          sx={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            "& .MuiDialog-paper": {
              fontWeight: 700,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background: "rgba(60, 60, 60, 0.7)",
              color: "rgba(255,255,255, 0.7)",
              borderRadius: "10px",
            },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              color: "rgba(255,255,255, 0.7)",
              fontWeight: 700,
            }}
            id="customized-dialog-title"
            fontSize={"2.5rem"}
          >
            {infoModal?.name}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              color="inherit"
            >
              <CloseIcon sx={{ fontSize: "2.6rem" }} color="inherit" />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <div
              style={{
                width: "auto",
                height: "40vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflowX: "auto",
              }}
            >
              {infoModal && (
                <OImage
                  img={infoModal}
                  style={{
                    width: "100%",
                    height: "100%",
                    opacity: "0.8",
                  }}
                />
              )}
            </div>

            <Typography
              gutterBottom
              component="p"
              variant="body1"
              color="inherit"
              fontSize={"1.6rem"}
              sx={{ fontWeight: 500 }}
            >
              <br />
              <span>
                <b>{"Category: "}</b>
                {infoModal?.category
                  .map((elem) => elem[0].toUpperCase() + elem.slice(1))
                  .join(" / ")}
                <br />
                <b>{"Description: "}</b>
                {infoModal?.description}
              </span>
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              color: "rgba(255,255,255, 0.7)",
            }}
          >
            <Button
              onClick={handleClickSnackbar}
              sx={{
                fontSize: "1.6rem",
                fontWeight: 700,
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "10px",
                padding: "0.5rem 2rem",
                "&:hover": {
                  background: "rgba(20, 20, 20, 0.5)",
                },
              }}
              color="inherit"
              autoFocus
            >
              Visit the <br /> website
            </Button>
            <Button
              onClick={handleClickSnackbar}
              sx={{
                fontSize: "1.6rem",
                fontWeight: 700,
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "10px",
                padding: "0.5rem 2rem",
                "&:hover": {
                  background: "rgba(20, 20, 20, 0.5)",
                },
              }}
              color="inherit"
              autoFocus
            >
              View code <br />
              on GitHub
            </Button>
          </DialogActions>
        </BootstrapDialog>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          key={"top" + "center"}
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: "100%", fontSize: "1.4rem" }}
          >
            Unfortunately, this link doesn&#39;t work!
          </Alert>
        </Snackbar>
      </>
    </>
  );
};

export default PortfolioGalleryProject;

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ImageInfo } from "../../../types";
import "./PortfolioGalleryProject.scss";

import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import OImage from "../../OImage";

import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { LinearProgress } from "@mui/material";
import Loader from "../../Loader";
import { updateFullWidthGallery } from "../../../store/slice/baseParamsSlice";

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
      fontSize: "1.6vw",
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

const PortfolioGalleryProject = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const dispatch = useAppDispatch();
  const setFullWithGallery = (item: boolean) =>
    dispatch(updateFullWidthGallery(item));

  const [imagesProject] = useState<ImageInfo[]>(Object.values(dataImages.all));
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isPreloaderTimer, setIsPreloaderTimer] = useState(false);

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
      vertical: false,
      renderMode: "performance",
      dragSpeed: 0.5,
      slides: {
        perView: 5,
        spacing: 10,
      },
      detailsChanged(s) {
        setProgress(s.track.details.progress * 100);
        s.track.details.abs >= 1
          ? setFullWithGallery(true)
          : setFullWithGallery(false);
      },
      created() {
        setIsComponentLoaded(true);
      },
    },
    [WheelControls]
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
          {imagesProject.slice(0, 20).map((img, index) => (
            <div key={index} className="keen-slider__slide">
              <ImageButton
                focusRipple
                onClick={() => {
                  setTimeout(() => {
                    // navigate(settingPage[index].path, { relative: "path" });
                    alert("Project-" + String(index + 1));
                  }, 500);
                }}
              >
                <Typography component="p" variant="subtitle1" color="inherit">
                  {"Project-" + String(index + 1)}
                </Typography>
                <div className="background__image">
                  <OImage img={img} />
                </div>
              </ImageButton>
            </div>
          ))}
        </div>
      </>
    </>
  );
};

export default PortfolioGalleryProject;

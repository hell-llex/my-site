import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ImageInfo } from "../../../types";
import "./PortfolioGalleryPhoto.scss";

import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import OImage from "../../OImage";

// import { styled } from "@mui/material/styles";
// import ButtonBase from "@mui/material/ButtonBase";
// import Typography from "@mui/material/Typography";
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
// const ImageButton = styled(ButtonBase)(() => ({
//   position: "relative",
//   height: "100%",
//   width: "100%",
//   overflow: "hidden",
//   borderRadius: "5px",
//   "&, &": {
//     outline: "none",
//     borderRadius: "5px",
//     "& .MuiTouchRipple-root": {
//       outline: "none",
//       zIndex: 3,
//       borderRadius: "5px",
//     },
//     "& .MuiTypography-root": {
//       overflow: "hidden",
//       position: "absolute",
//       height: "110%",
//       width: "110%",
//       zIndex: 3,
//       left: "-5%",
//       right: "-5%",
//       top: "-5%",
//       bottom: "-5%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontSize: "1.6vw",
//       fontWeight: 700,
//       backdropFilter: "blur(3px)",
//       WebkitBackdropFilter: "blur(3px)",
//       color: "rgba(255, 255, 255, 0.4)",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//       transition: "all 0.5s ease-out",
//     },
//   },
//   "&:hover, &.Mui-focusVisible": {
//     borderRadius: "5px",
//     "& .MuiTypography-root": {
//       position: "absolute",
//       height: "110%",
//       width: "110%",
//       zIndex: 3,
//       left: "-5%",
//       right: "-5%",
//       top: "-5%",
//       bottom: "-5%",
//       backdropFilter: "blur(0px)",
//       WebkitBackdropFilter: "blur(0px)",
//       color: "rgba(255, 255, 255, 0.8)",
//       backgroundColor: "rgba(0, 0, 0, 0.2)",
//       transition: "all 0.5s ease-out",
//     },
//   },
// }));

const PortfolioGalleryPhoto = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);

  function createArrayForPhotoGallery(objectImages: Record<string, ImageInfo>) {
    const allImagesBase: (ImageInfo | "space")[] = Object.values(objectImages);

    const allImagesNew: (ImageInfo | "space")[][] = [];

    for (let i = 0; i < allImagesBase.length; i++) {
      if (
        allImagesBase[i] != "space" &&
        (allImagesBase[i] as ImageInfo).orientation === "vertical"
      ) {
        allImagesBase.splice(i + 1, 0, "space");
      }
    }

    for (let i = 0; i < allImagesBase.length; i += 3) {
      allImagesNew.push(allImagesBase.slice(i, i + 3));
    }
    // console.log("allImagesNew :>> ", allImagesNew);

    return allImagesNew;
  }

  const [imagesPhoto] = useState<(ImageInfo | "space")[][]>(
    createArrayForPhotoGallery(dataImages["all"])
  );
  const dispatch = useAppDispatch();
  const setFullWithGallery = (item: boolean) =>
    dispatch(updateFullWidthGallery(item));

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
        perView: 6,
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
          style={{ height: "100%", width: "100%" }}
        >
          {imagesPhoto.map((imgs, index) => {
            return (
              <div
                key={index}
                className="keen-slider__slide"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {imgs.map((img, i) => {
                  if (img != "space") {
                    return (
                      <OImage
                        key={i}
                        img={img}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      />
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
      </>
    </>
  );
};

export default PortfolioGalleryPhoto;

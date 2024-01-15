import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ImageInfo } from "../../../../types";
import "./PortfolioGalleryPhoto.scss";

import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import OImage from "../../../OImage";
import { ButtonBase, LinearProgress, styled } from "@mui/material";
import Loader from "../../../Loader";
import { updateFullWidthGallery } from "../../../../store/slice/baseParamsSlice";
import useScreenSize from "../../../../hooks/useScreenSize";
import { PhotoProvider, PhotoView } from "react-photo-view";

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

const ImageButton = styled(ButtonBase)(() => ({
  position: "relative",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  borderRadius: "5px",
  transition: "all 0.3s ease-out",
  outline: "none",
  opacity: "0.7",
  "& .MuiTouchRipple-root": {
    outline: "none",
    zIndex: 3,
    borderRadius: "5px",
  },
  "&:hover, &.Mui-focusVisible": {
    borderRadius: "5px",
    opacity: "1",
    transition: "all 0.3s ease-out",
  },
}));

const PortfolioGalleryPhoto = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const filterPhotoStore = useAppSelector(
    (state) => state.baseParams.filterPhoto
  );
  const [imagesPhoto, setImagesPhoto] = useState<(ImageInfo | "space")[][]>(
    dataImages.filteredPhotos
  );
  const dispatch = useAppDispatch();
  const setFullWithGallery = (item: boolean) =>
    dispatch(updateFullWidthGallery(item));
  const screenSize = useScreenSize();

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isPreloaderTimer, setIsPreloaderTimer] = useState(false);
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );
  const [slidesCountDesktop] = useState(6);
  const [slidesCountMobile] = useState(4);
  const [numberSlides, setNumberSlides] = useState(
    screenMobile ? slidesCountMobile : slidesCountDesktop
  );

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  useEffect(() => {
    setImagesPhoto(dataImages.filteredPhotos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPhotoStore]);

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
        perView: numberSlides,
        spacing: 10,
      },
      detailsChanged(s) {
        // добавить обновление слайдера при плавном уменьшении окна
        setProgress(s.track.details.progress * 100);
        if (s.track.details.slides.length <= 6) {
          setFullWithGallery(false),
            setNumberSlides(
              screenMobile ? slidesCountMobile : slidesCountDesktop
            );
          setProgress(0);
        }
      },
      created() {
        setIsComponentLoaded(true);
      },
      dragEnded(s) {
        s.track.details.abs >= 1
          ? (setFullWithGallery(true),
            setNumberSlides(
              screenMobile ? slidesCountMobile : slidesCountDesktop + 1
            ))
          : (setFullWithGallery(false),
            setNumberSlides(
              screenMobile ? slidesCountMobile : slidesCountDesktop
            ));
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
          }}
        >
          <PhotoProvider>
            {imagesPhoto.map((imgs, index) => {
              return (
                <div
                  key={index}
                  className="keen-slider__slide"
                  style={{
                    display: "flex",
                    flexDirection: screenMobile ? "row" : "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {imgs.map((img) => {
                    if (img != "space") {
                      return (
                        <PhotoView key={img.name} src={img.pathJpg}>
                          <ImageButton focusRipple key={img.name}>
                            <OImage
                              img={img}
                              style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: "5px",
                                overflow: "hidden",
                              }}
                            />
                          </ImageButton>
                        </PhotoView>
                      );
                    }
                  })}
                </div>
              );
            })}
          </PhotoProvider>
        </div>
      </>
    </>
  );
};

export default PortfolioGalleryPhoto;

import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { KeenSliderPlugin } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import { SocialLink } from "../../types";
import "./PageLinks.scss";
import Loader from "../../components/Loader";
import useScreenSize from "../../hooks/useScreenSize";
import { Icon } from "@iconify/react";
import OImage from "../../components/OImage";

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

const slideCenter: KeenSliderPlugin = (slider) => {
  function checkPositionSlide() {
    slider.slides.forEach((elem, i, array) => {
      const nextIndex = i === array.length - 1 ? 0 : i + 1;
      const prevIndex = i === 0 ? array.length - 1 : i - 1;

      if (slider.track.absToRel(slider.track.details.abs) === i)
        elem.classList.add("center");
      else elem.classList.remove("center");

      if (slider.track.absToRel(slider.track.details.abs) === prevIndex)
        elem.classList.add("first-stage-next");
      else elem.classList.remove("first-stage-next");

      if (slider.track.absToRel(slider.track.details.abs) === nextIndex)
        elem.classList.add("first-stage-prev");
      else elem.classList.remove("first-stage-prev");
    });
  }

  slider.on("created", checkPositionSlide);

  slider.on("detailsChanged", checkPositionSlide);
};

const PageLinks = () => {
  const dataImages = useAppSelector((state) => state.socialIconsInfo);
  const dataImagesPhoto = Object.values(
    useAppSelector((state) => state.imagesInfo.all)
  );

  const [imagesSocial] = useState<SocialLink[]>(() => {
    const allImages = [
      {
        icon: "material-symbols:skull-outline",
        color: "#4ba395",
        name: "My site",
        size: dataImages.github.size,
        link: "/",
      },
      ...Object.values(dataImages),
      {
        icon: "academicons:cv",
        color: "#0077FF",
        name: "My CV",
        size: dataImages.github.size,
        link: "/cv",
      },
    ];
    const resultArray: SocialLink[] = [];

    for (let i = 0; i < 10 && allImages.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * allImages.length);
      const randomImage = allImages[randomIndex];
      resultArray.push(randomImage);
      allImages.splice(randomIndex, 1);
    }

    return resultArray;
  });

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
    if (!screenMobile) {
      slider.on("created", () => {
        slider.container.addEventListener("wheel", eventWheel, {
          passive: false,
        });
      });
    }
  };

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
      loop: true,
      mode: "snap",
      vertical: false,
      renderMode: "performance",
      dragSpeed: 0.5,
      slides: {
        origin: "center",
        perView: 5,
        spacing: 5,
      },
      breakpoints: {
        "(max-width: 768px)": {
          vertical: true,
          mode: "free-snap",
          renderMode: "performance",
          dragSpeed: 0.3,
          slides: {
            origin: "center",
            perView: 3,
            spacing: 5,
          },
        },
      },
      created() {
        setIsComponentLoaded(true);
      },
    },
    [WheelControls, MutationPlugin, ResizePlugin, slideCenter]
  );
  return (
    <>
      {!isLoading && <Loader />}
      <div className="page-links">
        <div ref={sliderRef} className="keen-slider">
          {imagesSocial.map((card, i) => (
            <div
              key={card.name}
              className="keen-slider__slide"
              style={{ overflow: "visible" }}
            >
              <Card
                className="keen-slider__slide-card"
                sx={{ borderRadius: "20px", backgroundColor: "black" }}
              >
                <CardActionArea
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                  onClick={() => {
                    setTimeout(() => {
                      window.location.href = card.link;
                    }, 500);
                  }}
                >
                  <OImage
                    img={dataImagesPhoto[i]}
                    thumbnail
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      opacity: "0.5",
                    }}
                  />
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      position: "relative",
                      zIndex: "10",
                      "&::before": {
                        content: "' '",
                        height: "100%",
                        width: "100%",
                        backgroundColor:
                          card.color === "#000000" ? "#ffffff" : card.color,
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        bottom: "0px",
                        left: "0px",
                        opacity: "0.1",
                        zIndex: "-1",
                      },
                    }}
                  >
                    <div
                      className="social-links__link-item"
                      style={{
                        backgroundColor: card.color,
                        height: card.size,
                        width: card.size,
                      }}
                    >
                      <Icon
                        icon={card.icon}
                        color={"white"}
                        width={card.size}
                      />
                    </div>
                    <Typography
                      gutterBottom
                      variant="h3"
                      component="div"
                      color={card.color}
                      fontWeight="bold"
                      lineHeight={card.size}
                      height={card.size}
                      sx={{ marginBottom: 0 }}
                    >
                      {card.name}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PageLinks;

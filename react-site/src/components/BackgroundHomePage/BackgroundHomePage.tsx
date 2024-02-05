import "./BackgroundHomePage.scss";
import OImage from "../OImage";
import { ImageInfo } from "../../types";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../hooks/useScreenSize";
import { Card, CardActionArea, Box } from "@mui/material";
import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";

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
const ImageButton = styled(ButtonBase)(() => ({
  position: "relative",
  height: "100%",
  outline: "none",
  "& .MuiTouchRipple-root": {
    outline: "none",
    zIndex: 3,
  },
  "& .MuiTypography-root.text-nick": {
    position: "absolute",
    height: "100%",
    zIndex: 3,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: "rgba(255, 255, 255, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "8vw",
    fontWeight: 700,
  },

  "&, &.Mui-focusVisible": {
    outline: "none",
    "& .background__image": {
      position: "relative",
      zIndex: 1,
    },
    "& .MuiTypography-root.text-nick": {
      position: "absolute",
      height: "100%",
      zIndex: 3,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      color: "rgba(255, 255, 255, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "8vw",
      fontWeight: 700,
    },
    "& .MuiTypography-root:not(.text-nick)": {
      position: "absolute",
      height: "102%",
      width: "102%",
      zIndex: 2,
      left: "-1%",
      right: "-1%",
      top: "-1%",
      bottom: "-1%",
      margin: 0,
      padding: 0,
      paddingTop: "5%",
      lineHeight: "130%",
      borderRadius: "5px",
      color: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition:
        "top 0.3s ease-out, height 0.3s ease-out, background-color 0.5s ease-out, backdrop-filter 0.5s ease-out",
    },
  },
  "&:hover, &.Mui-focusVisible": {
    "& .MuiTypography-root:not(.text-nick)": {
      position: "absolute",
      height: "112%",
      width: "102%",
      zIndex: 2,
      left: "-1%",
      right: "-1%",
      top: "-8%",
      bottom: "-1%",
      margin: 0,
      padding: 0,
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
      color: "rgba(255, 255, 255, 0.7)",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      transition:
        "top 0.3s ease-out, height 0.3s ease-out, background-color 0.5s ease-out, backdrop-filter 0.5s ease-out",
    },
  },
}));

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  margin: 0,
  padding: 0,
  height: "100%",
  color: theme.palette.common.white,
}));

function BackgroundHomePage({ imgs }: { imgs: ImageInfo[] }) {
  const { t } = useTranslation();
  const [settingPage] = useState([
    {
      path: "../portfolio",
      nick: "he",
      name: "components.BackgroundHomePage.title1",
    },
    {
      path: "../contact",
      nick: "ll",
      name: "components.BackgroundHomePage.title2",
    },
    {
      path: "../about-me",
      nick: "ll",
      name: "components.BackgroundHomePage.title3",
    },
    { path: "../cv", nick: "ex", name: "components.BackgroundHomePage.title4" },
  ]);

  const navigate = useNavigate();
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
      vertical: true,
      mode: "free-snap",
      renderMode: "performance",
      dragSpeed: 0.3,
      slides: {
        origin: "center",
        perView: 3,
        spacing: 5,
      },
      created() {
        setIsComponentLoaded(true);
      },
    },
    [WheelControls, MutationPlugin, ResizePlugin, slideCenter]
  );

  return (
    <>
      <div
        className="background_page-home"
        style={{ width: screenMobile ? "100vw" : "60vw" }}
      >
        {screenMobile ? (
          <>
            {!isLoading && <Loader />}
            <div className="background__images">
              <div ref={sliderRef} className="keen-slider">
                {[
                  ...settingPage,
                  {
                    path: "/links",
                    nick: "ll",
                    name: "components.BackgroundHomePage.title5",
                  },
                ].map((card, index) => (
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
                            navigate(card.path, {
                              relative: "path",
                            });
                          }, 500);
                        }}
                      >
                        <OImage
                          img={imgs[index]}
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
                          }}
                        >
                          <Typography
                            gutterBottom
                            variant="h2"
                            component="div"
                            color="white"
                            fontWeight="bold"
                            sx={{ marginBottom: 0 }}
                          >
                            {t(card.name)}
                          </Typography>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="background__images">
            {settingPage.map((card, index) => (
              <ImageButton
                key={uuidv4()}
                focusRipple
                onClick={() => {
                  setTimeout(() => {
                    navigate(card.path, { relative: "path" });
                  }, 500);
                }}
              >
                <Typography
                  className="text-nick"
                  component="p"
                  variant="subtitle1"
                  color="inherit"
                  fontSize="2vw"
                >
                  {card.nick}
                </Typography>
                <Image>
                  <Typography
                    component="p"
                    variant="subtitle1"
                    color="inherit"
                    fontSize="2vw"
                  >
                    {t(card.name)}
                  </Typography>
                </Image>
                <div
                  className="background__image"
                  style={{ width: screenMobile ? "20vw" : "13vw" }}
                >
                  <OImage img={imgs[index]} thumbnail />
                </div>
              </ImageButton>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default BackgroundHomePage;

import "./BackgroundStartPage.scss";
import OImage from "../OImage";
import { ImageInfo } from "../../types";
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const animation = { duration: 10000, easing: (t: number) => t };
function BackgroundStartPage({
  imgs,
  width = "100%",
  isChangePage,
}: {
  imgs: ImageInfo[];
  width?: string;
  isChangePage: boolean;
}) {
  const [newWidth, setNewWidth] = useState(width);
  // const [isAnimation, setIsAnimation] = useState(true);
  const [animationSetting, setAnimationSetting] = useState({
    perView: 8,
    spacing: 30,
    rtl: true,
    loop: true,
    width: "100vw",
    marginRight: "0vw",
    justifyContent: "center",
  });

  useEffect(() => {
    setAnimationSetting(
      isChangePage
        ? {
            perView: 4,
            spacing: 50,
            rtl: false,
            loop: false,
            width: "60vw",
            marginRight: "9vw",
            justifyContent: "flex-end",
          }
        : {
            perView: 8,
            spacing: 30,
            rtl: true,
            loop: true,
            width: "100vw",
            marginRight: "0",
            justifyContent: "center",
          }
    );
  }, [isChangePage]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: animationSetting.loop,
    renderMode: "performance",
    drag: false,
    rtl: animationSetting.rtl,
    slides: {
      perView: animationSetting.perView,
      spacing: animationSetting.spacing,
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  useEffect(() => {
    setNewWidth(width);
  }, [width]);

  return (
    <div className="background-page" style={{ width: newWidth }}>
      <div
        className="background-page__images background-page__images_row"
        style={{
          justifyContent: animationSetting.justifyContent,
        }}
      >
        <div
          ref={sliderRef}
          className="keen-slider"
          style={{
            width: animationSetting.width,
            marginRight: animationSetting.marginRight,
            transition: "width 1s ease",
          }}
        >
          {imgs.map((img) => (
            <div
              className="background-page__image keen-slider__slide"
              key={img.name}
              style={{
                width: animationSetting.width,
              }}
            >
              <OImage img={img} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BackgroundStartPage;

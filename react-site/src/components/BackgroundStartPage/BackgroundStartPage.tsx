import "./BackgroundStartPage.scss";
import OImage from "../OImage";
import { ImageInfo } from "../../types";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const animation = { duration: 10000, easing: (t: number) => t };
function BackgroundStartPage({ imgs }: { imgs: ImageInfo[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    drag: false,
    rtl: true,
    slides: {
      perView: 8,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 768px)": {
        vertical: true,
        slides: {
          perView: 8,
          spacing: 10,
        },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  return (
    <div className="background-page" style={{ width: "100vw" }}>
      <div className="background-page__images background-page__images_row">
        <div ref={sliderRef} className="keen-slider">
          {imgs.map((img) => (
            <div
              className="background-page__image keen-slider__slide"
              key={img.name}
            >
              <OImage
                img={img}
                thumbnail
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BackgroundStartPage;

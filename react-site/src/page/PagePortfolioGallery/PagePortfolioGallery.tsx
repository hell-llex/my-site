import "./PagePortfolioGallery.scss";
import PortfolioGalleryProject from "../../components/Portfolio/PortfolioGallery/PortfolioGalleryProject";
import PortfolioGalleryPhoto from "../../components/Portfolio/PortfolioGallery/PortfolioGalleryPhoto";
import PortfolioFilterProject from "../../components/Portfolio/PortfolioFilter/PortfolioFilterProject";
import PortfolioFilterPhoto from "../../components/Portfolio/PortfolioFilter/PortfolioFilterPhoto";
import { useAppSelector } from "../../hooks/redux";
import useScreenSize from "../../hooks/useScreenSize";
import { useState, useEffect } from "react";

const PagePortfolioGallery = ({ page }: { page: "photo" | "project" }) => {
  const fullWithGallery = useAppSelector(
    (state) => state.baseParams.fullWithGallery
  );
  const screenSize = useScreenSize();
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  return (
    <>
      {page === "photo" ? (
        <div className="photo-page">
          <div
            className="wrapper"
            style={
              screenMobile
                ? { width: "100vw", height: "96%" }
                : fullWithGallery
                ? { width: "clamp(60vw, 100%, 86vw)" }
                : {}
            }
          >
            <PortfolioFilterPhoto />
            <PortfolioGalleryPhoto />
          </div>
        </div>
      ) : (
        <div className="project-page">
          <div
            className="wrapper"
            style={
              screenMobile
                ? { width: "100vw", height: "96%" }
                : fullWithGallery
                ? { width: "clamp(60vw, 100%, 86vw)" }
                : {}
            }
          >
            <PortfolioFilterProject />
            <PortfolioGalleryProject />
          </div>
        </div>
      )}
    </>
  );
};

export default PagePortfolioGallery;

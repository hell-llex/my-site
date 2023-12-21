import "./PagePortfolioGallery.scss";
import PortfolioGalleryProject from "../../components/PortfolioProject/PortfolioGalleryProject";
import PortfolioGalleryPhoto from "../../components/PortfolioPhoto/PortfolioGalleryPhoto";
import PortfolioFilterProject from "../../components/PortfolioProject/PortfolioFilterProject";
import PortfolioFilterPhoto from "../../components/PortfolioPhoto/PortfolioFilterPhoto";
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

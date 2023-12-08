import "./PagePortfolioGallery.scss";
import PortfolioGalleryProject from "../../components/PortfolioProject/PortfolioGalleryProject";
import PortfolioGalleryPhoto from "../../components/PortfolioPhoto/PortfolioGalleryPhoto";
import PortfolioFilterProject from "../../components/PortfolioProject/PortfolioFilterProject";
import PortfolioFilterPhoto from "../../components/PortfolioPhoto/PortfolioFilterPhoto";
import { useAppSelector } from "../../hooks/redux";

const PagePortfolioGallery = ({ page }: { page: "photo" | "project" }) => {
  const fullWithGallery = useAppSelector(
    (state) => state.baseParams.fullWithGallery
  );

  return (
    <>
      {page === "photo" ? (
        <div className="photo-page">
          <div
            className="wrapper"
            style={fullWithGallery ? { width: "80vw" } : {}}
          >
            <PortfolioFilterPhoto />
            <PortfolioGalleryPhoto />
          </div>
        </div>
      ) : (
        <div className="project-page">
          <div
            className="wrapper"
            style={fullWithGallery ? { width: "80vw" } : {}}
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

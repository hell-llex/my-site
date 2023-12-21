import { useState } from "react";
import BackgroundPortfolioPage from "../../components/BackgroundPortfolioPage";
import { useAppSelector } from "../../hooks/redux";
import { ImageInfo } from "../../types";
import "./PagePortfolio.scss";

const PagePortfolio = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const [imagesBack] = useState<ImageInfo[]>([
    dataImages.landscape.image_4,
    dataImages.landscape.image_7,
  ]);

  return (
    <>
      <div className="portfolio-page">
        <BackgroundPortfolioPage imgs={imagesBack} />
      </div>
    </>
  );
};

export default PagePortfolio;

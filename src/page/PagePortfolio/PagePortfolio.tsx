import { useState } from "react";
import BackgroundPortfolioPage from "../../components/BackgroundPortfolioPage";
import { useAppSelector } from "../../hooks/redux";
import { ImageInfo, TotalInfo } from "../../types";
import "./PagePortfolio.scss";

const PagePortfolio = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const [imagesBack] = useState<(ImageInfo | TotalInfo)[]>([
    dataImages.image_4,
    dataImages.image_7,
  ]);

  return (
    <>
      <div className="portfolio-page">
        <BackgroundPortfolioPage imgs={imagesBack} width="60vw" />
      </div>
    </>
  );
};

export default PagePortfolio;

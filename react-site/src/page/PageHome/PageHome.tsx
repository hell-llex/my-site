import { useState } from "react";
import BackgroundHomePage from "../../components/BackgroundHomePage";
import { ImageInfo } from "../../types";
import { useAppSelector } from "../../hooks/redux";
import "./PageHome.scss";

const PageHome = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const [imagesBack] = useState<ImageInfo[]>([
    dataImages.landscape.image_1,
    dataImages.landscape.image_2,
    dataImages.landscape.image_3,
    dataImages.landscape.image_4,
  ]);

  return (
    <>
      <div className="home-page">
        <BackgroundHomePage imgs={imagesBack} width="60vw" />
      </div>
    </>
  );
};

export default PageHome;

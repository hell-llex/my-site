import { useState } from "react";
import BackgroundHomePage from "../../components/BackgroundHomePage";
import { ImageInfo } from "../../types";
import { useAppSelector } from "../../hooks/redux";
import "./PageHome.scss";

const PageHome = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const [imagesBack] = useState<ImageInfo[]>([
    ...Object.values(dataImages.landscape),
  ]);

  return (
    <>
      <div className="home-page">
        <BackgroundHomePage imgs={imagesBack} />
      </div>
    </>
  );
};

export default PageHome;

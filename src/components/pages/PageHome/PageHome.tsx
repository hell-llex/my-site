import { useState } from "react";
import BackgroundHomePage from "../../BackgroundHomePage";
import { ImageInfo, TotalInfo } from "../../../types";
// import SocialLinks from "../../components/SocialLinks";
import { useAppSelector } from "../../../hooks/redux";
import "./PageHome.scss";
// import { Icon } from "@iconify/react/dist/iconify.js";

const PageHome = () => {
  const dataImages = useAppSelector((state) => state.imagesInfo);
  // const dataIcons = useAppSelector((state) => state.socialIconsInfo);
  const [imagesBack] = useState<(ImageInfo | TotalInfo)[]>([
    dataImages.image_4,
    dataImages.image_7,
    dataImages.image_2,
    dataImages.image_3,
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

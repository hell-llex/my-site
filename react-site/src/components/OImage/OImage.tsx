import { CSSProperties, useState } from "react";
import Image from "react-image-webp";
import { ImageInfo } from "../../types";
import "./OImage.scss";
import { useAppSelector } from "../../hooks/redux";

interface OImageProps {
  img: ImageInfo;
  style?: CSSProperties;
}

const OImage = ({ img, style }: OImageProps) => {
  const spareImg = useAppSelector((state) => state.imagesInfo.image_0);
  const [OImg] = useState(img ?? spareImg);

  const defaultStyle: CSSProperties = {
    height: "100%",
    objectFit: "cover",
    // width: "",
    ...style,
  };

  return (
    <>
      {
        <Image
          style={defaultStyle}
          className="optimized-image"
          src={OImg.pathJpg}
          webp={OImg.pathWebp}
          alt={OImg.description}
          // loading="lazy"
        />
      }
    </>
  );
};

export default OImage;

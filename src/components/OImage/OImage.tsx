import { useState } from "react";
import Image from "react-image-webp";
import { ImageInfo, TotalInfo } from "../../types";
import "./OImage.scss";

const OImage = ({ img }: { img: ImageInfo | TotalInfo }) => {
  // eslint-disable-next-line no-unused-vars
  const [OImg] = useState(img as ImageInfo);

  return (
    <>
      {
        <Image
          className="optimized-image"
          src={OImg.pathJpg}
          webp={OImg.pathWebp}
          alt={OImg.description}
        />
      }
    </>
  );
};

export default OImage;

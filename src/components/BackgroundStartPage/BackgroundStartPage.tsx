// import React, { useState } from "react";
import "./BackgroundStartPage.scss";
import OImage from "../OImage";
import { ImageInfo, TotalInfo } from "../../types";
import { useState, useEffect } from "react";

function BackgroundStartPage({
  imgs,
  width = "100%",
}: {
  imgs: (ImageInfo | TotalInfo)[];
  width?: string;
}) {
  const [newWidth, setNewWidth] = useState(width);

  useEffect(() => {
    setNewWidth(width);
  }, [width]);

  return (
    <div className="background_page" style={{ width: newWidth }}>
      <div className="background__images background__images_row">
        {imgs.map((img) => (
          <div className="background__image" key={img.toString()}>
            <OImage img={img} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BackgroundStartPage;

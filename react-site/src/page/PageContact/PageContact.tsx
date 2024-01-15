// import { useState } from "react";
// import SocialLinkItem from "../../components/SocialLinkItem";
// import { useAppSelector } from "../../hooks/redux";
// import { SocialLinksInfo } from "../../types";
import { Box, Typography } from "@mui/material";
import "./PageContact.scss";
// import { v4 as uuidv4 } from "uuid";

const PageContact = () => {
  // const dataIcons = useAppSelector((state) => state.socialIconsInfo);
  // const [socialLinksInfo] = useState<SocialLinksInfo>(dataIcons);
  return (
    <div className="contact-page">
      <Box>
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          My name: <br />
          Alexander Demeshchenko
        </Typography>
        <br />
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          Location: <br /> Belarus, Minsk
        </Typography>
        <br />
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          Phone number: <br /> +375(29)289-77-22
        </Typography>
        <br />
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          Email: <br /> demeshenko333@gmail.com
        </Typography>
      </Box>
      {/* <div className="contact-page__links">
        {Object.values(socialLinksInfo).map((linkItem) => (
          <SocialLinkItem
            link={linkItem}
            key={uuidv4()}
            defaultSetting={{
              defaultOpen: true,
              placement: "bottom",
              arrow: true,
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default PageContact;

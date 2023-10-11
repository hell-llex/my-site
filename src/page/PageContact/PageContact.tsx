import { useState } from "react";
import SocialLinkItem from "../../components/SocialLinkItem";
import { useAppSelector } from "../../hooks/redux";
import { SocialLinksInfo } from "../../types";
import { Box, Typography } from "@mui/material";
import "./PageContact.scss";

const PageContact = () => {
  const dataIcons = useAppSelector((state) => state.socialIconsInfo);
  const [socialLinksInfo] = useState<SocialLinksInfo>(dataIcons);
  return (
    <div className="contact-page">
      <Box>
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 4vw, 3.5rem)"}
        >
          My name: ----------- Alexander Demeshchenko
        </Typography>
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 4vw, 3.5rem)"}
        >
          Location: ------------ Belarus, Minsk
        </Typography>
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 4vw, 3.5rem)"}
        >
          Phone number: --- +375(33)3751903
        </Typography>
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 4vw, 3.5rem)"}
        >
          Email: ---------------- demeshenko333@gmail.com
        </Typography>
      </Box>
      <div className="contact-page__links">
        {Object.values(socialLinksInfo).map((linkItem) => (
          <SocialLinkItem
            link={linkItem}
            key={linkItem.name}
            defaultSetting={{
              defaultOpen: true,
              placement: "bottom",
              arrow: true,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageContact;

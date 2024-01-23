// import { useState } from "react";
// import SocialLinkItem from "../../components/SocialLinkItem";
// import { useAppSelector } from "../../hooks/redux";
// import { SocialLinksInfo } from "../../types";
import { Box, Typography } from "@mui/material";
import "./PageContact.scss";
import { useTranslation } from "react-i18next";
// import { v4 as uuidv4 } from "uuid";

const PageContact = () => {
  const { t } = useTranslation();
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
          {t("page.PageContact.title1")}: <br />
          {t("page.PageContact.textName")}
        </Typography>
        <br />
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          {t("page.PageContact.title2")}: <br />
          {t("page.PageContact.textLocation")}
        </Typography>
        <br />
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          {t("page.PageContact.title3")}: <br />
          +375(29)289-77-22{" "}
        </Typography>
        <br />
        <Typography
          variant="h2"
          fontWeight={300}
          fontSize={"clamp(2rem, 3vw, 3.5rem)"}
        >
          {t("page.PageContact.title4")}: <br />
          demeshenko333@gmail.com
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

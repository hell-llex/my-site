import { Container, Typography } from "@mui/material";
import "./PageAboutMe.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PageAboutMe = () => {
  const { t } = useTranslation();
  const [fontSize] = useState("clamp(1.4rem, 2.4vw, 2.6rem)");
  return (
    <div className="about-me-page">
      <>
        <Container>
          <Typography variant="h2" fontWeight={700} fontSize={fontSize}>
            {t("page.PageAboutMe.title1")}:
          </Typography>
          <Typography
            variant="body1"
            fontWeight={300}
            fontSize={fontSize}
            textAlign="justify"
          >
            {t("page.PageAboutMe.title2")}
            <Typography
              variant="body1"
              component={"span"}
              fontWeight={700}
              fontSize={fontSize}
              textAlign="justify"
            >
              {t("page.PageAboutMe.textName")}
            </Typography>{" "}
            {t("page.PageAboutMe.textAboutMe")}
          </Typography>
        </Container>

        <Container>
          <Typography variant="h2" fontWeight={700} fontSize={fontSize}>
            {t("page.PageAboutMe.title3")}:
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            {t("page.PageAboutMe.textSkills1")}: 9/10;
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            {t("page.PageAboutMe.textSkills2")}: 9/10;
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            {t("page.PageAboutMe.textSkills3")}: 9/10;
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            {t("page.PageAboutMe.textSkills4")}: 7±2/10;
          </Typography>
        </Container>
        <Container>
          <Typography
            variant="h2"
            fontWeight={700}
            fontSize={fontSize}
            textAlign="center"
          >
            {t("page.PageAboutMe.title4")}:
          </Typography>
          <Typography
            variant="body1"
            fontWeight={300}
            fontSize={fontSize}
            textAlign="center"
          >
            Codewars - 104; {t("page.PageAboutMe.textStat1")} - 5;{" "}
            {t("page.PageAboutMe.textStat2")}...
          </Typography>
        </Container>
      </>
    </div>
  );
};

export default PageAboutMe;

import { Container, Typography } from "@mui/material";
import "./PageAboutMe.scss";
import { useState } from "react";

const PageAboutMe = () => {
  const [fontSize] = useState("clamp(2rem, 4vw, 2.6rem)");
  return (
    <div className="about-me-page">
      <>
        <Container>
          <Typography variant="h2" fontWeight={700} fontSize={fontSize}>
            About me:
          </Typography>
          <Typography
            variant="body1"
            fontWeight={300}
            fontSize={fontSize}
            textAlign="justify"
          >
            Hi, I&apos;m{" "}
            <Typography
              variant="body1"
              component={"span"}
              fontWeight={700}
              fontSize={fontSize}
              textAlign="justify"
            >
              Alexander Demeshchenko
            </Typography>{" "}
            Highly motivated and detail-oriented Frontend Developer with a
            passion for creating user-friendly and visually appealing web
            applications. Seeking an opportunity to apply my knowledge of
            JavaScript, React, and other frontend technologies to contribute to
            the success of a dynamic IT team.
          </Typography>
        </Container>

        <Container>
          <Typography variant="h2" fontWeight={700} fontSize={fontSize}>
            Of the good skills , I can mention a couple:
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            Communication skills: 9/10;
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            Stress resistance: 9/10;
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            Modesty: 9/10;
          </Typography>
          <Typography variant="body1" fontWeight={300} fontSize={fontSize}>
            Creativity: 7±2/10;
          </Typography>
        </Container>
        <Container>
          <Typography
            variant="h2"
            fontWeight={700}
            fontSize={fontSize}
            textAlign="center"
          >
            Statistic:
          </Typography>
          <Typography
            variant="body1"
            fontWeight={300}
            fontSize={fontSize}
            textAlign="center"
          >
            Codewars - 104; Project - 5; and other...
          </Typography>
        </Container>
      </>
    </div>
  );
};

export default PageAboutMe;

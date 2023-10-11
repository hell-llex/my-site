import "./PageCv.scss";
import { Box, Button, ButtonBase, Container, styled } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ClearIcon from "@mui/icons-material/Clear";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";

const PageCv = () => {
  const [fontSize] = useState("clamp(2rem, 4vw, 3rem)");
  const imageUrl =
    "https://hell-llex.github.io/My-CV/assets/CV%20Alexander%20Demeshchenko.png";

  function preloadImage(url: string) {
    const img = new Image();
    img.src = url;
  }

  useEffect(() => {
    preloadImage(imageUrl);
  }, []);

  const downloadImage = (file: boolean) => {
    file
      ? saveAs(
          "https://hell-llex.github.io/My-CV/assets/CV%20Alexander%20Demeshchenko.png",
          "CV_Alexander_Demeshchenko.png"
        )
      : saveAs(
          "https://hell-llex.github.io/My-CV/assets/CV%20Alexander%20Demeshchenko.pdf",
          "CV_Alexander_Demeshchenko.pdf"
        );
  };
  const ImageButton = styled(ButtonBase)(() => ({
    position: "relative",
    width: "100%",
    padding: "1rem",
    borderRadius: "5px",
    "&, &": {
      outline: "none",
      "& .MuiTouchRipple-root": {
        outline: "none",
        zIndex: 3,
      },
    },
    "&, &.Mui-focusVisible": {
      outline: "none",
      "& img": {
        position: "relative",
        zIndex: 1,
        width: "100%",
        borderRadius: "5px",
      },
    },
  }));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cv-page">
      <Box className={`container-cv ${isOpen && "container-cv_open"}`}>
        <Container className="btn-img-cv">
          <ImageButton
            focusRipple
            onClick={() => {
              setTimeout(() => {
                setIsOpen(!isOpen);
              }, 0);
            }}
          >
            <img className="background__image" src={imageUrl} alt="My CV" />
          </ImageButton>
        </Container>

        <Container className="btn-container-cv" style={{ fontSize: fontSize }}>
          <Button
            className="btn-container-cv__btn-item-cv"
            startIcon={
              <ImageIcon
                style={{
                  fontSize: "inherit",
                }}
              />
            }
            size="large"
            onClick={() =>
              setTimeout(() => {
                downloadImage(true);
              }, 300)
            }
            style={{
              fontSize: "inherit",
              padding: "1rem 3rem",
              backgroundColor: "white",
              color: "black",
            }}
          >
            Download PNG
          </Button>
          <Button
            className="btn-container-cv__btn-item-cv"
            startIcon={
              <InsertDriveFileIcon
                style={{
                  fontSize: "inherit",
                }}
              />
            }
            size="large"
            onClick={() =>
              setTimeout(() => {
                downloadImage(false);
              }, 300)
            }
            style={{
              fontSize: "inherit",
              padding: "1rem 3rem",
              backgroundColor: "white",
              color: "black",
            }}
          >
            Download PDF
          </Button>
          <Button
            className="btn-container-cv__btn-item-cv"
            startIcon={
              <OpenInNewIcon
                style={{
                  fontSize: "inherit",
                }}
              />
            }
            size="large"
            onClick={() =>
              setTimeout(() => {
                window.open("https://hell-llex.github.io/My-CV/", "_blank");
              }, 300)
            }
            style={{
              fontSize: "inherit",
              padding: "1rem 3rem",
              backgroundColor: "white",
              color: "black",
            }}
          >
            Go to site
          </Button>
          <Button
            className="btn-container-cv__btn-item-cv"
            startIcon={
              <ClearIcon
                style={{
                  fontSize: "inherit",
                }}
              />
            }
            size="large"
            onClick={() =>
              setTimeout(() => {
                setIsOpen(!isOpen);
              }, 0)
            }
            style={{
              fontSize: "inherit",
              padding: "1rem 3rem",
              backgroundColor: "white",
              color: "black",
            }}
          >
            Come back
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default PageCv;

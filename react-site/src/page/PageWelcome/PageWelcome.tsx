import { useEffect, useState } from "react";
import BackgroundStartPage from "../../components/BackgroundStartPage";
import { ImageInfo } from "../../types";
import "./PageWelcome.scss";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const PageWelcome = () => {
  const navigate = useNavigate();
  const dataImages = useAppSelector((state) => state.imagesInfo);
  const [imagesBack] = useState<ImageInfo[]>(() => {
    const allImages = Object.values(dataImages.all);
    const resultArray: ImageInfo[] = [];

    for (let i = 0; i < 10 && allImages.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * allImages.length);
      const randomImage = allImages[randomIndex];
      resultArray.push(randomImage);
      allImages.splice(randomIndex, 1);
    }

    return resultArray;
  });

  const [isScrolling, setIsScrolling] = useState(false);
  const [isChangePage] = useState(false);
  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let oneRedirect = true;
  const handleScroll = (event: {
    deltaY: number;
    deltaX: number;
    preventDefault: () => void;
  }) => {
    console.log(event.deltaY);
    if (event.deltaY >= 10 && oneRedirect) {
      oneRedirect = false;
      // if (window.scrollX >= 500) {
      //   navigate("/home", { preventScrollReset: true });
      // }
      // window.scroll(window.scrollX + event.deltaY * 5, 0);
      setIsScrolling(true);
      setTimeout(() => {
        navigate("../home", { relative: "path" });
      }, 300);
      event.preventDefault();
    }
    if (event.deltaX !== 0) {
      event.preventDefault();
    }
  };

  return (
    <>
      <div
        className={`welcome-page ${isScrolling ? "welcome-page_scroll" : ""}`}
      >
        <BackgroundStartPage
          imgs={imagesBack}
          width="100vw"
          isChangePage={isChangePage}
        />
        <div className="my-info">
          <div className="my-info__container">
            <Box>
              <Typography
                variant="h2"
                fontWeight={700}
                color={"white"}
                fontSize={"clamp(2rem, 4vw, 3.5rem)"}
              >
                Hello. I am
              </Typography>
              <Typography
                variant="h1"
                fontWeight={700}
                fontSize={"clamp(2.5rem, 6vw, 6rem)"}
              >
                Alexander Demeshchenko
              </Typography>
              <Typography
                variant="h2"
                fontWeight={300}
                fontSize={"clamp(2rem, 4vw, 3.5rem)"}
              >
                &gt; Frontend deloveper
              </Typography>
              <Typography
                variant="h2"
                fontWeight={300}
                fontSize={"clamp(2rem, 4vw, 3.5rem)"}
              >
                &gt; (aka:{" "}
                <Typography
                  variant="h2"
                  component="span"
                  fontWeight={700}
                  fontSize="inherit"
                >
                  hell-llex
                </Typography>
                )
              </Typography>
            </Box>
            <Box
              marginTop="20%"
              component="div"
              sx={{
                width: "max-content",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Typography
                variant={"body1"}
                component="p"
                fontWeight={300}
                className="continue-link"
                fontSize={"clamp(2rem, 3vw, 3rem)"}
                sx={{}}
                onClick={() => {
                  setIsScrolling(true);
                  setTimeout(() => {
                    navigate("../home", { relative: "path" });
                  }, 300);
                }}
              >
                Continue
              </Typography>
              <Typography component="span" className="arrow" />
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageWelcome;

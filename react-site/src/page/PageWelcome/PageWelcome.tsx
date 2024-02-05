import React, { useEffect, useState } from "react";
import BackgroundStartPage from "../../components/BackgroundStartPage";
import { ImageInfo } from "../../types";
import "./PageWelcome.scss";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { useTranslation } from "react-i18next";

const PageWelcome = () => {
  const { t } = useTranslation();
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

  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null && startY !== null) {
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      // Проверка на вертикальный скролл
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          // Код для скролла вниз
        } else if (deltaY < 0) {
          // Код для скролла вверх
          if (deltaY < -20) {
            setTimeout(() => {
              navigate("../home", { relative: "path" });
            }, 300);
          }
        }
      } else {
        // Проверка на горизонтальный скролл
        if (deltaX > 0) {
          // Код для скролла вправо
        } else if (deltaX < 0) {
          // Код для скролла влево
        }
      }

      // Обновите начальные точки для следующего события
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    // Сбросите начальные состояния при завершении взаимодействия
    setStartX(null);
    setStartY(null);
  };

  return (
    <>
      <div
        className={`welcome-page ${isScrolling ? "welcome-page_scroll" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <BackgroundStartPage imgs={imagesBack} />
        <div className="my-info">
          <div className="my-info__container">
            <Box>
              <Typography
                variant="h2"
                fontWeight={700}
                color={"white"}
                fontSize={"clamp(1.8rem, 4vw, 3.5rem)"}
              >
                {t("page.PageWelcome.title1")}
              </Typography>
              <Typography
                variant="h1"
                fontWeight={700}
                fontSize={"clamp(2.2rem, 6vw, 6rem)"}
              >
                {/* Alexander Demeshchenko */}
                {t("page.PageWelcome.title2")}
              </Typography>
              <Typography
                variant="h2"
                fontWeight={300}
                fontSize={"clamp(1.8rem, 4vw, 3.5rem)"}
              >
                &gt; {t("page.PageWelcome.title3")}
              </Typography>
              <Typography
                variant="h2"
                fontWeight={300}
                fontSize={"clamp(1.8rem, 4vw, 3.5rem)"}
              >
                &gt; (aka:{" "}
                <Typography
                  variant="h2"
                  component="span"
                  fontWeight={700}
                  fontSize="inherit"
                >
                  {t("page.PageWelcome.title4")}
                </Typography>
                )
              </Typography>
            </Box>
            <Box component="div" className="container-link">
              <Typography
                variant={"body1"}
                component="p"
                fontWeight={300}
                className="continue-text"
                fontSize={"clamp(1.8rem, 3vw, 3rem)"}
                sx={{}}
                onClick={() => {
                  setIsScrolling(true);
                  setTimeout(() => {
                    navigate("../home", { relative: "path" });
                  }, 300);
                }}
              >
                {t("page.PageWelcome.button")}
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

import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import PageCv from "./page/PageCv";
import PageAboutMe from "./page/PageAboutMe";
import PageContact from "./page/PageContact";
import PageError404 from "./page/PageError404";
import PageHome from "./page/PageHome";
import PagePortfolio from "./page/PagePortfolio";
import PageWelcome from "./page/PageWelcome";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { useEffect } from "react";
import { updateLang } from "./store/slice/baseParamsSlice";
import { SettingWithUrl } from "./hoc/SettingWithUrl";
import { language } from "./types";
import PagePortfolioGallery from "./page/PagePortfolioGallery";

function App() {
  const thisLang = useAppSelector((state) => state.baseParams.lang);
  const dispatch = useAppDispatch();
  const newLang = (item?: language | undefined) => dispatch(updateLang(item));
  useEffect(() => {
    newLang();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/react"
          element={<Navigate to={`/react/${thisLang}`} replace />}
        />
        <Route
          path="/vue"
          element={<Navigate to={`/vue/${thisLang}`} replace />}
        />
        <Route
          path="/"
          element={<Navigate to={`/react/${thisLang}`} replace />}
        />
        <Route
          path="/:platform/:lang/*"
          element={
            <SettingWithUrl>
              <Layout />
            </SettingWithUrl>
          }
        >
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path="welcome" element={<PageWelcome />} />
          <Route path="home" element={<PageHome />} />
          <Route path="portfolio" element={<PagePortfolio />} />
          <Route
            path="portfolio/photo"
            element={<PagePortfolioGallery page="photo" />}
          />
          <Route
            path="portfolio/project"
            element={<PagePortfolioGallery page="project" />}
          />
          <Route path="contact" element={<PageContact />} />
          <Route path="about-me" element={<PageAboutMe />} />
          <Route path="cv" element={<PageCv />} />
        </Route>
        <Route path="*" element={<Navigate to="error-page-404" replace />} />
        <Route path="error-page-404" element={<PageError404 />} />
      </Routes>
    </>
  );
}

export default App;

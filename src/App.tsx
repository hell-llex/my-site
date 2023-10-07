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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path="welcome" element={<PageWelcome />} />
          <Route path="home" element={<PageHome />} />
          <Route path="portfolio/*" element={<PagePortfolio />} />
          <Route path="contact" element={<PageContact />} />
          <Route path="about-me" element={<PageAboutMe />} />
          <Route path="cv" element={<PageCv />} />
          <Route path="*" element={<Navigate to="error-page-404" replace />} />
          <Route path="error-page-404" element={<PageError404 />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

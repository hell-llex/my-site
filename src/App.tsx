import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import PageCv from "./components/pages/PageCv";
import PageAboutMe from "./components/pages/PageAboutMe";
import PageContact from "./components/pages/PageContact";
import PageError404 from "./components/pages/PageError404";
import PageHome from "./components/pages/PageHome";
import PagePortfolio from "./components/pages/PagePortfolio";
import PageWelcome from "./components/pages/PageWelcome";

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

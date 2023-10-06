import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PageAboutMe from "./pages/PageAboutMe";
import PageContact from "./pages/PageContact";
import PageError404 from "./pages/PageError404";
import PageHome from "./pages/PageHome";
import PagePortfolio from "./pages/PagePortfolio";
import PageWelcome from "./pages/PageWelcome";
import Layout from "./components/Layout";
import PageCv from "./pages/PageCv";

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

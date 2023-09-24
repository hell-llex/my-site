import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PageAboutMe from "./pages/pageAboutMe";
import PageContact from "./pages/pageContact";
import PageError404 from "./pages/pageError404";
import PageHome from "./pages/pageHome";
import PagePortfolio from "./pages/pagePortfolio";
import PageWelcome from "./pages/pageWelcome";

function App() {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path="welcome" element={<PageWelcome />} />
          <Route path="home" element={<PageHome />} />
          <Route path="portfolio" element={<PagePortfolio />} />
          <Route path="contact" element={<PageContact />} />
          <Route path="about-me" element={<PageAboutMe />} />
          <Route path="*" element={<PageError404 />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

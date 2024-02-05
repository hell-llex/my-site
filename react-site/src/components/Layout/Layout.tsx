import { useEffect, useState } from "react";
import "./Layout.scss";
import Header from "../Header";
import { Outlet, useLocation } from "react-router-dom";
import DrawerMenu from "../DrawerMenu";
import useScreenSize from "../../hooks/useScreenSize";
import DrawerMenuMobile from "../DrawerMenuMobile";

const Layout = () => {
  const location = useLocation();
  const [thisPath, setThisPath] = useState(location.pathname);
  const screenSize = useScreenSize();
  const [screenMobile, setScreenMobile] = useState(
    screenSize.width <= 768 ? true : false
  );

  useEffect(() => {
    setScreenMobile(screenSize.width <= 768 ? true : false);
  }, [screenSize]);

  useEffect(() => {
    setThisPath(location.pathname);
  }, [location]);

  return (
    <>
      {thisPath.includes("error-page-404") ||
      thisPath.includes("welcome") ? null : (
        <>
          {!screenMobile && <Header social={thisPath.includes("home")} />}
          {screenMobile ? <DrawerMenuMobile /> : <DrawerMenu />}
        </>
      )}
      <Outlet />
    </>
  );
};

export default Layout;

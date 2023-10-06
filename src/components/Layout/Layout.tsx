import { useEffect, useState } from "react";
import "./Layout.scss";
import Header from "../Header";
import { Outlet, useLocation } from "react-router-dom";
import DrawerMenu from "../DrawerMenu";

const Layout = () => {
  const location = useLocation();
  const [thisPath, setThisPath] = useState(location.pathname);

  useEffect(() => {
    setThisPath(location.pathname);
  }, [location]);

  return (
    <>
      {thisPath === "/error-page-404" || thisPath === "/welcome" ? null : (
        <>
          <Header social={thisPath === "/home"} />
          <DrawerMenu />
        </>
      )}
      <Outlet />
    </>
  );
};

export default Layout;

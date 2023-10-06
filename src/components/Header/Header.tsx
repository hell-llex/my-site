import { useState } from "react";
import { RouteInfo, SocialLinksInfo } from "../../types";
import "./Header.scss";
import Logo from "../../../public/logo.png";
// import LogoBlack from "../../../public/logo_black.png";
import SocialLinkItem from "../SocialLinkItem";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const Header = ({ social }: { social: boolean }) => {
  const dataIcons = useAppSelector((state) => state.socialIconsInfo);
  const [socialLinksInfo] = useState<SocialLinksInfo>(dataIcons);
  const [linksInfo] = useState<RouteInfo[]>([
    { path: "/home", name: "Home", otherPath: false },
    { path: "/portfolio", name: "Portfolio", otherPath: true },
    { path: "/contact", name: "Contact", otherPath: false },
    { path: "/about-me", name: "About me", otherPath: false },
    { path: "/cv", name: "My CV", otherPath: false },
  ]);

  const setActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? "link-container__nav-link_active" : "link-container__nav-link";

  return (
    <>
      <div
        className="link-container"
        style={
          !social
            ? { justifyContent: "flex-start" }
            : { justifyContent: "center" }
        }
      >
        <div className="link-container__background">
          {social && (
            <div className="link-container__social-links">
              {Object.values(socialLinksInfo).map((linkItem) => (
                <SocialLinkItem link={linkItem} key={linkItem.name} />
              ))}
            </div>
          )}
          <span className="link-container__line"></span>
          <a href="/" className="link-container__logo">
            <img src={Logo} alt="Logo" className="link-container__logo-img" />
          </a>
        </div>
        {!social && (
          <div className="link-container__nav-links">
            {Object.values(linksInfo).map((linkNav) => (
              <NavLink
                to={linkNav.path}
                key={linkNav.toString()}
                className={setActive}
              >
                <span>{linkNav.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;

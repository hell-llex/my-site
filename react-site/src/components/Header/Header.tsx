import { useState } from "react";
import { RouteInfo, SocialLinksInfo } from "../../types";
import "./Header.scss";
import Logo from "../../../public/logo.png";
import SocialLinkItem from "../SocialLinkItem";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { v4 as uuidv4 } from "uuid";

const Header = ({ social }: { social: boolean }) => {
  const dataIcons = useAppSelector((state) => state.socialIconsInfo);
  const fullWithGallery = useAppSelector(
    (state) => state.baseParams.fullWithGallery
  );
  const [socialLinksInfo] = useState<SocialLinksInfo>(dataIcons);
  const [linksInfo] = useState<RouteInfo[]>([
    { path: "home", name: "Home", otherPath: false },
    { path: "portfolio", name: "Portfolio", otherPath: true },
    { path: "contact", name: "Contact", otherPath: false },
    { path: "about-me", name: "About me", otherPath: false },
    { path: "cv", name: "My CV", otherPath: false },
  ]);
  const [otherLinksInfo] = useState<RouteInfo[]>([
    { path: "portfolio/photo", name: "Photo", otherPath: false },
    { path: "portfolio/project", name: "Project", otherPath: false },
  ]);

  const setActive = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "link-container__nav-link_active"
      : "link-container__nav-link";
  };
  const setActiveOther = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "link-container__nav-link-other_active"
      : "link-container__nav-link-other";
  };

  return (
    <>
      <div
        className="link-container"
        style={
          !social
            ? {
                justifyContent: "flex-start",
                minWidth: fullWithGallery ? "16rem" : "30rem",
              }
            : { justifyContent: "center", minWidth: "26rem" }
        }
      >
        <div className="link-container__background">
          {social && (
            <div className="link-container__social-links">
              {Object.values(socialLinksInfo).map((linkItem) => (
                <SocialLinkItem
                  link={linkItem}
                  key={uuidv4()}
                  defaultSetting={{
                    placement: "right",
                    arrow: false,
                  }}
                />
              ))}
            </div>
          )}
          <span className="link-container__line"></span>
          <a href="/" className="link-container__logo">
            <img src={Logo} alt="Logo" className="link-container__logo-img" />
          </a>
        </div>
        {!social && (
          <div
            className={`link-container__nav-links ${
              fullWithGallery ? "hidden-link" : ""
            }`}
          >
            {Object.values(linksInfo).map((linkNav) => (
              <div key={linkNav.name}>
                <div className="link-container__container-nav-link">
                  <NavLink to={linkNav.path} className={setActive}>
                    <span>{linkNav.name}</span>
                  </NavLink>
                  {linkNav.otherPath &&
                    otherLinksInfo.map((linkOtherNav) => (
                      <NavLink
                        to={linkOtherNav.path}
                        key={linkOtherNav.name}
                        className={setActiveOther}
                      >
                        <span>{linkOtherNav.name}</span>
                      </NavLink>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;

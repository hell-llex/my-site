// import React from 'react';
import { Link } from "react-router-dom";
import "./PageError404.scss";

const PageError404 = () => {
  return (
    <div className="error-404-page">
      <div className="page__404">
        <div className="_404-container">
          <div className="code-area">
            <span style={{ color: "#777", fontStyle: "italic" }}>
              {"// 404 page not found."}
            </span>
            <span>
              <span style={{ color: "#d65562" }}>if</span>
              {"(!"}
              <span style={{ fontStyle: "italic", color: "#bdbdbd" }}>
                found
              </span>
              {"){"}
            </span>
            <span>
              <span style={{ paddingLeft: 15, color: "#2796ec" }}>
                <i style={{ width: 10, display: "inline-block" }}></i>throw
              </span>
              (<span style={{ color: "#a6a61f" }}>{'"(╯°□°)╯︵ ┻━┻"'}</span>);
              <span style={{ display: "block" }}>&#125;</span>
              <span style={{ color: "#777", fontStyle: "italic" }}>
                {"//"}{" "}
                <Link to="/" className="not-found-home-link">
                  Go home!
                </Link>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageError404;

import React from "react";
import logo from "../../assets/images/logo.png";

const HeaderComponent = () => {
  return (
    <div className="header w-100 d-flex justify-content-center align-items-center">
      <div className="d-flex w-75 align-items-center position-relative">
        <img src={logo} className="logo" />
        <div className="app-name">Restaurant Waitlist</div>
      </div>
    </div>
  );
};

export const Header = React.memo(HeaderComponent);

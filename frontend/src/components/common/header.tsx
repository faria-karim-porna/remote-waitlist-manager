import React from "react";
import { LogoSVG } from "../../assets/svg/logoSvg";

const HeaderComponent = () => {
  return (
    <div className="header w-100 d-flex justify-content-center align-items-center fixed-top">
      <div className="d-flex w-75 align-items-center position-relative">
        <LogoSVG />
      </div>
    </div>
  );
};

export const Header = React.memo(HeaderComponent);
